import { Badge, Button, Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { useHabitStore } from "@/src/store/habitStore";
import { getLast7Days } from "@/src/utils/dateHelpers";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface HabitDetailScreenProps {
  navigation: any;
  route: { params: { habitId: string } };
}

export default function HabitDetailScreen({
  navigation,
  route,
}: HabitDetailScreenProps) {
  const { habitId } = route.params;
  const { theme } = useTheme();
  const { habits, completions, deleteHabit, fetchCompletions } =
    useHabitStore();
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
    Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHabit(habitId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Card style={styles.headerCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <Text style={styles.icon}>{habit.icon}</Text>
            </View>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {habit.name}
            </Text>
            <Badge label={`${habit.streak} day streak`} variant="warning" />
          </Card>
        </MotiView>

        {/* Goal Card */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="flag-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Goal
            </Text>
          </View>
          <Text
            style={[styles.sectionText, { color: theme.colors.textSecondary }]}
          >
            {habit.goalType === "check"
              ? "Daily check-in"
              : `${habit.goalValue} ${
                  habit.goalType === "reps" ? "reps" : "minutes"
                } per day`}
          </Text>
        </Card>

        {habit.reminderTime && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Reminder
              </Text>
            </View>
            <Text
              style={[
                styles.sectionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {habit.reminderTime}
            </Text>
          </Card>
        )}

        {/* Last 7 Days Card */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Last 7 Days
            </Text>
          </View>
          <View style={styles.daysContainer}>
            {last7Days.map((date, index) => {
              const completed = completionMap.get(date);
              return (
                <MotiView
                  key={date}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", delay: index * 50 }}
                  style={styles.dayItem}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </Text>
                  <View
                    style={[
                      styles.dayIndicator,
                      { borderColor: theme.colors.border },
                      completed && {
                        backgroundColor: theme.colors.success,
                        borderColor: theme.colors.success,
                      },
                    ]}
                  >
                    {completed && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.textInverse}
                      />
                    )}
                  </View>
                </MotiView>
              );
            })}
          </View>
        </Card>

        {/* Delete Button */}
        <Button
          title="Delete Habit"
          onPress={handleDelete}
          variant="danger"
          fullWidth
          style={styles.deleteButton}
          icon={
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.textInverse}
            />
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  dayItem: {
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  dayIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 8,
  },
});
