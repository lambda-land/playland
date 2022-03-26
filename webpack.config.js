// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const exec = require('child_process').exec;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const isProduction = process.env.NODE_ENV == 'production';

const elmDebug = false;

const stylesHandler = 'style-loader';

exec('yarn run elm-ts-interop-compile', (err, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
});

console.log('Mode', isProduction ? 'production' : 'development');


const config = {
    entry: './src/main.ts',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devtool: 'source-map',
    devServer: {
        open: true,
        host: 'localhost',
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 3000
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        // new MonacoWebpackPlugin({
        //     features: []
        // }),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.elm'],
    },
    module: {
        rules: [
            // {
            //     test: /\.elm$/,
            //     exclude: [/elm-stuff/, /node_modules/],
            //     loader: 'elm-webpack-loader',
            //     options: {
            //         optimize: isProduction,
            //         debug: elmDebug,
            //         // files: [
            //         //     path.resolve(__dirname, "src/Main.elm"),
            //         //     // path.resolve(__dirname, "Path/To/OtherModule.elm")
            //         // ]
            //     }
            // },
            // {
            //     test: /\.(js|jsx)$/i,
            //     exclude: [/elm-stuff/, /node_modules/],
            //     loader: 'babel-loader',
            // },
            // {
            //     test: /\.css$/i,
            //     use: [stylesHandler, 'css-loader'],
            // },
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: [stylesHandler, 'css-loader', 'sass-loader'],
            // },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            // {
            //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
            //     type: 'asset/resource',
            //   },
            //  {
            //    test: /\.(woff|woff2|eot|ttf|otf)$/i,
            //    type: 'asset/resource',
            //  },
            // {
            //     test: /\.(woff2?|eot|ttf|otf)$/,
            //     loader: 'file-loader',
            //     options: {
            //         limit: 10000,
            //         name: '[name].[hash:7].[ext]'
            //     }
            //  },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/i,
            //     type: 'asset/resource',
            //   },
            {
                test: /\.ttf$/,
                type: 'asset/resource',
                use: ['file-loader']
            },
          
              
            //  {
            //     test: /\.(woff|woff2|eot|ttf|otf)$/,
            //     use: ["file-loader",'url-loader']
            //  },
            // {
            //     test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            //     use: [{ loader: 'url-loader', options: { limit: 100000 } }]
            // },
            // {
            //     test: /\.ttf/,
            //     use: "file-loader",
            //   },
            // {
            //     test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            //     type: 'asset',
            // },
            {
                test: /\.tsx?$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: ['babel-loader', 'ts-loader'],
                // use: {
                //     loader: "ts-loader",
                //     options: {
                //         transpileOnly: true
                //     }
                // }
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({ parallel: true })
        ],
    }
};
module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};

