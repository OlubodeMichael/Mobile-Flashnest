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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with flashcard data if editing
  useEffect(() => {
    if (flashcard) {
      setFormData({
        question: flashcard.question || "",
        answer: flashcard.answer || "",
      });
    }
  }, [flashcard]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.question.trim()) {
      setError("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      setError("Answer is required");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError("");

    try {
      const flashcardData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };

      if (flashcard) {
        await updateFlashcard(deckId, flashcard._id, flashcardData);
      } else {
        await createFlashcard(deckId, flashcardData);
      }
      onSuccess?.(flashcardData);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <View className="space-y-8">
      {/* Question Input */}
      <View className="space-y-3">
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
      <View className="space-y-3">
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
      <View className="flex-row space-x-4 pt-2">
        {onCancel && (
          <Button
            variant="secondary"
            onPress={onCancel}
            disabled={isLoading || isSubmitting}
            className="flex-1"
            size="lg">
            Cancel
          </Button>
        )}
        <Button
          onPress={handleSubmit}
          disabled={isLoading || isSubmitting}
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
