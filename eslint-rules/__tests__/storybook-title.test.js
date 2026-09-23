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

// The rule derives a title from the file's path and walks the story tree to find files sharing that
// title, so the fixtures have to exist on disk. They are built under a throwaway `.storybook/stories/`
// tree; the rule locates that marker inside the path, so the tree does not have to be the
// repository's own. The tree is removed in `finally`, so a failing case does not leave it behind.
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
  "the derived title 'Components/Widget/X'. Duplicate export names under one title produce duplicate story " +
  'ids, which fail the Storybook build.';
const NON_LITERAL_MESSAGE = "Story title must be the literal string derived from the file path: 'Components/Badge'.";

function fixMessage(expected, found) {
  return (
    `Story title must be derived from the file path. Expected '${expected}', found '${found}'. ` +
    'Run `npx eslint --fix` — never type a title by hand.'
  );
}

try {
  // A single-file directory whose file repeats the directory name: the file name contributes nothing.
  const badge = fixture('components/badge/badge.stories.ts', meta('Components/Badge'));
  // A single-file directory whose file name differs from the directory: NOT the primary file. Whether
  // a file is primary never depends on how many siblings it has, so adding one cannot retitle it.
  const spacing = fixture('foundations/spacing/gaps.stories.ts', meta('Foundations/Spacing/Gaps'));
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
  // A directory override and a file override, exercised through `createRule` below. Without the
  // overrides these derive `Components/Renamed`, `Components/Renamed/Child` and `Components/Renamed/Extra`.
  const renamed = fixture('components/renamed/renamed.stories.ts', meta('Components/Custom Label'));
  const renamedChild = fixture('components/renamed/child.stories.ts', meta('Components/Custom Label/Child'));
  const renamedExtra = fixture('components/renamed/renamed-extra.stories.ts', meta('Custom/Whole Title'));
  // The subject of the stale-cache cases at the end: alone in its directory, and not its primary file.
  const gaugeRing = fixture('components/gauge/gauge-ring.stories.ts', meta('Components/Gauge/Ring'));

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
      gaugeRing,
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
      {
        // Storybook's recommended CSF3 form
        filename: badge.filename,
        code: "const meta = { title: 'Components/Badge' } satisfies Meta<Args>;\nexport default meta;",
      },
      {
        filename: badge.filename,
        code: "const meta = { title: 'Components/Badge' } as Meta<Args>;\nexport default meta;",
      },
      {
        filename: badge.filename,
        code: "const meta = <Meta<Args>>{ title: 'Components/Badge' };\nexport default meta;",
      },
      {
        filename: badge.filename,
        code: "export default { title: 'Components/Badge' } satisfies Meta<Args>;",
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
      {
        // a wrong title in a `satisfies Meta<X>` meta is found and fixed
        filename: wrongTitle.filename,
        code: "const meta = { title: 'Spinner/Spinner' } satisfies Meta<Args>;\nexport default meta;",
        output: "const meta = { title: 'Components/Spinner' } satisfies Meta<Args>;\nexport default meta;",
        errors: [{ message: FIX_MESSAGE }],
      },
      {
        filename: wrongTitle.filename,
        code: "const meta = { title: 'Spinner/Spinner' } as Meta<Args>;\nexport default meta;",
        output: "const meta = { title: 'Components/Spinner' } as Meta<Args>;\nexport default meta;",
        errors: [{ message: FIX_MESSAGE }],
      },
      {
        // a `satisfies Meta<X>` meta without a title is reported as missing one
        filename: noTitle.filename,
        code: 'const meta = { component: ClrTooltip } satisfies Meta<Args>;\nexport default meta;',
        output: null,
        errors: [{ message: MISSING_MESSAGE }],
      },
      {
        // a non-literal title cannot be checked, so it is reported; there is nothing safe to rewrite
        filename: badge.filename,
        code: "const title = 'Components/Badge';\nconst meta: Meta<Args> = { title: title };\nexport default meta;",
        output: null,
        errors: [{ message: NON_LITERAL_MESSAGE }],
      },
      {
        filename: badge.filename,
        code: 'const meta: Meta<Args> = { title: `Components/Badge` };\nexport default meta;',
        output: null,
        errors: [{ message: NON_LITERAL_MESSAGE }],
      },
      {
        // without the overrides, the overridden fixtures derive their plain titles
        filename: renamedExtra.filename,
        code: renamedExtra.code,
        output: renamedExtra.code.replace("'Custom/Whole Title'", "'Components/Renamed/Extra'"),
        errors: [{ message: fixMessage('Components/Renamed/Extra', 'Custom/Whole Title') }],
      },
    ],
  });

  // TITLE_OVERRIDES: a directory key replaces the directory part of the title for every file in it;
  // a file key replaces that one file's whole title, and wins over its directory's key.
  const overriddenRule = rule.createRule({
    'components/renamed': 'Components/Custom Label',
    'components/renamed/renamed-extra.stories.ts': 'Custom/Whole Title',
  });

  ruleTester.run('storybook-title (overrides)', overriddenRule, {
    valid: [renamed, renamedChild, renamedExtra, badge],
    invalid: [
      {
        filename: renamed.filename,
        code: meta('Components/Renamed'),
        output: meta('Components/Custom Label'),
        errors: [{ message: fixMessage('Components/Custom Label', 'Components/Renamed') }],
      },
      {
        filename: renamedChild.filename,
        code: meta('Components/Renamed/Child'),
        output: meta('Components/Custom Label/Child'),
        errors: [{ message: fixMessage('Components/Custom Label/Child', 'Components/Renamed/Child') }],
      },
      {
        filename: renamedExtra.filename,
        code: meta('Components/Custom Label/Extra'),
        output: meta('Custom/Whole Title'),
        errors: [{ message: fixMessage('Custom/Whole Title', 'Components/Custom Label/Extra') }],
      },
    ],
  });

  // The cross-file cache must follow the story tree as it changes within one process (an editor's
  // long-lived ESLint server). `rule` has already walked the tree above, when `gauge-ring` was alone.
  const gaugeRingClash =
    "Story title 'Components/Gauge/Ring' is also the derived title of components/gauge/ring.stories.ts. " +
    'Files sharing a title share one story-id namespace. Rename one of the files so their derived titles differ.';
  const ring = fixture(
    'components/gauge/ring.stories.ts',
    meta('Components/Gauge/Ring').replace('export const Default', 'export const Other')
  );

  // A sibling is added: `gauge-ring` keeps its title, and the new collision is seen.
  ruleTester.run('storybook-title (sibling added)', rule, {
    valid: [],
    invalid: [
      {
        filename: gaugeRing.filename,
        code: gaugeRing.code,
        output: null,
        errors: [{ message: gaugeRingClash }],
      },
    ],
  });

  // The sibling is removed again: the collision goes with it.
  fs.rmSync(ring.filename);

  ruleTester.run('storybook-title (sibling removed)', rule, {
    valid: [gaugeRing],
    invalid: [],
  });
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log('storybook-title: ok');
