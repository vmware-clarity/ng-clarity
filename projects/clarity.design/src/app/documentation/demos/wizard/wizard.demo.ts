/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const WIZARD_EXAMPLE_TYPESCRIPT = `
@Component({
  // ...
})
export class WizardJumpToDemo {
  @ViewChild('ohai') wizard: ClrWizard; // makes wizard accessible through this.wizard!!!
}
`;

const WIZARD_EXAMPLE_TEMPLATE = `
<clr-wizard #ohai [(clrWizardOpen)]="open">
  <!-- the '#wizard' up there creates the reference that your ViewChild property looks for -->
  <clr-wizard-title>Your Wizard</clr-wizard-title>
  ...
</clr-wizard>
`;

const WIZARD_PAGE_EXAMPLE_TYPESCRIPT = `
@Component({
  // ...
})
export class WizardJumpToDemo {
  @ViewChild('firstPage') wizardPage_1: ClrWizardPage;
  @ViewChild('secondPage') wizardPage_2: ClrWizardPage;

  get pageAreDone(): boolean {
    return this.firstPage.completed && this.secondPage.completed;
  }
}
`;

const WIZARD_PAGE_EXAMPLE_TEMPLATE = `
<clr-wizard [(clrWizardOpen)]="open">
  <clr-wizard-title>Your Wizard</clr-wizard-title>
  <clr-wizard-page #firstPage>...</clr-wizard-page>
  <clr-wizard-page #secondPage>...</clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-demo',
  templateUrl: './wizard.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class WizardDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  wizardExampleTypeScript = WIZARD_EXAMPLE_TYPESCRIPT;
  wizardExampleTemplate = WIZARD_EXAMPLE_TEMPLATE;
  wizardPageExampleTypeScript = WIZARD_PAGE_EXAMPLE_TYPESCRIPT;
  wizardPageExampleTemplate = WIZARD_PAGE_EXAMPLE_TEMPLATE;

  constructor() {
    super('wizard');
  }
}
