import { ThemeContext } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const theme = this.context?.theme;

      return (
        <View
          style={[
            styles.container,
            { backgroundColor: theme?.colors.background || "#F7F7FA" },
          ]}
        >
          <View style={styles.content}>
            <Ionicons
              name="alert-circle"
              size={64}
              color={theme?.colors.error || "#FF3B30"}
            />
            <Text
              style={[styles.title, { color: theme?.colors.text || "#1C1C1E" }]}
            >
              Oops! Something went wrong
            </Text>
            <Text
              style={[
                styles.message,
                { color: theme?.colors.textSecondary || "#666" },
              ]}
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme?.colors.primary || "#6C63FF" },
              ]}
              onPress={this.handleReset}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme?.colors.textInverse || "#FFFFFF" },
                ]}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
