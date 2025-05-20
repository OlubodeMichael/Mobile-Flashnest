import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LogoText from "../LogoText";

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(auth)");
  };
  const features = [
    {
      title: "Smart Flashcards",
      description:
        "Create and study flashcards with AI-powered learning algorithms",
      icon: "🎯",
    },
    {
      title: "Track Progress",
      description: "Monitor your learning journey with detailed statistics",
      icon: "📊",
    },
    {
      title: "Study Anywhere",
      description: "Access your flashcards offline and sync across devices",
      icon: "🌐",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-1 items-center justify-center px-6 pt-12">
        <LogoText />
        <Text className="text-lg text-gray-600 text-center leading-6 mt-4 max-w-[280px]">
          Your personal flashcard companion for effective learning
        </Text>
      </View>

      {/* Features */}
      <View className="flex-2 px-6">
        {features.map((feature, index) => (
          <View
            key={index}
            className="flex-row items-center mb-6 bg-gray-50 p-5 rounded-xl">
            <Text className="text-3xl mr-4">{feature.icon}</Text>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {feature.title}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Get Started Button */}
      <View className="flex-1 justify-end px-6 pb-8">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-yellow-400 py-4 rounded-xl shadow-sm active:bg-yellow-500">
          <Text className="text-black text-center text-lg font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
