module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended"
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "globals": {
    "defineProps": "readonly",
    "defineEmits": "readonly",
    "defineExpose": "readonly",
    "withDefaults": "readonly"
  },
  "rules": {
    "no-unused-vars": ["warn", {
      "varsIgnorePattern": "Ig$",
      "argsIgnorePattern": "^_"
    }],
    'vue/script-setup-uses-vars': 'error',
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "linebreak-style": ["off", "windows"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "object-shorthand": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "array-callback-return": "error",
    "arrow-spacing": "error",
    "block-scoped-var": "error",
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "camelcase": "warn",
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "consistent-this": ["error", "that"],
    "constructor-super": "error",
    "curly": "error",
    "default-case": "error",
    "dot-location": ["error", "property"],
    "dot-notation": "error",
    "eol-last": ["warn", "always"],
    "eqeqeq": ["error", "always"],
    "for-direction": "warn",
    "func-call-spacing": "off",
    "func-names": ["warn", "as-needed"],
    "function-paren-newline": ["warn", { "minItems": 4 }],
    "getter-return": ["error", { "allowImplicit": true }],
    "guard-for-in": "warn",
    "implicit-arrow-linebreak": ["warn", "beside"],
    "jsx-quotes": ["error", "prefer-single"],
    "keyword-spacing": ["error", {
      "before": true,
      "after": true
    }],
    "lines-around-comment": ["warn", { "beforeBlockComment": true }],
    "no-await-in-loop": "error",
    "no-buffer-constructor": "error",
    "no-cond-assign": "error",
    "no-empty": "warn",
    "no-constant-condition": "warn",
    "vue/no-multiple-template-root": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "vue/html-self-closing": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/no-v-for-template-key": "off",
    "vue/no-v-model-argument": "off",
    "vue/require-default-prop": "off",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "no-fallthrough": "off",
    "no-debugger": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
};
