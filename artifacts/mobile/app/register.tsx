import { Feather } from "@expo/vector-icons";
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
import { UserRole, useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const ROLES: { value: UserRole; label: string; description: string; icon: string }[] = [
  { value: "citizen", label: "Citizen", description: "I need help or support from the community", icon: "user" },
  { value: "volunteer", label: "Volunteer", description: "I want to help others in my community", icon: "heart" },
  { value: "ngo", label: "NGO Admin", description: "I manage an NGO providing community services", icon: "briefcase" },
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert("Error", "Please select your role.");
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password, selectedRole);
      router.replace("/onboarding");
    } catch (e: any) {
      Alert.alert("Registration Failed", e.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { key: string; placeholder: string; secure?: boolean; keyboardType?: any; autoCapitalize?: any }
  ) => (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{label}</Text>
      <View style={[styles.inputContainer, {
        backgroundColor: colors.card,
        borderColor: focusedField === opts.key ? colors.primary : colors.border,
      }]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={opts.placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={opts.secure}
          keyboardType={opts.keyboardType}
          autoCapitalize={opts.autoCapitalize ?? "sentences"}
          onFocus={() => setFocusedField(opts.key)}
          onBlur={() => setFocusedField(null)}
          style={{ flex: 1, fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular" }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => step === 2 ? setStep(1) : router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.stepIndicator}>
          {[1, 2].map((s) => (
            <View key={s} style={[styles.stepDot, {
              backgroundColor: s <= step ? colors.primary : colors.muted,
              width: s === step ? 24 : 8,
            }]} />
          ))}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <>
              <Text style={[styles.title, { color: colors.foreground }]}>Create account</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Join thousands helping Nepal</Text>

              <View style={{ gap: 16, marginTop: 8 }}>
                {renderInput("Full Name", name, setName, { key: "name", placeholder: "Bhusan Lamichhane" })}
                {renderInput("Email", email, setEmail, { key: "email", placeholder: "your@email.com", keyboardType: "email-address", autoCapitalize: "none" })}
                {renderInput("Password", password, setPassword, { key: "password", placeholder: "min. 6 characters", secure: true, autoCapitalize: "none" })}
              </View>

              <Button title="Continue" onPress={handleNext} fullWidth size="lg" style={{ marginTop: 28 }}
                icon={<Feather name="arrow-right" size={16} color="#fff" />}
              />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.foreground }]}>Choose your role</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>How will you use LocalAid?</Text>

              <View style={{ gap: 12, marginTop: 8 }}>
                {ROLES.map((role) => (
                  <Pressable
                    key={role.value}
                    onPress={() => setSelectedRole(role.value)}
                    style={[styles.roleCard, {
                      backgroundColor: colors.card,
                      borderColor: selectedRole === role.value ? colors.primary : colors.border,
                      borderWidth: selectedRole === role.value ? 2 : 1,
                    }]}
                  >
                    <View style={[styles.roleIcon, {
                      backgroundColor: selectedRole === role.value ? colors.primary + "20" : colors.muted,
                    }]}>
                      <Feather name={role.icon as any} size={22} color={selectedRole === role.value ? colors.primary : colors.mutedForeground} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{role.label}</Text>
                      <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 }}>{role.description}</Text>
                    </View>
                    {selectedRole === role.value && (
                      <View style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 4 }}>
                        <Feather name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>

              <Button title="Create Account" onPress={handleRegister} loading={loading} fullWidth size="lg" style={{ marginTop: 28 }} />
            </>
          )}

          <Pressable onPress={() => router.replace("/login")} style={{ marginTop: 24, alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
              Already have an account? <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  stepIndicator: { flexDirection: "row", gap: 6, alignItems: "center" },
  stepDot: { height: 8, borderRadius: 4 },
  content: { padding: 24, paddingTop: 12 },
  title: { fontSize: 26, fontWeight: "700", fontFamily: "Inter_700Bold", marginBottom: 4 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", marginBottom: 24 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
