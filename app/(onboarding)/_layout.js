import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "white" },
          gestureEnabled: false, // Disable swipe back gesture
        }}>
        <Stack.Screen
          name="index"
          options={{
            animation: "none",
          }}
        />
        <Stack.Screen
          name="second"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="third"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </View>
  );
}
