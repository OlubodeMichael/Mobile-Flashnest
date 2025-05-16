import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";

export default function StudyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View>
        <Text>Study</Text>
      </View>
    </SafeAreaView>
  );
}
