/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ModalAngularAlternateCloseDemo } from './modal-angular-alt-close-demo';
import { ModalAngularNotClosableDemo } from './modal-angular-not-closable';
import { ModalAngularShowDemo } from './modal-angular-show';
import { ModalAngularSizeDemo } from './modal-angular-size';
import { ModalAngularStaticBackdropDemo } from './modal-angular-static-backdrop';
import { ModalAnimationDemo } from './modal-animation';
import { ModalBackdropDemo } from './modal-backdrop';
import { ModalSizeDesignDemo } from './modal-size-design';
import { ModalSizesDemo } from './modal-sizes';
import { ModalStaticDemo } from './modal-static';
import { ModalDemo } from './modal.demo';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: ModalDemo }]),
    DoDontComponent,
    StyleDocsComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
  ],
  declarations: [
    ModalStaticDemo,
    ModalSizeDesignDemo,
    ModalAngularNotClosableDemo,
    ModalAngularShowDemo,
    ModalAngularSizeDemo,
    ModalAngularStaticBackdropDemo,
    ModalAngularAlternateCloseDemo,
    ModalAnimationDemo,
    ModalBackdropDemo,
    ModalSizesDemo,
    ModalDemo,
  ],
  exports: [ModalDemo],
})
export class ModalDemoModule {}
