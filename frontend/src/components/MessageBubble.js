import { View, Text, StyleSheet } from "react-native";

export default function MessageBubble({ message, isSent }) {
  return (
    <View style={[styles.wrapper, isSent ? styles.right : styles.left]}>
      <View style={[styles.bubble, isSent ? styles.sent : styles.received]}>
        <Text style={[styles.text, isSent ? styles.sentText : styles.receivedText]}>
          {message.body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8, width: "100%" },
  left: { alignItems: "flex-start" },
  right: { alignItems: "flex-end" },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  sent: { backgroundColor: "#2563eb", borderBottomRightRadius: 4 },
  received: { backgroundColor: "#e5e7eb", borderBottomLeftRadius: 4 },
  text: { fontSize: 15, lineHeight: 20 },
  sentText: { color: "#ffffff" },
  receivedText: { color: "#111827" },
});
