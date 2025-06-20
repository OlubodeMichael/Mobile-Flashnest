import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import Loading from "../../../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useState, useEffect } from "react";
import DeckForm from "../../../components/Form/deckForm";
import Button from "../../../components/Button";
import FlashcardForm from "../../../components/Form/flashcardForm";

export default function DeckDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const {
    deck,
    deleteDeck,
    updateDeck,
    createFlashcard,
    flashcards,
    fetchFlashcards,
    deleteFlashcard,
    updateFlashcard,
  } = useStudy();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddFlashcardModalVisible, setIsAddFlashcardModalVisible] =
    useState(false);
  const [isEditFlashcardModalVisible, setIsEditFlashcardModalVisible] =
    useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const { isLoading: isLoadingDeck } = useStudy();

  useEffect(() => {
    const loadDeck = async () => {
      try {
        await fetchFlashcards(id);
      } catch (error) {
        console.error("Error loading deck:", error);
      }
    };

    loadDeck();
  }, [id]);

  useLayoutEffect(() => {
    if (deck) {
      navigation.setOptions({
        headerShown: true,
        headerBackVisible: true,
        headerRight: ({ color }) => (
          <TouchableOpacity onPress={showOptions}>
            <Ionicons name="ellipsis-vertical" size={24} color={color} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, deck]);

  const handleDelete = async () => {
    try {
      await deleteDeck(id);
      router.replace("/decks");
    } catch (error) {
      console.error("Error deleting deck:", error);
      Alert.alert("Error", "Failed to delete deck. Please try again.");
    }
  };

  const handleUpdate = async (updatedDeck) => {
    try {
      await updateDeck(id, updatedDeck);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating deck:", error);
      Alert.alert("Error", "Failed to update deck. Please try again.");
    }
  };

  const openAddFlashcardModal = () => {
    setIsAddFlashcardModalVisible(true);
  };

  const handleAddFlashcard = async (newFlashcard) => {
    try {
      const createdFlashcard = await createFlashcard(
        id,
        newFlashcard.question,
        newFlashcard.answer
      );
      if (createdFlashcard) {
        await fetchFlashcards(id);
      }
      setIsAddFlashcardModalVisible(false);
    } catch (error) {
      console.error("Error adding flashcard:", error);
      Alert.alert("Error", "Failed to add flashcard. Please try again.");
    }
  };

  const handleEditFlashcard = async (updatedFlashcard) => {
    try {
      await updateFlashcard(
        id,
        selectedFlashcard.id,
        updatedFlashcard.question,
        updatedFlashcard.answer
      );
      setIsEditFlashcardModalVisible(false);
      setSelectedFlashcard(null);
    } catch (error) {
      console.error("Error updating flashcard:", error);
      Alert.alert("Error", "Failed to update flashcard. Please try again.");
    }
  };

  const showOptions = () => {
    Alert.alert(
      "Options",
      "What would you like to do?",
      [
        { text: "Edit", onPress: () => setIsEditModalVisible(true) },
        {
          text: "Generate with AI",
          onPress: () =>
            router.push({
              pathname: "/decks/ai-generate",
              params: { deckId: id },
            }),
        },
        {
          text: "Delete",
          onPress: handleDelete,
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  if (isLoadingDeck) {
    return <Loading />;
  }

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
        <View className="px-6 pt-6 pb-8">
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
                  {deck.flashcards_count || 0} Cards
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/study/${deck?.id}`)}
                className="bg-yellow-400 px-4 py-2 rounded-full">
                <Text className="font-medium">Start Study</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Flashcards List */}
        <View className="px-6 mt-6 mb-24">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">Flashcards</Text>
          </View>

          {flashcards && flashcards.length > 0 ? (
            flashcards.map((card, index) => (
              <View
                key={card?.id ? `flashcard-${card.id}` : `flashcard-${index}`}
                className="bg-white p-5 rounded-2xl mb-3 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-gray-900 font-medium flex-1 mr-4">
                    {card.question}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("Flashcard Options", "Choose an action", [
                        {
                          text: "Edit",
                          onPress: () => {
                            setSelectedFlashcard(card);
                            setIsEditFlashcardModalVisible(true);
                          },
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            Alert.alert(
                              "Delete Flashcard",
                              "Are you sure you want to delete this flashcard?",
                              [
                                {
                                  text: "Cancel",
                                  style: "cancel",
                                },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: async () => {
                                    try {
                                      await deleteFlashcard(id, card.id);
                                      await fetchFlashcards(id);
                                    } catch (error) {
                                      console.error(
                                        "Error deleting flashcard:",
                                        error
                                      );
                                      Alert.alert(
                                        "Error",
                                        "Failed to delete flashcard. Please try again."
                                      );
                                    }
                                  },
                                },
                              ]
                            );
                          },
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]);
                    }}
                    className="p-2">
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-600">{card.answer}</Text>
              </View>
            ))
          ) : (
            <View className="bg-white p-6 rounded-2xl shadow-sm">
              <View className="items-center">
                <View className="bg-gray-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                  <Ionicons
                    name="document-text-outline"
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

      {/* Fixed Add Flashcard Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button onPress={openAddFlashcardModal} size="lg">
          Add Flashcard
        </Button>
      </View>

      {/* Edit Deck Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] max-w-[500px] rounded-xl">
            {/* Modal Header */}
            <View className="border-b border-gray-100 px-6 py-4">
              <Text className="text-xl font-semibold text-gray-900">
                Edit Deck
              </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              onPress={() => setIsEditModalVisible(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Modal Content */}
            <View className="p-6">
              <DeckForm
                deck={deck}
                onSuccess={handleUpdate}
                onCancel={() => setIsEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Flashcard Modal */}
      <Modal
        visible={isAddFlashcardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddFlashcardModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] max-w-[500px] rounded-xl">
            <View className="border-b border-gray-100 px-6 py-4">
              <Text className="text-xl font-semibold text-gray-900">
                Add Flashcard
              </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              onPress={() => setIsAddFlashcardModalVisible(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Modal Content */}
            <View className="p-6">
              <FlashcardForm
                deckId={id}
                onSuccess={handleAddFlashcard}
                onCancel={() => setIsAddFlashcardModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Flashcard Modal */}
      <Modal
        visible={isEditFlashcardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsEditFlashcardModalVisible(false);
          setSelectedFlashcard(null);
        }}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] max-w-[500px] rounded-xl">
            <View className="border-b border-gray-100 px-6 py-4">
              <Text className="text-xl font-semibold text-gray-900">
                Edit Flashcard
              </Text>
            </View>

            {/* Close button */}
            <TouchableOpacity
              onPress={() => {
                setIsEditFlashcardModalVisible(false);
                setSelectedFlashcard(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Modal Content */}
            <View className="p-6">
              <FlashcardForm
                flashcard={selectedFlashcard}
                deckId={id}
                onSuccess={handleEditFlashcard}
                onCancel={() => {
                  setIsEditFlashcardModalVisible(false);
                  setSelectedFlashcard(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
