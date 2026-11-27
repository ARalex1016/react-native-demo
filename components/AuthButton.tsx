import { ActivityIndicator, Pressable, Text } from "react-native";

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function AuthButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      className={`auth-button ${disabled || loading ? "auth-button-disabled" : ""}`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="auth-button-text">{label}</Text>
      )}
    </Pressable>
  );
}
