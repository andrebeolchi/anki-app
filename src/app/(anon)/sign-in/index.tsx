import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "~/components/auth";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function SignInScreen() {
  const { isLoading, signIn } = useAuth();

  return (
    <View className="flex-1 justify-end items-center w-full bg-darkblue px-safe pt-safe">
      <View className="justify-center items-center p-6 w-full bg-white rounded-t-2xl pb-safe-offset-6">
        <Button
          disabled={isLoading}
          testID="sign-in-button"
          className="w-full text-white"
          onPress={signIn}
        >
          {isLoading ? (
            <ActivityIndicator className="color-background" />
          ) : (
            <Text>Entrar</Text>
          )}
        </Button>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
