module.exports = {
  publicPath: "./",
  outputDir: "dist",
  // 去除.map文件
  productionSourceMap: false,
  configureWebpack: () => ({
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest"
          },
        }
      }
    }
  }),
  // resolve: {
  //   //别名，在引用文件时 使用别名代理真实目录 后面再在目录时以别名代替
  //   alias: {
  //     'vendor': path.resolve(__dirname, '/src/vendor')
  //   }
  // },
}