import {
  useSharedValue,
  withSpring,
  WithSpringConfig,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";

const defaultSpringConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
};

const defaultTimingConfig: WithTimingConfig = {
  duration: 300,
};

export function useAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animateScale = (toValue: number, config?: WithSpringConfig) => {
    scale.value = withSpring(toValue, config || defaultSpringConfig);
  };

  const animateOpacity = (toValue: number, config?: WithTimingConfig) => {
    opacity.value = withTiming(toValue, config || defaultTimingConfig);
  };

  const animateTranslateY = (toValue: number, config?: WithSpringConfig) => {
    translateY.value = withSpring(toValue, config || defaultSpringConfig);
  };

  const pressIn = () => {
    animateScale(0.95);
  };

  const pressOut = () => {
    animateScale(1);
  };

  const fadeIn = () => {
    animateOpacity(1);
  };

  const fadeOut = () => {
    animateOpacity(0);
  };

  return {
    scale,
    opacity,
    translateY,
    animateScale,
    animateOpacity,
    animateTranslateY,
    pressIn,
    pressOut,
    fadeIn,
    fadeOut,
  };
}
