"use strict";(self.webpackChunkplugin_flow_engine=self.webpackChunkplugin_flow_engine||[]).push([[838],{16780:function(t,e,n){var o;n.r(e),n.d(e,{demos:function(){return y}});var s=n(17061),l=n.n(s),f=n(17156),_=n.n(f),i=n(67294),m=n(11951),u=n(26954),y={"flowview-demo-basic":{component:i.memo(i.lazy(function(){return n.e(273).then(n.bind(n,91495))})),asset:{type:"BLOCK",id:"flowview-demo-basic",refAtomIds:["FlowView"],dependencies:{"index.tsx":{type:"FILE",value:n(87415).Z},"plugin-flow-engine":{type:"NPM",value:"0.0.1"},react:{type:"NPM",value:"18.3.1"},"./data.ts":{type:"FILE",value:n(29714).Z}},entry:"index.tsx"},context:{"./data.ts":u,"plugin-flow-engine":m,react:o||(o=n.t(i,2)),"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/components/FlowView/demo/data.ts":u},renderOpts:{compile:function(){var g=_()(l()().mark(function c(){var d,v=arguments;return l()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,n.e(250).then(n.bind(n,90250));case 2:return r.abrupt("return",(d=r.sent).default.apply(d,v));case 3:case"end":return r.stop()}},c)}));function p(){return g.apply(this,arguments)}return p}()}}}},98869:function(t,e,n){var o;n.r(e),n.d(e,{demos:function(){return v}});var s=n(17061),l=n.n(s),f=n(17156),_=n.n(f),i=n(67294),m=n(40166),u=n(81944),y=n(11951),g=n(43124),p=n(77999),c=n(60147),d=n(77849),v={"pluginview-demo-basic":{component:i.memo(i.lazy(function(){return n.e(915).then(n.bind(n,84705))})),asset:{type:"BLOCK",id:"pluginview-demo-basic",refAtomIds:["PluginView"],dependencies:{"index.tsx":{type:"FILE",value:n(36897).Z},react:{type:"NPM",value:"18.3.1"},"../index.tsx":{type:"FILE",value:n(37111).Z},antd:{type:"NPM",value:"5.27.6"},"plugin-flow-engine":{type:"NPM",value:"0.0.1"},"./demo/Demo2.tsx":{type:"FILE",value:n(44539).Z},"./demo/Demo1.tsx":{type:"FILE",value:n(47276).Z},"./demo/data.ts":{type:"FILE",value:n(69479).Z},"../../../core/type.ts":{type:"FILE",value:n(60899).Z}},entry:"index.tsx"},context:{"../index.tsx":m,"./demo/Demo2.tsx":g,"./demo/Demo1.tsx":p,"./demo/data.ts":c,"../../../core/type.ts":d,react:o||(o=n.t(i,2)),"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/components/PluginView/index.tsx":m,antd:u,"plugin-flow-engine":y,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/components/PluginView/demo/Demo2.tsx":g,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/components/PluginView/demo/Demo1.tsx":p,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/components/PluginView/demo/data.ts":c,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/src/core/type.d.ts":d},renderOpts:{compile:function(){var x=_()(l()().mark(function w(){var h,E=arguments;return l()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,n.e(250).then(n.bind(n,90250));case 2:return a.abrupt("return",(h=a.sent).default.apply(h,E));case 3:case"end":return a.stop()}},w)}));function r(){return x.apply(this,arguments)}return r}()}}}},26954:function(t,e,n){n.r(e),n.d(e,{initialEdges:function(){return s},initialNodes:function(){return o}});var o=[{id:"trigger",type:"input",position:{x:0,y:0},data:{label:"\u89E6\u53D1\u8282\u70B9",nodeType:"Trigger"}},{id:"show_email_node",type:"output",position:{x:0,y:120},data:{label:"\u663E\u793A\u90AE\u7BB1\u8282\u70B9",nodeType:"Action"}}],s=[{id:"e1-2",source:"trigger",target:"show_email_node"}]},3938:function(t,e,n){n.r(e),n.d(e,{texts:function(){return o}});const o=[]},86627:function(t,e,n){n.r(e),n.d(e,{texts:function(){return o}});const o=[]},87415:function(t,e){e.Z=`/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025\u5E7410\u670821\u65E5 11:42:11
 * @example: \u8C03\u7528\u793A\u4F8B
 */

import { initialNodes, initialEdges } from "./data";
import { FlowView } from 'plugin-flow-engine';

import React from 'react'

const basic: React.FC = () => {
  return (
    <FlowView
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      getNodeConfig={(nodeId) => {
        console.log('\u83B7\u53D6\u8282\u70B9\u914D\u7F6E', nodeId);
        return {};
      }}
      onNodeConfigChange={(nodeId, values) => {
        console.log('\u914D\u7F6E\u53D8\u5316', nodeId, values);
      }}
    />
  )
}


export default basic;`},29714:function(t,e){e.Z=`/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025\u5E7410\u670821\u65E5 11:36:56
 * @example: \u8C03\u7528\u793A\u4F8B
 */
export const initialNodes = [
  { id: 'trigger', type: 'input', position: { x: 0, y: 0 }, data: { label: '\u89E6\u53D1\u8282\u70B9', nodeType: 'Trigger' } },
  { id: 'show_email_node', type: 'output', position: { x: 0, y: 120 }, data: { label: '\u663E\u793A\u90AE\u7BB1\u8282\u70B9', nodeType: 'Action' } },
];
export const initialEdges = [
  { id: 'e1-2', source: 'trigger', target: 'show_email_node' },
];
`},47276:function(t,e){e.Z=`/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025\u5E7409\u670818\u65E5 09:28:42
 * @example: \u8C03\u7528\u793A\u4F8B
 */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input, Button, Checkbox, Card, Tag, message } from "antd";


/**
 * \u4F7F\u7528\u65B9\u6CD5\u6CE8\u518C\u4E2D\u5FC3\u4E0E\u89C4\u5219\u5F15\u64CE\u4EA4\u4E92\u7684\u7EC4\u4EF6
 */
interface Demo1Props {
  initialValues?: Record<string, any>;
  updateVariables?: (variables: Record<string, any>) => void;
}

export interface Demo1Ref {
  showEmail: (params: Record<string, any>) => void;
  requireEmail: (params: Record<string, any>) => void;
  trigger: (params: Record<string, any>) => void;
  setFormValue: (params: Record<string, any>) => any;
  getData: () => Record<string, any>;
}

const Demo1 = forwardRef<Demo1Ref, Demo1Props>((props, ref) => {
  const [form] = Form.useForm();
  const [showEmail, setShowEmail] = useState(false);
  const [requireEmail, setRequireEmail] = useState(false);
  // \u663E\u793A\u90AE\u7BB1
  const handleShowEmail = (params: Record<string, any>) => {
    console.log(\`\u663E\u793A\u90AE\u7BB1:\`, params);
    
    setShowEmail(params.show);
  };

  // \u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B
  const handleRequireEmail = (params: Record<string, any>) => {
    console.log(\`\u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B:\`, params);
    setRequireEmail(params.required);
  };

  // \u89E6\u53D1\u5668\u6267\u884C\u4E8B\u4EF6
  const handleTrigger = (params: Record<string, any>) => {
    console.log(\`\u89E6\u53D1\u5668:\`, params.message);
    message.info("\u6EE1\u8DB3\u6761\u4EF6\u5F00\u59CB\u6267\u884C");
  };

  // \u8BBE\u7F6E\u8868\u5355\u503C
  const handleSetFormValue = (params: Record<string, any>) => {
    if (params && typeof params.field === "string") {
      console.log(\`\u8BBE\u7F6E\u8868\u5355\u5B57\u6BB5:\`, params.field, "\u4E3A", params.value);

      // \u540C\u6B65\u66F4\u65B0\u8868\u5355
      form.setFieldValue(params.field, params.value);
      return {
        [params.field]: params.value,
      };
    }
  };

  // \u83B7\u53D6\u5F53\u524D\u8868\u5355\u6570\u636E
  const getData = () => {
    return form.getFieldsValue();
  };

  // \u5904\u7406\u8868\u5355\u63D0\u4EA4
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(\`\u8868\u5355\u63D0\u4EA4:\`, values);
      // \u540C\u6B65\u5230\u4E0A\u4E0B\u6587\u7BA1\u7406\u5668
      if (props.updateVariables) {
        props.updateVariables(values);
      }
    });
  };

  // \u81EA\u5B9A\u4E49\u8868\u5355\u9A8C\u8BC1\u89C4\u5219
  const validateUsername = (_rule: any, value: string) => {
    if (!value || value.length < 3) {
      return Promise.reject(new Error("\u7528\u6237\u540D\u81F3\u5C11\u9700\u89813\u4E2A\u5B57\u7B26"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_rule: any, value: string) => {
    if (!value || value.length < 6) {
      return Promise.reject(new Error("\u5BC6\u7801\u81F3\u5C11\u9700\u89816\u4E2A\u5B57\u7B26"));
    }
    return Promise.resolve();
  };

  const validateEmail = (_rule: any, value: string) => {
    if (requireEmail && !value) {
      return Promise.reject(new Error("\u90AE\u7BB1\u4E3A\u5FC5\u586B\u9879"));
    }
    if (value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      return Promise.reject(new Error("\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E"));
    }
    return Promise.resolve();
  };

  // \u4F7F\u7528useImperativeHandle\u66B4\u9732\u65B9\u6CD5\u7ED9\u7236\u7EC4\u4EF6
  useImperativeHandle(ref, () => ({
    showEmail: handleShowEmail,
    requireEmail: handleRequireEmail,
    trigger: handleTrigger,
    setFormValue: handleSetFormValue,
    getData,
    showTip:(params:any)=>{
       return new Promise((resolve) => {
          setTimeout(()=>{
            message.info(params?.msg || "Demo1\u5E76\u884C")
            // reject(new Error('\u6A21\u62DF\u5F02\u5E38Demo1'))
            resolve(params?.msg || "Demo1\u5E76\u884C")
          },1000)
        })
    }
  }));
  useEffect(()=>{
    props.initialValues && form.setFieldsValue(props.initialValues);
  },[props.initialValues])
  return (
    <Card
      title="\u7EC4\u4EF6Demo1"
      style={{ maxWidth: "500px" ,marginBottom: 12}}
      extra={<Tag color="blue">\u7EC4\u4EF6ID: {Demo1.displayName}</Tag>}
    >
      <Form
        form={form}
        layout="vertical"
        style={{marginBottom: 12}}
        onValuesChange={(changedValues, allValues) => {
          // \u53EA\u5728\u6709\u5B9E\u9645\u53D8\u5316\u65F6\u66F4\u65B0\u4E0A\u4E0B\u6587
          if (Object.keys(changedValues).length > 0) {
            console.log('\u8868\u5355\u503C\u53D8\u5316:', changedValues, '\u5168\u90E8\u503C:', allValues);
            if (props.updateVariables) {
              props.updateVariables(allValues);
            }
          }
        }}
      >
        <Form.Item
          name="username"
          label="\u7528\u6237\u540D"
          rules={[{ required: true, validator: validateUsername }]}
        >
          <Input placeholder="\u8BF7\u8F93\u5165\u7528\u6237\u540D" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="password"
          label="\u5BC6\u7801"
          rules={[{ required: true, validator: validatePassword }]}
        >
          <Input.Password placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801" autoComplete="off" />
        </Form.Item>

        {showEmail && (
          <Form.Item
            name="email"
            label="\u90AE\u7BB1"
            rules={[{ required: requireEmail, validator: validateEmail }]}
          >
            <Input placeholder="\u8BF7\u8F93\u5165\u90AE\u7BB1" autoComplete="off" />
          </Form.Item>
        )}

        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[{ required: true, message: "\u8BF7\u540C\u610F\u670D\u52A1\u6761\u6B3E" }]}
        >
          <Checkbox>\u6211\u540C\u610F\u670D\u52A1\u6761\u6B3E</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            \u63D0\u4EA4
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});
Demo1.displayName = "Demo1";
export default Demo1;
`},44539:function(t,e){e.Z=`/*
 * @File:
 * @desc:
 * @author: heqinghua
 * @date: 2025\u5E7408\u670827\u65E5 12:50:38
 * @example: \u8C03\u7528\u793A\u4F8B
 */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, message, Tag } from "antd";

interface DemoProps {
  [key: string]: any;
}

export interface Demo2Ref {
  showOther: (params?: Record<string, any>) => Promise<string>;
  end: (params?: Record<string, any>) => void;
}

const Demo2 = forwardRef<Demo2Ref, DemoProps>((props, ref) => {
  const [status,setStatus] = useState("pending")
  
  const showOther = (params?: Record<string, any>): Promise<string> => {
    console.log('Demo2: showOther\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u53C2\u6570:', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        setStatus("active")
        console.log('Demo2: \u72B6\u6001\u5DF2\u66F4\u65B0\u4E3A "active"');
        resolve("showOther\u65B9\u6CD5\u88AB\u8C03\u7528");
      }, 1000);
    })
  };

  const end = (params?: Record<string, any>) => {
    console.log('Demo2: end\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u5F53\u524D\u72B6\u6001:', status, '\u53C2\u6570:', params);
    setStatus("end")
    console.log('Demo2: \u72B6\u6001\u5DF2\u66F4\u65B0\u4E3A "end"');
  };
  useImperativeHandle(ref, () => ({
    showOther,
    end,
    showMsg: (params?: Record<string, any>)=>{
        message.info(params?.msg || "\u9ED8\u8BA4\u63D0\u793A\u4FE1\u606F")
    },
    showTip:(params?: Record<string, any>)=>{
        return new Promise((resolve) => {
          setTimeout(()=>{
            message.info(params?.msg || "\u5E76\u884C")
            // reject(new Error('\u6A21\u62DF\u5F02\u5E38Demo2'))
            resolve(params?.msg || "\u5E76\u884C")
          },2000)
        })
    },
    merge:()=>{
      message.info("\u6267\u884C\u4E86\u805A\u5408\u8282\u70B9\u4E86")
    }
  }));

  return (
    <div>
      <Card
        title="\u7EC4\u4EF6Demo2"
        style={{ maxWidth: "500px" ,marginBottom: 12}}
        extra={<Tag color="blue">\u7EC4\u4EF6ID: {Demo2.displayName}</Tag>}
      >
        \u6211\u662F\u53E6\u5916\u4E00\u4E2A Demo2 \u7EC4\u4EF6
        <div>
          {status}
          \u72B6\u6001\uFF1A<Tag color={status === "pending" ? "orange" : status === "active" ? "green" : status === "end" ? "blue" : "default"}>{status}</Tag>
        </div>
      </Card>
    </div>
  );
});

Demo2.displayName = "Demo2";

export default Demo2;
`},36897:function(t,e){e.Z=`/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025\u5E7410\u670821\u65E5 11:58:18
 * @example: \u8C03\u7528\u793A\u4F8B
 */
import React from 'react'
import PluginDemo from '../index'

export default function basic() {
  return (
    <PluginDemo />
  )
}
`},69479:function(t,e){e.Z=`import { FlowDefinition, IterationMode, ParallelStrategy } from "../../../core/type.d";

export const data: FlowDefinition = {
  flow: {
    id: "demo_flow",
    name: "\u5B9E\u4F8B\u4E2D\u5FC3\u901A\u4FE1\u793A\u4F8B\u6D41\u7A0B",
    version: "1.0.0",
    description: "\u5C55\u793A\u5982\u4F55\u901A\u8FC7\u5B9E\u4F8B\u4E2D\u5FC3\u5728\u89C4\u5219\u5F15\u64CE\u548C\u7EC4\u4EF6\u4E4B\u95F4\u901A\u4FE1",
    category: "demo",
    enable:true,
    create_date: new Date().toISOString(),
    update_date: new Date().toISOString(),
    auto: false, // \u81EA\u52A8\u6267\u884C\u6D41\u7A0B
  },
  context: {
    variables: {
      username: {
        type: "string",
        source: "Demo1Ref",
        description: "\u7528\u6237\u540D",
        default: "admin",
      },
      password: {
        type: "string",
        source: "Demo1Ref",
        description: "\u5BC6\u7801",
        default: "1234555",
      },
      agreeTerms: {
        type: "boolean",
        source: "Demo1Ref",
        description: "\u540C\u610F\u6761\u6B3E",
        default: false,
      },
    },
  },
  nodes: [
    {
      id: "trigger",
      type: "Trigger",
      name: "\u89E6\u53D1\u5668",
      config: {
        conditions: {
          all: [
            {
              fact: "username",
              operator: "notEqual",
              value: "",
            },
          ],
        },
        event: {
          type: "Demo1.trigger",
          params: {
            message: "\u6D41\u7A0B\u5DF2\u89E6\u53D1",
          },
        },
      },
    },
    {
      id: "show_email_node",
      name: "\u663E\u793A\u90AE\u7BB1",
      type: "Action",
      config: {
        conditions: {
          all: [],
        },
        event: {
          type: "Demo1.showEmail",
          params: {
            show: true,
          },
        },
      },
    },
    // \u5206\u652F\u8282\u70B9\uFF08type: "branch"\uFF09
    {
      id: "user_type_branch",
      name: "\u7528\u6237\u7C7B\u578B\u5206\u652F",
      type: "Branch",
      config: {},
    },
    {
      id: "require_email_node",
      name: "\u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B",
      type: "Action",
      config: {
        conditions: {
          all: [
            {
              fact: "agreeTerms",
              operator: "equal",
              value: true,
            },
          ],
        },
        event: {
          type: "Demo1.requireEmail",
          params: {
            required: true,
          },
        },
      },
    },
    {
      id: "update_email_node",
      name: "\u66F4\u65B0\u90AE\u7BB1",
      type: "Action",
      config: {
        conditions: {
          all: [
            {
              fact: "agreeTerms",
              operator: "equal",
              value: true,
            },
          ],
        },
        event: {
          type: "Demo1.setFormValue",
          params: {
            field: "email",
            value: "updated@example.com",
          },
        },
      },
    },
    {
      id: "update_email_success_node",
      name: "\u90AE\u7BB1\u66F4\u65B0\u6210\u529F",
      type: "Parallel",
      config: {
        parallel_strategy: ParallelStrategy.ALL, // all \u6240\u6709\u5206\u652F\u6210\u529F any \u4E00\u4E2A\u5206\u652F\u6210\u529F
        conditions: {
          all: [
            {
              fact: "email",
              operator: "equal",
              value: "updated@example.com",
            },
          ],
        },
        event: {
          type: "Demo2.showOther", // \u7EC4\u4EF6id.\u4E8B\u4EF6
          params: {
            message: "\u90AE\u7BB1\u66F4\u65B0\u6210\u529F\uFF01",
          },
        },
      },
    },
    {
      id: "A1",
      name: "A1",
      type: "Action",
      config: {
        conditions: {
          all: []
        },
        event: {
          type: "Demo1.showTip",
          params: {
            msg: "A1\u8282\u70B9\u5E76\u884C\u6267\u884C\u6210\u529F"
          }
        }
      },
    },
    {
      id: "A2",
      name: "A2",
      type: "Action",
      config: {
        conditions: {
          all: [
          ],
        },
        event: {
          type: "Demo2.showTip", // \u7EC4\u4EF6id.\u4E8B\u4EF6
          params: {
            msg: "A2\u8282\u70B9\u5E76\u884C\u6D88\u606F",
          },
        },
      },
    },
    {
      id:"iteration_info",
      name:"\u8FED\u4EE3\u63D0\u9192",
      type:"Iteration",
      config:{
        iteration_count: 2,
        iteration_mode: IterationMode.ALL_SUCCESS,
        conditions:{
          all:[]
        },
        event: {
          type: "Demo2.showMsg",
          params: {
           msg:"\u63D0\u793A\u4FE1\u606F\u5C31\u662F\u6211"
          },
        },
      }
    },
    {
      id:'merge',
      name:"\u805A\u5408\u8282\u70B9",
      type:"Merge",
      config:{
        event:{
          type:"Demo2.merge",
        }
      }
    },
    {
      id: "end_node",
      name: "\u6D41\u7A0B\u7ED3\u675F",
      type: "End",
      config: {
        event: {
          type: "Demo2.end",
          params: {
            msg: "\u6D41\u7A0B\u7ED3\u675F",
          },
        },
      },
    },
  ],
  edges: [
    {
      id: "1",
      source: "trigger",
      target: "show_email_node",
      label: "\u6210\u529F",
    },
    {
      id: "2",
      source: "show_email_node",
      target: "user_type_branch",
    },
    {
      id: "3",
      source: "user_type_branch",
      target: "require_email_node",
      conditions: {
        all: [{ fact: "username", operator: "equal", value: "user" }],
      },
    },
    {
      id: "4",
      source: "user_type_branch",
      target: "update_email_node",
      conditions: {
        all: [{ fact: "username", operator: "equal", value: "admin" }],
      },
    },
    {
      id: "5",
      source: "user_type_branch",
      target: "end_node",
      isDefault: true,
    },
    {
      id: "6",
      source: "update_email_node",
      target: "update_email_success_node",
      label: "\u66F4\u65B0\u6210\u529F",
    },
    {
      id: "7",
      source:"update_email_success_node",
      target:"A1",
      label:"A1"
    },
    {
      id: "8",
      source:"update_email_success_node",
      target:"A2",
      label:"A2"
    },
    {
      id: "9",
      source: "A2",
      target: "merge",
      label:"\u805A\u5408A2"
    },
    {
      id:"10",
      source:"A1",
      target:"merge",
      label:"\u805A\u5408A1"
    },
    {
      id:'11',
      source:'merge',
      target:"end_node",
      label:"\u7ED3\u675F"
    },
    {
      id:"12",
      source:"require_email_node",
      target:"iteration_info"
    },
    {
      id:"13",
      source:"iteration_info",
      target:"end_node"
    }
  ],
  global_config: {
    timeout_config: {
      global_timeout: 30000,
      action_timeout: 10000,
    },
    security_config: {},
    monitor_config: {
      metrics: [],
    },
  },
};`},37111:function(t,e){e.Z=`/*
 * @File: index.tsx
 * @desc: \u63D2\u4EF6\u5316\u67B6\u6784Demo\u4E3B\u5165\u53E3
 * @author: heqinghua
 * @date: 2025\u5E7409\u670818\u65E5
 */

import React, { useRef, useMemo } from 'react';
import { Card, Button, Col, Row } from 'antd';
import {
  useFlowEngine,
} from 'plugin-flow-engine';
import Demo1 from './demo/Demo1';
import Demo2 from './demo/Demo2';
import { Demo1Ref } from './demo/Demo1';
import { Demo2Ref } from './demo/Demo2';
import { data } from './demo/data';
// import TriggerNodePlugin from '../../core/plugins/TriggerNodePlugin';

/**
 * \u63D2\u4EF6\u5316\u67B6\u6784Demo\u7EC4\u4EF6
 * \u5C55\u793A\u5982\u4F55\u4F7F\u7528\u63D2\u4EF6\u5316\u673A\u5236\u6784\u5EFA\u548C\u6267\u884C\u6D41\u7A0B
 */
const PluginDemo: React.FC = () => {
  
  const demo1Ref = useRef<Demo1Ref>(null);
  const demo2Ref = useRef<Demo2Ref>(null);
  
  // \u4F7F\u7528 useRef \u5B58\u50A8\u7EC4\u4EF6\u914D\u7F6E\uFF0C\u907F\u514D\u91CD\u590D\u6E32\u67D3
  const componentsRef = useRef([
    { name: Demo1.displayName!, ref: demo1Ref },
    { name: Demo2.displayName!, ref: demo2Ref },
  ]);
  
  // \u4F7F\u7528 useMemo \u786E\u4FDD initialVariables \u53EA\u5728\u7EC4\u4EF6\u6302\u8F7D\u65F6\u521B\u5EFA\u4E00\u6B21
  const initialVariables = useMemo(() => ({
    username: 'admin',
    password: '123456',
    agreeTerms: true
  }), []);

  
  const {
    engine,
    executeFlow,
    executionResult,
    executionHistory,
    isExecuting,
    updateVariables,
  } = useFlowEngine({
    flowData: data,
    initialVariables,
    components: componentsRef.current,
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="mb-4">
        <Button
          onClick={executeFlow}
          type="primary"
          size="middle"
          disabled={!engine || isExecuting}
          loading={isExecuting}
          style={{marginBottom:12}}
        >
          {isExecuting ? '\u6267\u884C\u4E2D...' : '\u6267\u884C\u6D41\u7A0B'}
        </Button>
      </div>
      {/* \u6267\u884C\u7ED3\u679C */}
      {executionResult && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: executionResult.status ? "#e8f5e8" : "#ffebee",
            borderLeft: \`4px solid \${executionResult.status ? "#4CAF50" : "#f44336"}\`,
            borderRadius: "4px",
          }}
        >
          <p>{executionResult.message}</p>
          <div style={{ marginTop: "10px" }}>
            <h4>{executionResult.status ? '\u4E0A\u4E0B\u6587\u53D8\u91CF:' :' \u9519\u8BEF\u4FE1\u606F\uFF1A'}</h4>
            <pre
              style={{
                fontSize: "12px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "4px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {executionResult.status ? JSON.stringify(executionResult.variables, null, 2) :JSON.stringify(executionResult.errorInfo, null, 2) }
            </pre>
          </div>
        </div>
      )}

      <Row className="mb-[30px]" gutter={16}>
        <Col span={12}>
         {/* \u7EC4\u4EF6 */}
          <Demo1 ref={demo1Ref} initialValues={initialVariables} updateVariables={updateVariables} />
          <Demo2 ref={demo2Ref} />
        </Col>

        <Col span={12}>
          {/* \u6267\u884C\u5386\u53F2\u8BB0\u5F55 */}
          <Card title="\u6267\u884C\u5386\u53F2\u8BB0\u5F55">
            <div
              style={{
                maxHeight: "510px",
                overflowY: "auto",
              }}
            >
              {executionHistory.length === 0 ? (
                <p>\u6682\u65E0\u6267\u884C\u5386\u53F2</p>
              ) : (
                executionHistory.map((record, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      backgroundColor: record.status === 'success' ? '#e8f5e8' : '#ffebee',
                      borderRadius: "4px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {\`\${index + 1}. \u8282\u70B9\u540D\uFF08id\uFF09: \${record.nodeName} (\${record.nodeId})\`}
                    </div>
                    <div style={{ 
                      color: record.status === 'success' ? '#52c41a' : '#ff4d4f',
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      \u6267\u884C\u72B6\u6001: {record.status}
                    </div>
                     {record.startTime && <div style={{ color: "#666", fontSize: "12px" }}>
                        \u5F00\u59CB\u65F6\u95F4: {record.startTime.getTime()}
                      </div>
                      }
                       {record.endTime && <div style={{ color: "#666", fontSize: "12px" }}>
                        \u7ED3\u675F\u65F6\u95F4: {record.endTime.getTime()}
                      </div>
                      }
                      <div style={{ color: "#666", fontSize: "12px" }}>
                        \u8017\u65F6: {record.duration}ms
                      </div>
                      {
                        record.decision && (
                           <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u5206\u652F\u51B3\u7B56\u4FE1\u606F:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                         {JSON.stringify(record.decision, null, 2)}
                        </pre>
                      </div>
                        )
                      }
                    {record.event && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u6267\u884C\u4E8B\u4EF6:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                          \u4E8B\u4EF6\u540D: {record.event.type}
                          <br/>
                          \u53C2\u6570: {JSON.stringify(record.event.params, null, 2)}
                        </pre>
                      </div>
                    )}
                     {record.eventResult && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u4E8B\u4EF6\u6267\u884C\u7ED3\u679C:</strong>
                        <pre style={{ margin: 0, fontSize: "11px" }}>
                         {JSON.stringify(record.eventResult, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.contextBefore && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u6267\u884C\u524D\u4E0A\u4E0B\u6587:</strong>
                        <pre style={{ margin: 0, fontSize: "11px", maxHeight: "100px", overflow: "auto" }}>
                          {JSON.stringify(record.contextBefore, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.contextAfter && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u6267\u884C\u540E\u4E0A\u4E0B\u6587:</strong>
                        <pre style={{ margin: 0, fontSize: "11px", maxHeight: "100px", overflow: "auto" }}>
                          {JSON.stringify(record.contextAfter, null, 2)}
                        </pre>
                      </div>
                    )}
                     {record.conditions && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u89C4\u5219:</strong>
                        <pre style={{  margin: 0, fontSize: "11px" }}>
                          {JSON.stringify(record.conditions, null, 2)}
                        </pre>
                      </div>
                    )}
                    {record.engineResult && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>\u8282\u70B9\u6267\u884C\u7ED3\u679C:</strong>
                        <div style={{ margin: 0, fontSize: "11px" }}>
                          {JSON.stringify(record.engineResult,null,2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PluginDemo;`},60899:function(t,e){e.Z=`/*
 * @File: type.d.ts
 * @desc: \u63D2\u4EF6\u5316\u67B6\u6784\u7684\u6838\u5FC3\u7C7B\u578B\u5B9A\u4E49\uFF0C\u4E3A\u6574\u4E2ADemo\u63D0\u4F9B\u7C7B\u578B\u652F\u6301
 * @author: heqinghua
 * @date: 2025\u5E7409\u670818\u65E5
 */

import type { TopLevelCondition, Event } from "json-rules-engine";
import type { PluginExecutionEngine as PluginExecutionEngineType } from './utils/PluginExecutionEngine';

// \u5B9A\u4E49\u63A7\u4EF6\u6620\u5C04\u7C7B\u578B
export interface WidgetMap {
  [key: string]: React.ElementType;
}

// \u5B9A\u4E49\u8282\u70B9\u914D\u7F6E\u9879\u7C7B\u578B
export interface NodeConfig {
  schema: Schema;
  widgets?: WidgetMap;
  [key:string]:any
}
// \u52A8\u6001\u8868\u5355\u76F8\u5173\u7C7B\u578B\u5B9A\u4E49
export interface Field {
  /** 
   * \u5B57\u6BB5\u7C7B\u578B\uFF08\u89C4\u8303\u5316\u63A7\u4EF6\u952E\uFF09\u3002\u7528\u4E8E\u63D0\u4F9B\u9ED8\u8BA4\u63A7\u4EF6\u4E0E\u515C\u5E95\u903B\u8F91\u3002
   * - \u63A8\u8350\u4F7F\u7528 Antd \u547D\u540D\uFF1A\`ant_\u7EC4\u4EF6\u540D[.\u5B50\u7EC4\u4EF6\u540D]\`\uFF0C\u5982 \`ant_Input\`\u3001\`ant_Input.Password\`\u3001\`ant_Input.TextArea\`\u3001\`ant_DatePicker.RangePicker\`
   * - \u652F\u6301\u81EA\u5B9A\u4E49\u952E\uFF1A\u5982 \`rich-text\`\u3001\`json-object\`\uFF0C\u9700\u901A\u8FC7\u6CE8\u5165\u5668\u6CE8\u518C\u540E\u65B9\u53EF\u4F7F\u7528
   * - \u6E32\u67D3\u4F18\u5148\u7EA7\uFF1A\`widget\` > \`type\` > \`ant_Input\`\uFF08\u515C\u5E95\uFF09
   * - \u8BE5\u5B57\u6BB5\u5E38\u7528\u4E8E\uFF1A\u63D0\u4F9B\u8BED\u4E49\u5316\u7684\u9ED8\u8BA4\u63A7\u4EF6\u4E0E\u56DE\u9000\u7B56\u7565
   * @example type: "ant_Select"
   */
  type: string; 
  /** 
   * \u6307\u5B9A\u6E32\u67D3\u63A7\u4EF6\u7684\u6620\u5C04\u952E\uFF08\u4F18\u5148\u7EA7\u6700\u9AD8\uFF09\u3002
   * - \u7528\u4E8E\u8986\u76D6\u9ED8\u8BA4 \`type\` \u6216\u9009\u62E9\u81EA\u5B9A\u4E49\u63A7\u4EF6
   * - \u9700\u4FDD\u8BC1\u8BE5\u952E\u5DF2\u5728\u6CE8\u5165\u5668\u4E2D\u6CE8\u518C\uFF1A\`injectWidget(key, Component)\`
   * - \u672A\u547D\u4E2D\u65F6\u6309\u4F18\u5148\u7EA7\u56DE\u9000\uFF1A\`type\` \u2192 \`ant_Input\`
   * @example widget: "rich-text"
   */
  widget?: string; 
  /** \u5B57\u6BB5\u540D\u79F0\uFF0C\u5BF9\u5E94\u8868\u5355\u63A7\u4EF6\u7684 name \u5C5E\u6027 */
  field: string; 
  /** \u5B57\u6BB5\u6807\u7B7E\uFF0C\u5BF9\u5E94\u8868\u5355\u63A7\u4EF6\u7684 label \u5C5E\u6027 */
  label: string; 
  /** \u8868\u5355\u9879\u5C5E\u6027\uFF0C\u5BF9\u5E94 FormItemProps \u7C7B\u578B */
  formItemProps?: Record<string, any>; 
  /** \u5BF9\u5E94\u8868\u5355\u63A7\u4EF6\u7684\u5C5E\u6027\uFF0C\u5982 options \u7B49 */
  widgetProps?: Record<string, any>; 
  /** \u5B57\u6BB5\u9ED8\u8BA4\u503C\uFF0C\u5BF9\u5E94\u8868\u5355\u63A7\u4EF6\u7684 initialValue \u5C5E\u6027 */
  defaultValue?: any; 
  /** \u5B57\u6BB5\u63CF\u8FF0\uFF0C\u5BF9\u5E94\u8868\u5355\u63A7\u4EF6\u7684 help \u5C5E\u6027 */
  description?: string; 
  /** \u4F9D\u8D56\u6761\u4EF6\uFF0C\u7528\u4E8E\u52A8\u6001\u663E\u793A/\u9690\u85CF\u5B57\u6BB5 */
  dependsOn?: {
    field: string; // \u4F9D\u8D56\u7684\u5B57\u6BB5\u540D\u79F0
    value: any | ((value: any) => boolean); // \u4F9D\u8D56\u503C\u6216\u5224\u65AD\u51FD\u6570
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
 * \u8282\u70B9\u72B6\u6001\u679A\u4E3E
 * \u5B9A\u4E49\u4E86\u8282\u70B9\u5728\u6267\u884C\u8FC7\u7A0B\u4E2D\u53EF\u80FD\u7684\u72B6\u6001
 */
export enum NodeStatus {
  PENDING = 'pending', // \u51E0\u70B9\u9ED8\u8BA4\u72B6\u6001\u503C
  RUNNING = 'running', // \u6267\u884C\u4E2D
  SUCCESS = 'success', // \u6210\u529F
  FAILED = 'failed', // \u5931\u8D25
}


/**
 * \u8FB9\u7C7B\u578B\u679A\u4E3E
 * \u5B9A\u4E49\u4E86\u6D41\u7A0B\u4E2D\u8282\u70B9\u95F4\u8FDE\u63A5\u7684\u65B9\u5411\u7C7B\u578B
 */
export enum EdgeType{
  INCOMING = 'in', // \u5165\u8FB9
  OUTGOING = 'out', // \u51FA\u8FB9
  ALL = 'all' // \u6240\u6709\u8FB9
}

/**
 * \u5E76\u884C\u7B56\u7565\u679A\u4E3E
 * \u5B9A\u4E49\u5E76\u884C\u8282\u70B9\u7684\u6267\u884C\u6210\u529F\u7B56\u7565
 */
export enum ParallelStrategy {
  ALL = 'all', // \u6240\u6709\u5B50\u8282\u70B9\u6267\u884C\u6210\u529F\u624D\u7B97\u6210\u529F
  ANY = 'any' // \u4EFB\u610F\u4E00\u4E2A\u5B50\u8282\u70B9\u6267\u884C\u6210\u529F\u5C31\u7B97\u6210\u529F
}

/**
 * \u8FED\u4EE3\u6A21\u5F0F\u679A\u4E3E
 * \u5B9A\u4E49\u8FED\u4EE3\u8282\u70B9\u7684\u6267\u884C\u6A21\u5F0F
 */
export enum IterationMode {
  ALL_SUCCESS = 1, // \u6240\u6709\u6B21\u6570\u6267\u884C\u6210\u529F\u540E\u624D\u7B97\u6210\u529F
  ANY_SUCCESS = 2, // \u6210\u529F\u4E00\u6B21\u4E5F\u7B97\u6210\u529F
  ANY_FAILURE = 3 // \u5931\u8D25\u4E00\u6B21\u4E5F\u7B97\u5931\u8D25
}

/**
 * \u8282\u70B9\u63A5\u53E3
 * \u8868\u793A\u6D41\u7A0B\u4E2D\u7684\u4E00\u4E2A\u53EF\u6267\u884C\u5355\u5143
 */
export interface Node {
  /** \u8282\u70B9\u552F\u4E00\u6807\u8BC6\u7B26 */
  id: string;
  /** \u8282\u70B9\u663E\u793A\u540D\u79F0 */
  name: string;
  /** 
   * \u8282\u70B9\u7C7B\u578B
  */
  type: string;
  /** \u8282\u70B9\u914D\u7F6E\u4FE1\u606F */
  config: {
    /** \u8282\u70B9\u6267\u884C\u6761\u4EF6\uFF0C\u4F7F\u7528json-rules-engine\u7684\u6761\u4EF6\u8868\u8FBE\u5F0F */
    conditions?: TopLevelCondition;
    /** \u8282\u70B9\u6267\u884C\u7684\u4E8B\u4EF6 */
    event?: Event;
    /**
     * \u8FED\u4EE3\u8282\u70B9\u7279\u6709\u5C5E\u6027-\u9ED8\u8BA41
     * \u8FED\u4EE3\u6B21\u6570
     */
    iteration_count?:number;
    /**
     * \u8FED\u4EE3\u8282\u70B9\u7279\u6709\u5C5E\u6027-\u9ED8\u8BA4ALL_SUCCESS
     * \u4F7F\u7528IterationMode\u679A\u4E3E\u5B9A\u4E49\u8FED\u4EE3\u6267\u884C\u7684\u884C\u4E3A\u6A21\u5F0F
     */
    iteration_mode?: IterationMode;
    /**
     * \u5E76\u884C\u8282\u70B9\u7279\u6709\u5C5E\u6027
     * \u5E76\u884C\u8282\u70B9\u7684\u6267\u884C\u7B56\u7565 \u9ED8\u8BA4ALL
     * \u4F7F\u7528ParallelStrategy\u679A\u4E3E\u5B9A\u4E49\u5E76\u884C\u6267\u884C\u7684\u6210\u529F\u7B56\u7565
     */
    parallel_strategy?: ParallelStrategy;
    /** \u5176\u4ED6\u81EA\u5B9A\u4E49\u914D\u7F6E\u9879 */
    [key: string]: any;
  };
}

/**
 * \u53D8\u91CF\u5B9A\u4E49\u63A5\u53E3
 * \u63CF\u8FF0\u6D41\u7A0B\u4E0A\u4E0B\u6587\u4E2D\u53D8\u91CF\u7684\u7C7B\u578B\u548C\u5143\u6570\u636E
 */
export interface Variable {
  /** \u53D8\u91CF\u7C7B\u578B\uFF0C\u5982 "string", "number", "boolean", "object" \u7B49 */
  type: string;
  /** \u53D8\u91CF\u6765\u6E90\uFF0C\u5982 "context", "input", "output" \u7B49 */
  source: string;
  /** \u53D8\u91CF\u63CF\u8FF0\u4FE1\u606F */
  description?: string;
  /** \u53D8\u91CF\u9ED8\u8BA4\u503C */
  default?: any;
}

/**
 * \u4E0A\u4E0B\u6587\u914D\u7F6E\u63A5\u53E3
 * \u5B9A\u4E49\u6D41\u7A0B\u6267\u884C\u8FC7\u7A0B\u4E2D\u53EF\u7528\u7684\u53D8\u91CF\u53CA\u5176\u63CF\u8FF0
 */
export interface ContextConfig {
  /**
   * \u4E0A\u4E0B\u6587\u53D8\u91CF\u5B9A\u4E49\uFF0C\u7528\u4E8E\u63CF\u8FF0\u6D41\u7A0B\u4E2D\u4F7F\u7528\u7684\u53D8\u91CF\u53CA\u5176\u5143\u6570\u636E
   * \u952E\u4E3A\u53D8\u91CF\u540D\uFF0C\u503C\u4E3A\u53D8\u91CF\u5B9A\u4E49\u5BF9\u8C61
   */
  variables: Record<string, Variable>;
}

/**
 * \u8FB9\u63A5\u53E3
 * \u8868\u793A\u8282\u70B9\u4E4B\u95F4\u7684\u8FDE\u63A5\u5173\u7CFB
 */
export interface Edge {
  /** \u8FB9\u552F\u4E00\u6807\u8BC6\u7B26 */
  id: string;
  /** \u6E90\u8282\u70B9ID */
  source: string;
  /** \u76EE\u6807\u8282\u70B9ID */
  target: string;
  /** \u8FB9\u6807\u7B7E\uFF0C\u7528\u4E8E\u663E\u793A */
  label?: string;
  /** \u8FB9\u7684\u6761\u4EF6\uFF0C\u51B3\u5B9A\u662F\u5426\u8D70\u8BE5\u5206\u652F */
  conditions?: TopLevelCondition;
  /** \u662F\u5426\u4E3A\u9ED8\u8BA4\u5206\u652F\uFF0C\u5F53\u6CA1\u6709\u5176\u4ED6\u6761\u4EF6\u6EE1\u8DB3\u65F6\u9009\u62E9 */
  isDefault?: boolean;
  /** \u4F18\u5148\u7EA7\uFF0C\u503C\u8D8A\u5C0F\u4F18\u5148\u7EA7\u8D8A\u9AD8\uFF0C\u7528\u4E8E\u5F53\u591A\u6761\u8FB9\u89C4\u5219\u540C\u65F6\u6EE1\u8DB3\u65F6\u7684\u9009\u62E9 */
  priority?: number;
}

/**
 * \u5168\u5C40\u914D\u7F6E\u63A5\u53E3
 * \u5B9A\u4E49\u6D41\u7A0B\u6267\u884C\u7684\u5168\u5C40\u53C2\u6570
 */
export interface GlobalConfig {
  /** \u6D41\u7A0B\u6267\u884C\u8D85\u65F6\u65F6\u95F4\uFF08\u6BEB\u79D2\uFF09 */
  timeout?: number;
  /** \u6700\u5927\u6267\u884C\u6DF1\u5EA6\uFF0C\u9632\u6B62\u65E0\u9650\u5FAA\u73AF */
  max_depth?: number;
  /** \u5176\u4ED6\u81EA\u5B9A\u4E49\u5168\u5C40\u914D\u7F6E */
  [key: string]: any;
}

/**
 * \u6267\u884C\u4E0A\u4E0B\u6587
 * \u8868\u793A\u6D41\u7A0B\u6267\u884C\u8FC7\u7A0B\u4E2D\u7684\u4E0A\u4E0B\u6587\u6570\u636E
 */
export interface ExecutionContext {
  /** \u4E0A\u4E0B\u6587\u53D8\u91CF\u96C6\u5408 */
  variables: Record<string, any>;

}

/**
 * \u6267\u884C\u5386\u53F2\u8BB0\u5F55\u63A5\u53E3
 * \u8BB0\u5F55\u8282\u70B9\u6267\u884C\u7684\u8BE6\u7EC6\u4FE1\u606F
 */
export interface ExecutionHistory {
  /** \u8282\u70B9\u552F\u4E00\u6807\u8BC6\u7B26 */
  nodeId: string;
  /** \u8282\u70B9\u540D\u79F0 */
  nodeName: string;
  /** \u8282\u70B9\u7C7B\u578B */
  nodeType: string;
  /** \u8282\u70B9\u6267\u884C\u72B6\u6001 */
  status: NodeStatus;
  /** \u5F00\u59CB\u6267\u884C\u65F6\u95F4 */
  startTime?: Date;
  /** \u7ED3\u675F\u6267\u884C\u65F6\u95F4 */
  endTime?: Date;
  /** \u6267\u884C\u8017\u65F6\uFF08\u6BEB\u79D2\uFF09 */
  duration?: number;
  /** \u6267\u884C\u524D\u7684\u4E0A\u4E0B\u6587\u53D8\u91CF\u72B6\u6001 */
  contextBefore?: Record<string, any>;
  /** \u6267\u884C\u540E\u7684\u4E0A\u4E0B\u6587\u53D8\u91CF\u72B6\u6001 */
  contextAfter?: Record<string, any>;
  /** \u6267\u884C\u7684\u4E8B\u4EF6 */
  event?: Event;
  /** \u6267\u884C\u7684\u6761\u4EF6 */
  conditions?: TopLevelCondition;
  /** \u4E8B\u4EF6\u6267\u884C\u7ED3\u679C */
  eventResult?: any;
  /** \u65E5\u5FD7\u8BB0\u5F55\u65F6\u95F4 */
  timestamp: Date;
  /** \u5F15\u64CE\u6267\u884C\u7ED3\u679C\u4FE1\u606F */
  engineResult?: any;
  /** \u5206\u652F\u51B3\u7B56\u4FE1\u606F */
  decision?: {
    selectPath: string,
    conditions?: TopLevelCondition,
    isDefault?: boolean
  };
  /** \u662F\u5426\u4E3A\u6D41\u7A0B\u7ED3\u675F\u8282\u70B9 */
  is_end_node?: boolean;
  /**
   * \u5E76\u884C\u7B56\u7565
   * ParallelStrategy.ALL: \u6240\u6709\u5206\u652F\u6210\u529F\u624D\u7B97\u6210\u529F
   * ParallelStrategy.ANY: \u4EFB\u4E00\u5206\u652F\u6210\u529F\u5C31\u7B97\u6210\u529F
   */
  parallel_strategy?: ParallelStrategy;
  /** \u5E76\u884C\u6267\u884C\u7684\u8FB9\u4FE1\u606F */
  parallel_edges?: Array<{
    target: string,
    conditions?: TopLevelCondition,
    isDefault?: boolean
  }>;
}

/**
 * \u6D41\u7A0B\u5B9A\u4E49\u63A5\u53E3
 * \u5B8C\u6574\u63CF\u8FF0\u4E00\u4E2A\u6D41\u7A0B\u7684\u6240\u6709\u914D\u7F6E\u4FE1\u606F
 */
export interface FlowDefinition {
  /** \u6D41\u7A0B\u57FA\u672C\u4FE1\u606F */
  flow: {
    /** \u6D41\u7A0B\u552F\u4E00\u6807\u8BC6\u7B26 */
    id: string;
    /** \u6D41\u7A0B\u540D\u79F0 */
    name: string;
    /** \u6D41\u7A0B\u7248\u672C\u53F7 */
    version: string;
    /** \u6D41\u7A0B\u63CF\u8FF0 */
    description: string;
    /** \u6D41\u7A0B\u5206\u7C7B */
    category: string;
    /** \u6D41\u7A0B\u72B6\u6001\u662F\u5426\u542F\u7528 */
    enable: boolean;
    /** \u521B\u5EFA\u65E5\u671F */
    create_date: string;
    /** \u66F4\u65B0\u65E5\u671F */
    update_date: string;
    /** \u662F\u5426\u81EA\u52A8\u6267\u884C\u6D41\u7A0B */
    auto?: boolean;
  };
  /** \u6D41\u7A0B\u4E0A\u4E0B\u6587\u914D\u7F6E */
  context: ContextConfig;
  /** \u6D41\u7A0B\u8282\u70B9\u5217\u8868 */
  nodes: Node[];
  /** \u6D41\u7A0B\u8FB9\u5217\u8868 */
  edges: Edge[];
  /** \u6D41\u7A0B\u5168\u5C40\u914D\u7F6E */
  global_config: GlobalConfig;
}`}}]);
