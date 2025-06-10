import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import Flashcard from "../../../components/flashcard";
import * as Haptics from "expo-haptics";
import PagerView from "react-native-pager-view";

export default function StudyDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { fetchDeck, deck, fetchFlashcards, flashcards } = useStudy();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentDeck = deck;

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
        await fetchDeck(id);
        await fetchFlashcards(id);
      } catch (error) {
        console.error("Error loading deck:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeck();
  }, [id]);

  const currentCard = flashcards?.[currentCardIndex];

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

  if (!currentCard) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">No cards in this deck</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={true}
        onPageSelected={(e) => {
          const position = e.nativeEvent.position;
          setCurrentCardIndex(position);
          setIsFlipped(false);
        }}>
        {flashcards.map((card, index) => (
          <View key={index} className="items-center justify-center p-4">
            <Flashcard
              front={card.question}
              back={card.answer}
              deckName={currentDeck.title}
              cardNumber={`${index + 1}/${flashcards.length}`}
              tags={card.tags || []}
              isFlipped={index === currentCardIndex ? isFlipped : false}
              onFlip={setIsFlipped}
            />
            <View className="flex justify-center items-center w-full mt-4 px-4 pb-4">
              <Text className="text-gray-500">Swipe to go to next card</Text>
            </View>
          </View>
        ))}
      </PagerView>

      {/* Optional: Add page indicator or buttons below 
      <View className="flex-row justify-between w-full mt-4 px-4 pb-4">
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

      */}
    </SafeAreaView>
  );
}
