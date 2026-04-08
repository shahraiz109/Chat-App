import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getMessages, getUsers } from "../services/api";
import { getSocket } from "../services/socket";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      setUsers([]);
      setOnlineUserIds([]);
      setActiveUser(null);
      setMessagesByUser({});
      return;
    }

    let mounted = true;

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const data = await getUsers(token);
        if (!mounted) {
          return;
        }
        setUsers(data);
        setActiveUser((prev) => prev || data[0] || null);
      } finally {
        if (mounted) {
          setLoadingUsers(false);
        }
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [token, user]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) {
      return;
    }

    const onReceiveMessage = (message) => {
      const otherUserId =
        Number(message.sender_id) === Number(user.id)
          ? Number(message.receiver_id)
          : Number(message.sender_id);

      setMessagesByUser((prev) => {
        const existing = prev[otherUserId] || [];
        return {
          ...prev,
          [otherUserId]: [...existing, message],
        };
      });
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("onlineUsers", setOnlineUserIds);
    return () => {
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("onlineUsers", setOnlineUserIds);
    };
  }, [user]);

  const loadMessagesForUser = async (targetUser) => {
    if (!token || !targetUser) {
      return;
    }
    const targetId = Number(targetUser.id);
    setActiveUser(targetUser);
    if (messagesByUser[targetId]) {
      return;
    }
    setLoadingMessages(true);
    try {
      const data = await getMessages(token, targetId);
      setMessagesByUser((prev) => ({ ...prev, [targetId]: data }));
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = (body) => {
    const socket = getSocket();
    if (!socket || !activeUser || !body.trim()) {
      return;
    }
    socket.emit("sendMessage", {
      receiverId: activeUser.id,
      body,
    });
  };

  const messages = useMemo(() => {
    if (!activeUser) {
      return [];
    }
    return messagesByUser[Number(activeUser.id)] || [];
  }, [activeUser, messagesByUser]);

  const value = useMemo(
    () => ({
      users,
      onlineUserIds,
      activeUser,
      messages,
      loadingUsers,
      loadingMessages,
      loadMessagesForUser,
      sendMessage,
    }),
    [users, onlineUserIds, activeUser, messages, loadingUsers, loadingMessages]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
