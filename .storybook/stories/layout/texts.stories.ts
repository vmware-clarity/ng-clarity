/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

@Component({
  selector: 'layout-test-component',
  template: `
    <h2>CDS-TEXT with density tokens</h2>
    <div class="demo">
      <h3>Headings</h3>
      <p cds-text="display">The five boxing wizards jump quickly (display)</p>
      <p cds-text="headline">The five boxing wizards jump quickly (headline)</p>
      <p cds-text="title">The five boxing wizards jump quickly (title)</p>
      <p cds-text="section">The five boxing wizards jump quickly (section)</p>
      <p cds-text="subsection">The five boxing wizards jump quickly (subsection)</p>
    </div>
    <div class="demo">
      <h3>Content</h3>
      <p cds-text="body">The quick brown fox jumps over the lazy dog. (body)</p>
      <p cds-text="message">The quick brown fox jumps over the lazy dog. (message)</p>
      <p cds-text="secondary">The quick brown fox jumps over the lazy dog. (secondary)</p>
      <p cds-text="caption">The quick brown fox jumps over the lazy dog. (caption)</p>
      <p cds-text="smallcaption">The quick brown fox jumps over the lazy dog. (smallcaption)</p>
    </div>
  `,
  styles: [
    `
      h2 {
        margin-top: 0;
        margin-bottom: var(--clr-base-vertical-offset-l);
      }
      .demo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--clr-base-gap-m);
        border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
        border-radius: var(--clr-base-border-radius-l);
        margin-bottom: var(--clr-base-vertical-offset-xl);
        padding: var(--clr-base-horizontal-offset-l) var(--clr-base-vertical-offset-l);

        > h3 {
          margin-top: 0;
          padding-bottom: var(--clr-base-vertical-offset-m);
          border-bottom: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
          width: 100%;
        }
      }
    `,
  ],
  standalone: true,
})
export class TextTestComponent {}

export default {
  title: 'Layout/Spacing',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  component: TextTestComponent,
  argTypes: {},
  args: {},
};

export const CDS_Text: StoryObj = {};
