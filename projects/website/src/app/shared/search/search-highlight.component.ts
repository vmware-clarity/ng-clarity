/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, computed, input } from '@angular/core';

import { splitForHighlight } from './search-match.util';

@Component({
  selector: 'app-search-highlight',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.matched) {
        <mark>{{ segment.text }}</mark>
      } @else {
        {{ segment.text }}
      }
    }
  `,
  styles: [
    `
      mark {
        background-color: transparent;
        color: inherit;
        font-weight: var(--cds-alias-typography-font-weight-semibold);
      }
    `,
  ],
})
export class SearchHighlightComponent {
  readonly text = input.required<string>();
  readonly query = input('');

  protected readonly segments = computed(() => splitForHighlight(this.text(), this.query()));
}
