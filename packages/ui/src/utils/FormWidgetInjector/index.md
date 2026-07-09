# 表单控件注入器

## 功能介绍

FormWidgetInjector 是一个底层注入器，专门负责注入和管理表单控件。它提供了一套完整的 API，用于注册自定义 UI 控件并在动态表单中使用

## 主要特性

- 支持自定义控件的注册与映射
- 实现发布-订阅模式，支持配置变更通知
- 提供懒加载初始化机制
- 支持集中式控件查找，具有兜底机制

## API 文档

### FormWidgetInjector 类

#### 构造函数
| 参数 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| initialWidgets | `Record<string, React.ElementType<any>>` | 初始自定义控件映射 | `{}` |

### 核心 API 函数

| 函数名 | 描述 | 签名 | 参数 | 返回值 |
|--------|------|------|------|--------|
| initializeInjector | 初始化注入器 | `initializeInjector(initialWidgets?: Record<string, React.ElementType<any>>): FormWidgetInjector` | - `initialWidgets`: 初始自定义控件映射 | 表单控件注入器实例 |
| getInjector | 获取注入器实例（懒加载初始化） | `getInjector(): FormWidgetInjector` | 无 | 表单控件注入器实例 |
| injectWidget | 注入自定义控件 | `injectWidget(type: string, widget: React.ElementType<any>): void` | - `type`: 控件类型<br>- `widget`: 自定义控件组件 | 无 |
| injectWidgets | 批量注入自定义控件 | `injectWidgets(widgets: WidgetMap): void` | - `widgets`: 自定义控件映射 | 无 |
| getWidgets | 获取所有自定义控件 | `getWidgets(): Record<string, React.ElementType<any>>` | 无 | 自定义控件映射 |
| subscribe | 订阅数据更新事件 | `subscribe(callback: () => void): () => void` | - `callback`: 回调函数，数据更新时调用 | 取消订阅函数 |
| getWidgetByType | 集中式控件查找 | `getWidgetByType(type: string, widget?: string): React.ElementType<any>` | - `type`: 控件类型<br>- `widget`: 可选的特定控件键 | React 组件元素类型 |

#### 控件查找优先级
1. 显式指定的 `widget` 键
2. `type` 键
3. `ant_Input` 兜底
4. 简单的 fallback Input 组件

## 使用示例

### 基本用法

```typescript
import { 
  initializeInjector, 
  injectWidget,
  getWidgets,
  WidgetKeys
} from '@chloehe/logic-engine-ui';
import React from 'react';
import { Input, Select } from 'antd';

const injector = initializeInjector();

injectWidget('customSelect', Select);

const widgets = getWidgets();
console.log('已注册的控件:', Object.keys(widgets));
```

### 批量注入

```typescript
import { injectWidgets } from '@chloehe/logic-engine-ui';

injectWidgets({
  'input': Input,
  'select': Select,
});
```

### 使用订阅机制

```typescript
import { getInjector } from '@chloehe/logic-engine-ui';

const injector = getInjector();

const unsubscribe = injector.subscribe(() => {
  console.log('控件配置已更新，重新渲染组件...');
});

// unsubscribe();
```

### 使用控件查找功能

```typescript
import { getWidgetByType } from '@chloehe/logic-engine-ui';

const InputWidget = getWidgetByType('input');
const SelectWidget = getWidgetByType('select', 'customSelect');

function MyFormComponent() {
  return (
    <div>
      <label>事件名称：</label>
      <InputWidget placeholder="请输入事件名称" />
      
      <label>动作类型：</label>
      <SelectWidget 
        options={[
          { value: 'http', label: 'HTTP请求' },
          { value: 'function', label: '函数调用' }
        ]} 
      />
    </div>
  );
}
```

## 设计优势

1. **分层设计**：底层控件管理器与上层表单注册表分离，职责清晰
2. **松耦合**：通过注入机制实现控件与表单的解耦
3. **响应式**：支持配置变更通知，便于实现响应式界面
4. **容错机制**：提供控件兜底机制，增强系统健壮性
5. **懒加载**：支持懒加载初始化，优化性能

## 最佳实践

1. 在应用初始化时，预先注册常用的表单控件
2. 对于动态加载的控件，在加载后立即注入
3. 使用订阅机制监听控件变更，实现界面的动态更新
4. 为自定义控件提供清晰的类型定义，便于维护
5. 在开发环境中，利用警告机制调试控件映射问题