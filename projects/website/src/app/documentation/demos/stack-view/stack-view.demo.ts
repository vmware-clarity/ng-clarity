/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule, ClrIcon, ClrIconModule, ClrStackViewModule } from '@clr/angular';

import { RemoveStackViewHeadingsDirective } from './remove-stack-view-headings.directive';
import { StackViewAngularBasicDemo } from './stack-view-angular-basic';
import { StackViewAngularLazyloadDemo } from './stack-view-angular-lazyload';
import { StackViewAngularModalEditDemo } from './stack-view-angular-modal-edit';
import { StackViewStaticDemo } from './stack-view-static';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-stack-view-demo',
  templateUrl: './stack-view.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    StackViewAngularBasicDemo,
    StackViewAngularModalEditDemo,
    StackViewAngularLazyloadDemo,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    StackViewStaticDemo,
    ClrStackViewModule,
    RemoveStackViewHeadingsDirective,
    StyleDocsComponent,
  ],
})
export class StackViewDemo extends ClarityDocComponent {
  constructor() {
    super('stack-view');
  }
}
