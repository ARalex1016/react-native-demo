import AuthButton from "../../../components/AuthButton";
import AuthField from "../../../components/AuthField";
import AuthScreen from "../../../components/AuthScreen";
import { clerkErrorMessage, validateEmail, validatePassword } from "../../../lib/auth";
import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type ResetStep = "email" | "code" | "password";

export default function ForgotPassword() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const isLoading = fetchStatus === "fetching";

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const sendResetCode = async () => {
    const emailError = validateEmail(email);
    setFieldErrors((current) => ({ ...current, email: emailError ?? "" }));
    setFormError(null);
    if (emailError) return;

    try {
      const { error: createError } = await signIn.create({ identifier: email.trim() });
      if (createError) {
        setFormError(clerkErrorMessage(createError));
        return;
      }
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      setStep("code");
      setResendIn(30);
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const verifyResetCode = async () => {
    if (!/^\d{6,8}$/.test(code.trim())) {
      setFormError("Enter the password reset code from your email.");
      return;
    }
    setFormError(null);
    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      if (signIn.status !== "needs_new_password") {
        setFormError("We couldn’t verify that code. Request a new one and try again.");
        return;
      }
      setStep("password");
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const updatePassword = async () => {
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? "Your passwords don’t match." : null;
    setFieldErrors({
      email: "",
      password: passwordError ?? "",
      confirmPassword: confirmError ?? "",
    });
    setFormError(null);
    if (passwordError || confirmError) return;

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) setFormError(clerkErrorMessage(finalizeError));
      }
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const resend = async () => {
    if (resendIn > 0 || isLoading) return;
    setFormError(null);
    try {
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      setResendIn(30);
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const title = step === "email" ? "Reset your password" : step === "code" ? "Check your inbox" : "Choose a new password";
  const subtitle =
    step === "email"
      ? "Enter the email address on your account and we’ll send you a secure reset code."
      : step === "code"
        ? `If an account matches ${email.trim()}, a reset code is on its way.`
        : "Choose a strong password you haven’t used before.";

  return (
    <AuthScreen
      title={title}
      subtitle={subtitle}
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Remembered it? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable><Text className="auth-link">Back to sign in</Text></Pressable>
          </Link>
        </View>
      }
    >
      <View className="auth-form">
        {step === "email" ? (
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
            returnKeyType="go"
            onSubmitEditing={sendResetCode}
            error={fieldErrors.email || errors.fields.identifier?.message}
            placeholder="Enter your email"
          />
        ) : null}

        {step === "code" ? (
          <>
            <AuthField
              label="Password reset code"
              value={code}
              onChangeText={(value) => setCode(value.replace(/\s/g, ""))}
              autoCapitalize="none"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              keyboardType="number-pad"
              maxLength={8}
              returnKeyType="go"
              onSubmitEditing={verifyResetCode}
              inputClassName="auth-code-input"
              error={errors.fields.code?.message}
              placeholder="Enter your code"
            />
            <Pressable
              className="auth-secondary-button"
              disabled={isLoading || resendIn > 0}
              onPress={resend}
            >
              <Text className="auth-secondary-button-text">
                {resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
              </Text>
            </Pressable>
          </>
        ) : null}

        {step === "password" ? (
          <>
            <AuthField
              label="New password"
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
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setFieldErrors((current) => ({ ...current, confirmPassword: "" }));
              }}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              secureTextEntry
              passwordToggle
              error={fieldErrors.confirmPassword}
              placeholder="Re-enter your password"
            />
          </>
        ) : null}

        {formError ? <Text accessibilityRole="alert" className="auth-error">{formError}</Text> : null}
        {errors.global?.map((item, index) => (
          <Text key={`${item.code}-${index}`} accessibilityRole="alert" className="auth-error">
            {item.message}
          </Text>
        ))}

        <AuthButton
          label={step === "email" ? "Send reset code" : step === "code" ? "Verify code" : "Save new password"}
          onPress={step === "email" ? sendResetCode : step === "code" ? verifyResetCode : updatePassword}
          loading={isLoading}
          disabled={
            (step === "email" && !email.trim()) ||
            (step === "code" && !code.trim()) ||
            (step === "password" && (!password || !confirmPassword))
          }
        />
      </View>
    </AuthScreen>
  );
}
