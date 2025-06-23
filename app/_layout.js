// Import accessibility polyfill first to prevent crashes
import "../utils/accessibilityPolyfill";

import { Slot } from "expo-router";
import "expo-dev-client";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiProvider from "../contexts/AiProvider";
import { useColorScheme, View, Platform } from "react-native";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

function RootLayoutContent() {
  const colorScheme = useColorScheme() || "light";
  const router = useRouter();
  useEffect(() => {
    const getOnboarding = async () => {
      try {
        const onboardingValue = await AsyncStorage.getItem("onboarding");
        const token = await AsyncStorage.getItem("token");
        console.log("onboardingValue", onboardingValue);

        if (!token) {
          router.replace("/(onboarding)");
        } else if (onboardingValue === "true") {
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

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_RC_IOS,
      });
    } else if (Platform.OS === "android") {
      Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_RC_ANDROID,
      });
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <StatusBar style="dark" />
    </View>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });

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
