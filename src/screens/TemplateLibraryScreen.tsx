import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import {
  getPopularTemplates,
  templateLibrary,
} from "@/src/data/habitTemplates";
import type { RootStackParamList } from "@/src/types/navigation";
import { HabitTemplate } from "@/src/types/template";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TemplateLibraryScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "TemplateLibrary">;
}

export default function TemplateLibraryScreen({
  navigation,
}: TemplateLibraryScreenProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectTemplate = (template: HabitTemplate) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const repeatDaysStrings = template.repeatDays.map(
      (dayIndex) => dayNames[dayIndex]
    );

    navigation.navigate("AddHabit", {
      template: {
        name: template.name,
        icon: template.icon,
        description: template.description,
        goalType: template.goalType,
        goalValue: template.goalValue,
        suggestedTime: template.suggestedTime,
        repeatDays: repeatDaysStrings,
      },
    });
  };

  const renderTemplate = (template: HabitTemplate, index: number) => (
    <MotiView
      key={template.id}
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", delay: index * 50 }}
    >
      <TouchableOpacity
        onPress={() => handleSelectTemplate(template)}
        activeOpacity={0.7}
      >
        <Card style={styles.templateCard} elevation="md">
          <View style={styles.templateHeader}>
            <View
              style={[
                styles.templateIcon,
                {
                  backgroundColor:
                    templateLibrary.categories[template.category].color + "20",
                },
              ]}
            >
              <Text style={styles.templateEmoji}>{template.icon}</Text>
            </View>
            <View style={styles.templateInfo}>
              <Text style={[styles.templateName, { color: theme.colors.text }]}>
                {template.name}
              </Text>
              <Text
                style={[
                  styles.templateDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {template.description}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.templateMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[styles.metaText, { color: theme.colors.textSecondary }]}
              >
                {template.goalType === "time"
                  ? `${template.goalValue} min`
                  : template.goalType === "reps"
                  ? `${template.goalValue} reps`
                  : "Daily"}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      template.difficulty === "easy"
                        ? theme.colors.success + "20"
                        : template.difficulty === "medium"
                        ? theme.colors.warning + "20"
                        : theme.colors.error + "20",
                    color:
                      template.difficulty === "easy"
                        ? theme.colors.success
                        : template.difficulty === "medium"
                        ? theme.colors.warning
                        : theme.colors.error,
                  },
                ]}
              >
                {template.difficulty}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );

  const popularTemplates = getPopularTemplates(6);
  const categories = Object.entries(templateLibrary.categories);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Habit Templates
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Choose from proven habits to get started quickly
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search templates..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Popular Templates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={20} color={theme.colors.secondary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Most Popular
            </Text>
          </View>
          {popularTemplates.map((template, index) =>
            renderTemplate(template, index)
          )}
        </View>

        {/* Categories */}
        {categories.map(([key, category]) => (
          <View key={key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name={category.icon as any}
                size={20}
                color={category.color}
              />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {category.title}
              </Text>
              <Text
                style={[
                  styles.sectionCount,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {category.templates.length}
              </Text>
            </View>
            {category.templates.map((template, index) =>
              renderTemplate(template, index)
            )}
          </View>
        ))}
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
  },
  templateCard: {
    padding: 16,
    marginBottom: 12,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  templateEmoji: {
    fontSize: 24,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  templateDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  templateMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
