const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;


class Compiler {
    constructor(config) {
        //1.保存配置文件（webpack.config.js）
        this.config = config;
        //2.保存自调用函数的参数（保存入口模块 + 模块依赖）
        this.modules = {};
    }

    //1.开始编译
    run() {
        //首次传递进去的路径是主模块路径,然后依次找到主模块的所有依赖
        this.buildModule(this.config.entry);
        //webpack进行打包
        this.emitFile();
    }

    buildModule(modulePath) {
        //1.读取入口文件中的内容
        let code = this.getSource(modulePath);
        // console.log(code);
        /*
        2.修改当前模块的代码
        如果当前是多模块打包，主模块中的有些内容必须修改，才能作为模板
         */
        let {resultCode, dependencies} = this.parseModule(code);
        //3.把入口模块中的所有内容以及依赖保存到modules中去
        this.modules[modulePath] = resultCode;
        //4.遍历主模块依赖
        dependencies.forEach((depPath) => {
            this.buildModule(depPath);
        });
    }

    //如果是多模块打包，利用ast（抽象语法树）修改主模块中的内容
    parseModule(code) {
        //1.将代码转换为抽象语法树
        let ast = parser.parse(code);
        //定义变量保存主模块地址
        let rootPath = path.dirname(this.config.entry);  //  ./src
        //定义数组保存当前模块所有的依赖
        let dependencies = [];
        //2.修改抽象语法树中的内容
        traverse(ast, {
            CallExpression(nodePath) {
                if (nodePath.node.callee.name === "require") {
                    //2.1 将require修改为__webpack_require__
                    nodePath.node.callee.name = "__webpack_require__";
                    //2.2 修改require导入的路径
                    let modulePath = nodePath.node.arguments[0].value;
                    modulePath = ".\\" + path.join(rootPath, modulePath);  //不需要绝对路径,这里是相对路径
                    modulePath = modulePath.replace(/\\/g, "/"); //  如果不替换,第二个斜杠会把后面路径src的s字母给转义了
                    // console.log(modulePath); //  .\src\a.js
                    dependencies.push(modulePath);
                    //替换修改依赖模块路径
                    nodePath.node.arguments = [t.stringLiteral(modulePath)];
                }
            },
        });
        //3.将抽象语法树转换为代码
        let resultCode = generate(ast).code;
        // console.log(resultCode);
        //4.返回处理之后的结果
        return {resultCode, dependencies};
    }

    //获取模块内容
    getSource(modulePath) {
        /*
         eg:  ./index.less
         读取的如果是js代码，直接返回内容
         */
        let content = fs.readFileSync(modulePath, "utf8");
        //如果读取的有除过js代码之外的代码，需要使用对应的loader进行处理之后返回
        //1.获取配置文件中的所有规则
        if (!this.config.module) {
            //没有module文件时直接返回内容
            return content
        }
        const extName = path.extname(modulePath)
        // 2.有module的情况遍历所有的rules看是否有匹配的配置
        this.config.module.rules.forEach((rule)=>{
            const {test, use} = rule
            if (test.test(modulePath)) {
                //2.1匹配到了，找到loader文件去执行代码,记载loader需要从后往前取
                for(let i = use.length - 1; i >= 0; i--) {
                    const codePath = use[i].loader
                    const loaderCode = require(codePath)
                    content = loaderCode(content)
                }
                
            }
        })
        return content
    }

    //webpack进行打包
    emitFile() {
        //1.读取ejs模板
        let templatePath = path.resolve(__dirname, "main.ejs");
        let template = fs.readFileSync(templatePath, "utf8");
        // console.log(template);
        //2.利用变量替换模板中的内容
        let resultCode = ejs.render(template, {entryId: this.config.entry, modules: this.modules});
        // console.log(resultCode); //把改造后的代码写入到打包后的文件中去
        //3.将最终的代码写入到打包后的文件中
        //3.1获取输出的目录
        let outputDir = this.config.output.path;
        // console.log(outputDir);
        // console.log(fs.existsSync(outputDir));
        //3.2判断目录是否存在
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        //3.3获取指定文件或者文件路径
        let outputPath = path.resolve(outputDir, this.config.output.filename);
        fs.writeFileSync(outputPath, resultCode);
    }
}

module.exports = Compiler;









