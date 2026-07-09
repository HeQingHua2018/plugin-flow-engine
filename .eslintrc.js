module.exports = { 
     // 配置项目运行的环境，启用对应环境下的全局变量 
     "env": { 
       "browser": true,    // 启用浏览器环境（如window、document等全局变量） 
       "es2021": true,     // 启用ES2021语法特性 
       "node": true,       // 启用Node.js环境（如require、module等全局变量） 
     }, 
     // 继承已有的规则集，扩展当前配置 
     "extends": [ 
       "eslint:recommended",                  // 启用ESLint核心推荐规则 
       "plugin:@typescript-eslint/recommended", // 启用@typescript-eslint插件的推荐规则 
       "plugin:react/recommended",            // 启用react插件的推荐规则 
       "plugin:react/jsx-runtime",            // 适配React 17+的JSX运行时，无需显式引入React 
       "prettier",                            // 整合Prettier，关闭与Prettier冲突的ESLint规则 
     ], 
     // 指定解析器，用于解析TypeScript代码 
     "parser": "@typescript-eslint/parser", 
     // 解析器选项配置 
     "parserOptions": { 
       "ecmaFeatures": { 
         "jsx": true,      // 允许解析JSX语法 
       }, 
       "ecmaVersion": "latest", // 支持最新的ECMAScript版本 
       "sourceType": "module",  // 代码使用ES模块（import/export） 
     }, 
     // 配置需要使用的ESLint插件 
     "plugins": ["@typescript-eslint", "react"], 
     // 插件的额外配置 
     "settings": { 
       "react": { 
         "version": "detect", // 自动检测安装的React版本（无需手动指定） 
         // 可选配置：可手动指定版本如"16.0"，默认值为"latest"，未来将默认使用"detect" 
       }, 
     }, 
     // 自定义规则配置（0=关闭，1=警告，2=错误） 
     "rules": { 
       "@typescript-eslint/no-var-requires": 0, // 允许使用require()语法（默认禁止） 
       "@typescript-eslint/ban-ts-comment": 0,  // 允许使用@ts-ignore等TypeScript注释 
       // 允许使用非空断言操作符!（如obj!.prop） 
       "@typescript-eslint/no-non-null-asserted-optional-chain": 0, 
       // 允许在.d.ts文件中使用三斜线引用语法（/// <reference ... />） 
       "@typescript-eslint/triple-slash-reference": 0, 
       // 配置禁止使用的类型（基于默认规则集扩展） 
       "@typescript-eslint/ban-types": [ 
         2, // 违反规则时抛出错误 
         { 
           "types": { 
             "Function": false // 允许使用Function类型（默认禁止） 
           }, 
           "extendDefaults": true // 保留默认禁止的其他类型（如Object、String等） 
         } 
       ], 
       "react/prop-types": 0, // 关闭强制要求React组件声明prop-types的检查 
       "react/no-deprecated": 0, // 允许使用React的过时API（如componentWillMount等） 
       // 允许在字符串、模板字面量和正则中使用非必要的转义字符 
       "no-useless-escape": 0,
       "no-var": 0 // 关闭禁止使用var的规则，避免Babel生成的辅助函数报错
     }, 
   };
