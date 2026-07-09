/**
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月31日 15:06:28
 * @example: 调用示例
 **/
/*
 * cz-customizable 配置文件（使用纯类型值，名称展示 emoji）
 */
module.exports = {
  // 定义提交时可选的类型（value 为纯类型，name 展示 emoji 文案）
  types: [
    { value: 'feat', name: '✨ feat:\tA new feature | 新功能' },
    { value: 'fix', name: '🐛 fix:\tA bug fix | Bug 修复' },
    { value: 'docs', name: '📝 docs:\tDocumentation only changes | 文档' },
    { value: 'style', name: '🎨 style:\tMarkup, white-space, formatting, missing semi-colons... | 风格' },
    { value: 'refactor', name: '♻️ refactor:\tA code change that neither fixes a bug or adds a feature | 代码重构' },
    { value: 'perf', name: '⚡️ perf:\tA code change that improves performance | 性能优化' },
    { value: 'test', name: '✅ test:\tAdding tests | 测试' },
    { value: 'chore', name: '🧱 chore:\tBuild process or auxiliary tool changes | 构建/工程依赖/工具' },
    { value: 'revert', name: '⏪ revert:\tRevert | 回退' },
    { value: 'build', name: '📦 build:\tBuild System | 打包构建' },
    { value: 'release', name: '🔖 release:\tCreate a release commit | 发行版' },
    { value: 'deploy', name: '🚀 deploy:\tTrigger deploy | 部署' },
  ],
  // 提交时的消息步骤配置
  messages: {
    type: '请选择提交类型(必填):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)',
  },
  // 跳过的问题配置
  skipQuestions: ['scope', 'body', 'footer'],
  // 提交描述的文字长度限制
  subjectLimit: 72,
};