/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, TrackByFunction, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridModule } from './datagrid.module';
import { FiltersProvider } from './providers/filters';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';

@Component({
  template: `
    <ul>
      <li *clrDgItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  standalone: false,
})
class FullTest {
  @ViewChild(ClrDatagridItems) datagridItems: ClrDatagridItems<number>;

  numbers = [1, 2, 3, 4, 5];

  trackBy: (index: number, item: number) => any;
}

@Component({
  template: `
    <ul *ngIf="showItems">
      <li *clrDgItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  standalone: false,
})
class DestroyTest {
  numbers = [1, 2, 3, 4, 5];

  trackBy: (index: number, item: number) => any;

  showItems = true;
}

@Component({
  template: `
    <ul>
      <li *clrDgItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  standalone: false,
})
class TrackByIndexTest {
  @ViewChild(ClrDatagridItems) datagridItems: ClrDatagridItems<number>;

  numbers = [1, 2, 3, 4, 5];

  trackBy: TrackByFunction<number> = index => index;
}

export default function (): void {
  describe('ClrDatagridItems directive', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    describe('correctly initializes', () => {
      beforeEach(() => {
        /*
         * Since the ClrDatagridItems element is a template that isn't rendered in the DOM,
         * we can't use our usual shortcut, we need to rely on @ViewChild
         */
        TestBed.configureTestingModule({
          imports: [ClrDatagridModule],
          declarations: [FullTest],
          providers: [Items, FiltersProvider, Sort, Page, StateDebouncer],
        });
        testContext.fixture = TestBed.createComponent(FullTest);
        testContext.fixture.detectChanges();
        testContext.testComponent = testContext.fixture.componentInstance;
        testContext.clarityDirective = testContext.fixture.componentInstance.datagridItems;
        testContext.itemsProvider = TestBed.inject(Items);
      });

      afterEach(() => {
        testContext.fixture.destroy();
      });

      it('makes the Items provider smart', () => {
        expect(testContext.itemsProvider.smart).toBe(true);
      });

      it('receives an input for the array of items', () => {
        expect(testContext.itemsProvider.displayed).toEqual([1, 2, 3, 4, 5]);
      });

      it('subscribes to changes in the datagrid Items (_items)', () => {
        const initialContent = testContext.fixture.elementRef.nativeElement.textContent;
        expect(initialContent.trim()).toEqual('12345');
        testContext.testComponent.numbers.push(6);
        testContext.fixture.detectChanges();
        const updatedContent = testContext.fixture.elementRef.nativeElement.textContent;
        expect(updatedContent.trim()).toEqual('123456');
      });

      it('handles a null input for the array of items', () => {
        testContext.testComponent.numbers = null;
        testContext.fixture.detectChanges();
        expect(testContext.clarityDirective._rawItems).toEqual([]);
      });

      it('handles an undefined input for the array of items', () => {
        testContext.testComponent.numbers = undefined;
        testContext.fixture.detectChanges();
        expect(testContext.clarityDirective._rawItems).toEqual([]);
      });
    });

    describe('cleans up on destroy', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [CommonModule, ClrDatagridModule],
          declarations: [DestroyTest],
          providers: [Items, FiltersProvider, Sort, Page, StateDebouncer],
        });
        testContext.fixture = TestBed.createComponent(DestroyTest);
        testContext.fixture.detectChanges();
        testContext.testComponent = testContext.fixture.componentInstance;
        testContext.itemsProvider = TestBed.inject(Items);
      });

      afterEach(() => {
        testContext.fixture.destroy();
      });

      it('smartens the Items provider back down when the *clrDgItems view is destroyed', () => {
        expect(testContext.itemsProvider.smart).toBe(true);

        testContext.testComponent.showItems = false;
        testContext.fixture.detectChanges();

        expect(testContext.itemsProvider.smart).toBe(false);
      });

      it('stops reacting to page changes once destroyed, instead of slicing stale data', () => {
        testContext.testComponent.showItems = false;
        testContext.fixture.detectChanges();

        const page: Page = TestBed.inject(Page);
        page.size = 2;
        page.current = 2;

        // With the provider no longer smart, page changes must not touch `displayed`.
        expect(testContext.itemsProvider.displayed).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('handles Item arrays correctly', () => {
      beforeEach(() => {
        /*
         * Since the ClrDatagridItems element is a template that isn't rendered in the DOM,
         * we can't use our usual shortcut, we need to rely on @ViewChild
         */
        TestBed.configureTestingModule({
          imports: [ClrDatagridModule],
          declarations: [TrackByIndexTest],
          providers: [Items, FiltersProvider, Sort, Page, StateDebouncer],
        });
        testContext.fixture = TestBed.createComponent(TrackByIndexTest);
        testContext.fixture.detectChanges();
        testContext.testComponent = testContext.fixture.componentInstance;
        testContext.clarityDirective = testContext.fixture.componentInstance.datagridItems;
        testContext.itemsProvider = TestBed.inject(Items);
      });

      afterEach(() => {
        testContext.fixture.destroy();
      });

      it('keeps the Items provider up to date with array changes', () => {
        expect(testContext.itemsProvider.displayed).toEqual([1, 2, 3, 4, 5]);
        testContext.testComponent.numbers[0] = 6;
        testContext.fixture.detectChanges();
        expect(testContext.itemsProvider.displayed).toEqual([6, 2, 3, 4, 5]);
        testContext.testComponent.numbers = [];
        testContext.fixture.detectChanges();
        expect(testContext.itemsProvider.displayed).toEqual([]);
      });

      it('receives an input for the trackBy option', () => {
        expect(testContext.clarityDirective.iterableProxy.ngForTrackBy).toBe(testContext.testComponent.trackBy);
      });

      it('correctly mutates and resets an array with trackBy', () => {
        // Initial state
        testContext.fixture.nativeElement.querySelectorAll('li:first-child').forEach(li => (li.style.color = 'red'));
        const firstItem = testContext.fixture.nativeElement.querySelector('li');
        expect(firstItem.style.color).toBe('red');
        expect(firstItem.textContent.trim()).toBe('1');

        // First mutation
        testContext.testComponent.numbers.unshift(42);
        testContext.fixture.detectChanges();
        const unshiftedItem = testContext.fixture.nativeElement.querySelector('li');
        expect(testContext.itemsProvider.displayed).toEqual([42, 1, 2, 3, 4, 5]);
        expect(unshiftedItem.style.color).toBe('red');

        // Second mutation
        testContext.testComponent.numbers.unshift(42);
        testContext.fixture.detectChanges();

        // Resetting
        testContext.testComponent.numbers = [42];
        testContext.fixture.detectChanges();
        const replacedItem = testContext.fixture.nativeElement.querySelector('li');
        expect(replacedItem.style.color).toBe('red');
      });
    });
  });
}
