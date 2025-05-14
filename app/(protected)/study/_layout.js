import { Stack } from "expo-router";

export default function StudyLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#F9FAFB",
          },
          headerShadowVisible: false,
          presentation: "card",
        }}
      />
    </Stack>
  );
}
