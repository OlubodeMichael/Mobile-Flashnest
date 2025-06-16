const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  // Add custom configuration for Hermes
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx", "json"],
    assetExts: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
    unstable_enablePackageExports: true,
  },
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  },
});

module.exports = withNativeWind(config, { input: "./global.css" });
