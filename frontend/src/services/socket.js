import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

let socketInstance = null;

export function connectSocket(token) {
  if (socketInstance) {
    socketInstance.disconnect();
  }

  socketInstance = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  return socketInstance;
}

export function getSocket() {
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
