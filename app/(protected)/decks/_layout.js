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
        headerShown: false,
        animation: "slide_from_right",
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Decks",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Deck Detail",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="ai-generate"
        options={{
          title: "AI Generate",
          headerShown: true,
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
