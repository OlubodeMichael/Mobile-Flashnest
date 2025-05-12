import React from "react";
import { View, Text } from "react-native";

const LogoText = () => {
  return (
    <View className="my-8">
      <View className="flex-row items-center space-x-3 ">
        <View className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-sm">
          <Text className="font-bold text-base text-black">FN</Text>
        </View>
        <Text className="font-bold text-xl tracking-tight p-2 text-black">
          FlashNest
        </Text>
      </View>
    </View>
  );
};

export default LogoText;
