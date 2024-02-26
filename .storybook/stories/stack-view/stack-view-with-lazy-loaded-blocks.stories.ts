/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinnerModule, ClrStackView, ClrStackViewModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { Observable, timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { CommonModules } from '../../helpers/common';
import { elements } from '../../helpers/elements.data';

interface Block {
  label: string;
  content: string;
}

class ElementsBlockService {
  loading = false;
  blocks: Observable<Block[]>;

  getBlocks() {
    this.loading = true;

    this.blocks = timer(1000).pipe(
      mapTo(elements.map<Block>(element => ({ label: element.symbol, content: element.name }))),
      tap(() => {
        this.loading = false;
      })
    );
  }
}

export default {
  title: 'Stack View/Stack View with lazy-loaded blocks',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule, ClrSpinnerModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    elementsBlockService: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elementsBlockService: new ElementsBlockService(),
  },
};

const StackViewTemplate: Story = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-block [clrSbExpandable]="true" (clrSbExpandedChange)="elementsBlockService.getBlocks()">
        <clr-stack-label>Elements</clr-stack-label>

        <clr-stack-block *ngIf="elementsBlockService.loading">
          <clr-spinner clrInline>Loading...</clr-spinner>
        </clr-stack-block>

        <clr-stack-block *ngFor="let block of elementsBlockService.blocks | async">
          <clr-stack-label>{{ block.label }}</clr-stack-label>
          <clr-stack-content>{{ block.content }}</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  `,
  props: args,
});

export const LazyLoading: StoryObj = {
  render: StackViewTemplate,
};
