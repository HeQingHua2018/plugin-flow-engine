/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 09:51:16
 * @example: 调用示例
 */
import { defineConfig } from 'father';

export default defineConfig({
  esm: { input: 'src', output: 'dist/esm' },
  cjs: { input: 'src', output: 'dist/cjs' },
});
