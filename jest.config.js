const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  // 别名设置
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/components/$1'
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // 测试文件
  testMatch: ['<rootDir>/src/__tests__/**/*.spec.(ts|tsx|js)'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest', {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-typescript']
        ],
        plugins: ['@vue/babel-plugin-jsx']
      }
    ]
  }
}