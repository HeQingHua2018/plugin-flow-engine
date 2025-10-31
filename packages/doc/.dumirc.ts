import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  title: 'Plugin Flow Engine',
  outputPath: './docs-dist',
  base: '/',
  publicPath: '/',
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
      { title: '模块', link: '/modules' },
      { title: '更新日志', link: '/versions' },
    ],
    hd: {
      rules: [
        { maxWidth: 375, mode: 'vw', options: [100, 750] },
        { minWidth: 376, maxWidth: 750, mode: 'vw', options: [100, 1500] },
      ],
    },
    deviceWidth: 375,
  },
   resolve: {
    //dumi解析配置
    docDirs: ["docs"], //默认解析文档目录
    atomDirs: [
       { type: 'component', dir: './components' },
    ],
  },
  alias: {
    '@assets': path.join(__dirname, './assets'),
    '@plugin-flow-engine/type': path.join(__dirname, '../type/src'),
    '@plugin-flow-engine/core': path.join(__dirname, '../core/src'),
    '@plugin-flow-engine/ui': path.join(__dirname, '../ui/src'),
  },
});