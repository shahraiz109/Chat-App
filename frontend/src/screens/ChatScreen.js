import { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import UserList from "../components/UserList";
import MessageBubble from "../components/MessageBubble";
import ChatInputBar from "../components/ChatInputBar";

export default function ChatScreen() {
  const { user, logout } = useAuth();
  const {
    users,
    onlineUserIds,
    activeUser,
    messages,
    loadingUsers,
    loadingMessages,
    loadMessagesForUser,
    sendMessage,
  } = useChat();

  useEffect(() => {
    if (users.length > 0 && !activeUser) {
      loadMessagesForUser(users[0]);
    }
  }, [users, activeUser]);

  useEffect(() => {
    if (activeUser) {
      loadMessagesForUser(activeUser);
    }
  }, [activeUser?.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.subtitle}>{user?.name || user?.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userRow}>
        {loadingUsers ? (
          <Text style={styles.info}>Loading users...</Text>
        ) : (
          <UserList
            users={users}
            activeUser={activeUser}
            onSelectUser={loadMessagesForUser}
            onlineUserIds={onlineUserIds}
          />
        )}
      </View>

      <View style={styles.chatWrap}>
        {!activeUser ? (
          <View style={styles.center}>
            <Text style={styles.info}>No conversation available</Text>
          </View>
        ) : loadingMessages ? (
          <View style={styles.center}>
            <Text style={styles.info}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => (
              <MessageBubble message={item} isSent={Number(item.sender_id) === Number(user.id)} />
            )}
          />
        )}
      </View>

      <ChatInputBar onSend={sendMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6b7280", marginTop: 2 },
  logout: { color: "#dc2626", fontWeight: "600" },
  userRow: {
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    minHeight: 60,
    justifyContent: "center",
  },
  chatWrap: { flex: 1 },
  messageList: { paddingHorizontal: 12, paddingVertical: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  info: { color: "#6b7280" },
});
