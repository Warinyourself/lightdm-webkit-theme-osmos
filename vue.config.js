const isGithubView = process.env.VUE_APP_VIEW === 'github'
module.exports = {
  publicPath: isGithubView ? '/lightdm-webkit-theme-osmos/' : '',
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
