import React, { createContext, useContext, useState } from "react";
import FlashcardService from "../service/flashcardGenerator";
import { useAddBulkFlashcards } from "../hooks/flashcards/useFlashcards";
import * as FileSystem from "expo-file-system";

const AiContext = createContext();

const AiProvider = ({ children }) => {
  const [aiFlashcards, setAiFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addBulkFlashcardsMutation = useAddBulkFlashcards();

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

      // If there's a file, try to read it
      if (file) {
        console.log("Processing file:", {
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          uri: file.uri,
        });

        try {
          console.log("Attempting to read file as text...");
          const fileContent = await FileSystem.readAsStringAsync(file.uri);
          console.log("File content length:", fileContent.length);
          console.log("File content preview:", fileContent.substring(0, 200));

          // Check if the content looks like readable text
          if (fileContent.length > 0 && !fileContent.includes("\x00")) {
            options.fileContent = fileContent;
            options.fileType = file.mimeType;
            console.log("Successfully read file as text");
            console.log("Options after file reading:", {
              count: options.count,
              topic: options.topic,
              text: options.text,
              fileContentLength: options.fileContent?.length,
              fileType: options.fileType,
            });
          } else {
            throw new Error("File appears to be binary or empty");
          }
        } catch (err) {
          console.error("File reading error:", err);

          // Provide helpful error message based on file type
          if (file.mimeType === "application/pdf") {
            throw new Error(
              "PDF files cannot be read directly. Please copy the text content and paste it here, or convert the PDF to a text file."
            );
          } else if (
            file.mimeType.includes("wordprocessingml.document") ||
            file.mimeType.includes("docx")
          ) {
            throw new Error(
              "DOCX files cannot be read directly. Please copy the text content and paste it here, or convert the document to a text file."
            );
          } else if (file.mimeType.includes("image/")) {
            throw new Error(
              "Image files cannot be processed. Please copy the text content and paste it here."
            );
          } else {
            throw new Error(
              "This file type cannot be read. Please copy the text content and paste it here, or use a text file."
            );
          }
        }
      }

      const flashcards = await FlashcardService.generateFlashcards(options);

      setAiFlashcards(flashcards);
    } catch (err) {
      console.error("previewFlashcards error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async (deckId, flashcardsToSave) => {
    try {
      setIsLoading(true);
      setError(null);

      const savedFlashcards = await addBulkFlashcardsMutation.mutateAsync({
        deckId,
        flashcards: flashcardsToSave || aiFlashcards,
      });

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
