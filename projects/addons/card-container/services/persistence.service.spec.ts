/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EmbeddedViewRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SampleCardComponent, sampleCards } from '@clr/addons/testing';
import { of } from 'rxjs';

import { AppfxCardInternal, AppfxCardSettings } from '../appfx-card-container.interface';
import { AppfxCardContainerStore } from '../utils/appfx-card-container-store';
import { PersistenceService } from './persistence.service';

describe('#PersistenceService', () => {
  const containerStore = new AppfxCardContainerStore().getLocalStore('containerId');
  let persistenceService: PersistenceService;
  let cards: AppfxCardInternal[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersistenceService],
    });
    persistenceService = TestBed.inject(PersistenceService);
    persistenceService.initialize(containerStore);
    cards = [...sampleCards];
  });

  it('should create an instance', () => {
    expect(persistenceService).toBeDefined();
  });

  describe('when called retrieve', () => {
    it('then should fetch settings from container', () => {
      spyOn(containerStore, 'retrieve').and.returnValue(of([]));
      persistenceService.retrieve().subscribe((cardSettings: AppfxCardSettings[]) => {
        expect(cardSettings).toEqual([]);
      });
      expect(containerStore.retrieve).toHaveBeenCalled();
    });
  });

  describe('when called save', () => {
    let expectedSettings: AppfxCardSettings[];

    beforeEach(() => {
      expectedSettings = cards.map((card: AppfxCardInternal) => ({
        id: card.id,
        order: card.order,
        hidden: card.hidden,
      }));
    });

    it('then should generate and save card settings properly', () => {
      spyOn(containerStore, 'save').and.callThrough();
      persistenceService.save(cards);
      expect(containerStore.save).toHaveBeenCalledWith(expectedSettings);
    });

    it('then should merge and update settings if cardSettings for card is already available', () => {
      // save cards settings before
      persistenceService.save(cards);
      persistenceService.retrieve().subscribe((cardSettings: AppfxCardSettings[]) => {
        expect(cardSettings).toEqual(expectedSettings);
      });
      // update settings of card 1
      const sampleCardOne = {
        ...sampleCards[1],
        hidden: false,
      };
      spyOn(containerStore, 'save').and.callThrough();
      persistenceService.save([sampleCardOne]);
      const expectedMergedCardSettings = expectedSettings.map((cardSetting: AppfxCardSettings) => {
        if (cardSetting.id === sampleCardOne.id) {
          return { ...cardSetting, hidden: false };
        }
        return cardSetting;
      });
      expect(containerStore.save).toHaveBeenCalledWith(expectedMergedCardSettings);
      persistenceService.retrieve().subscribe((cardSettings: AppfxCardSettings[]) => {
        expect(cardSettings).toEqual(expectedMergedCardSettings);
      });
    });

    it('then should append new card settings to existing settings', () => {
      // save cards settings before
      persistenceService.save(cards);
      persistenceService.retrieve().subscribe((cardSettings: AppfxCardSettings[]) => {
        expect(cardSettings).toEqual(expectedSettings);
      });
      // update settings of card 1
      const newCard = {
        id: 'custom-attributes',
        title: 'Custom Attributes',
        componentClass: SampleCardComponent,
        order: 3,
        hidden: false,
        view: undefined as unknown as EmbeddedViewRef<void>,
      };
      spyOn(containerStore, 'save').and.callThrough();
      persistenceService.save([newCard]);
      const expectedMergedCardSettings = [...expectedSettings, { id: 'custom-attributes', order: 3, hidden: false }];
      expect(containerStore.save).toHaveBeenCalledWith(expectedMergedCardSettings);
      persistenceService.retrieve().subscribe((cardSettings: AppfxCardSettings[]) => {
        expect(cardSettings).toEqual(expectedMergedCardSettings);
      });
    });
  });
});
