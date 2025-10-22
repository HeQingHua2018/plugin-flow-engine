/*
 * @File: type.d.ts
 * @desc: 插件化架构的核心类型定义，为整个Demo提供类型支持
 * @author: heqinghua
 * @date: 2025年09月18日
 */

import type { TopLevelCondition, Event } from "json-rules-engine";
import type { PluginExecutionEngine as PluginExecutionEngineType } from './utils/PluginExecutionEngine';

// 定义控件映射类型
export interface WidgetMap {
  [key: string]: React.ElementType;
}

// 定义节点配置项类型
export interface NodeConfig {
  schema: Schema;
  widgets?: WidgetMap;
  [key:string]:any
}
// 动态表单相关类型定义
export interface Field {
  /** 
   * 字段类型（规范化控件键）。用于提供默认控件与兜底逻辑。
   * - 推荐使用 Antd 命名：`ant_组件名[.子组件名]`，如 `ant_Input`、`ant_Input.Password`、`ant_Input.TextArea`、`ant_DatePicker.RangePicker`
   * - 支持自定义键：如 `rich-text`、`json-object`，需通过注入器注册后方可使用
   * - 渲染优先级：`widget` > `type` > `ant_Input`（兜底）
   * - 该字段常用于：提供语义化的默认控件与回退策略
   * @example type: "ant_Select"
   */
  type: string; 
  /** 
   * 指定渲染控件的映射键（优先级最高）。
   * - 用于覆盖默认 `type` 或选择自定义控件
   * - 需保证该键已在注入器中注册：`injectWidget(key, Component)`
   * - 未命中时按优先级回退：`type` → `ant_Input`
   * @example widget: "rich-text"
   */
  widget?: string; 
  /** 字段名称，对应表单控件的 name 属性 */
  field: string; 
  /** 字段标签，对应表单控件的 label 属性 */
  label: string; 
  /** 表单项属性，对应 FormItemProps 类型 */
  formItemProps?: Record<string, any>; 
  /** 对应表单控件的属性，如 options 等 */
  widgetProps?: Record<string, any>; 
  /** 字段默认值，对应表单控件的 initialValue 属性 */
  defaultValue?: any; 
  /** 字段描述，对应表单控件的 help 属性 */
  description?: string; 
  /** 依赖条件，用于动态显示/隐藏字段 */
  dependsOn?: {
    field: string; // 依赖的字段名称
    value: any | ((value: any) => boolean); // 依赖值或判断函数
  };
}

export interface Schema {
  type: string;
  label: string;
  config: Field[];
}


export type {
    TopLevelCondition, 
    Event,
    PluginExecutionEngineType,
}

/**
 * 节点状态枚举
 * 定义了节点在执行过程中可能的状态
 */
export enum NodeStatus {
  PENDING = 'pending', // 几点默认状态值
  RUNNING = 'running', // 执行中
  SUCCESS = 'success', // 成功
  FAILED = 'failed', // 失败
}


/**
 * 边类型枚举
 * 定义了流程中节点间连接的方向类型
 */
export enum EdgeType{
  INCOMING = 'in', // 入边
  OUTGOING = 'out', // 出边
  ALL = 'all' // 所有边
}

/**
 * 并行策略枚举
 * 定义并行节点的执行成功策略
 */
export enum ParallelStrategy {
  ALL = 'all', // 所有子节点执行成功才算成功
  ANY = 'any' // 任意一个子节点执行成功就算成功
}

/**
 * 迭代模式枚举
 * 定义迭代节点的执行模式
 */
export enum IterationMode {
  ALL_SUCCESS = 1, // 所有次数执行成功后才算成功
  ANY_SUCCESS = 2, // 成功一次也算成功
  ANY_FAILURE = 3 // 失败一次也算失败
}

/**
 * 节点接口
 * 表示流程中的一个可执行单元
 */
export interface Node {
  /** 节点唯一标识符 */
  id: string;
  /** 节点显示名称 */
  name: string;
  /** 
   * 节点类型
  */
  type: string;
  /** 节点配置信息 */
  config: {
    /** 节点执行条件，使用json-rules-engine的条件表达式 */
    conditions?: TopLevelCondition;
    /** 节点执行的事件 */
    event?: Event;
    /**
     * 迭代节点特有属性-默认1
     * 迭代次数
     */
    iteration_count?:number;
    /**
     * 迭代节点特有属性-默认ALL_SUCCESS
     * 使用IterationMode枚举定义迭代执行的行为模式
     */
    iteration_mode?: IterationMode;
    /**
     * 并行节点特有属性
     * 并行节点的执行策略 默认ALL
     * 使用ParallelStrategy枚举定义并行执行的成功策略
     */
    parallel_strategy?: ParallelStrategy;
    /** 其他自定义配置项 */
    [key: string]: any;
  };
}

