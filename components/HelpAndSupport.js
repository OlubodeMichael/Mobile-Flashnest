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
    <TouchableOpacity
      onPress={handleHelp}
      className="flex-row items-center p-4 border-b border-gray-200">
      <View className="w-8 h-8 items-center justify-center mr-3">
        <Ionicons name="help-circle-outline" size={22} color="#4B5563" />
      </View>
      <Text className="text-gray-900 font-medium flex-1">Help & Support</Text>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
