/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrLoadingModule, ClrTree, ClrTreeViewModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { Observable, timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { filesRoot } from '../../helpers/files.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

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

const defaultStory: Story = args => ({
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
  props: {
    ...args,
  },
});

const defaultParameters: Parameters = {
  title: 'Tree/Tree with lazy-loaded nodes',
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

const variants: Parameters[] = [];

setupStorybook([ClrTreeViewModule, ClrConditionalModule, ClrLoadingModule], defaultStory, defaultParameters, variants);
