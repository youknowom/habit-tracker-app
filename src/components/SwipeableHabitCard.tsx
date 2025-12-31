import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { Habit } from "@/src/types/habit";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface SwipeableHabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  index: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export const SwipeableHabitCard: React.FC<SwipeableHabitCardProps> = ({
  habit,
  isCompleted,
  index,
  onPress,
  onEdit,
  onDelete,
  children,
}) => {
  const { theme } = useTheme();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const editTranslate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    const deleteTranslate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 0],
    });

    return (
      <View style={styles.actionsContainer}>
        <Animated.View
          style={[
            styles.actionButton,
            styles.editButton,
            { backgroundColor: theme.colors.secondary },
            { transform: [{ translateX: editTranslate }] },
          ]}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.actionButton,
            styles.deleteButton,
            { backgroundColor: theme.colors.error },
            { transform: [{ translateX: deleteTranslate }] },
          ]}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </Animated.View>
      </View>
    );
  };

  const handleSwipeableOpen = (direction: "left" | "right") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 400,
        delay: index * 50,
      }}
    >
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeableOpen}
        rightThreshold={40}
        friction={2}
        overshootRight={false}
      >
        <Card
          style={
            [
              styles.habitCard,
              isCompleted && {
                backgroundColor: theme.colors.habitCompleted,
                borderColor: theme.colors.habitCompletedBorder,
              },
            ] as any
          }
          elevation="md"
          pressable
          onPress={onPress}
        >
          {children}
        </Card>
      </Swipeable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 12,
  },
  actionButton: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  editButton: {
    marginRight: 8,
  },
  deleteButton: {},
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
