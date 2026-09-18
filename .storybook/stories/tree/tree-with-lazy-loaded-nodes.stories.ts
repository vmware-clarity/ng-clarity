/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrLoadingModule, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { filesRoot } from '@storybook-helpers/files.data';
import { Observable, timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

/**
 * `ClrTree` declares its input as `@Input('clrLazy') set lazy`, so `clrLazy` is not a property of the
 * class; `fileService` is a story-only prop the template reads through `props`.
 */
type LazyLoadedNodesArgs = {
  clrLazy: boolean;
  fileService: FileService;
};

class FileService {
  loading = false;
  filenames: Observable<string[]>;

  getFilenames() {
    this.loading = true;

    this.filenames = timer(1000).pipe(
      mapTo(filesRoot.filter(file => !file.files).map(file => file.name)),
      tap(() => {
        this.loading = false;
      })
    );
  }
}

const meta: Meta<LazyLoadedNodesArgs> = {
  title: 'Tree/Tree with lazy-loaded nodes',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTreeViewModule, ClrConditionalModule, ClrLoadingModule],
    }),
  ],
  component: ClrTree,
  argTypes: {
    // inputs
    clrLazy: { control: { disable: true } },
    // story helpers
    ...hideControls('fileService'),
  },
  args: {
    // story helpers
    fileService: new FileService(),
  },
  render: args => ({
    template: `
      <clr-tree [clrLazy]="true">
        <clr-tree-node [clrLoading]="fileService.loading">
          Files
          <ng-template clrIfExpanded (clrIfExpandedChange)="$event ? fileService.getFilenames() : null">
            @for (filename of fileService.filenames | async; track filename) {
              <clr-tree-node>
                {{ filename }}
              </clr-tree-node>
            }
          </ng-template>
        </clr-tree-node>
      </clr-tree>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<LazyLoadedNodesArgs>;

export const LazyLoadedNodes: Story = {};
