import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const onboarding = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5 px-3">
      <View className="w-full bg-black px-5 py-3 rounded-lg shadow-md shadow-gray-500">
        <Text className="text-3xl font-bold text-white text-center">
          On Boarding Screen
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default onboarding;
