module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    'import/no-dynamic-require': 1,
    'arrow-parens': 0,
    'comma-dangle': 0,
    'implicit-arrow-linebreak': 1,
    'no-unused-vars': 1,
    'function-paren-newline': 0,
  },
};
