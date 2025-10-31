/*
 * @File: FlowError.ts
 * @desc: 流程执行引擎的统一错误处理类
 * @author: heqinghua
 * @date: 2025年01月27日
 */

/**
 * 错误代码枚举
 */
export enum FlowErrorCode {
  // 引擎相关错误
  ENGINE_NOT_INITIALIZED = 'ENGINE_NOT_INITIALIZED',
  ENGINE_EXECUTION_FAILED = 'ENGINE_EXECUTION_FAILED',
  
  // 节点相关错误
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  NODE_EXECUTION_FAILED = 'NODE_EXECUTION_FAILED',
  NODE_PLUGIN_NOT_FOUND = 'NODE_PLUGIN_NOT_FOUND',
  
  // 规则相关错误
  RULE_EVALUATION_FAILED = 'RULE_EVALUATION_FAILED',
  RULE_CONDITION_INVALID = 'RULE_CONDITION_INVALID',
  
  // 事件相关错误
  EVENT_EXECUTION_FAILED = 'EVENT_EXECUTION_FAILED',
  EVENT_METHOD_NOT_FOUND = 'EVENT_METHOD_NOT_FOUND',
  
  // 上下文相关错误
  CONTEXT_MANAGER_NOT_INITIALIZED = 'CONTEXT_MANAGER_NOT_INITIALIZED',
  CONTEXT_VARIABLE_NOT_FOUND = 'CONTEXT_VARIABLE_NOT_FOUND',
  
  // 实例相关错误
  INSTANCE_NOT_FOUND = 'INSTANCE_NOT_FOUND',
  INSTANCE_METHOD_NOT_FOUND = 'INSTANCE_METHOD_NOT_FOUND',
  
  // 流程相关错误
  FLOW_DEFINITION_INVALID = 'FLOW_DEFINITION_INVALID',
  FLOW_CIRCULAR_DEPENDENCY = 'FLOW_CIRCULAR_DEPENDENCY',
  FLOW_TIMEOUT = 'FLOW_TIMEOUT',
  
  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * 流程执行错误类
 * 提供统一的错误处理机制
 */
export class FlowExecutionError extends Error {
  public readonly code: FlowErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly nodeId?: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;
  public readonly originalError?: Error;

  constructor(
    message: string,
    code: FlowErrorCode = FlowErrorCode.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    options: {
      nodeId?: string;
      context?: Record<string, any>;
      originalError?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'FlowExecutionError';
    this.code = code;
    this.severity = severity;
    this.nodeId = options.nodeId;
    this.timestamp = new Date();
    this.context = options.context;
    this.originalError = options.originalError;

    // 确保堆栈跟踪正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FlowExecutionError);
    }
  }

  /**
   * 创建引擎未初始化错误
   */
  static engineNotInitialized(message = '引擎未初始化'): FlowExecutionError {
    return new FlowExecutionError(
      message,
      FlowErrorCode.ENGINE_NOT_INITIALIZED,
      ErrorSeverity.HIGH
    );
  }

  /**
   * 创建节点执行失败错误
   */
  static nodeExecutionFailed(
    nodeId: string,
    message: string,
    originalError?: Error
  ): FlowExecutionError {
    return new FlowExecutionError(
      `节点 ${nodeId} 执行失败: ${message}`,
      FlowErrorCode.NODE_EXECUTION_FAILED,
      ErrorSeverity.HIGH,
      { nodeId, originalError }
    );
  }

  /**
   * 创建插件未找到错误
   */
  static pluginNotFound(pluginNodeType: import('../type').PluginNodeType): FlowExecutionError {
    return new FlowExecutionError(
      `未找到节点类型 ${pluginNodeType} 对应的插件`,
      FlowErrorCode.NODE_PLUGIN_NOT_FOUND,
      ErrorSeverity.HIGH
    );
  }

  /**
   * 创建规则评估失败错误
   */
  static ruleEvaluationFailed(
    nodeId: string,
    message: string,
    originalError?: Error
  ): FlowExecutionError {
    return new FlowExecutionError(
      `节点 ${nodeId} 规则评估失败: ${message}`,
      FlowErrorCode.RULE_EVALUATION_FAILED,
      ErrorSeverity.MEDIUM,
      { nodeId, originalError }
    );
  }

  /**
   * 创建事件执行失败错误
   */
  static eventExecutionFailed(
    nodeId: string,
    eventType: string,
    message: string,
    originalError?: Error
  ): FlowExecutionError {
    return new FlowExecutionError(
      `节点 ${nodeId} 事件 ${eventType} 执行失败: ${message}`,
      FlowErrorCode.EVENT_EXECUTION_FAILED,
      ErrorSeverity.MEDIUM,
      { nodeId, originalError }
    );
  }

