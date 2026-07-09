#!/usr/bin/env node

/**
 * @File: create-plugin.js
 * @desc: 创建节点插件的脚本
 * @author: heqinghua
 * @date: 2025年11月19日 09:16:47
 * 
 * @使用方法:
 * 1. 本地开发使用:
 *    cd packages/core/src/scripts
 *    node create-plugin.js
 * 
 * 2. 全局命令使用 (打包后):
 *    a. 安装包: npm install -g @chloehe/logic-engine-core
 *    b. 或本地链接: npm link (在packages/core目录下)
 *    c. 运行命令: create-plugin
 *    d. 或使用npx: npx create-plugin
 * 
 * 3. 在项目的package.json中配置脚本:
 *    "scripts": {
 *      "create-plugin": "create-plugin"
 *    }
 *    然后运行: npm run create-plugin
 * 
 * 脚本会在当前目录创建插件，支持交互式输入插件信息，包括：
 * - 插件名称 (默认: MyCustomNodePlugin)
 * - 插件类型标识符 (默认: CUSTOM_NODE)
 * - 插件类型名称 (默认: 自定义节点)
 **/
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 默认值
const DEFAULT_PLUGIN_NAME = 'MyCustomNodePlugin';
const DEFAULT_PLUGIN_TYPE = 'CUSTOM_NODE';
const DEFAULT_PLUGIN_TYPE_NAME = '自定义节点';

// 交互式提问函数
function askQuestion(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} [${defaultValue}]: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

// 主函数
async function main() {
  console.log('=== 创建节点插件向导 ===\n');
  
  // 交互式获取插件信息
  const pluginName = await askQuestion('请输入插件名称', DEFAULT_PLUGIN_NAME);
  const pluginType = await askQuestion('请输入插件类型标识符', DEFAULT_PLUGIN_TYPE);
  const pluginTypeName = await askQuestion('请输入插件类型名称', DEFAULT_PLUGIN_TYPE_NAME);
  
  console.log('\n=== 插件信息确认 ===');
  console.log(`插件名称: ${pluginName}`);
  console.log(`插件类型标识符: ${pluginType}`);
  console.log(`插件类型名称: ${pluginTypeName}`);
  console.log('==================\n');

  // 确保插件名称以大写字母开头（遵循 PascalCase 命名约定）
  // 不自动添加Plugin后缀，使用用户输入的名称作为文件夹名
  const formattedPluginName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1);

  try {
    // 从外部模板文件读取内容
    // 兼容全局命令和本地命令两种运行方式
    let templatePath;
    try {
      // 尝试从包内路径读取（当作为全局命令运行时）
      const packageRoot = path.dirname(path.dirname(path.dirname(__filename)));
      templatePath = path.join(packageRoot, 'src', 'scripts', 'BaseNodePlugin.ts.tpl');
      if (!fs.existsSync(templatePath)) {
        // 如果包内路径不存在，尝试相对路径（当在源码目录运行时）
        templatePath = path.join(path.dirname(__filename), 'BaseNodePlugin.ts.tpl');
      }
    } catch (error) {
      // 兜底方案，尝试相对路径
      templatePath = path.join(path.dirname(__filename), 'BaseNodePlugin.ts.tpl');
    }
    let templateContent;
    try {
      templateContent = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error(`错误: 无法读取模板文件 ${templatePath}`);
      console.error(error.message);
      return;
    }

    // 替换模板中的占位符
    const currentDate = new Date().toLocaleDateString('zh-CN');
    // 从package.json获取author信息，如果没有则使用默认值
    let authorName = 'Auto Generated';
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.author) {
          if (typeof packageJson.author === 'string') {
            authorName = packageJson.author;
          } else if (packageJson.author.name) {
            authorName = packageJson.author.name;
          }
        }
      }
    } catch (error) {
      // 如果获取失败，使用默认值
    }
    
    const pluginContent = templateContent
      .replace(/\{\{formattedPluginName\}\}/g, formattedPluginName)
      .replace(/\{\{pluginType\}\}/g, pluginType)
      .replace(/\{\{pluginTypeName\}\}/g, pluginTypeName)
      .replace(/\{\{currentDate\}\}/g, currentDate)
      .replace(/\{\{authorName\}\}/g, authorName);

    // 在运行命令的当前目录下创建插件目录
    const currentDir = process.cwd();
    const targetDir = path.join(currentDir, formattedPluginName);

    if (fs.existsSync(targetDir)) {
      console.error(`错误: 目录 ${formattedPluginName} 已存在`);
      return;
    }

    fs.mkdirSync(targetDir, { recursive: true });

    // 写入插件文件
    const targetFile = path.join(targetDir, 'index.ts');
    fs.writeFileSync(targetFile, pluginContent);

    console.log(`插件 ${formattedPluginName} 已成功创建!`);
    console.log(`目录: ${targetDir}`);
    console.log(`文件: ${targetFile}`);
  } catch (error) {
    console.error('创建插件时发生错误:');
    console.error(error.message);
  } finally {
    // 关闭readline接口
    rl.close();
  }
}

// 执行主函数
main().catch(error => {
  console.error('执行过程中发生错误:');
  console.error(error.message);
  rl.close();
});