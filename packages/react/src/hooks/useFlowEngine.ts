/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * @File: useFlowEngine.ts
 * @desc: React 自定义 Hook，封装流程引擎的初始化、执行和状态管理逻辑
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { PluginExecutionEngine } from '@chloehe/logic-engine-core';
import type { FlowData, ExecutionContext } from '@chloehe/logic-engine-common';
import type { ExecutionHistory } from '@chloehe/logic-engine-core';
import { flowVersionManager, flowDebugger, flowReplayer } from '@chloehe/logic-engine-core';
import { getGlobalComponentManager } from '@chloehe/logic-engine-common';
import type { FlowVersion, VersionDiff, DebuggerConfig, ReplayConfig, ReplayResult } from '@chloehe/logic-engine-core';

function extractRequiredComponents(flowData: FlowData): string[] {
  const components = new Set<string>();
  flowData.nodes.forEach((node: any) => {
    if (node.data?.config?.event?.type) {
      const eventType = node.data.config.event.type;
      const parts = eventType.split('.');
      if (parts.length >= 2) {
        components.add(parts[0]);
      }
    }
  });
  return Array.from(components);
}

async function waitForComponents(
  flowData: FlowData,
  timeout: number = 5000
): Promise<void> {
  const requiredComponents = extractRequiredComponents(flowData);
  if (requiredComponents.length === 0) return;

  console.log('[useFlowEngine] 需要等待组件:', requiredComponents);

  const compManager = getGlobalComponentManager();
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const registeredComponents = compManager.getAllInstances().map(i => i.name);
    const allRegistered = requiredComponents.every((name) =>
      compManager.hasInstance(name)
    );

    if (allRegistered) {
      console.log('[useFlowEngine] 所有组件已注册:', requiredComponents);
      return;
    }

    if (Date.now() - startTime < 200) {
      console.log('[useFlowEngine] 等待组件注册...', {
        required: requiredComponents,
        registered: registeredComponents,
        missing: requiredComponents.filter(n => !registeredComponents.includes(n)),
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const registeredComponents = compManager.getAllInstances().map(i => i.name);
  const missingComponents = requiredComponents.filter(
    (name) => !compManager.hasInstance(name)
  );
  console.warn(
    `[useFlowEngine] 等待组件注册超时，缺少组件: ${missingComponents.join(', ')}`
  );
  console.warn('[useFlowEngine] 当前已注册的组件:', registeredComponents);
}

export interface FlowExecuteOptions {
  nodeId?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  breakpoints?: string[];
}

export interface UseFlowEngineOptions {
  flowData: FlowData;
  initialVariables?: Record<string, any>;
}

export interface UseFlowEngineResult {
  engine: PluginExecutionEngine | null;
  executeFlow: (options?: FlowExecuteOptions) => Promise<void>;
  executionResult: {
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    retries?: number;
    stoppedAt?: string;
  } | null;
  executionHistory: ExecutionHistory[];
  isExecuting: boolean;
  updateVariables: (variables: Record<string, any>) => void;

  createVersion: (options?: { description?: string; tags?: string[] }) => FlowVersion;
  getVersions: () => FlowVersion[];
  getVersion: (version: string) => FlowVersion | undefined;
  rollbackTo: (version: string) => FlowData;
  compareVersions: (versionA: string, versionB: string) => VersionDiff;
  deleteVersion: (version: string) => boolean;
  currentVersion?: FlowVersion;

  startDebug: (config?: { breakpoints?: string[]; stepByStep?: boolean }) => void;
  pauseDebug: () => Promise<void>;
  resumeDebug: () => void;
  stopDebug: () => void;
  getDebuggerStatus: () => DebuggerConfig;
  addBreakpoint: (nodeId: string) => void;
  removeBreakpoint: (nodeId: string) => void;
  getBreakpoints: () => string[];
  getExecutionTrace: () => any[];

  replay: (history: ExecutionHistory[], config?: ReplayConfig) => Promise<ReplayResult>;
  analyzeHistory: (history: ExecutionHistory[]) => any;
}

export const useFlowEngine = (
  options: UseFlowEngineOptions
): UseFlowEngineResult => {
  const [engine, setEngine] = useState<PluginExecutionEngine | null>(null);
  const [executionResult, setExecutionResult] =
    useState<UseFlowEngineResult['executionResult']>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>(
    []
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const { flowData, initialVariables = {} } = options;

  const currentVersionRef = useRef<FlowVersion | undefined>(undefined);

  useEffect(() => {
    hasAutoExecutedRef.current = false;
    try {
      if (!flowData || !flowData.flow || !Array.isArray(flowData.nodes)) {
        console.warn('无效的流程定义数据，必须包含 flow 和 nodes 属性');
        return;
      }
      const defaultVariables = flowData.context?.variables
        ? Object.keys(flowData.context.variables).reduce(
            (acc, key) => {
              const variableDef = flowData.context.variables[key];
              acc[key] = variableDef.default ?? null;
              return acc;
            },
            {} as Record<string, any>
          )
        : {};
      const variables = {
        ...defaultVariables,
        ...initialVariables,
      };
      const newContext: ExecutionContext = { variables };

      const newEngine = new PluginExecutionEngine();
      newEngine.initialize(flowData, newContext);
      setEngine(newEngine);

      const version = flowVersionManager.createVersion(flowData, {
        description: '初始版本',
      });
      currentVersionRef.current = version;

      if (process.env.NODE_ENV === 'development') {
        console.log('流程引擎已成功初始化', {
          engine: newEngine,
          flowData: flowData,
          context: newContext,
        });
      }

      return () => {
        try {
          if (newEngine && typeof newEngine.dispose === 'function') {
            newEngine.dispose();
            if (process.env.NODE_ENV === 'development') {
              console.log('流程引擎资源已清理');
            }
          }
        } catch (error) {
          console.error('清理引擎资源时出错:', error);
        }
      };
    } catch (error) {
      console.error('初始化流程引擎时出错:', error);
      setEngine(null);
      if (process.env.NODE_ENV === 'development') {
        console.log('引擎初始化失败，engine 设置为 null');
      }
    }
  }, [flowData, initialVariables]);

  useEffect(() => {
    if (!engine) return;

    try {
      const historyListener = (history: ExecutionHistory[]) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('执行历史记录已更新:', history);
        }
        setExecutionHistory(history);
      };
      engine.on('history_updated', historyListener);

      return () => {
        if (engine) {
          engine.off('history_updated', historyListener);
        }
      };
    } catch (error) {
      console.error('设置历史记录监听器时出错:', error);
    }
  }, [engine]);

  const executeFlow = useCallback(async (options?: FlowExecuteOptions) => {
    if (!engine) {
      const error = new Error('引擎未初始化');
      console.error(error);
      throw error;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionHistory([]);

    try {
      await waitForComponents(flowData);

      const contextManager = engine.getContextManager();

      if (!contextManager) {
        throw new Error('上下文管理器未初始化');
      }

      const latestVariables = contextManager.getVariables();
      if (process.env.NODE_ENV === 'development') {
        console.log('执行流程前上下文变量:', latestVariables);
      }

      const updatedContext = contextManager.getContext();
      engine.updateContext(updatedContext);

      const result = await engine.executeFlow(options?.nodeId);

      const history = engine.getExecutionHistory();
      setExecutionHistory(history);
      setExecutionResult(result);

      if (process.env.NODE_ENV === 'development') {
        console.log('流程执行结果:', result);
        console.log('执行历史记录:', history);
      }
    } catch (error) {
      console.error('执行流程时出错:', error);

      const history = engine.getExecutionHistory();
      setExecutionHistory(history);

      try {
        const contextManager = engine.getContextManager();
        setExecutionResult({
          status: false,
          message: '流程执行失败',
          variables: contextManager ? contextManager.getVariables() : {},
          errorInfo: {
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
          },
        });
      } catch (innerError) {
        console.error('设置执行结果时出错:', innerError);
        setExecutionResult({
          status: false,
          message: '流程执行失败且无法获取上下文信息',
          variables: {},
          errorInfo: {
            error: error instanceof Error ? error.message : String(error),
            innerError: innerError instanceof Error ? innerError.message : String(innerError),
            timestamp: new Date().toISOString(),
          },
        });
      }
    } finally {
      setIsExecuting(false);
    }
  }, [engine, flowData]);

  const updateVariables = useCallback((variables: Record<string, any>) => {
    if (!engine) {
      console.warn('引擎未初始化，无法更新变量');
      return;
    }

    try {
      const contextManager = engine.getContextManager();
      if (!contextManager) {
        console.warn('上下文管理器未初始化，无法更新变量');
        return;
      }

      if (!variables || typeof variables !== 'object') {
        console.warn('无效的变量参数，必须是对象类型');
        return;
      }

      contextManager.updateVariables(variables);

      if (process.env.NODE_ENV === 'development') {
        console.log('已更新上下文变量:', variables);
      }
    } catch (error) {
      console.error('更新上下文变量时出错:', error);
    }
  }, [engine]);


  const hasAutoExecutedRef = useRef(false);

  useEffect(() => {
    if (!engine || !flowData?.flow?.auto || hasAutoExecutedRef.current) return;

    const executeAutoFlow = async () => {
      try {
        if (!isExecuting) {
          const contextManager = engine.getContextManager();
          if (!contextManager) {
            throw new Error('上下文管理器未初始化');
          }

          const latestContext = contextManager.getContext();
          engine.updateContext(latestContext);

          if (process.env.NODE_ENV === 'development') {
            console.log('自动执行流程开始...');
          }

          hasAutoExecutedRef.current = true;
          await executeFlow();
        }
      } catch (error) {
        console.error('自动执行流程失败:', error);
      }
    };

    const timer = setTimeout(executeAutoFlow, 300);
    return () => clearTimeout(timer);
  }, [engine, flowData?.flow?.auto, isExecuting]);

  const createVersion = useCallback((options?: { description?: string; tags?: string[] }): FlowVersion => {
    if (!flowData) {
      throw new Error('流程数据未初始化');
    }
    const version = flowVersionManager.createVersion(flowData, options);
    currentVersionRef.current = version;
    return version;
  }, [flowData]);

  const getVersions = useCallback(() => {
    return flowVersionManager.getVersions();
  }, []);

  const getVersion = useCallback((version: string): FlowVersion | undefined => {
    return flowVersionManager.getVersion(version);
  }, []);

  const rollbackTo = useCallback((version: string): FlowData => {
    const flowData = flowVersionManager.rollbackTo(version);
    currentVersionRef.current = flowVersionManager.getVersion(version);
    return flowData;
  }, []);

  const compareVersions = useCallback((versionA: string, versionB: string): VersionDiff => {
    return flowVersionManager.compareVersions(versionA, versionB);
  }, []);

  const deleteVersion = useCallback((version: string): boolean => {
    return flowVersionManager.deleteVersion(version);
  }, []);

  const startDebug = useCallback((config?: { breakpoints?: string[]; stepByStep?: boolean }) => {
    engine?.startDebug(config);
  }, [engine]);

  const pauseDebug = useCallback(async () => {
    await engine?.pauseDebug();
  }, [engine]);

  const resumeDebug = useCallback(() => {
    engine?.resumeDebug();
  }, [engine]);

  const stopDebug = useCallback(() => {
    engine?.stopDebug();
  }, [engine]);

  const getDebuggerStatus = useCallback(() => {
    return flowDebugger.getConfig();
  }, []);

  const addBreakpoint = useCallback((nodeId: string) => {
    flowDebugger.addBreakpoint(nodeId);
  }, []);

  const removeBreakpoint = useCallback((nodeId: string) => {
    flowDebugger.removeBreakpoint(nodeId);
  }, []);

  const getBreakpoints = useCallback(() => {
    return flowDebugger.getBreakpoints();
  }, []);

  const getExecutionTrace = useCallback(() => {
    return flowDebugger.getTrace();
  }, []);

  const replay = useCallback(async (history: ExecutionHistory[], config?: ReplayConfig): Promise<ReplayResult> => {
    if (!engine) {
      return {
        success: false,
        message: '引擎未初始化',
        nodesReplayed: 0,
      };
    }
    flowReplayer.setEngine(engine);
    flowReplayer.setFlowData(flowData!);
    return flowReplayer.replay(history, config);
  }, [engine, flowData]);

  const analyzeHistory = useCallback((history: ExecutionHistory[]) => {
    return flowReplayer.analyzeHistory(history);
  }, []);

  return {
    engine,
    executeFlow,
    executionResult,
    executionHistory,
    isExecuting,
    updateVariables,
    createVersion,
    getVersions,
    getVersion,
    rollbackTo,
    compareVersions,
    deleteVersion,
    currentVersion: currentVersionRef.current,
    startDebug,
    pauseDebug,
    resumeDebug,
    stopDebug,
    getDebuggerStatus,
    addBreakpoint,
    removeBreakpoint,
    getBreakpoints,
    getExecutionTrace,
    replay,
    analyzeHistory,
  };
};