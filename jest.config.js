module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  /*   preset: "ts-jest/presets/js-with-babel",
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  }, */
};
