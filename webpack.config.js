const HtmlWebpackPlugin = require("html-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const fs = require("fs");
const webpack = require("webpack");
const path = require("path");
const directoryPath = path.resolve("public");

const handleDir = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject("Unable to scan directory: " + err);
            }
            resolve(files);
        });
    });
};

module.exports = async (env, args) => {
    const isDev = args.mode === "development";
    const dirs = await handleDir();
    const copyPluginPatterns = dirs
        .filter((dir) => dir !== "index.html")
        .map((dir) => {
            return {
                from: dir,
                to: "",
                context: path.resolve("public"),
            };
        });
    const basePlugins = [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: "index.html",
            favicon: "public/quochuy.ico",
            minify: {
                removeAttributeQuotes: true, //Remove double quotes from html
                collapseWhitespace: true, //Fold into a line
            },
            hash: true,
        }),
        new CopyPlugin({
            patterns: copyPluginPatterns,
        }),
        new MiniCssExtractPlugin({
            filename: isDev ? "[name].css" : "static/css/[name].[contenthash:6].css",
        }),
    ];

    const devPlugins = [
        ...basePlugins,
        new ErrorOverlayPlugin(),
        new ProgressBarPlugin({ width: "50" }),
        new FaviconsWebpackPlugin("./public/quochuy.ico"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ];
    const prodPlugins = [...basePlugins, new ProgressBarPlugin({ width: "50" }), new CleanWebpackPlugin()];

    return {
        mode: isDev ? "development" : "production",
        entry: "./src/index.tsx",
        target: isDev ? "web" : "browserslist",
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                compilerOptions: {
                                    noEmit: false,
                                },
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(s[ac]ss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: { sourceMap: isDev ? true : false },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDev ? "[path][name].[ext]" : "static/fonts/[name].[ext]",
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|svg|jpg|gif|ico)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: isDev ? "[path][name].[ext]" : "assets/images/[name].[contenthash:6].[ext]",
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")],
            alias: {
                react: "preact/compat",
                "react-dom": "preact/compat",
                // Must be below test-utils
            },
        },
        plugins: isDev ? devPlugins : prodPlugins,
        cache: true,
        devtool: isDev ? "cheap-module-source-map" : false,
        devServer: {
            contentBase: "public",
            port: 3000,
            hot: true,
            historyApiFallback: true,
        },
        output: {
            path: path.resolve("build"),
            publicPath: "/",
            filename: "static/js/main.[contenthash:6].js",
            environment: {
                arrowFunction: false,
                bigIntLiteral: false,
                const: false,
                destructuring: false,
                dynamicImport: false,
                forOf: false,
                module: false,
            },
        },
        performance: {
            maxEntrypointSize: 800000, //  Khi có 1 file build vượt quá giới hạn này (tính bằng byte) thì sẽ bị warning trên terminal.
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
            ],
        },
    };
};
