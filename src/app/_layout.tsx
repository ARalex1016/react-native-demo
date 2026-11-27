import "@/app/global.css";
import { useFonts } from "expo-font";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file.");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // useEffect(() => {
  //   if (fontError) {
  //     console.error("Failed to load custom fonts:", fontError);
  //   }
  // }, [fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
