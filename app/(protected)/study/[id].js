import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import Flashcard from "../../../components/flashcard";
import * as Haptics from "expo-haptics";
import PagerView from "react-native-pager-view";
import Loading from "../../../components/Loading";
import {
  isTablet,
  getContainerMaxWidth,
  getResponsivePadding,
  getResponsiveTextSize,
} from "../../../utils/responsive";

export default function StudyDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { deck, flashcards, fetchDeck } = useStudy();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { isLoading: isLoadingDeck } = useStudy();

  const currentDeck = deck;

  // Set the deckId when the component loads
  useEffect(() => {
    if (id) {
      console.log("🔄 Setting deck ID:", id);
      fetchDeck(id);
    }
  }, [id, fetchDeck]);

  // Reset card index when deck changes
  useEffect(() => {
    console.log("🔄 Resetting card index for deck:", id);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currentDeck?.title || "Study",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "600",
      },
    });
  }, [navigation, currentDeck?.title]);

  const currentCard = flashcards?.[currentCardIndex];

  const handleNext = async () => {
    if (currentCardIndex < (flashcards?.length || 0) - 1) {
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

  if (isLoadingDeck) {
    return <Loading />;
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">No cards in this deck</Text>
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Loading card...</Text>
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
          <View
            key={`${card.id || index}-${id}`}
            className={`flex-1 justify-center items-center ${getResponsivePadding()}`}>
            <View className={`w-full ${getContainerMaxWidth()} mx-auto`}>
              <Flashcard
                front={card.question}
                back={card.answer}
                deckName={currentDeck?.title || "Study"}
                cardNumber={`${index + 1}/${flashcards.length}`}
                tags={card.tags || []}
                isFlipped={index === currentCardIndex ? isFlipped : false}
                onFlip={setIsFlipped}
              />
            </View>
            <View
              className={`flex justify-center items-center w-full mt-6 ${getResponsivePadding()} pb-4`}>
              <Text
                className={`text-gray-500 ${getResponsiveTextSize(
                  "text-base",
                  "text-lg"
                )}`}>
                Swipe to go to next card
              </Text>
            </View>
          </View>
        ))}
      </PagerView>
    </SafeAreaView>
  );
}
