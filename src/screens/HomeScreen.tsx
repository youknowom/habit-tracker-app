import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHabitStore } from "@/src/store/habitStore";
import { Habit } from "@/src/types/habit";

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    habits,
    completions,
    loading,
    fetchHabits,
    fetchCompletions,
    toggleCompletion,
    getTodayCompletions,
    getCompletionRate,
  } = useHabitStore();

  useEffect(() => {
    fetchHabits();
    fetchCompletions();
  }, []);

  const todayCompletions = getTodayCompletions();
  const completionRate = getCompletionRate();
  const completedHabitIds = new Set(todayCompletions.map((c) => c.habitId));

  const handleToggle = async (habitId: string) => {
    await toggleCompletion(habitId);
    await fetchCompletions();
  };

  const renderHabit = ({ item }: { item: Habit }) => {
    const isCompleted = completedHabitIds.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.habitCard, isCompleted && styles.habitCardCompleted]}
        onPress={() => navigation.navigate("HabitDetail", { habitId: item.id })}
      >
        <View style={styles.habitHeader}>
          <Text style={styles.habitIcon}>{item.icon}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitStreak}>🔥 {item.streak} day streak</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkbox,
              isCompleted && styles.checkboxCompleted,
            ]}
            onPress={() => handleToggle(item.id)}
          >
            {isCompleted && <Ionicons name="checkmark" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Habits</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {todayCompletions.length} / {habits.length} completed
          </Text>
          <Text style={styles.percentageText}>{completionRate}%</Text>
        </View>
      </View>

      {loading && habits.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No habits yet</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddHabit")}
          >
            <Text style={styles.addButtonText}>Add Your First Habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                fetchHabits();
                fetchCompletions();
              }}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddHabit")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    color: "#666",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  list: {
    padding: 16,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitCardCompleted: {
    opacity: 0.7,
    backgroundColor: "#f0f0f0",
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  habitStreak: {
    fontSize: 14,
    color: "#666",
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

