import { defineConfig } from 'father';
const path = require('path');
export default defineConfig({
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
});