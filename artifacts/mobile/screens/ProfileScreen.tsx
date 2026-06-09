import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, Divider } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

function SectionTitle({ title, icon }: { title: string; icon: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10, marginTop: 4 }}>
      <View style={{ backgroundColor: colors.primary + "15", borderRadius: 8, padding: 6 }}>
        <Feather name={icon as any} size={14} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.mutedForeground, fontFamily: "Inter_700Bold", letterSpacing: 0.5, textTransform: "uppercase" }}>
        {title}
      </Text>
    </View>
  );
}

function ToggleRow({
  icon, label, description, value, onValueChange, iconColor,
}: {
  icon: string; label: string; description?: string; value: boolean; onValueChange: (v: boolean) => void; iconColor?: string;
}) {
  const colors = useColors();
  const c = iconColor ?? colors.primary;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}>
      <View style={{ backgroundColor: c + "15", borderRadius: 10, padding: 8, marginRight: 12 }}>
        <Feather name={icon as any} size={16} color={c} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: colors.foreground, fontFamily: "Inter_500Medium" }}>{label}</Text>
        {description && <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.muted, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
      />
    </View>
  );
}

function ActionRow({ icon, label, description, onPress, iconColor, rightLabel, destructive }: {
  icon: string; label: string; description?: string; onPress: () => void;
  iconColor?: string; rightLabel?: string; destructive?: boolean;
}) {
  const colors = useColors();
  const c = iconColor ?? colors.mutedForeground;
  const labelColor = destructive ? colors.destructive : colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", paddingVertical: 12, opacity: pressed ? 0.7 : 1 })}
    >
      <View style={{ backgroundColor: c + "18", borderRadius: 10, padding: 8, marginRight: 12 }}>
        <Feather name={icon as any} size={16} color={c} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: labelColor, fontFamily: "Inter_500Medium" }}>{label}</Text>
        {description && <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>{description}</Text>}
      </View>
      {rightLabel ? (
        <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{rightLabel}</Text>
      ) : (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

function EditField({ label, value, onChange, placeholder, keyboardType }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType ?? "default"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: colors.background,
          borderWidth: 1.5,
          borderColor: focused ? colors.primary : colors.border,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 11,
          fontSize: 15,
          color: colors.foreground,
          fontFamily: "Inter_400Regular",
        }}
      />
    </View>
  );
}

