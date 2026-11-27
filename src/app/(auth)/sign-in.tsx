import { useSignIn } from "@clerk/expo";
import { Href, Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import AuthButton from "../../../components/AuthButton";
import AuthField from "../../../components/AuthField";
import AuthScreen from "../../../components/AuthScreen";
import { clerkErrorMessage, validateEmail } from "../../../lib/auth";

type VerificationStrategy =
  | "email_code"
  | "phone_code"
  | "totp"
  | "backup_code";

const strategyLabels: Record<VerificationStrategy, string> = {
  email_code: "Email code",
  phone_code: "Text message",
  totp: "Authenticator app",
  backup_code: "Backup code",
};

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [strategy, setStrategy] = useState<VerificationStrategy | null>(null);
  const [screen, setScreen] = useState<"form" | "challenge">("form");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const isLoading = fetchStatus === "fetching";

  const finalizeSignIn = async () => {
    try {
      const { error } = await signIn.finalize();
      if (error) setFormError(clerkErrorMessage(error));
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const prepareChallenge = async () => {
    const status = signIn.status;
    const available = signIn.supportedSecondFactors
      .map((factor) => factor.strategy)
      .filter(
        (value): value is VerificationStrategy =>
          value === "email_code" ||
          value === "phone_code" ||
          value === "totp" ||
          value === "backup_code",
      );

    if (status === "needs_client_trust") {
      if (!available.includes("email_code")) {
        setFormError(
          "Your account needs another verification method. Contact support for help signing in.",
        );
        return;
      }
      try {
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) {
          setFormError(clerkErrorMessage(error));
          return;
        }
      } catch (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      setStrategy("email_code");
      setScreen("challenge");
      setFormError(null);
      return;
    }

    if (status === "needs_second_factor") {
      const ordered: VerificationStrategy[] = [
        "email_code",
        "phone_code",
        "totp",
        "backup_code",
      ];
      const preferred = ordered.find((item) => available.includes(item));
      if (!preferred) {
        setFormError(
          "Your account needs a verification method this app cannot use yet. Contact support for help.",
        );
        return;
      }
      if (preferred === "email_code") {
        try {
          const { error } = await signIn.mfa.sendEmailCode();
          if (error) {
            setFormError(clerkErrorMessage(error));
            return;
          }
        } catch (error) {
          setFormError(clerkErrorMessage(error));
          return;
        }
      } else if (preferred === "phone_code") {
        try {
          const { error } = await signIn.mfa.sendPhoneCode();
          if (error) {
            setFormError(clerkErrorMessage(error));
            return;
          }
        } catch (error) {
          setFormError(clerkErrorMessage(error));
          return;
        }
      }
      setStrategy(preferred);
      setScreen("challenge");
      setFormError(null);
    }
  };

  const handleSignIn = async () => {
    const emailError = validateEmail(email);
    const passwordError = password ? "" : "Enter your password.";
    setFieldErrors({ email: emailError ?? "", password: passwordError });
    setFormError(null);
    if (emailError || passwordError) return;

    try {
      const { error } = await signIn.password({
        emailAddress: email.trim(),
        password,
      });
      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
      } else {
        await prepareChallenge();
      }
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setFormError("Enter the verification code.");
      return;
    }

    try {
      let error = null;
      if (strategy === "email_code") {
        ({ error } = await signIn.mfa.verifyEmailCode({ code: code.trim() }));
      } else if (strategy === "phone_code") {
        ({ error } = await signIn.mfa.verifyPhoneCode({ code: code.trim() }));
      } else if (strategy === "totp") {
        ({ error } = await signIn.mfa.verifyTOTP({ code: code.trim() }));
      } else if (strategy === "backup_code") {
        ({ error } = await signIn.mfa.verifyBackupCode({ code: code.trim() }));
      }

      if (error) {
        setFormError(clerkErrorMessage(error));
        return;
      }
      if (signIn.status === "complete") {
        await finalizeSignIn();
      } else {
        setCode("");
        await prepareChallenge();
      }
    } catch (error) {
      setFormError(clerkErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      title={screen === "challenge" ? "Verify it’s you" : "Welcome back"}
      subtitle={
        screen === "challenge"
          ? strategy === "email_code"
            ? "Enter the code we sent to your email to continue securely."
            : strategy === "phone_code"
              ? "Enter the code we sent to your phone to continue securely."
              : strategy === "totp"
                ? "Enter the code from your authenticator app."
                : "Enter one of your saved backup codes."
          : "Sign in to continue managing your subscriptions."
      }
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">New to Recurly? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text className="auth-link">Create an account</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      {screen === "form" ? (
        <View className="auth-form">
          <AuthField
            label="Email"
            containerClassName="px-2"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setFieldErrors((current) => ({ ...current, email: "" }));
            }}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            error={fieldErrors.email || errors.fields.identifier?.message}
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
            autoComplete="current-password"
            textContentType="password"
            secureTextEntry
            passwordToggle
            returnKeyType="go"
            onSubmitEditing={handleSignIn}
            error={fieldErrors.password || errors.fields.password?.message}
            placeholder="Enter your password"
          />

          <View className="items-end">
            <Link href={"/(auth)/forgot-password" as Href} asChild>
              <Pressable hitSlop={8}>
                <Text className="auth-link">Forgot password?</Text>
              </Pressable>
            </Link>
          </View>
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
            label="Sign in"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={!email.trim() || !password}
          />
        </View>
      ) : (
        <View className="auth-form">
          <View className="auth-status">
            <Text className="auth-helper">
              {strategy ? strategyLabels[strategy] : "Account verification"}
            </Text>
          </View>
          <AuthField
            label="Verification code"
            containerClassName="px-2"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\s/g, ""))}
            autoCapitalize="none"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            keyboardType="number-pad"
            maxLength={12}
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
          <AuthButton
            label="Verify and continue"
            onPress={handleVerify}
            loading={isLoading}
          />
          {strategy === "email_code" ? (
            <Pressable
              className="auth-secondary-button"
              disabled={isLoading}
              onPress={async () => {
                try {
                  const { error } = await signIn.mfa.sendEmailCode();
                  setFormError(clerkErrorMessage(error));
                } catch (error) {
                  setFormError(clerkErrorMessage(error));
                }
              }}
            >
              <Text className="auth-secondary-button-text">
                Send a new code
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            className="items-center py-2"
            onPress={async () => {
              await signIn.reset();
              setCode("");
              setStrategy(null);
              setScreen("form");
              setFormError(null);
            }}
          >
            <Text className="auth-link">Back to sign in</Text>
          </Pressable>
        </View>
      )}
    </AuthScreen>
  );
}
