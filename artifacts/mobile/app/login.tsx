import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/(main)");
    } catch (e: any) {
      Alert.alert("Login Failed", e.message ?? "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const DEMO_ACCOUNTS = [
    { label: "Citizen", email: "citizen@localaid.np", color: colors.primary },
    { label: "Volunteer", email: "volunteer@localaid.np", color: colors.info },
    { label: "NGO Admin", email: "ngo@localaid.np", color: colors.accent },
    { label: "Super Admin", email: "admin@localaid.np", color: colors.destructive },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.primary, colors.primary + "CC", colors.background]}
        style={[styles.header, { paddingTop: insets.top + 40 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Feather name="users" size={32} color="#fff" />
        </View>
        <Text style={styles.logoText}>LocalAid</Text>
        <Text style={styles.tagline}>Connecting communities, one request at a time.</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Sign in to your account</Text>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: colors.card,
                borderColor: focusedField === "email" ? colors.primary : colors.border,
              }]}>
                <Feather name="mail" size={16} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={[styles.input, { color: colors.foreground }]}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
              <View style={[styles.inputContainer, {
                backgroundColor: colors.card,
                borderColor: focusedField === "password" ? colors.primary : colors.border,
              }]}>
                <Feather name="lock" size={16} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={[styles.input, { color: colors.foreground, flex: 1 }]}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>

            <Button title="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg" style={{ marginTop: 8 }} />
          </View>

          <View style={styles.demoSection}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ color: colors.mutedForeground, fontSize: 12, fontFamily: "Inter_400Regular" }}>Demo accounts</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <Pressable
                  key={acc.email}
                  onPress={() => { setEmail(acc.email); setPassword("demo123"); }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 100,
                    backgroundColor: acc.color + "15",
                    borderWidth: 1,
                    borderColor: acc.color + "40",
                  }}
                >
                  <Text style={{ fontSize: 12, color: acc.color, fontFamily: "Inter_600SemiBold" }}>{acc.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={{ fontSize: 11, color: colors.mutedForeground, textAlign: "center", marginTop: 8, fontFamily: "Inter_400Regular" }}>
              Tap a role to pre-fill · password: demo123
            </Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Pressable onPress={() => router.push("/register")}>
              <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
                Don't have an account?{" "}
                <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 28,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  demoSection: {
    marginTop: 32,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE5DF",
    borderStyle: "dashed",
  },
});
