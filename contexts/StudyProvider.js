import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const StudyContext = createContext();

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

export const StudyProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState(null); // optional: current selected deck
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const api = await getApi();
      const response = await api.get("/decks");
      setDecks(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeck = async (id) => {
    try {
      setIsLoading(true);
      const api = await getApi();
      const response = await api.get(`/decks/${id}`);

      setDeck(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createDeck = async (deck) => {
    try {
      const api = await getApi();
      const response = await api.post("/decks", deck);

      setDecks([...decks, response.data.data]);
      setDeck(response.data.data);
      await fetchDecks();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeck = async (id, deck) => {
    try {
      const api = await getApi();
      const response = await api.patch(`/decks/${id}`, deck);

      setDecks(decks.map((d) => (d.id === id ? response.data.data : d)));
      setDeck(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (id) => {
    try {
      const api = await getApi();
      const response = await api.delete(`/decks/${id}`);

      setDecks(decks.filter((d) => d.id !== id));
      setDeck(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFlashcards = async (id) => {
    try {
      const api = await getApi();
      const response = await api.get(`/decks/${id}/flashcards`);

      setFlashcards(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createFlashcard = async (id, flashcard) => {
    try {
      const api = await getApi();
      const response = await api.post(`/decks/${id}/flashcards`, flashcard);

      setFlashcards([...flashcards, response.data.data]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFlashcard = async (id, flashcard) => {
    try {
      const api = await getApi();
      const response = await api.patch(
        `/decks/${id}/flashcards/${flashcard.id}`,
        flashcard
      );

      setFlashcards(
        flashcards.map((f) => (f.id === flashcard.id ? response.data.data : f))
      );
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFlashcard = async (id, flashcard) => {
    try {
      const api = await getApi();
      const response = await api.delete(
        `/decks/${id}/flashcards/${flashcard.id}`
      );

      setFlashcards(flashcards.filter((f) => f.id !== flashcard.id));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        decks,
        deck,
        flashcards,
        isLoading,
        error,
        fetchDecks,
        fetchDeck,
        createDeck,
        updateDeck,
        deleteDeck,
        fetchFlashcards,
        createFlashcard,
        updateFlashcard,
        deleteFlashcard,
      }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);
