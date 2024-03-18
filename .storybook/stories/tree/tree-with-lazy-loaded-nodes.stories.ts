/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrLoadingModule, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { Observable, timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { CommonModules } from '../../helpers/common';
import { filesRoot } from '../../helpers/files.data';

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

export default {
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
    fileService: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    fileService: new FileService(),
  },
};

const LazyLoadedTreeTemplate: Story = args => ({
  template: `
    <clr-tree [clrLazy]="true">
      <clr-tree-node [clrLoading]="fileService.loading">
        Files
        <ng-template clrIfExpanded (clrIfExpandedChange)="$event ? fileService.getFilenames() : null">
          <clr-tree-node *ngFor="let filename of fileService.filenames | async">
            {{ filename }}
          </clr-tree-node>
        </ng-template>
      </clr-tree-node>
    </clr-tree>
  `,
  props: args,
});

export const LazyLoadedNodes: StoryObj = {
  render: LazyLoadedTreeTemplate,
};
