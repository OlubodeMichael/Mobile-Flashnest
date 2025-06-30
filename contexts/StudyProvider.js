import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "flashnest-backend/authHelper";
import {
  createFlashcard as createFlashcardHelper,
  getFlashcards as getFlashcardsHelper,
  updateFlashcard as updateFlashcardHelper,
  deleteFlashcard as deleteFlashcardHelper,
} from "flashnest-backend/studyHelper";
import {
  useDecks,
  useDeck,
  useCreateDeck,
  useUpdateDeck,
  useDeleteDeck,
} from "../hooks/decks/useDeck";
import {
  useFlashcards,
  useCreateFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
} from "../hooks/flashcards/useFlashcards";
import { useQueryClient } from "@tanstack/react-query";

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const createDeckMutation = useCreateDeck();
  const updateDeckMutation = useUpdateDeck();
  const deleteDeckMutation = useDeleteDeck();
  const createFlashcardMutation = useCreateFlashcard();
  const updateFlashcardMutation = useUpdateFlashcard();
  const deleteFlashcardMutation = useDeleteFlashcard();
  const {
    data: decks,
    isLoading: isLoadingDecks,
    error: errorDecks,
  } = useDecks();
  const [deckId, setDeckId] = useState(null);
  const {
    data: deck,
    isLoading: isLoadingDeck,
    error: errorDeck,
  } = useDeck(deckId);

  const {
    data: flashcards,
    isLoading: isLoadingFlashcards,
    error: errorFlashcards,
  } = useFlashcards(deckId);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error when deckId changes
  useEffect(() => {
    setError(null);
  }, [deckId]);

  const fetchDeck = async (newDeckId) => {
    if (newDeckId !== deckId) {
      setDeckId(newDeckId);
    }
  };

  const fetchFlashcards = async (newDeckId) => {
    console.log(
      "🔄 StudyProvider: Setting deckId for flashcards from",
      deckId,
      "to",
      newDeckId
    );
    if (newDeckId !== deckId) {
      setDeckId(newDeckId);
    }
  };

  const createDeck = async (title, description) => {
    return createDeckMutation.mutateAsync({ title, description });
  };

  const updateDeck = async (deckId, title, description) => {
    return updateDeckMutation.mutateAsync({ deckId, title, description });
  };

  const deleteDeck = async (deckId) => {
    return deleteDeckMutation.mutateAsync({ deckId });
  };

  const createFlashcard = async (deckId, question, answer) => {
    return createFlashcardMutation.mutateAsync({ deckId, question, answer });
  };

  const updateFlashcard = async (deckId, flashcardId, question, answer) => {
    return updateFlashcardMutation.mutateAsync({
      deckId,
      flashcardId,
      question,
      answer,
    });
  };

  const deleteFlashcard = async (flashcardId, deckId) => {
    return deleteFlashcardMutation.mutateAsync({ deckId, flashcardId });
  };

  return (
    <StudyContext.Provider
      value={{
        decks,
        deck,
        flashcards,
        deckId, // Expose deckId for debugging
        isLoading: isLoadingDecks || isLoadingDeck || isLoadingFlashcards,
        error: errorDecks || errorDeck || errorFlashcards,
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
