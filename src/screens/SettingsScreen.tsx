import { Card, LoadingSpinner } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { uploadImageToCloudinary } from "@/src/services/cloudinary";
import { requestNotificationPermissions } from "@/src/services/notifications";
import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { user, userData, signOut, updateUserData } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      async (response) => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        if (response.assets && response.assets[0] && userData) {
          setUploading(true);
          try {
            const photoUri = response.assets[0].uri;
            if (!photoUri) return;

            // Convert image to base64
            const fetchResponse = await fetch(photoUri);
            const blob = await fetchResponse.blob();
            const reader = new FileReader();

            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onloadend = () => {
                const base64String = (reader.result as string).split(",")[1];
                resolve(base64String);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            const photoUrl = await uploadImageToCloudinary(base64);
            await updateUserData({ ...userData, photoUrl });
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to update photo");
          } finally {
            setUploading(false);
          }
        }
      }
    );
  };

  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermissions();
    if (result.granted) {
      Alert.alert("Success", "Notifications enabled!");
    } else {
      Alert.alert(
        "Permission Denied",
        "Please enable notifications in settings"
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <Card style={styles.profileCard} elevation="md">
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              <View style={styles.avatarContainer}>
                {userData?.photoUrl ? (
                  <Image
                    source={{ uri: userData.photoUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatarPlaceholder,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: theme.colors.textInverse },
                      ]}
                    >
                      {userData?.name?.[0]?.toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
                {uploading && (
                  <View style={styles.uploadingOverlay}>
                    <LoadingSpinner size="small" />
                  </View>
                )}
                <View
                  style={[
                    styles.editBadge,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Ionicons
                    name="camera"
                    size={16}
                    color={theme.colors.textInverse}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {userData?.name || "User"}
            </Text>
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
              {user?.email}
            </Text>
          </Card>
        </MotiView>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}
          >
            APPEARANCE
          </Text>

          <Card elevation="sm">
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                setThemeMode(
                  themeMode === "light"
                    ? "dark"
                    : themeMode === "dark"
                    ? "auto"
                    : "light"
                )
              }
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.primaryAlpha },
                  ]}
                >
                  <Ionicons
                    name={
                      themeMode === "light"
                        ? "sunny"
                        : themeMode === "dark"
                        ? "moon"
                        : "contrast"
                    }
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.settingLabel, { color: theme.colors.text }]}
                  >
                    Theme
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {themeMode === "light"
                      ? "Light"
                      : themeMode === "dark"
                      ? "Dark"
                      : "Auto"}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}
          >
            NOTIFICATIONS
          </Text>

          <Card elevation="sm">
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleRequestNotifications}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.secondaryAlpha },
                  ]}
                >
                  <Ionicons
                    name="notifications"
                    size={20}
                    color={theme.colors.secondary}
                  />
                </View>
                <Text
                  style={[styles.settingLabel, { color: theme.colors.text }]}
                >
                  Enable Notifications
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}
          >
            ACCOUNT
          </Text>

          <Card elevation="sm">
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSignOut}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.errorAlpha },
                  ]}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={theme.colors.error}
                  />
                </View>
                <Text
                  style={[styles.settingLabel, { color: theme.colors.error }]}
                >
                  Sign Out
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: theme.colors.textTertiary }]}
          >
            Habit Tracker v1.0.0
          </Text>
          <Text
            style={[styles.footerText, { color: theme.colors.textTertiary }]}
          >
            Built with ❤️
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    alignItems: "center",
    padding: 24,
    margin: 16,
    marginTop: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "600",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});
