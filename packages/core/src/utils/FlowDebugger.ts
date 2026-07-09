/*
 * @File: FlowDebugger.ts
 * @desc: 流程调试器，支持断点、单步执行、远程调试和变量检查
 * @author: heqinghua
 * @date: 2026 年 04 月 10 日
 */

import type { PluginExecutionEngine } from './PluginExecutionEngine';
import type { ExecutionHistory, ExecutionContext } from '../types';

/**
 * 调试状态
 */
export enum DebugStatus {
  IDLE = 'idle', // 未调试
  RUNNING = 'running', // 运行中
  PAUSED = 'paused', // 已暂停
  STOPPED = 'stopped', // 已停止
}

/**
 * 调试器配置
 */
export interface DebuggerConfig {
  /**
   * 断点节点 ID 列表
   */
  breakpoints: string[];

  /**
   * 是否启用单步执行
   */
  stepByStep: boolean;

  /**
   * 单步执行延迟（毫秒）
   */
  stepDelay: number;

  /**
   * 是否记录执行轨迹
   */
  recordTrace: boolean;
}

/**
 * 默认调试器配置
 */
const defaultConfig: DebuggerConfig = {
  breakpoints: [],
  stepByStep: false,
  stepDelay: 500,
  recordTrace: true,
};

/**
 * 执行轨迹项
 */
export interface ExecutionTraceItem {
  nodeId: string;
  nodeName: string;
  timestamp: Date;
  context: ExecutionContext;
  duration?: number;
  status: string;
}

// ==================== 远程调试协议定义 ====================

/**
 * 调试消息类型
 */
export enum DebugMessageType {
  // 客户端 -> 服务器
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SET_BREAKPOINT = 'setBreakpoint',
  REMOVE_BREAKPOINT = 'removeBreakpoint',
  CLEAR_BREAKPOINTS = 'clearBreakpoints',
  GET_BREAKPOINTS = 'getBreakpoints',
  START_DEBUG = 'startDebug',
  PAUSE_DEBUG = 'pauseDebug',
  RESUME_DEBUG = 'resumeDebug',
  STEP_OVER = 'stepOver',
  STEP_OUT = 'stepOut',
  SET_VARIABLE = 'setVariable',
  GET_VARIABLES = 'getVariables',
  GET_CONTEXT = 'getContext',
  GET_STATUS = 'getStatus',
  GET_TRACE = 'getTrace',
  CLEAR_TRACE = 'clearTrace',
  GET_STATS = 'getStats',

  // 服务器 -> 客户端
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PAUSED_EVENT = 'pausedEvent',
  RESUMED_EVENT = 'resumedEvent',
  STOPPED_EVENT = 'stoppedEvent',
  BREAKPOINT_HIT = 'breakpointHit',
  VARIABLE_UPDATED = 'variableUpdated',
  ERROR = 'error',
}

/**
 * 调试消息基础接口
 */
export interface DebugMessage {
  /**
   * 消息类型
   */
  type: DebugMessageType;

  /**
   * 消息时间戳
   */
  timestamp: Date;

  /**
   * 消息 ID（用于请求 - 响应模式）
   */
  id?: string;
}

/**
 * 连接请求消息
 */
export interface ConnectRequest extends DebugMessage {
  type: DebugMessageType.CONNECT;
  payload: {
    /**
     * 客户端 ID
     */
    clientId: string;

    /**
     * 客户端名称
     */
    clientName: string;

    /**
     * 客户端版本
     */
    clientVersion?: string;
  };
}

/**
 * 连接响应消息
 */
export interface ConnectResponse extends DebugMessage {
  type: DebugMessageType.CONNECTED;
  payload: {
    /**
     * 服务器 ID
     */
    serverId: string;

    /**
     * 调试会话 ID
     */
    sessionId: string;

    /**
     * 当前调试状态
     */
    status: DebugStatus;

    /**
     * 当前节点 ID
     */
    currentNodeId?: string;

    /**
     * 断点列表
     */
    breakpoints: string[];
  };
}

/**
 * 断开连接消息
 */
export interface DisconnectMessage extends DebugMessage {
  type: DebugMessageType.DISCONNECT;
}

