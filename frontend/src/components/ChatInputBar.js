import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ChatInputBar({ onSend }) {
  const [value, setValue] = useState("");

  const send = () => {
    const text = value.trim();
    if (!text) {
      return;
    }
    onSend(text);
    setValue("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={value}
        onChangeText={setValue}
      />
      <TouchableOpacity style={styles.button} onPress={send}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
