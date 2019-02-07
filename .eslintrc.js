module.exports = {
    "extends": "airbnb-base",
    "rules": {
      "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": ["flags"] }],
    },
};
