import { Stack, router } from "expo-router";
import { useAuth } from "../../contexts/AuthProvider";
import { useEffect } from "react";

export default function AuthLayout() {
  const { tokenChecked, user } = useAuth();

  useEffect(() => {
    // Only redirect after token has been checked
    if (tokenChecked && user) {
      router.replace("/(protected)/home");
    }
  }, [tokenChecked, user]);

  // Don’t render until token check is done to avoid flicker
  if (!tokenChecked) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
