/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';
import { WizardAltCancelDemo } from './wizard-alt-cancel.demo';
import { WizardAltNextDemo } from './wizard-alt-next.demo';
import { WizardAsyncCompletion } from './wizard-async-completion.demo';
import { WizardAsyncValidation } from './wizard-async-validation.demo';
import { WizardBasic } from './wizard-basic.demo';
import { WizardDefaultButtonsDemo } from './wizard-buttons.demo';
import { WizardCustomButtonsDemo } from './wizard-custom-buttons.demo';
import { WizardDesignSizeDemo } from './wizard-design-size.demo';
import { WizardDesignDemo } from './wizard-design.demo';
import { WizardForceForwardDemo } from './wizard-force-forward.demo';
import { WizardFormValidation } from './wizard-form-validation.demo';
import { WizardHorizontalDemo } from './wizard-horizontal.demo';
import { WizardJumpToDemo } from './wizard-jump-to.demo';
import { WizardNestedDirectiveDemo } from './wizard-nested-directives.demo';
import { WizardNestedStepperDemo } from './wizard-nested-stepper.demo';
import { WizardNestedWizardDemo } from './wizard-nested-wizard.demo';
import { WizardNoCancel } from './wizard-no-cancel.demo';
import { WizardNotClosable } from './wizard-not-closable.demo';
import { WizardResetDemo } from './wizard-reset.demo';
import { WizardSimple } from './wizard-simple.demo';
import { WizardStopNavigation } from './wizard-stop-navigation.demo';
import { WizardTitlesDemo } from './wizard-titles.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

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
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LinkCardsComponent,
    WizardDesignDemo,
    RouterLink,
    WizardDesignSizeDemo,
    ThemedImageComponent,
    WizardBasic,
    WizardSimple,
    WizardNestedDirectiveDemo,
    WizardJumpToDemo,
    WizardTitlesDemo,
    WizardDefaultButtonsDemo,
    WizardCustomButtonsDemo,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardAsyncCompletion,
    WizardStopNavigation,
    WizardResetDemo,
    WizardForceForwardDemo,
    WizardAltCancelDemo,
    WizardNoCancel,
    WizardAltNextDemo,
    WizardNotClosable,
    WizardHorizontalDemo,
    WizardNestedWizardDemo,
    WizardNestedStepperDemo,
    CodeSnippetComponent,
    StyleDocsComponent,
  ],
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