function SaveFeedback({ visible }: { visible: boolean }) {
  const colors = useColors();
  if (!visible) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.success + "15", borderRadius: 10, padding: 10, marginBottom: 12 }}>
      <Feather name="check-circle" size={15} color={colors.success} />
      <Text style={{ fontSize: 13, color: colors.success, fontFamily: "Inter_600SemiBold" }}>Changes saved successfully</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, updateUser, changePassword } = useAuth();
  const { requests, campaigns } = useData();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  // Edit profile
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editPhone, setEditPhone] = useState(user?.phone ?? "");
  const [editAddress, setEditAddress] = useState(user?.location?.address ?? "");
  const [editDistrict, setEditDistrict] = useState(user?.location?.district ?? "");
  const [editNgoName, setEditNgoName] = useState(user?.ngoName ?? "");
  const [editNgoDesc, setEditNgoDesc] = useState(user?.ngoDescription ?? "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    statusUpdates: user?.notificationPrefs.statusUpdates ?? true,
    newAssignments: user?.notificationPrefs.newAssignments ?? false,
    campaigns: user?.notificationPrefs.campaigns ?? true,
    digest: user?.notificationPrefs.digest ?? false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    showActivity: user?.privacy?.showActivity ?? true,
    dataSharing: user?.privacy?.dataSharing ?? false,
    locationVisible: user?.privacy?.locationVisible ?? true,
  });

  // Security
  const [securityOpen, setSecurityOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Sign out
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Role-specific stats
  const myRequests = requests.filter((r) => r.citizenId === user.id);
  const myTasks = requests.filter((r) => r.assignedVolunteerId === user.id);
  const myCampaigns = campaigns.filter((c) => c.ngoId === user.id);

  const getHeaderColors = (): [string, string] => {
    switch (user.role) {
      case "volunteer": return [colors.info, colors.info + "CC"];
      case "ngo": return [colors.accent, "#E05010"];
      case "admin": return ["#1E1E2E", "#2D1A3E"];
      default: return [colors.primary, colors.primary + "CC"];
    }
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "volunteer": return { label: "Volunteer", variant: "info" as const };
      case "ngo": return { label: "NGO Admin", variant: "accent" as const };
      case "admin": return { label: "Super Admin", variant: "error" as const };
      default: return { label: "Citizen", variant: "success" as const };
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        name: editName.trim(),
        phone: editPhone.trim() || undefined,
        location: editAddress.trim()
          ? { lat: user.location?.lat ?? 27.7172, lng: user.location?.lng ?? 85.3240, address: editAddress.trim(), district: editDistrict.trim() || "Kathmandu" }
          : user.location,
        ...(user.role === "ngo" ? { ngoName: editNgoName.trim(), ngoDescription: editNgoDesc.trim() } : {}),
      });
      setSaveSuccess(true);
      setEditOpen(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateNotif = async (key: keyof typeof notifs, value: boolean) => {
    const next = { ...notifs, [key]: value };
    setNotifs(next);
    await updateUser({ notificationPrefs: next });
  };

  const updatePrivacy = async (key: keyof typeof privacy, value: boolean) => {
    const next = { ...privacy, [key]: value };
    setPrivacy(next);
    await updateUser({ privacy: next });
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) { setPwError("All fields are required."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    if (newPw.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    if (newPw === currentPw) { setPwError("New password must differ from current."); return; }
    setChangingPw(true);
    try {
      await changePassword(currentPw, newPw);
      setPwSuccess(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => { setPwSuccess(false); setSecurityOpen(false); }, 2500);
    } catch (e: any) {
      setPwError(e.message ?? "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  const handleSignOut = async () => {
    const confirmed =
      Platform.OS === "web"
        ? window.confirm("Sign out of LocalAid?")
        : await new Promise<boolean>((resolve) =>
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              { text: "Sign Out", style: "destructive", onPress: () => resolve(true) },
            ])
          );
    if (!confirmed) return;
    setSigningOut(true);
    await logout();
    router.replace("/login");
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === "web") {
      Alert.alert("Delete Account", "Contact support@localaid.np to permanently delete your account and all associated data.");
    } else {
      Alert.alert(
        "Delete Account",
        "This will permanently remove your account and all data. This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Contact Support", onPress: () => Alert.alert("Support", "Email: support@localaid.np\nWe'll process your request within 48 hours.") },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ── */}
      <LinearGradient
        colors={getHeaderColors()}
        style={{ paddingTop: topPadding + 16, paddingBottom: 64, alignItems: "center", paddingHorizontal: 20 }}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={{ position: "relative", marginBottom: 14 }}>
          <Avatar name={user.name} size={84} role={user.role} />
          <Pressable
            onPress={() => { setEditOpen(true); setEditName(user.name); setEditPhone(user.phone ?? ""); setEditAddress(user.location?.address ?? ""); setEditDistrict(user.location?.district ?? ""); setEditNgoName(user.ngoName ?? ""); setEditNgoDesc(user.ngoDescription ?? ""); }}
            style={{ position: "absolute", bottom: -2, right: -2, backgroundColor: "#fff", borderRadius: 14, padding: 6, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 }}
          >
            <Feather name="edit-2" size={14} color={colors.primary} />
          </Pressable>
        </View>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user.name}</Text>
        <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", marginBottom: 10 }}>{user.email}</Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Badge label={getRoleBadge().label} variant={getRoleBadge().variant} size="md" />
          {user.isVerified && <Badge label="Verified ✓" variant="success" size="md" />}
        </View>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "Inter_400Regular", marginTop: 8 }}>
          Member since {memberSince}
        </Text>
      </LinearGradient>

      <View style={{ marginTop: -40, paddingHorizontal: 16 }}>

        {/* ── Save success feedback ── */}
        <SaveFeedback visible={saveSuccess} />

        {/* ── Role Stats ── */}
        <Card style={{ marginBottom: 16, flexDirection: "row", justifyContent: "space-around" }}>
          {user.role === "citizen" && <>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{myRequests.length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Requests</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.success, fontFamily: "Inter_700Bold" }}>{myRequests.filter(r => r.status === "completed").length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Resolved</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.accent, fontFamily: "Inter_700Bold" }}>{myRequests.filter(r => !["completed","cancelled"].includes(r.status)).length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Active</Text>
            </View>
          </>}
          {user.role === "volunteer" && <>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{user.completedTaskCount ?? 0}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Tasks Done</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.info, fontFamily: "Inter_700Bold" }}>{user.totalHoursContributed ?? 0}h</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Hours</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.warning, fontFamily: "Inter_700Bold" }}>{user.rating?.toFixed(1) ?? "—"}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Rating</Text>
            </View>
          </>}
          {user.role === "ngo" && <>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{requests.filter(r => r.status === "completed").length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Handled</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.accent, fontFamily: "Inter_700Bold" }}>{campaigns.filter(c => c.ngoId === user.id && c.status === "published").length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Campaigns</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.info, fontFamily: "Inter_700Bold" }}>{requests.filter(r => !["completed","cancelled"].includes(r.status)).length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Active</Text>
            </View>
          </>}
          {user.role === "admin" && <>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{requests.length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Total Req.</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.success, fontFamily: "Inter_700Bold" }}>{campaigns.length}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Campaigns</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 26, fontWeight: "700", color: colors.info, fontFamily: "Inter_700Bold" }}>4</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Roles</Text>
            </View>
          </>}
        </Card>

        {/* ── Edit Profile Panel ── */}
        {editOpen && (
          <Card style={{ marginBottom: 16, borderColor: colors.primary + "30", borderWidth: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>Edit Profile</Text>
              <Pressable onPress={() => setEditOpen(false)}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <EditField label="Full Name" value={editName} onChange={setEditName} placeholder="Your full name" />
            <EditField label="Phone Number" value={editPhone} onChange={setEditPhone} placeholder="+977 98XXXXXXXX" keyboardType="phone-pad" />
            <EditField label="Address" value={editAddress} onChange={setEditAddress} placeholder="Street address" />
            <EditField label="District" value={editDistrict} onChange={setEditDistrict} placeholder="e.g. Kathmandu" />
            {user.role === "ngo" && <>
              <EditField label="Organisation Name" value={editNgoName} onChange={setEditNgoName} placeholder="Your NGO name" />
              <EditField label="Description" value={editNgoDesc} onChange={setEditNgoDesc} placeholder="Brief description of your work" />
            </>}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="Cancel" onPress={() => setEditOpen(false)} variant="outline" style={{ flex: 1 }} />
              <Button title={saving ? "Saving…" : "Save Changes"} onPress={handleSaveProfile} loading={saving} style={{ flex: 1 }} />
            </View>
          </Card>
        )}

        {/* ── Account Info ── */}
        <SectionTitle title="Account Information" icon="user" />
        <Card style={{ marginBottom: 16 }}>
          <View style={{ paddingVertical: 4 }}>
            {[
              { label: "Email", value: user.email, icon: "mail" },
              { label: "Phone", value: user.phone ?? "Not set", icon: "phone" },
              { label: "District", value: user.location?.district ?? "Not set", icon: "map-pin" },
              { label: "Address", value: user.location?.address ?? "Not set", icon: "home" },
              { label: "Member Since", value: memberSince, icon: "calendar" },
              { label: "Account ID", value: `#${user.id.slice(-6).toUpperCase()}`, icon: "hash" },
            ].map((item, idx, arr) => (
              <View key={item.label}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 11 }}>
                  <View style={{ backgroundColor: colors.muted, borderRadius: 8, padding: 7, marginRight: 12 }}>
                    <Feather name={item.icon as any} size={14} color={colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 2 }}>{item.label}</Text>
                    <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{item.value}</Text>
                  </View>
                  {item.label !== "Member Since" && item.label !== "Account ID" && (
                    <Pressable onPress={() => { setEditOpen(true); setEditName(user.name); setEditPhone(user.phone ?? ""); setEditAddress(user.location?.address ?? ""); setEditDistrict(user.location?.district ?? ""); }}>
                      <Feather name="edit-2" size={14} color={colors.primary} />
                    </Pressable>
                  )}
                </View>
                {idx < arr.length - 1 && <Divider />}
              </View>
            ))}
          </View>
        </Card>

        {/* ── Volunteer-specific: Skills ── */}
        {user.role === "volunteer" && (user.skills?.length ?? 0) > 0 && (
          <>
            <SectionTitle title="Skills & Expertise" icon="award" />
            <Card style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {user.skills?.map((skill) => (
                  <View key={skill} style={{ backgroundColor: colors.info + "15", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 13, color: colors.info, fontFamily: "Inter_500Medium" }}>{skill}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                onPress={() => Alert.alert("Skills", "Skill editing will be available in the next update.\nContact your NGO to update your verified skills.")}
                style={{ marginTop: 12, flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Feather name="plus-circle" size={14} color={colors.primary} />
                <Text style={{ fontSize: 13, color: colors.primary, fontFamily: "Inter_500Medium" }}>Request skill update</Text>
              </Pressable>
            </Card>
          </>
        )}

        {/* ── Notifications ── */}
        <SectionTitle title="Notification Preferences" icon="bell" />
        <Card style={{ marginBottom: 16 }}>
          <ToggleRow icon="activity" label="Status Updates" description="Get notified when your request status changes" value={notifs.statusUpdates} onValueChange={(v) => updateNotif("statusUpdates", v)} iconColor={colors.success} />
          <Divider />
          <ToggleRow icon="user-check" label="New Assignments" description="When a volunteer accepts your request" value={notifs.newAssignments} onValueChange={(v) => updateNotif("newAssignments", v)} iconColor={colors.info} />
          <Divider />
          <ToggleRow icon="flag" label="Campaign Alerts" description="Upcoming campaigns in your district" value={notifs.campaigns} onValueChange={(v) => updateNotif("campaigns", v)} iconColor={colors.accent} />
          <Divider />
          <ToggleRow icon="mail" label="Weekly Digest" description="Summary of LocalAid activity near you" value={notifs.digest} onValueChange={(v) => updateNotif("digest", v)} iconColor={colors.mutedForeground} />
        </Card>

        {/* ── Security ── */}
        <SectionTitle title="Security" icon="shield" />
        <Card style={{ marginBottom: 16 }}>
          <Pressable
            onPress={() => { setSecurityOpen(!securityOpen); setPwError(""); setPwSuccess(false); }}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
          >
            <View style={{ backgroundColor: colors.warning + "15", borderRadius: 10, padding: 8, marginRight: 12 }}>
              <Feather name="lock" size={16} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: colors.foreground, fontFamily: "Inter_500Medium" }}>Change Password</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>Update your login password</Text>
            </View>
            <Feather name={securityOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
          </Pressable>

          {securityOpen && (
            <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
              {pwSuccess && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.success + "15", borderRadius: 10, padding: 10, marginBottom: 14 }}>
                  <Feather name="check-circle" size={15} color={colors.success} />
                  <Text style={{ fontSize: 13, color: colors.success, fontFamily: "Inter_600SemiBold" }}>Password changed successfully!</Text>
                </View>
              )}
              {pwError !== "" && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.destructive + "15", borderRadius: 10, padding: 10, marginBottom: 14 }}>
                  <Feather name="alert-circle" size={15} color={colors.destructive} />
                  <Text style={{ fontSize: 13, color: colors.destructive, fontFamily: "Inter_400Regular", flex: 1 }}>{pwError}</Text>
                </View>
              )}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Current Password</Text>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: colors.background }}>
                  <TextInput value={currentPw} onChangeText={setCurrentPw} secureTextEntry={!showCurrentPw} placeholder="Current password" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular" }} />
                  <Pressable onPress={() => setShowCurrentPw(!showCurrentPw)}><Feather name={showCurrentPw ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} /></Pressable>
                </View>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>New Password</Text>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: colors.background }}>
                  <TextInput value={newPw} onChangeText={setNewPw} secureTextEntry={!showNewPw} placeholder="Min 6 characters" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular" }} />
                  <Pressable onPress={() => setShowNewPw(!showNewPw)}><Feather name={showNewPw ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} /></Pressable>
                </View>
              </View>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.mutedForeground, fontFamily: "Inter_600SemiBold", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Confirm New Password</Text>
                <TextInput value={confirmPw} onChangeText={setConfirmPw} secureTextEntry placeholder="Re-enter new password" placeholderTextColor={colors.mutedForeground} style={{ borderWidth: 1.5, borderColor: confirmPw && confirmPw !== newPw ? colors.destructive : colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: colors.foreground, fontFamily: "Inter_400Regular", backgroundColor: colors.background }} />
                {confirmPw.length > 0 && confirmPw === newPw && <Text style={{ fontSize: 12, color: colors.success, fontFamily: "Inter_400Regular", marginTop: 4 }}>✓ Passwords match</Text>}
              </View>
              <Button title={changingPw ? "Updating…" : "Update Password"} onPress={handleChangePassword} loading={changingPw} fullWidth icon={<Feather name="lock" size={15} color="#fff" />} />
            </View>
          )}

          <Divider style={{ marginVertical: 4 }} />
          <ActionRow icon="smartphone" label="Two-Factor Authentication" description="SMS verification on login" onPress={() => Alert.alert("2FA", "Two-factor authentication via SMS will be available in the next release.")} iconColor={colors.success} />
          <Divider style={{ marginVertical: 4 }} />
          <ActionRow icon="log-out" label="Sign Out All Devices" description="Ends all active sessions" onPress={() => Alert.alert("Sign Out All", "All active sessions have been terminated. Please log in again on other devices.")} iconColor={colors.destructive} />
        </Card>

        {/* ── Privacy ── */}
        <SectionTitle title="Privacy Settings" icon="eye" />
        <Card style={{ marginBottom: 16 }}>
          <ToggleRow icon="activity" label="Public Activity" description="Let others see your request/task history" value={privacy.showActivity} onValueChange={(v) => updatePrivacy("showActivity", v)} iconColor={colors.info} />
          <Divider />
          <ToggleRow icon="share-2" label="Anonymous Data Sharing" description="Help improve LocalAid with usage analytics" value={privacy.dataSharing} onValueChange={(v) => updatePrivacy("dataSharing", v)} iconColor={colors.mutedForeground} />
          <Divider />
          <ToggleRow icon="map-pin" label="Location Visible" description="Show your district on your public profile" value={privacy.locationVisible} onValueChange={(v) => updatePrivacy("locationVisible", v)} iconColor={colors.warning} />
          <Divider />
          <ActionRow icon="file-text" label="Privacy Policy" description="How we handle your data" onPress={() => Alert.alert("Privacy Policy", "LocalAid collects minimal data needed to connect citizens with volunteers. We never sell your data.\n\nFull policy: localaid.np/privacy")} />
          <Divider />
          <ActionRow icon="download" label="Download My Data" description="Export a copy of all your data" onPress={() => Alert.alert("Data Export", "Your data export will be prepared and emailed to " + user.email + " within 48 hours.")} />
        </Card>

        {/* ── Activity History ── */}
        <SectionTitle title="Recent Activity" icon="clock" />
        <Card style={{ marginBottom: 16 }}>
          {user.role === "citizen" && myRequests.slice(0, 3).length > 0 ? (
            myRequests.slice(0, 3).map((req, idx, arr) => (
              <View key={req.id}>
                <Pressable onPress={() => router.push(`/request/${req.id}` as any)} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", paddingVertical: 12, opacity: pressed ? 0.7 : 1 })}>
                  <View style={{ backgroundColor: colors.primary + "15", borderRadius: 8, padding: 7, marginRight: 12 }}>
                    <Feather name="help-circle" size={14} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }} numberOfLines={1}>{req.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>{req.status.replace("_", " ")} · {req.category.replace("_", " ")}</Text>
                  </View>
                  <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
                </Pressable>
                {idx < arr.length - 1 && <Divider />}
              </View>
            ))
          ) : user.role === "volunteer" && myTasks.slice(0, 3).length > 0 ? (
            myTasks.slice(0, 3).map((task, idx, arr) => (
              <View key={task.id}>
                <Pressable onPress={() => router.push(`/task/${task.id}` as any)} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", paddingVertical: 12, opacity: pressed ? 0.7 : 1 })}>
                  <View style={{ backgroundColor: colors.info + "15", borderRadius: 8, padding: 7, marginRight: 12 }}>
                    <Feather name="check-square" size={14} color={colors.info} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }} numberOfLines={1}>{task.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>{task.status.replace("_", " ")} · {task.category.replace("_", " ")}</Text>
                  </View>
                  <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
                </Pressable>
                {idx < arr.length - 1 && <Divider />}
              </View>
            ))
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Feather name="clock" size={28} color={colors.mutedForeground} />
              <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8 }}>No recent activity</Text>
            </View>
          )}
        </Card>

        {/* ── App Preferences ── */}
        <SectionTitle title="App Preferences" icon="settings" />
        <Card style={{ marginBottom: 16 }}>
          <ActionRow icon="globe" label="Language" description="English" onPress={() => Alert.alert("Language", "Available languages:\n• English (current)\n• नेपाली (Nepali)\n\nFull language switch in next update.")} />
          <Divider />
          <ActionRow icon="help-circle" label="Help & Support" description="FAQs, contact, feedback" onPress={() => Alert.alert("Support", "Email: support@localaid.np\nHotline: +977 01-4000-000\nHours: Sun-Fri, 9am–5pm")} />
          <Divider />
          <ActionRow icon="star" label="Rate LocalAid" description="Share your feedback on the app store" onPress={() => Alert.alert("Rate Us", "Thank you for using LocalAid!\nYour 5-star review helps us reach more communities.")} />
          <Divider />
          <ActionRow icon="info" label="App Version" onPress={() => {}} rightLabel="1.0.0 (beta)" />
        </Card>

        {/* ── Danger Zone ── */}
        <SectionTitle title="Account" icon="alert-triangle" />
        <Card style={{ marginBottom: 20, borderColor: colors.destructive + "20", borderWidth: 1 }}>
          <ActionRow
            icon="log-out"
            label="Sign Out"
            description="Sign out of your LocalAid account"
            onPress={handleSignOut}
            iconColor={colors.destructive}
            destructive
          />
          <Divider />
          <ActionRow
            icon="trash-2"
            label="Delete Account"
            description="Permanently remove your account and data"
            onPress={handleDeleteAccount}
            iconColor={colors.destructive}
            destructive
          />
        </Card>

        {/* ── Full Sign Out Button ── */}
        <Button
          title={signingOut ? "Signing out…" : "Sign Out"}
          onPress={handleSignOut}
          loading={signingOut}
          variant="outline"
          fullWidth
          size="lg"
          icon={<Feather name="log-out" size={16} color={colors.destructive} />}
          style={{ borderColor: colors.destructive, marginBottom: 8 }}
        />
      </View>
    </ScrollView>
  );
}
