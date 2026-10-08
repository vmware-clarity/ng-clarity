/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';

import { splitForHighlight } from './search-match.util';

@Component({
  selector: 'app-search-highlight',
  template: ``,
  styles: [
    `
      mark {
        text-decoration: underline;
        font-weight: var(--cds-alias-typography-font-weight-semibold);
      }
    `,
  ],
  host: {
    '[innerHTML]': 'generatedHTML',
  },
})
export class SearchHighlightComponent {
  readonly text = input.required<string>();
  readonly query = input('');

  protected get generatedHTML() {
    let result = '';

    splitForHighlight(this.text(), this.query()).forEach(segment => {
      result += segment.matched ? `<mark>${segment.text}</mark>` : segment.text;
    });

    return result;
  }
}
