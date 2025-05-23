/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
  This script will execute a command and pass a filtered list of all new and modified files as the last argument to the command.
  There are easier ways to do this, such as using Unix "xargs", but we need to make sure this works on Windows too.
*/

const childProcess = require('child_process');
const minimatch = require('minimatch');
const yargs = require('yargs');

const filter = yargs.argv.filter;
const command = yargs.argv.command;
const files = getFilteredChanges(filter);

runCommandOnChangedFiles(command, files);

function runCommandOnChangedFiles(command, files) {
  if (files.length) {
    childProcess.spawn('npx', ['-q', ...command.split(' '), ...files], { stdio: 'inherit' });
  }
}

function getFilteredChanges(filter) {
  return getChanges()
    .filter(file => file.status !== 'D')
    .filter(file => !filter || minimatch(file.name, filter, { dot: true }))
    .map(file => file.name);
}

function getChanges() {
  return childProcess
    .execSync('git status --porcelain -u', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(f => f)
    .map(getFile);
}

function getFile(entry) {
  const data = entry.trim().split(/\s+/);
  const status = data[0];
  const name = ['R', 'RM'].includes(status) ? data[3] : data[1];
  return { status, name };
}
