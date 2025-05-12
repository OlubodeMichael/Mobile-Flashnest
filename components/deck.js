import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Deck({ deck, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{deck.title}</Text>
          {deck.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{deck.category}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardCountContainer}>
          <Text style={styles.cardCountText}>
            {deck.flashcards?.length || 0} cards
          </Text>
        </View>
      </View>

      {deck.description && (
        <Text style={styles.description} numberOfLines={2}>
          {deck.description}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.createdLabel}>Created</Text>
        <Text style={styles.createdDate}>
          {new Date(deck.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  categoryContainer: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
  },
  cardCountContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCountText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  createdLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  createdDate: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
});
