// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    // "standard",
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'plugin:prettier/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    // allow async-await
    'generator-star-spacing': 'off',
    'no-console': 0,
    'no-alert': process.env.NODE_ENV === 'production' ? 2 : 0, //禁止使用alert confirm prompt
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // --------------------静态检测-----------------------------
    /**
     * 静态检测：
     * 以下基本位能够帮助发现代码错误的规则
     * */
    // 禁止与负零进行比较
    'no-compare-neg-zero': 2,
    // 禁止将常量作为 if 或三元表达式的测试条件，比如 if (true), let foo = 0 ? 'foo' : 'bar'
    'no-constant-condition': [
      2,
      {
        checkLoops: false
      }
    ],
    // 禁止在函数参数中出现重复名称的参数 【辅助检测】
    'no-dupe-args': 2,
    // 禁止在对象字面量中出现重复名称的键名 【辅助检测】
    'no-dupe-keys': 2,
    // 禁止出现空代码块  【可读性差】
    'no-empty': [
      2,
      {
        allowEmptyCatch: true
      }
    ],
    // 禁止将 catch 的第一个参数 error 重新赋值  【重新赋值，error将没有意义】
    'no-ex-assign': 2,
    // @fixable 禁止函数表达式中出现多余的括号，比如 let foo = (function () { return 1 })  【一般不会这么写，可读性差】
    'no-extra-parens': [2, 'functions'],
    // 禁止将一个函数申明重新赋值，如：
    // function foo() {}
    // foo = bar   [静态检测：无意义]
    'no-func-assign': 2,
    // 禁止在 if 内出现函数申明或使用 var 定义变量
    'no-inner-declarations': [2, 'both'],
    // 禁止使用特殊空白符（比如全角空格），除非是出现在字符串、正则表达式或模版字符串中
    'no-irregular-whitespace': [
      2,
      {
        skipStrings: true,
        skipComments: false,
        skipRegExps: true,
        skipTemplates: true
      }
    ],
    // typeof 表达式比较的对象必须是 'undefined', 'object', 'boolean', 'number', 'string', 'function' 或 'symbol'
    'valid-typeof': 2,
    // -----------------------------------最佳实践----------------------------------------------
    /**
     * 最佳实践
     * 这些规则通过一些最佳实践帮助你避免问题
     */
    // 禁止函数的循环复杂度超过 20，【https://en.wikipedia.org/wiki/Cyclomatic_complexity】
    // 这里async 会报错，直接忽略
    complexity: [
      0,
      {
        max: 20
      }
    ],
    // 不允许有空函数，除非是将一个空函数设置为某个项的默认值  【否则空函数并没有实际意义】
    'no-empty-function': [
      2,
      {
        allow: ['functions', 'arrowFunctions']
      }
    ],
    // 禁止修改原生对象   【例如 Array.protype.xxx=funcion(){}，很容易出问题，比如for in 循环数组 会出问题】
    'no-extend-native': 2,
    // @fixable 表示小数时，禁止省略 0，比如 .5  【可读性】
    'no-floating-decimal': 2,
    // 禁止直接 new 一个类而不赋值 【 那么除了占用内存还有什么意义呢？ @off vue语法糖大量存在此类语义 先手动关闭】
    'no-new': 0,
    // 禁止使用 new Function，比如 let x = new Function("a", "b", "return a + b"); 【可读性差】
    'no-new-func': 2,
    // 禁止将自己赋值给自己    [规则帮助检测]
    'no-self-assign': 2,
    // 禁止将自己与自己比较 [规则帮助检测]
    'no-self-compare': 2,
    // @fixable 立即执行的函数必须符合如下格式 (function () { alert('Hello') })() 【立即函数写法很多，这个是最易读最标准的】
    'wrap-iife': [
      2,
      'inside',
      {
        functionPrototypeMethods: true
      }
    ],
    // 禁止使用保留字作为变量名 [规则帮助检测保留字，通常ide难以发现，生产会出现问题]
    'no-shadow-restricted-names': 2,
    // 禁止使用未定义的变量
    'no-undef': [
      2,
      {
        typeof: false
      }
    ],
    // 定义过的变量必须使用   【正规应该是这样的，具体可以大家讨论】
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true
      }
    ],
    // 变量必须先定义后使用   【ps:涉及到es6存在不允许变量提升的问题，以免引起意想不到的错误，具体可以大家讨论】
    'no-use-before-define': [
      2,
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],
    // ----------------------------------------------------代码规范----------------------------------------------------------
    /**
     * 代码规范
     * 有关【空格】、【链式换行】、【缩进】、【=、{}、（）、首位空格】规范没有添加，怕大家一时间接受不了，目前所挑选的规则都是：保障我们的代码可读性、可维护性的
     * */
    // 变量名必须是 camelcase 驼峰风格的
    // @off 【涉及到 很多 api 或文件名可能都不是 camelcase 先关闭】
    camelcase: 0,
    // @fixable 禁止在行首写逗号
    'comma-style': [2, 'last'],
    // @fixable 一个缩进必须用两个空格替代
    // @off 【不限制大家，为了关闭eslint默认值，所以手动关闭，off不可去掉】 讨论
    indent: [2, 2, { SwitchCase: 1 }],
    //@off 手动关闭//前面需要回车的规则  注释
    'spaced-comment': 0,
    //@off 手动关闭: 禁用行尾空白
    'no-trailing-spaces': 2,
    //@off 手动关闭: 不允许多行回车
    'no-multiple-empty-lines': 1,
    //@off 手动关闭: 逗号前必须加空格
    'comma-spacing': 0,
    //@off 手动关闭: 冒号后必须加空格
    'key-spacing': 1,
    // @fixable 结尾禁止使用分号
    //@off [vue官方推荐无分号,不知道大家是否可以接受？先手动off掉] 讨论
    //    "semi": [2,"never"],
    semi: 0,
    // 代码块嵌套的深度禁止超过 5 层
    'max-depth': [1, 10],
    // 回调函数嵌套禁止超过 5 层，多了请用 async await 替代
    'max-nested-callbacks': [2, 5],
    // 函数的参数禁止超过 7 个
    'max-params': [2, 7],
    // new 后面的类名必须首字母大写  【面向对象编程原则】
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false,
        properties: true
      }
    ],
    // @fixable new 后面的类必须有小括号  【没有小括号、指针指过去没有意义】
    'new-parens': 2,
    // @fixable 禁止属性前有空格，比如 foo. bar() 【可读性太差，一般也没人这么写】
    'no-whitespace-before-property': 2,
    // @fixable 禁止 if 后面不加大括号而写两行代码   eg: if(a>b) a=0  b=0
    'nonblock-statement-body-position': [2, 'beside', { overrides: { while: 'below' } }],
    // 禁止变量申明时用逗号一次申明多个 eg: let a,b,c,d,e,f,g = []   【debug并不好审查、并且没办法单独写注释】
    'one-var': [2, 'never'],
    // @fixable 【变量申明必须每行一个，同上】
    'one-var-declaration-per-line': [2, 'always'],
    //是否使用全等
    eqeqeq: 0,
    //this别名
    'consistent-this': [2, 'that'],
    // -----------------------------ECMAScript 6-------------------------------------
    /**
     * ECMAScript 6
     * 这些规则与 ES6 有关 【请大家 尝试使用正确使用const和let代替var，以后大家熟悉之后可能会提升规则】
     * */
    // 禁止对定义过的 class 重新赋值
    'no-class-assign': 2,
    // @fixable 禁止出现难以理解的箭头函数，比如 let x = a => 1 ? 2 : 3
    'no-confusing-arrow': [2, { allowParens: true }],
    // 禁止对使用 const 定义的常量重新赋值
    'no-const-assign': 2,
    // 禁止重复定义类
    'no-dupe-class-members': 2,
    // 禁止重复 import 模块
    'no-duplicate-imports': 2,
    //@off 以后可能会开启 禁止 var
    'no-var': 0,
    //  ---------------------------------被关闭的规则-----------------------
    // parseInt必须指定第二个参数  parseInt("071",10);
    radix: 0,
    //强制使用一致的反勾号、双引号或单引号 (quotes) 关闭
    quotes: 0,
    //要求或禁止函数圆括号之前有一个空格
    'space-before-function-paren': [0, 'always'],
    //禁止或强制圆括号内的空格
    'space-in-parens': [0, 'never'],
    //关键字后面是否要空一格
    'space-after-keywords': [0, 'always'],
    // 要求或禁止在函数标识符和其调用之间有空格
    'func-call-spacing': [0, 'never']
  }
};
