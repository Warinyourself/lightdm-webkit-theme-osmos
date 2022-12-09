module.exports = {
  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    camelcase: 'off',
    indent: 'off',
    'multiline-ternary': 'off',
    'space-before-function-paren': [2, 'never'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'error',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-useless-constructor': 'error'
  },

  parserOptions: {
    ecmaVersion: 2020
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/typescript',
    'plugin:vue/essential',
    '@vue/typescript/recommended'
  ]
}
