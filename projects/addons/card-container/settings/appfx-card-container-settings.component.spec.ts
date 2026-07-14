/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { sampleCards, sortCardsFn } from '@clr/addons/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { AppfxCardInternal } from '../appfx-card-container.interface';
import { AppfxCardContainerSettingsComponent } from './appfx-card-container-settings.component';

describe('AppfxCardContainerSettingsComponent', () => {
  let fixture: ComponentFixture<AppfxCardContainerSettingsComponent>;
  let component: AppfxCardContainerSettingsComponent;
  let sampleContainerCards: AppfxCardInternal[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDropdownModule, ClrCheckboxModule, AppfxTranslateModule],
      declarations: [AppfxCardContainerSettingsComponent],
    });
    fixture = TestBed.createComponent(AppfxCardContainerSettingsComponent);
    component = fixture.componentInstance;
    sampleContainerCards = [...sampleCards];
  });

  beforeEach(() => {
    component.containerCards = [...sampleContainerCards];
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  describe('when pass card list to settings component', () => {
    it('then should sort cards according to title', () => {
      const sortedCards = [...sampleContainerCards];
      const expectedSortedCards = sortedCards.sort(sortCardsFn);
      expect(component.cards).toEqual(expectedSortedCards);
    });
  });

  describe('when call toggleShowHide', () => {
    it('then emit event with cardId', () => {
      spyOn(component.toggleCardVisibility, 'emit').and.callThrough();
      component.toggleShowHide(sampleContainerCards[0]);
      fixture.detectChanges();
      expect(component.toggleCardVisibility.emit).toHaveBeenCalledWith(sampleContainerCards[0].id);
    });

    it('then should not emit event when canHide property of the card is false', () => {
      spyOn(component.toggleCardVisibility, 'emit').and.callThrough();
      component.toggleShowHide(sampleContainerCards[2]);
      fixture.detectChanges();
      expect(component.toggleCardVisibility.emit).not.toHaveBeenCalled();
    });
  });
});
