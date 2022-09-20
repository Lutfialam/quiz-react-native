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
          '@/app': './app',
          '@/views': './app/views',
          '@/assets': './app/assets',
          '@/styles': './app/assets/styles',
          '@/components': './app/components',

          '@/features': './app/features',
          '@/types': './app/features/types',
          '@/state': './app/features/state',
          '@/hooks': './app/features/hooks',
          '@/models': './app/features/models',
          '@/helpers': './app/features/helpers',
          '@/services': './app/features/services',
        },
      },
    ],
  ],
};
