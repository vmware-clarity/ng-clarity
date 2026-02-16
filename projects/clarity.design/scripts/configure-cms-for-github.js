/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const yaml = require('yaml');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const args = yargs(hideBin(process.argv))
  .option('repo', { type: 'string' })
  .option('branch', { type: 'string' })
  .parse();

const csmConfigFilePath = './dist/website/admin/config.yml';
const cmsConfig = yaml.parse(fs.readFileSync(csmConfigFilePath).toString());

configureBackend();
configureFolders();

fs.writeFileSync(csmConfigFilePath, yaml.stringify(cmsConfig));

function configureBackend() {
  delete cmsConfig.local_backend;

  cmsConfig.backend.repo = args.repo;
  cmsConfig.backend.branch = args.branch;
}

function configureFolders() {
  cmsConfig.media_folder = `clarity.design/${cmsConfig.media_folder}`;

  for (const collection of cmsConfig.collections) {
    collection.folder = `clarity.design/${collection.folder}`;
  }
}
