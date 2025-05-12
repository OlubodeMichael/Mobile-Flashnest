import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../../contexts/StudyProvider";
import Deck from "../../../components/deck";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Index() {
  const { decks } = useStudy();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-gray-900">Your Decks</Text>
            <TouchableOpacity
              onPress={() => router.push("/create-deck")}
              className="bg-yellow-400 p-2 rounded-full">
              <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-600 text-lg">
            Manage your flashcard decks here
          </Text>
        </View>

        {/* Decks List */}
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}>
          {decks?.decks?.length > 0 ? (
            decks.decks.map((deck) => (
              <Deck
                key={deck._id}
                onPress={() => router.push(`/decks/${deck._id}`)}
                deck={{
                  id: deck._id,
                  title: deck.title,
                  description: deck.description,
                  flashcards: deck.flashcards,
                  createdAt: deck.createdAt,
                }}
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <View className="bg-gray-100 w-16 h-16 rounded-full items-center justify-center mb-4">
                <Ionicons name="book-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-600 text-lg font-medium mb-2">
                No decks yet
              </Text>
              <Text className="text-gray-500 text-center">
                Create your first deck to get started!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/create-deck")}
                className="mt-6 bg-yellow-400 px-6 py-3 rounded-full">
                <Text className="font-medium">Create Deck</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
