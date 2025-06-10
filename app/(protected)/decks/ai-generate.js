import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useState, useLayoutEffect, useRef } from "react";
import { useStudy } from "../../../contexts/StudyProvider";
import { useAI } from "../../../contexts/AiProvider";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "expo-router";
import { createFlashcard } from "flashnest-backend/studyHelper";

export default function GenerateWithAI() {
  const navigation = useNavigation();
  const { decks, fetchDecks, createFlashcard } = useStudy();
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
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [count, setCount] = useState(10);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [deckModalVisible, setDeckModalVisible] = useState(false);
  const [singleSaveModalVisible, setSingleSaveModalVisible] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [savedFlashcardIds, setSavedFlashcardIds] = useState(new Set());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "AI Generation",
      headerBackTitle: "back",
    });
  }, [navigation]);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
    if (result.type === "success") {
      setFile(result);
    }
  };

  const handleGenerate = async () => {
    setError("");
    setAiError(null);
    try {
      if (!inputText && !file)
        throw new Error("Please provide a topic, text, or file");
      //if (!selectedDeckId) throw new Error("Please select a deck");
      await previewFlashcards({
        topic: inputText,
        text: inputText,
        file: file,
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
      await previewFlashcards({
        topic: inputText,
        text: inputText,
        file: file,
        count: count,
      });
      if (aiError) throw new Error(aiError);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveSingleFlashcard = async (flashcard) => {
    setSelectedFlashcard(flashcard);
    setSingleSaveModalVisible(true);
  };

  const handleSingleDeckSelect = async (deckId) => {
    try {
      setIsLoading(true);

      // Validate flashcard data
      if (
        !selectedFlashcard ||
        !selectedFlashcard.question ||
        !selectedFlashcard.answer
      ) {
        throw new Error(
          "Invalid flashcard data. Question and answer are required."
        );
      }

      // Ensure we have all required fields with proper values
      const flashcardData = {
        question: selectedFlashcard.question.trim(),
        answer: selectedFlashcard.answer.trim(),
        deckId: deckId,
      };

      // Additional validation
      if (!flashcardData.question || !flashcardData.answer) {
        throw new Error("Question and answer cannot be empty");
      }

      const savedFlashcard = await createFlashcard(deckId, flashcardData);

      if (savedFlashcard) {
        setSavedFlashcardIds(
          (prev) => new Set([...prev, selectedFlashcard.id])
        );
        await fetchDecks();
        setError(""); // Clear any existing errors
      } else {
        throw new Error("Failed to save flashcard");
      }
    } catch (err) {
      console.error("Save flashcard error:", err);
      setError(err.message || "Failed to save flashcard. Please try again.");
    } finally {
      setIsLoading(false);
      setSingleSaveModalVisible(false);
      setSelectedFlashcard(null);
    }
  };

  const handleSaveAll = async () => {
    if (!selectedDeckId) {
      setDeckModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      const savedFlashcards = await saveFlashcards(selectedDeckId);
      if (!savedFlashcards) {
        throw new Error("Failed to save some flashcards");
      }
      await fetchDecks();
      setError(""); // Clear any existing errors
    } catch (err) {
      console.error("Save all flashcards error:", err);
      setError(err.message || "Failed to save flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeckSelect = (deckId) => {
    setSelectedDeckId(deckId);
    setDeckModalVisible(false);
    handleSaveAll();
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

      {/* Save All Button */}
      {aiFlashcards.length > 0 && (
        <View className="px-4 py-2 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => setDeckModalVisible(true)}
            disabled={isLoading}
            className="bg-yellow-500 py-2 px-4 rounded-lg flex-row items-center justify-center">
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
                  Save All Flashcards
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
        renderItem={({ item }) => (
          <View className="mb-4">
            <View className="self-start bg-gray-100 rounded-2xl px-4 py-2 max-w-[80%]">
              <Text className="font-semibold text-gray-800 mb-1">
                Q: {item.question || "No question provided"}
              </Text>
              <Text className="text-gray-700">
                A: {item.answer || "No answer provided"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleSaveSingleFlashcard(item)}
              disabled={
                savedFlashcardIds.has(item.id) || !item.question || !item.answer
              }
              className={`self-end mt-2 px-3 py-1 rounded-md ${
                savedFlashcardIds.has(item.id) || !item.question || !item.answer
                  ? "bg-gray-300"
                  : "bg-yellow-500"
              }`}>
              <Text className="text-white font-semibold">
                {savedFlashcardIds.has(item.id) ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
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
                className="text-gray-800"
                multiline
                style={{ maxHeight: 100 }}
              />

              {/* Bottom Row with File and Count */}
              <View className="flex-row items-center justify-between mt-2">
                <TouchableOpacity
                  onPress={handleFilePick}
                  className="flex-row items-center">
                  <Ionicons name="attach" size={20} color="#9ca3af" />
                  <Text className="ml-1 text-sm text-gray-500">Attach</Text>
                </TouchableOpacity>

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

          {/* File Preview */}
          {file && (
            <View className="mt-3 flex-row items-center bg-indigo-50 rounded-xl px-3 py-2 self-start">
              <Ionicons name="document-text" size={18} color="#6366f1" />
              <Text
                className="ml-2 text-sm text-indigo-700 flex-1"
                numberOfLines={1}>
                {file.name || file.uri.split("/").pop()}
              </Text>
              <TouchableOpacity
                onPress={() => setFile(null)}
                className="ml-2 p-1">
                <Ionicons name="close" size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}
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
                  onPress={() => handleDeckSelect(deck.id)}
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

      {/* Single Flashcard Save Modal */}
      <Modal
        visible={singleSaveModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSingleSaveModalVisible(false)}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[90%] max-w-md rounded-xl p-6">
            <Text className="text-lg font-bold mb-4 text-gray-800">
              Select a deck to save this flashcard
            </Text>
            {decks && decks.length > 0 ? (
              decks.map((deck) => (
                <TouchableOpacity
                  key={deck.id}
                  onPress={() => handleSingleDeckSelect(deck.id)}
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
              onPress={() => {
                setSingleSaveModalVisible(false);
                setSelectedFlashcard(null);
              }}
              className="mt-4 p-2 rounded-lg bg-gray-200 items-center">
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
