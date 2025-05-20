module.exports = {
  dependencies: {
    // 👇 disable native linking for expo modules causing plugin issues
    'expo-haptics': {
      platforms: {
        android: null,
      },
    },
    'expo-sensors': {
      platforms: {
        android: null,
      },
    },
    // repeat for any others causing issues
  },
};
