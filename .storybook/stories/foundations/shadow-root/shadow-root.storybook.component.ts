/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';

/** The page's `cds-theme` does not reach into a shadow root, so plugins set it again inside. */
function pageTheme() {
  return inject(DOCUMENT).body.getAttribute('cds-theme');
}

/** Clarity's global CSS loaded inside a shadow root, the way shadow-root hosted plugins load it. */
@Component({
  selector: 'shadow-root-typography',
  template: `
    <div [attr.cds-theme]="theme">
      <h3>Heading</h3>
      <p>Paragraph</p>
      <p class="p0">Paragraph p0</p>
      <p class="p2">Paragraph p2</p>
      <p class="p3">Paragraph p3</p>
      <p class="p4">Paragraph p4</p>
      <p class="p5">Paragraph p5</p>
      <p class="p6">Paragraph p6</p>
      <p class="p7">Paragraph p7</p>
      <p class="p8">Paragraph p8</p>
      <div class="card">
        <div class="card-header">Card</div>
        <div class="card-block">
          <p class="card-text">Card text</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: '../../../../projects/ui/src/clr-ui.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ShadowRootTypographyComponent {
  protected readonly theme = pageTheme();
}

/** The container-query build of Clarity's CSS in a shadow root whose host is the layout container. */
@Component({
  selector: 'shadow-root-container-queries',
  template: `
    <div [attr.cds-theme]="theme">
      <div class="clr-row">
        <div class="clr-col-12 clr-col-md-6"><span>clr-col-12 clr-col-md-6</span></div>
        <div class="clr-col-12 clr-col-md-6"><span>clr-col-12 clr-col-md-6</span></div>
      </div>
      <div class="clr-row">
        <div class="clr-col-sm-4"><span>clr-col-sm-4</span></div>
        <div class="clr-col-sm-4"><span>clr-col-sm-4</span></div>
        <div class="clr-col-sm-4"><span>clr-col-sm-4</span></div>
      </div>
      <div cds-layout="grid cols@sm:6 gap:md">
        <span>cds-layout cols&#64;sm:6</span>
        <span>cds-layout cols&#64;sm:6</span>
      </div>
    </div>
  `,
  styleUrls: ['../../../../projects/ui/src/clr-ui-container-queries.scss', './shadow-root-container-queries.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ShadowRootContainerQueriesComponent {
  protected readonly theme = pageTheme();
}
