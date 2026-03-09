/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import RAW_STYLE_DOCS from '../../../compiled-content/style-docs.json';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

const STYLE_DOCS = RAW_STYLE_DOCS as Record<string, (typeof RAW_STYLE_DOCS)[keyof typeof RAW_STYLE_DOCS]>;

@Component({
  selector: 'app-style-docs',
  template: `
    @if (styleDocsKey && STYLE_DOCS[styleDocsKey]) {
      <section>
        <h2 cds-text="title" cds-layout="m-t:xl">Style</h2>
        <div [innerHTML]="STYLE_DOCS[styleDocsKey] | appSafeHtml"></div>
      </section>
    }
  `,
  imports: [SafeHtmlPipe],
})
export class StyleDocsComponent {
  @Input({ required: true }) styleDocsKey: string | undefined;

  readonly STYLE_DOCS = STYLE_DOCS;
}
