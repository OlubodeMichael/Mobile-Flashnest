import { Stack } from "expo-router";
import { TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
