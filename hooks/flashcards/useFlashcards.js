import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFlashcard,
  getFlashcards,
  updateFlashcard,
  deleteFlashcard,
  addBulkFlashcards,
} from "flashnest-backend/studyHelper";
import { getCurrentUser } from "flashnest-backend/authHelper";

export const useFlashcards = (deckId) => {
  return useQuery({
    queryKey: ["flashcards", deckId],
    queryFn: async () => {
      return await getFlashcards(deckId);
    },
    enabled: !!deckId,
  });
};

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, question, answer }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");
      return await createFlashcard(user.id, deckId, question, answer);
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
    },
  });
};

export const useAddBulkFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, flashcards }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");
      return await addBulkFlashcards(user.id, deckId, flashcards);
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
    },
  });
};

export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, flashcardId, question, answer }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");
      return await updateFlashcard(
        user.id,
        deckId,
        flashcardId,
        question,
        answer
      );
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
    },
  });
};

export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, flashcardId }) => {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");
      return await deleteFlashcard(deckId, flashcardId);
    },
    onSuccess: (_, { deckId }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards", deckId] });
    },
  });
};
