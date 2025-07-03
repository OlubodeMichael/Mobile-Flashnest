import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../../contexts/StudyProvider";
import Deck from "../../../components/deck";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import DeckForm from "../../../components/Form/deckForm";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const { decks = [] } = useStudy();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const shouldOpenModal = params.create === "true";
    if (shouldOpenModal) {
      setIsModalVisible(true);
      router.setParams({});
    }
  }, [params.create]);

  const handleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSuccess = () => {
    handleModalVisibility();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right", "top"]}>
      <View className="flex-1 px-4 pt-2">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-2xl font-bold text-black">My Decks</Text>
              <Text className="text-gray-400 mt-1">
                {decks?.length || 0} deck{decks?.length !== 1 ? "s" : ""} •{" "}
                {decks?.reduce(
                  (acc, deck) => acc + (deck?.flashcards_count || 0),
                  0
                ) || 0}{" "}
                cards
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleModalVisibility}
                className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center shadow-lg">
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/decks/ai-generate")}
                className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center shadow-lg">
                <Ionicons name="sparkles" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Decks List */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {decks?.length > 0 ? (
            <View className="space-y-4">
              {decks.map((deck) => (
                <TouchableOpacity
                  key={deck?.id || `deck-${Math.random()}`}
                  onPress={() => {
                    if (deck?.id) {
                      router.push(`/decks/${deck.id}`);
                    }
                  }}
                  className="bg-gray-900 rounded-3xl p-6 shadow-sm mb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-yellow-500 rounded-2xl items-center justify-center mr-4">
                        <Ionicons name="library" size={24} color="black" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-lg font-semibold mb-1">
                          {deck?.title || ""}
                        </Text>
                        <Text
                          className="text-gray-300 text-sm"
                          numberOfLines={2}>
                          {deck?.description || "No description"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="card" size={16} color="#6B7280" />
                      <Text className="text-gray-300 text-sm ml-1">
                        {deck?.flashcards_count || 0} cards
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6B7280" />
                      <Text className="text-gray-300 text-sm ml-1">
                        {deck?.created_at
                          ? new Date(deck.created_at).toLocaleDateString()
                          : "Recently"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-16 px-6">
              <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-8 shadow-sm">
                <Ionicons name="library" size={48} color="#6B7280" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold mb-3 text-center">
                No decks yet
              </Text>
              <Text className="text-gray-500 text-center mb-12 text-base leading-6 max-w-sm">
                Create your first deck to get started with your learning
                journey!
              </Text>

              <View className="w-full max-w-sm rounded-3xl">
                <TouchableOpacity
                  onPress={handleModalVisibility}
                  className="w-fit rounded-3xl overflow-hidden"
                  activeOpacity={0.9}>
                  <LinearGradient
                    colors={["#fbbf24", "#f59e0b"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-3xl"
                    style={{ padding: 14 }}>
                    <View className="flex-row items-center">
                      <View className="w-14 h-14 bg-black/20 rounded-2xl items-center justify-center mr-5">
                        <Ionicons name="add-circle" size={32} color="black" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-black font-bold text-xl mb-2">
                          Create Your First Deck
                        </Text>
                        <Text className="text-black/70 text-base leading-5">
                          Start building your study collection
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Create Deck Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleModalVisibility}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-black/70 justify-center items-center">
              <TouchableWithoutFeedback onPress={() => {}}>
                <View className="bg-gray-900 w-[90%] max-w-[500px] rounded-3xl">
                  {/* Modal Header */}
                  <View className="border-b border-gray-800 px-6 py-4">
                    <Text className="text-xl font-semibold text-white">
                      Create New Deck
                    </Text>
                  </View>

                  {/* Close button */}
                  <TouchableOpacity
                    onPress={handleModalVisibility}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
                    <Ionicons name="close" size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  {/* Modal Content */}
                  <View className="p-6">
                    <DeckForm
                      onSuccess={handleSuccess}
                      onCancel={handleModalVisibility}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
