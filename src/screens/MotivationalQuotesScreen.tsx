import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/context/ThemeContext";
import type { RootStackParamList } from "@/src/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

interface MotivationalQuotesScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "MotivationalQuotes">;
}

export default function MotivationalQuotesScreen({
  navigation,
}: MotivationalQuotesScreenProps) {
  const { theme } = useTheme();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchRandomQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.quotable.io/random?tags=inspirational|motivational|success|wisdom"
      );
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const handleShare = async () => {
    if (!quote) return;
    try {
      await Share.share({
        message: `"${quote.content}"\n\n— ${quote.author}`,
      });
    } catch (error) {
      console.error("Error sharing quote:", error);
    }
  };

  const handleToggleFavorite = () => {
    if (!quote) return;
    const isFavorite = favorites.some((f) => f._id === quote._id);
    if (isFavorite) {
      setFavorites(favorites.filter((f) => f._id !== quote._id));
    } else {
      setFavorites([...favorites, quote]);
    }
  };

  const isFavorite = quote ? favorites.some((f) => f._id === quote._id) : false;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowFavorites(!showFavorites)}
          style={styles.headerButton}
        >
          <Ionicons
            name={showFavorites ? "arrow-back" : "heart"}
            size={24}
            color={theme.colors.primary}
          />
          {!showFavorites && favorites.length > 0 && (
            <View
              style={[styles.badge, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {showFavorites ? "Favorites" : "Daily Inspiration"}
        </Text>
        <View style={styles.headerButton} />
      </View>

      {showFavorites ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="heart-outline"
                size={64}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No favorites yet
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Tap the heart icon to save your favorite quotes
              </Text>
            </View>
          ) : (
            favorites.map((fav, index) => (
              <MotiView
                key={fav._id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "spring", delay: index * 100 }}
              >
                <Card style={styles.favoriteCard} elevation="sm">
                  <Text
                    style={[styles.quoteText, { color: theme.colors.text }]}
                  >
                    &quot;{fav.content}&quot;
                  </Text>
                  <Text
                    style={[
                      styles.authorText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    — {fav.author}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFavorites(favorites.filter((f) => f._id !== fav._id));
                    }}
                    style={styles.removeButton}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </Card>
              </MotiView>
            ))
          )}
        </ScrollView>
      ) : (
        <View style={styles.mainContent}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : quote ? (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              style={styles.quoteContainer}
            >
              <Card style={styles.quoteCard} elevation="lg">
                <Ionicons
                  name="chatbubble-ellipses"
                  size={48}
                  color={theme.colors.primaryLight}
                  style={styles.quoteIcon}
                />
                <Text style={[styles.mainQuote, { color: theme.colors.text }]}>
                  {quote.content}
                </Text>
                <Text
                  style={[
                    styles.mainAuthor,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  — {quote.author}
                </Text>
                <View style={styles.tags}>
                  {quote.tags.slice(0, 3).map((tag) => (
                    <View
                      key={tag}
                      style={[
                        styles.tag,
                        { backgroundColor: theme.colors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </MotiView>
          ) : null}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? theme.colors.error : theme.colors.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={fetchRandomQuote}
              style={[
                styles.actionButton,
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              disabled={loading}
            >
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>New Quote</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Ionicons
                name="share-social"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  quoteContainer: {
    marginBottom: 32,
  },
  quoteCard: {
    padding: 32,
    alignItems: "center",
  },
  quoteIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  mainQuote: {
    fontSize: 22,
    lineHeight: 32,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  mainAuthor: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 16,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    width: "auto",
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
  },
  favoriteCard: {
    padding: 20,
    marginBottom: 16,
    position: "relative",
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
