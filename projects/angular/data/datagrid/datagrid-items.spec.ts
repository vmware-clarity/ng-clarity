/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TrackByFunction, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TrackByIndexTest {
  @ViewChild(ClrDatagridItems) datagridItems: ClrDatagridItems<number>;

  numbers = [1, 2, 3, 4, 5];

  trackBy: TrackByFunction<number> = index => index;
}

describe('Datagrid', () => {
  describe('Components', () => {
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
          renderFixture(testContext.fixture);
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
          renderFixture(testContext.fixture);
          const updatedContent = testContext.fixture.elementRef.nativeElement.textContent;
          expect(updatedContent.trim()).toEqual('123456');
        });

        it('handles a null input for the array of items', () => {
          testContext.testComponent.numbers = null;
          renderFixture(testContext.fixture);
          expect(testContext.clarityDirective._rawItems).toEqual([]);
        });

        it('handles an undefined input for the array of items', () => {
          testContext.testComponent.numbers = undefined;
          renderFixture(testContext.fixture);
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
          renderFixture(testContext.fixture);
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.itemsProvider = TestBed.inject(Items);
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('smartens the Items provider back down when the *clrDgItems view is destroyed', () => {
          expect(testContext.itemsProvider.smart).toBe(true);

          testContext.testComponent.showItems = false;
          renderFixture(testContext.fixture);

          expect(testContext.itemsProvider.smart).toBe(false);
        });

        it('stops reacting to page changes once destroyed, instead of slicing stale data', () => {
          testContext.testComponent.showItems = false;
          renderFixture(testContext.fixture);

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
          renderFixture(testContext.fixture);
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
          renderFixture(testContext.fixture);
          expect(testContext.itemsProvider.displayed).toEqual([6, 2, 3, 4, 5]);
          testContext.testComponent.numbers = [];
          renderFixture(testContext.fixture);
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
          renderFixture(testContext.fixture);
          const unshiftedItem = testContext.fixture.nativeElement.querySelector('li');
          expect(testContext.itemsProvider.displayed).toEqual([42, 1, 2, 3, 4, 5]);
          expect(unshiftedItem.style.color).toBe('red');

          // Second mutation
          testContext.testComponent.numbers.unshift(42);
          renderFixture(testContext.fixture);

          // Resetting
          testContext.testComponent.numbers = [42];
          renderFixture(testContext.fixture);
          const replacedItem = testContext.fixture.nativeElement.querySelector('li');
          expect(replacedItem.style.color).toBe('red');
        });
      });
    });
  });
});
