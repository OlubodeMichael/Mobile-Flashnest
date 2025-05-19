import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import Flashcard from "../../../components/flashcard";
import * as Haptics from "expo-haptics";

export default function StudyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { decks, fetchDecks } = useStudy();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentDeck = decks?.decks?.find((deck) => deck._id === id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currentDeck?.title || "Study",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "600",
      },
    });
  }, [navigation, currentDeck?.title]);

  useEffect(() => {
    const loadDeck = async () => {
      setIsLoading(true);
      try {
        await fetchDecks();
      } catch (error) {
        console.error("Error loading deck:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeck();
  }, []);

  const currentCard = currentDeck?.flashcards?.[currentCardIndex];

  const handleNext = async () => {
    if (currentCardIndex < currentDeck?.flashcards?.length - 1) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handlePrevious = async () => {
    if (currentCardIndex > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Loading deck...</Text>
      </SafeAreaView>
    );
  }

  if (!currentDeck) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Deck not found</Text>
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">No cards in this deck</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <Flashcard
          front={currentCard.question}
          back={currentCard.answer}
          deckName={currentDeck.title}
          cardNumber={`${currentCardIndex + 1}/${
            currentDeck.flashcards.length
          }`}
          tags={currentCard.tags || []}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
        />

        <View className="flex-row justify-between w-full mt-8 px-4">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentCardIndex === 0}
            className={`px-6 py-3 rounded-full ${
              currentCardIndex === 0 ? "bg-gray-200" : "bg-yellow-500"
            }`}>
            <Text
              className={`font-medium ${
                currentCardIndex === 0 ? "text-gray-500" : "text-yellow-900"
              }`}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentCardIndex === currentDeck.flashcards.length - 1}
            className={`px-6 py-3 rounded-full ${
              currentCardIndex === currentDeck.flashcards.length - 1
                ? "bg-gray-200"
                : "bg-yellow-500"
            }`}>
            <Text
              className={`font-medium ${
                currentCardIndex === currentDeck.flashcards.length - 1
                  ? "text-gray-500"
                  : "text-yellow-900"
              }`}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
