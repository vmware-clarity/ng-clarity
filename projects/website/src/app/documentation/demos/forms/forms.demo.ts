/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { FormsDemoModule } from './forms.demo.module';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

const NgErrors = '';
const NgForm = '';
const NgHelpers = '';
const NgLayouts = '';
const NgOverride = '';
const NgReactiveHtml = '';
const NgRequiredInformationLabel = '';
const NgRequiredMark = '';
const NgStructure = '';
const UiErrors = '';
const UiForm = '';
const UiGrid = '';
const UiLayouts = '';
const UiRequiredInformationLabel = '';
const UiRequiredMark = '';
const UiStructure = '';
const UiSuccess = '';

const NgBasicTs = '';
const NgGenericHtml = '';
const NgGenericTs = '';
const NgLabelSize = '';
const NgReactiveTs = '';
const NgResetHtml = '';
const NgResetTs = '';
const NgValidateHtml = '';
const NgValidateTs = '';

@Component({
  selector: 'clr-forms-demo',
  templateUrl: './forms.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    DoDontComponent,
    StackblitzExampleComponent,
    ClrAlertModule,
    ClrIcon,
    ClrIconModule,
    StyleDocsComponent,
    FormsDemoModule,
  ],
})
export class FormsDemo extends ClarityDocComponent {
  newLayout = true;

  uiErrors = UiErrors;
  uiSuccess = UiSuccess;
  uiForm = UiForm;
  uiGrid = UiGrid;
  uiLayouts = UiLayouts;
  uiStructure = UiStructure;
  uiRequiredMark = UiRequiredMark;
  uiRequiredInformationLabel = UiRequiredInformationLabel;

  ngBasicTs = NgBasicTs;
  ngErrors = NgErrors;
  ngForm = NgForm;
  ngHelpers = NgHelpers;
  ngLayouts = NgLayouts;
  ngReactiveTs = NgReactiveTs;
  ngReactiveHtml = NgReactiveHtml;
  ngStructure = NgStructure;
  ngOverride = NgOverride;
  ngResetHtml = NgResetHtml;
  ngResetTs = NgResetTs;
  ngValidateTs = NgValidateTs;
  ngValidateHtml = NgValidateHtml;
  ngLabelSize = NgLabelSize;
  ngGenericTs = NgGenericTs;
  ngGenericHtml = NgGenericHtml;
  ngRequiredMark = NgRequiredMark;
  ngRequiredInformationLabel = NgRequiredInformationLabel;

  constructor() {
    super('forms');
  }
}
