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

// 生成html文件并插入打包后的js资源
// 插件
const htmlWebpackPlugin = require('html-webpack-plugin');

// node 模块 用来拼接绝对路径的方法
const { resolve } = require('path');

module.exports = {
    // webpack配置
    // 入口文件
    entry: './src/index.js',
    // 输出
    output: {
        // 输出的文件名
        filename: 'build.js',
        // 输出路径
        // __dirname nodejs 变量 ， 代表当前文件的目录的绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader 配置
    module: {
        rules: [
            // 详细loader配置
            // 不同资源必须配置不同loader处理
            //处理css
            {
                //正则表达式 - 匹配那些文件
                test: /\.css$/i,
                // 使用那些loader 
                use: [
                    // use数组中的loader执行顺序: 中右到左 ,从下到上,依次执行
                    // 创建style标签,将js中的样式资源进行插入,添加到head中
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中,里面内容是样式字符串
                    'css-loader'
                ]
            },
            // 处理less
            {
                // 匹配less结尾的资源  
                test: /\.less$/i,
                use: [
                    // 创建style标签,将js中的样式资源进行插入,添加到head中
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中,里面内容是样式字符串
                    'css-loader',
                    // 将less文件编译成css文件
                    // npm i less less-loader 要安装less
                    'less-loader'
                ]
            },
            // 处理sass
            {
                // 匹配sass结尾的资源  
                test: /\.s[ac]ss$/i,
                use: [
                    // 将 JS 字符串生成为 style 节点
                    'style-loader',
                    // 将 CSS 转化成 CommonJS 模块
                    'css-loader',
                    // 将 Sass 编译成 CSS
                    // npm install sass-loader sass webpack --save-dev
                    // 注意小坑 引入的sass文件的后缀名要为.scss  不能是 .sass 不然会报错
                    'sass-loader',
                ]
            },
            // 处理样式中的 图片资源  webpack5 可以不配置loader
            // 如果需要控制 css中引入图片资源的输入 转base64可开启 img loader配置
            {
                test: /\.(jpeg|jpg|png|gif)$/i,
                // use 中单独配置loader 的使用
                // url-loader 允许你有条件地将文件转换为内联的 base-64 URL (当文件小于给定的阈值)，这会减少小文件的 HTTP 请求数。
                // file-loader 

                // asset loader 中排除来自新 URL 处理的 asset -- webpack 5
                // dependency: { not: ['url'] },
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 设定指定大小的图片 进行base64处理
                            // 优点： 减少请求数量，-减轻服务器压力
                            // 缺点： 图片体积会更大， - 文件请求速度更慢
                            limit: 8192
                        }
                    }
                ],
                type: 'javascript/auto'
            }
        ]
    },
    // plugins 插件配置
    plugins: [
        // 详细的插件配置
        // html-webpack-plugin
        // 功能：默认会创建一个空的html，自动引入打包输出的所有资源（JS/CSS） --默认没有结构
        // 如果要设置结构要配置插件 ， 以对象的形式配置
        // https://github.com/jantimon/html-webpack-plugin#options 配置文档
        new htmlWebpackPlugin({
            // 复制目标路径下的html文件， 自动引入打包输出的所有资源（JS/CSS）
            template: './src/index.html'
        }),
    ],
    // 模式
    mode: 'development',  // 开发模式
    // mode:'production',   //生产模式
}


