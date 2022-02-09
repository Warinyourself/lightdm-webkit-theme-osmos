module.exports = {
  presets: [
    '@babel/preset-env',
    '@vue/cli-plugin-babel/preset'
    // 'module:@babel/helper-module-imports'
    // [
    //   '@vue/app',
    //   {
    //     useBuiltIns: 'entry',
    //     jsx: {
    //       injectH: false
    //     }
    //   }
    // ]
  ],
  plugins: ['transform-vue-jsx', '@babel/plugin-proposal-optional-chaining']
}
