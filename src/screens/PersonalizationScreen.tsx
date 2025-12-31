import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemeColor {
  id: string;
  name: string;
  primary: string;
  primaryAlpha: string;
}

const THEME_COLORS: ThemeColor[] = [
  {
    id: "blue",
    name: "Ocean Blue",
    primary: "#007AFF",
    primaryAlpha: "rgba(0, 122, 255, 0.1)",
  },
  {
    id: "purple",
    name: "Royal Purple",
    primary: "#8B5CF6",
    primaryAlpha: "rgba(139, 92, 246, 0.1)",
  },
  {
    id: "green",
    name: "Forest Green",
    primary: "#10B981",
    primaryAlpha: "rgba(16, 185, 129, 0.1)",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    primary: "#F97316",
    primaryAlpha: "rgba(249, 115, 22, 0.1)",
  },
  {
    id: "pink",
    name: "Rose Pink",
    primary: "#EC4899",
    primaryAlpha: "rgba(236, 72, 153, 0.1)",
  },
  {
    id: "teal",
    name: "Ocean Teal",
    primary: "#14B8A6",
    primaryAlpha: "rgba(20, 184, 166, 0.1)",
  },
];

interface PersonalizationSettings {
  themeColor: string;
  enableNotifications: boolean;
  enableHaptics: boolean;
  startDayOfWeek: "sunday" | "monday";
  showStreakReminders: boolean;
  enableMotivationalQuotes: boolean;
}

export default function PersonalizationScreen() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<PersonalizationSettings>({
    themeColor: "blue",
    enableNotifications: true,
    enableHaptics: true,
    startDayOfWeek: "monday",
    showStreakReminders: true,
    enableMotivationalQuotes: true,
  });

  const updateSetting = async <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem(
      "personalization_settings",
      JSON.stringify(newSettings)
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Personalization
        </Text>

        {/* Theme Colors */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 100 }}
        >
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Theme Color
              </Text>
            </View>

            <View style={styles.colorGrid}>
              {THEME_COLORS.map((color, index) => (
                <MotiView
                  key={color.id}
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: index * 50 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.colorOption,
                      settings.themeColor === color.id && {
                        borderColor: color.primary,
                        borderWidth: 3,
                      },
                    ]}
                    onPress={() => updateSetting("themeColor", color.id)}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color.primary },
                      ]}
                    />
                    <Text
                      style={[styles.colorName, { color: theme.colors.text }]}
                    >
                      {color.name}
                    </Text>
                    {settings.themeColor === color.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={color.primary}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </Card>
        </MotiView>

        {/* App Preferences */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 200 }}
        >
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                App Preferences
              </Text>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={theme.colors.text}
                />
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: theme.colors.text }]}
                  >
                    Enable Notifications
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Get reminded about your habits
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enableNotifications}
                onValueChange={(value) =>
                  updateSetting("enableNotifications", value)
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryAlpha,
                }}
                thumbColor={
                  settings.enableNotifications
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color={theme.colors.text}
                />
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: theme.colors.text }]}
                  >
                    Haptic Feedback
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Feel tactile responses
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enableHaptics}
                onValueChange={(value) => updateSetting("enableHaptics", value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryAlpha,
                }}
                thumbColor={
                  settings.enableHaptics
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="flame-outline"
                  size={20}
                  color={theme.colors.text}
                />
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: theme.colors.text }]}
                  >
                    Streak Reminders
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Get notified about streak risks
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.showStreakReminders}
                onValueChange={(value) =>
                  updateSetting("showStreakReminders", value)
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryAlpha,
                }}
                thumbColor={
                  settings.showStreakReminders
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={theme.colors.text}
                />
                <View style={styles.settingTextContainer}>
                  <Text
                    style={[styles.settingTitle, { color: theme.colors.text }]}
                  >
                    Motivational Quotes
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Daily inspiration on home screen
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.enableMotivationalQuotes}
                onValueChange={(value) =>
                  updateSetting("enableMotivationalQuotes", value)
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primaryAlpha,
                }}
                thumbColor={
                  settings.enableMotivationalQuotes
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>
          </Card>
        </MotiView>

        {/* Calendar Preferences */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", delay: 300 }}
        >
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Calendar
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.buttonGroupItem,
                  {
                    backgroundColor:
                      settings.startDayOfWeek === "sunday"
                        ? theme.colors.primaryAlpha
                        : "transparent",
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => updateSetting("startDayOfWeek", "sunday")}
              >
                <Text
                  style={[
                    styles.buttonGroupText,
                    {
                      color:
                        settings.startDayOfWeek === "sunday"
                          ? theme.colors.primary
                          : theme.colors.text,
                      fontWeight:
                        settings.startDayOfWeek === "sunday" ? "600" : "400",
                    },
                  ]}
                >
                  Sunday
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonGroupItem,
                  {
                    backgroundColor:
                      settings.startDayOfWeek === "monday"
                        ? theme.colors.primaryAlpha
                        : "transparent",
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => updateSetting("startDayOfWeek", "monday")}
              >
                <Text
                  style={[
                    styles.buttonGroupText,
                    {
                      color:
                        settings.startDayOfWeek === "monday"
                          ? theme.colors.primary
                          : theme.colors.text,
                      fontWeight:
                        settings.startDayOfWeek === "monday" ? "600" : "400",
                    },
                  ]}
                >
                  Monday
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.helperText, { color: theme.colors.textSecondary }]}
            >
              Choose which day starts your week
            </Text>
          </Card>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorName: {
    fontSize: 12,
    textAlign: "center",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
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
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  buttonGroupItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  buttonGroupText: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 13,
    marginTop: 4,
  },
});
