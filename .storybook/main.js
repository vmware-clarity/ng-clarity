/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['./**/*.mdx', './**/*.stories.ts'],

  addons: ['@storybook/addon-a11y', '@storybook/addon-docs/blocks', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/angular',
    options: {},
  },

  webpackFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin({ configFile: './.storybook/tsconfig.json' }));

    return config;
  },
};
