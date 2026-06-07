import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const CITIZEN_STEPS = [
  {
    icon: "help-circle" as const,
    title: "Request help in minutes",
    description: "Describe what you need, and we'll match you with the right volunteers and NGOs. It's fast, free, and confidential.",
    color: "#1A6B4A",
  },
  {
    icon: "map-pin" as const,
    title: "Localised support",
    description: "Your request is seen by NGOs and volunteers near you. Real humans who care about your community.",
    color: "#F07020",
  },
  {
    icon: "bell" as const,
    title: "Stay updated in real-time",
    description: "Track your request status and get notifications when a volunteer is on their way to help.",
    color: "#2563EB",
  },
];

const VOLUNTEER_STEPS = [
  {
    icon: "heart" as const,
    title: "Make a real difference",
    description: "Browse help requests near you and choose tasks that match your skills and availability.",
    color: "#1A6B4A",
  },
  {
    icon: "clock" as const,
    title: "Help on your schedule",
    description: "Set your availability and service radius. Only get tasks that fit your life.",
    color: "#F07020",
  },
  {
    icon: "award" as const,
    title: "Earn recognition",
    description: "Track your impact, earn badges, and download certificates for your volunteer work.",
    color: "#2563EB",
  },
];

const NGO_STEPS = [
  {
    icon: "briefcase" as const,
    title: "Manage your NGO",
    description: "Triage incoming requests, assign volunteers, and track your community impact — all in one place.",
    color: "#1A6B4A",
  },
  {
    icon: "zap" as const,
    title: "AI-powered tools",
    description: "Auto-categorise requests and generate campaign content with Gemini AI, saving your team hours every week.",
    color: "#F07020",
  },
  {
    icon: "bar-chart-2" as const,
    title: "Measure your impact",
    description: "Get detailed analytics on requests handled, volunteer hours, and community reach.",
    color: "#2563EB",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const progress = useSharedValue(0);

  const steps =
    user?.role === "volunteer" ? VOLUNTEER_STEPS :
    user?.role === "ngo" ? NGO_STEPS :
    CITIZEN_STEPS;

  const isLast = currentIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace("/(main)");
      return;
    }
    const next = currentIndex + 1;
    setCurrentIndex(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
    progress.value = withSpring(next / (steps.length - 1));
  };

  const handleSkip = () => router.replace("/(main)");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: "Inter_400Regular" }}>
          {currentIndex + 1} of {steps.length}
        </Text>
        <Pressable onPress={handleSkip}>
          <Text style={{ color: colors.mutedForeground, fontSize: 14, fontFamily: "Inter_500Medium" }}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatRef}
        data={steps}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 32, alignItems: "center", justifyContent: "center", flex: 1 }}>
            <LinearGradient
              colors={[item.color + "20", item.color + "10"]}
              style={styles.iconBg}
            >
              <Feather name={item.icon} size={52} color={item.color} />
            </LinearGradient>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{item.description}</Text>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, {
                backgroundColor: i === currentIndex ? colors.primary : colors.muted,
                width: i === currentIndex ? 24 : 8,
              }]}
            />
          ))}
        </View>
        <Button
          title={isLast ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
          size="lg"
          icon={!isLast ? <Feather name="arrow-right" size={16} color="#fff" /> : <Feather name="check" size={16} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  iconBg: {
    width: 130,
    height: 130,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  stepDesc: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    gap: 20,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
