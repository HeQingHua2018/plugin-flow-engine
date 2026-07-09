import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages/core/src'],
  moduleNameMapper: {
    '^@chloehe/logic-engine-common$': '<rootDir>/packages/common/src/index.ts',
    '^@chloehe/logic-engine-core$': '<rootDir>/packages/core/src/index.ts',
  },
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        target: 'esnext',
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        jsx: 'react-jsx',
        skipLibCheck: true,
        paths: {
          '@chloehe/logic-engine-common': ['./packages/common/src/index.ts'],
          '@chloehe/logic-engine-core': ['./packages/core/src/index.ts'],
        },
      },
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