/**
 * 设置断点请求
 */
export interface SetBreakpointRequest extends DebugMessage {
  type: DebugMessageType.SET_BREAKPOINT;
  payload: {
    /**
     * 节点 ID
     */
    nodeId: string;
  };
}

/**
 * 移除断点请求
 */
export interface RemoveBreakpointRequest extends DebugMessage {
  type: DebugMessageType.REMOVE_BREAKPOINT;
  payload: {
    /**
     * 节点 ID
     */
    nodeId: string;
  };
}

/**
 * 清除所有断点请求
 */
export interface ClearBreakpointsRequest extends DebugMessage {
  type: DebugMessageType.CLEAR_BREAKPOINTS;
}

/**
 * 获取断点请求
 */
export interface GetBreakpointsRequest extends DebugMessage {
  type: DebugMessageType.GET_BREAKPOINTS;
}

/**
 * 断点列表响应
 */
export interface BreakpointsResponse extends DebugMessage {
  type: DebugMessageType.GET_BREAKPOINTS;
  payload: {
    breakpoints: string[];
  };
}

/**
 * 开始调试请求
 */
export interface StartDebugRequest extends DebugMessage {
  type: DebugMessageType.START_DEBUG;
}

/**
 * 暂停调试请求
 */
export interface PauseDebugRequest extends DebugMessage {
  type: DebugMessageType.PAUSE_DEBUG;
}

/**
 * 继续调试请求
 */
export interface ResumeDebugRequest extends DebugMessage {
  type: DebugMessageType.RESUME_DEBUG;
}

/**
 * 单步执行请求
 */
export interface StepOverRequest extends DebugMessage {
  type: DebugMessageType.STEP_OVER;
}

/**
 * 单步跳出请求
 */
export interface StepOutRequest extends DebugMessage {
  type: DebugMessageType.STEP_OUT;
}

/**
 * 设置变量请求
 */
export interface SetVariableRequest extends DebugMessage {
  type: DebugMessageType.SET_VARIABLE;
  payload: {
    /**
     * 变量名
     */
    name: string;

    /**
     * 变量值
     */
    value: any;
  };
}

/**
 * 获取变量请求
 */
export interface GetVariablesRequest extends DebugMessage {
  type: DebugMessageType.GET_VARIABLES;
  payload: {
    /**
     * 作用域（可选）
     */
    scope?: string;
  };
}

/**
 * 变量列表响应
 */
export interface VariablesResponse extends DebugMessage {
  type: DebugMessageType.GET_VARIABLES;
  payload: {
    /**
     * 变量列表
     */
    variables: Array<{
      name: string;
      value: any;
      type: string;
    }>;
  };
}

/**
 * 获取上下文请求
 */
export interface GetContextRequest extends DebugMessage {
  type: DebugMessageType.GET_CONTEXT;
}

/**
 * 执行上下文响应
 */
export interface ContextResponse extends DebugMessage {
  type: DebugMessageType.GET_CONTEXT;
  payload: {
    /**
     * 执行上下文
     */
    context: ExecutionContext | null;

    /**
     * 当前节点
     */
    currentNode?: {
      id: string;
      name: string;
    };
  };
}

/**
 * 获取状态请求
 */
export interface GetStatusRequest extends DebugMessage {
  type: DebugMessageType.GET_STATUS;
}

/**
 * 状态响应
 */
export interface StatusResponse extends DebugMessage {
  type: DebugMessageType.GET_STATUS;
  payload: {
    /**
     * 调试状态
     */
    status: DebugStatus;

    /**
     * 当前节点 ID
     */
    currentNodeId?: string;

    /**
     * 统计信息
     */
    stats: {
      totalTraces: number;
      breakpointsHit: number;
      pauseCount: number;
    };
  };
}

/**
 * 获取轨迹请求
 */
export interface GetTraceRequest extends DebugMessage {
  type: DebugMessageType.GET_TRACE;
}

/**
 * 轨迹响应
 */
export interface TraceResponse extends DebugMessage {
  type: DebugMessageType.GET_TRACE;
  payload: {
    traces: ExecutionTraceItem[];
  };
}

