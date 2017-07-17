/**
 * Created by John Yan on 7/14/2017.
 */
var path = require('path');
module.exports = {
    entry: "./vue-admin/js/admin.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'es6'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}