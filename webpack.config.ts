import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { spawn } from "child_process";
const SRC_DIR = path.resolve(__dirname, "src");
const OUTPUT_DIR = path.resolve(__dirname, "dist");
const defaultInclude = [SRC_DIR];

const baseConfig: webpack.Configuration = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [{ loader: "ts-loader" }],
        include: defaultInclude
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  devtool: "cheap-source-map",
  devServer: {
    contentBase: OUTPUT_DIR,
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    inline: true,
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    before() {
      spawn("electron", ["./dist/bandle.main.js"], {
        shell: true,
        env: process.env,
        stdio: "inherit"
      })
        .on("close", () => process.exit(0))
        .on("error", spawnError => console.error(spawnError));
    }
  }
};

const mainConfig: webpack.Configuration = Object.assign({}, baseConfig, {
  name: "main",
  target: "electron-main",
  entry: SRC_DIR + "/main.ts",
  output: {
    path: OUTPUT_DIR,
    filename: "bandle.main.js"
  }
});
const rendererConfig: webpack.Configuration = Object.assign({}, baseConfig, {
  name: "renderer",
  target: "electron-renderer",
  entry: SRC_DIR + "/index.tsx",
  output: {
    path: OUTPUT_DIR,
    filename: "bandle.renderer.js"
  }
});

module.exports = [mainConfig, rendererConfig];
