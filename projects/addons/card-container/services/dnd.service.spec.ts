/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  cardIdToOrder,
  MockCardContainerComponent,
  MockContainerService,
  MockRenderer2,
  sampleCards,
} from '@clr/addons/testing';

import { ContainerService } from './container.service';
import { DragDropService } from './dnd.service';

describe('#DragDropService', () => {
  let dragDropService: DragDropService;
  let containerService: ContainerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockCardContainerComponent],
      providers: [
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: ContainerService, useClass: MockContainerService },
        DragDropService,
      ],
    });
    dragDropService = TestBed.inject(DragDropService);
    containerService = TestBed.inject(ContainerService);
  });

  it('should create an instance', () => {
    expect(dragDropService).toBeDefined();
  });

  describe('when call onDragStart', () => {
    it(' with default order then should not set dragOrder order', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(containerService, 'moveCard');
      dragDropService.onDragStart('cardWithDefaultOrder');
      dragDropService.onDragDrop(sampleCards[1].id);
      expect(containerService.moveCard).toHaveBeenCalledWith(undefined as any, 1);
      expect(containerService.getCardOrder).toHaveBeenCalled();
    });

    it(' with order then should set dragOrder order', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(containerService, 'moveCard');
      dragDropService.onDragStart(sampleCards[0].id);
      dragDropService.onDragDrop(sampleCards[1].id);
      expect(containerService.moveCard).toHaveBeenCalledWith(0, 1);
      expect(containerService.getCardOrder).toHaveBeenCalled();
    });
  });

  describe('when call onDragDrop', () => {
    it(' with default order then should not move card', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(containerService, 'moveCard');
      dragDropService.onDragDrop('cardWithDefaultOrder');
      expect(containerService.moveCard).not.toHaveBeenCalled();
      expect(containerService.getCardOrder).toHaveBeenCalled();
    });

    it(' with order then should move card', () => {
      spyOn(containerService, 'getCardOrder').and.callFake((id: string) => cardIdToOrder[id]);
      spyOn(containerService, 'moveCard');
      dragDropService.onDragStart(sampleCards[1].id);
      dragDropService.onDragDrop(sampleCards[2].id);
      expect(containerService.moveCard).toHaveBeenCalledWith(1, 2);
      expect(containerService.getCardOrder).toHaveBeenCalled();
    });
  });
});
