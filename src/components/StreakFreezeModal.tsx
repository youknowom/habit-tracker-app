import { Button, Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import { StreakFreezeService } from "@/src/services/streakFreeze";
import { useAuthStore } from "@/src/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StreakFreezeModalProps {
  visible: boolean;
  onClose: () => void;
  habitId: string;
  habitName: string;
  currentStreak: number;
  missedDate: string; // YYYY-MM-DD format
  onFreezeUsed: () => void;
}

export const StreakFreezeModal: React.FC<StreakFreezeModalProps> = ({
  visible,
  onClose,
  habitId,
  habitName,
  currentStreak,
  missedDate,
  onFreezeUsed,
}) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const [freezeTokens, setFreezeTokens] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alreadyFrozen, setAlreadyFrozen] = useState(false);

  const loadTokensAndStatus = useCallback(async () => {
    if (!user) return;

    try {
      const tokens = await StreakFreezeService.getUserFreezeTokens(user.uid);
      setFreezeTokens(tokens);

      const frozen = await StreakFreezeService.isFrozenDay(
        user.uid,
        habitId,
        missedDate
      );
      setAlreadyFrozen(frozen);
    } catch (error) {
      console.error("Error loading freeze status:", error);
    }
  }, [user, habitId, missedDate]);

  useEffect(() => {
    if (visible && user) {
      loadTokensAndStatus();
    }
  }, [visible, user, loadTokensAndStatus]);

  const handleUseFreezeToken = async () => {
    if (!user) return;

    if (freezeTokens <= 0) {
      Alert.alert(
        "No Tokens Available",
        "Earn freeze tokens by maintaining streaks! You get 1 token at 7, 14, 30, 60, and 90 day streaks.",
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await StreakFreezeService.useFreezeToken(user.uid, habitId, missedDate);

      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        "🎉 Streak Saved!",
        `You used a freeze token to protect your ${currentStreak}-day streak for "${habitName}". Keep going!`,
        [
          {
            text: "Awesome!",
            onPress: () => {
              onFreezeUsed();
              onClose();
            },
          },
        ]
      );
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to use freeze token");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.modalContent}
        >
          <Card
            style={{ backgroundColor: theme.colors.surface }}
            elevation="lg"
          >
            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.primaryAlpha },
                ]}
              >
                <Ionicons name="snow" size={32} color={theme.colors.primary} />
              </View>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Streak Freeze Token
            </Text>

            {/* Description */}
            <Text
              style={[
                styles.description,
                { color: theme.colors.textSecondary },
              ]}
            >
              Use a freeze token to skip one day without breaking your streak.
              Perfect for sick days, vacations, or when life gets busy!
            </Text>

            {/* Current Status */}
            <View
              style={[
                styles.statsContainer,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <View style={styles.stat}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {currentStreak}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Current Streak
                </Text>
              </View>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View style={styles.stat}>
                <Text
                  style={[styles.statValue, { color: theme.colors.secondary }]}
                >
                  {freezeTokens}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Tokens Available
                </Text>
              </View>
            </View>

            {/* Already frozen message */}
            {alreadyFrozen && (
              <View
                style={[
                  styles.warningBox,
                  { backgroundColor: theme.colors.successAlpha },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.success}
                />
                <Text
                  style={[styles.warningText, { color: theme.colors.success }]}
                >
                  This day is already protected!
                </Text>
              </View>
            )}

            {/* How to earn more */}
            <View
              style={[
                styles.infoBox,
                { backgroundColor: theme.colors.primaryAlpha },
              ]}
            >
              <Ionicons
                name="information-circle"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={[styles.infoText, { color: theme.colors.primary }]}>
                Earn tokens at 7, 14, 30, 60, 90 day streaks
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title={loading ? "Using..." : "Use Freeze Token"}
                onPress={handleUseFreezeToken}
                disabled={freezeTokens <= 0 || alreadyFrozen || loading}
                variant="primary"
                fullWidth
                icon={
                  <Ionicons
                    name="snow"
                    size={20}
                    color={
                      freezeTokens <= 0 || alreadyFrozen
                        ? theme.colors.textSecondary
                        : "#fff"
                    }
                  />
                }
              />
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                fullWidth
              />
            </View>
          </Card>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  divider: {
    width: 1,
    marginHorizontal: 16,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
});
