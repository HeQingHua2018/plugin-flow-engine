"use strict";(self.webpackChunk_plugin_flow_engine_doc=self.webpackChunk_plugin_flow_engine_doc||[]).push([[904],{69930:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},79869:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},86661:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},21964:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},20148:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},79271:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},70281:function(t,a,e){var n;e.r(a),e.d(a,{demos:function(){return W}});var d=e(90819),i=e.n(d),A=e(45332),m=e.n(A),D=e(89933),P=e.n(D),f=e(44194),S=e(95257),W={"docs-modules-ui-demo-0":{component:f.memo(f.lazy(P()(i()().mark(function y(){var c,l,r,v,p,I,_,x,b,w;return i()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,Promise.resolve().then(e.t.bind(e,44194,19));case 2:return c=u.sent,l=c.default,r=c.useState,v=c.useEffect,u.next=8,Promise.resolve().then(e.bind(e,95257));case 8:return p=u.sent,I=p.DynamicConfigForm,_=p.injectWidget,x=p.AntdWidgetKeys,b=function(s){var o=s.value,g=s.onChange,h=r(function(){return JSON.stringify(o!=null?o:{},null,2)}),M=m()(h,2),R=M[0],T=M[1],K=r(null),O=m()(K,2),C=O[0],N=O[1];v(function(){T(JSON.stringify(o!=null?o:{},null,2))},[o]);var B=function(L){var U=L.target.value;T(U);try{var J=JSON.parse(U||"{}");N(null),g(J)}catch(E){N((E==null?void 0:E.message)||"JSON \u89E3\u6790\u5931\u8D25")}};return l.createElement("div",null,l.createElement("textarea",{style:{width:"100%",minHeight:120,fontFamily:"monospace"},value:R,onChange:B}),C&&l.createElement("div",{style:{marginTop:8,color:"red"}},"\u9519\u8BEF\uFF1A",C))},_("json-editor",b),w={type:"MyAction",label:"Widget \u6CE8\u5165\u793A\u4F8B",config:[{field:"name",type:x.Input,label:"\u540D\u79F0",formItemProps:{rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u540D\u79F0"}]}},{field:"count",type:x.InputNumber,label:"\u6570\u91CF"},{field:"enabled",type:x.Switch,label:"\u542F\u7528"},{field:"config",type:"json-editor",label:"\u914D\u7F6E(JSON)"}]},u.abrupt("return",{default:function(){var s=r({name:"demo",count:1,enabled:!0,config:{foo:"bar"}}),o=m()(s,2),g=o[0],h=o[1];return l.createElement("div",null,l.createElement(I,{schema:w,value:g,onChange:h}),l.createElement("pre",{style:{marginTop:16}},JSON.stringify(g,null,2)))}});case 16:case"end":return u.stop()}},y)})))),asset:{type:"BLOCK",id:"docs-modules-ui-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import React, { useState, useEffect } from 'react';
import type { Schema } from '@plugin-flow-engine/type/common';
import type { WidgetProps } from '@plugin-flow-engine/ui';
import { DynamicConfigForm, injectWidget, AntdWidgetKeys } from '@plugin-flow-engine/ui';

// \u81EA\u5B9A\u4E49 JSON \u7F16\u8F91\u5668\u63A7\u4EF6\uFF08\u5E26\u9519\u8BEF\u5904\u7406\u4E0E\u53D7\u63A7\u72B6\u6001\uFF09
const JsonEditor: React.FC<WidgetProps<any>> = ({ value, onChange }) => {
  const [text, setText] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(JSON.stringify(value ?? {}, null, 2));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setText(next);
    try {
      const parsed = JSON.parse(next || '{}');
      setError(null);
      onChange(parsed);
    } catch (err: any) {
      setError(err?.message || 'JSON \u89E3\u6790\u5931\u8D25');
    }
  };

  return (
    <div>
      <textarea
        style={{ width: '100%', minHeight: 120, fontFamily: 'monospace' }}
        value={text}
        onChange={handleChange}
      />
      {error && <div style={{ marginTop: 8, color: 'red' }}>\u9519\u8BEF\uFF1A{error}</div>}
    </div>
  );
};

// \u6CE8\u518C\u81EA\u5B9A\u4E49\u63A7\u4EF6
injectWidget('json-editor', JsonEditor);

// \u5B9A\u4E49 Schema\uFF08\u4ECE type/common \u5B50\u8DEF\u5F84\u5BFC\u5165\u7C7B\u578B\uFF09
const schema: Schema = {
  type: 'MyAction',
  label: 'Widget \u6CE8\u5165\u793A\u4F8B',
  config: [
    { 
        field: 'name', 
        type: AntdWidgetKeys.Input, 
        label: '\u540D\u79F0', 
        formItemProps: {
          rules: [{ required: true, message: '\u8BF7\u8F93\u5165\u540D\u79F0' }],
        }
    },
    { 
        field: 'count', 
        type: AntdWidgetKeys.InputNumber, 
        label: '\u6570\u91CF' 
    },
    { 
        field: 'enabled', 
        type: AntdWidgetKeys.Switch, 
        label: '\u542F\u7528' 
    },
    { 
        field: 'config', 
        type: 'json-editor', 
        label: '\u914D\u7F6E(JSON)' 
    },
  ],
};

export default () => {
  const [value, setValue] = useState<any>({ name: 'demo', count: 1, enabled: true, config: { foo: 'bar' } });
  return (
    <div>
      <DynamicConfigForm schema={schema} value={value} onChange={setValue} />
      <pre style={{ marginTop: 16 }}>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};`},react:{type:"NPM",value:"18.3.1"},"@plugin-flow-engine/ui":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{react:n||(n=e.t(f,2)),"@plugin-flow-engine/ui":S},renderOpts:{compile:function(){var y=P()(i()().mark(function l(){var r,v=arguments;return i()().wrap(function(I){for(;;)switch(I.prev=I.next){case 0:return I.next=2,e.e(101).then(e.bind(e,41101));case 2:return I.abrupt("return",(r=I.sent).default.apply(r,v));case 3:case"end":return I.stop()}},l)}));function c(){return y.apply(this,arguments)}return c}()}}}},92776:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},403:function(t,a,e){e.r(a),e.d(a,{demos:function(){return d}});var n=e(44194),d={}},97050:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"\u57FA\u4E8E",paraId:0,tocIndex:1},{value:"@plugin-flow-engine/ui",paraId:1,tocIndex:1},{value:"@plugin-flow-engine/type",paraId:1,tocIndex:1},{value:"@plugin-flow-engine/core",paraId:1,tocIndex:1},{value:"@xyflow/react",paraId:1,tocIndex:1},{value:`
\u5B9E\u73B0\u7684 React \u7EC4\u4EF6\uFF0C\u7528\u4E8E\u53EF\u89C6\u5316\u5C55\u793A\u6D41\u7A0B\u4E0E\u63D2\u4EF6\u5316\u6267\u884C\u6548\u679C\u3002`,paraId:1,tocIndex:1},{value:"FlowView",paraId:2,tocIndex:2},{value:"\u7EC4\u4EF6(\u542BUI)",paraId:2,tocIndex:2},{value:"PluginView",paraId:2,tocIndex:2},{value:" \u7EC4\u4EF6(\u4E0D\u542BUI)",paraId:2,tocIndex:2}]},70097:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"Plugin Flow Engine \u662F\u4E00\u5957\u7528\u4E8E\u524D\u7AEF\u5DE5\u7A0B\u4E2D\u7684\u201C\u63D2\u4EF6\u5316\u6D41\u7A0B\u201D\u89E3\u51B3\u65B9\u6848\uFF1A",paraId:0,tocIndex:0},{value:"\u201C\u63D2\u4EF6\u201D\u63CF\u8FF0\u6D41\u7A0B\u8282\u70B9\uFF08\u89E6\u53D1\u3001\u52A8\u4F5C\u3001\u5206\u652F\u3001\u5E76\u884C\u3001\u8FED\u4EE3\u3001\u5408\u5E76\u3001\u7ED3\u675F\u7B49\uFF09\uFF1B",paraId:1,tocIndex:0},{value:"\u201C\u5F15\u64CE\u201D\u8D1F\u8D23\u8FD0\u884C\u4E0E\u72B6\u6001\u7EF4\u62A4\uFF1B",paraId:1,tocIndex:0},{value:"\u201C\u7EC4\u4EF6\u201D\u7528\u4E8E UI \u6E32\u67D3\u4E0E\u8868\u5355\u914D\u7F6E\uFF1B",paraId:1,tocIndex:0},{value:"\u201C\u6CE8\u5165\u5668\u201D\u652F\u6301 schema \u4E0E\u63A7\u4EF6\u8986\u5199/\u6269\u5C55\uFF1B",paraId:1,tocIndex:0},{value:"\u63D0\u4F9B\u5B8C\u6574\u7C7B\u578B\u5B9A\u4E49\u4E0E\u6700\u4F73\u5B9E\u8DF5\u3002",paraId:1,tocIndex:0},{value:`# \u6838\u5FC3\uFF08\u4E0D\u542B UI\uFF09
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# UI\uFF08React \u73AF\u5883\uFF0C\u53EF\u9009\uFF09
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom
`,paraId:2,tocIndex:2},{value:`import { PluginManagerInstance, BaseNodePlugin, useFlowEngine } from '@plugin-flow-engine/core';
import type { FlowData } from '@plugin-flow-engine/type/core';

// 1) \u5B9A\u4E49\u5E76\u6CE8\u518C\u63D2\u4EF6
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction';
  pluginNodeTypeName = '\u6211\u7684\u52A8\u4F5C';
  async execute(node, context, engine) {
    // \u5728\u6B64\u6267\u884C\u4F60\u7684\u4E1A\u52A1\u903B\u8F91\uFF08\u8FD4\u56DE true \u8868\u793A\u7EE7\u7EED\uFF0Cfalse \u8868\u793A\u505C\u6B62\uFF09
    return true;
  }
}
PluginManagerInstance().registerPlugin(new MyActionPlugin());

// 2) \u6784\u9020\u6700\u5C0F\u6D41\u7A0B\u6570\u636E
const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', description: '', category: 'demo', enable: true, create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [
    { id: 'trigger', type: 'Trigger', position: { x: 0, y: 0 }, data: { name: '\u89E6\u53D1', pluginNodeType: 'Trigger' } },
    { id: 'action', type: 'Action', position: { x: 200, y: 0 }, data: { name: '\u52A8\u4F5C', pluginNodeType: 'MyAction', config: {} } },
    { id: 'end', type: 'End', position: { x: 400, y: 0 }, data: { name: '\u7ED3\u675F', pluginNodeType: 'End' } },
  ],
  edges: [
    { id: 'e1', source: 'trigger', target: 'action', type: 'basic_edge', data: {} },
    { id: 'e2', source: 'action', target: 'end', type: 'basic_edge', data: {} },
  ],
  global_config: {},
};

// 3) \u6267\u884C\u6D41\u7A0B
const { executeFlow, executionHistory } = useFlowEngine({ flowData, initialVariables: {} });
await executeFlow();
console.log(executionHistory);
`,paraId:3,tocIndex:3},{value:"\u9879\u76EE\u5206\u4E3A\u4EE5\u4E0B\u4E09\u90E8\u5206\uFF1A",paraId:4,tocIndex:5},{value:"@plugin-flow-engine/core",paraId:5,tocIndex:5},{value:`\uFF1A\u6838\u5FC3\u5E93
`,paraId:5,tocIndex:5},{value:"\u6D41\u7A0B\u5F15\u64CE\uFF08\u8BC4\u4F30\u89C4\u5219\u3001\u6267\u884C\u6D41\u7A0B\u3001\u7EF4\u62A4\u72B6\u6001\u7B49\uFF09",paraId:6,tocIndex:5},{value:"\u63D2\u4EF6\u7CFB\u7EDF\uFF08\u6CE8\u518C\u63D2\u4EF6\u3001\u8C03\u7528\u63D2\u4EF6\u3001\u63D2\u4EF6\u751F\u547D\u5468\u671F\u7BA1\u7406\u7B49\uFF09",paraId:6,tocIndex:5},{value:"\u4E8B\u4EF6\u7CFB\u7EDF\uFF08\u6CE8\u518C\u4E8B\u4EF6\u3001\u89E6\u53D1\u4E8B\u4EF6\u3001\u76D1\u542C\u4E8B\u4EF6\u7B49\uFF09",paraId:6,tocIndex:5},{value:"\u6570\u636E\u7BA1\u7406\uFF08\u7528\u4E8E\u5B58\u50A8\u6D41\u7A0B\u72B6\u6001\u3001\u53D8\u91CF\u3001\u4E0A\u4E0B\u6587\u7B49\uFF09",paraId:6,tocIndex:5},{value:"@plugin-flow-engine/ui",paraId:5,tocIndex:5},{value:`\uFF1AUI \u7EC4\u4EF6\u5E93
`,paraId:5,tocIndex:5},{value:"\u8282\u70B9\u914D\u7F6E",paraId:7,tocIndex:5},{value:"\u5185\u7F6Eantd\u8868\u5355\u63A7\u4EF6",paraId:7,tocIndex:5},{value:"\u81EA\u5B9A\u4E49\u6CE8\u518C\u8282\u70B9\u7EC4\u4EF6",paraId:7,tocIndex:5},{value:"@plugin-flow-engine/type",paraId:5,tocIndex:5},{value:`\uFF1A\u7C7B\u578B\u5B9A\u4E49\u5E93\uFF0C
`,paraId:5,tocIndex:5},{value:"\u5305\u542B\u6D41\u7A0B\u6570\u636E\u7ED3\u6784",paraId:8,tocIndex:5},{value:"\u63D2\u4EF6\u63A5\u53E3",paraId:8,tocIndex:5},{value:"\u6267\u884C\u4E0A\u4E0B\u6587\u7B49\u7C7B\u578B",paraId:8,tocIndex:5},{value:"react",paraId:9,tocIndex:6},{value:"\u3001",paraId:9,tocIndex:6},{value:"react-dom",paraId:9,tocIndex:6},{value:"\uFF08UI \u6E32\u67D3\u57FA\u7840\uFF09",paraId:9,tocIndex:6},{value:"@xyflow/react",paraId:9,tocIndex:6},{value:"\uFF08\u6D41\u7A0B\u56FE UI\uFF09",paraId:9,tocIndex:6},{value:"antd",paraId:9,tocIndex:6},{value:"\uFF08\u57FA\u7840\u8868\u5355\u63A7\u4EF6\uFF09",paraId:9,tocIndex:6},{value:"dumi",paraId:9,tocIndex:6},{value:"\uFF08\u6587\u6863\uFF09",paraId:9,tocIndex:6},{value:"father",paraId:9,tocIndex:6},{value:"\uFF08\u5E93\u6784\u5EFA\uFF09",paraId:9,tocIndex:6}]},29638:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[]},6105:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:`# \u6838\u5FC3\uFF08\u4E0D\u542B UI\uFF09
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# UI\uFF08React \u73AF\u5883\uFF0C\u53EF\u9009\uFF09
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom
`,paraId:0,tocIndex:1},{value:"\u4F7F\u7528",paraId:1,tocIndex:1},{value:`import { PluginManagerInstance } from '@plugin-flow-engine/core';

// \u5728\u5E94\u7528\u542F\u52A8\u65F6\u6CE8\u518C\u81EA\u5B9A\u4E49\u63D2\u4EF6\uFF08\u793A\u4F8B\uFF09
PluginManagerInstance().registerAllPlugin([
  // new MyNodePlugin(),
  // new MyOtherPlugin(),
]);
`,paraId:2,tocIndex:1},{value:"\u63D2\u4EF6\u9700\u5B9E\u73B0 ",paraId:3,tocIndex:2},{value:"pluginNodeType",paraId:3,tocIndex:2},{value:" \u4E0E ",paraId:3,tocIndex:2},{value:"pluginNodeTypeName",paraId:3,tocIndex:2},{value:"\uFF0C\u5E76\u5728\u8FD4\u56DE\u8868\u5355 ",paraId:3,tocIndex:2},{value:"schema",paraId:3,tocIndex:2},{value:" \u65F6\u786E\u4FDD ",paraId:3,tocIndex:2},{value:"schema.type",paraId:3,tocIndex:2},{value:" \u4E0E\u4E4B\u5BF9\u9F50\u3002",paraId:3,tocIndex:2},{value:"Core \u6A21\u5757",paraId:4,tocIndex:3},{value:"UI \u6A21\u5757",paraId:5,tocIndex:3},{value:"Type \u6A21\u5757",paraId:6,tocIndex:3},{value:"\u7C7B\u578B\u5BFC\u5165\u6700\u4F73\u5B9E\u8DF5\uFF1A\u63A8\u8350\u4F7F\u7528\u5B50\u8DEF\u5F84\u6309\u9700\u5BFC\u5165\u7C7B\u578B\uFF08",paraId:7,tocIndex:3},{value:"@plugin-flow-engine/type/common",paraId:7,tocIndex:3},{value:"\u3001",paraId:7,tocIndex:3},{value:"@plugin-flow-engine/type/core",paraId:7,tocIndex:3},{value:"\u3001",paraId:7,tocIndex:3},{value:"@plugin-flow-engine/type/ui",paraId:7,tocIndex:3},{value:"\uFF09\uFF0C\u793A\u4F8B\u53C2\u89C1 ",paraId:7,tocIndex:3},{value:"Type \u6A21\u5757",paraId:8,tocIndex:3}]},21979:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"\u63D0\u4F9B\u52A8\u6001\u914D\u7F6E\u8868\u5355\u3001\u63A7\u4EF6\u6CE8\u5165\u5668\u4E0E\u63D2\u4EF6 UI \u6CE8\u518C\u5668\uFF0C\u4E13\u6CE8\u754C\u9762\u6E32\u67D3\u4E0E\u4EA4\u4E92\uFF0C\u4E0D\u5305\u542B\u6267\u884C\u5F15\u64CE\u3002",paraId:0,tocIndex:1},{value:"\u52A8\u6001\u8868\u5355\uFF1A",paraId:1,tocIndex:2},{value:"DynamicConfigForm",paraId:1,tocIndex:2},{value:" \u57FA\u4E8E ",paraId:1,tocIndex:2},{value:"schema",paraId:1,tocIndex:2},{value:" \u81EA\u52A8\u6E32\u67D3\u3002",paraId:1,tocIndex:2},{value:"\u63A7\u4EF6\u6CE8\u5165\uFF1A",paraId:1,tocIndex:2},{value:"injectWidget",paraId:1,tocIndex:2},{value:"\u3001",paraId:1,tocIndex:2},{value:"getWidgets",paraId:1,tocIndex:2},{value:" \u652F\u6301\u6269\u5C55\u4E0E\u67E5\u8BE2\u3002",paraId:1,tocIndex:2},{value:"\u8282\u70B9\u8868\u5355\uFF1A",paraId:1,tocIndex:2},{value:"injectNodeSchema",paraId:1,tocIndex:2},{value:"\u3001",paraId:1,tocIndex:2},{value:"getNodeSchemas",paraId:1,tocIndex:2},{value:" \u7BA1\u7406\u8282\u70B9\u7C7B\u578B\u7684\u8868\u5355\u914D\u7F6E\u3002",paraId:1,tocIndex:2},{value:"\u63D2\u4EF6 UI\uFF1A",paraId:1,tocIndex:2},{value:"registerPluginUI",paraId:1,tocIndex:2},{value:"\u3001",paraId:1,tocIndex:2},{value:"bindPluginsToUI",paraId:1,tocIndex:2},{value:"\u3001",paraId:1,tocIndex:2},{value:"resolveNodeFormConfig",paraId:1,tocIndex:2},{value:" \u4E32\u8054\u201C\u63D2\u4EF6 \u2192 \u8868\u5355\u201D\u3002",paraId:1,tocIndex:2},{value:"Antd \u952E\u540D\uFF1A",paraId:1,tocIndex:2},{value:"AntdWidgetKeys",paraId:1,tocIndex:2},{value:" \u4E0E ",paraId:1,tocIndex:2},{value:"AntdWidgetKey",paraId:1,tocIndex:2},{value:" \u7EDF\u4E00\u63A7\u4EF6\u952E\u540D\u63D0\u793A\u3002",paraId:1,tocIndex:2},{value:`pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type
`,paraId:2,tocIndex:3},{value:"\u5982\u9700\u5728 React \u4E2D\u4F7F\u7528\uFF1A",paraId:3,tocIndex:3},{value:`pnpm add react react-dom
`,paraId:4,tocIndex:3},{value:"registerPluginUI(nodeType, ui)",paraId:5,tocIndex:5},{value:"\uFF1A\u5728 UI \u5C42\u624B\u52A8\u6CE8\u518C\u67D0\u4E2A\u63D2\u4EF6\u7684\u8868\u5355 ",paraId:5,tocIndex:5},{value:"schema",paraId:5,tocIndex:5},{value:" \u4E0E ",paraId:5,tocIndex:5},{value:"widgets",paraId:5,tocIndex:5},{value:"\uFF0C\u9002\u5408\u4E0D\u7ECF\u63D2\u4EF6\u7BA1\u7406\u5668\u7684\u573A\u666F\u6216\u6D4B\u8BD5\u3002",paraId:5,tocIndex:5},{value:"bindPluginsToUI(pm)",paraId:5,tocIndex:5},{value:"\uFF1A\u4ECE\u63D2\u4EF6\u7BA1\u7406\u5668\u8BFB\u53D6\u6BCF\u4E2A\u63D2\u4EF6\u7684 ",paraId:5,tocIndex:5},{value:"getNodeFormConfig()",paraId:5,tocIndex:5},{value:"\uFF0C\u6279\u91CF\u6CE8\u5165 ",paraId:5,tocIndex:5},{value:"schema",paraId:5,tocIndex:5},{value:" \u4E0E ",paraId:5,tocIndex:5},{value:"widgets",paraId:5,tocIndex:5},{value:"\u3002\u63A8\u8350\u5728\u5E94\u7528\u542F\u52A8\u65F6\u8C03\u7528\u4E00\u6B21\u3002",paraId:5,tocIndex:5},{value:"resolveNodeFormConfig(pm, nodeType)",paraId:5,tocIndex:5},{value:"\uFF1A\u89E3\u6790\u67D0\u8282\u70B9\u7C7B\u578B\u7684\u6700\u7EC8\u8868\u5355\u914D\u7F6E\u3002\u4F18\u5148\u4F7F\u7528 UI \u6CE8\u5165\u5668\u4E2D\u7684 ",paraId:5,tocIndex:5},{value:"schema",paraId:5,tocIndex:5},{value:"\uFF0C\u5426\u5219\u56DE\u9000\u5230\u63D2\u4EF6\u81EA\u8EAB\u7684 ",paraId:5,tocIndex:5},{value:"schema",paraId:5,tocIndex:5},{value:"\uFF1B\u540C\u65F6\u786E\u4FDD\u63D2\u4EF6\u63D0\u4F9B\u7684 ",paraId:5,tocIndex:5},{value:"widgets",paraId:5,tocIndex:5},{value:" \u88AB\u6CE8\u5165\u3002",paraId:5,tocIndex:5},{value:"\u793A\u4F8B 1\uFF1A\u6279\u91CF\u7ED1\u5B9A\u63D2\u4EF6 UI",paraId:6,tocIndex:5},{value:`import { PluginManagerInstance, BaseNodePlugin } from '@plugin-flow-engine/core';
import { bindPluginsToUI } from '@plugin-flow-engine/ui';

class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction';
  pluginNodeTypeName = '\u6211\u7684\u52A8\u4F5C';
  getNodeFormConfig() {
    return {
      schema: {
        type: 'MyAction',
        label: '\u6211\u7684\u52A8\u4F5C\u914D\u7F6E',
        config: [
          { field: 'title', label: '\u6807\u9898', type: 'ant_Input' },
        ],
      },
      widgets: {
        'json-editor': ({ value, onChange }: any) => (
          <textarea value={JSON.stringify(value ?? {}, null, 2)} onChange={(e) => onChange(JSON.parse(e.target.value || '{}'))} />
        ),
      },
    };
  }
}

const pm = PluginManagerInstance();
pm.registerPlugin(new MyActionPlugin());

// \u5C06\u6240\u6709\u63D2\u4EF6\u7684 schema \u4E0E widgets \u6CE8\u5165\u5230 UI
bindPluginsToUI(pm);
`,paraId:7,tocIndex:5},{value:"\u793A\u4F8B 2\uFF1A\u5728\u8FD0\u884C\u65F6\u89E3\u6790\u8282\u70B9\u7684\u8868\u5355\u914D\u7F6E",paraId:8,tocIndex:5},{value:`import { resolveNodeFormConfig } from '@plugin-flow-engine/ui';
import { PluginManagerInstance } from '@plugin-flow-engine/core';

const pm = PluginManagerInstance();
const { schema } = resolveNodeFormConfig(pm, 'MyAction');
// \u5982\u5728 FlowView \u4E2D\uFF1A\u6253\u5F00\u62BD\u5C49\u65F6\u6839\u636E node.data.pluginNodeType \u89E3\u6790
// const { schema } = resolveNodeFormConfig(pm, node.data.pluginNodeType);
`,paraId:9,tocIndex:5},{value:"\u793A\u4F8B 3\uFF1A\u624B\u52A8\u6CE8\u518C\u67D0\u63D2\u4EF6\u7684 UI \u5143\u6570\u636E",paraId:10,tocIndex:5},{value:`import { registerPluginUI } from '@plugin-flow-engine/ui';

registerPluginUI('MyAction', {
  schema: {
    type: 'MyAction',
    label: '\u6211\u7684\u52A8\u4F5C\u914D\u7F6E',
    config: [
      { field: 'title', label: '\u6807\u9898', type: 'ant_Input' },
    ],
  },
  widgets: {
    'json-editor': /* React \u7EC4\u4EF6 */ (() => null) as any,
  },
});
`,paraId:11,tocIndex:5},{value:"\u884C\u4E3A\u8BF4\u660E",paraId:12,tocIndex:5},{value:"\u6CE8\u5165\u4F18\u5148\u7EA7\uFF1AUI \u6CE8\u5165\u5668\u4E2D\u7684 ",paraId:13,tocIndex:5},{value:"schema",paraId:13,tocIndex:5},{value:" \u4F18\u5148\uFF1B\u672A\u6CE8\u5165\u5219\u56DE\u9000\u5230\u63D2\u4EF6\u63D0\u4F9B\u7684 ",paraId:13,tocIndex:5},{value:"schema",paraId:13,tocIndex:5},{value:"\u3002",paraId:13,tocIndex:5},{value:"\u81EA\u52A8\u6CE8\u5165\uFF1A",paraId:13,tocIndex:5},{value:"bindPluginsToUI(pm)",paraId:13,tocIndex:5},{value:" \u4F1A\u81EA\u52A8\u6CE8\u5165\u63D2\u4EF6\u7684 ",paraId:13,tocIndex:5},{value:"schema",paraId:13,tocIndex:5},{value:" \u4E0E ",paraId:13,tocIndex:5},{value:"widgets",paraId:13,tocIndex:5},{value:"\u3002",paraId:13,tocIndex:5},{value:"\u515C\u5E95\u5904\u7406\uFF1A\u5373\u4F7F\u672A\u8C03\u7528 ",paraId:13,tocIndex:5},{value:"bindPluginsToUI",paraId:13,tocIndex:5},{value:"\uFF0C",paraId:13,tocIndex:5},{value:"resolveNodeFormConfig(pm, nodeType)",paraId:13,tocIndex:5},{value:" \u4E5F\u4F1A\u8FD4\u56DE\u63D2\u4EF6\u7684 ",paraId:13,tocIndex:5},{value:"schema",paraId:13,tocIndex:5},{value:" \u5E76\u81EA\u52A8\u6CE8\u5165\u5176 ",paraId:13,tocIndex:5},{value:"widgets",paraId:13,tocIndex:5},{value:"\uFF0C\u56E0\u6B64\u8868\u5355\u53EF\u6B63\u5E38\u6E32\u67D3\uFF1B\u4F46\u8BE5 ",paraId:13,tocIndex:5},{value:"schema",paraId:13,tocIndex:5},{value:" \u4E0D\u4F1A\u8BB0\u5F55\u8FDB\u6CE8\u5165\u5668\u7684\u6CE8\u518C\u8868\uFF08",paraId:13,tocIndex:5},{value:"getNodeSchemas()",paraId:13,tocIndex:5},{value:" \u67E5\u770B\u4E0D\u5230\uFF09\uFF0C\u5982\u9700\u5168\u5C40\u67E5\u8BE2\u6216\u8986\u5199\uFF0C\u5EFA\u8BAE\u8C03\u7528 ",paraId:13,tocIndex:5},{value:"bindPluginsToUI",paraId:13,tocIndex:5},{value:" \u6216 ",paraId:13,tocIndex:5},{value:"registerPluginUI",paraId:13,tocIndex:5},{value:"\u3002",paraId:13,tocIndex:5}]},58691:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"deploy.yml \u6539\u6210npm && release (",paraId:0,tocIndex:1},{value:"141f703",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"deploy.yml \u6539\u6210npm && release (",paraId:0,tocIndex:1},{value:"8da3f64",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"github \u81EA\u52A8\u5316\u90E8\u7F72\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:0,tocIndex:1},{value:"a789fba",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"\u4FEE\u6539dumi\u914D\u7F6E\u4EE5\u53CA\u81EA\u52A8\u5316\u6253\u5305\u914D\u7F6E\u6587\u4EF6 (",paraId:0,tocIndex:1},{value:"703b9ea",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:0,tocIndex:1},{value:"09791a8",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:0,tocIndex:1},{value:"a96cbac",paraId:0,tocIndex:1},{value:")",paraId:0,tocIndex:1},{value:"github \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:1,tocIndex:2},{value:"ebcbe9b",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"github\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 && release (",paraId:1,tocIndex:2},{value:"058b193",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"github\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 && release (",paraId:1,tocIndex:2},{value:"e4c0c0e",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"github\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 && release (",paraId:1,tocIndex:2},{value:"b54a3da",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"github\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 && release (",paraId:1,tocIndex:2},{value:"68c63d3",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u4FEE\u6539FlowView\u7EC4\u4EF6 (",paraId:1,tocIndex:2},{value:"0195435",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u4FEE\u6539\u6570\u636E\u7ED3\u6784 (",paraId:1,tocIndex:2},{value:"1e2375b",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u4FEE\u6539\u6570\u636E\u7ED3\u6784 (",paraId:1,tocIndex:2},{value:"bc6b15d",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u4FEE\u6539\u914D\u7F6E\u6587\u4EF6 (",paraId:1,tocIndex:2},{value:"c7e3661",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u589E\u5F3A\u89C4\u5219\u8BC4\u4F30\u5F15\u64CE (",paraId:1,tocIndex:2},{value:"ebb9581",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u62C6\u5305 (",paraId:1,tocIndex:2},{value:"2108510",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u62C6\u5305\u540E\u91CD\u6784 (",paraId:1,tocIndex:2},{value:"6707ed6",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u6570\u636E\u7ED3\u6784\u7C7B\u578B\u8C03\u6574 (",paraId:1,tocIndex:2},{value:"992485d",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u7248\u672C\u597D\u4FEE\u6B63 && release (",paraId:1,tocIndex:2},{value:"cd879b3",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u7EC4\u4EF6\u4FEE\u6539 (",paraId:1,tocIndex:2},{value:"370317b",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u8FC1\u79FBFlowView\u7EC4\u4EF6\u5230UI\u5305 (",paraId:1,tocIndex:2},{value:"fee98cc",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:1,tocIndex:2},{value:"f62f1f3",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:1,tocIndex:2},{value:"16e4277",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 release (",paraId:1,tocIndex:2},{value:"dfde75d",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 release (",paraId:1,tocIndex:2},{value:"d13e631",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 release (",paraId:1,tocIndex:2},{value:"42ef623",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"\u91CD\u6784type \u5305\u6A21\u5757\u3001\u4FEE\u6539core/ui\u5305\u7684\u4F7F\u7528\u65B9\u5F0F (",paraId:1,tocIndex:2},{value:"56c9ca2",paraId:1,tocIndex:2},{value:")",paraId:1,tocIndex:2},{value:"github\u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 && release (",paraId:2,tocIndex:4},{value:"e4c0c0e",paraId:2,tocIndex:4},{value:")",paraId:2,tocIndex:4},{value:"fix: \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:3,tocIndex:5},{value:"09791a8",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"fix: \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:3,tocIndex:5},{value:"a96cbac",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"fix: github \u81EA\u52A8\u5316\u90E8\u7F72\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:3,tocIndex:5},{value:"a789fba",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"update: \u66F4\u65B0\u53D8\u66F4\u65E5\u5FD7 && release (",paraId:3,tocIndex:5},{value:"3b0fc37",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"feat: github \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:3,tocIndex:5},{value:"ebcbe9b",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"release: v1.0.0 (",paraId:3,tocIndex:5},{value:"34ae942",paraId:3,tocIndex:5},{value:")",paraId:3,tocIndex:5},{value:"feat: github \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:4,tocIndex:6},{value:"ebcbe9b",paraId:4,tocIndex:6},{value:")",paraId:4,tocIndex:6},{value:"fix: \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:4,tocIndex:6},{value:"09791a8",paraId:4,tocIndex:6},{value:")",paraId:4,tocIndex:6},{value:"fix: \u81EA\u52A8\u6784\u5EFA\u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:4,tocIndex:6},{value:"a96cbac",paraId:4,tocIndex:6},{value:")",paraId:4,tocIndex:6},{value:"release: v1.0.0 (",paraId:4,tocIndex:6},{value:"34ae942",paraId:4,tocIndex:6},{value:")",paraId:4,tocIndex:6},{value:"chore: stop tracking dumi tmp & dist (",paraId:5,tocIndex:7},{value:"116cdcc",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat:\u5B8C\u5584\u6587\u6863 (",paraId:5,tocIndex:7},{value:"ff0d979",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"fix\uFF1AFlowView \u7EC4\u4EF6\u7C7B\u578B\u5B9A\u4E49\u4FEE\u6539 (",paraId:5,tocIndex:7},{value:"20c2fd1",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"init (",paraId:5,tocIndex:7},{value:"484fcb7",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u62C6\u5305 (",paraId:5,tocIndex:7},{value:"2108510",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u62C6\u5305\u540E\u91CD\u6784 (",paraId:5,tocIndex:7},{value:"6707ed6",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u914D\u7F6E\u6587\u4EF6\u4FEE\u6539 (",paraId:5,tocIndex:7},{value:"16e4277",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u6570\u636E\u7ED3\u6784\u7C7B\u578B\u8C03\u6574 (",paraId:5,tocIndex:7},{value:"992485d",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u4FEE\u6539\u914D\u7F6E\u6587\u4EF6 (",paraId:5,tocIndex:7},{value:"c7e3661",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u4FEE\u6539\u6570\u636E\u7ED3\u6784 (",paraId:5,tocIndex:7},{value:"1e2375b",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u4FEE\u6539\u6570\u636E\u7ED3\u6784 (",paraId:5,tocIndex:7},{value:"bc6b15d",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u4FEE\u6539FlowView\u7EC4\u4EF6 (",paraId:5,tocIndex:7},{value:"0195435",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u589E\u5F3A\u89C4\u5219\u8BC4\u4F30\u5F15\u64CE (",paraId:5,tocIndex:7},{value:"ebb9581",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u91CD\u6784type \u5305\u6A21\u5757\u3001\u4FEE\u6539core/ui\u5305\u7684\u4F7F\u7528\u65B9\u5F0F (",paraId:5,tocIndex:7},{value:"56c9ca2",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"feat: \u7EC4\u4EF6\u4FEE\u6539 (",paraId:5,tocIndex:7},{value:"370317b",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7},{value:"release: 0.0.1 (",paraId:5,tocIndex:7},{value:"11c4222",paraId:5,tocIndex:7},{value:")",paraId:5,tocIndex:7}]},30981:function(t,a,e){e.r(a),e.d(a,{texts:function(){return n}});const n=[{value:"\u4FEE\u8BA2\u7248\u672C\u53F7\uFF1A\u6BCF\u5468\u4F1A\u8FDB\u884C\u65E5\u5E38 bugfix \u66F4\u65B0\uFF08\u5982\u679C\u6709\u7D27\u6025\u7684 bugfix\uFF0C\u5219\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u53D1\u5E03\uFF09",paraId:0,tocIndex:1},{value:"\u6B21\u7248\u672C\u53F7\uFF1A\u5E26\u6709\u65B0\u7279\u6027\u7684\u5411\u4E0B\u517C\u5BB9\u7684\u7248\u672C\uFF0C\u4E0D\u5728\u53D1\u5E03\u5468\u671F\u5185",paraId:0,tocIndex:1},{value:"\u4E3B\u7248\u672C\u53F7\uFF1A\u542B\u6709\u7834\u574F\u6027\u66F4\u65B0\u548C\u65B0\u7279\u6027\uFF0C\u4E0D\u5728\u53D1\u5E03\u5468\u671F\u5185",paraId:0,tocIndex:1}]}}]);
