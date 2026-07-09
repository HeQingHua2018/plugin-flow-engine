/*
 * @File: .fatherrc.ts
 * @desc: 工具包的 father 配置文件
 * @author: heqinghua
 * @date: 2026年07月03日 10:57:21
 * @example: 调用示例
 */
import { defineConfig } from 'father';
const path = require('path');
export default defineConfig({
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
});