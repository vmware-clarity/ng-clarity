/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

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
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { notificationsPatternLink, onboardingPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-modal-demo',
  templateUrl: './modal.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LinkCardsComponent,
    ModalSizeDesignDemo,
    DoDontComponent,
    ThemedImageComponent,
    ModalAngularShowDemo,
    ModalAngularSizeDemo,
    ModalAngularNotClosableDemo,
    ModalAngularAlternateCloseDemo,
    ModalAngularStaticBackdropDemo,
    ClrAlertModule,
    ModalStaticDemo,
    ModalSizesDemo,
    ModalBackdropDemo,
    ModalAnimationDemo,
    StyleDocsComponent,
  ],
})
export class ModalDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [notificationsPatternLink, onboardingPatternLink];

  expanded = false;

  constructor() {
    super('modal');
  }
}
