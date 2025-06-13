import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
} from "flashnest-backend/studyHelper";
import { getCurrentUser } from "flashnest-backend/authHelper";

export const useDecks = () => {
  return useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }
      const decks = await getDecks(user.id);
      return decks;
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });
};

export const useDeck = (deckId) => {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: async () => {
      if (!deckId) throw new Error("deckId is required");
      const deck = await getDeck(deckId);
      return deck;
    },
    enabled: !!deckId, // only run if deckId is valid
  });
};

export const useCreateDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description }) => {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }
      const deck = await createDeck(user.id, title, description);
      return deck;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
};

export const useUpdateDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId, title, description }) => {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }
      return await updateDeck(deckId, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId }) => {
      return await deleteDeck(deckId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
};
