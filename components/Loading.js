import { View, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color="#fbbf24" size="large" />
    </View>
  );
}
