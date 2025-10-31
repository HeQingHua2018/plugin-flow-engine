# 模块总览
## 安装

```bash
# 核心（不含 UI）
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# UI（React 环境，可选）
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom
```

2. 使用

```ts
import { PluginManagerInstance } from '@plugin-flow-engine/core';

// 在应用启动时注册自定义插件（示例）
PluginManagerInstance().registerAllPlugin([
  // new MyNodePlugin(),
  // new MyOtherPlugin(),
]);
```

## 特别说明

- 插件需实现 `pluginNodeType` 与 `pluginNodeTypeName`，并在返回表单 `schema` 时确保 `schema.type` 与之对齐。

## 模块入口

- [Core 模块](/modules/core)
- [UI 模块](/modules/ui)
- [Type 模块](/modules/type)

> 类型导入最佳实践：推荐使用子路径按需导入类型（`@plugin-flow-engine/type/common`、`@plugin-flow-engine/type/core`、`@plugin-flow-engine/type/ui`），示例参见 [Type 模块](/modules/type)
