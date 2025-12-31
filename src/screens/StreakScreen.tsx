import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useHabitStore } from "@/src/store/habitStore";
import { Habit } from "@/src/types/habit";
import { useTheme } from "@/src/context/ThemeContext";
import { Card, Badge, EmptyState } from "@/src/components/ui";

export default function StreakScreen() {
  const { theme } = useTheme();
  const { habits, fetchHabits, loading } = useHabitStore();

  useEffect(() => {
    fetchHabits();
  }, []);

  const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return theme.colors.warning;
    if (streak >= 7) return theme.colors.secondary;
    return theme.colors.info;
  };

  const renderHabit = ({ item, index }: { item: Habit; index: number }) => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: index * 50 }}
      >
        <Card style={styles.habitCard}>
          <View style={styles.habitHeader}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={styles.habitIcon}>{item.icon}</Text>
            </View>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, { color: theme.colors.text }]}>{item.name}</Text>
              <Text style={[styles.habitGoal, { color: theme.colors.textSecondary }]}>
                {item.goalType === 'check' ? 'Daily check-in' : `${item.goalValue} ${item.goalType}`}
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color={getStreakColor(item.streak)} />
              <Text style={[styles.streakNumber, { color: getStreakColor(item.streak) }]}>
                {item.streak}
              </Text>
              <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>days</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((item.streak / 30) * 100, 100)}%`,
                  backgroundColor: getStreakColor(item.streak),
                },
              ]}
            />
          </View>
        </Card>
      </MotiView>
    );
  };

  const longestStreak = sortedHabits.length > 0 ? sortedHabits[0].streak : 0;
  const totalStreaks = sortedHabits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Streaks</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Keep the momentum going! 🔥
        </Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Ionicons name="trophy" size={32} color={theme.colors.warning} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Longest</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={32} color={theme.colors.secondary} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{totalStreaks}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Days</Text>
          </Card>
        </View>
      </View>

      {sortedHabits.length === 0 ? (
        <EmptyState
          icon="flame-outline"
          title="No Streaks Yet"
          description="Start completing habits to build your streaks!"
          actionLabel="View Habits"
          onAction={() => {}}
        />
      ) : (
        <FlatList
          data={sortedHabits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchHabits}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  habitCard: {
    padding: 16,
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitGoal: {
    fontSize: 12,
  },
  streakContainer: {
    alignItems: 'center',
    gap: 2,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  streakLabel: {
    fontSize: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
