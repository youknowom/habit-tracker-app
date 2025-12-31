import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },
  android: {
    regular: "Roboto",
    medium: "Roboto-Medium",
    semiBold: "Roboto-Medium",
    bold: "Roboto-Bold",
  },
  default: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },
});

export const typography = {
  // Display
  displayLarge: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
    letterSpacing: -0.2,
  },

  // Heading
  h1: {
    fontFamily: fontFamily.semiBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  h5: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500" as const,
  },

  // Body
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400" as const,
  },

  // Label
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 0.2,
  },

  // Caption
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    letterSpacing: 0.3,
  },
  captionSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "400" as const,
    letterSpacing: 0.3,
  },

  // Button
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600" as const,
    letterSpacing: 0.2,
  },
};

export type Typography = typeof typography;
