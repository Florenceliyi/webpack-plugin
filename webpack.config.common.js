const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    /*
    entry: 指定需要打包的文件
    * */
    entry: './src/js/index.js',
    /*
    output: 指定打包之后的文件输出的路径和输出的文件名称
    * */
    output: {
        /*
            filename: 指定打包之后的JS文件的名称
            * */
        filename: 'js/bundle.js',
        /*
        path: 指定打包之后的文件存储到什么地方
        * */
        path: path.resolve(__dirname, 'bundle')
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    /*
    module: 告诉webpack如何处理webpack不能够识别的文件
    * */
    module: {
        rules: [
            // 检查编码规范的规则
            {
                // enforce: "pre"作用: 让当前的loader再其它loader之前执行
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                loader: 'eslint-loader',
                options: {
                    // eslint options (if necessary)
                    fix: true
                }
            },
            // 打包JS规则
            {
                test: /\.js$/,
                exclude: /node_modules/, // 告诉webpack不处理哪一个文件夹
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {
                        targets: {
                            // "chrome": "58",
                        }
                        // useBuiltIns: "usage"
                    }]],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                absoluteRuntime: false,
                                corejs: 2,
                                helpers: true,
                                regenerator: true,
                                useESModules: false
                            }
                        ]
                    ]
                }
            },
            // 打包字体图标规则
            {
                test: /\.(eot|json|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // 指定打包后文件名称
                            name: '[name].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'font/'
                        }
                    }
                ]
            },
            // 打包图片规则
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // 指定图片限制的大小
                            limit: 1024,
                            // 指定打包后文件名称
                            name: '[name].[ext]',
                            // 指定打包后文件存放目录
                            outputPath: 'images/',
                            publicPath: 'http://127.0.0.1:9090/images'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            // 打包CSS规则
            {
                test: /\.css$/,
                use: [
                    {
                        // loader: "style-loader"
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true // 开启CSS模块化
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            // 打包LESS规则
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }, {
                    loader: 'postcss-loader'
                }]
            },
            // 打包SCSS规则
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }, {
                    loader: 'postcss-loader'
                }]
            }
        ]
    },
    /*
    plugins: 告诉webpack需要新增一些什么样的功能
    * */
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: './doc',
            to: 'doc'
        }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
};
