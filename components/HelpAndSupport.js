import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpAndSupport() {
  const handleHelp = () => {
    Alert.alert(
      "Need Help?",
      "Would you like to email us or visit our support page?",
      [
        {
          text: "Email Us",
          onPress: () =>
            Linking.openURL(
              "mailto:support@flashnest.app?subject=Help with FlashNest"
            ),
        },
        {
          text: "Visit Support Page",
          onPress: () => Linking.openURL("https://www.flashnest.app/support"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleHelp} className="flex-row items-center">
      <View className="w-12 h-12 bg-black/20 rounded-2xl items-center justify-center mr-4">
        <Ionicons name="help-circle" size={28} color="black" />
      </View>
      <View className="flex-1">
        <Text className="text-black text-lg font-semibold mb-1">
          Help & Support
        </Text>
        <Text className="text-black/70 text-sm">
          Get help and contact support
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="black" />
    </TouchableOpacity>
  );
}
