/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * The single place a Storybook title may be declared by hand.
 *
 * `ng-clarity-eslint-rules/storybook-title` derives every title from the story file's path, so a
 * contributor never types a title: `npx eslint --fix` writes it. This map is the one escape hatch,
 * for the rare label that Title-Casing a kebab-case path segment genuinely cannot produce — for
 * example a directory named `checkbox-toggle` whose sidebar label needs to read
 * `Checkbox or Toggle`, or an acronym that must stay upper-case.
 *
 * Keys are paths relative to `.storybook/stories/`, with `/` separators, in one of two forms:
 *
 *   `<directory>`              replaces the directory part of the title for every story file in it,
 *                              e.g. 'components/forms/checkbox-toggle': 'Components/Forms/Checkbox or Toggle'
 *   `<file>.stories.ts`        replaces the whole title of that one file,
 *                              e.g. 'components/data/datagrid/datagrid-row.stories.ts': 'Components/Data/Datagrid/Row'
 *
 * Add an entry ONLY when the derived title is genuinely wrong. Renaming the directory or the file is
 * almost always the better fix, because the path is what the sidebar, the docs URL and the reviewer
 * all read. An entry here makes the title and the path disagree forever.
 */
module.exports = {
  // "Checkbox or Toggle" is the label the sidebar has always used; a path segment cannot spell "or".
  'components/forms/checkbox-toggle': 'Components/Forms/Checkbox or Toggle',
};
