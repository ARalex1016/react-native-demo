import "@/app/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="w-full bg-black px-5 py-3 rounded-lg shadow-md shadow-gray-500">
        <Text className="text-3xl font-bold text-white text-center">
          Welcome to Nativewind!
        </Text>
      </View>

      <Link href="/onboarding" className="text-lg font-bold text-destructive">
        Go to Onboarding
      </Link>

      <Link
        href="/(auth)/sign-in"
        className="text-lg font-bold text-destructive"
      >
        Go to Sign In
      </Link>

      <Link
        href="/(auth)/sign-up"
        className="text-lg font-bold text-destructive"
      >
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}
