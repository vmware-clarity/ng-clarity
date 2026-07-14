/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  appfxMissingTranslationToken,
  AppfxTranslateService,
  appfxTranslationsToken,
  defaultMissingTranslationHandler,
} from '@clr/addons/translate';
import { ClarityIcons, cogIcon } from '@clr/angular/icon';

import { AppfxCardInternal } from '../appfx-card-container.interface';
import { translations } from '../appfx-card-container.l10n';

// sort function to display cards by sorted titles
const sortCardsByTitleFn = (a: AppfxCardInternal, b: AppfxCardInternal) => {
  if (a.title && b.title) {
    return a.title.localeCompare(b.title);
  }
  return 0;
};

/**
 * Component to display container settings menu to show/hide cards.
 * Shows card list alphabetically according to title with checkboxes.
 */
@Component({
  selector: 'appfx-card-container-settings',
  standalone: false,
  templateUrl: 'appfx-card-container-settings.component.html',
  styleUrls: ['appfx-card-container-settings.component.scss'],
  providers: [
    AppfxTranslateService,
    {
      provide: appfxMissingTranslationToken,
      useValue: defaultMissingTranslationHandler,
    },
    {
      provide: appfxTranslationsToken,
      useValue: translations,
    },
  ],
})
export class AppfxCardContainerSettingsComponent {
  cards: AppfxCardInternal[];

  /**
   * Event Emitter when user wants to show/hide card.
   */
  @Output() toggleCardVisibility: EventEmitter<string> = new EventEmitter();

  constructor() {
    ClarityIcons.addIcons(cogIcon);
  }

  /**
   * Cards list to display in settings dropdown menu.
   */
  @Input()
  set containerCards(cards: AppfxCardInternal[]) {
    this.cards = cards.sort(sortCardsByTitleFn);
  }

  /**
   * Show/hide Card
   */
  toggleShowHide(card: AppfxCardInternal): void {
    if (card.canHide !== false) {
      this.toggleCardVisibility.emit(card.id);
    }
  }

  trackByFn(index: number, item: AppfxCardInternal): string {
    return item.id;
  }
}
