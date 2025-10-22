---
title: 自定义插件开发规范
order: 2
toc: menu
---

## 总览

Plugin Flow Engine 通过“节点插件”实现流程的可扩展与解耦。外部项目可以：
- 注册自定义插件（实现或继承 `BaseNodePlugin`）
- 注入或覆写节点的表单 `schema`
- 注入自定义表单控件组件[widgets.md](./widgets)
- 替换内置插件的路由/执行策略
- 插件的 `getNodeFormConfig` 除了返回 `schema`，还可以同时返回 `widgets`，在注册插件时会被自动注入。
- 相关类型速查：参见 [Node](./types#node)、[Edge](./types#edge)、[ExecutionHistory](./types#executionhistory)、[NodeConfig](./types#nodeconfig)


## 注册自定义插件

- 获取插件管理器并注册你的插件：
```ts
import { useFlowEngine, PluginManagerInstance } from 'plugin-flow-engine';
import { MyNodePlugin } from './plugins/MyNodePlugin';

const {engine} = useFlowEngine();
// 方法一：
// 注册单个插件
engine.getPluginManager().registerPlugin(new MyNodePlugin());
// 批量注册多个插件
engine.getPluginManager().registerAllPlugin([new MyNodePlugin(), new MyNodePlugin2()]);
// 方法二：
// 注册单个插件
PluginManagerInstance().registerPlugin(new MyNodePlugin());
// 批量注册多个插件
PluginManagerInstance().registerAllPlugin([new MyNodePlugin(), new MyNodePlugin2()]);

```


## 自定义插件开发

- 推荐继承 `BaseNodePlugin`，实现必要的钩子（类型与名称必填）：
```ts
import { BaseNodePlugin, type Node, type Edge, type ExecutionHistory, NodeStatus } from 'plugin-flow-engine';

export class MyNodePlugin extends BaseNodePlugin {
  // 保证唯一，与 schema.type 保持一致 否则会覆盖重名的插件
  public nodeType = 'MyNode'; 
  public nodeTypeName = '我的自定义节点';

  // 可选：返回表单 schema，用于动态配置表单
  getNodeFormConfig() {
    return {
      schema: {
        type: this.nodeType,
        label: this.nodeTypeName,
        config: [
          {
            field: 'title',
            label: '标题',
            type: 'ant_Input', // 控件类型（规范化键）
            widget: 'ant_Input', // 指定控件映射键（优先级最高）
            formItemProps: { rules: [{ required: true, message: '请输入标题' }] },
            widgetProps: { placeholder: '请输入标题' },
          },
        ],
      },
      /**
       * 自定义控件映射（可选）
       * 当内置控件不满足需求时，可自定义映射
       * type 或则widget 都可以指定控件映射 widgetProps 会合并到控件 props 中
       * widget 优先级高于 type
       * 自定义控件必须实现 `WidgetProps<T>` 接口
       * type 或则 widget 值 必须与 widgets 中的键一致
       */
      widgets: {
        'ant_Input': AntInputWidget, 
      },
    };
  }
  // 可选：获取节点执行状态（默认根据 result 确定状态）
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<string | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  // 可选：决定是否执行当前节点（默认始终执行）
  async shouldExecuteNode(node: Node, engine: any): Promise<boolean> {
    return super.shouldExecuteNode(node, engine);
  }

  // 可选：自定义事件执行逻辑（默认调用节点 config.event）
  protected async invokeEvent(node: Node, engine: any, history?: ExecutionHistory): Promise<boolean> {
   return super.invokeEvent(node, engine, history);
  }

  // 可选：获取下一节点 ID（默认取第一条出边）
  async getNextNodeId(edges: Edge[], engine: any, history?: ExecutionHistory): Promise<string | null> {
    return super.getNextNodeId(edges, engine, history);
  }
  // 可选：节点执行完成后的回调（默认无操作）
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> {
    return super.onNodeComplete(node, pluginExecutionEngine, historyItem, result);
  }
}
```

- 在 `getNodeFormConfig` 中返回 `widgets` 以同时注册控件
```ts
import { JsonEditor } from './widgets/JsonEditor';
import { MySlider } from './widgets/MySlider';

export class MyNodePlugin extends BaseNodePlugin {
  public nodeType = 'MyNode';
  public nodeTypeName = '我的自定义节点';

  getNodeFormConfig() {
    return {
      schema: {
        type: this.nodeType,
        label: this.nodeTypeName,
        config: [
          { field: 'payload', label: '数据', widget: 'json-editor' },
          { field: 'level', label: '等级', widget: 'my-slider', widgetProps: { min: 1, max: 10 } },
        ],
      },
      widgets: {
        'json-editor': JsonEditor,
        'my-slider': MySlider,
      },
    };
  }
}
```

- 注册后，IDE 会自动注入该插件的 `schema` 与控件（如有），并在表单中可见。

## 注入或覆写节点的表单 schema

有三种常见方式：
- 直接注入或覆写某类型的 `schema`：
```ts
import { injectNodeSchema } from 'plugin-flow-engine';

injectNodeSchema('Action', {
  type: 'Action',
  label: '动作节点（覆写示例）',
  config: [
    { field: 'api_key', label: 'API 密钥', type: 'ant_Input', widgetProps: { placeholder: '请输入密钥' } },
    { field: 'retry', label: '重试次数', type: 'ant_Input', widgetProps: { placeholder: '默认为 0' }, defaultValue: 0 },
  ],
});
```
- 通过自定义插件的 `getNodeFormConfig` 返回你需要的 `schema`（上例已示范），并可在同一返回中提供 `widgets` 以自动注册控件。
- 用自定义插件替换内置插件（`nodeType` 相同会覆盖 Map 中的同名插件）：
```ts
PluginManagerInstance().registerPlugin(new MyActionPlugin()); // 如果 MyActionPlugin.nodeType === 'Action'，将替换内置 Action 插件
```

## 注入自定义控件
详细文档参考 [自定义控件](./widgets)

## 最佳实践与注意事项

- `nodeType` 唯一：同名将覆盖已有插件。
- `getNodeFormConfig` 返回的结构需符合 `NodeConfig` 与 `Schema` 类型；字段支持 `formItemProps` 与 `widgetProps`。若返回 `widgets`，会在注册插件时自动通过注入器注册。
- 事件执行失败时使用引擎的错误处理：引擎会写入 `executionHistory` 并打标 `hasFailed`。
- 规则评估用 `json-rules-engine`：可在节点或边的 `conditions` 中编写规则；失败会进入错误处理。
- 并行/合并/分支：参考内置插件 `ParallelNodePlugin`、`MergeNodePlugin`、`BranchNodePlugin` 的示例以实现复杂流转。

## 快速示例：启动时注册插件与控件
```ts
import { PluginManagerInstance, injectNodeSchema, injectWidget } from 'plugin-flow-engine';
import { MyNodePlugin } from './plugins/MyNodePlugin';
import { JsonEditor } from './widgets/JsonEditor';

// 注入控件
injectWidget('json-editor', JsonEditor);

injectNodeSchema('MyNode', {
  type: 'MyNode',
  label: '我的节点',
  config: [
    { field: 'payload', label: '数据', widget: 'json-editor' },
  ],
});

PluginManagerInstance().registerPlugin(new MyNodePlugin());
```

## 在插件中注册操作符

插件可以在自身的安装/初始化阶段统一注册与业务相关的操作符，供后续流程规则使用。

```ts
// plugins/my-plugin/setup.ts
import { injectOperator } from 'plugin-flow-engine';

export function setupMyPlugin() {
  // 示例：VIP 等级匹配（支持传入多个等级）
  injectOperator('isVIP', (factValue, jsonValue) => {
    const levels = Array.isArray(jsonValue) ? jsonValue : [jsonValue];
    return levels.includes(factValue);
  });

  // 示例：字符串包含（忽略大小写）
  injectOperator('iContains', (factValue, jsonValue) => {
    if (typeof factValue !== 'string' || typeof jsonValue !== 'string') return false;
    return factValue.toLowerCase().includes(jsonValue.toLowerCase());
  });
}
```

- 建议在插件 `setup/install` 阶段调用，以确保在引擎评估前完成注册。
- 操作符函数需同步返回 `boolean`，并保持纯函数特性，避免副作用。
- 若你的插件依赖外部配置，可在应用启动时先读取配置，再在 `setup` 中根据配置注册对应操作符。