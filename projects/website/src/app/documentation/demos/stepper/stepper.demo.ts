/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrInputModule, ClrPasswordModule, ClrStepperModule } from '@clr/angular';

import { AngularStepperApiDemo } from './angular-stepper-api.demo';
import { AngularStepperReactiveDemo } from './angular-stepper-reactive.demo';
import { AngularStepperTemplateDemo } from './angular-stepper-template.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabActiveDirective } from '../../../shared/doc-tabs/doc-tab-active.directive';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-stepper-demo',
  templateUrl: './stepper.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LinkCardsComponent,
    FormsModule,
    ClrStepperModule,
    ClrInputModule,
    ClrCommonFormsModule,
    ClrPasswordModule,
    DoDontComponent,
    ThemedImageComponent,
    DocTabActiveDirective,
    AngularStepperReactiveDemo,
    AngularStepperTemplateDemo,
    AngularStepperApiDemo,
  ],
})
export class StepperDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  contactForm = {
    name: {
      firstName: '',
      lastName: '',
    },
    contact: {
      email: '',
      phone: '',
    },
    password: {
      password: '',
      confirm: '',
    },
  };

  constructor() {
    super('stepper');
  }

  contactFormSubmit() {
    console.log('contact form submit', this.contactForm);
  }
}