/**
 * 清除轨迹请求
 */
export interface ClearTraceRequest extends DebugMessage {
  type: DebugMessageType.CLEAR_TRACE;
}

/**
 * 获取统计请求
 */
export interface GetStatsRequest extends DebugMessage {
  type: DebugMessageType.GET_STATS;
}

/**
 * 统计响应
 */
export interface StatsResponse extends DebugMessage {
  type: DebugMessageType.GET_STATS;
  payload: {
    totalTraces: number;
    breakpointsHit: number;
    pauseCount: number;
  };
}

/**
 * 暂停事件消息
 */
export interface PausedEvent extends DebugMessage {
  type: DebugMessageType.PAUSED_EVENT;
  payload: {
    /**
     * 暂停原因
     */
    reason: 'breakpoint' | 'step' | 'pause' | 'error';

    /**
     * 当前节点 ID
     */
    currentNodeId: string;

    /**
     * 当前节点名称
     */
    currentNodeName: string;

    /**
     * 触发断点的节点 ID
     */
    breakpointNodeId?: string;
  };
}

/**
 * 继续事件消息
 */
export interface ResumedEvent extends DebugMessage {
  type: DebugMessageType.RESUMED_EVENT;
}

/**
 * 停止事件消息
 */
export interface StoppedEvent extends DebugMessage {
  type: DebugMessageType.STOPPED_EVENT;
  payload: {
    /**
     * 停止原因
     */
    reason: string;
  };
}

/**
 * 断点命中事件消息
 */
export interface BreakpointHitEvent extends DebugMessage {
  type: DebugMessageType.BREAKPOINT_HIT;
  payload: {
    nodeId: string;
    nodeName: string;
  };
}

/**
 * 变量更新事件消息
 */
export interface VariableUpdatedEvent extends DebugMessage {
  type: DebugMessageType.VARIABLE_UPDATED;
  payload: {
    name: string;
    value: any;
    oldValue: any;
  };
}

/**
 * 错误消息
 */
export interface ErrorMessage extends DebugMessage {
  type: DebugMessageType.ERROR;
  payload: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * 调试消息类型映射
 */
export type DebugRequest =
  | ConnectRequest
  | DisconnectMessage
  | SetBreakpointRequest
  | RemoveBreakpointRequest
  | ClearBreakpointsRequest
  | GetBreakpointsRequest
  | StartDebugRequest
  | PauseDebugRequest
  | ResumeDebugRequest
  | StepOverRequest
  | StepOutRequest
  | SetVariableRequest
  | GetVariablesRequest
  | GetContextRequest
  | GetStatusRequest
  | GetTraceRequest
  | ClearTraceRequest
  | GetStatsRequest;

export type DebugResponse =
  | ConnectResponse
  | DisconnectMessage
  | BreakpointsResponse
  | VariablesResponse
  | ContextResponse
  | StatusResponse
  | TraceResponse
  | PausedEvent
  | ResumedEvent
  | StoppedEvent
  | BreakpointHitEvent
  | VariableUpdatedEvent
  | ErrorMessage
  | StatsResponse;

/**
 * WebSocket 服务器配置
 */
export interface WebSocketServerConfig {
  /**
   * 监听端口
   */
  port: number;

  /**
   * 监听地址
   */
  host?: string;

  /**
   * 最大连接数
   */
  maxConnections?: number;

  /**
   * 心跳间隔（毫秒）
   */
  heartbeatInterval?: number;

  /**
   * 连接验证函数
   */
  onConnect?: (client: RemoteDebugClient) => Promise<boolean>;
}

/**
 * 远程调试客户端
 */
export interface RemoteDebugClient {
  /**
   * 客户端 ID
   */
  clientId: string;

  /**
   * 客户端名称
   */
  clientName: string;

  /**
   * 连接时间
   */
  connectedAt: Date;

  /**
   * 是否已认证
   */
  authenticated: boolean;

  /**
   * 发送消息
   */
  send(message: DebugResponse): void;

