/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { a11ykeys } from '@clr/addons/a11y';
import { cardIdToOrder, MockContainerService, MockRenderer2, sampleCards } from '@clr/addons/testing';

import { A11yService } from './a11y.service';
import { ContainerService } from './container.service';

describe('#A11yService', () => {
  let a11yService: A11yService;
  let containerService: ContainerService;

  beforeEach(() => {
    TestBed.overrideProvider(ContainerService, { useValue: new MockContainerService() });

    TestBed.configureTestingModule({
      providers: [
        { provide: ContainerService, useClass: MockContainerService },
        { provide: Renderer2, useClass: MockRenderer2 },
        A11yService,
      ],
    });
    a11yService = TestBed.inject(A11yService);
    containerService = TestBed.inject(ContainerService);
  });

  it('should create an instance', () => {
    expect(a11yService).toBeDefined();
  });

  describe('when call selectCard', () => {
    it('then should not select card if card order is default one', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(a11yService, 'getOutOfA11yMode');
      // try to select card with default order
      a11yService.selectCard('cardWithDefaultOrder');
      // should not select default order card
      expect(a11yService.isSelected('cardWithDefaultOrder')).toBeFalsy();
      // drop element is same as use has not touch any arrow keys yet
      expect(a11yService.isDraggableOver('cardWithDefaultOrder')).toBeFalsy();
      // should call getCardOrder
      expect(containerService.getCardOrder).toHaveBeenCalledWith('cardWithDefaultOrder');
      // should not call get out of a11y mode
      expect(a11yService.getOutOfA11yMode).not.toHaveBeenCalled();
    });

    it('then should enter in a11y mode on first enter', () => {
      spyOn(containerService, 'getCardOrder').and.returnValue(2);
      spyOn(a11yService, 'getOutOfA11yMode');
      a11yService.selectCard(sampleCards[0].id);
      // current drag element order
      expect(a11yService.isSelected(sampleCards[0].id)).toBeTruthy();
      // drop element is same as use has not touch any arrow keys yet
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();
      // should not call get out of a11y mode
      expect(a11yService.getOutOfA11yMode).not.toHaveBeenCalled();
      // should not call get out of a11y mode
      expect(a11yService.getOutOfA11yMode).not.toHaveBeenCalled();
      // should call getCardOrder
      expect(containerService.getCardOrder).toHaveBeenCalledWith(sampleCards[0].id);
    });

    it('then should move card in a11y mode on second enter', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(containerService, 'moveCard').and.callThrough();
      spyOn(containerService, 'getVisibleCardsCount').and.returnValue(4);
      spyOn(a11yService, 'getOutOfA11yMode');

      // first select card with order 0
      a11yService.selectCard(sampleCards[0].id);
      // current drag element order
      expect(a11yService.isSelected(sampleCards[0].id)).toBeTruthy();
      // drop element is same as use has not touch any arrow keys yet
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();
      // should not call get out of a11y mode
      expect(a11yService.getOutOfA11yMode).not.toHaveBeenCalled();
      // should call getCardOrder
      expect(containerService.getCardOrder).toHaveBeenCalledWith(sampleCards[0].id);

      // set hit right arrow key to move card to position 1
      a11yService.moveDropPosition(a11ykeys.arrowRight);

      // drop element should be updated
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeFalsy();

      // hit enter again to drop element
      a11yService.selectCard(sampleCards[1].id);

      expect(containerService.moveCard).toHaveBeenCalledWith(0, 1);
      // should call getOutOfA11yMode
      expect(a11yService.getOutOfA11yMode).toHaveBeenCalled();
      // should call getCardOrder
      expect(containerService.getCardOrder).toHaveBeenCalledWith(sampleCards[1].id);
    });
  });

  describe('when call moveDropPosition', () => {
    it('with rightKey then should move drop element forward', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      // set total 3 cards in container
      spyOn(containerService, 'getVisibleCardsCount').and.returnValue(3);

      // first select card with order 0
      a11yService.selectCard(sampleCards[0].id);
      // current drag element order
      expect(a11yService.isSelected(sampleCards[0].id)).toBeTruthy();
      // drop element is same as use has not touch any arrow keys yet
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();

      // hit right arrow key to move card to position 1
      a11yService.moveDropPosition(a11ykeys.arrowRight);
      expect(a11yService.isDraggableOver(sampleCards[1].id)).toBeTruthy();

      // next hit on right arrow key to move card to position 2
      a11yService.moveDropPosition(a11ykeys.arrowRight);
      expect(a11yService.isDraggableOver(sampleCards[2].id)).toBeTruthy();

      // next hit on right arrow key to move card back to position 0 as its after last card
      a11yService.moveDropPosition(a11ykeys.arrowRight);
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();
    });

    it('with left ArrowKey then should move drop element forward', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      // set total 3 cards in container
      spyOn(containerService, 'getVisibleCardsCount').and.returnValue(3);

      // first select card with order 0
      a11yService.selectCard(sampleCards[0].id);
      // current drag element order
      expect(a11yService.isSelected(sampleCards[0].id)).toBeTruthy();
      // drop element is same as use has not touch any arrow keys yet
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();

      // hit left arrow key to move card to last position as 0 was first card and total 3 cards
      a11yService.moveDropPosition(a11ykeys.arrowLeft);
      expect(a11yService.isDraggableOver(sampleCards[2].id)).toBeTruthy();

      // next hit on left arrow key to move card to position 1
      a11yService.moveDropPosition(a11ykeys.arrowLeft);
      expect(a11yService.isDraggableOver(sampleCards[1].id)).toBeTruthy();

      // next hit on left arrow key to move card to position 0
      a11yService.moveDropPosition(a11ykeys.arrowLeft);
      expect(a11yService.isDraggableOver(sampleCards[0].id)).toBeTruthy();

      // hit left arrow key to move card to last position as 0 was fist card
      a11yService.moveDropPosition(a11ykeys.arrowLeft);
      expect(a11yService.isDraggableOver(sampleCards[2].id)).toBeTruthy();
    });

    it('with a11yMode false should not call getVisibleCardsCount', () => {
      spyOn(containerService, 'getVisibleCardsCount').and.returnValue(3);

      // set a11yMode false
      a11yService.getOutOfA11yMode();

      a11yService.moveDropPosition(a11ykeys.arrowLeft);

      expect(containerService.getVisibleCardsCount).not.toHaveBeenCalledWith();
    });
  });
});
