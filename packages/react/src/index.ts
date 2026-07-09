/**
 * @desc: React 适配层入口文件
 */

export { useFlowEngine } from './hooks/useFlowEngine';
export { useExpose, registerComponent } from './hooks/useFlowRegister';
export {
  useComponentManager,
  useRegisterInstance,
  useRegisterInstances,
  useRegisterGlobalMethod,
  useRegisterGlobalMethods,
  useInstance,
  useInstanceMethod,
  useGlobalMethod,
  useCallGlobalMethod,
} from './hooks/useComponentManager';
export {
  useContextManager,
  useContext,
  useContextVariables,
  useContextVariable,
  useContextVariablesSelective,
  useUpdateVariables,
  useUpdateContext,
  useInitializeContext,
  useClearContext,
  useSetContextVariable,
  useContextSubscription,
} from './hooks/useContextManager';