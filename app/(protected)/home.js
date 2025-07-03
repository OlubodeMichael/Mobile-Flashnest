import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStudy } from "../../contexts/StudyProvider";
import { useAuth } from "../../contexts/AuthProvider";
import { useRouter, useFocusEffect, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export default function Home() {
  const { decks } = useStudy();
  const { userProfile } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const totalCards =
    decks?.reduce((acc, deck) => acc + (deck?.flashcards_count || 0), 0) || 0;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <SafeAreaView className="flex-1 white" edges={["left", "right", "top"]}>
      <ScrollView className="flex-1 px-4 pt-2">
        {/* Header Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-black">
                {getGreeting()}, {userProfile?.first_name}!
              </Text>
              <Text className="text-gray-400 mt-1">
                Let's make today productive
              </Text>
            </View>
            <TouchableOpacity
              className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center"
              onPress={() => router.push("/profile")}>
              <Text className="text-black font-bold text-sm">
                {userProfile?.first_name?.charAt(0)?.toUpperCase()}
                {userProfile?.last_name?.charAt(0)?.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View className="mb-6">
          <View className="bg-gray-900 rounded-3xl p-6">
            <Text className="text-lg font-semibold text-white mb-4">
              Your Progress
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <View className="w-16 h-16 bg-yellow-500 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="library" size={28} color="black" />
                </View>
                <Text className="text-2xl font-bold text-white">
                  {decks?.length || 0}
                </Text>
                <Text className="text-gray-400 text-sm">Decks</Text>
              </View>
              <View className="items-center flex-1">
                <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="card" size={28} color="white" />
                </View>
                <Text className="text-2xl font-bold text-white">
                  {totalCards}
                </Text>
                <Text className="text-gray-400 text-sm">Cards</Text>
              </View>
              <View className="items-center flex-1">
                <View className="w-16 h-16 bg-yellow-500 rounded-2xl items-center justify-center mb-2">
                  <Ionicons name="time" size={28} color="black" />
                </View>
                <Text className="text-2xl font-bold text-white">0</Text>
                <Text className="text-gray-400 text-sm">Hours</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-black mb-4">
            What would you like to do?
          </Text>

          {/* Create New Deck */}
          <TouchableOpacity
            onPress={() => {
              router.push("/decks");
              setTimeout(() => {
                router.setParams({ create: "true" });
              }, 100);
            }}
            className="mb-4 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-black/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="add-circle" size={28} color="black" />
                </View>
                <View className="flex-1">
                  <Text className="text-black text-lg font-semibold mb-1">
                    Create New Deck
                  </Text>
                  <Text className="text-black/70 text-sm">
                    Build a new study collection
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Start Studying */}
          <TouchableOpacity
            onPress={() => router.replace("/study")}
            className="mb-4 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={["#3b82f6", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="play-circle" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    Start Studying
                  </Text>
                  <Text className="text-white/80 text-sm">
                    Review your flashcards
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Browse Decks */}
          <TouchableOpacity
            onPress={() => router.push("/decks")}
            className="mb-4 rounded-3xl overflow-hidden">
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl"
              style={{ padding: 20 }}>
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-black/20 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="folder-open" size={28} color="black" />
                </View>
                <View className="flex-1">
                  <Text className="text-black text-lg font-semibold mb-1">
                    Browse Decks
                  </Text>
                  <Text className="text-black/70 text-sm">
                    View and manage your collections
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        {
          <View className="mb-4">
            <View className="bg-gray-900 rounded-3xl p-6">
              <Text className="text-lg font-semibold text-white mb-4">
                Today's Goal
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-400 text-sm mb-1">
                    Study Progress
                  </Text>
                  <View className="w-full bg-gray-700 rounded-full h-2">
                    <View
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "25%" }}
                    />
                  </View>
                </View>
                <Text className="text-white font-semibold ml-4">25%</Text>
              </View>
              <Text className="text-gray-400 text-sm mt-2">
                Complete 20 cards today to reach your goal
              </Text>
            </View>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
