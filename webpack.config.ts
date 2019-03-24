import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { spawn } from "child_process";
const SRC_DIR = path.resolve(__dirname, "src");
const OUTPUT_DIR = path.resolve(__dirname, "dist");

const defaultInclude = [SRC_DIR];

const config: webpack.Configuration = {
  mode: "development",
  entry: SRC_DIR + "/index.tsx",
  output: {
    path: OUTPUT_DIR,
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
        include: defaultInclude
      }
    ]
  },
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body"
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ],

  devtool: "cheap-source-map",
  devServer: {
    contentBase: OUTPUT_DIR,
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    before() {
      spawn("electron", ["./public/electron.js"], {
        shell: true,
        env: process.env,
        stdio: "inherit"
      })
        .on("close", code => process.exit(0))
        .on("error", spawnError => console.error(spawnError));
    }
  }
};

export default config;
