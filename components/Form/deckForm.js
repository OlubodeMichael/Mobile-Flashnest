import { View, Text, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { useStudy } from "../../contexts/StudyProvider";
import Button from "../Button";

export default function DeckForm({ deck, onSuccess, onCancel }) {
  const { createDeck, updateDeck, fetchDeck } = useStudy();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Initialize form with deck data if in update mode
  useEffect(() => {
    if (deck) {
      setFormData({
        title: deck.title || "",
        description: deck.description || "",
      });
    }
  }, [deck]);

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit triggered");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      if (deck) {
        console.log("📝 Updating deck", { id: deck.id, ...formData });
        await updateDeck(deck.id, formData.title, formData.description);
        await fetchDeck(deck.id);
      } else {
        console.log("🆕 Creating deck", formData.title, formData.description);
        await createDeck(formData.title, formData.description);
      }

      onSuccess?.(); // this should call `handleSuccess`
    } catch (err) {
      console.error("❌ Error in handleSubmit:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-8">
      {/* Title Input */}
      <View className="space-y-3">
        <Text className="text-base font-semibold text-gray-800">Title</Text>
        <TextInput
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base"
          placeholder="What's your deck about?"
          placeholderTextColor="#9CA3AF"
          value={formData.title}
          onChangeText={(text) => {
            setFormData({ ...formData, title: text });
            setError("");
          }}
          maxLength={100}
        />
      </View>

      {/* Description Input */}
      <View className="space-y-3">
        <Text className="text-base font-semibold text-gray-800">
          Description
        </Text>
        <TextInput
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base min-h-[120px]"
          placeholder="Add some details about your deck..."
          placeholderTextColor="#9CA3AF"
          value={formData.description}
          onChangeText={(text) => {
            setFormData({ ...formData, description: text });
            setError("");
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-50 px-4 py-3 rounded-lg">
          <Text className="text-red-600 text-sm font-medium">{error}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View className="flex-row space-x-4 pt-2">
        {onCancel && (
          <Button
            variant="secondary"
            onPress={onCancel}
            disabled={isLoading}
            className="flex-1"
            size="lg">
            Cancel
          </Button>
        )}
        <Button
          onPress={handleSubmit}
          disabled={isLoading}
          className={onCancel ? "flex-1" : "w-full"}
          size="lg">
          {isLoading
            ? deck
              ? "Updating..."
              : "Creating..."
            : deck
            ? "Update Deck"
            : "Create Deck"}
        </Button>
      </View>
    </View>
  );
}