  /**
   * 断开连接
   */
  disconnect(): void;
}

/**
 * 流程调试器类
 * 提供流程执行时的断点、单步执行和变量检查功能
 */
export class FlowDebugger {
  private status: DebugStatus = DebugStatus.IDLE;
  private config: DebuggerConfig = { ...defaultConfig };
  private trace: ExecutionTraceItem[] = [];
  private pauseResolver?: () => void;
  private currentNodeId?: string;

  /**
   * 构造函数
   * @param initialConfig 初始配置
   */
  constructor(initialConfig?: Partial<DebuggerConfig>) {
    this.config = { ...defaultConfig, ...initialConfig };
  }

  /**
   * 获取调试状态
   */
  getStatus(): DebugStatus {
    return this.status;
  }

  /**
   * 获取调试配置
   */
  getConfig(): DebuggerConfig {
    return { ...this.config };
  }

  /**
   * 设置调试配置
   */
  setConfig(config: Partial<DebuggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 添加断点
   * @param nodeId 节点 ID
   */
  addBreakpoint(nodeId: string): void {
    if (!this.config.breakpoints.includes(nodeId)) {
      this.config.breakpoints.push(nodeId);
    }
  }

  /**
   * 移除断点
   * @param nodeId 节点 ID
   */
  removeBreakpoint(nodeId: string): void {
    this.config.breakpoints = this.config.breakpoints.filter(id => id !== nodeId);
  }

  /**
   * 清空所有断点
   */
  clearBreakpoints(): void {
    this.config.breakpoints = [];
  }

  /**
   * 获取所有断点
   */
  getBreakpoints(): string[] {
    return [...this.config.breakpoints];
  }

  /**
   * 开始调试
   */
  start(): void {
    this.status = DebugStatus.RUNNING;
    this.trace = [];
  }

  /**
   * 暂停执行
   */
  pause(): Promise<void> {
    this.status = DebugStatus.PAUSED;

    return new Promise(resolve => {
      this.pauseResolver = resolve;
    });
  }

  /**
   * 继续执行
   */
  resume(): void {
    if (this.pauseResolver) {
      this.pauseResolver();
      this.pauseResolver = undefined;
    }
    this.status = DebugStatus.RUNNING;
  }

  /**
   * 停止调试
   */
  stop(): void {
    this.status = DebugStatus.STOPPED;
    this.trace = [];
    this.currentNodeId = undefined;
  }

  /**
   * 检查是否应该在当前节点暂停
   * @param nodeId 节点 ID
   * @returns 是否应该暂停
   */
  shouldPause(nodeId: string): boolean {
    return this.config.breakpoints.includes(nodeId) && this.status === DebugStatus.RUNNING;
  }

  /**
   * 等待暂停（如果当前在断点上）
   */
  async waitForPause(): Promise<void> {
    if (this.status === DebugStatus.PAUSED && this.pauseResolver) {
      return new Promise(resolve => {
        this.pauseResolver = resolve;
      });
    }
  }

  /**
   * 记录执行轨迹
   * @param nodeId 节点 ID
   * @param nodeName 节点名称
   * @param context 执行上下文
   * @param duration 执行时长
   * @param status 执行状态
   */
  recordTrace(
    nodeId: string,
    nodeName: string,
    context: ExecutionContext,
    duration?: number,
    status: string = 'unknown'
  ): void {
    if (!this.config.recordTrace) {
      return;
    }

    this.trace.push({
      nodeId,
      nodeName,
      timestamp: new Date(),
      context,
      duration,
      status,
    });
  }

  /**
   * 获取执行轨迹
   */
  getTrace(): ExecutionTraceItem[] {
    return [...this.trace];
  }

  /**
   * 清空执行轨迹
   */
  clearTrace(): void {
    this.trace = [];
  }

  /**
   * 获取当前节点
   */
  getCurrentNodeId(): string | undefined {
    return this.currentNodeId;
  }

  /**
   * 设置当前节点
   */
  setCurrentNodeId(nodeId: string | undefined): void {
    this.currentNodeId = nodeId;
  }

  /**
   * 检查节点是否在断点列表中
   * @param nodeId 节点 ID
   */
  isBreakpoint(nodeId: string): boolean {
    return this.config.breakpoints.includes(nodeId);
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalTraces: number;
    breakpointsHit: number;
    pauseCount: number;
  } {
    return {
      totalTraces: this.trace.length,
      breakpointsHit: this.config.breakpoints.length,
      pauseCount: this.pauseCount,
    };
  }

  /**
   * 暂停次数计数
   */
  private pauseCount: number = 0;

  /**
   * 增加暂停次数
   */
  incrementPauseCount(): void {
    this.pauseCount++;
  }
}

// ==================== 远程调试管理器 ====================

/**
 * 远程调试会话
 */
export interface RemoteDebugSession {
  /**
   * 会话 ID
   */
  sessionId: string;

