const { CheckerPlugin } = require('awesome-typescript-loader');
const path = require('path');


module.exports =  {
    devtool: 'source-map',


    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        sourceMapFilename: '[file].map'
    },
    entry: {
        app: './source/app/index.ts'
    },

    resolve: {
        extensions: ['.ts' ],
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ]
};