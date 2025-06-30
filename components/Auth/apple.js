import * as AppleAuthentication from "expo-apple-authentication";
import { View } from "react-native";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppleAuth() {
  const { handleSignInWithApple } = useAuth();

  return (
    <View className="w-full items-center">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={{ width: "100%", height: 48 }}
        onPress={handleSignInWithApple}
      />
    </View>
  );
}
