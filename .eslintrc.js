module.exports = {
  "extends": ["standard", "plugin:security/recommended", "airbnb-base", "sonar"],
  "plugins": ["jest", "security"],
  "env": {
    "jest": true,
    "es6": true,
    "node": true
  },
  "parser": "babel-eslint",
  "rules": {
    "semi": "off",
    "quotes": ["off", "single"],
    "eol-last": 0,
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "comma-dangle": ["error", "never"],
    "radix": ["off"],
    "class-methods-use-this": "off",
    "prefer-template": "off",
    "sonarjs/prefer-immediate-return": "off",
    "sonarjs/no-duplicate-string": "off",
    "new-cap": "off"
  },
};
