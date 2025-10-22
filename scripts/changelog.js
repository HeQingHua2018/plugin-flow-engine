const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = process.cwd();

// 获取远程 Git 提交历史
const getGitCommits = () => {
  try {
    // 这里假设远程分支是 master，你可以根据实际情况修改
    const output = execSync(
      'git log origin/master --pretty=format:"- %s (%an, %ad)" --date=short',
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
  return `# Changelog

## [Unreleased]

### Commits
${commits}
`;
};

// 写入 changelog 文件
const writeChangelog = (content) => {
  const filePath = path.join(projectRoot, 'CHANGELOG.md');
  try {
    fs.writeFileSync(filePath, content);
    console.log('CHANGELOG.md 文件已成功生成。');
  } catch (error) {
    console.error('写入 CHANGELOG.md 文件时出错:', error.message);
  }
};

// 主函数
const main = () => {
  const commits = getGitCommits();
  const changelog = generateChangelog(commits);
  writeChangelog(changelog);
};

main();
