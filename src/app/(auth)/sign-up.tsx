import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import AuthButton from "../../../components/AuthButton";
import AuthField from "../../../components/AuthField";
import AuthScreen from "../../../components/AuthScreen";
import {
  clerkErrorMessage,
  validateEmail,
  validatePassword,
} from "../../../lib/auth";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isLoading = fetchStatus === "fetching";

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const handleSignUp = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password) ?? "";
    const confirmError =
      confirmPassword !== password ? "Your passwords don’t match." : "";
    setFieldErrors({
      email: emailError ?? "",
      password: passwordError,
      confirmPassword: confirmError,
    });
    setFormError(null);
    if (emailError || passwordError || confirmError) return;

    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setFormError(clerkErrorMessage(sendError));
        return;
      }
      setIsVerifying(true);
      setResendIn(30);
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const handleVerify = async () => {
    if (!/^\d{6,8}$/.test(code.trim())) {
      setFormError("Enter the verification code from your email.");
      return;
    }
    setFormError(null);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      if (signUp.status !== "complete") {
        setFormError(
          "We still need to verify your account. Check the code and try again.",
        );
        return;
      }
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) setFormError(clerkErrorMessage(finalizeError));
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const resendCode = async () => {
    if (resendIn > 0 || isLoading) return;
    setFormError(null);
    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      setResendIn(30);
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      title={isVerifying ? "Check your inbox" : "Create your account"}
      subtitle={
        isVerifying
          ? `We sent a verification code to ${email.trim()}. Enter it below to secure your account.`
          : "Take control of your subscriptions with one clear view of what you spend."
      }
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text className="auth-link">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      {isVerifying ? (
        <View className="auth-form">
          <AuthField
            label="Email verification code"
            containerClassName="px-2"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\s/g, ""))}
            autoCapitalize="none"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            maxLength={8}
            returnKeyType="go"
            onSubmitEditing={handleVerify}
            inputClassName="auth-code-input"
            error={errors.fields.code?.message}
            placeholder="Enter your code"
          />

          {formError ? (
            <Text accessibilityRole="alert" className="auth-error">
              {formError}
            </Text>
          ) : null}

          {errors.global?.map((item, index) => (
            <Text
              key={`${item.code}-${index}`}
              accessibilityRole="alert"
              className="auth-error"
            >
              {item.message}
            </Text>
          ))}

          <AuthButton
            label="Verify email"
            onPress={handleVerify}
            loading={isLoading}
          />

          <Pressable
            className="auth-secondary-button"
            disabled={isLoading || resendIn > 0}
            onPress={resendCode}
          >
            <Text className="auth-secondary-button-text">
              {resendIn > 0
                ? `Send a new code in ${resendIn}s`
                : "Send a new code"}
            </Text>
          </Pressable>
          <Pressable
            className="items-center py-2"
            onPress={async () => {
              await signUp.reset();
              setIsVerifying(false);
              setCode("");
              setFormError(null);
            }}
          >
            <Text className="auth-link">Use a different email</Text>
          </Pressable>
        </View>
      ) : (
        <View className="auth-form">
          <AuthField
            label="Email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setFieldErrors((current) => ({ ...current, email: "" }));
            }}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            error={fieldErrors.email || errors.fields.emailAddress?.message}
            placeholder="Enter your email"
          />
          <AuthField
            label="Password"
            containerClassName="px-2"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setFieldErrors((current) => ({ ...current, password: "" }));
            }}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            secureTextEntry
            passwordToggle
            error={fieldErrors.password || errors.fields.password?.message}
            placeholder="At least 8 characters"
          />
          <AuthField
            label="Confirm password"
            containerClassName="px-2"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setFieldErrors((current) => ({
                ...current,
                confirmPassword: "",
              }));
            }}
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            secureTextEntry
            passwordToggle
            error={fieldErrors.confirmPassword}
            placeholder="Re-enter your password"
          />
          {formError ? (
            <Text accessibilityRole="alert" className="auth-error">
              {formError}
            </Text>
          ) : null}
          {errors.global?.map((item, index) => (
            <Text
              key={`${item.code}-${index}`}
              accessibilityRole="alert"
              className="auth-error"
            >
              {item.message}
            </Text>
          ))}
          <AuthButton
            label="Create account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={!email.trim() || !password || !confirmPassword}
          />
          <Text className="auth-footer-note">
            We’ll email you a code to verify your address and finish setting up
            your account.
          </Text>
        </View>
      )}
    </AuthScreen>
  );
}
