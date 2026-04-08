import { FlatList, TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function UserList({ users, activeUser, onSelectUser, onlineUserIds }) {
  const onlineUsers = users.filter((item) => onlineUserIds.includes(Number(item.id)));

  return (
    <FlatList
      data={onlineUsers}
      keyExtractor={(item) => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const active = Number(activeUser?.id) === Number(item.id);
        return (
          <TouchableOpacity
            onPress={() => onSelectUser(item)}
            style={[styles.item, active ? styles.activeItem : null]}
          >
            <View style={styles.row}>
              <Text style={[styles.label, active ? styles.activeLabel : null]} numberOfLines={1}>
                {item.name || item.email}
              </Text>
              {onlineUserIds.includes(Number(item.id)) ? <View style={styles.onlineDot} /> : null}
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No online users right now</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  item: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 220,
  },
  activeItem: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },
  label: { color: "#111827", fontWeight: "500" },
  activeLabel: { color: "#1d4ed8" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16a34a",
  },
  emptyWrap: { paddingHorizontal: 6, justifyContent: "center" },
  emptyText: { color: "#6b7280" },
});
