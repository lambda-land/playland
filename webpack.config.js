// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const exec = require('child_process').exec;

const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const elmDebug = false;

const stylesHandler = 'style-loader';

exec('yarn run elm-ts-interop-compile', (err, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
});


const config = {
    entry: './src/main.ts',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devtool: 'eval-source-map',
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

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.elm'],
    },
    module: {
        rules: [
            {
                test: /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],
                loader: 'elm-webpack-loader',
                options: {
                    optimize: true,
                    debug: elmDebug,
                    files: [
                        path.resolve(__dirname, "src/Main.elm"),
                        // path.resolve(__dirname, "Path/To/OtherModule.elm")
                    ]
                }
            },
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.tsx?$/,
                exclude: [/elm-stuff/, /node_modules/],
                use: {
                    loader: "ts-loader",
                    options: {}
                }
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};
module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};