  /**
   * 调试器实例
   */
  debugger: FlowDebugger;

  /**
   * 客户端列表
   */
  clients: Map<string, RemoteDebugClient>;

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 最后活动时间
   */
  lastActivityAt: Date;

  /**
   * 是否活跃
   */
  isActive: boolean;
}

/**
 * 远程调试服务器
 */
export class RemoteDebugServer {
  private serverId: string;
  private sessions: Map<string, RemoteDebugSession> = new Map();
  private clients: Map<string, RemoteDebugClient> = new Map();
  private config: WebSocketServerConfig;
  private heartbeatTimer?: NodeJS.Timeout;
  private debugMessageHandler?: (message: DebugMessage) => void;

  constructor(config: Partial<WebSocketServerConfig> = {}) {
    this.serverId = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.config = {
      port: 9229,
      host: 'localhost',
      maxConnections: 10,
      heartbeatInterval: 30000,
      ...config,
    };
  }

  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    // 检查是否已启动
    if (this.heartbeatTimer) {
      throw new Error('调试服务器已在运行中');
    }

    // 创建默认会话
    const defaultSession = this.createSession();

    // 启动心跳
    this.startHeartbeat();

    console.log(`远程调试服务器已启动，监听 ${this.config.host}:${this.config.port}`);
  }

  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    if (!this.heartbeatTimer) {
      return;
    }

    // 清除心跳
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;

    // 断开所有客户端
    for (const client of Array.from(this.clients.values())) {
      client.disconnect();
    }
    this.clients.clear();

    // 关闭所有会话
    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      session.isActive = false;
      this.notifyClients(session, {
        type: DebugMessageType.STOPPED_EVENT,
        timestamp: new Date(),
        payload: { reason: '服务器关闭' },
      });
    }
    this.sessions.clear();

