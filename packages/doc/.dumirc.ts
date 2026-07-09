import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  title: 'Plugin Flow Engine',
  outputPath: './docs-dist',
  base: '/',
  publicPath: '/',
  themeConfig: {
    name: 'Plugin Flow',
    description: '一个基于插件化架构的流程执行引擎',
    editLink: false,
    logo: 'https://flow.chloehe.cn/logo.png',
    footer: false,
    locales: [{ id: 'zh-CN', name: '简体中文' }],
    nav: [
      { title: '使用指南', link: '/guide' },
      { title: '核心模块', link: '/commons' },
      { title: '插件系统', link: '/plugins' },
      { title: '组件', link: '/components' },
      { title: '工具', link: '/utils' },
      { title: '流程演示', link: '/demo' },
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
  // 开启api解析
  apiParser: {},
   resolve: {
    //dumi解析配置
    docDirs: ["docs"], //默认解析文档目录
    // 启用api解析，指定的入口文件
    entryFile: '../ui/src/index.ts',
    atomDirs: [
       { type: 'components', dir: '../ui/src/components' },
       { type: "commons", dir: "../common/src" },
       { type: "utils", dir: "../utils/src" },
    ],
  },
  alias: {
    '@assets': path.join(__dirname, './assets'),
    '@chloehe/logic-engine-core': path.join(__dirname, '../core/src'),
    '@chloehe/logic-engine-ui': path.join(__dirname, '../ui/src'),
    '@chloehe/logic-engine-common': path.join(__dirname, '../common/src'),
    '@chloehe/logic-engine-react': path.join(__dirname, '../react/src'),
    '@chloehe/utils': path.join(__dirname, '../utils/src'),
  },
  styles: [
    `
      .dumi-default-previewer-demo {
        padding: 12px 16px !important; /* 自定义外层边距，替换40px 24px */
      }
      .dumi-default-previewer-demo > div {
        padding: 0 !important; /* 清除内层20px padding */
      }
    `,
  ],
});