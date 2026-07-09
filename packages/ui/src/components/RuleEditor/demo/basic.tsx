/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月27日 16:24:40
 * @example: 调用示例
 */
import React, { useRef, useState } from "react";
import { RuleEditor } from "@chloehe/logic-engine-ui";
import schema from './data';
import { Divider, Space, Button } from "antd";
const Basic = ()=>{
  const ref = useRef<{ getValue: () => any; getFormattedRules: () => any; setValue: (rules: any) => void }>(null);
  const { fields, rules, updateRules } = schema as any;
  const [desc,setDesc] = useState(RuleEditor.Util.getRuleDesc(rules as any,fields));
  return (
    <div>
      <RuleEditor
        fields={fields} 
        rules={rules} 
        ref={ref}
        // mode={"show"}
        onChange={(allRules,currentRule)=>{
          console.log('onChange',allRules, currentRule)
          setDesc(RuleEditor.Util.getRuleDesc(allRules as any,fields));
        }}
      />
      <Divider />
      <div>
        <h3>当前规则语义化描述：</h3>
        <p>{desc}</p>
      </div>
      <Space style={{marginTop: 30}}>
        <Button onClick={()=>console.log(ref.current?.getValue())}>getValue</Button>
        <Button onClick={()=>console.log(ref.current?.getFormattedRules())}>getFormattedRules</Button>
        <Button onClick={()=>ref.current?.setValue(updateRules)}>setValue</Button>
      </Space>
    </div>
  );
}

export default Basic;
