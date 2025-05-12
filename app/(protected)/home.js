import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../contexts/StudyProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { decks } = useStudy();
  const router = useRouter();

  const totalCards =
    decks?.decks?.reduce(
      (acc, deck) => acc + (deck.flashcards?.length || 0),
      0
    ) || 0;

  const recentDecks = decks?.decks?.slice(0, 3) || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Welcome Section */}
        <View className="p-6">
          <Text className="text-3xl font-bold text-yellow-600 mb-2">
            Welcome Back!
          </Text>
          <Text className="text-gray-600 text-lg">
            Ready to boost your learning?
          </Text>
        </View>

        {/* Stats Section */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-yellow-50 p-4 rounded-xl flex-1 mr-3">
              <Text className="text-2xl font-bold text-yellow-600">
                {decks?.decks?.length || 0}
              </Text>
              <Text className="text-gray-600">Total Decks</Text>
            </View>
            <View className="bg-blue-50 p-4 rounded-xl flex-1">
              <Text className="text-2xl font-bold text-blue-600">
                {totalCards}
              </Text>
              <Text className="text-gray-600">Total Cards</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => router.push("/decks")}
              className="flex-1 bg-yellow-400 p-4 rounded-xl items-center">
              <Ionicons name="book-outline" size={24} color="black" />
              <Text className="mt-2 font-medium">My Decks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/study")}
              className="flex-1 bg-blue-400 p-4 rounded-xl items-center">
              <Ionicons name="school-outline" size={24} color="white" />
              <Text className="mt-2 font-medium text-white">Study</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Decks */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              Recent Decks
            </Text>
            <TouchableOpacity onPress={() => router.push("/decks")}>
              <Text className="text-yellow-600">See All</Text>
            </TouchableOpacity>
          </View>

          {recentDecks.length > 0 ? (
            recentDecks.map((deck) => (
              <TouchableOpacity
                key={deck._id}
                onPress={() => router.push(`/decks/${deck._id}`)}
                className="bg-gray-50 p-4 rounded-xl mb-3">
                <Text className="font-semibold text-gray-900 mb-1">
                  {deck.title}
                </Text>
                <Text className="text-gray-600 text-sm" numberOfLines={1}>
                  {deck.description}
                </Text>
                <Text className="text-gray-500 text-xs mt-2">
                  {deck.flashcards?.length || 0} cards
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-gray-600 text-center">
                No decks yet. Create your first deck to get started!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
