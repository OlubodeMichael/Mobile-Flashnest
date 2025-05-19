import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StudyProvider>
        <Slot />
        <StatusBar style="dark" />
      </StudyProvider>
    </AuthProvider>
  );
}
