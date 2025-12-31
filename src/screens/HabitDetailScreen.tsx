import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHabitStore } from "@/src/store/habitStore";
import { Habit } from "@/src/types/habit";
import { getLast7Days } from "@/src/utils/dateHelpers";

interface HabitDetailScreenProps {
  navigation: any;
  route: { params: { habitId: string } };
}

export default function HabitDetailScreen({ navigation, route }: HabitDetailScreenProps) {
  const { habitId } = route.params;
  const { habits, completions, deleteHabit, fetchCompletions } = useHabitStore();
  const habit = habits.find((h) => h.id === habitId);

  useEffect(() => {
    fetchCompletions();
  }, []);

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Habit not found</Text>
      </View>
    );
  }

  const last7Days = getLast7Days();
  const habitCompletions = completions.filter((c) => c.habitId === habitId);
  const completionMap = new Map(
    habitCompletions.map((c) => [c.date, c.completed])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteHabit(habitId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{habit.icon}</Text>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.streak}>🔥 {habit.streak} day streak</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <Text style={styles.sectionText}>
            {habit.goalType === "check"
              ? "Daily check"
              : `${habit.goalValue} ${habit.goalType === "reps" ? "reps" : "minutes"}`}
          </Text>
        </View>

        {habit.reminderTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminder</Text>
            <Text style={styles.sectionText}>{habit.reminderTime}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.daysContainer}>
            {last7Days.map((date, index) => {
              const completed = completionMap.get(date);
              return (
                <View key={date} style={styles.dayItem}>
                  <Text style={styles.dayLabel}>
                    {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>
                  <View
                    style={[
                      styles.dayIndicator,
                      completed && styles.dayIndicatorCompleted,
                    ]}
                  >
                    {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ff3b30" />
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  streak: {
    fontSize: 18,
    color: "#ff6b00",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#666",
  },
  sectionText: {
    fontSize: 18,
    color: "#000",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  dayItem: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  dayIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  dayIndicatorCompleted: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});

