/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { a11ykeys, ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import {
  MockA11yService,
  MockDragDropService,
  MockLayoutService,
  SampleCardComponent,
  sampleCards,
  ZoomLevelServiceMock,
} from '@clr/addons/testing';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrIcon } from '@clr/angular/icon';

import { AppfxCardInternal } from '../appfx-card-container.interface';
import { AppfxCardComponent } from './appfx-card.component';
import { A11yService } from '../services/a11y.service';
import { DragDropService } from '../services/dnd.service';
import { LayoutService } from '../services/layout.service';

const sampleCardId = 'sample-card-1';

describe('AppfxCardComponent', () => {
  let fixture: ComponentFixture<AppfxCardComponent>;
  let component: AppfxCardComponent;
  let layoutService: LayoutService;
  let a11yService: A11yService;
  let dragDropService: DragDropService;
  let zoomLevelService: ZoomLevelService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClrIcon, NoopAnimationsModule, DragDropModule, AppfxTranslateModule],
      declarations: [AppfxCardComponent],
      providers: [
        DragAndDropGroupService,
        { provide: LayoutService, useClass: MockLayoutService },
        { provide: DragDropService, useClass: MockDragDropService },
        { provide: A11yService, useClass: MockA11yService },
        { provide: ZoomLevelService, useClass: ZoomLevelServiceMock },
      ],
    });
    fixture = TestBed.createComponent(AppfxCardComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    a11yService = TestBed.inject(A11yService);
    dragDropService = TestBed.inject(DragDropService);
    component.card = sampleCards[0];
    component.dropGroup = 'container-1';
    zoomLevelService = TestBed.inject(ZoomLevelService);
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should throw error when card id is missing', () => {
    component.card = {} as AppfxCardInternal;
    expect(() => {
      component.ngOnInit();
    }).toThrowError('Missing Input property for card - id');
  });

  it('should create component card when id and componentClass is present', () => {
    const cardViewContainer = (component as any).cardViewContainer;
    spyOn(cardViewContainer, 'createComponent').and.callThrough();

    component.card = {
      id: sampleCardId,
      componentClass: SampleCardComponent,
      context: {},
    } as unknown as AppfxCardInternal;
    component.ngOnInit();

    expect(cardViewContainer.createComponent).toHaveBeenCalledWith(SampleCardComponent);
  });

  it('should not create component card when id and componentClass is not present', () => {
    const cardViewContainer = (component as any).cardViewContainer;
    spyOn(cardViewContainer, 'createComponent').and.callThrough();

    component.card = { id: sampleCardId } as AppfxCardInternal;
    component.ngOnInit();

    expect(cardViewContainer.createComponent).not.toHaveBeenCalled();
  });

  it('when called isSelectedCard should call a11yService isSelectedCard', () => {
    spyOn(a11yService, 'isSelected').and.callThrough();
    const isSelected = component.isSelected;
    expect(isSelected).toBeFalsy();
    expect(a11yService.isSelected).toHaveBeenCalledWith(sampleCardId);
  });

  it('when called isDraggableOver should call a11yService isDraggableOver', () => {
    spyOn(a11yService, 'isDraggableOver').and.callThrough();
    const isDraggableOver = component.isDraggableOver;
    expect(isDraggableOver).toBeFalsy();
    expect(a11yService.isDraggableOver).toHaveBeenCalledWith(sampleCardId);
  });

  it('when called ngAfterViewInit should call layoutService updateCardSize to update card sizes', () => {
    spyOn(layoutService, 'updateCardSize').and.callThrough();
    component.ngAfterViewInit();
    expect(layoutService.updateCardSize).toHaveBeenCalled();
  });

  it('when zoom level is change and cardZoomSize is define the updateCardSize method of layoutService is called', () => {
    component.card = {
      id: sampleCardId,
      componentClass: SampleCardComponent,
      context: {},
      unitWidth: 1,
      unitHeight: 7,
      cardZoomSizes: {
        zoom2x: {
          unitWidth: 2,
          unitHeight: 5,
        },
      },
    } as unknown as AppfxCardInternal;
    component.ngOnInit();
    spyOn(layoutService, 'updateCardSize').and.callThrough();
    zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
    expect(layoutService.updateCardSize).toHaveBeenCalled();
  });

  it('when zoom level is change and cardZoomSize is not define the updateCardSize method of layoutService is not called', () => {
    component.card = {
      id: sampleCardId,
      componentClass: SampleCardComponent,
      context: {},
      unitWidth: 1,
      unitHeight: 7,
      cardZoomSizes: {
        zoom4x: {
          unitWidth: 1,
          unitHeight: 1,
        },
      },
    } as unknown as AppfxCardInternal;
    component.ngOnInit();
    spyOn(layoutService, 'updateCardSize').and.callThrough();
    zoomLevelService['resizeSubject'].next(ZoomLevel.x2);
    expect(layoutService.updateCardSize).not.toHaveBeenCalled();
  });

  it('when called onDragStart should call dragDropService onDragStart', () => {
    spyOn(dragDropService, 'onDragStart').and.callThrough();
    component.onDragStart();
    expect(dragDropService.onDragStart).toHaveBeenCalledWith(sampleCardId);
  });

  it('when called onDrop should call dragDropService onDragDrop', () => {
    spyOn(dragDropService, 'onDragDrop').and.callThrough();
    component.onDrop();
    expect(dragDropService.onDragDrop).toHaveBeenCalledWith(sampleCardId);
  });

  it('when called selectCard should call a11yService selectCard', () => {
    spyOn(a11yService, 'selectCard').and.callThrough();
    const keyEvent: any = document.createEvent('CustomEvent');
    keyEvent.key = a11ykeys.enter; // Enter Key
    keyEvent.initEvent('keyup', true, true);
    component.selectCard(keyEvent);
    expect(a11yService.selectCard).toHaveBeenCalledWith(sampleCardId);
  });

  it('when called moveDropPositionBackwards should call a11yService moveDropPosition', () => {
    spyOn(a11yService, 'moveDropPosition').and.callThrough();
    const keyEvent: any = document.createEvent('CustomEvent');
    keyEvent.key = a11ykeys.arrowLeft; // Enter Key
    keyEvent.initEvent('keyup', true, true);
    component.moveDropPositionBackwards(keyEvent);
    expect(a11yService.moveDropPosition).toHaveBeenCalledWith(a11ykeys.arrowLeft);
  });

  it('when called moveDropPositionForwards should call a11yService moveDropPosition', () => {
    spyOn(a11yService, 'moveDropPosition').and.callThrough();
    const keyEvent: any = document.createEvent('CustomEvent');
    keyEvent.key = a11ykeys.arrowRight; // Enter Key
    keyEvent.initEvent('keyup', true, true);
    component.moveDropPositionForwards(keyEvent);
    expect(a11yService.moveDropPosition).toHaveBeenCalledWith(a11ykeys.arrowRight);
  });

  it('when called onDropHandleKeyUp should call a11yService selectCard', () => {
    spyOn(a11yService, 'selectCard').and.callFake(() => {});
    const keyEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
    });
    component.onDropHandleKeyUp(keyEvent);
    expect(a11yService.selectCard).toHaveBeenCalled();
  });
});
