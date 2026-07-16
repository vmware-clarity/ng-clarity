/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import { MockRenderer2, sampleCards } from '@clr/addons/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { of } from 'rxjs';

import { AppfxCardContainerComponent } from './appfx-card-container.component';
import { AppfxCardComponent } from '../card/appfx-card.component';
import { ContainerService } from '../services/container.service';
import { PersistenceService } from '../services/persistence.service';
import { AppfxCardContainerSettingsComponent } from '../settings/appfx-card-container-settings.component';

const mockContainerService = {
  initialize: () => {},
  getContainerId: () => 'sample-container',
  getCardById: () => sampleCards[0],
  getCardOrder: () => {},
  getCardsWithOrder: () => of(sampleCards),
  getCardWithOrder: () => of(sampleCards),
  getContainerCards: () => [sampleCards],
  addCard: () => {},
  updateCardsOrder: () => {},
  updateCard: () => {},
  removeCard: () => {},
  toggleCardVisibility: () => sampleCards[0],
};

describe('AppfxCardContainerComponent', () => {
  let fixture: ComponentFixture<AppfxCardContainerComponent>;
  let component: AppfxCardContainerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, NoopAnimationsModule, ClrDropdownModule, DragDropModule, AppfxTranslateModule],
      declarations: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent],
      providers: [
        DragAndDropGroupService,
        { provide: PersistenceService, useValue: {} },
        { provide: Renderer2, useClass: MockRenderer2 },
      ],
    }).overrideProvider(ContainerService, { useValue: mockContainerService });

    fixture = TestBed.createComponent(AppfxCardContainerComponent);
    component = fixture.componentInstance;
    component.containerId = 'container-summary';
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should throw error when container id is missing', () => {
    try {
      component.ngOnInit();
    } catch (err) {
      expect(err).toMatch('Missing Input property - containerId');
    }
  });

  it('should insert card to container', fakeAsync(() => {
    const card = sampleCards[0];
    spyOn(component, 'insertCardToContainer' as any).and.returnValue({});
    spyOn(mockContainerService, 'addCard');
    component.cards.push(card);
    fixture.detectChanges();
    component.ngDoCheck();
    tick();

    expect((component as any).insertCardToContainer).toHaveBeenCalled();
  }));

  describe('#onToggleCardVisibility', () => {
    it('should remove card from container view when card is hidden', () => {
      const card = {
        ...sampleCards[0],
        hidden: true,
        id: 'card-1',
      };
      spyOn(mockContainerService, 'toggleCardVisibility').and.returnValue(card);
      spyOn(component, <never>'removeCardFromContainer').and.callThrough();

      component.onToggleCardVisibility('card-1');

      expect((component as any).removeCardFromContainer).toHaveBeenCalled();
    });

    it('should insert card from container view when card is not hidden', () => {
      const card = {
        ...sampleCards[0],
        hidden: false,
        id: 'card-1',
      };
      spyOn(mockContainerService, 'toggleCardVisibility').and.returnValue(card);
      spyOn(component, <never>'insertCardToContainer').and.callThrough();

      component.onToggleCardVisibility('card-1');

      expect((component as any).insertCardToContainer).toHaveBeenCalled();
    });
  });
});
