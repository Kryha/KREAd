/* eslint-disable */
const { addBabelPlugins, override } = require("customize-cra");
const webpack = require('webpack'); 

module.exports = override(
  ...addBabelPlugins(
    "@emotion/babel-plugin",
    /* Add plug-in names here (separate each value by a comma) */
  )
);
