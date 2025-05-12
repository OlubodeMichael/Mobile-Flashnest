import { Stack, router } from "expo-router";
import { useAuth } from "../../contexts/AuthProvider";
import { useEffect } from "react";

export default function AuthLayout() {
  const { tokenChecked, user } = useAuth();

  useEffect(() => {
    if (tokenChecked && user) {
      router.replace("/(protected)/home"); // ✅ safe navigation
    }
  }, [tokenChecked, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
