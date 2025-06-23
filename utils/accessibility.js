import { AccessibilityInfo, Platform } from "react-native";

// Safe wrapper for isReduceMotionEnabled
export const safeIsReduceMotionEnabled = () => {
  return new Promise((resolve) => {
    try {
      // Check if AccessibilityInfo is available
      if (
        AccessibilityInfo &&
        typeof AccessibilityInfo.isReduceMotionEnabled === "function"
      ) {
        AccessibilityInfo.isReduceMotionEnabled()
          .then(resolve)
          .catch(() => {
            // Fallback to false if the method fails
            resolve(false);
          });
      } else {
        // Fallback if AccessibilityInfo is not available
        resolve(false);
      }
    } catch (error) {
      console.warn("AccessibilityInfo.isReduceMotionEnabled failed:", error);
      resolve(false);
    }
  });
};

// Safe wrapper for other AccessibilityInfo methods
export const safeAccessibilityInfo = {
  isReduceMotionEnabled: safeIsReduceMotionEnabled,

  // Add other methods as needed
  isScreenReaderEnabled: () => {
    return new Promise((resolve) => {
      try {
        if (
          AccessibilityInfo &&
          typeof AccessibilityInfo.isScreenReaderEnabled === "function"
        ) {
          AccessibilityInfo.isScreenReaderEnabled()
            .then(resolve)
            .catch(() => resolve(false));
        } else {
          resolve(false);
        }
      } catch (error) {
        console.warn("AccessibilityInfo.isScreenReaderEnabled failed:", error);
        resolve(false);
      }
    });
  },

  // Add a method to check if AccessibilityInfo is available
  isAvailable: () => {
    return (
      AccessibilityInfo &&
      typeof AccessibilityInfo.isReduceMotionEnabled === "function"
    );
  },
};

export default safeAccessibilityInfo;
