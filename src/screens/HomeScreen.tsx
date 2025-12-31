import { SwipeableHabitCard } from "@/src/components/SwipeableHabitCard";
import { SyncStatusIndicator } from "@/src/components/SyncStatusIndicator";
import {
  Badge,
  EmptyState,
  LoadingSpinner,
  ProgressRing,
} from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { useHabits } from "@/src/hooks/useHabits";
import { Habit } from "@/src/types/habit";
import { HomeScreenNavigationProp } from "@/src/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme } = useTheme();
  const {
    habits,
    todayCompletions,
    completionRate,
    isAllCompleted,
    loading,
    fetchHabits,
    fetchCompletions,
    toggleCompletion,
    isHabitCompleted,
    deleteHabit,
  } = useHabits();

  const confettiRef = useRef<any>(null);
  const prevCompletionRef = useRef(isAllCompleted);

  useEffect(() => {
    fetchHabits();
    fetchCompletions();
  }, []);

  useEffect(() => {
    // Trigger confetti when all habits are completed
    if (isAllCompleted && !prevCompletionRef.current && habits.length > 0) {
      confettiRef.current?.start();
    }
    prevCompletionRef.current = isAllCompleted;
  }, [isAllCompleted, habits.length]);

  const handleToggle = async (habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleCompletion(habitId);
    await fetchCompletions();
  };

  const completedHabitIds = new Set(todayCompletions.map((c) => c.habitId));

  const handleEdit = (habitId: string) => {
    navigation.navigate("EditHabit", { habitId });
  };

  const handleDelete = async (habitId: string) => {
    // Show confirmation alert
    if (confirm(`Are you sure you want to delete this habit?`)) {
      await deleteHabit(habitId);
      await fetchHabits();
    }
  };

  const renderHabit = ({ item, index }: { item: Habit; index: number }) => {
    const isCompleted = completedHabitIds.has(item.id);

    return (
      <SwipeableHabitCard
        habit={item}
        isCompleted={isCompleted}
        index={index}
        onPress={() => navigation.navigate("HabitDetail", { habitId: item.id })}
        onEdit={() => handleEdit(item.id)}
        onDelete={() => handleDelete(item.id)}
      >
        <View style={styles.habitContent}>
          <View style={styles.habitLeft}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryAlpha },
              ]}
            >
              <Text style={styles.habitIcon}>{item.icon}</Text>
            </View>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <View style={styles.habitMeta}>
                {item.streak > 0 && (
                  <Badge
                    label={`🔥 ${item.streak}`}
                    variant="warning"
                    size="small"
                  />
                )}
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => handleToggle(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MotiView
              animate={{ scale: isCompleted ? [1, 1.2, 1] : 1 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isCompleted
                      ? theme.colors.success
                      : theme.colors.border,
                    backgroundColor: isCompleted
                      ? theme.colors.success
                      : "transparent",
                  },
                ]}
              >
                {isCompleted && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.textInverse}
                  />
                )}
              </View>
            </MotiView>
          </Pressable>
        </View>
      </SwipeableHabitCard>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        ref={confettiRef}
        fadeOut
      />

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.greeting, { color: theme.colors.textSecondary }]}
            >
              Today&apos;s Progress
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {isAllCompleted && habits.length > 0
                ? "🎉 All Done!"
                : `${todayCompletions.length}/${habits.length} Completed`}
            </Text>
            <View style={styles.syncIndicatorWrapper}>
              <SyncStatusIndicator />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {habits.length > 0 && (
          <View style={styles.progressSection}>
            <ProgressRing
              progress={completionRate}
              size={100}
              strokeWidth={8}
            />
            <View style={styles.statsText}>
              <Text
                style={[
                  styles.statsLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Keep it up!
              </Text>
              <Text style={[styles.statsValue, { color: theme.colors.text }]}>
                {isAllCompleted
                  ? "Perfect day! 🌟"
                  : `${habits.length - todayCompletions.length} left`}
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => navigation.navigate("TemplateLibrary")}
          >
            <Ionicons name="apps" size={20} color={theme.colors.primary} />
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Templates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => navigation.navigate("MotivationalQuotes")}
          >
            <Ionicons name="bulb" size={20} color={theme.colors.secondary} />
            <Text
              style={[styles.quickActionText, { color: theme.colors.text }]}
            >
              Inspiration
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading && habits.length === 0 ? (
        <LoadingSpinner text="Loading your habits..." />
      ) : habits.length === 0 ? (
        <EmptyState
          icon="rocket-outline"
          title="Start Building Habits"
          description="Create your first habit and start tracking your progress towards a better you."
          actionLabel="Create Habit"
          onAction={() => navigation.navigate("AddHabit")}
        />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabit}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                fetchHabits();
                fetchCompletions();
              }}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      {/* FAB */}
      <MotiView
        from={{ scale: 0, rotate: "-180deg" }}
        animate={{ scale: 1, rotate: "0deg" }}
        transition={{ type: "spring", damping: 15, stiffness: 150, delay: 300 }}
      >
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("AddHabit")}
        >
          <Ionicons name="add" size={32} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  syncIndicatorWrapper: {
    marginTop: 8,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  statsText: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  habitCard: {
    marginBottom: 12,
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  habitLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  habitIcon: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
    gap: 4,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
  },
  habitMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
