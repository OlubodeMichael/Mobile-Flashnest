import React, { createContext, useContext, useState } from "react";
import FlashcardService from "../service/flashcardGenerator";
import { getCurrentUser } from "flashnest-backend/authHelper";
import { addBulkFlashcards } from "flashnest-backend/studyHelper";
import * as FileSystem from "expo-file-system";

const AiContext = createContext();

const AiProvider = ({ children }) => {
  const [aiFlashcards, setAiFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const previewFlashcards = async ({ topic, text, file, count = 10 }) => {
    try {
      setIsLoading(true);
      setError(null);
      setAiFlashcards([]);

      const options = {
        count,
        topic,
        text,
      };

      // If there's a file, read its content
      if (file) {
        try {
          const fileContent = await FileSystem.readAsStringAsync(file.uri);
          options.fileContent = fileContent;
          options.fileType = file.mimeType;
        } catch (err) {
          throw new Error("Failed to read file content");
        }
      }

      const flashcards = await FlashcardService.generateFlashcards(options);
      setAiFlashcards(flashcards);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async (deckId, flashcardsToSave) => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const savedFlashcards = await addBulkFlashcards(
        user.id,
        deckId,
        flashcardsToSave || aiFlashcards
      );

      if (savedFlashcards) {
        setAiFlashcards([]);
        return savedFlashcards;
      } else {
        throw new Error("Failed to save flashcards");
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AiContext.Provider
      value={{
        aiFlashcards,
        isLoading,
        error,
        setError,
        previewFlashcards,
        saveFlashcards,
      }}>
      {children}
    </AiContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAI must be used within an AiProvider");
  }
  return context;
};

export default AiProvider;
