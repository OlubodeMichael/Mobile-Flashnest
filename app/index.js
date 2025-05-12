import Onboarding from "../components/Ui/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboarded = await AsyncStorage.getItem("isOnboarded");
      console.log("isOnboarded", isOnboarded);
      if (isOnboarded === "true") {
        router.replace("/(protected)/home");
      }
    };
    checkOnboarding();
  }, []);

  return <Onboarding />;
}
