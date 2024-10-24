module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/prop-types": 0,
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "no-unused-vars": [
              1,
              {
                "argsIgnorePattern": "res|next|^err"
              }
        ],
        "max-len": 0,
        "no-console": 0,
        "import/prefer-default-export": 0,
        "import": 0,
        "func-names": 0,
        "space-before-function-paren": 0,
        "comma-dangle": 0
    },
    "parser": "babel-eslint",
    "settings": {
      "react": {
        "createClass": "createReactClass", // Regex for Component Factory to use,
                                           // default to "createReactClass"
        "pragma": "React",  // Pragma to use, default to "React"
        "version": "15.0", // React version, default to the latest React stable release
        "flowVersion": "0.53" // Flow version
      },
      "propWrapperFunctions": [ "forbidExtraProps" ] // The names of any functions used to wrap the
                                                     // propTypes object, e.g. `forbidExtraProps`.
                                                     // If this isn't set, any propTypes wrapped in
                                                     // a function will be skipped.
    }
};
