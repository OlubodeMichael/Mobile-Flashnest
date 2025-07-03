import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useStudy } from "../../../contexts/StudyProvider";
import Loading from "../../../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useState, useEffect, useCallback } from "react";
import DeckForm from "../../../components/Form/deckForm";
import Button from "../../../components/Button";
import FlashcardForm from "../../../components/Form/flashcardForm";
import { LinearGradient } from "expo-linear-gradient";
import {
  isTablet,
  getContainerMaxWidth,
  getResponsivePadding,
  getResponsiveTextSize,
} from "../../../utils/responsive";

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
    deleteFlashcard,
    updateFlashcard,
    fetchDeck,
  } = useStudy();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddFlashcardModalVisible, setIsAddFlashcardModalVisible] =
    useState(false);
  const [isEditFlashcardModalVisible, setIsEditFlashcardModalVisible] =
    useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const { isLoading: isLoadingDeck } = useStudy();

  // Set the deckId when the component loads
  useEffect(() => {
    if (id) {
      fetchDeck(id);
    }
  }, [id, fetchDeck]);

  const showOptions = useCallback(() => {
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
  }, [id, router, handleDelete]);

  useLayoutEffect(() => {
    if (deck) {
      navigation.setOptions({
        headerTitle: deck.title || "Deck",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "600",
        },
        headerRight: ({ color }) => (
          <TouchableOpacity onPress={showOptions}>
            <Ionicons name="ellipsis-vertical" size={24} color={color} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, deck, showOptions]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteDeck(id);
      router.replace("/decks");
    } catch (error) {
      console.error("Error deleting deck:", error);
      Alert.alert("Error", "Failed to delete deck. Please try again.");
    }
  }, [id, deleteDeck, router]);

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
      // The FlashcardForm already calls createFlashcard, so we just need to close the modal
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
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["right", "left", "bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient
          colors={["#111827", "#1f2937"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`rounded-b-3xl pb-8 px-6 ${getResponsivePadding()}`}>
          <View className="px-4">
            <Text className="text-4xl font-extrabold text-white mt-8 mb-2">
              {deck.title}
            </Text>
            {deck.description && (
              <Text className="text-gray-300 text-lg mb-2">
                {deck.description}
              </Text>
            )}
            {/* Stats Row */}
            <View className="flex-row items-center mt-4 mb-2 space-x-4">
              <View className="bg-yellow-400 w-8 h-8 rounded-xl items-center justify-center">
                <Ionicons name="document-text" size={20} color="black" />
              </View>
              <Text className="text-white text-lg font-semibold">
                {deck.flashcards_count || 0} Cards
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/study/${deck?.id}`)}
                className="ml-auto bg-yellow-400 px-5 py-2 rounded-full flex-row items-center shadow-lg">
                <Ionicons name="play" size={18} color="black" />
                <Text className="text-black font-bold ml-2">Study</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Flashcards List */}
        <View
          className={`mt-8 mb-32 ${getResponsivePadding()} ${getContainerMaxWidth()} mx-auto`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">Flashcards</Text>
            <Text className="text-gray-500">
              {deck.flashcards_count || 0} Cards
            </Text>
          </View>

          {flashcards && flashcards.length > 0 ? (
            flashcards.map((card, index) => (
              <View
                key={card?.id ? `flashcard-${card.id}` : `flashcard-${index}`}
                className="bg-white p-5 rounded-2xl mb-4 shadow-lg border border-gray-100">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-gray-900 font-semibold flex-1 mr-4 text-lg">
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
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: async () => {
                                    try {
                                      await deleteFlashcard(id, card.id);
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
                        { text: "Cancel", style: "cancel" },
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
                <Text className="text-gray-600 text-base mt-1">
                  {card.answer}
                </Text>
              </View>
            ))
          ) : (
            <View className="bg-gray-50 p-8 rounded-2xl shadow-inner items-center">
              <Ionicons
                name="document-text-outline"
                size={40}
                color="#9CA3AF"
                className="mb-3"
              />
              <Text className="text-gray-600 text-center font-semibold mt-2">
                No flashcards yet
              </Text>
              <Text className="text-gray-500 text-center text-sm mt-1">
                Add your first flashcard to get started!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Flashcard Button */}
      <TouchableOpacity
        onPress={openAddFlashcardModal}
        className="absolute bottom-8 right-8 bg-yellow-400 w-16 h-16 rounded-full items-center justify-center shadow-xl z-50"
        style={{ elevation: 8 }}
        activeOpacity={0.85}>
        <Ionicons name="add" size={32} color="black" />
      </TouchableOpacity>

      {/* Edit Deck Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback onPress={() => {}}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add Flashcard Modal */}
      <Modal
        visible={isAddFlashcardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddFlashcardModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback onPress={() => {}}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback onPress={() => {}}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
