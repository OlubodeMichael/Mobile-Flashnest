import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../../contexts/StudyProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import StudyDeck from "../../../components/studyDeck";

export default function Study() {
  const { decks } = useStudy();
  const router = useRouter();

  // Filter out empty decks
  const studyDecks =
    decks?.decks?.filter((deck) => deck.flashcards?.length > 0) || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className=" px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-gray-900">
              Study Decks
            </Text>
          </View>
          <Text className="text-gray-600 text-lg">
            Choose a deck to start studying
          </Text>
        </View>

        {/* Decks List */}
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}>
          {studyDecks.length > 0 ? (
            studyDecks.map((deck) => (
              <StudyDeck
                key={deck._id}
                onPress={() => router.push(`/study/${deck._id}`)}
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
                No study decks available
              </Text>
              <Text className="text-gray-500 text-center">
                Add some flashcards to your decks to start studying!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/decks")}
                className="mt-6 bg-yellow-400 px-6 py-3 rounded-full">
                <Text className="font-medium">Go to Decks</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
