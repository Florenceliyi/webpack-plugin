/*
注意点:
1.webpack在使用loader的时候, 会将当前打包的内容传递给当前的loader
2.webpack在使用loader的时候, 会修改loader中的this, 所以定义loader的函数只能是ES5的函数, 不能是ES6函数
* */
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils').validate;
module.exports = function loader(source) {
    // console.log('source',source);
    // console.log(this.getOptions);
    // const options = this.getOptions(this)
    // 1.获取webpack传递过来的参数
    let options = loaderUtils.getOptions(this);
    // 2.定制校验的规则
    let schema = {
        type: "object",
        // 可以在properties中告诉webpack, 当前loader可以传递哪些参数
        properties: {
            // 可以传递name参数
            name: {
                // name参数的数据类型必须是字符串类型
                type: "string"
            }
        },
        additionalProperties: false
    };
    // 3.利用校验方法校验传递过来的参数是否符合指定的规则
    validateOptions(schema, options, 'handleLoader')
    // const callBack = this.async()
    // setTimeout(()=>{
    //     source = source.replace(/Florence/g, options.name)
    //     callBack(null, source)
    // }, 2000)

    source = source.replace(/Florence/g, options.name)
    return source
};