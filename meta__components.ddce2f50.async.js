"use strict";(self.webpackChunk_plugin_flow_engine_doc=self.webpackChunk_plugin_flow_engine_doc||[]).push([[838],{5792:function(m,o,n){var t;n.r(o),n.d(o,{demos:function(){return e}});var u=n(90819),v=n.n(u),c=n(89933),y=n.n(c),d=n(44194),p=n(95257),x=n(307),R=n(70115),e={"components-flow-view-demo-basic":{component:d.memo(d.lazy(function(){return n.e(433).then(n.bind(n,35832))})),asset:{type:"BLOCK",id:"components-flow-view-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(82310).Z},"@plugin-flow-engine/ui":{type:"NPM",value:"1.0.0"},react:{type:"NPM",value:"18.3.1"},"./data.ts":{type:"FILE",value:n(31427).Z},"@plugin-flow-engine/type":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"./data.ts":x,"@plugin-flow-engine/ui":p,react:t||(t=n.t(d,2)),"/home/runner/work/plugin-flow-engine/plugin-flow-engine/packages/doc/components/FlowView/demo/data.ts":x,"@plugin-flow-engine/type":R},renderOpts:{compile:function(){var D=y()(v()().mark(function i(){var _,g=arguments;return v()().wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,n.e(101).then(n.bind(n,41101));case 2:return l.abrupt("return",(_=l.sent).default.apply(_,g));case 3:case"end":return l.stop()}},i)}));function P(){return D.apply(this,arguments)}return P}()}}}},76022:function(m,o,n){var t;n.r(o),n.d(o,{demos:function(){return _}});var u=n(90819),v=n.n(u),c=n(89933),y=n.n(c),d=n(44194),p=n(90758),x=n(29571),R=n(59820),e=n(54394),D=n(64051),P=n(25946),i=n(70115),_={"pluginview-demo-basic":{component:d.memo(d.lazy(function(){return n.e(915).then(n.bind(n,94423))})),asset:{type:"BLOCK",id:"pluginview-demo-basic",refAtomIds:["PluginView"],dependencies:{"index.tsx":{type:"FILE",value:n(36340).Z},react:{type:"NPM",value:"18.3.1"},"../index.tsx":{type:"FILE",value:n(26746).Z},antd:{type:"NPM",value:"5.27.6"},"@plugin-flow-engine/core":{type:"NPM",value:"1.0.0"},"./demo/data.ts":{type:"FILE",value:n(93483).Z},"./demo/Demo1.tsx":{type:"FILE",value:n(10481).Z},"./demo/Demo2.tsx":{type:"FILE",value:n(47920).Z},"@plugin-flow-engine/type":{type:"NPM",value:"1.0.0"}},entry:"index.tsx"},context:{"../index.tsx":p,"./demo/data.ts":e,"./demo/Demo1.tsx":D,"./demo/Demo2.tsx":P,react:t||(t=n.t(d,2)),"/home/runner/work/plugin-flow-engine/plugin-flow-engine/packages/doc/components/PluginView/index.tsx":p,antd:x,"@plugin-flow-engine/core":R,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/packages/doc/components/PluginView/demo/data.ts":e,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/packages/doc/components/PluginView/demo/Demo1.tsx":D,"/home/runner/work/plugin-flow-engine/plugin-flow-engine/packages/doc/components/PluginView/demo/Demo2.tsx":P,"@plugin-flow-engine/type":i},renderOpts:{compile:function(){var g=y()(v()().mark(function l(){var s,h=arguments;return v()().wrap(function(I){for(;;)switch(I.prev=I.next){case 0:return I.next=2,n.e(101).then(n.bind(n,41101));case 2:return I.abrupt("return",(s=I.sent).default.apply(s,h));case 3:case"end":return I.stop()}},l)}));function T(){return g.apply(this,arguments)}return T}()}}}},307:function(m,o,n){n.r(o),n.d(o,{flowData:function(){return u}});var t=n(23536),u={flow:{id:"flow1",name:"\u6D41\u7A0B1",version:"1.0.0",description:"\u8FD9\u662F\u4E00\u4E2A\u7B80\u5355\u7684\u6D41\u7A0B",category:"\u793A\u4F8B",enable:!0,create_date:"2025-10-21",update_date:"2025-10-21"},context:{variables:{}},nodes:[{id:"trigger",type:"basic_node",position:{x:120,y:60},data:{name:"\u89E6\u53D1\u8282\u70B9",label:"\u89E6\u53D1\u8282\u70B9",pluginNodeType:t.FR.Trigger}},{id:"show_email_node",type:"basic_node",position:{x:480,y:60},data:{name:"\u663E\u793A\u90AE\u7BB1\u8282\u70B9",label:"\u663E\u793A\u90AE\u7BB1\u8282\u70B9",pluginNodeType:t.FR.Action}}],edges:[{id:"e1-2",source:"trigger",target:"show_email_node",type:"basic_edge"}],global_config:{}}},64051:function(m,o,n){n.r(o);var t=n(10154),u=n.n(t),v=n(45332),c=n.n(v),y=n(44194),d=n(92489),p=n(68493),x=n(22371),R=n(4068),e=n(97089),D=n(5303),P=n(24596),i=n(31549),_=(0,y.forwardRef)(function(g,T){var l=d.Z.useForm(),s=c()(l,1),h=s[0],E=(0,y.useState)(!1),I=c()(E,2),O=I[0],M=I[1],r=(0,y.useState)(!1),A=c()(r,2),B=A[0],C=A[1],b=function(a){console.log("\u663E\u793A\u90AE\u7BB1:",a),M(a.show)},F=function(a){console.log("\u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B:",a),C(a.required)},N=function(a){console.log("\u89E6\u53D1\u5668:",a.message),p.ZP.info("\u6EE1\u8DB3\u6761\u4EF6\u5F00\u59CB\u6267\u884C")},S=function(a){if(a&&typeof a.field=="string")return console.log("\u8BBE\u7F6E\u8868\u5355\u5B57\u6BB5:",a.field,"\u4E3A",a.value),h.setFieldValue(a.field,a.value),u()({},a.field,a.value)},j=function(){return h.getFieldsValue()},W=function(){h.validateFields().then(function(a){console.log("\u8868\u5355\u63D0\u4EA4:",a),g.updateVariables&&g.updateVariables(a)})},L=function(a,f){return!f||f.length<3?Promise.reject(new Error("\u7528\u6237\u540D\u81F3\u5C11\u9700\u89813\u4E2A\u5B57\u7B26")):Promise.resolve()},V=function(a,f){return!f||f.length<6?Promise.reject(new Error("\u5BC6\u7801\u81F3\u5C11\u9700\u89816\u4E2A\u5B57\u7B26")):Promise.resolve()},U=function(a,f){return B&&!f?Promise.reject(new Error("\u90AE\u7BB1\u4E3A\u5FC5\u586B\u9879")):f&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f)?Promise.reject(new Error("\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E")):Promise.resolve()};return(0,y.useImperativeHandle)(T,function(){return{showEmail:b,requireEmail:F,trigger:N,setFormValue:S,getData:j,showTip:function(a){return new Promise(function(f){setTimeout(function(){p.ZP.info((a==null?void 0:a.msg)||"Demo1\u5E76\u884C"),f((a==null?void 0:a.msg)||"Demo1\u5E76\u884C")},1e3)})}}}),(0,y.useEffect)(function(){g.initialValues&&h.setFieldsValue(g.initialValues)},[g.initialValues]),(0,i.jsx)(x.Z,{title:"\u7EC4\u4EF6Demo1",style:{maxWidth:"500px",marginBottom:12},extra:(0,i.jsxs)(R.Z,{color:"blue",children:["\u7EC4\u4EF6ID: ",_.displayName]}),children:(0,i.jsxs)(d.Z,{form:h,layout:"vertical",style:{marginBottom:12},onValuesChange:function(a,f){Object.keys(a).length>0&&(console.log("\u8868\u5355\u503C\u53D8\u5316:",a,"\u5168\u90E8\u503C:",f),g.updateVariables&&g.updateVariables(f))},children:[(0,i.jsx)(d.Z.Item,{name:"username",label:"\u7528\u6237\u540D",rules:[{required:!0,validator:L}],children:(0,i.jsx)(e.Z,{placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u540D",autoComplete:"off"})}),(0,i.jsx)(d.Z.Item,{name:"password",label:"\u5BC6\u7801",rules:[{required:!0,validator:V}],children:(0,i.jsx)(e.Z.Password,{placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801",autoComplete:"off"})}),O&&(0,i.jsx)(d.Z.Item,{name:"email",label:"\u90AE\u7BB1",rules:[{required:B,validator:U}],children:(0,i.jsx)(e.Z,{placeholder:"\u8BF7\u8F93\u5165\u90AE\u7BB1",autoComplete:"off"})}),(0,i.jsx)(d.Z.Item,{name:"agreeTerms",valuePropName:"checked",rules:[{required:!0,message:"\u8BF7\u540C\u610F\u670D\u52A1\u6761\u6B3E"}],children:(0,i.jsx)(D.Z,{children:"\u6211\u540C\u610F\u670D\u52A1\u6761\u6B3E"})}),(0,i.jsx)(d.Z.Item,{children:(0,i.jsx)(P.ZP,{type:"primary",onClick:W,children:"\u63D0\u4EA4"})})]})})});_.displayName="Demo1",o.default=_},25946:function(m,o,n){n.r(o);var t=n(45332),u=n.n(t),v=n(44194),c=n(68493),y=n(22371),d=n(4068),p=n(31549),x=(0,v.forwardRef)(function(R,e){var D=(0,v.useState)("pending"),P=u()(D,2),i=P[0],_=P[1],g=function(s){return console.log("Demo2: showOther\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u53C2\u6570:",s),new Promise(function(h){setTimeout(function(){_("active"),console.log('Demo2: \u72B6\u6001\u5DF2\u66F4\u65B0\u4E3A "active"'),h("showOther\u65B9\u6CD5\u88AB\u8C03\u7528")},1e3)})},T=function(s){console.log("Demo2: end\u65B9\u6CD5\u88AB\u8C03\u7528\uFF0C\u5F53\u524D\u72B6\u6001:",i,"\u53C2\u6570:",s),_("end"),console.log('Demo2: \u72B6\u6001\u5DF2\u66F4\u65B0\u4E3A "end"')};return(0,v.useImperativeHandle)(e,function(){return{showOther:g,end:T,showMsg:function(s){c.ZP.info((s==null?void 0:s.msg)||"\u9ED8\u8BA4\u63D0\u793A\u4FE1\u606F")},showTip:function(s){return new Promise(function(h){setTimeout(function(){c.ZP.info((s==null?void 0:s.msg)||"\u5E76\u884C"),h((s==null?void 0:s.msg)||"\u5E76\u884C")},2e3)})},merge:function(){c.ZP.info("\u6267\u884C\u4E86\u805A\u5408\u8282\u70B9\u4E86")}}}),(0,p.jsx)("div",{children:(0,p.jsxs)(y.Z,{title:"\u7EC4\u4EF6Demo2",style:{maxWidth:"500px",marginBottom:12},extra:(0,p.jsxs)(d.Z,{color:"blue",children:["\u7EC4\u4EF6ID: ",x.displayName]}),children:["\u6211\u662F\u53E6\u5916\u4E00\u4E2A Demo2 \u7EC4\u4EF6",(0,p.jsxs)("div",{children:[i,"\u72B6\u6001\uFF1A",(0,p.jsx)(d.Z,{color:i==="pending"?"orange":i==="active"?"green":i==="end"?"blue":"default",children:i})]})]})})});x.displayName="Demo2",o.default=x},54394:function(m,o,n){n.r(o),n.d(o,{data:function(){return u}});var t=n(23536),u={flow:{id:"demo_flow",name:"\u5B9E\u4F8B\u4E2D\u5FC3\u901A\u4FE1\u793A\u4F8B\u6D41\u7A0B",version:"1.0.0",description:"\u5C55\u793A\u5982\u4F55\u901A\u8FC7\u5B9E\u4F8B\u4E2D\u5FC3\u5728\u89C4\u5219\u5F15\u64CE\u548C\u7EC4\u4EF6\u4E4B\u95F4\u901A\u4FE1",category:"demo",enable:!0,create_date:new Date().toISOString(),update_date:new Date().toISOString(),auto:!1},context:{variables:{username:{type:"string",source:"Demo1Ref",description:"\u7528\u6237\u540D",default:"admin"},password:{type:"string",source:"Demo1Ref",description:"\u5BC6\u7801",default:"1234555"},agreeTerms:{type:"boolean",source:"Demo1Ref",description:"\u540C\u610F\u6761\u6B3E",default:!1}}},nodes:[{id:"trigger",type:"Trigger",position:{x:100,y:50},data:{pluginNodeType:t.FR.Trigger,name:"\u89E6\u53D1\u5668",config:{conditions:{all:[{fact:"username",operator:"notEqual",value:""}]},event:{type:"Demo1.trigger",params:{message:"\u6D41\u7A0B\u5DF2\u89E6\u53D1"}}}}},{id:"show_email_node",type:"Action",position:{x:300,y:50},data:{pluginNodeType:t.FR.Action,name:"\u663E\u793A\u90AE\u7BB1",config:{conditions:{all:[]},event:{type:"Demo1.showEmail",params:{show:!0}}}}},{id:"user_type_branch",type:"Branch",position:{x:500,y:50},data:{pluginNodeType:t.FR.Branch,name:"\u7528\u6237\u7C7B\u578B\u5206\u652F",config:{}}},{id:"require_email_node",type:"Action",position:{x:700,y:0},data:{pluginNodeType:t.FR.Action,name:"\u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B",config:{conditions:{all:[{fact:"agreeTerms",operator:"equal",value:!0}]},event:{type:"Demo1.requireEmail",params:{required:!0}}}}},{id:"update_email_node",type:"Action",position:{x:700,y:100},data:{pluginNodeType:t.FR.Action,name:"\u66F4\u65B0\u90AE\u7BB1",config:{conditions:{all:[{fact:"agreeTerms",operator:"equal",value:!0}]},event:{type:"Demo1.setFormValue",params:{field:"email",value:"updated@example.com"}}}}},{id:"update_email_success_node",type:"Parallel",position:{x:900,y:100},data:{pluginNodeType:t.FR.Parallel,name:"\u90AE\u7BB1\u66F4\u65B0\u6210\u529F",config:{parallel_strategy:t.Dj.ALL,conditions:{all:[{fact:"email",operator:"equal",value:"updated@example.com"}]},event:{type:"Demo2.showOther",params:{message:"\u90AE\u7BB1\u66F4\u65B0\u6210\u529F\uFF01"}}}}},{id:"A1",type:"Action",position:{x:1100,y:50},data:{pluginNodeType:t.FR.Action,name:"A1",config:{conditions:{all:[]},event:{type:"Demo1.showTip",params:{msg:"A1\u8282\u70B9\u5E76\u884C\u6267\u884C\u6210\u529F"}}}}},{id:"A2",type:"Action",position:{x:1100,y:150},data:{pluginNodeType:t.FR.Action,name:"A2",config:{conditions:{all:[]},event:{type:"Demo2.showTip",params:{msg:"A2\u8282\u70B9\u5E76\u884C\u6D88\u606F"}}}}},{id:"iteration_info",type:"Iteration",position:{x:900,y:0},data:{pluginNodeType:t.FR.Iteration,name:"\u8FED\u4EE3\u63D0\u9192",config:{iteration_count:2,iteration_mode:t.jc.ALL_SUCCESS,conditions:{all:[]},event:{type:"Demo2.showMsg",params:{msg:"\u63D0\u793A\u4FE1\u606F\u5C31\u662F\u6211111"}}}}},{id:"merge",type:"Merge",position:{x:1300,y:100},data:{pluginNodeType:t.FR.Merge,name:"\u805A\u5408\u8282\u70B9",config:{event:{type:"Demo2.merge"}}}},{id:"end_node",type:"End",position:{x:1500,y:100},data:{pluginNodeType:t.FR.End,name:"\u6D41\u7A0B\u7ED3\u675F",config:{event:{type:"Demo2.end",params:{msg:"\u6D41\u7A0B\u7ED3\u675F"}}}}}],edges:[{id:"1",source:"trigger",target:"show_email_node",label:"\u6210\u529F"},{id:"2",source:"show_email_node",target:"user_type_branch"},{id:"3",source:"user_type_branch",target:"require_email_node",data:{conditions:{all:[{fact:"username",operator:"equal",value:"user"}]}}},{id:"4",source:"user_type_branch",target:"update_email_node",data:{conditions:{all:[{fact:"username",operator:"equal",value:"admin"}]}}},{id:"5",source:"user_type_branch",target:"end_node",data:{isDefault:!0}},{id:"6",source:"update_email_node",target:"update_email_success_node",label:"\u66F4\u65B0\u6210\u529F"},{id:"7",source:"update_email_success_node",target:"A1",label:"A1"},{id:"8",source:"update_email_success_node",target:"A2",label:"A2"},{id:"9",source:"A2",target:"merge",label:"\u805A\u5408A2"},{id:"10",source:"A1",target:"merge",label:"\u805A\u5408A1"},{id:"11",source:"merge",target:"end_node",label:"\u7ED3\u675F"},{id:"12",source:"require_email_node",target:"iteration_info"},{id:"13",source:"iteration_info",target:"end_node"}],global_config:{timeout_config:{global_timeout:3e4,action_timeout:1e4},security_config:{},monitor_config:{metrics:[]}}}},90758:function(m,o,n){n.r(o);var t=n(44194),u=n(24596),v=n(53069),c=n(4161),y=n(22371),d=n(59820),p=n(64051),x=n(25946),R=n(54394),e=n(31549),D=function(){var i=(0,t.useRef)(null),_=(0,t.useRef)(null),g=(0,t.useRef)([{name:p.default.displayName,ref:i},{name:x.default.displayName,ref:_}]),T=(0,t.useMemo)(function(){return{username:"admin",password:"123456",agreeTerms:!0}},[]),l=(0,d.useFlowEngine)({flowData:R.data,initialVariables:T,components:g.current}),s=l.engine,h=l.executeFlow,E=l.executionResult,I=l.executionHistory,O=l.isExecuting,M=l.updateVariables;return(0,e.jsxs)("div",{style:{padding:"20px",maxWidth:"1200px",margin:"0 auto"},children:[(0,e.jsx)("div",{className:"mb-4",children:(0,e.jsx)(u.ZP,{onClick:h,type:"primary",size:"middle",disabled:!s||O,loading:O,style:{marginBottom:12},children:O?"\u6267\u884C\u4E2D...":"\u6267\u884C\u6D41\u7A0B"})}),E&&(0,e.jsxs)("div",{style:{marginBottom:"20px",padding:"15px",backgroundColor:E.status?"#e8f5e8":"#ffebee",borderLeft:"4px solid ".concat(E.status?"#4CAF50":"#f44336"),borderRadius:"4px"},children:[(0,e.jsx)("p",{children:E.message}),(0,e.jsxs)("div",{style:{marginTop:"10px"},children:[(0,e.jsx)("h4",{children:E.status?"\u4E0A\u4E0B\u6587\u53D8\u91CF:":" \u9519\u8BEF\u4FE1\u606F\uFF1A"}),(0,e.jsx)("pre",{style:{fontSize:"12px",backgroundColor:"#fff",padding:"10px",borderRadius:"4px",maxHeight:"300px",overflowY:"auto"},children:E.status?JSON.stringify(E.variables,null,2):JSON.stringify(E.errorInfo,null,2)})]})]}),(0,e.jsxs)(v.Z,{className:"mb-[30px]",gutter:16,children:[(0,e.jsxs)(c.Z,{span:12,children:[(0,e.jsx)(p.default,{ref:i,initialValues:T,updateVariables:M}),(0,e.jsx)(x.default,{ref:_})]}),(0,e.jsx)(c.Z,{span:12,children:(0,e.jsx)(y.Z,{title:"\u6267\u884C\u5386\u53F2\u8BB0\u5F55",children:(0,e.jsx)("div",{style:{maxHeight:"510px",overflowY:"auto"},children:I.length===0?(0,e.jsx)("p",{children:"\u6682\u65E0\u6267\u884C\u5386\u53F2"}):I.map(function(r,A){return(0,e.jsxs)("div",{style:{marginBottom:"15px",padding:"10px",backgroundColor:r.status==="success"?"#e8f5e8":"#ffebee",borderRadius:"4px"},children:[(0,e.jsx)("div",{style:{fontWeight:"bold"},children:"".concat(A+1,". \u8282\u70B9\u540D\uFF08id\uFF09: ").concat(r.nodeName," (").concat(r.nodeId,")")}),(0,e.jsxs)("div",{style:{color:r.status==="success"?"#52c41a":"#ff4d4f",fontSize:"12px",fontWeight:"bold"},children:["\u6267\u884C\u72B6\u6001: ",r.status]}),r.startTime&&(0,e.jsxs)("div",{style:{color:"#666",fontSize:"12px"},children:["\u5F00\u59CB\u65F6\u95F4: ",r.startTime.getTime()]}),r.endTime&&(0,e.jsxs)("div",{style:{color:"#666",fontSize:"12px"},children:["\u7ED3\u675F\u65F6\u95F4: ",r.endTime.getTime()]}),(0,e.jsxs)("div",{style:{color:"#666",fontSize:"12px"},children:["\u8017\u65F6: ",r.duration,"ms"]}),r.decision&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u5206\u652F\u51B3\u7B56\u4FE1\u606F:"}),(0,e.jsx)("pre",{style:{margin:0,fontSize:"11px"},children:JSON.stringify(r.decision,null,2)})]}),r.event&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u6267\u884C\u4E8B\u4EF6:"}),(0,e.jsxs)("pre",{style:{margin:0,fontSize:"11px"},children:["\u4E8B\u4EF6\u540D: ",r.event.type,(0,e.jsx)("br",{}),"\u53C2\u6570: ",JSON.stringify(r.event.params,null,2)]})]}),r.eventResult&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u4E8B\u4EF6\u6267\u884C\u7ED3\u679C:"}),(0,e.jsx)("pre",{style:{margin:0,fontSize:"11px"},children:JSON.stringify(r.eventResult,null,2)})]}),r.contextBefore&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u6267\u884C\u524D\u4E0A\u4E0B\u6587:"}),(0,e.jsx)("pre",{style:{margin:0,fontSize:"11px",maxHeight:"100px",overflow:"auto"},children:JSON.stringify(r.contextBefore,null,2)})]}),r.contextAfter&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u6267\u884C\u540E\u4E0A\u4E0B\u6587:"}),(0,e.jsx)("pre",{style:{margin:0,fontSize:"11px",maxHeight:"100px",overflow:"auto"},children:JSON.stringify(r.contextAfter,null,2)})]}),r.conditions&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u89C4\u5219:"}),(0,e.jsx)("pre",{style:{margin:0,fontSize:"11px"},children:JSON.stringify(r.conditions,null,2)})]}),r.engineResult&&(0,e.jsxs)("div",{style:{marginTop:"5px",fontSize:"12px"},children:[(0,e.jsx)("strong",{children:"\u8282\u70B9\u6267\u884C\u7ED3\u679C:"}),(0,e.jsx)("div",{style:{margin:0,fontSize:"11px"},children:JSON.stringify(r.engineResult,null,2)})]})]},A)})})})})]})]})};o.default=D},70115:function(m,o,n){n.r(o),n.d(o,{AntdWidgetKeys:function(){return t.P},BuiltInPluginNodeTypes:function(){return u.FR},EdgeType:function(){return u.Pb},IterationMode:function(){return u.jc},NodeStatus:function(){return u.e4},ParallelStrategy:function(){return u.Dj}});var t=n(14849),u=n(23536)},1535:function(m,o,n){n.r(o),n.d(o,{texts:function(){return t}});const t=[{value:"\u8BE5\u7EC4\u4EF6\u7531 ",paraId:0,tocIndex:0},{value:"@plugin-flow-engine/ui",paraId:0,tocIndex:0},{value:" \u5305\u63D0\u4F9B\u5E76\u968F\u5305\u53D1\u5E03\u3002",paraId:0,tocIndex:0},{value:"\u53C2\u6570\u540D",paraId:1,tocIndex:3},{value:"\u7C7B\u578B",paraId:1,tocIndex:3},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:3},{value:"\u8BF4\u660E",paraId:1,tocIndex:3},{value:"data",paraId:1,tocIndex:3},{value:"FlowData",paraId:1,tocIndex:3},{value:"-",paraId:1,tocIndex:3},{value:"\u5B8C\u6574\u6D41\u7A0B\u6570\u636E\u7ED3\u6784\u3002\u7C7B\u578B\u8BE6\u60C5\uFF1A",paraId:1,tocIndex:3},{value:"FlowData",paraId:2,tocIndex:3},{value:"\u3002",paraId:1,tocIndex:3},{value:"initialValue",paraId:1,tocIndex:3},{value:"Record<string, Record<string, any>>",paraId:1,tocIndex:3},{value:"undefined",paraId:1,tocIndex:3},{value:"\u6309\u8282\u70B9 ",paraId:1,tocIndex:3},{value:"id",paraId:1,tocIndex:3},{value:" \u63D0\u4F9B\u521D\u59CB\u914D\u7F6E\u3002\u521D\u59CB\u503C\u5408\u5E76\u987A\u5E8F\uFF1A",paraId:1,tocIndex:3},{value:"props.initialValue[nodeId]",paraId:1,tocIndex:3},{value:" > \u8868\u5355 ",paraId:1,tocIndex:3},{value:"schema.defaultValue",paraId:1,tocIndex:3},{value:" > ",paraId:1,tocIndex:3},{value:"{}",paraId:1,tocIndex:3},{value:"\u3002",paraId:1,tocIndex:3},{value:"onNodeConfigChange",paraId:1,tocIndex:3},{value:"(nodeId: string, config: Record<string, any>) => void",paraId:1,tocIndex:3},{value:"-",paraId:1,tocIndex:3},{value:"\u8282\u70B9\u914D\u7F6E\u4FDD\u5B58\u56DE\u8C03\uFF08\u5728\u201C\u4FDD\u5B58\u201D\u6216\u201C\u6821\u9A8C\u5E76\u4FDD\u5B58\u201D\u65F6\u89E6\u53D1\uFF1B\u5B9E\u65F6\u4FEE\u6539\u4E0D\u5916\u629B\uFF09\u3002",paraId:1,tocIndex:3},{value:"isValidate",paraId:1,tocIndex:3},{value:"boolean",paraId:1,tocIndex:3},{value:"true",paraId:1,tocIndex:3},{value:"\u62BD\u5C49\u5173\u95ED\u6216\u201C\u6821\u9A8C\u5E76\u4FDD\u5B58\u201D\u65F6\u662F\u5426\u6821\u9A8C\u8868\u5355\u3002",paraId:1,tocIndex:3},{value:"true",paraId:1,tocIndex:3},{value:" \u65F6\u4F7F\u7528 ",paraId:1,tocIndex:3},{value:"validateFields",paraId:1,tocIndex:3},{value:" \u6821\u9A8C\uFF1B",paraId:1,tocIndex:3},{value:"false",paraId:1,tocIndex:3},{value:" \u65F6\u76F4\u63A5\u4FDD\u5B58\u5F53\u524D\u503C\u3002",paraId:1,tocIndex:3},{value:"\u70B9\u51FB\u8282\u70B9\u6253\u5F00\u53F3\u4FA7\u914D\u7F6E\u62BD\u5C49\uFF0C\u8868\u5355 ",paraId:3,tocIndex:4},{value:"schema",paraId:3,tocIndex:4},{value:" \u6765\u81EA\u63D2\u4EF6\u7BA1\u7406\u5668\u7684 ",paraId:3,tocIndex:4},{value:"pluginNodeType",paraId:3,tocIndex:4},{value:"\u3002",paraId:3,tocIndex:4},{value:"\u4FEE\u6539\u8868\u5355\u4E0D\u4F1A\u7ACB\u5373\u4FDD\u5B58\uFF1B\u70B9\u51FB\u201C\u4FDD\u5B58\u201D\u4EC5\u4FDD\u5B58\u5F53\u524D\u8282\u70B9\u914D\u7F6E\u3002",paraId:3,tocIndex:4},{value:"\u5173\u95ED\u62BD\u5C49\u65F6\u5F39\u51FA\u786E\u8BA4\u6846\uFF1A\u6839\u636E ",paraId:3,tocIndex:4},{value:"isValidate",paraId:3,tocIndex:4},{value:" \u51B3\u5B9A\u662F\u5426\u6821\u9A8C\u540E\u4FDD\u5B58\uFF1B\u53D6\u6D88\u5219\u4E0D\u4FDD\u5B58\u76F4\u63A5\u5173\u95ED\u3002",paraId:3,tocIndex:4},{value:"\u9876\u90E8\u201C\u4FDD\u5B58\u6D41\u7A0B\u201D\u6309\u94AE\u4F1A\u5F39\u7A97\u9884\u89C8\u6240\u6709\u8282\u70B9\u914D\u7F6E\uFF08JSON\uFF09\u3002",paraId:3,tocIndex:4},{value:"\u62BD\u5C49\u6807\u9898\u663E\u793A ",paraId:3,tocIndex:4},{value:"data.label",paraId:3,tocIndex:4},{value:" \u4E0E ",paraId:3,tocIndex:4},{value:"data.pluginNodeType",paraId:3,tocIndex:4},{value:"\u3002",paraId:3,tocIndex:4},{value:"\u6700\u5C0F\u56FE\u7ED3\u6784\uFF1A",paraId:4,tocIndex:5},{value:"{ nodes: Node[]; edges: Edge[] }",paraId:4,tocIndex:5},{value:"\uFF08\u8BF7\u53C2\u89C1 ",paraId:4,tocIndex:5},{value:"Node",paraId:5,tocIndex:5},{value:"\u3001",paraId:4,tocIndex:5},{value:"Edge",paraId:6,tocIndex:5},{value:"\uFF09",paraId:4,tocIndex:5},{value:"\u63D2\u4EF6\u8282\u70B9\u7C7B\u578B\uFF1A",paraId:4,tocIndex:5},{value:"PluginNodeType",paraId:7,tocIndex:5},{value:"\u52A8\u6001\u8868\u5355 Schema\uFF1A",paraId:4,tocIndex:5},{value:"Schema",paraId:8,tocIndex:5},{value:"\u5B8C\u6574\u6D41\u7A0B\u6570\u636E\uFF1A",paraId:4,tocIndex:5},{value:"FlowData",paraId:9,tocIndex:5},{value:"\u7C7B\u578B\u5BFC\u5165\u793A\u4F8B\uFF1A",paraId:4,tocIndex:5},{value:"import type { Node, Edge, PluginNodeType } from '@plugin-flow-engine/type'",paraId:4,tocIndex:5},{value:`import { BaseNodePlugin } from "@plugin-flow-engine/core";
import { NodeConfig } from "@plugin-flow-engine/type";
import schema from "./schema";
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeTypeName = '\u6211\u7684\u64CD\u4F5C';
  pluginNodeType = 'MyAction';
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
}
export default MyActionPlugin;
`,paraId:10,tocIndex:7},{value:`
import { AntdWidgetKeys, NodeConfig } from "@plugin-flow-engine/type";
import customInputWidget from "./customInputWidget";

const schema: NodeConfig = {
 schema:{
    type:"MyAction",
    label:"\u6211\u7684\u64CD\u4F5C",
    config:[
      {
        type:AntdWidgetKeys.Input,
        label:"\u64CD\u4F5C\u540D\u79F0",
        field:"name",
        formItemProps:{
          required:true,
        }
      },
      {
          type: "custom-input",
          widget: 'custom-input',
          label: "\u64CD\u4F5C\u53C2\u6570",
          field: "params",
          formItemProps: {
              required: true,
          },
          widgetProps:{
            placeholder:"\u8BF7\u8F93\u5165\u64CD\u4F5C\u53C2\u6570",
          }
      },
    ]
 },
 widgets:{
    'custom-input': customInputWidget,
 }
 
};
export default schema;

`,paraId:11,tocIndex:8},{value:`import { WidgetProps } from "@plugin-flow-engine/type";
import { Input } from "antd";

const customInputWidget: React.FC<WidgetProps<any>> = ({value,onChange, ...reset}) => {
  return (
   <div>
     <label>\u6211\u662F\u81EA\u5B9A\u4E49\u7684\u63A7\u4EF6\u54E6</label>
     <Input
      {...reset}
      value={value}
      onChange={onChange}
    />
   </div>
  );
};

export default customInputWidget;
`,paraId:12,tocIndex:9},{value:"Action",paraId:13},{value:`import { BuiltInPluginNodeTypes } from '@plugin-flow-engine/type';
import { registerPluginUI } from '@plugin-flow-engine/ui';
import schema from './plugins/MyAction/schema';

registerPluginUI(BuiltInPluginNodeTypes.Action, schema);
`,paraId:14,tocIndex:10},{value:`// packages/doc/components/FlowView/demo/basic.tsx
import '../plugins';
`,paraId:15,tocIndex:11}]},11946:function(m,o,n){n.r(o),n.d(o,{texts:function(){return t}});const t=[]},82310:function(m,o){o.Z=`/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025\u5E7410\u670821\u65E5 11:42:11
 * @example: \u8C03\u7528\u793A\u4F8B
 */

import { flowData } from "./data";
import { FlowView } from '@plugin-flow-engine/ui';

import React from 'react'

const basic: React.FC = () => {
  return (
    <FlowView
      data={flowData}
      // \u6309\u8282\u70B9ID\u63D0\u4F9B\u521D\u59CB\u914D\u7F6E
      initialValue={{
        'trigger': { api_key: ["key1"] },
        'show_email_node': { api_key: ["key1", "key2"] },
      }}
      onNodeConfigChange={(nodeId, values) => {
        console.log('\u914D\u7F6E\u53D8\u5316', nodeId, values);
      }}
    />
  )
}


export default basic;`},31427:function(m,o){o.Z=`/*
 * @File:
 * @desc:
 * @author: heqinghua
 * @date: 2025\u5E7410\u670821\u65E5 11:36:56
 * @example: \u8C03\u7528\u793A\u4F8B
 */

import { BuiltInPluginNodeTypes, type FlowData } from '@plugin-flow-engine/type';
// import '../plugins'
const flowData: FlowData = {
  flow:{
    id: 'flow1',
    name: '\u6D41\u7A0B1',
    version: '1.0.0',
    description: '\u8FD9\u662F\u4E00\u4E2A\u7B80\u5355\u7684\u6D41\u7A0B',
    category: '\u793A\u4F8B',
    enable: true,
    create_date: '2025-10-21',
    update_date: '2025-10-21',
  },
  context:{
    variables: {
    },
  },
  nodes: [
    {
      id: 'trigger',
      type: 'basic_node',
       position: {
        x: 120,
        y: 60,
      },
      data: {  name:'\u89E6\u53D1\u8282\u70B9', label: '\u89E6\u53D1\u8282\u70B9',  pluginNodeType: BuiltInPluginNodeTypes.Trigger },
    },
    {
      id: 'show_email_node',
      type: 'basic_node',
        position: {
        x: 480,
        y: 60,
      },
      // \u5185\u5EFA\u63D2\u4EF6\u8282\u70B9
      data: { name: '\u663E\u793A\u90AE\u7BB1\u8282\u70B9', label: '\u663E\u793A\u90AE\u7BB1\u8282\u70B9', pluginNodeType: BuiltInPluginNodeTypes.Action },
      // \u81EA\u5B9A\u4E49\u63D2\u4EF6\u8282\u70B9
      // data: { name: '\u663E\u793A\u90AE\u7BB1\u8282\u70B9', label: '\u663E\u793A\u90AE\u7BB1\u8282\u70B9', pluginNodeType: "MyAction" },
    },
  ],
  edges: [
    { id: 'e1-2', source: 'trigger', target: 'show_email_node', type: 'basic_edge' }
  ],
  global_config:{

  }
};

export { flowData };
`},10481:function(m,o){o.Z=`/* eslint-disable @typescript-eslint/no-unused-expressions */
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
`},47920:function(m,o){o.Z=`/*
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
`},36340:function(m,o){o.Z=`/*
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
`},93483:function(m,o){o.Z=`import { BuiltInPluginNodeTypes, type FlowData, IterationMode, ParallelStrategy } from '@plugin-flow-engine/type';

export const data: FlowData = {
  flow: {
    id: "demo_flow",
    name: "\u5B9E\u4F8B\u4E2D\u5FC3\u901A\u4FE1\u793A\u4F8B\u6D41\u7A0B",
    version: "1.0.0",
    description: "\u5C55\u793A\u5982\u4F55\u901A\u8FC7\u5B9E\u4F8B\u4E2D\u5FC3\u5728\u89C4\u5219\u5F15\u64CE\u548C\u7EC4\u4EF6\u4E4B\u95F4\u901A\u4FE1",
    category: "demo",
    enable: true,
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
      position: { x: 100, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Trigger,
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
    },
    {
      id: "show_email_node",
      type: "Action",
      position: { x: 300, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        name: "\u663E\u793A\u90AE\u7BB1",
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
    },
    // \u5206\u652F\u8282\u70B9\uFF08type: "branch"\uFF09
    {
      id: "user_type_branch",
      type: "Branch",
      position: { x: 500, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Branch,
        name: "\u7528\u6237\u7C7B\u578B\u5206\u652F",
         config: {},
      },
    },
    {
      id: "require_email_node",
      type: "Action",
      position: { x: 700, y: 0 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        name: "\u8BBE\u7F6E\u90AE\u7BB1\u5FC5\u586B",
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
    },
    {
      id: "update_email_node",
      type: "Action",
      position: { x: 700, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        name: "\u66F4\u65B0\u90AE\u7BB1",
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
    },
    {
      id: "update_email_success_node",
      type: "Parallel",
      position: { x: 900, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Parallel,
        name: "\u90AE\u7BB1\u66F4\u65B0\u6210\u529F",
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
    },
    {
      id: "A1",
      type: "Action",
      position: { x: 1100, y: 50 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        name: "A1",
         config: {
          conditions: {
            all: [],
          },
          event: {
            type: "Demo1.showTip",
            params: {
              msg: "A1\u8282\u70B9\u5E76\u884C\u6267\u884C\u6210\u529F",
            },
          },
        },
      },
    },
    {
      id: "A2",
      type: "Action",
      position: { x: 1100, y: 150 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Action,
        name: "A2",
         config: {
          conditions: {
            all: [],
          },
          event: {
            type: "Demo2.showTip", // \u7EC4\u4EF6id.\u4E8B\u4EF6
            params: {
              msg: "A2\u8282\u70B9\u5E76\u884C\u6D88\u606F",
            },
          },
        },
      },
    },
    {
      id: "iteration_info",
      type: "Iteration",
      position: { x: 900, y: 0 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Iteration,
        name: "\u8FED\u4EE3\u63D0\u9192",
         config: {
          iteration_count: 2,
          iteration_mode: IterationMode.ALL_SUCCESS,
          conditions: {
            all: [],
          },
          event: {
            type: "Demo2.showMsg",
            params: {
              msg: "\u63D0\u793A\u4FE1\u606F\u5C31\u662F\u6211111",
            },
          },
        },
      },
    },
    {
      id: "merge",
      type: "Merge",
      position: { x: 1300, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.Merge,
        name: "\u805A\u5408\u8282\u70B9",
         config: {
          event: {
            type: "Demo2.merge",
          },
        },
      },
    },
    {
      id: "end_node",
      type: "End",
      position: { x: 1500, y: 100 },
      data: {
        pluginNodeType: BuiltInPluginNodeTypes.End,
        name: "\u6D41\u7A0B\u7ED3\u675F",
         config: {
          event: {
            type: "Demo2.end",
            params: {
              msg: "\u6D41\u7A0B\u7ED3\u675F",
            },
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
      data: {
        conditions: {
          all: [{ fact: "username", operator: "equal", value: "user" }],
        },
      },
    },
    {
      id: "4",
      source: "user_type_branch",
      target: "update_email_node",
      data: {
        conditions: {
          all: [{ fact: "username", operator: "equal", value: "admin" }],
        },
      },
    },
    {
      id: "5",
      source: "user_type_branch",
      target: "end_node",
      data: {
        isDefault: true,
      },
    },
    {
      id: "6",
      source: "update_email_node",
      target: "update_email_success_node",
      label: "\u66F4\u65B0\u6210\u529F",
    },
    {
      id: "7",
      source: "update_email_success_node",
      target: "A1",
      label: "A1",
    },
    {
      id: "8",
      source: "update_email_success_node",
      target: "A2",
      label: "A2",
    },
    {
      id: "9",
      source: "A2",
      target: "merge",
      label: "\u805A\u5408A2",
    },
    {
      id: "10",
      source: "A1",
      target: "merge",
      label: "\u805A\u5408A1",
    },
    {
      id: "11",
      source: "merge",
      target: "end_node",
      label: "\u7ED3\u675F",
    },
    {
      id: "12",
      source: "require_email_node",
      target: "iteration_info",
    },
    {
      id: "13",
      source: "iteration_info",
      target: "end_node",
    },
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
};`},26746:function(m,o){o.Z=`/*
 * @File: index.tsx
 * @desc: \u63D2\u4EF6\u5316\u67B6\u6784Demo\u4E3B\u5165\u53E3
 * @author: heqinghua
 * @date: 2025\u5E7409\u670818\u65E5
 */

import React, { useRef, useMemo } from 'react';
import { Card, Button, Col, Row } from 'antd';
import {
  useFlowEngine,
} from '@plugin-flow-engine/core';
import Demo1 from './demo/Demo1';
import Demo2 from './demo/Demo2';
import { Demo1Ref } from './demo/Demo1';
import { Demo2Ref } from './demo/Demo2';
import { data } from './demo/data';

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

export default PluginDemo;`}}]);
