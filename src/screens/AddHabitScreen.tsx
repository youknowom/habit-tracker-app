import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHabitStore } from "@/src/store/habitStore";
import { isValidHabitName, isValidTime } from "@/src/utils/validators";
import { scheduleHabitNotification } from "@/src/services/notifications";

const EMOJI_OPTIONS = ["🏃", "📚", "💧", "🧘", "🍎", "💤", "🎯", "📝", "🎨", "🏋️"];

interface AddHabitScreenProps {
  navigation: any;
}

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [goalType, setGoalType] = useState<"check" | "reps" | "time">("check");
  const [goalValue, setGoalValue] = useState("");
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const addHabit = useHabitStore((state) => state.addHabit);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!isValidHabitName(name)) {
      Alert.alert("Error", "Please enter a valid habit name");
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Morning Run"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Icon</Text>
        <View style={styles.emojiContainer}>
          {EMOJI_OPTIONS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[styles.emojiButton, icon === emoji && styles.emojiButtonSelected]}
              onPress={() => setIcon(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Goal Type</Text>
        <View style={styles.goalTypeContainer}>
          <TouchableOpacity
            style={[styles.goalTypeButton, goalType === "check" && styles.goalTypeButtonSelected]}
            onPress={() => setGoalType("check")}
          >
            <Text style={[styles.goalTypeText, goalType === "check" && styles.goalTypeTextSelected]}>
              Check
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.goalTypeButton, goalType === "reps" && styles.goalTypeButtonSelected]}
            onPress={() => setGoalType("reps")}
          >
            <Text style={[styles.goalTypeText, goalType === "reps" && styles.goalTypeTextSelected]}>
              Reps
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.goalTypeButton, goalType === "time" && styles.goalTypeButtonSelected]}
            onPress={() => setGoalType("time")}
          >
            <Text style={[styles.goalTypeText, goalType === "time" && styles.goalTypeTextSelected]}>
              Time
            </Text>
          </TouchableOpacity>
        </View>

        {goalType !== "check" && (
          <>
            <Text style={styles.label}>
              Goal Value ({goalType === "reps" ? "reps" : "minutes"})
            </Text>
            <TextInput
              style={styles.input}
              placeholder={goalType === "reps" ? "e.g., 10" : "e.g., 30"}
              value={goalValue}
              onChangeText={setGoalValue}
              keyboardType="numeric"
            />
          </>
        )}

        <Text style={styles.label}>Reminder Time (Optional)</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={reminderTime ? styles.timeText : styles.placeholderText}>
            {reminderTime
              ? reminderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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

        <Text style={styles.label}>Repeat Days</Text>
        <View style={styles.daysContainer}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                repeatDays.includes(day) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text
                style={[
                  styles.dayText,
                  repeatDays.includes(day) && styles.dayTextSelected,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Habit"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 12,
  },
  emojiButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e3f2fd",
  },
  emoji: {
    fontSize: 24,
  },
  goalTypeContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  goalTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 8,
    alignItems: "center",
  },
  goalTypeButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#e3f2fd",
  },
  goalTypeText: {
    fontSize: 16,
    color: "#666",
  },
  goalTypeTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  timeText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 14,
    color: "#666",
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

