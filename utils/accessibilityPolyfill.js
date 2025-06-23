import { AccessibilityInfo } from "react-native";

// Store the original AccessibilityInfo
const originalAccessibilityInfo = AccessibilityInfo;

// Create a safe wrapper for the problematic method
const safeIsReduceMotionEnabled = () => {
  return new Promise((resolve) => {
    try {
      // Check if the original method exists and is callable
      if (
        originalAccessibilityInfo &&
        typeof originalAccessibilityInfo.isReduceMotionEnabled === "function"
      ) {
        originalAccessibilityInfo
          .isReduceMotionEnabled()
          .then(resolve)
          .catch((error) => {
            console.warn(
              "AccessibilityInfo.isReduceMotionEnabled failed:",
              error
            );
            resolve(false);
          });
      } else {
        // Fallback if the method doesn't exist
        console.warn(
          "AccessibilityInfo.isReduceMotionEnabled not available, using fallback"
        );
        resolve(false);
      }
    } catch (error) {
      console.warn("AccessibilityInfo.isReduceMotionEnabled crashed:", error);
      resolve(false);
    }
  });
};

// Create a safe wrapper for other methods
const safeIsScreenReaderEnabled = () => {
  return new Promise((resolve) => {
    try {
      if (
        originalAccessibilityInfo &&
        typeof originalAccessibilityInfo.isScreenReaderEnabled === "function"
      ) {
        originalAccessibilityInfo
          .isScreenReaderEnabled()
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
};

// Replace the problematic methods with safe versions
if (AccessibilityInfo) {
  AccessibilityInfo.isReduceMotionEnabled = safeIsReduceMotionEnabled;
  AccessibilityInfo.isScreenReaderEnabled = safeIsScreenReaderEnabled;
}

export default AccessibilityInfo;
