const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './example/index.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './example/index.html' })
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                // asset file extensions
                test: /\.(png|jpg|ogg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\template.html$/i,
                use: 'raw-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
};