const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-sass-transformer"),
  },
  resolver: {
    sourceExts: [...sourceExts, "scss", "sass"],
  },
  server: {
    port: 1439,
    open: true,
    host: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);