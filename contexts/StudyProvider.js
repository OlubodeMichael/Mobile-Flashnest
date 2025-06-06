import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "flashnest-backend/authHelper";
import {
  getDecks as fetchDecksHelper,
  getDeck as fetchDeckHelper,
  createDeck as createDeckHelper,
  updateDeck as updateDeckHelper,
  deleteDeck as deleteDeckHelper,
  createFlashcard as createFlashcardHelper,
  getFlashcards as getFlashcardsHelper,
} from "flashnest-backend/studyHelper";

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState(null); // current selected deck
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await getCurrentUser();
      const response = await fetchDecksHelper(user.id);
      setDecks(response);
    } catch (err) {
      setError(err.message || "Failed to fetch decks");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeck = async (deckId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchDeckHelper(deckId);
      setDeck(response);
    } catch (err) {
      setError(err.message || "Failed to fetch deck");
    } finally {
      setIsLoading(false);
    }
  };

  const createDeck = async (title, description) => {
    const user = await getCurrentUser();
    try {
      setIsLoading(true);
      const response = await createDeckHelper(user.id, title, description);
      setDecks((prev) => [...prev, response]);
    } catch (err) {
      setError(err.message || "Failed to create deck");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeck = async (deckId, title, description) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateDeckHelper(deckId, title, description);
      setDecks((prev) =>
        prev.map((deck) =>
          deck?.id === deckId ? { ...deck, ...response } : deck
        )
      );
      setDeck((prev) =>
        prev?.id === deckId ? { ...prev, ...response } : prev
      );
      return response;
    } catch (err) {
      setError(err.message || "Failed to update deck");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (deckId) => {
    await deleteDeckHelper(deckId);
    setDecks((prev) => prev.filter((deck) => deck?.id !== deckId));
  };

  const fetchFlashcards = async (deckId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getFlashcardsHelper(deckId);
      setFlashcards(response);
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch flashcards");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createFlashcard = async (deckId, question, answer) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await getCurrentUser();
      await createFlashcardHelper(user.id, deckId, question, answer);

      // No manual setFlashcards here!
      setDeck((prev) =>
        prev
          ? { ...prev, flashcards_count: (prev.flashcards_count || 0) + 1 }
          : null
      );
    } catch (err) {
      setError(err.message || "Failed to create flashcard");
      throw err;
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
      }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => useContext(StudyContext);
