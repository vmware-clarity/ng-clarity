/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  AppfxCardInternal,
  AppfxCardSettings,
  AppfxContainerPersistenceStore,
} from '../appfx-card-container.interface';

/**
 * Handles storing and retrieving of preferences/settings of the cards in container
 * like order, hidden properties of card.
 */
@Injectable()
export class PersistenceService {
  private containerStore: AppfxContainerPersistenceStore;

  private appfxCardSettings: AppfxCardSettings[] = [];

  initialize(containerStore: AppfxContainerPersistenceStore) {
    this.containerStore = containerStore;
  }

  retrieve(): Observable<AppfxCardSettings[]> {
    return this.containerStore.retrieve().pipe(
      tap((cardSettings: AppfxCardSettings[]) => {
        this.appfxCardSettings = cardSettings;
      })
    );
  }

  save(cards: AppfxCardInternal[]): void {
    const cardSettings: AppfxCardSettings[] = this.generateCardSettings(cards);
    this.appfxCardSettings = this.mergeCardSettings(cardSettings);
    this.containerStore.save(this.appfxCardSettings);
  }

  /**
   * Generate Card Settings.
   */
  private generateCardSettings(cards: AppfxCardInternal[]): AppfxCardSettings[] {
    return cards.map((card: AppfxCardInternal) => ({
      id: card.id,
      order: card.order,
      hidden: card.hidden,
    }));
  }

  /**
   * If cardSettings are preset in the persistence store then update them with provided info and use them
   * else add it to store if new card settings.
   */
  private mergeCardSettings(cardSettings: AppfxCardSettings[]): AppfxCardSettings[] {
    const updatedCardSettings = this.appfxCardSettings.map((cardSetting: AppfxCardSettings) => {
      const updatedCardSetting = cardSettings.find((setting: AppfxCardSettings) => setting.id === cardSetting.id);
      return updatedCardSetting ?? cardSetting;
    });

    // get newly added cards
    const newCardSettings = cardSettings.filter((cardSetting: AppfxCardSettings) => {
      const alreadyUpdated = updatedCardSettings.find(
        (updatedCardSetting: AppfxCardSettings) => updatedCardSetting.id === cardSetting.id
      );
      return !alreadyUpdated;
    });

    // all cardsInfo's - existing with updated cardInfo's and newly added cardInfo's
    return [...updatedCardSettings, ...newCardSettings];
  }
}
