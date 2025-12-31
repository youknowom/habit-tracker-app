import { ColorScheme, darkColors, lightColors } from "./colors";
import { radius, Radius } from "./radius";
import { shadows, Shadows } from "./shadows";
import { spacing, Spacing } from "./spacing";
import { typography, Typography } from "./typography";

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  shadows: Shadows;
  radius: Radius;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  shadows,
  radius,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  shadows,
  radius,
  isDark: true,
};

export type { ColorScheme, Radius, Shadows, Spacing, Typography };