/**
 * 变量定义接口
 * 描述流程上下文中变量的类型和元数据
 */
export interface Variable {
  /** 变量类型，如 "string", "number", "boolean", "object" 等 */
  type: string;
  /** 变量来源，如 "context", "input", "output" 等 */
  source: string;
  /** 变量描述信息 */
  description?: string;
  /** 变量默认值 */
  default?: any;
}

/**
 * 上下文配置接口
 * 定义流程执行过程中可用的变量及其描述
 */
export interface ContextConfig {
  /**
   * 上下文变量定义，用于描述流程中使用的变量及其元数据
   * 键为变量名，值为变量定义对象
   */
  variables: Record<string, Variable>;
}

/**
 * 边接口
 * 表示节点之间的连接关系
 */
export interface Edge {
  /** 边唯一标识符 */
  id: string;
  /** 源节点ID */
  source: string;
  /** 目标节点ID */
  target: string;
  /** 边标签，用于显示 */
  label?: string;
  /** 边的条件，决定是否走该分支 */
  conditions?: TopLevelCondition;
  /** 是否为默认分支，当没有其他条件满足时选择 */
  isDefault?: boolean;
  /** 优先级，值越小优先级越高，用于当多条边规则同时满足时的选择 */
  priority?: number;
}

/**
 * 全局配置接口
 * 定义流程执行的全局参数
 */
export interface GlobalConfig {
  /** 流程执行超时时间（毫秒） */
  timeout?: number;
  /** 最大执行深度，防止无限循环 */
  max_depth?: number;
  /** 其他自定义全局配置 */
  [key: string]: any;
}

/**
 * 执行上下文
 * 表示流程执行过程中的上下文数据
 */
export interface ExecutionContext {
  /** 上下文变量集合 */
  variables: Record<string, any>;

}

/**
 * 执行历史记录接口
 * 记录节点执行的详细信息
 */
export interface ExecutionHistory {
  /** 节点唯一标识符 */
  nodeId: string;
  /** 节点名称 */
  nodeName: string;
  /** 节点类型 */
  nodeType: string;
  /** 节点执行状态 */
  status: NodeStatus;
  /** 开始执行时间 */
  startTime?: Date;
  /** 结束执行时间 */
  endTime?: Date;
  /** 执行耗时（毫秒） */
  duration?: number;
  /** 执行前的上下文变量状态 */
  contextBefore?: Record<string, any>;
  /** 执行后的上下文变量状态 */
  contextAfter?: Record<string, any>;
  /** 执行的事件 */
  event?: Event;
  /** 执行的条件 */
  conditions?: TopLevelCondition;
  /** 事件执行结果 */
  eventResult?: any;
  /** 日志记录时间 */
  timestamp: Date;
  /** 引擎执行结果信息 */
  engineResult?: any;
  /** 分支决策信息 */
  decision?: {
    selectPath: string,
    conditions?: TopLevelCondition,
    isDefault?: boolean
  };
  /** 是否为流程结束节点 */
  is_end_node?: boolean;
  /**
   * 并行策略
   * ParallelStrategy.ALL: 所有分支成功才算成功
   * ParallelStrategy.ANY: 任一分支成功就算成功
   */
  parallel_strategy?: ParallelStrategy;
  /** 并行执行的边信息 */
  parallel_edges?: Array<{
    target: string,
    conditions?: TopLevelCondition,
    isDefault?: boolean
  }>;
}

/**
 * 流程定义接口
 * 完整描述一个流程的所有配置信息
 */
export interface FlowDefinition {
  /** 流程基本信息 */
  flow: {
    /** 流程唯一标识符 */
    id: string;
    /** 流程名称 */
    name: string;
    /** 流程版本号 */
    version: string;
    /** 流程描述 */
    description: string;
    /** 流程分类 */
    category: string;
    /** 流程状态是否启用 */
    enable: boolean;
    /** 创建日期 */
    create_date: string;
    /** 更新日期 */
    update_date: string;
    /** 是否自动执行流程 */
    auto?: boolean;
  };
  /** 流程上下文配置 */
  context: ContextConfig;
  /** 流程节点列表 */
  nodes: Node[];
  /** 流程边列表 */
  edges: Edge[];
  /** 流程全局配置 */
  global_config: GlobalConfig;
}