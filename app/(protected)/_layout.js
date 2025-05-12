import { Tabs, router } from "expo-router";
import { useAuth } from "../../contexts/AuthProvider";
import { useStudy } from "../../contexts/StudyProvider";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProtectedTabsLayout() {
  const { fetchDecks } = useStudy();
  const { user, tokenChecked } = useAuth();

  useEffect(() => {
    if (tokenChecked && !user) {
      router.replace("/(auth)/login");
    }
  }, [tokenChecked, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (tokenChecked && user) {
        await fetchDecks();
      }
    };
    fetchData();
  }, [tokenChecked, user]);

  if (!tokenChecked) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFD700", // Yellow color for active tab
        tabBarInactiveTintColor: "#666666", // Gray color for inactive tabs
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="decks"
        options={{
          title: "Decks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
