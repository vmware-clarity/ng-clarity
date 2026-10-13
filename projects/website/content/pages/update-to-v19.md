---
title: Update v18 to v19
addLevel3HeadingsToToc: true
---

# Update v18 to v19

Clarity v19 upgrades its build toolchain to Angular 22 and TypeScript 6.

## Node.js requirements

Before updating to Clarity v19, use Node.js 24.15.0 or later in the 24.x release line, or Node.js 26.0.0 or later.
These versions meet the [Angular 22 Node.js requirements](https://angular.dev/reference/versions).

For Clarity contributors, the repository also requires npm 11.0.0 or later. Its `.nvmrc` file pins Node.js 24.15.0
for local development and CI. Run `nvm install` and `nvm use` from the repository root to select that version.
