/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSIONS_OUTPUT = path.join(__dirname, '..', 'src', 'settings', 'versions.json');

const REPO = 'vmware-clarity/ng-clarity';

function getMajorVersion(tag) {
  const match = tag.replace(/^v/, '').match(/^(\d+)\./);
  return match ? parseInt(match[1], 10) : null;
}

function generateVersions() {
  let releases = [];
  try {
    const output = execSync(`gh api repos/${REPO}/releases --paginate --jq '.[].tag_name'`, {
      encoding: 'utf8',
      timeout: 30000,
    });
    releases = output.trim().split('\n').filter(Boolean);
  } catch {
    console.warn('Could not fetch releases from GitHub. Using fallback version list.');
    const envVersion = getVersionFromEnv();
    const versions = [
      { label: 'next', url: 'https://next.clarity.design' },
      { label: `v${envVersion} (latest)`, url: 'https://clarity.design', latest: true },
    ];
    fs.writeFileSync(VERSIONS_OUTPUT, JSON.stringify(versions, null, 2) + '\n');
    console.log(`Generated ${VERSIONS_OUTPUT} with fallback versions.`);
    return;
  }

  const majorVersions = new Set();
  for (const tag of releases) {
    const major = getMajorVersion(tag);
    if (major !== null) {
      majorVersions.add(major);
    }
  }

  const sorted = [...majorVersions].sort((a, b) => b - a);
  const latestMajor = sorted[0];

  const versions = [{ label: 'next', url: 'https://next.clarity.design' }];

  for (const major of sorted) {
    if (major === latestMajor) {
      versions.push({ label: `v${major} (latest)`, url: 'https://clarity.design', latest: true });
    } else {
      versions.push({ label: `v${major}`, url: `https://v${major}.clarity.design` });
    }
  }

  fs.mkdirSync(path.dirname(VERSIONS_OUTPUT), { recursive: true });
  fs.writeFileSync(VERSIONS_OUTPUT, JSON.stringify(versions, null, 2) + '\n');
  console.log(`Generated ${VERSIONS_OUTPUT} with ${versions.length} versions.`);
}

function getVersionFromEnv() {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts'), 'utf8');
    const match = envFile.match(/version:\s*'(\d+)'/);
    return match ? match[1] : '21';
  } catch {
    return '21';
  }
}

generateVersions();
