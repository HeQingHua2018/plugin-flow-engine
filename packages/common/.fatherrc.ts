import { defineConfig } from 'father';
const path = require('path');
export default defineConfig({
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
});