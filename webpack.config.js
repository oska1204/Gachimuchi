const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

const files = getFiles('src');

const jsFiles = files.filter(e => e.match(/\/index\.js$/));
const htmlFiles = files.filter(e => e.match(/\/index\.html$/));

const getTemplate = path => `./${path}`;
const getFilename = path => path.replace(/^src/, '.');
const getProp = path => path.replace(/^src\/|\.(js|html)$/g, '');

const entries = {};
jsFiles.map(path => {
    const template = getTemplate(path);
    const prop = getProp(path);

    entries[prop] = template;
});

const htmlSites = htmlFiles.map(path => {
    const template = getTemplate(path);
    const filename = getFilename(path);
    const prop = getProp(path);

    const config = {
        template,
        filename,
        chunks: [],
    };

    const item = entries[prop];
    if (item) {
        config.chunks.push(prop);
    }

    return new HtmlWebpackPlugin(config);
});

let mode = 'development';
let target = 'web';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
    // Temporary workaround for 'browserslist' bug that is being patched in the near future
    target = 'browserslist';
}

module.exports = {
    mode,

    entry: {
        ...entries,
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: e => `images${e.module.rawRequest.substr(1)}`,
    },

    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             cacheDirectory: true,
            //         },
            //     },
            // },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        ...htmlSites,
    ],

    target,

    devtool: 'source-map',

    resolve: {
        extensions: ['.js'],
    },

    devServer: {
        contentBase: './dist',
        hot: true,
        open: {
            app: ['chrome', '--incognito', '--other-flag'],
        },
    },
};
