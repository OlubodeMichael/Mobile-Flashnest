import React, { createContext, useContext, useState } from "react";
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

  const fetchDecks = async () => {
    console.log("fetchDecks");
    await queryClient.invalidateQueries({ queryKey: ["decks"] });
  };

  const fetchDeck = async (deckId) => {
    setDeckId(deckId);
    await queryClient.invalidateQueries({ queryKey: ["deck", deckId] });
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

  const fetchFlashcards = async (deckId) => {
    setDeckId(deckId);
    await queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
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
        isLoading: isLoadingDecks || isLoadingDeck || isLoadingFlashcards,
        error: errorDecks || errorDeck || errorFlashcards,
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
