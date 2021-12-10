{
    "name": "01webpack",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
        "build": "webpack --config webpack.config.production.js",
        "server": "webpack serve",
        "dev": "webpack --config webpack.config.development.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "@babel/core": "^7.16.0",
        "@babel/plugin-transform-runtime": "^7.16.4",
        "@babel/polyfill": "^7.12.1",
        "@babel/preset-env": "^7.16.4",
        "autoprefixer": "^10.4.0",
        "babel-loader": "^8.2.3",
        "babel-plugin-transform-runtime": "^6.23.0",
        "clean-webpack-plugin": "^4.0.0",
        "core-js": "^3.19.1",
        "css-loader": "^6.5.1",
        "css-minimizer-webpack-plugin": "^3.1.4",
        "eslint": "^8.3.0",
        "eslint-config-airbnb-base": "^15.0.0",
        "eslint-plugin-import": "^2.25.3",
        "eslint-webpack-plugin": "^3.1.1",
        "html-loader": "^3.0.1",
        "html-webpack-plugin": "^5.5.0",
        "less": "^4.1.2",
        "less-loader": "^10.2.0",
        "mini-css-extract-plugin": "^2.4.5",
        "postcss": "^8.3.11",
        "postcss-loader": "^6.2.0",
        "postcss-preset-env": "^7.0.1",
        "sass": "^1.43.4",
        "sass-loader": "^12.3.0",
        "style-loader": "^3.3.1",
        "terser-webpack-plugin": "^5.2.5",
        "webpack": "^5.64.1",
        "webpack-cli": "^4.9.1",
        "webpack-dev-server": "^4.5.0"
    },
    "browserslist": {       // css兼容处理 borwserslist 指定规则
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version",
            "last 1 ie version"
        ]
    },
    "eslintConfig": {
        "extends": "airbnb-base"  // 处理js兼容性处理 -- Airbnb规则
    },
    "dependencies": {
        "babel-runtime": "^6.26.0"  // 处理js兼容性处理 -- 避免重复引入
    }
}


继续 处理css 提取和js 编译

https://github.com/webpack-contrib/mini-css-extract-plugin

mini-css-extract-plugin

这个插件将 CSS 提取到单独的文件中。它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。它支持按需加载 CSS 和 SourceMap。
它建立在新的 webpack v5 功能之上，并且需要 webpack 5 才能工作。


兼容处理：
有一些css3的属性，需要加上浏览器前缀才能兼容不同的浏览器。可以配置自动添加浏览器相关的前缀

cnpm install postcss postcss-loader postcss-preset-env -D

"browserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}

<!-- 自动处理前缀 - postcss-loader  样式资源集中处理-->
test: /\.(css|less|s[ac]ss)$/i,
更改css-loader 默认配置
{ loader: 'css-loader', options: { importLoaders: 1 } },

<!-- 压缩css -->
css-minimizer-webpack-plugin

就像 optimize-css-assets-webpack-plugin 一样，但在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行。

npm install css-minimizer-webpack-plugin --save-dev


3. @babel/polyfill   已废弃

4. babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。 默认情况下会被添加到每一个需要它的文件中

你可以引入 babel runtime 作为一个独立模块，来避免重复引入。
你必须执行 `npm install babel-plugin-transform-runtime --save-dev` 来把它包含到你的项目中，
也要使用 `npm install babel-runtime --save` 把 babel-runtime 安装为一个依赖。

5. 压缩js 代码

    首先，你需要安装

    cnpm install terser-webpack-plugin --save-dev
    const TerserPlugin = require("terser-webpack-plugin");
    minimizer: [new TerserPlugin()],

6. 压缩 HTML 代码
    // 移除多余空格
    collapseWhitespace: true,
    // 移除注释
    removeComments: true,


# 03webpack 性能优化

* 开发环境性能优化
* 生产环境优化


```
    HMR: 模块热替换
    作用,一个模块发生变化,只会重新打包这一个模块,(而不是打包所有模块)

    DevServer 配置 开启 hot:true

    css: 开发环境配置 css 部分处理,使用 style-loader 因为style-loader 内部实现了HMR功能
    js: 默认没有HMR 功能
        方法:需要修改js 代码 , 添加支持HMR功能的代码

        注意: HMR功能对js的处理, 只能处理非入口js文件的其他文件
    html: 默认没有HMR 功能 -html不能热更新(不需要做HMR) -- HTML文件变化时必须的
        方法-配置入口文件 指定 模板路径 *entry: ['./src/js/index.js', './src/index.html'],*

```

*  source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

webpack 仓库中包含一个 显示所有 devtool 变体效果的示例。这些例子或许会有助于你理解这些差异之处。
地址: https://github.com/webpack/webpack/tree/main/examples/source-map

```

    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    source-map：外部
      错误代码准确信息 和 源代码的错误位置
    inline-source-map：内联
      只生成一个内联source-map
      错误代码准确信息 和 源代码的错误位置
    hidden-source-map：外部
      错误代码错误原因，但是没有错误位置
      不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map：内联
      每一个文件都生成对应的source-map，都在eval
      错误代码准确信息 和 源代码的错误位置
    nosources-source-map：外部
      错误代码准确信息, 但是没有任何源代码信息
    cheap-source-map：外部
      错误代码准确信息 和 源代码的错误位置
      只能精确的行
    cheap-module-source-map：外部
      错误代码准确信息 和 源代码的错误位置
      module会将loader的source map加入

    内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

    开发环境：速度快，调试更友好
      速度快(eval>inline>cheap>...)
        eval-cheap-souce-map
        eval-source-map
      调试更友好
        souce-map
        cheap-module-souce-map
        cheap-souce-map

      --> eval-source-map  / eval-cheap-module-souce-map

    生产环境：源代码要不要隐藏? 调试要不要更友好
      内联会让代码体积变大，所以在生产环境不用内联
      nosources-source-map 全部隐藏
      hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

      --> source-map / cheap-module-souce-map

      继续优化 oneOf 看 04webpack
```


## 开发环境性能优化
* 优化打包构建速度
* 优化代码调试

## 生产环境性能优化
* 优化打包构架速度
* 优化代码运行性能


