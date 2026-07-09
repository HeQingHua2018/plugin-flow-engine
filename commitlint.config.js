/**
 * Git提交规范配置
 * 格式：type:[空格]message
 * 示例：feat: 这是一个新的feature
 */

// 定义允许的提交类型
const types = [
  'feat', // 新功能
  'fix', // 修复bug
  'docs', // 文档更新
  'style', // 代码格式调整（非功能性变动）
  'refactor', // 代码重构
  'perf', // 性能优化
  'test', // 测试用例增加或修改
  'chore', // 构建流程或辅助工具变动
  'revert', // 代码回退
  'build', // 打包配置更新
  'release', // 版本发布
  'deploy', // 部署触发
];

// 提交类型规则配置
const commitTypeRules = [2, 'always', types]; // 级别2（错误），总是检查，允许的类型列表

module.exports = {
  extends: ['@commitlint/config-conventional'], // 继承常规的commitlint配置
  rules: {
    'type-enum': commitTypeRules, // 提交类型必须在允许列表中
    // 以下规则控制type和subject是否为空的行为
    // 'type-empty': [2, 'always'], // type不能为空，否则报错（当前未启用）
    // 'subject-empty': [2, 'always'], // subject不能为空，否则报错（当前未启用）

    // 'type-empty': [1, 'always'], // type不能为空，否则警告（当前未启用）
    // 'subject-empty': [1, 'always'], // subject不能为空，否则警告（当前未启用）

    'type-empty': [0, 'always'], // type可以为空（当前配置）
    'subject-empty': [0, 'always'], // subject可以为空（当前配置）

    // 提交信息格式：type(scope): subject
    // 注意：scope是可选的，具体格式取决于项目约定
  },
};

// 参考链接
// https://blog.csdn.net/dragonballs/article/details/126313307
// https://www.swvq.com/article/detail/959/

// 提交信息结构说明：
// <type>(<scope>): <subject>
// <空行>
// <body>
// <空行>
// <footer>

// type（必选）：提交的类型
// scope（可选）：本次提交的修改影响范围
// subject（必填）：本次提交的简短描述
// body（可选）：本次提交的详细描述
// footer（可选）：通常用于关联issue等元信息