  /**
   * 创建实例未找到错误
   */
  static instanceNotFound(instanceName: string): FlowExecutionError {
    return new FlowExecutionError(
      `未找到实例: ${instanceName}`,
      FlowErrorCode.INSTANCE_NOT_FOUND,
      ErrorSeverity.MEDIUM
    );
  }

  /**
   * 创建方法未找到错误
   */
  static methodNotFound(instanceName: string, methodName: string): FlowExecutionError {
    return new FlowExecutionError(
      `实例 ${instanceName} 中未找到方法: ${methodName}`,
      FlowErrorCode.INSTANCE_METHOD_NOT_FOUND,
      ErrorSeverity.MEDIUM
    );
  }

  /**
   * 创建流程定义无效错误
   */
  static flowDefinitionInvalid(message: string): FlowExecutionError {
    return new FlowExecutionError(
      `流程定义无效: ${message}`,
      FlowErrorCode.FLOW_DEFINITION_INVALID,
      ErrorSeverity.HIGH
    );
  }

  /**
   * 创建超时错误
   */
  static timeout(nodeId: string, timeoutMs: number): FlowExecutionError {
    return new FlowExecutionError(
      `节点 ${nodeId} 执行超时 (${timeoutMs}ms)`,
      FlowErrorCode.FLOW_TIMEOUT,
      ErrorSeverity.HIGH,
      { nodeId }
    );
  }

  /**
   * 转换为JSON格式
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      nodeId: this.nodeId,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }

  /**
   * 获取用户友好的错误消息
   */
  getUserFriendlyMessage(): string {
    switch (this.code) {
      case FlowErrorCode.ENGINE_NOT_INITIALIZED:
        return '流程引擎未正确初始化，请检查配置';
      case FlowErrorCode.NODE_EXECUTION_FAILED:
        return `节点执行失败: ${this.nodeId || '未知节点'}`;
      case FlowErrorCode.NODE_PLUGIN_NOT_FOUND:
        return '节点类型不支持，请联系管理员';
      case FlowErrorCode.RULE_EVALUATION_FAILED:
        return '条件判断失败，请检查输入数据';
      case FlowErrorCode.EVENT_EXECUTION_FAILED:
        return '操作执行失败，请重试';
      case FlowErrorCode.INSTANCE_NOT_FOUND:
        return '组件未找到，请检查组件配置';
      case FlowErrorCode.INSTANCE_METHOD_NOT_FOUND:
        return '组件方法不可用，请检查组件实现';
      case FlowErrorCode.FLOW_DEFINITION_INVALID:
        return '流程配置有误，请检查流程定义';
      case FlowErrorCode.FLOW_TIMEOUT:
        return '操作超时，请稍后重试';
      default:
        return '系统错误，请联系技术支持';
    }
  }
}

/**
 * 错误处理器类
 * 提供统一的错误处理逻辑
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Set<(error: FlowExecutionError) => void> = new Set();

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 处理错误
   * @param error 错误对象
   * @param context 上下文信息
   */
  handleError(error: unknown, context?: Record<string, any>): FlowExecutionError {
    let flowError: FlowExecutionError;

    if (error instanceof FlowExecutionError) {
      flowError = error;
    } else if (error instanceof Error) {
      flowError = new FlowExecutionError(
        error.message,
        FlowErrorCode.UNKNOWN_ERROR,
        ErrorSeverity.MEDIUM,
        { originalError: error, context }
      );
    } else {
      flowError = new FlowExecutionError(
        String(error),
        FlowErrorCode.UNKNOWN_ERROR,
        ErrorSeverity.MEDIUM,
        { context }
      );
    }

    // 记录错误
    this.logError(flowError);

    // 通知监听器
    this.notifyListeners(flowError);

    return flowError;
  }

  /**
   * 添加错误监听器
   */
  addErrorListener(listener: (error: FlowExecutionError) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  /**
   * 记录错误
   */
  private logError(error: FlowExecutionError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.code}] ${error.message}`;
    const logData = {
      nodeId: error.nodeId,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.stack
    };

    switch (logLevel) {
      case 'error':
        console.error(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      case 'info':
        console.info(logMessage, logData);
        break;
      default:
        console.log(logMessage, logData);
    }
  }

  /**
   * 获取日志级别
   */
  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' | 'log' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'log';
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(error: FlowExecutionError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('错误监听器执行失败:', listenerError);
      }
    });
  }
}

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance();
