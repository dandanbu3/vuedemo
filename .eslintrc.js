// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'space-before-function-paren': 0,
    'semi': [2, 'always'],
    'indent': [0, 4, {'SwitchCase': 1}],
    'linebreak-style': [2, 'unix'],
    'quotes': [2, 'single'],
    'no-console': 0,
    'no-trailing-spaces': 0,
    'object-property-newline': 0,
    'comma-dangle': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
