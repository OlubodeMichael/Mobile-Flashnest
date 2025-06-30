import { View, Text } from "react-native";
import {
  isTablet,
  isPhone,
  isLargeTablet,
  getCardDimensions,
} from "../utils/responsive";

export default function ResponsiveDebug() {
  const { width, height } = getCardDimensions();

  return (
    <View className="absolute top-20 right-4 bg-black/80 rounded-lg p-3 z-50">
      <Text className="text-white text-xs font-mono">
        Device: {isLargeTablet ? "Large Tablet" : isTablet ? "Tablet" : "Phone"}
      </Text>
      <Text className="text-white text-xs font-mono">
        Card: {Math.round(width)}x{Math.round(height)}
      </Text>
    </View>
  );
}
