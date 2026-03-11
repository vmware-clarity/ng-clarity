/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

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
import { WizardJumpToDemo } from './wizard-jump-to.demo';
import { WizardNestedDirectiveDemo } from './wizard-nested-directives.demo';
import { WizardNoCancel } from './wizard-no-cancel.demo';
import { WizardNotClosable } from './wizard-not-closable.demo';
import { WizardResetDemo } from './wizard-reset.demo';
import { WizardSimple } from './wizard-simple.demo';
import { WizardStopNavigation } from './wizard-stop-navigation.demo';
import { WizardTitlesDemo } from './wizard-titles.demo';
import { WizardDemo } from './wizard.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: WizardDemo }]),
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
    WizardBasic,
    WizardSimple,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardNotClosable,
    WizardNestedDirectiveDemo,
    WizardTitlesDemo,
    WizardDefaultButtonsDemo,
    WizardCustomButtonsDemo,
    WizardResetDemo,
    WizardAltCancelDemo,
    WizardAltNextDemo,
    WizardNoCancel,
    WizardJumpToDemo,
    WizardAsyncCompletion,
    WizardForceForwardDemo,
    WizardDemo,
    WizardDesignDemo,
    WizardDesignSizeDemo,
    WizardStopNavigation,
  ],
  exports: [WizardDemo],
})
export class WizardDemoModule {}
