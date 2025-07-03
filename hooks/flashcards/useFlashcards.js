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
      if (!deckId) {
        throw new Error("deckId is required");
      }
      const flashcards = await getFlashcards(deckId);
      return flashcards;
    },
    enabled: !!deckId,
    staleTime: 1000 * 60 * 2, // 2 minutes for flashcards
    gcTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      // Don't retry if deckId is missing
      if (error.message === "deckId is required") {
        return false;
      }
      return failureCount < 3;
    },
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
    onMutate: async ({ deckId, question, answer }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["flashcards", deckId] });

      // Snapshot the previous value
      const previousFlashcards = queryClient.getQueryData([
        "flashcards",
        deckId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["flashcards", deckId], (old) => {
        if (!old) return old;

        const optimisticFlashcard = {
          id: `temp-${Date.now()}`,
          question,
          answer,
          deck_id: deckId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return [...old, optimisticFlashcard];
      });

      // Also update the deck's flashcard count
      queryClient.setQueryData(["deck", deckId], (old) => {
        if (!old) return old;
        return {
          ...old,
          flashcards_count: (old.flashcards_count || 0) + 1,
        };
      });

      return { previousFlashcards };
    },
    onSuccess: (data, variables) => {
      // Update cache with real server data
      queryClient.setQueryData(["flashcards", variables.deckId], (old) => {
        if (!old) return old;
        // Remove any temporary flashcards and add the real one
        const filteredOld = old.filter(
          (flashcard) => !flashcard.id || !flashcard.id.startsWith("temp-")
        );
        return [...filteredOld, data];
      });
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          ["flashcards", variables.deckId],
          context.previousFlashcards
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.deckId],
      });
      queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
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
    onMutate: async ({ deckId, flashcards }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["flashcards", deckId] });

      // Snapshot the previous value
      const previousFlashcards = queryClient.getQueryData([
        "flashcards",
        deckId,
      ]);

      // Optimistically add all flashcards
      queryClient.setQueryData(["flashcards", deckId], (old) => {
        if (!old) return old;

        const optimisticFlashcards = flashcards.map((flashcard, index) => ({
          id: `temp-bulk-${Date.now()}-${index}`,
          question: flashcard.question,
          answer: flashcard.answer,
          deck_id: deckId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        return [...old, ...optimisticFlashcards];
      });

      // Update deck's flashcard count
      queryClient.setQueryData(["deck", deckId], (old) => {
        if (!old) return old;
        return {
          ...old,
          flashcards_count: (old.flashcards_count || 0) + flashcards.length,
        };
      });

      return { previousFlashcards };
    },
    onSuccess: (data, variables) => {
      // Update cache with real server data
      queryClient.setQueryData(["flashcards", variables.deckId], (old) => {
        if (!old) return old;
        // Replace temporary flashcards with real ones
        return old.map((flashcard) => {
          if (flashcard.id && flashcard.id.startsWith("temp-bulk-")) {
            const realFlashcard = data.find(
              (f) =>
                f.question === flashcard.question &&
                f.answer === flashcard.answer
            );
            return realFlashcard || flashcard;
          }
          return flashcard;
        });
      });
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          ["flashcards", variables.deckId],
          context.previousFlashcards
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.deckId],
      });
      queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
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
    onMutate: async ({ deckId, flashcardId, question, answer }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["flashcards", deckId] });
      await queryClient.cancelQueries({ queryKey: ["deck", deckId] });

      // Snapshot the previous value
      const previousFlashcards = queryClient.getQueryData([
        "flashcards",
        deckId,
      ]);
      const previousDeck = queryClient.getQueryData(["deck", deckId]);

      // Optimistically update the flashcard
      queryClient.setQueryData(["flashcards", deckId], (old) => {
        if (!old) return old;
        return old.map((flashcard) =>
          flashcard.id === flashcardId
            ? {
                ...flashcard,
                question,
                answer,
                updated_at: new Date().toISOString(),
              }
            : flashcard
        );
      });

      return { previousFlashcards, previousDeck };
    },
    onSuccess: (data, variables) => {
      // Update cache with real server data
      queryClient.setQueryData(["flashcards", variables.deckId], (old) => {
        if (!old) return old;
        return old.map((flashcard) =>
          flashcard.id === variables.flashcardId ? data : flashcard
        );
      });
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          ["flashcards", variables.deckId],
          context.previousFlashcards
        );
      }
      if (context?.previousDeck) {
        queryClient.setQueryData(
          ["deck", variables.deckId],
          context.previousDeck
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.deckId],
      });
      queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
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
    onMutate: async ({ deckId, flashcardId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["flashcards", deckId] });

      // Snapshot the previous value
      const previousFlashcards = queryClient.getQueryData([
        "flashcards",
        deckId,
      ]);

      // Optimistically remove the flashcard
      queryClient.setQueryData(["flashcards", deckId], (old) => {
        if (!old) return old;
        return old.filter((flashcard) => flashcard.id !== flashcardId);
      });

      // Update deck's flashcard count
      queryClient.setQueryData(["deck", deckId], (old) => {
        if (!old) return old;
        return {
          ...old,
          flashcards_count: Math.max(0, (old.flashcards_count || 0) - 1),
        };
      });

      return { previousFlashcards };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          ["flashcards", variables.deckId],
          context.previousFlashcards
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["flashcards", variables.deckId],
      });
      queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
    },
  });
};
