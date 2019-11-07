const path = require("path");

const fs = require('fs')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  site: "site/templates/"
}

// инициализируем путь до pug  и страницы
const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {

  externals: {
    paths: PATHS
  },
  entry : {
    // раньше путь был ./src/index.js (специально поменяли) для входа
    app : PATHS.src
  },
  output : {
    // прописали путь для dist и добавили к концу hash
    filename: `${PATHS.site}js/[name].js`,

    // Также и dist, прописываем для выхода
    path: PATHS.dist,

    // или можно `/` сюда
    publicPath: "" 
  },
  // Оптимизация файлов js для входа и выхода здесь
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         name: "vendors",
  //         test: /node_modules/,
  //         chunks: "all",
  //         enforce: true
  //       }
  //     }
  //   }
  // },
  module: {
    rules: [{
      test: /\.pug$/,
      loader: 'pug-loader',
      query: { 
        pretty: true 
      } 
    },
    {
      // loader для скриптов
      test: /\.js$/,
      loader: "babel-loader",
      exclude: ["/node_modules/", PATHS.src + "/js/util.js"],
    },
    {
      test: /\.vue$/,
      loader: "vue-loader",
      options: {
        loader: {
          scss: "vue-style-loader!css-loader!postcss-loader!sass-loader"
        }
      }
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        },
        {
          loader: "postcss-loader",
          options: { 
            sourceMap: true,
            config: {
              path: `./postcss.config.js`
            }
          }
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true
          }
        }
      ]
    },
    {
      // обработка css через MiniCssExtractPlugin
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        },
        {
          loader: "postcss-loader",
          options: { 
            sourceMap: true,
            config: {
              path: `./postcss.config.js`
            }
          }
        },
      ]
    },
    {
      test: /\.(png|jpg|gif|svg|webp)$/,
      loader: "file-loader",
      options: {
        name: "[name].[ext]"
      },
      exclude: "/node_modules/"
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)/,
      loader: "file-loader",
      options: {
        name: "[name].[ext]"
      },
      exclude: "/node_modules/"
    }
    ]
  },
  // alias
  resolve: {
    alias: {
      // на папку src
      "~": "src",
      // На папку vue
      "vue$": "vue/dist/vue.js",
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.site}css/[name].css`,
    }),
    new CopyWebpackPlugin([
      // Копируем файлы и отправляем их в dist
      { from: `${PATHS.src}/${PATHS.site}img`, to: `${PATHS.site}img` },
      { from: `${PATHS.src}/${PATHS.site}fonts`, to: `${PATHS.site}fonts` },
      // берет с pm codyhouse файл utils.js и перенесит его, обязательно подключить к файлу
      { from: `node_modules/codyhouse-framework/main/assets/js/util.js`, to: `${PATHS.site}js` },
      { from: `${PATHS.src}/static`, to: "" },
    ]),
    // pug файлы все проверяет
    ...PAGES.map(page => new HtmlWebpackPlugin({
      filename: `./${page.replace(/\.pug/,'.html')}`, //html
      template: `${PAGES_DIR}/${page}`, //pug
      inject: true,
      minify: false
    }))
    // new HtmlWebpackPlugin({
    //   template: `${PAGES_DIR}/index.html`,
    //   filename: "./index.html",
    //   inject: true
    // }),
  ]
}