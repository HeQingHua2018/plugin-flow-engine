/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * @File: useFlowEngine.ts
 * @desc: React自定义Hook，封装流程引擎的初始化、执行和状态管理逻辑
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { PluginExecutionEngine } from '../utils/PluginExecutionEngine';
import type { FlowData, ExecutionContext, ExecutionHistory } from "../type";

/**
 * useFlowEngine Hook的选项接口
 * 定义了初始化流程引擎所需的配置项
 */
export interface UseFlowEngineOptions {
  flowData: FlowData;
  initialVariables?: Record<string, any>;
  components?: Array<{
    name: string;
    ref: React.RefObject<any>;
  }>;
}

/**
 * useFlowEngine Hook的返回结果接口
 * 提供访问流程引擎实例和控制流程执行的方法
 */
export interface UseFlowEngineResult {
  engine: PluginExecutionEngine | null;
  executeFlow: () => Promise<void>;
  executionResult: {
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
  } | null;
  executionHistory: ExecutionHistory[];
  isExecuting: boolean;
  updateVariables: (variables: Record<string, any>) => void;
}

/**
 * 流程引擎自定义Hook
 * 在React组件中集成流程引擎功能的便捷方式
 * 提供流程执行、状态管理和上下文更新等能力
 */
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

  const { flowData, initialVariables = {}, components = [] } = options;

  // 使用 ref 存储组件注册状态，避免重复注册
  const registeredComponentsRef = useRef<Set<string>>(new Set());

  // 初始化引擎和上下文 - 只在组件挂载时初始化一次
  useEffect(() => {
    // 重置自动执行标志
    hasAutoExecutedRef.current = false;
    // 清理已注册组件集合
    registeredComponentsRef.current.clear();
    try {
      // 验证流程数据
      if (!flowData || !flowData.flow || !Array.isArray(flowData.nodes)) {
        console.warn('无效的流程定义数据，必须包含flow和nodes属性');
        return;
      }
      // 初始化上下文 - 合并流程定义中的变量和外部传入的初始变量
      const defaultVariables = flowData.context?.variables
        ? Object.keys(flowData.context.variables).reduce(
            (acc, key) => {
              // 提取默认值，如果没有则设置为null
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

      // 创建并初始化引擎
      const newEngine = new PluginExecutionEngine();
      newEngine.initialize(flowData, newContext);
      setEngine(newEngine);

      if (process.env.NODE_ENV === 'development') {
        console.log('流程引擎已成功初始化');
      }

      return () => {
        // 清理引擎资源
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
    }
  }, [flowData, initialVariables]);

  // 注册组件实例 - 优化注册逻辑，确保只注册一次
  useEffect(() => {
    if (!engine || components.length === 0) return;

    try {
      const instanceManager = engine.getComponentManager();
      
      // 确保组件ref存在且current不为null
      const validComponents = components.filter(
        (comp) => comp.ref?.current && typeof comp.name === 'string'
      );
      
      // 只注册新组件，避免重复注册
      const newComponents = validComponents.filter(
        (comp) => !registeredComponentsRef.current.has(comp.name)
      );

      if (newComponents.length > 0) {
        // 逐个注册组件（因为没有看到registerInstances方法的具体实现，使用registerInstance更安全）
        newComponents.forEach((comp) => {
          instanceManager.registerInstance(comp.name, comp.ref);
          registeredComponentsRef.current.add(comp.name);
        });
      }

      return () => {
        // 清理时只注销当前不存在的组件
        const currentComponentNames = components.map((comp) => comp.name);
        const componentsToUnregister = Array.from(
          registeredComponentsRef.current
        ).filter((name) => !currentComponentNames.includes(name));

        if (componentsToUnregister.length > 0 && instanceManager) {
          instanceManager.unregisterInstances(componentsToUnregister);

          // 从已注册集合中移除
          componentsToUnregister.forEach((name) => {
            registeredComponentsRef.current.delete(name);
          });
        }
      };
    } catch (error) {
      console.error('注册组件实例时出错:', error);
    }
  }, [engine, components]); // 依赖整个components数组，确保组件引用变化时能正确更新

  // 监听历史记录更新
  useEffect(() => {
    if (!engine) return;

    try {
      // 使用新的 on 方法订阅历史记录更新事件
      const historyListener = (history: ExecutionHistory[]) => {
        // 仅在开发环境输出日志
        if (process.env.NODE_ENV === 'development') {
          console.log('执行历史记录已更新:', history);
        }
        setExecutionHistory(history);
      };
      engine.on('history_updated', historyListener);

      // 清理订阅
      return () => {
        if (engine) {
          engine.off('history_updated', historyListener);
        }
      };
    } catch (error) {
      console.error('设置历史记录监听器时出错:', error);
    }
  }, [engine]);

  // 执行流程 - 使用useCallback优化，避免不必要的重新创建
  const executeFlow = useCallback(async () => {
    if (!engine) {
      const error = new Error('引擎未初始化');
      console.error(error);
      throw error;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionHistory([]);

    try {
      const contextManager = engine.getContextManager();
      
      if (!contextManager) {
        throw new Error('上下文管理器未初始化');
      }
      
      // 从ContextManager获取最新上下文
      const latestVariables = contextManager.getVariables();
      if (process.env.NODE_ENV === 'development') {
        console.log('执行流程前上下文变量:', latestVariables);
      }

      // 确保使用最新的上下文
      const updatedContext = contextManager.getContext();
      engine.updateContext(updatedContext);

      // 执行流程
      const result = await engine.executeFlow();

      // 获取执行历史记录
      const history = engine.getExecutionHistory();
      setExecutionHistory(history);
      setExecutionResult(result);

      if (process.env.NODE_ENV === 'development') {
        console.log('流程执行结果:', result);
        console.log('执行历史记录:', history);
      }
    } catch (error) {
      console.error('执行流程时出错:', error);

      // 即使在失败时也可以获取部分历史记录
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
  }, [engine]); // 只依赖engine，避免循环依赖

  // 更新上下文变量
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
      
      // 验证变量参数
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


  // 自动执行流程 - 只在初始化后执行一次
  const hasAutoExecutedRef = useRef(false);

  useEffect(() => {
    if (!engine || !flowData?.flow?.auto || hasAutoExecutedRef.current) return;

    // 如果配置了auto为true，自动执行流程
    const executeAutoFlow = async () => {
      try {
        // 确保所有组件都已注册完成
        const allComponentsRegistered = components.every(
          (comp) =>
            comp.ref?.current && registeredComponentsRef.current.has(comp.name)
        );

        if (allComponentsRegistered && !isExecuting) {
          try {
            // 从engine实例获取contextManager
            const contextManager = engine.getContextManager();
            if (!contextManager) {
              throw new Error('上下文管理器未初始化');
            }
            
            // 确保使用最新的上下文
            const latestContext = contextManager.getContext();
            engine.updateContext(latestContext);
            
            if (process.env.NODE_ENV === 'development') {
              console.log('自动执行流程开始...');
            }
            
            hasAutoExecutedRef.current = true; // 标记已执行
            await executeFlow();
          } catch (error) {
            console.error('自动执行流程失败:', error);
          }
        } else if (!allComponentsRegistered) {
          if (process.env.NODE_ENV === 'development') {
            console.log('等待所有组件注册完成后自动执行流程...');
          }
          // 如果组件未完全注册，延迟重试
          const retryTimer = setTimeout(executeAutoFlow, 500);
          return () => clearTimeout(retryTimer);
        }
      } catch (error) {
        console.error('自动执行流程逻辑出错:', error);
      }
    };

    // 延迟执行，确保组件完全挂载和注册
    const timer = setTimeout(executeAutoFlow, 300);
    return () => clearTimeout(timer);
  }, [engine, flowData?.flow?.auto, components, isExecuting]); // 移除executeFlow依赖，避免循环依赖

  return {
    engine,
    executeFlow,
    executionResult,
    executionHistory,
    isExecuting,
    updateVariables,
  };
};