import React, { createContext, useContext, useState } from "react";
import { getCurrentUser } from "flashnest-backend/authHelper";
import {
  getDecks as fetchDecksHelper,
  getDeck as fetchDeckHelper,
  createDeck as createDeckHelper,
  updateDeck as updateDeckHelper,
  deleteDeck as deleteDeckHelper,
  createFlashcard as createFlashcardHelper,
  getFlashcards as getFlashcardsHelper,
  updateFlashcard as updateFlashcardHelper,
  deleteFlashcard as deleteFlashcardHelper,
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
    setDeck(null); // Clear current deck first
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchDeckHelper(deckId);
      setDeck(response);
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch deck");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createDeck = async (title, description) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await getCurrentUser();
      const response = await createDeckHelper(user.id, title, description);
      await fetchDecks(); // Refresh decks list
      return response;
    } catch (err) {
      setError(err.message || "Failed to create deck");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeck = async (deckId, title, description) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateDeckHelper(deckId, title, description);
      await fetchDecks(); // Refresh decks list
      return response;
    } catch (err) {
      setError(err.message || "Failed to update deck");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (deckId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteDeckHelper(deckId);
      await fetchDecks(); // Refresh decks list
    } catch (err) {
      setError(err.message || "Failed to delete deck");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFlashcards = async (deckId) => {
    setFlashcards([]); // Clear flashcards first
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
      await fetchFlashcards(deckId); // Refresh flashcards list
    } catch (err) {
      setError(err.message || "Failed to create flashcard");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFlashcard = async (deckId, flashcardId, question, answer) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateFlashcardHelper(deckId, flashcardId, question, answer);
      await fetchFlashcards(deckId); // Refresh flashcards list
    } catch (err) {
      setError(err.message || "Failed to update flashcard");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFlashcard = async (flashcardId, deckId) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteFlashcardHelper(flashcardId, deckId);
      await fetchFlashcards(deckId); // Refresh flashcards list
    } catch (err) {
      setError(err.message || "Failed to delete flashcard");
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
        setDeck,
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

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
};
