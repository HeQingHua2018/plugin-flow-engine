/**
 * @File: 
 * @desc: 生成 CHANGELOG.md 文件
 * @author: heqinghua
 * @date: 2025年04月24日 11:35:07
 * @example: 调用示例
 **/
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = process.cwd();

// 新增：检测远程默认分支（main/master 等）
const getDefaultBranch = () => {
  try {
    const info = execSync('git remote show origin', { cwd: projectRoot });
    const match = info.toString().match(/HEAD branch: (.+)/);
    return match ? match[1].trim() : 'master';
  } catch (error) {
    console.warn('无法获取远程默认分支，回退使用 master:', error.message);
    return 'master';
  }
};

// 获取远程 Git 提交历史
const getGitCommits = () => {
  try {
    const branch = getDefaultBranch();
    // 确保远程最新
    execSync('git fetch origin', { cwd: projectRoot });
    const output = execSync(
      `git log origin/${branch} --pretty=format:"- %s (%an, %ad)" --date=short`,
      { cwd: projectRoot },
    );
    return output.toString();
  } catch (error) {
    console.error('获取远程 Git 提交历史时出错:', error.message);
    return '';
  }
};

// 生成 changelog 内容
const generateChangelog = (commits) => {
  return `# 更新日志\n\n## 最近更新\n${commits}\n`;
};

// 写入根目录 changelog 文件
const writeRootChangelog = (content) => {
  const filePath = path.join(projectRoot, 'CHANGELOG.md');
  try {
    fs.writeFileSync(filePath, content);
    console.log('CHANGELOG.md 文件已成功生成。');
  } catch (error) {
    console.error('写入 CHANGELOG.md 文件时出错:', error.message);
  }
};

// 写入 docs/changelog.md（用于 Dumi 文档展示）
const writeDocsChangelog = (content) => {
  const docsPath = path.join(projectRoot, 'docs', 'changelog.md');
  const frontmatter = `---\ntitle: 更新日志\norder: 999\ntoc: menu\n---\n\n`;
  try {
    fs.writeFileSync(docsPath, frontmatter + content);
    console.log('docs/changelog.md 文件已成功同步。');
  } catch (error) {
    console.error('写入 docs/changelog.md 文件时出错:', error.message);
  }
};

// 主函数
const main = () => {
  const commits = getGitCommits();
  const changelog = generateChangelog(commits);
  writeRootChangelog(changelog);
  writeDocsChangelog(changelog);
};

main();
