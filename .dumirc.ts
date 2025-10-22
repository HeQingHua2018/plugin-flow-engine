// .dumirc.ts
import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  title: 'Plugin Flow Engine', // 站点标题
  base: '/',
  publicPath: '/',
  outputPath: 'dist',
  themeConfig: {
    name: 'Plugin Flow Engine',
    description: '一个基于插件化架构的流程执行引擎',
    editLink: false,
    logo: false,
    footer: false,
    locales: [{ id: 'zh-CN', name: '简体中文' }],
    nav: [
      { title: '使用指南', link: '/guide' },
      { title: '组件', link: '/components' },
      { title: '工具', link: '/utils' },
      { title: '更新日志', link: '/changelog' },
    ],
    hd: {
      rules: [
        { maxWidth: 375, mode: 'vw', options: [100, 750] },
        { minWidth: 376, maxWidth: 750, mode: 'vw', options: [100, 1500] },
      ],
    },
    deviceWidth: 375,
  },
  apiParser: {},
  alias: {
    '@assets': path.resolve(__dirname, 'src/assets'),
  },
  resolve: {
    entryFile: './src/index.ts',
    atomDirs: [
      { type: 'component', dir: 'src/components' },
      { type: 'util', dir: 'src/utils' },
    ],
  },
  exportStatic: false,
});
