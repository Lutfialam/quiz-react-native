module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: true,
        verbose: false,
        blocklist: null,
        allowlist: null,
        allowUndefined: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@/components': './app/components',
          '@/services': './app/services',
          '@/assets': './app/assets',
          '@/models': './app/models',
          '@/styles': './app/styles',
          '@/types': './app/types',
          '@/views': './app/views',
          '@/state': './app/state',
          '@/app': './app',
        },
      },
    ],
  ],
};
