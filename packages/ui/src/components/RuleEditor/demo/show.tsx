/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月20日 10:49:06
 * @example: 调用示例
 */
import React from "react";
import { RuleEditor } from "@chloehe/logic-engine-ui";
import schema from './data';

const Show = ()=>{
  const { fields, rules } = schema as any;
  return (
    <div>
      <RuleEditor fields={fields} rules={rules} mode={"show"} />
    </div>
  );
}

export default Show;
