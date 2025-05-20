import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AiContext = createContext();

const api_url = "http://localhost:8000/api";
const getApi = async () => {
  const token = await AsyncStorage.getItem("token");
  return axios.create({
    baseURL: api_url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const AiProvider = ({ children }) => {
  const [aiFlashcards, setAiFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const previewFlashcards = async ({ topic, text, file, count = 10 }) => {
    try {
      setIsLoading(true);
      setError(null);
      setAiFlashcards([]);

      const formData = new FormData();
      if (file) formData.append("file", file);
      if (topic) formData.append("topic", topic);
      if (text) formData.append("text", text);
      formData.append("count", count);

      const api = await getApi();
      const { data } = await api.post("/ai/preview-flashcards", formData);
      setAiFlashcards(data.flashcards);
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

      const api = await getApi();
      const { data } = await api.post(`/decks/${deckId}/flashcards/bulk`, {
        flashcards: aiFlashcards,
      });

      if (data.status === "success") {
        console.log("✅ Flashcards saved:", data.data.flashcards);
        setAiFlashcards([]);
        return data.data.flashcards;
      } else {
        console.error("❌ Error saving flashcards:", data.message);
        setError(data.message);
        return null;
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

export { AiProvider };
export const useAI = () => useContext(AiContext);
