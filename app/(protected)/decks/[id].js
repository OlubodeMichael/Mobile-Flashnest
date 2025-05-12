import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import { Ionicons } from "@expo/vector-icons";

export default function DeckDetail() {
  const { id } = useLocalSearchParams();
  const { decks } = useStudy();

  const deck = decks?.decks?.find((d) => d._id === id);

  if (!deck) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-gray-600">Deck not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["right", "left", "bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className=" px-6 pt-6 pb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {deck.title}
          </Text>
          {deck.description && (
            <Text className="text-gray-600 text-lg">{deck.description}</Text>
          )}
        </View>

        {/* Stats */}
        <View className="px-6 -mt-4">
          <View className="bg-white p-5 rounded-2xl shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-yellow-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="document-text" size={20} color="#F59E0B" />
                </View>
                <Text className="text-gray-900 font-medium">
                  {deck.flashcards?.length || 0} Cards
                </Text>
              </View>
              <TouchableOpacity className="bg-yellow-400 px-4 py-2 rounded-full">
                <Text className="font-medium">Start Study</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Flashcards List */}
        <View className="px-6 mt-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Flashcards
          </Text>

          {deck.flashcards?.length > 0 ? (
            deck.flashcards.map((card, index) => (
              <View
                key={index}
                className="bg-white p-5 rounded-2xl mb-3 shadow-sm">
                <Text className="text-gray-900 font-medium mb-2">
                  {card.question}
                </Text>
                <Text className="text-gray-600">{card.answer}</Text>
              </View>
            ))
          ) : (
            <View className="bg-white p-6 rounded-2xl shadow-sm">
              <View className="items-center">
                <View className="bg-gray-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                  <Ionicons
                    name="add-circle-outline"
                    size={32}
                    color="#9CA3AF"
                  />
                </View>
                <Text className="text-gray-600 text-center font-medium">
                  No flashcards yet
                </Text>
                <Text className="text-gray-500 text-center text-sm mt-1">
                  Add your first flashcard to get started!
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
