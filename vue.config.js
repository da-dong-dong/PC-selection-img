const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
// console.log(process.env.NODE_ENV, '66666666666666666', process.env.outputDir)
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // 选项

  // 基本路径
  publicPath: './',

  // 构建时的输出目录
  outputDir: process.env.outputDir,

  // 放置静态资源的目录
  assetsDir: 'static',

  // html 的输出路径
  indexPath: 'index.html',

  // 文件名哈希
  filenameHashing: true,

  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  lintOnSave: true,

  // 是否使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: false,

  // babel-loader 默认会跳过 node_modules 依赖。
  transpileDependencies: [],

  // 是否为生产环境构建生成 source map？
  productionSourceMap: true,

  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  crossorigin: '',

  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。
  integrity: false,

  // 调整内部的 webpack 配置
  configureWebpack: () => {}, // (Object | Function)

  chainWebpack: (config) => {
    const Timestamp = Date.now()
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    if (process.env.NODE_ENV !== 'development') {
      config.output.filename(`js/[name].js?v=${Timestamp}`).end()
      config.output.chunkFilename(`js/[name].js?v=${Timestamp}`).end()
      // 修改生产配置
      config.plugin('extract-css').tap(args => [{
        filename: `css/[name].css?v=${Timestamp}`,
        chunkFilename: `css/[name].css?v=${Timestamp}`
      }])
    }
  },

  // 配置 webpack-dev-server 行为。

  devServer: {
    open: true,

    host: '0.0.0.0',

    port: 8080,

    https: false,

    hotOnly: false,

    proxy: {

      '/api': {
        target: 'https://api.27yn.cn/api',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      }

    }, // string | Object

    before: app => {}

  },

  // CSS 相关选项

  css: {

    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)

    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给

    // Css-loader 时，使用 `{ Css: { ... } }`。
    loaderOptions: {
      // 给 scss-loader 传递选项
    //   scss: {
    //     prependData: `@import "./src/style/main.scss";`
    //   }
    },

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。

    // 这个选项不会影响 `*.vue` 文件。

    modules: false

  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`

  // 在多核机器下会默认开启。

  parallel: require('os').cpus().length > 1,

  // PWA 插件的选项。

  pwa: {},

  // 三方插件的选项

  pluginOptions: {

    // ...

  }

}
