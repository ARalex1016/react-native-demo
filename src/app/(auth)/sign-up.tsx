import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-in">Already have an account</Link>
    </SafeAreaView>
  );
};

export default SignUp;
