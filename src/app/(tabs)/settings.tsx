import { styled } from "nativewind";
import { useAuth } from "@clerk/expo";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      await signOut();
    } catch {
      setError("We couldn’t sign you out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-2 text-3xl font-sans-bold text-primary">Settings</Text>
      <Text className="mb-8 text-sm font-sans-medium text-muted-foreground">
        Manage your account and app preferences.
      </Text>
      <View className="rounded-2xl border border-border bg-card p-5">
        <Text className="text-lg font-sans-bold text-primary">Your account</Text>
        <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
          Sign out of Recurly on this device.
        </Text>
        {error ? <Text accessibilityRole="alert" className="mt-3 text-sm text-destructive">{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          className={`mt-5 items-center rounded-2xl py-4 ${isSigningOut ? "bg-primary/40" : "bg-primary"}`}
          disabled={isSigningOut}
          onPress={handleSignOut}
        >
          <Text className="font-sans-bold text-background">
            {isSigningOut ? "Signing out…" : "Sign out"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
