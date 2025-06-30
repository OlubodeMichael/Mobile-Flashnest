import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

// Device type detection
export const isTablet = width >= BREAKPOINTS.MD;
export const isPhone = width < BREAKPOINTS.MD;
export const isLargeTablet = width >= BREAKPOINTS.LG;

// Responsive sizing helpers
export const getResponsiveSize = (
  phoneSize,
  tabletSize,
  largeTabletSize = tabletSize
) => {
  if (isLargeTablet) return largeTabletSize;
  if (isTablet) return tabletSize;
  return phoneSize;
};

// Responsive spacing helpers
export const getResponsiveSpacing = (phoneSpacing, tabletSpacing) => {
  return isTablet ? tabletSpacing : phoneSpacing;
};

// Responsive text size helpers
export const getResponsiveTextSize = (phoneSize, tabletSize) => {
  return isTablet ? tabletSize : phoneSize;
};

// Card dimensions for different screen sizes
export const getCardDimensions = () => {
  if (isLargeTablet) {
    // Large iPad: Even larger card
    const cardWidth = Math.min(width * 0.5, 600);
    const cardHeight = cardWidth * 0.7;
    return { width: cardWidth, height: cardHeight };
  } else if (isTablet) {
    // iPad: Larger card with more space
    const cardWidth = Math.min(width * 0.6, 500);
    const cardHeight = cardWidth * 0.7;
    return { width: cardWidth, height: cardHeight };
  } else {
    // iPhone: Smaller card that fits well on screen
    const cardWidth = width * 0.85;
    const cardHeight = cardWidth * 0.7;
    return { width: cardWidth, height: cardHeight };
  }
};

// Container max widths for different screen sizes
export const getContainerMaxWidth = () => {
  if (isLargeTablet) return "max-w-4xl";
  if (isTablet) return "max-w-2xl";
  return "max-w-sm";
};

// Padding helpers for different screen sizes
export const getResponsivePadding = () => {
  if (isLargeTablet) return "px-12";
  if (isTablet) return "px-8";
  return "px-4";
};

export default {
  isTablet,
  isPhone,
  isLargeTablet,
  getResponsiveSize,
  getResponsiveSpacing,
  getResponsiveTextSize,
  getCardDimensions,
  getContainerMaxWidth,
  getResponsivePadding,
};
