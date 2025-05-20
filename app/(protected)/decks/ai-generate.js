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

  const handleSaveFlashcard = async (flashcard) => {
    try {
      await createFlashcard(selectedDeckId, {
        ...flashcard,
        deckId: selectedDeckId,
      });
      await fetchDecks();
    } catch (err) {
      setError("Failed to save flashcard. Please try again.");
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsLoading(true);
      const savedFlashcards = await saveFlashcards(selectedDeckId);
      if (!savedFlashcards)
        setError("Failed to save some flashcards. Please try again.");
      await fetchDecks();
    } catch (err) {
      setError("Failed to save flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

      {/* Flashcards as chat bubbles */}
      <FlatList
        data={aiFlashcards}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View className="mb-4">
            <View className="self-start bg-gray-100 rounded-2xl px-4 py-2 max-w-[80%]">
              <Text className="font-semibold text-gray-800 mb-1">
                Q: {item.question}
              </Text>
              <Text className="text-gray-700">A: {item.answer}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleSaveFlashcard(item)}
              className="self-end mt-2 px-3 py-1 rounded-md bg-yellow-500">
              <Text className="text-white font-semibold">Save</Text>
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
        className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center space-x-2">
          {/* File Upload */}
          <TouchableOpacity
            onPress={handleFilePick}
            className="w-10 h-10 bg-yellow-100 rounded-lg items-center justify-center">
            <Ionicons name="add" size={24} color="#fbbf24" />
          </TouchableOpacity>
          {/* Main Input */}
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a topic or paste text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-white"
            multiline
          />
          {/* Count Input */}
          <TextInput
            value={String(count)}
            onChangeText={(v) => setCount(Number(v) || 10)}
            keyboardType="numeric"
            className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-gray-800 bg-white"
            placeholder="#"
          />
          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={aiLoading}
            className="ml-2 w-10 h-10 bg-yellow-400 rounded-full items-center justify-center">
            {aiLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="send" size={22} color="white" />
            )}
          </TouchableOpacity>
        </View>
        {/* File name preview */}
        {file && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="document-outline" size={18} color="#fbbf24" />
            <Text className="ml-2 text-xs text-gray-600">
              {file.name || file.uri.split("/").pop()}
            </Text>
            <TouchableOpacity onPress={() => setFile(null)}>
              <Ionicons
                name="close"
                size={18}
                color="#ef4444"
                className="ml-1"
              />
            </TouchableOpacity>
          </View>
        )}
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
            {decks?.decks?.map((deck) => (
              <TouchableOpacity
                key={deck._id}
                onPress={() => handleDeckSelect(deck._id)}
                className="mb-2 p-3 rounded-lg bg-yellow-100">
                <Text className="text-yellow-700 font-semibold">
                  {deck.title}
                </Text>
              </TouchableOpacity>
            ))}
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
