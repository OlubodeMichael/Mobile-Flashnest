import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthProvider";
import { StudyProvider } from "../contexts/StudyProvider";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StudyProvider>
        <Slot />
      </StudyProvider>
    </AuthProvider>
  );
}
