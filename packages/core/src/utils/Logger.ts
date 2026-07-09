/*
 * @File: Logger.ts
 * @desc: 结构化日志输出工具，支持 JSON 格式、日志级别、分类和采样
 * @author: heqinghua
 * @date: 2026 年 04 月 16 日
 */

// ============================================================================
// 日志级别定义
// ============================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
  SILENT = 5,
}

export const LogLevelNames = {
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
  [LogLevel.FATAL]: 'fatal',
  [LogLevel.SILENT]: 'silent',
} as const;

export const LogLevelColors = {
  [LogLevel.DEBUG]: '\x1b[36m', // cyan
  [LogLevel.INFO]: '\x1b[32m',  // green
  [LogLevel.WARN]: '\x1b[33m',  // yellow
  [LogLevel.ERROR]: '\x1b[31m', // red
  [LogLevel.FATAL]: '\x1b[35m', // magenta
  [LogLevel.SILENT]: '',
} as const;

export const LogLevelReset = '\x1b[0m';

// ============================================================================
// 日志分类定义
// ============================================================================

export enum LogCategory {
  // 核心模块
  CORE = 'core',
  FLOW = 'flow',
  PLUGIN = 'plugin',
  TEMPLATE = 'template',
  RULE = 'rule',
  // 业务模块
  AUTH = 'auth',
  USER = 'user',
  PERMISSION = 'permission',
  // 系统模块
  SYSTEM = 'system',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  // 外部集成
  DATABASE = 'database',
  CACHE = 'cache',
  API = 'api',
  // 调试和开发
  DEBUG = 'debug',
  TEST = 'test',
}

// ============================================================================
// 日志采样配置
// ============================================================================

export interface LogSampleConfig {
  /** 采样率，0-1 之间，1 表示不采样 */
  rate: number;
  /** 采样窗口（毫秒） */
  window?: number;
  /** 最小采样间隔（毫秒） */
  minInterval?: number;
}

export interface SampledLogResult {
  shouldLog: boolean;
  sampleRate: number;
  actualCount: number;
}

// ============================================================================
// 日志元数据
// ============================================================================

export interface LogMetadata {
  /** 日志唯一标识符 */
  id?: string;
  /** 调用栈 */
  stack?: string;
  /** 来源文件 */
  file?: string;
  /** 来源行号 */
  line?: number;
  /** 来源列号 */
  column?: number;
  /** 函数名 */
  function?: string;
  /** 进程 ID */
  pid?: number;
  /** 线程 ID */
  tid?: number;
  /** 请求 ID（用于链路追踪） */
  requestId?: string;
  /** 用户 ID */
  userId?: string;
  /** 会话 ID */
  sessionId?: string;
  /** 自定义上下文 */
  context?: Record<string, any>;
}

// ============================================================================
// 日志记录接口
// ============================================================================

export interface LogRecord {
  /** 时间戳（ISO 8601） */
  timestamp: string;
  /** 时间戳（毫秒） */
  time: number;
  /** 日志级别 */
  level: LogLevel;
  /** 日志级别名称 */
  levelName: string;
  /** 日志分类 */
  category: LogCategory;
  /** 消息 */
  message: string;
  /** 附加数据 */
  data?: Record<string, any>;
  /** 元数据 */
  metadata?: LogMetadata;
  /** 是否被采样 */
  sampled?: boolean;
  /** 采样信息 */
  sampleInfo?: {
    rate: number;
    actualCount: number;
  };
}

// ============================================================================
// 日志处理器接口
// ============================================================================

export interface LogHandler {
  /** 处理器名称 */
  name: string;
  /** 支持的日志级别 */
  level: LogLevel;
  /** 写入日志 */
  write: (record: LogRecord) => void;
  /** 刷新缓冲区 */
  flush?: () => void;
  /** 关闭处理器 */
  close?: () => void;
}

// ============================================================================
// 控制台日志处理器
// ============================================================================

class ConsoleLogHandler implements LogHandler {
  name = 'console';
  level = LogLevel.DEBUG;

  write(record: LogRecord): void {
    // 生产环境使用 JSON 格式，开发环境使用彩色格式
    const isDev = process.env.NODE_ENV === 'development';
    const isCI = process.env.CI === 'true';

    if (isDev && !isCI) {
      this.writeColored(record);
    } else {
      this.writeJSON(record);
    }
  }

