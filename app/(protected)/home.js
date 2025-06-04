import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../contexts/StudyProvider";
import { useAuth } from "../../contexts/AuthProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { decks } = useStudy();
  const { user } = useAuth();
  const router = useRouter();

  const totalCards =
    decks?.decks?.reduce(
      (acc, deck) => acc + (deck.flashcards?.length || 0),
      0
    ) || 0;

  const recentDecks = decks?.decks?.slice(0, 3) || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Welcome Section with Gradient Background */}
        <View className="bg-gradient-to-b from-yellow-400 to-yellow-500 px-6 pt-6 pb-12 rounded-b-3xl">
          <Text className="text-3xl font-bold text-black mb-2">
            Welcome Back, {user?.first_name}!
          </Text>
          <Text className="text-black text-lg">
            Ready to boost your learning?
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 -mt-8">
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-white p-5 rounded-2xl flex-1 mr-3 shadow-sm">
              <View className="bg-yellow-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="book-outline" size={24} color="#F59E0B" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {decks?.decks?.length || 0}
              </Text>
              <Text className="text-gray-600">Total Decks</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-5 rounded-2xl flex-1 shadow-sm">
              <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="school-outline" size={24} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {totalCards}
              </Text>
              <Text className="text-gray-600">Total Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row ">
            <TouchableOpacity
              onPress={() => {
                router.push("/decks");
                setTimeout(() => {
                  router.setParams({ create: "true" });
                }, 100);
              }}
              className="flex-1 bg-white p-5 rounded-2xl mr-3 shadow-sm">
              <View className="bg-yellow-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="add-circle-outline" size={24} color="#F59E0B" />
              </View>
              <Text className="font-semibold text-gray-900">Create Deck</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Start a new study set
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/study")}
              className="flex-1 bg-white p-5 rounded-2xl  shadow-sm">
              <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-3">
                <Ionicons name="flash-outline" size={24} color="#3B82F6" />
              </View>
              <Text className="font-semibold text-gray-900">Quick Study</Text>
              <Text className="text-gray-500 text-sm mt-1">
                Review your cards
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Decks */}
        <View className="px-6 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Recent Decks
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/decks")}
              className="bg-yellow-100 px-4 py-2 rounded-full">
              <Text className="text-yellow-900 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {recentDecks.length > 0 ? (
            recentDecks.map((deck) => (
              <TouchableOpacity
                key={deck._id}
                onPress={() => router.replace(`/decks/${deck._id}`)}
                className="bg-white p-5 rounded-2xl mb-3 shadow-sm">
                <View className="flex-row items-center">
                  <View className="bg-yellow-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                    <Ionicons name="document-text" size={24} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-lg mb-1">
                      {deck.title}
                    </Text>
                    <Text className="text-gray-600 text-sm" numberOfLines={1}>
                      {deck.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color="#6B7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {deck.flashcards?.length || 0} cards
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              onPress={() => router.replace("/decks")}
              className="bg-white p-6 rounded-2xl shadow-sm">
              <View className="items-center">
                <View className="bg-yellow-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                  <Ionicons
                    name="add-circle-outline"
                    size={32}
                    color="#F59E0B"
                  />
                </View>
                <Text className="text-gray-900 text-center font-semibold text-lg">
                  Create Your First Deck
                </Text>
                <Text className="text-gray-500 text-center text-sm mt-1">
                  Start learning with flashcards today!
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
