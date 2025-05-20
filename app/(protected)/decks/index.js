import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../../contexts/StudyProvider";
import Deck from "../../../components/deck";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import DeckForm from "../../../components/Form/deckForm";

export default function Index() {
  const { decks, fetchDecks } = useStudy();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const shouldOpenModal = params.create === "true";
    if (shouldOpenModal) {
      setIsModalVisible(true);
      // Remove the create parameter from the URL
      router.setParams({});
    }
  }, [params.create]);

  const handleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSuccess = async () => {
    await fetchDecks();
    handleModalVisibility();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-gray-900">Your Decks</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleModalVisibility}
                className="bg-yellow-400 p-2 rounded-full">
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/decks/ai-generate")}
                className="bg-yellow-100 p-2 rounded-full flex-row items-center">
                <Ionicons name="sparkles-outline" size={20} color="#fbbf24" />
                <Text className="ml-1 text-yellow-700 font-semibold">AI</Text>
              </TouchableOpacity>
            </View>
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
                onPress={handleModalVisibility}
                className="mt-6 bg-yellow-400 px-6 py-3 rounded-full">
                <Text className="font-medium">Create Deck</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/decks/ai-generate")}
                className="mt-3 bg-yellow-100 px-6 py-3 rounded-full flex-row items-center justify-center">
                <Ionicons name="sparkles-outline" size={20} color="#fbbf24" />
                <Text className="ml-2 text-yellow-700 font-semibold">AI</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Create Deck Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleModalVisibility}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white w-[90%] max-w-[500px] rounded-xl">
              {/* Modal Header */}
              <View className="border-b border-gray-100 px-6 py-4">
                <Text className="text-xl font-semibold text-gray-900">
                  Create New Deck
                </Text>
              </View>

              {/* Close button */}
              <TouchableOpacity
                onPress={handleModalVisibility}
                className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center">
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Modal Content */}
              <View className="p-6">
                <DeckForm onSuccess={handleSuccess} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
