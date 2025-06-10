import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboarded = await AsyncStorage.getItem("onboarding");
      //console.log("isOnboarded", isOnboarded);
      const isLoggedIn = await AsyncStorage.getItem("token");

      // check if onboarding is true
      if (isOnboarded === "true") {
        if (isLoggedIn) {
          router.replace("/(protected)/home");
        } else {
          router.replace("/(auth)");
        }
      } else {
        router.replace("/(onboarding)");
      }
    };
    checkOnboarding();
  }, []);

  return null; // This screen will redirect immediately
}
