import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiProvider from "../contexts/AiProvider";
import { useColorScheme, View } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RootLayoutContent() {
  const colorScheme = useColorScheme() || "light";
  const router = useRouter();
  useEffect(() => {
    const getOnboarding = async () => {
      try {
        const onboardingValue = await AsyncStorage.getItem("onboarding");
        if (onboardingValue) {
          router.replace("/(auth)");
        } else {
          router.replace("/(onboarding)");
        }
      } catch (error) {
        console.error("Error getting onboarding status:", error);
      }
    };

    getOnboarding();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </View>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StudyProvider>
            <AiProvider>
              <RootLayoutContent />
            </AiProvider>
          </StudyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
