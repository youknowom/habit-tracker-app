import { Button, Card, Chip, Input } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { scheduleHabitNotification } from "@/src/services/notifications";
import { useHabitStore } from "@/src/store/habitStore";
import { AddHabitScreenProps } from "@/src/types/navigation";
import { isValidHabitName } from "@/src/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EMOJI_OPTIONS = [
  "🏃",
  "📚",
  "💧",
  "🧘",
  "🍎",
  "💤",
  "🎯",
  "📝",
  "🎨",
  "🏋️",
  "🚴",
  "🎵",
  "💰",
  "🌱",
  "📱",
  "✍️",
];

interface AddHabitScreenComponentProps extends AddHabitScreenProps {}

export default function AddHabitScreen({
  navigation,
  route,
}: AddHabitScreenComponentProps) {
  const { theme } = useTheme();
  const template = route.params?.template;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [goalType, setGoalType] = useState<"check" | "reps" | "time">("check");
  const [goalValue, setGoalValue] = useState("");
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const addHabit = useHabitStore((state) => state.addHabit);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Pre-fill form from template if provided
  useEffect(() => {
    if (template) {
      setName(template.name);
      setIcon(template.icon);
      setGoalType(template.goalType);
      if (template.goalValue) {
        setGoalValue(template.goalValue.toString());
      }
      if (template.repeatDays && template.repeatDays.length > 0) {
        setRepeatDays(template.repeatDays);
      }
      if (template.suggestedTime) {
        // Parse suggested time (HH:MM format)
        const [hours, minutes] = template.suggestedTime.split(":").map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0);
        setReminderTime(time);
      }
    }
  }, [template]);

  const toggleDay = (day: string) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setNameError("");

    if (!isValidHabitName(name)) {
      setNameError("Please enter a valid habit name (at least 3 characters)");
      return;
    }

    if (goalType !== "check" && !goalValue) {
      Alert.alert("Error", `Please enter a ${goalType} goal value`);
      return;
    }

    setSaving(true);
    try {
      const habitData: any = {
        name: name.trim(),
        icon,
        goalType,
        repeatDays: repeatDays.length > 0 ? repeatDays : DAYS,
      };

      if (goalType !== "check") {
        habitData.goalValue = parseInt(goalValue, 10);
      }

      if (reminderTime) {
        const hours = reminderTime.getHours().toString().padStart(2, "0");
        const minutes = reminderTime.getMinutes().toString().padStart(2, "0");
        habitData.reminderTime = `${hours}:${minutes}`;
      }

      const habitId = await addHabit(habitData);

      // Schedule notification if reminder time is set
      if (reminderTime && habitData.reminderTime) {
        await scheduleHabitNotification(
          habitId,
          name.trim(),
          habitData.reminderTime
        );
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create habit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
        >
          {/* Habit Name */}
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Habit Name
            </Text>
            <Input
              placeholder="e.g., Morning Run"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError("");
              }}
              error={nameError}
              containerStyle={{ marginTop: theme.spacing.sm }}
            />
          </Card>

          {/* Icon Selector */}
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Choose an Icon
            </Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiButton,
                    {
                      borderColor:
                        icon === emoji
                          ? theme.colors.primary
                          : theme.colors.border,
                      backgroundColor:
                        icon === emoji
                          ? theme.colors.primaryAlpha
                          : "transparent",
                    },
                  ]}
                  onPress={() => setIcon(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Goal Type */}
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Goal Type
            </Text>
            <View style={styles.goalTypeContainer}>
              <Chip
                label="Check"
                selected={goalType === "check"}
                onPress={() => setGoalType("check")}
                variant="primary"
              />
              <Chip
                label="Reps"
                selected={goalType === "reps"}
                onPress={() => setGoalType("reps")}
                variant="primary"
              />
              <Chip
                label="Time"
                selected={goalType === "time"}
                onPress={() => setGoalType("time")}
                variant="primary"
              />
            </View>

            {goalType !== "check" && (
              <Input
                placeholder={
                  goalType === "reps" ? "e.g., 10" : "e.g., 30 (minutes)"
                }
                value={goalValue}
                onChangeText={setGoalValue}
                keyboardType="numeric"
                containerStyle={{ marginTop: theme.spacing.md }}
              />
            )}
          </Card>

          {/* Reminder Time */}
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Reminder (Optional)
            </Text>
            <TouchableOpacity
              style={[
                styles.timeSelector,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.timeText,
                  {
                    color: reminderTime
                      ? theme.colors.text
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                {reminderTime
                  ? reminderTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select time"}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={reminderTime || new Date()}
                mode="time"
                is24Hour={false}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(Platform.OS === "ios");
                  if (selectedTime) {
                    setReminderTime(selectedTime);
                  }
                }}
              />
            )}
          </Card>

          {/* Repeat Days */}
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Repeat Days
            </Text>
            <Text
              style={[
                styles.sectionDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              {repeatDays.length === 0
                ? "Every day"
                : `${repeatDays.length} days selected`}
            </Text>
            <View style={styles.daysContainer}>
              {DAYS.map((day) => (
                <Chip
                  key={day}
                  label={day}
                  selected={repeatDays.includes(day)}
                  onPress={() => toggleDay(day)}
                  variant="primary"
                />
              ))}
            </View>
          </Card>

          {/* Save Button */}
          <Button
            title={saving ? "Creating Habit..." : "Create Habit"}
            onPress={handleSave}
            loading={saving}
            variant="primary"
            fullWidth
            style={styles.saveButton}
            icon={
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.textInverse}
              />
            }
          />
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
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
  },
  goalTypeContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 12,
  },
  timeText: {
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  saveButton: {
    marginTop: 8,
  },
});
