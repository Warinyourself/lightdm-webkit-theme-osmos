module.exports = {
  publicPath: '',
  runtimeCompiler: true,
  transpileDependencies: ['vuex-module-decorators'],

  devServer: {
    disableHostCheck: true
  },

  chainWebpack: config => {
    const glslRule = config.module.rule('glsl').test(/\.glsl$/)

    glslRule
      .use('raw')
      .loader('webpack-glsl-loader')
      .end()
  }
}