  private writeColored(record: LogRecord): void {
    const color = LogLevelColors[record.level] || '';
    const reset = LogLevelReset;

    const timestamp = new Date(record.time).toISOString();
    const category = `\x1b[90m[${record.category}]\x1b[0m`;
    const message = record.data ? `${record.message} ${JSON.stringify(record.data)}` : record.message;

    console.log(`${color}${timestamp} ${category} [${record.levelName.toUpperCase()}] ${message}${reset}`);
  }

  private writeJSON(record: LogRecord): void {
    const output = this.formatToJSON(record);
    console.log(output);
  }

  private formatToJSON(record: LogRecord): string {
    const output: Record<string, any> = {
      timestamp: record.timestamp,
      time: record.time,
      level: record.levelName,
      category: record.category,
      message: record.message,
    };

    if (record.data && Object.keys(record.data).length > 0) {
      output.data = record.data;
    }

    if (record.metadata) {
      output.metadata = {
        ...record.metadata,
      };
    }

    if (record.sampled && record.sampleInfo) {
      output.sampled = true;
      output.sampleInfo = record.sampleInfo;
    }

    return JSON.stringify(output);
  }
}

// ============================================================================
// 文件日志处理器
// ============================================================================

export interface FileLogHandlerOptions {
  /** 文件路径 */
  filepath: string;
  /** 最大文件大小（字节） */
  maxSize?: number;
  /** 最大备份文件数 */
  maxFiles?: number;
  /** 日志级别 */
  level?: LogLevel;
}

class FileLogHandler implements LogHandler {
  name = 'file';
  level: LogLevel;
  private filepath: string;
  private maxSize: number;
  private maxFiles: number;
  private buffer: string[] = [];
  private fileHandle?: any;

  constructor(options: FileLogHandlerOptions) {
    this.filepath = options.filepath;
    this.maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || 5;
    this.level = options.level ?? LogLevel.INFO;
  }

  async write(record: LogRecord): Promise<void> {
    const line = this.formatToJSON(record) + '\n';
    this.buffer.push(line);

    // 异步写入，避免阻塞
    if (this.buffer.length >= 10) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    try {
      // TODO: 实现文件写入逻辑
      // 在实际使用中，可以使用 fs.promises 或类似库
      this.buffer = [];
    } catch (error) {
      console.error('[FileLogHandler] Flush error:', error);
    }
  }

  close(): void {
    this.flush();
    this.fileHandle?.close();
  }

  private formatToJSON(record: LogRecord): string {
    const output: Record<string, any> = {
      timestamp: record.timestamp,
      time: record.time,
      level: record.levelName,
      category: record.category,
      message: record.message,
      source: 'file',
    };

    if (record.data && Object.keys(record.data).length > 0) {
      output.data = record.data;
    }

    if (record.metadata) {
      output.metadata = record.metadata;
    }

    return JSON.stringify(output);
  }
}

// ============================================================================
// 日志采样器
// ============================================================================

export class LogSampler {
  private sampleCounts = new Map<string, { count: number; windowStart: number }>();
  private sampleRates = new Map<string, number>();

  /**
   * 配置采样
   * @param category 日志分类
   * @param config 采样配置
   */
  configure(category: LogCategory, config: LogSampleConfig): void {
    this.sampleRates.set(category, config.rate);
  }

  /**
   * 检查是否应该记录日志
   * @param category 日志分类
   * @param customRate 自定义采样率
   * @returns 采样结果
   */
  shouldLog(category: LogCategory, customRate?: number): SampledLogResult {
    const rate = customRate ?? this.sampleRates.get(category) ?? 1;

    // 不采样
    if (rate >= 1) {
      return {
        shouldLog: true,
        sampleRate: rate,
        actualCount: 1,
      };
    }

    // 获取或创建计数
    const key = category;
    const now = Date.now();
    let countInfo = this.sampleCounts.get(key);

    if (!countInfo) {
      countInfo = { count: 0, windowStart: now };
      this.sampleCounts.set(key, countInfo);
    }

    // 检查窗口是否过期
    const window = 1000; // 默认 1 秒窗口
    if (now - countInfo.windowStart > window) {
      countInfo.count = 0;
      countInfo.windowStart = now;
    }

    // 随机采样
    const shouldLog = Math.random() < rate;

    if (shouldLog) {
      countInfo.count++;
    }

    return {
      shouldLog,
      sampleRate: rate,
      actualCount: countInfo.count,
    };
  }

