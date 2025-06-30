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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 2,
    refetchIntervalInBackground: true,
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
    enabled: !!deckId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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
    onMutate: async ({ title, description }) => {
      await queryClient.cancelQueries({ queryKey: ["decks"] });

      const previousDecks = queryClient.getQueryData(["decks"]);

      queryClient.setQueryData(["decks"], (old) => {
        if (!old) return old;

        const optimisticDeck = {
          id: `temp-${Date.now()}`,
          title,
          description,
          flashcards_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "temp-user",
        };

        return [...old, optimisticDeck];
      });

      return { previousDecks };
    },
    onError: (err, variables, context) => {
      if (context?.previousDecks) {
        queryClient.setQueryData(["decks"], context.previousDecks);
      }
    },
    onSettled: () => {
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
    onMutate: async ({ deckId, title, description }) => {
      await queryClient.cancelQueries({ queryKey: ["decks"] });
      await queryClient.cancelQueries({ queryKey: ["deck", deckId] });

      const previousDecks = queryClient.getQueryData(["decks"]);
      const previousDeck = queryClient.getQueryData(["deck", deckId]);

      queryClient.setQueryData(["decks"], (old) => {
        if (!old) return old;
        return old.map((deck) =>
          deck.id === deckId
            ? {
                ...deck,
                title,
                description,
                updated_at: new Date().toISOString(),
              }
            : deck
        );
      });

      queryClient.setQueryData(["deck", deckId], (old) => {
        if (!old) return old;
        return {
          ...old,
          title,
          description,
          updated_at: new Date().toISOString(),
        };
      });

      return { previousDecks, previousDeck };
    },
    onError: (err, variables, context) => {
      if (context?.previousDecks) {
        queryClient.setQueryData(["decks"], context.previousDecks);
      }
      if (context?.previousDeck) {
        queryClient.setQueryData(
          ["deck", variables.deckId],
          context.previousDeck
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deckId }) => {
      return await deleteDeck(deckId);
    },
    onMutate: async ({ deckId }) => {
      await queryClient.cancelQueries({ queryKey: ["decks"] });
      await queryClient.cancelQueries({ queryKey: ["deck", deckId] });

      const previousDecks = queryClient.getQueryData(["decks"]);

      queryClient.setQueryData(["decks"], (old) => {
        if (!old) return old;
        return old.filter((deck) => deck.id !== deckId);
      });

      queryClient.removeQueries({ queryKey: ["deck", deckId] });

      return { previousDecks };
    },
    onError: (err, variables, context) => {
      if (context?.previousDecks) {
        queryClient.setQueryData(["decks"], context.previousDecks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });
};
