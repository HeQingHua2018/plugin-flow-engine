/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 09:51:16
 * @example: 调用示例
 */
import { defineConfig } from 'father';
const path = require('path');

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  cjs: { output: 'lib' },
  esm: { output: 'es' },
});
