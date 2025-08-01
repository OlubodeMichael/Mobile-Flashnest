"use client";

import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  isTablet,
  isLargeTablet,
  getCardDimensions,
  getResponsiveTextSize,
} from "../utils/responsive";

const { width: CARD_WIDTH, height: CARD_HEIGHT } = getCardDimensions();

export default function Flashcard({
  front,
  back,
  onFlip,
  isFlipped: externalIsFlipped = false,
  className = "",
  deckName = "Deck",
  cardNumber = "1/10",
  tags = [],
  hint = "",
}) {
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const flipProgress = useSharedValue(0);

  // Use external state if provided, otherwise use internal state
  const isFlipped =
    externalIsFlipped !== undefined ? externalIsFlipped : internalIsFlipped;

  const handleFlip = useCallback(async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    try {
      if (externalIsFlipped === undefined) {
        setInternalIsFlipped(!internalIsFlipped);
      }
      if (onFlip) {
        onFlip(!isFlipped);
      }
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      flipProgress.value = withTiming(isFlipped ? 0 : 1, { duration: 600 });
    } finally {
      // Reset animation lock after animation duration
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [isAnimating, externalIsFlipped, internalIsFlipped, isFlipped, onFlip]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  return (
    <TouchableOpacity
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      className={className}
      onPress={handleFlip}
      activeOpacity={0.9}
      accessible={true}
      accessibilityLabel={`Flashcard ${cardNumber} from ${deckName}. ${
        isFlipped ? "Showing answer" : "Showing question"
      }`}
      accessibilityHint="Double tap to flip the card">
      <View className="w-full h-full relative">
        {/* Front of Card */}
        <Animated.View
          className="absolute w-full h-full rounded-2xl shadow-lg overflow-hidden bg-yellow-400 p-4 border-2 border-yellow-500"
          style={[frontAnimatedStyle, { elevation: 5 }]}>
          <View className="flex-row justify-between items-center mb-4">
            <View className="bg-yellow-200/60 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-yellow-900 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                {deckName}
              </Text>
            </View>
            <View className="bg-white/70 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-yellow-900 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                {cardNumber}
              </Text>
            </View>
          </View>

          <View className="flex-1 justify-center items-center">
            <Text
              className={`font-bold text-gray-900 text-center mb-4 ${getResponsiveTextSize(
                "text-2xl",
                "text-3xl"
              )}`}>
              {front}
            </Text>
            {hint && (
              <View className="bg-yellow-300/20 p-3 rounded-lg">
                <Text
                  className={`font-medium text-yellow-900/90 ${getResponsiveTextSize(
                    "text-sm",
                    "text-base"
                  )}`}>
                  Hint: {hint}
                </Text>
              </View>
            )}
          </View>

          <View className="items-center mt-4">
            <View className="bg-yellow-300/20 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-yellow-900/70 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                Tap to reveal answer
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Back of Card */}
        <Animated.View
          className="absolute w-full h-full rounded-2xl shadow-lg overflow-hidden bg-white p-4 border-2 border-yellow-500"
          style={[backAnimatedStyle, { elevation: 5 }]}>
          <View className="flex-row justify-between items-center mb-4">
            <View className="bg-yellow-200/60 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-yellow-900 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                {deckName}
              </Text>
            </View>
            <View className="bg-yellow-400/70 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-yellow-900 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                {cardNumber}
              </Text>
            </View>
          </View>

          <View className="flex-1 justify-center items-center">
            <Text
              className={`font-medium text-gray-700 text-center mb-4 ${getResponsiveTextSize(
                "text-lg",
                "text-2xl"
              )}`}>
              {back}
            </Text>
            {tags.length > 0 && (
              <View className="flex-row flex-wrap justify-center gap-2">
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 px-2.5 py-1 rounded-full">
                    <Text
                      className={`font-medium text-gray-600 ${getResponsiveTextSize(
                        "text-xs",
                        "text-sm"
                      )}`}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View className="items-center mt-4">
            <View className="bg-gray-50 px-3 py-1.5 rounded-full">
              <Text
                className={`font-medium text-gray-500 ${getResponsiveTextSize(
                  "text-xs",
                  "text-sm"
                )}`}>
                Tap to return to question
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
