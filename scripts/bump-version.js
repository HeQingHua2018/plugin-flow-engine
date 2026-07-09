#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建交互式输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取新版本号（优先从环境变量读取）
let newVersion = process.env.VERSION || process.argv[2];

function updateVersion(version) {
  // 包列表
  const packages = ['core', 'common', 'ui', 'doc'];
  
  // 更新根目录 package.json
  const rootPkgPath = path.join(__dirname, '../package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  rootPkg.version = version;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
  console.log(`✓ 更新 ${rootPkg.name} 版本为 ${version}`);
  
  // 更新各个包的版本号和 workspace 依赖
  packages.forEach(pkg => {
    const pkgPath = path.join(__dirname, '../packages', pkg, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    
    // 更新版本号
    pkgJson.version = version;
    console.log(`✓ 更新 ${pkgJson.name} 版本为 ${version}`);
    
    // 更新 workspace 依赖引用
    if (pkgJson.dependencies) {
      Object.keys(pkgJson.dependencies).forEach(dep => {
        if (dep.startsWith('@chloehe/logic-engine-')) {
          pkgJson.dependencies[dep] = `workspace:^${version}`;
        }
      });
    }
    
    // 写回文件
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  });
  
  // 更新 changelog
  const changelogPath = path.join(__dirname, '../packages/doc/docs/versions/changelog.md');
  if (fs.existsSync(changelogPath)) {
    console.log(`✓ changelog 请使用 'pnpm changelog' 命令生成`);
  }
  
  console.log('\n✅ 版本更新完成！');
  console.log('请运行以下命令：');
  console.log('  pnpm install    # 更新 lockfile');
  console.log('  pnpm changelog  # 自动生成 changelog');
}

// 如果有版本号直接更新，否则提示输入
if (newVersion) {
  updateVersion(newVersion);
  rl.close();
} else {
  rl.question('请输入新版本号（例如 1.0.1）: ', (answer) => {
    if (answer.trim()) {
      updateVersion(answer.trim());
    } else {
      console.error('❌ 版本号不能为空');
    }
    rl.close();
  });
}
