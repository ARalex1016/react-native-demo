import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  inputClassName?: string;
  containerClassName?: string;
  passwordToggle?: boolean;
};

export default function AuthField({
  label,
  error,
  inputClassName = "",
  containerClassName = "",
  passwordToggle = false,
  secureTextEntry,
  ...props
}: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isSecure = secureTextEntry && !passwordVisible;

  return (
    <View className={`auth-field ${containerClassName}`}>
      <Text className="auth-label">{label}</Text>

      <View className="auth-password-row">
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          accessibilityLabel={label}
          placeholderTextColor="#52627b"
          className={`auth-input w-full ${passwordToggle ? "pr-16" : ""} ${error ? "auth-input-error" : ""} ${inputClassName}`}
        />

        {passwordToggle && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? "Hide password" : "Show password"
            }
            className="auth-toggle absolute right-3 top-0 bottom-0 justify-center"
            onPress={() => setPasswordVisible((visible) => !visible)}
            hitSlop={8}
          >
            <Text className="auth-toggle-text">
              {passwordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text accessibilityRole="alert" className="auth-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
