/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const isWatch = require('yargs').strict(false).option('watch', { type: 'boolean', default: false }).argv.watch;
const cpusAvailable = require('os').cpus().length;
const executors = isWatch ? 1 : Math.min(cpusAvailable - 1, 8);
const browser = isWatch ? 'Chrome' : 'ChromeHeadless';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-parallel'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    parallelOptions: {
      executors,
      shardStrategy: 'round-robin',
    },
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ng-test'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [browser],
    singleRun: false,
    restartOnFileChange: true,
  });
};
