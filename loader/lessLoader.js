const less = require('less')

module.exports = function (source){
    // const callBack = this.async()
    let css = ''
    less.render(source, function (err, obj){
        // callBack(err, obj.css)
        css = obj.css
    })
    return css
}