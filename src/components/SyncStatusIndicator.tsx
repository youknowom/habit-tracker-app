import { useTheme } from "@/src/context/ThemeContext";
import { offlineSyncService } from "@/src/services/offlineSync";
import { useOfflineStore } from "@/src/store/offlineStore";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function SyncStatusIndicator() {
  const { theme } = useTheme();
  const { isOnline, isSyncing, pendingWrites } = useOfflineStore();

  const pendingCount = pendingWrites.length;

  if (isOnline && !isSyncing && pendingCount === 0) {
    return null; // Don't show anything when everything is synced
  }

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSyncing) return "Syncing...";
    if (pendingCount > 0) return `${pendingCount} pending`;
    return "Synced";
  };

  const getStatusColor = () => {
    if (!isOnline) return theme.colors.error;
    if (isSyncing) return theme.colors.warning;
    if (pendingCount > 0) return theme.colors.info;
    return theme.colors.success;
  };

  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    if (!isOnline) return "cloud-offline";
    if (isSyncing) return "sync";
    if (pendingCount > 0) return "cloud-upload-outline";
    return "cloud-done";
  };

  const handlePress = () => {
    if (isOnline && pendingCount > 0) {
      offlineSyncService.forceSyncNow();
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring" }}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={!isOnline || isSyncing || pendingCount === 0}
        style={[styles.container, { backgroundColor: getStatusColor() + "20" }]}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <MotiView
            animate={{
              rotate: isSyncing ? "360deg" : "0deg",
            }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: isSyncing,
            }}
          >
            <Ionicons name={getIconName()} size={14} color={getStatusColor()} />
          </MotiView>
          <Text style={[styles.text, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