    console.log('远程调试服务器已停止');
  }

  /**
   * 创建调试会话
   */
  private createSession(): RemoteDebugSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const debuggerInstance = new FlowDebugger();

    const session: RemoteDebugSession = {
      sessionId,
      debugger: debuggerInstance,
      clients: new Map(),
      createdAt: new Date(),
      lastActivityAt: new Date(),
      isActive: true,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * 获取会话
   */
  getSession(sessionId: string): RemoteDebugSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * 获取所有会话
   */
  getAllSessions(): RemoteDebugSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * 移除客户端
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.disconnect();
      this.clients.delete(clientId);
    }
  }

  /**
   * 广播消息给所有客户端
   */
  broadcast(message: DebugResponse): void {
    for (const client of Array.from(this.clients.values())) {
      client.send(message);
    }
  }

  /**
   * 广播消息给其他客户端（不包括发送者）
   */
  broadcastToOthers(excludeClientId: string, message: DebugResponse): void {
    for (const [clientId, client] of Array.from(this.clients.entries())) {
      if (clientId !== excludeClientId) {
        client.send(message);
      }
    }
  }

  /**
   * 处理客户端消息
   */
  async handleMessage(clientId: string, message: DebugMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    // 更新最后活动时间
    for (const session of Array.from(this.sessions.values())) {
      session.lastActivityAt = new Date();
    }

    // 路由消息到相应的处理函数
    switch (message.type) {
      case DebugMessageType.SET_BREAKPOINT:
        await this.handleSetBreakpoint(client, message as SetBreakpointRequest);
        break;
      case DebugMessageType.REMOVE_BREAKPOINT:
        await this.handleRemoveBreakpoint(client, message as RemoveBreakpointRequest);
        break;
      case DebugMessageType.CLEAR_BREAKPOINTS:
        await this.handleClearBreakpoints(client, message as ClearBreakpointsRequest);
        break;
      case DebugMessageType.GET_BREAKPOINTS:
        await this.handleGetBreakpoints(client, message as GetBreakpointsRequest);
        break;
      case DebugMessageType.START_DEBUG:
        await this.handleStartDebug(client, message as StartDebugRequest);
        break;
      case DebugMessageType.PAUSE_DEBUG:
        await this.handlePauseDebug(client, message as PauseDebugRequest);
        break;
      case DebugMessageType.RESUME_DEBUG:
        await this.handleResumeDebug(client, message as ResumeDebugRequest);
        break;
      case DebugMessageType.STEP_OVER:
        await this.handleStepOver(client, message as StepOverRequest);
        break;
      case DebugMessageType.GET_CONTEXT:
        await this.handleGetContext(client, message as GetContextRequest);
        break;
      case DebugMessageType.GET_STATUS:
        await this.handleGetStatus(client, message as GetStatusRequest);
        break;
      case DebugMessageType.GET_TRACE:
        await this.handleGetTrace(client, message as GetTraceRequest);
        break;
      case DebugMessageType.CLEAR_TRACE:
        await this.handleClearTrace(client, message as ClearTraceRequest);
        break;
      case DebugMessageType.GET_STATS:
        await this.handleGetStats(client, message as GetStatsRequest);
        break;
      default:
        client.send({
          type: DebugMessageType.ERROR,
          timestamp: new Date(),
          payload: {
            code: 'UNKNOWN_MESSAGE_TYPE',
            message: `未知消息类型：${message.type}`,
          },
        });
    }
  }

  /**
   * 处理设置断点
   */
  private async handleSetBreakpoint(
    client: RemoteDebugClient,
    message: SetBreakpointRequest
  ): Promise<void> {
    const { nodeId } = message.payload;

    // 获取默认会话的调试器
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.addBreakpoint(nodeId);

    client.send({
      type: DebugMessageType.GET_BREAKPOINTS,
      timestamp: new Date(),
      payload: {
        breakpoints: defaultSession.debugger.getBreakpoints(),
      },
    });
  }

  /**
   * 处理移除断点
   */
  private async handleRemoveBreakpoint(
    client: RemoteDebugClient,
    message: RemoveBreakpointRequest
  ): Promise<void> {
    const { nodeId } = message.payload;

    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.removeBreakpoint(nodeId);

    client.send({
      type: DebugMessageType.GET_BREAKPOINTS,
      timestamp: new Date(),
      payload: {
        breakpoints: defaultSession.debugger.getBreakpoints(),
      },
    });
  }

  /**
   * 处理清除所有断点
   */
  private async handleClearBreakpoints(
    client: RemoteDebugClient,
    message: ClearBreakpointsRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.clearBreakpoints();

    client.send({
      type: DebugMessageType.GET_BREAKPOINTS,
      timestamp: new Date(),
      payload: {
        breakpoints: [],
      },
    });
  }

  /**
   * 处理获取断点
   */
  private async handleGetBreakpoints(
    client: RemoteDebugClient,
    message: GetBreakpointsRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    client.send({
      type: DebugMessageType.GET_BREAKPOINTS,
      timestamp: new Date(),
      payload: {
        breakpoints: defaultSession.debugger.getBreakpoints(),
      },
    });
  }

  /**
   * 处理开始调试
   */
  private async handleStartDebug(
    client: RemoteDebugClient,
    message: StartDebugRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.start();

    this.broadcastToOthers(client.clientId, {
      type: DebugMessageType.RESUMED_EVENT,
      timestamp: new Date(),
    });
  }

  /**
   * 处理暂停调试
   */
  private async handlePauseDebug(
    client: RemoteDebugClient,
    message: PauseDebugRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    await defaultSession.debugger.pause();

    const currentNodeId = defaultSession.debugger.getCurrentNodeId();
    this.broadcastToOthers(client.clientId, {
      type: DebugMessageType.PAUSED_EVENT,
      timestamp: new Date(),
      payload: {
        reason: 'pause',
        currentNodeId: currentNodeId || '',
        currentNodeName: currentNodeId || '',
      },
    });
  }

  /**
   * 处理继续调试
   */
  private async handleResumeDebug(
    client: RemoteDebugClient,
    message: ResumeDebugRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.resume();

    this.broadcastToOthers(client.clientId, {
      type: DebugMessageType.RESUMED_EVENT,
      timestamp: new Date(),
    });
  }

  /**
   * 处理单步执行
   */
  private async handleStepOver(
    client: RemoteDebugClient,
    message: StepOverRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    // 单步执行后自动暂停
    defaultSession.debugger.resume();
    await defaultSession.debugger.pause();
    defaultSession.debugger.incrementPauseCount();

    const currentNodeId = defaultSession.debugger.getCurrentNodeId();
    this.broadcastToOthers(client.clientId, {
      type: DebugMessageType.PAUSED_EVENT,
      timestamp: new Date(),
      payload: {
        reason: 'step',
        currentNodeId: currentNodeId || '',
        currentNodeName: currentNodeId || '',
      },
    });
  }

  /**
   * 处理获取上下文
   */
  private async handleGetContext(
    client: RemoteDebugClient,
    message: GetContextRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    // 注意：这里需要访问调试器的内部状态
    // 实际实现中可能需要暴露更多接口
    client.send({
      type: DebugMessageType.GET_CONTEXT,
      timestamp: new Date(),
      payload: {
        context: null,
        currentNode: defaultSession.debugger.getCurrentNodeId()
          ? {
              id: defaultSession.debugger.getCurrentNodeId()!,
              name: defaultSession.debugger.getCurrentNodeId()!,
            }
          : undefined,
      },
    });
  }

  /**
   * 处理获取状态
   */
  private async handleGetStatus(
    client: RemoteDebugClient,
    message: GetStatusRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    const stats = defaultSession.debugger.getStats();

    client.send({
      type: DebugMessageType.GET_STATUS,
      timestamp: new Date(),
      payload: {
        status: defaultSession.debugger.getStatus(),
        currentNodeId: defaultSession.debugger.getCurrentNodeId(),
        stats,
      },
    });
  }

  /**
   * 处理获取轨迹
   */
  private async handleGetTrace(
    client: RemoteDebugClient,
    message: GetTraceRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    client.send({
      type: DebugMessageType.GET_TRACE,
      timestamp: new Date(),
      payload: {
        traces: defaultSession.debugger.getTrace(),
      },
    });
  }

  /**
   * 处理清除轨迹
   */
  private async handleClearTrace(
    client: RemoteDebugClient,
    message: ClearTraceRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    defaultSession.debugger.clearTrace();

    client.send({
      type: DebugMessageType.GET_TRACE,
      timestamp: new Date(),
      payload: {
        traces: [],
      },
    });
  }

  /**
   * 处理获取统计
   */
  private async handleGetStats(
    client: RemoteDebugClient,
    message: GetStatsRequest
  ): Promise<void> {
    const defaultSession = this.sessions.values().next().value;
    if (!defaultSession) {
      client.send({
        type: DebugMessageType.ERROR,
        timestamp: new Date(),
        payload: {
          code: 'NO_SESSION',
          message: '没有可用的调试会话',
        },
      });
      return;
    }

    const stats = defaultSession.debugger.getStats();

    client.send({
      type: DebugMessageType.GET_STATS,
      timestamp: new Date(),
      payload: stats,
    });
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const interval = this.config.heartbeatInterval || 30000;

      // 检查超时连接（超过 2 倍心跳间隔未活动）
      for (const [clientId, client] of Array.from(this.clients.entries())) {
        if (now - client.connectedAt.getTime() > interval * 2) {
          this.removeClient(clientId);
        }
      }
    }, this.config.heartbeatInterval || 30000);
  }

  /**
   * 通知所有客户端
   */
  notifyClients(session: RemoteDebugSession, message: DebugResponse): void {
    for (const client of Array.from(session.clients.values())) {
      client.send(message);
    }
  }
}

// 默认调试器实例
export const flowDebugger = new FlowDebugger();
export const remoteDebugServer = new RemoteDebugServer();
export default flowDebugger;
