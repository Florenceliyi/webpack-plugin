const path =  require("path");

const res = path.resolve(__dirname)
console.log('res',res);

module.exports = {
    devtool: "eval",
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "bundle")
    },
    //
    resolveLoader:{
        //简化loader方式一
        modules: [ 'node_modules', './src/loader'],
        //简化loader方式二
        // alias: {
        //     handleLoader: path.resolve(__dirname, 'src/loader/handleLoader.js')
        // }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    // 有了resolveLoader的配置就不需要写配置的具体路径
                    loader: path.resolve(__dirname, 'src/loader/handleLoader.js'),
                    // loader: 'handleLoader',
                    options: {
                        name: 'Louis'
                    }
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: path.resolve(__dirname, 'src/loader/styleLoader.js')
                },{
                    loader: path.resolve(__dirname, 'src/loader/lessLoader.js')
                }]
            }
        ]
    }
};