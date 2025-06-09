import { Stack } from "expo-router";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export default function DecksLayout() {
  const router = useRouter();

  const showOptions = () => {
    Alert.alert(
      "Options",
      "What would you like to do?",
      [
        {
          text: "Edit",
          onPress: () => {
            // TODO: Implement edit functionality
            console.log("Edit pressed");
          },
        },
        {
          text: "Delete",
          onPress: () => {
            // TODO: Implement delete functionality
            console.log("Delete pressed");
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerBackVisible: true,
        headerStyle: {
          backgroundColor: "#F9FAFB",
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
