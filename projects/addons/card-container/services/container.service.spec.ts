/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EmbeddedViewRef, Renderer2, ViewContainerRef, ViewRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MockCardContainerComponent,
  MockRenderer2,
  SampleCardComponent,
  sampleCardsSettings,
} from '@clr/addons/testing';
import { of } from 'rxjs';

import { AppfxCardInternal } from '../appfx-card-container.interface';
import { ContainerService } from './container.service';
import { PersistenceService } from './persistence.service';

enum CardIds {
  first = 'sample-card-1',
  second = 'sample-card-2',
  third = 'sample-card-3',
}

describe('#ContainerService', () => {
  let containerService: ContainerService;
  let persistenceService: PersistenceService;
  let fixture: ComponentFixture<MockCardContainerComponent>;
  let containerComponent: MockCardContainerComponent;
  let cardContainer: ViewContainerRef;
  let sampleContainerCards: AppfxCardInternal[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockCardContainerComponent],
      providers: [
        { provide: Renderer2, useClass: MockRenderer2 },
        {
          provide: PersistenceService,
          useValue: {
            initialize: () => {},
            retrieve: () => of([]),
            save: () => {},
          },
        },
        ContainerService,
      ],
    });
    containerService = TestBed.inject(ContainerService);
    persistenceService = TestBed.inject(PersistenceService);
    fixture = TestBed.createComponent(MockCardContainerComponent);
    containerComponent = fixture.componentInstance;
    cardContainer = containerComponent.cardContainer;
    sampleContainerCards = [
      {
        id: CardIds.first,
        title: 'Sample Card 1',
        componentClass: SampleCardComponent,
        hidden: false,
        order: 0,
        view: undefined as unknown as EmbeddedViewRef<void>,
      },
      {
        id: CardIds.second,
        title: 'Sample Card 2',
        componentClass: SampleCardComponent,
        hidden: false,
        canHide: false,
        order: 1,
        view: undefined as unknown as EmbeddedViewRef<void>,
      },
      {
        id: CardIds.third,
        title: 'Sample Card 3',
        componentClass: SampleCardComponent,
        hidden: false,
        canHide: false,
        order: 5,
        view: undefined as unknown as EmbeddedViewRef<void>,
      },
    ];
    containerService.initialize(cardContainer, sampleContainerCards);
  });

  it('should create an instance', () => {
    expect(containerService).toBeDefined();
  });

  it('when call getCardsWithOrder then should return cards with sorted order and by filtering hidden cards', (done: DoneFn) => {
    spyOn(persistenceService, 'retrieve').and.returnValue(of(sampleCardsSettings));
    const expectedCards = [sampleContainerCards[0], { ...sampleContainerCards[2], order: 1 }];
    containerService.getCardsWithOrder().subscribe((cards: AppfxCardInternal[]) => {
      expect(cards).toEqual(expectedCards);
      done();
    });
  });

  it('when call getCardWithOrder then should return card with order and hidden properties', (done: DoneFn) => {
    spyOn(persistenceService, 'retrieve').and.returnValue(of(sampleCardsSettings));
    const expectedCard = { ...sampleContainerCards[2], order: 5 };
    containerService.getCardWithOrder(sampleContainerCards[2]).subscribe((card: AppfxCardInternal) => {
      expect(card).toEqual(expectedCard);
      done();
    });
  });

  it('when call toggleCardVisibility then should return card with hidden property flipped', () => {
    spyOn(persistenceService, 'retrieve').and.returnValue(of(sampleCardsSettings));
    const expectedCard = { ...sampleContainerCards[2], order: 5, hidden: true };
    const card = containerService.toggleCardVisibility(CardIds.third);
    expect(card).toEqual(expectedCard);
  });

  describe('when call moveCard', () => {
    it('then should detach and attach card to move position', () => {
      spyOn(cardContainer, 'get').and.returnValue(<ViewRef>{});
      spyOn(cardContainer, 'detach').and.returnValue(<ViewRef>{});
      spyOn(cardContainer, 'insert').and.returnValue(<ViewRef>{});
      spyOn(containerService, 'updateCardsOrder').and.callThrough();
      containerService.moveCard(0, 1);
      expect(cardContainer.get).toHaveBeenCalledWith(0);
      expect(cardContainer.detach).toHaveBeenCalledWith(0);
      expect(cardContainer.insert).toHaveBeenCalledWith(<ViewRef>{}, 1);
    });

    it('then should not perform move operation if fromIndex === toIndex', () => {
      spyOn(cardContainer, 'get').and.returnValue(<ViewRef>{});
      spyOn(cardContainer, 'detach').and.returnValue(<ViewRef>{});
      spyOn(cardContainer, 'insert').and.returnValue(<ViewRef>{});
      spyOn(containerService, 'updateCardsOrder').and.callThrough();
      containerService.moveCard(0, 0);
      expect(cardContainer.get).not.toHaveBeenCalled();
      expect(cardContainer.detach).not.toHaveBeenCalled();
      expect(cardContainer.insert).not.toHaveBeenCalled();
    });
  });

  it('when call removeCard then should remove card from list', () => {
    const cards = containerService.getContainerCards();
    expect(cards.length).toEqual(3);
    expect(cards[0].id).toEqual(CardIds.first);
    expect(cards[1].id).toEqual(CardIds.second);
    expect(cards[2].id).toEqual(CardIds.third);
    containerService.removeCard(CardIds.second);
    const updatedCards = containerService.getContainerCards();
    expect(updatedCards.length).toEqual(2);
    expect(updatedCards[0].id).toEqual(CardIds.first);
    expect(updatedCards[1].id).toEqual(CardIds.third);
  });

  it('when call updateCard then should update specific card with new properties', () => {
    const cards = containerService.getContainerCards();
    expect(cards.length).toEqual(3);
    expect(cards[2].order).toEqual(5);
    const updatedCard = { ...cards[2], order: 99 };
    containerService.updateCard(updatedCard);
    const updatedCards = containerService.getContainerCards();
    expect(updatedCards.length).toEqual(3);
    expect(updatedCards[2].order).toEqual(99);
  });

  it('when call getVisibleCardsCount then should return visible cards', () => {
    const cards = containerService.getContainerCards();
    expect(cards.length).toEqual(3);
    expect(cards[0].hidden).toBeFalsy();
    expect(cards[1].hidden).toBeFalsy();
    expect(cards[2].hidden).toBeFalsy();
    const updatedCard = { ...cards[1], hidden: true };
    containerService.updateCard(updatedCard);
    const count = containerService.getVisibleCardsCount();
    expect(count).toEqual(2);
  });

  it('when call updateCardsOrder then should update card order and save in persistence service', () => {
    spyOn(persistenceService, 'save').and.callThrough();
    containerService.updateCardsOrder();
    const cards = containerService.getContainerCards();
    expect(persistenceService.save).toHaveBeenCalledWith(cards);
  });

  describe('when call addCard', () => {
    it('then should not add card if same card id already exist', () => {
      const cards = containerService.getContainerCards();
      expect(cards.length).toEqual(3);
      const expectedError = "Card with id 'sample-card-1' already exist";
      try {
        containerService.addCard(cards[0]);
      } catch (err) {
        expect(err).toMatch(expectedError);
        expect(cards.length).toEqual(3);
      }
    });

    it('then should add card if card id is different', () => {
      const cards = containerService.getContainerCards();
      expect(cards.length).toEqual(3);
      const newCard = { ...cards[0], id: 'new-card', title: 'New Card' };
      containerService.addCard(newCard);
      const newCards = containerService.getContainerCards();
      expect(newCards.length).toEqual(4);
    });
  });
});
