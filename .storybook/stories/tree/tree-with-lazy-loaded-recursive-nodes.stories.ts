/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { type File, filesRoot } from '@storybook-helpers/files.data';
import { Observable, of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

/**
 * `ClrTree` declares its input as `@Input('clrLazy') set lazy`, so `clrLazy` is not a property of the
 * class; `files` and `getChildren` are story-only props `*clrRecursiveFor` reads through `props`.
 */
type LazyLoadedRecursiveNodesArgs = {
  clrLazy: boolean;
  files: Observable<File[]>;
  getChildren: (file: File) => Observable<File[]>;
};

const meta: Meta<LazyLoadedRecursiveNodesArgs> = {
  title: 'Tree/Tree with lazy-loaded recursive nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
    // story helpers
    ...hideControls('files', 'getChildren'),
  },
  args: {
    // story helpers
    files: of(filesRoot),
    getChildren: file => timer(1000).pipe(mapTo(file.files)),
  },
  render: args => ({
    template: `
      <clr-tree [clrLazy]="true">
        <clr-tree-node
          *clrRecursiveFor="let file of files | async; getChildren: getChildren"
          [clrExpandable]="!!file?.files"
        >
          {{ file?.name }}
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<LazyLoadedRecursiveNodesArgs>;

export const LazyLoadedRecursiveNodes: Story = {};
