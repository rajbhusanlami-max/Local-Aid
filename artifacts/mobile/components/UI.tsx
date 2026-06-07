import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
}: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getBg = () => {
    switch (variant) {
      case "primary": return colors.primary;
      case "secondary": return colors.secondary;
      case "outline": return "transparent";
      case "ghost": return "transparent";
      case "destructive": return colors.destructive;
      case "accent": return colors.accent;
      default: return colors.primary;
    }
  };

  const getFg = () => {
    switch (variant) {
      case "primary": return colors.primaryForeground;
      case "secondary": return colors.secondaryForeground;
      case "outline": return colors.primary;
      case "ghost": return colors.foreground;
      case "destructive": return colors.destructiveForeground;
      case "accent": return colors.accentForeground;
      default: return colors.primaryForeground;
    }
  };

  const getPadding = () => {
    switch (size) {
      case "sm": return { paddingHorizontal: 12, paddingVertical: 7 };
      case "md": return { paddingHorizontal: 20, paddingVertical: 12 };
      case "lg": return { paddingHorizontal: 28, paddingVertical: 16 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm": return 13;
      case "md": return 15;
      case "lg": return 17;
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        animStyle,
        {
          backgroundColor: getBg(),
          borderRadius: colors.radius,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderWidth: variant === "outline" ? 1.5 : 0,
          borderColor: variant === "outline" ? colors.primary : undefined,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        getPadding(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getFg()} />
      ) : (
        <>
          {icon}
          <Text style={{ color: getFg(), fontSize: getFontSize(), fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
}

export function Card({ children, style, onPress, padding = 16 }: CardProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[
          animStyle,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            padding,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          },
          style,
        ]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          padding,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "accent" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const colors = useColors();

  const getBadgeColors = (): { bg: string; text: string } => {
    switch (variant) {
      case "success": return { bg: colors.success + "20", text: colors.success };
      case "warning": return { bg: colors.warning + "20", text: colors.warning };
      case "error": return { bg: colors.destructive + "20", text: colors.destructive };
      case "info": return { bg: colors.info + "20", text: colors.info };
      case "accent": return { bg: colors.accent + "20", text: colors.accent };
      case "outline": return { bg: "transparent", text: colors.mutedForeground };
      default: return { bg: colors.muted, text: colors.mutedForeground };
    }
  };

  const { bg, text } = getBadgeColors();
  const fontSize = size === "sm" ? 11 : 13;
  const px = size === "sm" ? 8 : 12;
  const py = size === "sm" ? 3 : 5;

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: px, paddingVertical: py, borderRadius: 100, borderWidth: variant === "outline" ? 1 : 0, borderColor: colors.border }}>
      <Text style={{ color: text, fontSize, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>{label}</Text>
    </View>
  );
}

interface AvatarProps {
  name: string;
  size?: number;
  uri?: string;
  role?: string;
}

export function Avatar({ name, size = 40, uri, role }: AvatarProps) {
  const colors = useColors();
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const getRoleColor = () => {
    switch (role) {
      case "volunteer": return colors.info;
      case "ngo": return colors.accent;
      case "admin": return colors.destructive;
      default: return colors.primary;
    }
  };

  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: getRoleColor() + "25", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: getRoleColor() + "40" }}>
      <Text style={{ color: getRoleColor(), fontSize: size * 0.38, fontWeight: "700", fontFamily: "Inter_700Bold" }}>
        {initials}
      </Text>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export function StatCard({ label, value, icon, color, subtitle }: StatCardProps) {
  const colors = useColors();
  const c = color ?? colors.primary;

  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_500Medium" }}>{label}</Text>
        {icon && <View style={{ backgroundColor: c + "15", borderRadius: 8, padding: 6 }}>{icon}</View>}
      </View>
      <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{value}</Text>
      {subtitle && <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 2, fontFamily: "Inter_400Regular" }}>{subtitle}</Text>}
    </Card>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onPress: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 }}>
      {icon && <View style={{ backgroundColor: colors.muted, borderRadius: 50, padding: 20, marginBottom: 4 }}>{icon}</View>}
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, textAlign: "center", fontFamily: "Inter_700Bold" }}>{title}</Text>
      <Text style={{ fontSize: 14, color: colors.mutedForeground, textAlign: "center", lineHeight: 20, fontFamily: "Inter_400Regular" }}>{description}</Text>
      {action && (
        <Button title={action.label} onPress={action.onPress} style={{ marginTop: 8 }} />
      )}
    </View>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{title}</Text>
      {action && (
        <Pressable onPress={action.onPress}>
          <Text style={{ fontSize: 13, color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  const colors = useColors();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }, style]} />;
}

export function LoadingScreen() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  return (
    <View style={[{ width: width as number, height, borderRadius, backgroundColor: colors.muted }, style]} />
  );
}

export function SkeletonCard() {
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton height={14} />
          <Skeleton width="60%" height={12} />
        </View>
      </View>
      <Skeleton height={12} />
      <Skeleton width="80%" height={12} />
    </Card>
  );
}

interface TagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function TagChip({ label, selected = false, onPress }: TagChipProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        backgroundColor: selected ? colors.primary : colors.muted,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
      }}
    >
      <Text style={{ fontSize: 13, color: selected ? colors.primaryForeground : colors.mutedForeground, fontFamily: "Inter_500Medium" }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function UrgencyBar({ urgency }: { urgency: number }) {
  const colors = useColors();
  const getColor = () => {
    if (urgency >= 5) return "#DC2626";
    if (urgency >= 4) return "#F07020";
    if (urgency >= 3) return "#D97706";
    if (urgency >= 2) return "#2563EB";
    return "#16A34A";
  };
  const getLabel = () => {
    if (urgency >= 5) return "Critical";
    if (urgency >= 4) return "High";
    if (urgency >= 3) return "Medium";
    if (urgency >= 2) return "Low";
    return "Minimal";
  };
  const c = getColor();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i <= urgency ? c : colors.muted }} />
        ))}
      </View>
      <Text style={{ fontSize: 11, color: c, fontFamily: "Inter_600SemiBold" }}>{getLabel()}</Text>
    </View>
  );
}
