/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 15:23:52
 * @example: 调用示例
 */
import React, {
  useEffect,
  useImperativeHandle,
  useReducer,
  useMemo,
  useRef,
} from "react";
import { RuleEditorProps, RuleItemDataProp } from "./types";
import { getConversionRules, reducerRules, getUUID } from "./utils";
import RuleContext from "./RuleContext";
import RuleGroup from "./RuleGroup";
import { cloneDeep } from "lodash";
import "./style/index.less";
import { transformToEngineConditions } from "./rule_utils/utils";

const RuleEditor = React.forwardRef(function RuleEditor(
  props: RuleEditorProps,
  ref,
) {
  const { fields = [], onChange, value, rules, mode = "edit" } = props;
  const controlledRules = value ?? rules;
  const [contextState, dispatch] = useReducer(reducerRules, {
    rules: [{ key: getUUID(), type: "group", link: "and", children: [] }],
  });
  
  // 缓存 onChange 回调，避免 useEffect 频繁触发
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  
  // 缓存上一次的 controlledRules，避免重复初始化
  const prevControlledRulesRef = useRef<any>(null);
  const shouldInitRef = useRef(false);

  useEffect(() => {
    // 初始化 / 同步外部传入规则
    if (controlledRules?.link && controlledRules?.children?.length) {
      // 只有当 controlledRules 真正变化时才初始化
      const prevStr = JSON.stringify(prevControlledRulesRef.current);
      const currStr = JSON.stringify(controlledRules);
      if (prevStr !== currStr) {
        prevControlledRulesRef.current = controlledRules;
        shouldInitRef.current = true;
        dispatch({
          type: "Init",
          values: { rules: getConversionRules([controlledRules]) },
        });
      }
    }
  }, [controlledRules]);

  useEffect(() => {
    const { lastAction, realRules, currentRule } = contextState;
    if (lastAction && !shouldInitRef.current) {
      // 只有非初始化操作才触发 onChange，避免循环
      const rules = cloneDeep(realRules?.[0]);
      const _realRules = rules?.children?.length ? rules : {};
      const _currentRule = currentRule?.children?.length ? currentRule : {};
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChangeRef.current && onChangeRef.current(_realRules, _currentRule);
    }
    // 重置初始化标志
    if (shouldInitRef.current) {
      shouldInitRef.current = false;
    }
  }, [contextState.lastAction, contextState.realRules, contextState.currentRule]);

  // 使用 useMemo 稳定 context value，避免不必要的重渲染
  const contextValue = useMemo(() => ({
    editKey: contextState?.editKey || "",
    mode: mode,
    dispatch: dispatch,
  }), [contextState?.editKey, mode, dispatch]);

  /**
   * 获取全部规则数据，不包含还在编辑中的
   */
  const getValue = () => {
    const { realRules } = contextState;
    const _rules = realRules?.[0];
    return cloneDeep(_rules?.children?.length ? _rules : {});
    // return cloneDeep(realRules?.[0] || {});
  };
  /**
   * 获取格式化后的规则数据
   * @returns json-rules-engine 的规则数据
   */
  const getFormattedRules = () => {
   const rules = getValue();
    return transformToEngineConditions(rules);
  };


  useImperativeHandle(ref, () => {
    return {
      getValue: getValue,
      getFormattedRules: getFormattedRules,
      setValue: (values: RuleItemDataProp) => {
        if (values?.children?.length) {
          dispatch({ type: "SetValue", values });
        }
      },
    };
  });
  const prefixCls = 'rule-editor';
  return (
    <div className={prefixCls}>
      <RuleContext.Provider
        value={contextValue}
      >
        <RuleGroup
          prefixCls={prefixCls}
          fields={fields}
          rules={contextState?.rules}
        />
      </RuleContext.Provider>
    </div>
  );
});
export default RuleEditor;