  /**
   * 获取采样统计
   * @returns 统计信息
   */
  getStats(): Record<string, { count: number; windowStart: number }> {
    return Object.fromEntries(this.sampleCounts);
  }

  /**
   * 重置统计
   */
  reset(): void {
    this.sampleCounts.clear();
  }
}

// ============================================================================
// 日志器核心类
// ============================================================================

export interface LoggerOptions {
  /** 日志级别 */
  level?: LogLevel;
  /** 日志分类 */
  category?: LogCategory;
  /** 是否启用采样 */
  enabled?: boolean;
  /** 默认采样配置 */
  defaultSampleConfig?: LogSampleConfig;
  /** 自定义处理器 */
  handlers?: LogHandler[];
  /** 元数据 */
  metadata?: LogMetadata;
}

export class Logger {
  private level: LogLevel;
  private category: LogCategory;
  private enabled: boolean;
  private sampler: LogSampler;
  private handlers: LogHandler[];
  private metadata: LogMetadata;
  private requestId?: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.category = options.category ?? LogCategory.CORE;
    this.enabled = options.enabled ?? true;
    this.sampler = new LogSampler();
    this.handlers = options.handlers ?? [new ConsoleLogHandler()];
    this.metadata = options.metadata ?? {};

    // 配置默认采样
    if (options.defaultSampleConfig) {
      this.sampler.configure(this.category, options.defaultSampleConfig);
    }

    // 生成请求 ID（用于链路追踪）
    this.requestId = this.generateRequestId();
  }

  /**
   * 设置请求 ID
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId;
    this.metadata.requestId = requestId;
  }

  /**
   * 获取请求 ID
   */
  getRequestId(): string {
    return this.requestId || this.metadata.requestId || '';
  }

  /**
   * 配置采样
   */
  configureSample(category: LogCategory, config: LogSampleConfig): void {
    this.sampler.configure(category, config);
  }

  /**
   * 获取采样器
   */
  getSampler(): LogSampler {
    return this.sampler;
  }

  /**
   * 添加处理器
   */
  addHandler(handler: LogHandler): void {
    this.handlers.push(handler);
  }

  /**
   * 移除处理器
   */
  removeHandler(handlerName: string): void {
    this.handlers = this.handlers.filter(h => h.name !== handlerName);
  }

  /**
   * 创建子日志器（继承当前配置并添加额外元数据）
   */
  child(options: { metadata?: LogMetadata; category?: LogCategory; level?: LogLevel }): Logger {
    const childLogger = new Logger({
      level: options.level ?? this.level,
      category: options.category ?? this.category,
      enabled: this.enabled,
      handlers: this.handlers,
      metadata: {
        ...this.metadata,
        ...options.metadata,
      },
    });

    // 继承采样配置
    if (this.sampler) {
      childLogger.sampler = this.sampler;
    }

    return childLogger;
  }

  /**
   * 生成日志记录
   */
  private createRecord(
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    sampleConfig?: LogSampleConfig
  ): LogRecord {
    const now = Date.now();
    const timestamp = new Date(now).toISOString();

    // 检查采样
    let sampled = false;
    let sampleInfo: LogRecord['sampleInfo'] = undefined;

    if (sampleConfig) {
      const result = this.sampler.shouldLog(this.category, sampleConfig.rate);
      sampled = !result.shouldLog;
      sampleInfo = {
        rate: result.sampleRate,
        actualCount: result.actualCount,
      };
    }

    return {
      timestamp,
      time: now,
      level,
      levelName: LogLevelNames[level],
      category: this.category,
      message,
      data,
      metadata: {
        ...this.metadata,
        pid: process.pid,
        tid: (process as any).threadId || process.pid,
        requestId: this.requestId,
      },
      sampled,
      sampleInfo,
    };
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 写入日志
   */
  private log(level: LogLevel, message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    if (!this.enabled) return;
    if (level < this.level) return;

    const record = this.createRecord(level, message, data, sampleConfig);

    // 写入所有处理器
    for (const handler of this.handlers) {
      if (level >= handler.level) {
        try {
          if (handler.write instanceof Function) {
            handler.write(record);
          }
        } catch (error) {
          console.error(`[Logger] Handler ${handler.name} error:`, error);
        }
      }
    }
  }

  // ============================================================================
  // 日志方法
  // ============================================================================

  debug(message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    this.log(LogLevel.DEBUG, message, data, sampleConfig);
  }

  info(message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    this.log(LogLevel.INFO, message, data, sampleConfig);
  }

  warn(message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    this.log(LogLevel.WARN, message, data, sampleConfig);
  }

  error(message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    this.log(LogLevel.ERROR, message, data, sampleConfig);
  }

  fatal(message: string, data?: Record<string, any>, sampleConfig?: LogSampleConfig): void {
    this.log(LogLevel.FATAL, message, data, sampleConfig);
  }

  silent(): void {
    // 静默，不输出任何日志
  }

  // ============================================================================
  // 便捷方法
  // ============================================================================

  /**
   * 记录性能指标
   */
  performance(message: string, duration: number, data?: Record<string, any>): void {
    this.log(
      LogLevel.INFO,
      `${message} - Duration: ${duration.toFixed(2)}ms`,
      { ...data, duration },
      { rate: 0.1 } // 性能日志默认 10% 采样
    );
  }

  /**
   * 记录错误对象
   */
  errorWithException(error: Error | unknown, message?: string, data?: Record<string, any>): void {
    const errorData = {
      ...(data || {}),
      error: error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          }
        : { message: String(error) },
    };

    this.error(error instanceof Error ? error.message : message || 'Unknown error', errorData);
  }

  /**
   * 开始性能计时
   */
  timeStart(label: string): void {
    performance?.mark?.(`start_${label}`);
  }

  /**
   * 结束性能计时并记录
   */
  timeEnd(label: string, data?: Record<string, any>): number {
    if (!performance) return 0;

    performance.mark(`end_${label}`);
    const entries = performance.getEntriesByName(`start_${label}`);
    const endEntries = performance.getEntriesByName(`end_${label}`);

    if (entries.length > 0 && endEntries.length > 0) {
      const start = entries[0].startTime;
      const end = endEntries[0].startTime;
      const duration = end - start;

      this.performance(label, duration, data);

      // 清除标记
      performance.clearMarks(`start_${label}`);
      performance.clearMarks(`end_${label}`);

      return duration;
    }

    return 0;
  }
}

