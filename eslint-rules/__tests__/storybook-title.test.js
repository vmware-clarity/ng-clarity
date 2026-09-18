/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const rule = require('../storybook-title');
const { ruleTester } = require('./rule-tester');

// The rule derives a title from the file's path and reads the file's directory to decide whether the
// file is that directory's primary story file, so the fixtures have to exist on disk. They are built
// under a throwaway `.storybook/stories/` tree; the rule locates that marker inside the path, so the
// tree does not have to be the repository's own.
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'storybook-title-'));
const storiesRoot = path.join(root, '.storybook', 'stories');

function meta(title) {
  return [
    "import type { Meta } from '@storybook/angular';",
    '',
    'const meta: Meta<Args> = {',
    `  title: ${title === undefined ? undefined : `'${title}'`},`,
    '};',
    '',
    'export default meta;',
    '',
    'export const Default: Story = {};',
  ]
    .filter(line => !line.includes('undefined'))
    .join('\n');
}

function fixture(relativePath, code) {
  const absolute = path.join(storiesRoot, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, code);
  return { filename: absolute, code: code };
}

// A single-file directory: the file name contributes nothing.
const badge = fixture('components/badge/badge.stories.ts', meta('Components/Badge'));
// A single-file directory whose file name differs from the directory: still the primary file.
const spacing = fixture('foundations/spacing/gaps.stories.ts', meta('Foundations/Spacing'));
// A multi-file directory: `<dir>.stories.ts` is primary, the others append their own leaf.
const accordion = fixture('components/accordion/accordion.stories.ts', meta('Components/Accordion'));
const accordionPanel = fixture('components/accordion/accordion-panel.stories.ts', meta('Components/Accordion/Panel'));
const accordionNested = fixture(
  'components/accordion/nested-components.stories.ts',
  meta('Components/Accordion/Nested Components')
);
// Nested directories, and the lower-case word list in both the directory and the leaf.
const stackView = fixture('components/data/stack-view/stack-view.stories.ts', meta('Components/Data/Stack View'));
const datagridInModal = fixture(
  'patterns/datagrid-in-modal/nested-datagrid-detail.stories.ts',
  meta('Patterns/Datagrid in Modal/Nested Datagrid Detail')
);
const modalStackedOnDetail = fixture(
  'patterns/datagrid-in-modal/modal-stacked-on-detail.stories.ts',
  meta('Patterns/Datagrid in Modal/Modal Stacked on Detail')
);
// A wrong title, to be rewritten by the fix.
const wrongTitle = fixture('components/spinner/spinner.stories.ts', meta('Spinner/Spinner'));
// No title at all.
const noTitle = fixture(
  'components/tooltip/tooltip.stories.ts',
  ['const meta: Meta<Args> = {', '  component: ClrTooltip,', '};', '', 'export default meta;'].join('\n')
);
// Two files in one directory that derive the same title, and export the same story name.
const clashCode = [
  'const meta: Meta<Args> = {',
  "  title: 'Components/Widget/X',",
  '};',
  '',
  'export default meta;',
  '',
  'export const Default: Story = {};',
].join('\n');
fixture('components/widget/widget.stories.ts', meta('Components/Widget'));
fixture('components/widget/widget-x.stories.ts', clashCode);
const clash = fixture('components/widget/x.stories.ts', clashCode);

const FIX_MESSAGE =
  "Story title must be derived from the file path. Expected 'Components/Spinner', found 'Spinner/Spinner'. " +
  'Run `npx eslint --fix` — never type a title by hand.';
const MISSING_MESSAGE =
  "Story meta must declare a title. The title derived from this file's path is 'Components/Tooltip'.";
const DUPLICATE_TITLE_MESSAGE =
  "Story title 'Components/Widget/X' is also the derived title of components/widget/widget-x.stories.ts. " +
  'Files sharing a title share one story-id namespace. Rename one of the files so their derived titles differ.';
const DUPLICATE_EXPORT_MESSAGE =
  'Story export Default is declared in both this file and components/widget/widget-x.stories.ts, which share ' +
  "the derived title 'Components/Widget/X'. Duplicate export names under one title overwrite each other and " +
  'the story is lost.';

ruleTester.run('storybook-title', rule, {
  valid: [
    badge,
    spacing,
    accordion,
    accordionPanel,
    accordionNested,
    stackView,
    datagridInModal,
    modalStackedOnDetail,
    {
      // not a story file under `.storybook/stories/`: the rule has no path to derive from
      filename: path.join(root, 'some-helper.ts'),
      code: "const meta = { title: 'Anything At All' };",
    },
    {
      // `title` outside the meta object is none of this rule's business
      filename: badge.filename,
      code: [
        "const meta: Meta<Args> = { title: 'Components/Badge', args: { title: 'Hello' } };",
        'export default meta;',
      ].join('\n'),
    },
  ],
  invalid: [
    {
      filename: wrongTitle.filename,
      code: wrongTitle.code,
      output: wrongTitle.code.replace("'Spinner/Spinner'", "'Components/Spinner'"),
      errors: [{ message: FIX_MESSAGE }],
    },
    {
      filename: noTitle.filename,
      code: noTitle.code,
      output: null,
      errors: [{ message: MISSING_MESSAGE }],
    },
    {
      filename: clash.filename,
      code: clash.code,
      output: null,
      errors: [{ message: DUPLICATE_TITLE_MESSAGE }, { message: DUPLICATE_EXPORT_MESSAGE }],
    },
  ],
});

fs.rmSync(root, { recursive: true, force: true });

console.log('storybook-title: ok');
