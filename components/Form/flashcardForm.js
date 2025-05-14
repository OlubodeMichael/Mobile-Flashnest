import { useState, useEffect } from "react";
import { useStudy } from "../../contexts/StudyProvider";
import { View, Text, TextInput } from "react-native";
import Button from "../Button";

export default function FlashcardForm({
  flashcard,
  onSuccess,
  onCancel,
  deckId,
}) {
  const { createFlashcard, updateFlashcard } = useStudy();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    deckId: deckId || "",
  });

  // Populate form with flashcard data if editing
  useEffect(() => {
    if (flashcard) {
      setFormData({
        question: flashcard.question || "",
        answer: flashcard.answer || "",
        deckId: flashcard.deckId || deckId || "",
      });
    } else if (deckId) {
      setFormData((prev) => ({
        ...prev,
        deckId: deckId,
      }));
    }
  }, [flashcard, deckId]);

  const handleSubmit = async () => {
    if (!formData.question.trim()) {
      setError("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      setError("Answer is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const flashcardData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        deckId: formData.deckId,
      };

      if (flashcard) {
        await updateFlashcard(formData.deckId, flashcard._id, flashcardData);
      } else {
        await createFlashcard(formData.deckId, flashcardData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-6">
      {/* Question Input */}
      <View className="space-y-2">
        <Text className="text-base font-semibold text-gray-800">Question</Text>
        <TextInput
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base min-h-[120px]"
          placeholder="What's your question?"
          placeholderTextColor="#9CA3AF"
          value={formData.question}
          onChangeText={(text) => {
            setFormData({ ...formData, question: text });
            setError("");
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Answer Input */}
      <View className="space-y-2">
        <Text className="text-base font-semibold text-gray-800">Answer</Text>
        <TextInput
          className="bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-base min-h-[120px]"
          placeholder="What's the answer?"
          placeholderTextColor="#9CA3AF"
          value={formData.answer}
          onChangeText={(text) => {
            setFormData({ ...formData, answer: text });
            setError("");
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Error Message */}
      {error ? (
        <View className="bg-red-50 px-4 py-3 rounded-lg">
          <Text className="text-red-600 text-sm font-medium">{error}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
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
            ? flashcard
              ? "Updating..."
              : "Creating..."
            : flashcard
            ? "Update Flashcard"
            : "Create Flashcard"}
        </Button>
      </View>
    </View>
  );
}