// ============================================================================
// 预定义日志器
// ============================================================================

// 核心日志器
export const coreLogger = new Logger({
  category: LogCategory.CORE,
  level: LogLevel.INFO,
});

// 流程日志器
export const flowLogger = new Logger({
  category: LogCategory.FLOW,
  level: LogLevel.INFO,
});

// 插件日志器
export const pluginLogger = new Logger({
  category: LogCategory.PLUGIN,
  level: LogLevel.INFO,
});

// 模板日志器
export const templateLogger = new Logger({
  category: LogCategory.TEMPLATE,
  level: LogLevel.INFO,
});

// 规则日志器
export const ruleLogger = new Logger({
  category: LogCategory.RULE,
  level: LogLevel.INFO,
});

// 系统日志器
export const systemLogger = new Logger({
  category: LogCategory.SYSTEM,
  level: LogLevel.INFO,
});

// 错误日志器
export const errorLogger = new Logger({
  category: LogCategory.ERROR,
  level: LogLevel.ERROR,
});

// 性能日志器
export const performanceLogger = new Logger({
  category: LogCategory.PERFORMANCE,
  level: LogLevel.INFO,
  defaultSampleConfig: { rate: 0.1 }, // 10% 采样
});

// 调试日志器
export const debugLogger = new Logger({
  category: LogCategory.DEBUG,
  level: LogLevel.DEBUG,
});

// ============================================================================
// 工厂函数
// ============================================================================

/**
 * 创建自定义日志器
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

/**
 * 获取日志器（根据分类）
 */
export function getLogger(category?: LogCategory): Logger {
  switch (category) {
    case LogCategory.CORE:
      return coreLogger;
    case LogCategory.FLOW:
      return flowLogger;
    case LogCategory.PLUGIN:
      return pluginLogger;
    case LogCategory.TEMPLATE:
      return templateLogger;
    case LogCategory.RULE:
      return ruleLogger;
    case LogCategory.SYSTEM:
      return systemLogger;
    case LogCategory.ERROR:
      return errorLogger;
    case LogCategory.PERFORMANCE:
      return performanceLogger;
    case LogCategory.DEBUG:
      return debugLogger;
    default:
      return new Logger({ category });
  }
}

// ============================================================================
// 默认导出
// ============================================================================

export default Logger;

