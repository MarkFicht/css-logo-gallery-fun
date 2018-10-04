const path = require('path');
const Html = require("html-webpack-plugin");
const MiniCSS = require("mini-css-extract-plugin");
const Compression = require("compression-webpack-plugin");
const Clean = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = function(env) {

    const isDev = env.dev ? true : false;
    const isProd = env.prod ? true : false;

    const config = {};

    config.entry = "./app.js";
    config.output = {
        filename: isDev
            ? "[name].js"
            : "[name].[chunkhash].js",
        path: path.resolve(__dirname, "build")
    }

    config.mode = isProd
        ? "production"
        : "development" ;

    config.devtool = isProd
        ? false
        : "source-map" ;

    config.module = {};
    config.module.rules = [];

    const browsers = {
        dev: ['Chrome > 60'],
        prod: ['> 3%']
    }

    const js = {
        test: /\.js$/, exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    ['env', {
                        targets: {
                            browsers: isDev
                                ? browsers.dev
                                : browsers.prod
                        }
                    }]
                ],
                plugins: [
                    'syntax-dynamic-import'
                ]
            }
        }
    }
    config.module.rules.push(js);

    const scss = {
        test: /\.scss$/,
        use: [
            isProd
                ? MiniCSS.loader
                : 'style-loader',
            {
                loader: 'css-loader',
                options: {
                    sourceMap: isProd ? false : true,
                    minimize: isProd ? true : false
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [
                        new require('autoprefixer')({
                            browsers: isProd
                                ? browsers.prod : browsers.dev
                        })
                    ]
                }
            },
            'sass-loader'
        ]
    }
    config.module.rules.push(scss);

    const images = {
        test: /\.(jpg|jpeg|gif|png|csv)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: isProd
                    ? '[name].[hash].[ext]'
                    : '[name].[ext]',
                publicPath: 'images',
                outputPath: 'images'
            }
        }
    }
    config.module.rules.push(images);

    const fonts = {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: isProd
                    ? '[name].[hash].[ext]'
                    : '[name].[ext]',
                publicPath: 'fonts',
                outputPath: 'fonts'
            }
        }
    }
    config.module.rules.push(fonts);

    config.plugins = [];

    config.plugins.push(
        new Html({
            filename: 'index.html',
            template: './app.html',
            minify: false
        })
    );

    config.plugins.push(
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    );

    if(isProd) {
        config.plugins.push( new MiniCSS(
            { filename: 'app.[chunkhash].css' } )
        );

        config.plugins.push(
            new Compression({
                threshold: 0,
                minRatio: 0.8
            })
        );

        config.plugins.push(
            new Clean(['build'])
        );
    }

    if(isDev) {
        config.devServer = {
            port: 8080,
            progress: true,
            overlay: true,
        }
    }

    return config;

    // entry: [
    //     "./app.js",
    // ],
    // output: {
    //     filename: "out.js",
    //     path: path.resolve(__dirname, 'build')
    // },
    // mode: 'development',
    // devtool: "source-map",
    // watch: true,
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['es2015'],
    //                     plugins: ['syntax-dynamic-import']
    //                 }
    //             }
    //         },
    //         {
    //             test: /\.css$/,
    //             use: ['style-loader', 'css-loader']
    //         },
    //         {
    //             test: /\.scss$/,
    //             use: [
    //                 MiniCSS.loader, // 'style-loader',
    //                 {
    //                     loader: 'css-loader',
    //                     options: {
    //                         sourceMap: true
    //                     }
    //                 },
    //                 {
    //                     loader: 'postcss-loader',
    //                     options: {
    //                         plugins: () => [
    //                             new require('autoprefixer')()
    //                         ]
    //                     }
    //                 },
    //                 'sass-loader'
    //             ]
    //         },
    //         {
    //             test: /\.(jpg|jpeg|gif|png|csv)$/,
    //             use: {
    //                 loader: 'file-loader',
    //                 options: {
    //                     name: '[name].[ext]',
    //                     publicPath: 'img',
    //                     outputPath: 'images'
    //                 }
    //             }
    //         },
    //         {
    //             test: /\.(eot|ttf|woff|woff2)$/,
    //             use: {
    //                 loader: 'file-loader',
    //                 options: {
    //                     name: '[name].[ext]',
    //                     publicPath: 'fonts',
    //                     outputPath: 'fonts'
    //                 }
    //             }
    //         }
    //     ]
    // },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         $: 'jquery',
    //         jQuery: 'jquery'
    //     }),
    //     new Html({
    //         filename: 'index.html',
    //         template: './app.html'
    //     }),
    //     new MiniCSS({
    //         filename: 'app.css'
    //     }),
    //     new Compression({
    //         threshold: 0,
    //         minRatio: 0.8
    //     })
    // ]
}