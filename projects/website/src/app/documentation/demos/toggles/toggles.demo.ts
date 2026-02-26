/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCheckboxModule, ClrCommonFormsModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { TogglesDemoModule } from './toggles.demo.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

const ExampleTs = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrCheckboxModule],
})
export class ExampleComponent {
  options = {
    one: false,
    two: true,
  };
}
`;

const NgBasic = '';
const NgDisabled = '';
const NgHelpers = '';
const NgInline = '';
const NgLabel = '';
const NgRight = '';
const UiBasic = '';
const UiDisabled = '';
const UiError = '';
const UiFull = '';
const UiInline = '';
const UiRight = '';

@Component({
  templateUrl: './toggles.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrCheckboxModule,
    StackblitzExampleComponent,
    ClrCommonFormsModule,
    FormsModule,
    ClrIcon,
    ClrIconModule,
    ThemedImageComponent,
    RouterLink,
    LinkCardsComponent,
    StyleDocsComponent,
    TogglesDemoModule,
  ],
})
export class TogglesDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  exampleOne = {
    one: false,
    two: false,
  };
  exampleTwo = {
    one: false,
    two: false,
  };
  exampleThree = {
    one: false,
    two: false,
  };
  exampleFour = {
    one: false,
    two: false,
  };

  uiBasic: any = UiBasic;
  uiFull: any = UiFull;
  uiError: any = UiError;
  uiInline: any = UiInline;
  uiRight: any = UiRight;
  uiDisabled: any = UiDisabled;

  ngBasic: any = NgBasic;
  ngLabel: any = NgLabel;
  ngHelpers: any = NgHelpers;
  ngInline: any = NgInline;
  ngRight: any = NgRight;
  ngDisabled: any = NgDisabled;

  exampleTs = ExampleTs;

  checked = true;
  disabled = true;

  constructor() {
    super('toggle-switch');
  }
}
