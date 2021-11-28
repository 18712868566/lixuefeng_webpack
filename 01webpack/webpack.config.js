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

// 用于删除/清理构建文件夹的 webpack 插件。
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// node 模块 用来拼接绝对路径的方法
const { resolve } = require('path');
const path = require('path');

module.exports = {
    // webpack配置
    // 入口文件
    // 加入到入口文件 才能热更新 否则devServer hot 不剩效'./src/index.html' 
    entry: ['./src/js/index.js', './src/index.html'],
    // 输出
    output: {
        // 输出的文件名
        filename: 'js/build.js',
        // 输出路径
        // __dirname nodejs 变量 ， 代表当前文件的目录的绝对路径
        path: resolve(__dirname, 'build'),
        // webpack5 自定义 type= asset/resource 资源输入时自定义文件名
        // 方式一 ： 重命名输入资源
        //assetModuleFilename: '[name]_[hash:6][ext][query]'
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
                    filename: 'images/[name]_[hash:5][ext][query]'
                },
                // Rule.parser.dataUrlCondition.maxSize 选项来修改此条件：修改 判断要进行压缩的条件
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024 // 8kb
                    }
                }
            },
            // 处理字体资源
            {
                test: /\.(ttf|eot|woft)$/i,
                type: 'asset',
                generator: {
                    filename: 'font/[name]_[hash:5][ext][query]'
                },
            },
            // 处理音频文件
            {
                test: /\.(mp3|wav)$/i,
                type: 'asset',
                generator: {
                    filename: 'audio/[name]_[hash:5][ext][query]'
                },
            },
            // 处理视频文件
            {
                test: /\.(mp4)$/i,
                type: 'asset',
                generator: {
                    filename: 'video/[name]_[hash:5][ext][query]'
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
    // plugins 插件配置
    plugins: [
        // 每次打包时，清理构建目录 build
        // 安装 cnpm i clean-webpack-plugin -D
        new CleanWebpackPlugin(),
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
    // 编译后错误处理 - 查看错误来源 - 适用于开发环境， 生产环境深入了解后使用
    devtool: 'inline-source-map',
    // 模式
    mode: 'development', // 开发模式
    // mode:'production',   //生产模式

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