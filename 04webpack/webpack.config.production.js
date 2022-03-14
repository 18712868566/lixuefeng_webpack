/**
 * webpack.config.js webpack配置文件
 *
 * 作用： 指示webpack干那些活
 *
 * 所有构建工具都是基于node.js 平台运行， 模块化默认采用commonjs规范
 *
 *
 * loader: 1.下载  2.使用（配置loader）
 *
 * plugins: 1.下载 2.引入  3.使用
 *
 */

// 设置全局 nodejs环境变量 - postcss-loader - browserslist 的编译方式 --处理css兼容  默认使用生产环境配置
// development - 开发
// production -生产
process.env.NODE_ENV === 'production';

// 生成html文件并插入打包后的js资源
// 插件
const htmlWebpackPlugin = require('html-webpack-plugin');

// 用于删除/清理构建文件夹的 webpack 插件。
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 这个插件将 CSS 提取到单独的文件中。它为每个包含 CSS 的 JS 文件创建一个 CSS 文件。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// js 语法检查
const ESLintPlugin = require('eslint-webpack-plugin');

// 压缩 js 代码
const TerserPlugin = require("terser-webpack-plugin");


// node 模块 用来拼接绝对路径的方法
// const { resolve } = require('path');
const path = require('path');

module.exports = {
    // webpack配置
    // 入口文件
    // 加入到入口文件 才能热更新 否则devServer hot 不剩效'./src/index.html'
    entry: ['./src/js/index.js', './src/index.html'],
    // 输出
    output: {
        publicPath: 'auto',
        // 输出的文件名
        filename: 'js/[name].[contenthash:5].js',
        // 输出路径
        // __dirname nodejs 变量 ， 代表当前文件的目录的绝对路径
        path: path.join(__dirname, 'build'),
        // webpack5 自定义 type= asset/resource 资源输入时自定义文件名
        // 方式一 ： 重命名输入资源
        //assetModuleFilename: '[name]_[contenthash:6][ext][query]'
    },
    // code split 代码拆分
    // 可以将 node_modules 中的库文件单独打包成一个chunk 最终输入
    // 自动分析多入口文件中有没有公共依赖, 如果有会打包成一个单独的 chunk , 避免重复引入,只会打包一次
    optimization: {
        splitChunks: {
            // include all types of chunks
            chunks: 'all',
        },
        mangleExports: true,
    },
    // loader 配置
    module: {
        rules: [
            // 详细loader配置
            // 不同资源必须配置不同loader处理
            //处理css
            {
                //正则表达式 - 匹配那些文件
                test: /\.(css|less|s[ac]ss)$/i,
                // 使用那些loader
                use: [
                    // use数组中的loader执行顺序: 中右到左 ,从下到上,依次执行
                    // 创建style标签,将js中的样式资源进行插入,添加到head中
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    // 将css文件变成commonjs模块加载js中,里面内容是样式字符串
                    // 'css-loader',  //直接使用 和 postcss-loader 冲突 需要更改配置
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    /**
                     * css 兼容性处理 ： postcss --> postcss-loader postcss-preset-env
                     *
                     * postcss-preset-env 插件 帮 postcss 找到 package.json 中 borwserslist里的配置 ，通过配置加载指定的css兼容性配置
                     *
                     *
                    "browserslist": {
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
                    }
                     */
                    // 使用loader的默认配置
                    // postcss-loader
                    //修改loader配置 - postcss.config.js 配置文件形式
                    'postcss-loader',
                    // 编译sass
                    'sass-loader',
                    // 编译less
                    'less-loader',
                ]
            },
            // 处理样式中的 图片资源  webpack5 可以不配置loader
            // 如果要使用 可以使用
            // asset module
            // asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
            // asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
            // asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
            // asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
            {
                test: /\.(jpeg|jpg|png|gif)$/i,
                //自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型。
                type: 'asset',
                generator: {
                    filename: 'images/[name]_[contenthash:5][ext][query]'
                },
                // Rule.parser.dataUrlCondition.maxSize 选项来修改此条件：修改 判断要进行压缩的条件
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                }
            },
            /**
             * 处理js  语法检查 eslint-loader eslint  -- webpack5 已废弃 使用 eslint-webpack-plugin 需要安装 eslint
             * 注意： 只检查自己的源代码， 第三方的库是不检查的
             * 用 exclude 排除
             *
             * {
             *   use:/\.js$/i,
             *   loader:'eslint-loader',
             *   options:{}
             * },
             *
             * -- webpack5 已废弃 使用 eslint-webpack-plugin 需要安装 eslint
             * 设置检查规则：
             *      package.json中 eslintConfig中设置~
             *      使用airbnd规范(库)--> npm 搜索  eslint-config-airbnb-base  -不包含React 包含React的使用 eslint-config-aribnb
             *      eslint-config-airbnb-base 使用 需要 --> eslint and eslint-plugin-import
             *      package.json中添加配置
             *      "eslintConfig":{
             *          "extends":"airbnb-base"
             *      }
             */
            {
                /**
                 * js兼容性处理， npm install -D babel-loader @babel/core @babel/preset-env
                 *      1. 基本的兼容性处理 --> @babel/preset-env
                 *      2. 全部兼容行处理  --> @babel/polyfill  cnpm i -D @babel/polyfill
                 *      使用 直接在js 中 import 引入即可
                 *      问题： 把所有的兼容性 代码全部引入  - 代码体积过大
                 *      已经废弃
                 *
                 *      3. 需要做兼容性处理的就做，按需加载  --> core-js
                 */
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env',
                                {
                                    // 指定兼容到浏览器版本
                                    targets: {
                                        edge: "17",
                                        firefox: "60",
                                        chrome: "67",
                                        safari: "11.1",
                                        ie: "9"
                                    },
                                    // 按需加载
                                    useBuiltIns: "usage",
                                    corejs: {
                                        version: 3
                                    },
                                }
                            ]
                        ],
                        // babel runtime 作为一个独立模块，来避免重复引入
                        plugins: ['@babel/transform-runtime']
                    }
                }
            },
            // 处理字体资源
            {
                test: /\.(ttf|eot|woft)$/i,
                type: 'asset',
                generator: {
                    filename: 'font/[name]_[contenthash:5][ext][query]'
                },
            },
            // 处理音频文件
            {
                test: /\.(mp3|wav)$/i,
                type: 'asset',
                generator: {
                    filename: 'audio/[name]_[contenthash:5][ext][query]'
                },
            },
            // 处理视频文件
            {
                test: /\.(mp4)$/i,
                type: 'asset',
                generator: {
                    filename: 'video/[name]_[contenthash:5][ext][query]'
                },
            },
            // 处理html文件中的img图片（负责引入img，从而能被url-loader进行处理）
            {
                test: /\.html$/i,
                use: [{
                    loader: "html-loader",
                }]
            }
        ]
    },
    // 模式
    // mode: 'development', // 开发模式
    mode: 'production', //生产模式
    // plugins 插件配置
    plugins: [
        // eslint js 语法检查 -- 标准话
        // 运行后：
        // 9:1  warning  Unexpected console statement  no-console
        // 第9行 第一个字符 一个警告 ， 意外的控制台语句  -- 规则去eslint 查看no-console 规则
        // new ESLintPlugin({
        //     // 启用 ESLint 自动修复特性。
        //     fix: true,
        // }),
        // 提取js中的css 为单独文件
        new MiniCssExtractPlugin({
            filename: 'css/build_[contenthash:5].css',
        }),
        // 详细的插件配置
        // html-webpack-plugin
        // 功能：默认会创建一个空的html，自动引入打包输出的所有资源（JS/CSS） --默认没有结构
        // 如果要设置结构要配置插件 ， 以对象的形式配置
        // https://github.com/jantimon/html-webpack-plugin#options 配置文档
        new htmlWebpackPlugin({
            // 复制目标路径下的html文件， 自动引入打包输出的所有资源（JS/CSS）
            template: './src/index.html',
            minify: {
                // 移除多余空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true,
            }
        }),
        // 每次打包时，清理构建目录 build
        // 安装 cnpm i clean-webpack-plugin -D
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
        }),
    ],
    // 压缩代码
    optimization: {
        minimize: true, // 生产环境压缩
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            // `...`,
            new CssMinimizerPlugin(), // 这将仅在生产环境开启 CSS 优化。
            new TerserPlugin(), //压缩js代码
        ],
    },
    // 编译后错误代码准确信息 和 源代码的错误位置
    devtool: 'source-map',
    // 开发服务器 devServer : 用来自动化，（自动编译，自动打开浏览器，自动刷新浏览器）模块热替换hot
    // cnpm i webpack-dev-server -D
    // 特点： 只会在内存中编译打包， 不会有任何输出
    // 启动devServer 指令， npx webpack serve
    devServer: {
        // 该配置项允许配置从目录提供静态文件的选项（默认是 'public' 文件夹）
        static: {
            // 告诉服务器从哪里提供内容。这里的目录只得时 编译后的文件目录
            directory: path.join(__dirname, 'build'),
        },
        client: {
            // logging: 'info',
            //在浏览器中以百分比显示编译进度
            // progress: true,
            // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
            overlay: true,
        },
        // 启用 gzip 压缩
        compress: true,
        // 在构建失败时不刷新页面作为回退 便于查看错误
        // 启用热模块替换功能，在构建失败时不刷新页面作为回退，使用 hot: 'only'：
        hot: true,
        // 指定要使用的 host。局域访问
        host: '192.168.1.3',
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
}