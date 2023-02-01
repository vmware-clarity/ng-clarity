/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['./**/*.stories.{ts,mdx}'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: '@storybook/angular',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.plugins = config.resolve.plugins || [];
    config.resolve.plugins.push(new TsconfigPathsPlugin({ configFile: './.storybook/tsconfig.json' }));

    return config;
  },
};
