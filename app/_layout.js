import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import { AiProvider } from "../contexts/AiProvider";
import { useState } from "react";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [onboarding, setOnboarding] = useState(false);
  const getOnboarding = async () => {
    const onboarding = await AsyncStorage.getItem("onboarding");
    setOnboarding(onboarding);
  };
  getOnboarding();

  return (
    <AuthProvider>
      <StudyProvider>
        <AiProvider>
          <Slot />
          <StatusBar style="dark" />
        </AiProvider>
      </StudyProvider>
    </AuthProvider>
  );
}
