import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { useStudy } from "../../../../contexts/StudyProvider";
import { useAI } from "../../../../contexts/AiProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function GenerateWithAI() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams();
  const { fetchFlashcards, decks } = useStudy();
  const {
    previewFlashcards,
    saveFlashcards,
    aiFlashcards,
    isLoading: aiLoading,
    error: aiError,
    setError: setAiError,
  } = useAI();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState("");
  const [count, setCount] = useState(10);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedFlashcards, setSelectedFlashcards] = useState(new Set());
  const [deckModalVisible, setDeckModalVisible] = useState(false);

  // Initialize selected flashcards when AI flashcards are generated
  useEffect(() => {
    if (aiFlashcards.length > 0) {
      const initialSelection = new Set(aiFlashcards.map((_, index) => index));
      setSelectedFlashcards(initialSelection);
    }
  }, [aiFlashcards]);

  const handleGenerate = async () => {
    setError("");
    setAiError(null);
    try {
      if (!inputText) throw new Error("Please provide a topic or text");
      Keyboard.dismiss();
      await previewFlashcards({
        topic: inputText,
        text: inputText,
        count: count,
      });
      if (aiError) throw new Error(aiError);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setError("");
      Keyboard.dismiss();
      await previewFlashcards({
        topic: inputText,
        text: inputText,
        count: count,
      });
      if (aiError) throw new Error(aiError);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveSelected = async (selectedDeckId) => {
    try {
      setIsLoading(true);
      const flashcardsToSave = aiFlashcards.filter((_, index) =>
        selectedFlashcards.has(index)
      );

      if (flashcardsToSave.length === 0) {
        throw new Error("No flashcards selected");
      }

      const savedFlashcards = await saveFlashcards(
        selectedDeckId,
        flashcardsToSave
      );
      if (!savedFlashcards) {
        throw new Error("Failed to save some flashcards");
      }
      await fetchFlashcards(selectedDeckId);
      setError(""); // Clear any existing errors
      Alert.alert("Success", "Flashcards saved successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Save flashcards error:", err);
      setError(err.message || "Failed to save flashcards. Please try again.");
    } finally {
      setIsLoading(false);
      setDeckModalVisible(false);
    }
  };

  const handleSavePress = () => {
    if (deckId) {
      // If we have a deckId, save directly to that deck
      handleSaveSelected(deckId);
    } else {
      // If no deckId, show deck selection modal
      setDeckModalVisible(true);
    }
  };

  const toggleFlashcardSelection = (index) => {
    setSelectedFlashcards((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return newSelection;
    });
  };

  const selectAllFlashcards = () => {
    const allSelected = new Set(aiFlashcards.map((_, index) => index));
    setSelectedFlashcards(allSelected);
  };

  const deselectAllFlashcards = () => {
    setSelectedFlashcards(new Set());
  };

  // For FlatList key
  const keyExtractor = (_, idx) => idx.toString();

  return (
    <View className="flex-1 bg-white">
      {error ? (
        <View className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md mb-2 mx-4">
          <Text className="text-red-700">{error}</Text>
        </View>
      ) : null}

      {/* Selection Controls */}
      {aiFlashcards.length > 0 && (
        <View className="px-4 py-2 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={selectAllFlashcards}
                className="bg-gray-100 px-3 py-1 rounded-lg">
                <Text className="text-gray-700">Select All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={deselectAllFlashcards}
                className="bg-gray-100 px-3 py-1 rounded-lg">
                <Text className="text-gray-700">Deselect All</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600">
              {selectedFlashcards.size} of {aiFlashcards.length} selected
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSavePress}
            disabled={isLoading || selectedFlashcards.size === 0}
            className={`py-2 px-4 rounded-lg flex-row items-center justify-center ${
              selectedFlashcards.size === 0 ? "bg-gray-300" : "bg-yellow-500"
            }`}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons
                  name="save"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-semibold ml-2">
                  Save Selected Flashcards
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Flashcards as chat bubbles */}
      <FlatList
        data={aiFlashcards}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        renderItem={({ item, index }) => (
          <View className="mb-4">
            <View className="flex-row items-start">
              <TouchableOpacity
                onPress={() => toggleFlashcardSelection(index)}
                className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 mt-1 ${
                  selectedFlashcards.has(index)
                    ? "bg-yellow-400 border-yellow-400"
                    : "border-gray-300"
                }`}>
                {selectedFlashcards.has(index) && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
              <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                <Text className="font-semibold text-gray-800 mb-1 text-lg">
                  Q: {item.question || "No question provided"}
                </Text>
                <Text className="text-gray-700 text-lg">
                  A: {item.answer || "No answer provided"}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="py-12 items-center">
            {aiLoading || isRegenerating ? (
              <ActivityIndicator color="#fbbf24" size="large" />
            ) : (
              <Text className="text-gray-500">
                No flashcards generated yet. Enter a topic or text and tap the
                send button.
              </Text>
            )}
          </View>
        }
      />

      {/* Input Bar (fixed at bottom) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
        className="absolute left-0 right-0 bottom-0 bg-white">
        <View className="px-4 pt-3 pb-6">
          {/* Main Input Container */}
          <View className="flex-row items-end space-x-2">
            {/* Main Input */}
            <View className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a topic or paste text"
                placeholderTextColor="#9CA3AF"
                className="text-gray-800"
                multiline
                style={{ maxHeight: 100 }}
              />

              {/* Bottom Row with Count */}
              <View className="flex-row items-center justify-end mt-2">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 mr-2">Count:</Text>
                  <TextInput
                    value={String(count)}
                    onChangeText={(v) => setCount(Number(v) || 10)}
                    keyboardType="numeric"
                    className="w-12 text-center text-gray-800 bg-white rounded-lg px-2 py-1"
                    placeholder="#"
                  />
                </View>
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={aiLoading}
              className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center shadow-lg">
              {aiLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Deck Selection Modal */}
      <Modal
        visible={deckModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeckModalVisible(false)}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[90%] max-w-md rounded-xl p-6">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              Select a deck to save
            </Text>
            {decks && decks.length > 0 ? (
              decks.map((deck) => (
                <TouchableOpacity
                  key={deck.id}
                  onPress={() => handleSaveSelected(deck.id)}
                  className="mb-2 p-3 rounded-lg bg-yellow-100">
                  <Text className="text-yellow-700 font-semibold">
                    {deck.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-gray-500 text-center py-4">
                No decks available. Please create a deck first.
              </Text>
            )}
            <TouchableOpacity
              onPress={() => setDeckModalVisible(false)}
              className="mt-4 p-2 rounded-lg bg-gray-200 items-center">
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
