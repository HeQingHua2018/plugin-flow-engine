/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月21日 09:51:16
 * @example: 调用示例
 */
import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist', ignores: ['**/demo/**'] },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],
});
