import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import { AiProvider } from "../contexts/AiProvider";
import "../global.css";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

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
