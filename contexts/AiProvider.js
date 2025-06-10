import React, { createContext, useContext, useState } from "react";
import FlashcardService from "../service/flashcardGenerator";
import { getCurrentUser } from "flashnest-backend/authHelper";
import { addBulkFlashcards } from "flashnest-backend/studyHelper";

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

      // If there's a file, add it to the options
      if (file) {
        options.fileBuffer = file;
        options.fileType = file.type;
      }

      const flashcards = await FlashcardService.generateFlashcards(options);
      setAiFlashcards(flashcards);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async (deckId) => {
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
        aiFlashcards
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
        setAiFlashcards,
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

export { AiProvider };
export const useAI = () => useContext(AiContext);
