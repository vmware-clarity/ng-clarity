/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule, ClrIcon, ClrIconModule } from '@clr/angular';
import { FORMS_EXAMPLES } from '@clr/examples/forms';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

const NgForm = require('raw-loader!./ng/form.html').default;
const NgLayouts = require('raw-loader!./ng/layouts.html').default;
const NgRequiredInformationLabel = require('raw-loader!./ng/required-information-label.html').default;
const UiForm = require('raw-loader!./ui/form.html').default;
const UiLayouts = require('raw-loader!./ui/layouts.html').default;
const UiRequiredInformationLabel = require('raw-loader!./ui/required-information-label.html').default;

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
    DocExampleComponent,
    ClrAlertModule,
    ClrIcon,
    ClrIconModule,
    StyleDocsComponent,
    AiSkillComponent,
  ],
})
export class FormsDemo extends ClarityDocComponent {
  newLayout = true;

  readonly examples = FORMS_EXAMPLES;

  uiForm = UiForm;
  uiLayouts = UiLayouts;
  uiRequiredInformationLabel = UiRequiredInformationLabel;

  ngForm = NgForm;
  ngLayouts = NgLayouts;
  ngRequiredInformationLabel = NgRequiredInformationLabel;

  constructor() {
    super('forms');
  }
}
