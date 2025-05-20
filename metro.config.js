const {getSentryExpoConfig} = require('@sentry/react-native/metro');
const {
    wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getSentryExpoConfig(__dirname);

const { transformer, resolver } = config;

// Enable package exports and conditions
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["react-native", "browser", "require"];

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer")
};

config.resolver = {
  ...resolver,
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "lottie"],
  sourceExts: [...resolver.sourceExts, "svg"]
};

const exportConfig = wrapWithReanimatedMetroConfig(config);

console.log("Using SVG transformer:", exportConfig.transformer.babelTransformerPath);
console.log("AssetExts:", exportConfig.resolver.assetExts);
console.log("SourceExts:", exportConfig.resolver.sourceExts);

module.exports = exportConfig;
