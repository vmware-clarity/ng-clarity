/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

/* eslint-disable @typescript-eslint/no-var-requires */
const NgErrors = require('raw-loader!./ng/errors.html').default;
const NgForm = require('raw-loader!./ng/form.html').default;
const NgHelpers = require('raw-loader!./ng/helpers.html').default;
const NgLayouts = require('raw-loader!./ng/layouts.html').default;
const NgOverride = require('raw-loader!./ng/override.html').default;
const NgReactiveHtml = require('raw-loader!./ng/reactive.html').default;
const NgRequiredInformationLabel = require('raw-loader!./ng/required-information-label.html').default;
const NgRequiredMark = require('raw-loader!./ng/required-mark.html').default;
const NgStructure = require('raw-loader!./ng/structure.html').default;
const UiErrors = require('raw-loader!./ui/errors.html').default;
const UiForm = require('raw-loader!./ui/form.html').default;
const UiGrid = require('raw-loader!./ui/grid.html').default;
const UiLayouts = require('raw-loader!./ui/layouts.html').default;
const UiRequiredInformationLabel = require('raw-loader!./ui/required-information-label.html').default;
const UiRequiredMark = require('raw-loader!./ui/required-mark.html').default;
const UiStructure = require('raw-loader!./ui/structure.html').default;
const UiSuccess = require('raw-loader!./ui/success.html').default;

const NgBasicTs = require('!raw-loader!./ng/basic.ts').default;
const NgGenericHtml = require('!raw-loader!./ng/generic.html').default;
const NgGenericTs = require('!raw-loader!./ng/generic.ts').default;
const NgLabelSize = require('!raw-loader!./ng/label-size.html').default;
const NgReactiveTs = require('!raw-loader!./ng/reactive.ts').default;
const NgResetHtml = require('!raw-loader!./ng/reset.html').default;
const NgResetTs = require('!raw-loader!./ng/reset.ts').default;
const NgValidateHtml = require('!raw-loader!./ng/validate.html').default;
const NgValidateTs = require('!raw-loader!./ng/validate.ts').default;
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-forms-demo',
  templateUrl: './forms.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
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
