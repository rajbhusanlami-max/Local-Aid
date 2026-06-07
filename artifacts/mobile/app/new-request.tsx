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
import { Button, TagChip, UrgencyBar } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData, RequestCategory } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { value: RequestCategory; label: string; icon: string }[] = [
  { value: "elderly_care", label: "Elderly Care", icon: "heart" },
  { value: "emergency", label: "Emergency", icon: "alert-triangle" },
  { value: "blood_donation", label: "Blood Donation", icon: "droplet" },
  { value: "food", label: "Food", icon: "coffee" },
  { value: "medical", label: "Medical", icon: "activity" },
  { value: "shelter", label: "Shelter", icon: "home" },
  { value: "education", label: "Education", icon: "book" },
  { value: "welfare", label: "Welfare", icon: "package" },
  { value: "other", label: "Other", icon: "help-circle" },
];

const URGENCY_LABELS = ["", "Minimal", "Low", "Medium", "High", "Critical"];

const DISTRICTS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Kaski", "Chitwan", "Other"];

export default function NewRequestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { addRequest } = useData();

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RequestCategory | null>(null);
  const [urgency, setUrgency] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [district, setDistrict] = useState("Kathmandu");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleNext = () => {
    if (step === 1) {
      if (!description.trim()) { Alert.alert("Error", "Please describe what you need."); return; }
      if (!category) { Alert.alert("Error", "Please select a category."); return; }
      if (!title.trim()) { Alert.alert("Error", "Please provide a title."); return; }
    }
    if (step === 2) {
      if (!address.trim()) { Alert.alert("Error", "Please enter your location."); return; }
    }
    if (step < 3) setStep((s) => (s + 1) as any);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addRequest({
        citizenId: user?.id ?? "citizen-001",
        citizenName: user?.name ?? "Anonymous",
        title,
        description,
        category: category ?? "other",
        urgency,
        status: "submitted",
        location: { address, district },
        photos: [],
      });
      Alert.alert(
        "Request Submitted!",
        "We're finding the right support for you. You'll be notified when a volunteer accepts.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Pressable onPress={() => step > 1 ? setStep((s) => (s - 1) as any) : router.back()}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>
            {step === 1 ? "Describe Need" : step === 2 ? "Your Location" : "Review & Submit"}
          </Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? colors.primary : colors.muted }} />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <>
              <Text style={styles.sectionLabel(colors)}>What do you need help with?</Text>
              <TextInput
                value={description}
                onChangeText={(v) => {
                  setDescription(v);
                  if (v.length > 20 && !title) setTitle(v.split(".")[0].slice(0, 60));
                }}
                placeholder="Describe your situation in detail... (min. 20 characters)"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={5}
                style={[styles.textarea, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
                textAlignVertical="top"
              />
              <Text style={{ fontSize: 11, color: colors.mutedForeground, textAlign: "right", marginBottom: 20, fontFamily: "Inter_400Regular" }}>
                {description.length} characters
              </Text>

              <Text style={styles.sectionLabel(colors)}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Brief title for your request"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground }]}
              />

              <Text style={[styles.sectionLabel(colors), { marginTop: 20 }]}>Category</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 100,
                      backgroundColor: category === cat.value ? colors.primary : colors.muted,
                      borderWidth: 1,
                      borderColor: category === cat.value ? colors.primary : colors.border,
                    }}
                  >
                    <Feather name={cat.icon as any} size={13} color={category === cat.value ? "#fff" : colors.mutedForeground} />
                    <Text style={{ fontSize: 13, color: category === cat.value ? "#fff" : colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.sectionLabel(colors)}>Urgency Level</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                {([1, 2, 3, 4, 5] as const).map((u) => (
                  <Pressable
                    key={u}
                    onPress={() => setUrgency(u)}
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: urgency >= u ? colors.accent : colors.muted,
                      opacity: urgency >= u ? 1 : 0.3,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "700", color: urgency >= u ? "#fff" : colors.mutedForeground, fontFamily: "Inter_700Bold" }}>{u}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 4 }}>
                Selected: <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.accent }}>{URGENCY_LABELS[urgency]}</Text>
              </Text>
              {urgency === 5 && (
                <View style={{ backgroundColor: colors.destructive + "15", borderRadius: 10, padding: 10, flexDirection: "row", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <Feather name="alert-triangle" size={14} color={colors.destructive} />
                  <Text style={{ fontSize: 12, color: colors.destructive, fontFamily: "Inter_500Medium", flex: 1 }}>
                    Critical urgency — this will be escalated immediately to NGO admins.
                  </Text>
                </View>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.sectionLabel(colors)}>Your location</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Street address, landmark..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.card, color: colors.foreground, marginBottom: 16 }]}
              />

              <Text style={styles.sectionLabel(colors)}>District</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {DISTRICTS.map((d) => (
                  <TagChip key={d} label={d} selected={district === d} onPress={() => setDistrict(d)} />
                ))}
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.sectionLabel(colors)}>Review your request</Text>
              {[
                { label: "Title", value: title },
                { label: "Category", value: CATEGORIES.find((c) => c.value === category)?.label ?? "Other" },
                { label: "Location", value: `${address}, ${district}` },
              ].map(({ label, value }) => (
                <View key={label} style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 2 }}>{label}</Text>
                  <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{value}</Text>
                </View>
              ))}

              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 6 }}>Urgency</Text>
                <UrgencyBar urgency={urgency} />
              </View>

              <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 2 }}>Description</Text>
                <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular", lineHeight: 20 }}>{description}</Text>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }}>
        <Button
          title={step < 3 ? "Continue" : "Submit Request"}
          onPress={step < 3 ? handleNext : handleSubmit}
          loading={submitting}
          fullWidth
          size="lg"
          icon={step < 3 ? <Feather name="arrow-right" size={16} color="#fff" /> : <Feather name="send" size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = {
  sectionLabel: (colors: any) => ({
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  } as const),
  textInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 20,
  } as const,
  textarea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 120,
    marginBottom: 4,
  } as const,
};
