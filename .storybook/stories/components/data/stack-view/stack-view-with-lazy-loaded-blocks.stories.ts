/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinnerModule, ClrStackView, ClrStackViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { elements } from '@storybook-helpers/elements.data';
import { Observable, timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

/**
 * `ClrStackView` declares no inputs at all; the only arg is the service the template reads its blocks and
 * loading flag off, so the args type is a standalone declaration rather than the component class.
 */
type StackViewLazyLoadingArgs = {
  elementsBlockService: ElementsBlockService;
};

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

const meta: Meta<StackViewLazyLoadingArgs> = {
  title: 'Stack View/Stack View with lazy-loaded blocks',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule, ClrSpinnerModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    ...hideControls('elementsBlockService'),
  },
  args: {
    // story helpers
    elementsBlockService: new ElementsBlockService(),
  },
  render: args => ({
    template: `
      <clr-stack-view>
        <clr-stack-block [clrSbExpandable]="true" (clrSbExpandedChange)="elementsBlockService.getBlocks()">
          <clr-stack-label>Elements</clr-stack-label>

          @if (elementsBlockService.loading) {
            <clr-stack-block>
              <clr-spinner clrInline>Loading...</clr-spinner>
            </clr-stack-block>
          }

          @for (block of elementsBlockService.blocks | async; track block) {
            <clr-stack-block>
              <clr-stack-label>{{ block.label }}</clr-stack-label>
              <clr-stack-content>{{ block.content }}</clr-stack-content>
            </clr-stack-block>
          }
        </clr-stack-block>
      </clr-stack-view>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<StackViewLazyLoadingArgs>;

export const LazyLoading: Story = {};
