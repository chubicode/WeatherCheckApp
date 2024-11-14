module.exports = {
  testEnvironment: 'jsdom', // Use jsdom for browser-like environment
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transpile JSX and JS files
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
