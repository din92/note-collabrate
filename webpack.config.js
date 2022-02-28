const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
    entry: {
      index:path.join(__dirname, "/src/js/index.js"),
      backend:path.join(__dirname, "/src/js/socketconnector.js"),
      "/documents/index":path.join(__dirname, "/src/js/index.js"),
      "/documents/backend":path.join(__dirname, "/src/js/socketconnector.js"),
    },
    output: {
     filename: "[name].js",
     path: path.join(__dirname, "/src/dist")
    },
    devServer: {
      historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader","css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};