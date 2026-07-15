/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MockElementRef,
  MockRenderer2,
  SampleCardComponent,
  SampleCardWithoutFooterComponent,
  SampleCardWithoutHeaderComponent,
} from '@clr/addons/testing';

import { cardSize } from '../appfx-card-container-constants';
import { LayoutService } from './layout.service';

const getCardElements = (cardHtmlElement: HTMLElement) => {
  const cardElement = cardHtmlElement.querySelector('.card') as HTMLElement;
  const cardHeaderElement = cardHtmlElement.querySelector('.card-header') as HTMLElement;
  const cardBlockElement = cardHtmlElement.querySelector('.card-block') as HTMLElement;
  const cardFooterElement = cardHtmlElement.querySelector('.card-footer') as HTMLElement;
  return [cardElement, cardHeaderElement, cardBlockElement, cardFooterElement];
};

const calculateCardWidth = (unitWidth: number): number =>
  unitWidth * cardSize.unitWidthInPixels + (unitWidth - 1) * cardSize.unitGutterSizeInPixels;

const calculateCardHeight = (unitHeight: number): number =>
  unitHeight * cardSize.unitHeightInPixels + (unitHeight - 1) * cardSize.unitGutterSizeInPixels;

const overflowStyle = 'overflow-y';

describe('#LayoutService', () => {
  let layoutService: LayoutService;
  let fixture: ComponentFixture<SampleCardComponent>;
  let component: SampleCardComponent;
  let mockRenderer: Renderer2;
  let cardElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleCardComponent],
      providers: [
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: ElementRef, useClass: MockElementRef },
        LayoutService,
      ],
    });
    layoutService = TestBed.inject(LayoutService);
    mockRenderer = TestBed.inject(Renderer2);
    fixture = TestBed.createComponent(SampleCardComponent);
    component = fixture.componentInstance;
    cardElement = component.eleRef.nativeElement;
  });

  it('should create an instance', () => {
    expect(layoutService).toBeDefined();
  });

  describe('when all card-block, card-header and card-footer is present ', () => {
    it('then should set card size and scrolling properties accordingly  ', () => {
      const rendererSpy = spyOn(mockRenderer, 'setStyle').and.callThrough();

      //  1 unit width -> 258px
      //  5 unit height -> 58*5 + 18*4 -> 362px
      layoutService.updateCardSize(cardElement, 1, 5);

      expect(rendererSpy).toHaveBeenCalledTimes(5);
      const [cardEl, cardHeaderEl, cardBlockEl, cardFooterEl] = getCardElements(cardElement);

      expect(rendererSpy.calls.all()[0].args).toEqual([cardEl, 'width', `${calculateCardWidth(1)}px`]);
      expect(rendererSpy.calls.all()[1].args).toEqual([cardHeaderEl, 'height', `${cardSize.headerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[2].args).toEqual([cardFooterEl, 'height', `${cardSize.footerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[3].args).toEqual([
        cardBlockEl,
        'height',
        `${calculateCardHeight(5) - cardSize.headerHeightInPixels - cardSize.footerHeightInPixels}px`,
      ]);
      expect(rendererSpy.calls.all()[4].args).toEqual([cardBlockEl, overflowStyle, 'auto']);
    });

    it('then should set card size with adjusting gutter with and scrolling properties accordingly  ', () => {
      const rendererSpy = spyOn(mockRenderer, 'setStyle').and.callThrough();

      //  2 unit width -> 258*2 + 18 -> 534px
      //  5 unit height -> 58*5 + 18*4 -> 362px
      layoutService.updateCardSize(cardElement, 2, 5);

      expect(rendererSpy).toHaveBeenCalledTimes(5);
      const [cardEl, cardHeaderEl, cardBlockEl, cardFooterEl] = getCardElements(cardElement);

      expect(rendererSpy.calls.all()[0].args).toEqual([cardEl, 'width', `${calculateCardWidth(2)}px`]);
      expect(rendererSpy.calls.all()[1].args).toEqual([cardHeaderEl, 'height', `${cardSize.headerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[2].args).toEqual([cardFooterEl, 'height', `${cardSize.footerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[3].args).toEqual([
        cardBlockEl,
        'height',
        `${calculateCardHeight(5) - cardSize.headerHeightInPixels - cardSize.footerHeightInPixels}px`,
      ]);
      expect(rendererSpy.calls.all()[4].args).toEqual([cardBlockEl, overflowStyle, 'auto']);
    });

    it('then should remove card style width and height if -1 unitWidth and unitHeight are provided ', () => {
      spyOn(mockRenderer, 'setStyle').and.callThrough();
      const rendererSpy = spyOn(mockRenderer, 'removeStyle').and.callThrough();
      layoutService.updateCardSize(cardElement, -1, -1);

      expect(rendererSpy).toHaveBeenCalledTimes(2);
      const [cardEl, cardHeaderEl, cardBlockEl, cardFooterEl] = getCardElements(cardElement);
      expect(cardHeaderEl).toBeTruthy();
      expect(cardFooterEl).toBeTruthy();
      expect(rendererSpy.calls.all()[0].args).toEqual([cardEl, 'width']);
      expect(rendererSpy.calls.all()[1].args).toEqual([cardBlockEl, 'height']);
    });
  });
});

describe('#LayoutService SampleCardWithoutFooter', () => {
  let layoutService: LayoutService;
  let fixture: ComponentFixture<SampleCardWithoutFooterComponent>;
  let component: SampleCardWithoutFooterComponent;
  let mockRenderer: Renderer2;
  let cardElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleCardWithoutFooterComponent],
      providers: [
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: ElementRef, useClass: MockElementRef },
        LayoutService,
      ],
    });
    layoutService = TestBed.inject(LayoutService);
    mockRenderer = TestBed.inject(Renderer2);
    fixture = TestBed.createComponent(SampleCardWithoutFooterComponent);
    component = fixture.componentInstance;
    cardElement = component.eleRef.nativeElement;
  });

  describe('when only card-block and card-header is present', () => {
    it('then should set card block height accordingly and should add scroll to block', () => {
      const rendererSpy = spyOn(mockRenderer, 'setStyle').and.callThrough();

      //  1 unit width -> 258px
      //  5 unit height -> 58*5 + 18*4 -> 362px
      layoutService.updateCardSize(cardElement, 1, 5);

      expect(rendererSpy).toHaveBeenCalledTimes(4);
      const [cardEl, cardHeaderEl, cardBlockEl] = getCardElements(cardElement);

      expect(rendererSpy.calls.all()[0].args).toEqual([cardEl, 'width', `${calculateCardWidth(1)}px`]);
      expect(rendererSpy.calls.all()[1].args).toEqual([cardHeaderEl, 'height', `${cardSize.headerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[2].args).toEqual([
        cardBlockEl,
        'height',
        `${calculateCardHeight(5) - cardSize.headerHeightInPixels}px`,
      ]);
      expect(rendererSpy.calls.all()[3].args).toEqual([cardBlockEl, 'overflow-y', 'auto']);
    });
  });
});

describe('#LayoutService SampleCardWithoutHeader', () => {
  let layoutService: LayoutService;
  let fixture: ComponentFixture<SampleCardWithoutHeaderComponent>;
  let component: SampleCardWithoutHeaderComponent;
  let mockRenderer: Renderer2;
  let cardElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleCardWithoutHeaderComponent],
      providers: [
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: ElementRef, useClass: MockElementRef },
        LayoutService,
      ],
    });
    layoutService = TestBed.inject(LayoutService);
    mockRenderer = TestBed.inject(Renderer2);
    fixture = TestBed.createComponent(SampleCardWithoutHeaderComponent);
    component = fixture.componentInstance;
    cardElement = component.eleRef.nativeElement;
  });

  describe('when only card-block and card-footer is present', () => {
    it('then should set card block height accordingly and should add scroll to block', () => {
      const rendererSpy = spyOn(mockRenderer, 'setStyle').and.callThrough();

      //  1 unit width -> 258px
      //  5 unit height -> 58*5 + 18*4 -> 362px
      layoutService.updateCardSize(cardElement, 1, 5);

      expect(rendererSpy).toHaveBeenCalledTimes(3);
      const [cardEl, cardHeaderEl, cardBlockEl, cardFooterEl] = getCardElements(cardElement);

      expect(rendererSpy.calls.all()[0].args).toEqual([cardEl, 'width', `${calculateCardWidth(1)}px`]);
      expect(rendererSpy.calls.all()[1].args).toEqual([cardFooterEl, 'height', `${cardSize.footerHeightInPixels}px`]);
      expect(rendererSpy.calls.all()[2].args).toEqual([
        cardBlockEl,
        'height',
        `${calculateCardHeight(5) - cardSize.headerHeightInPixels}px`,
      ]);

      expect(cardHeaderEl).toBeNull();
    });
  });
});
