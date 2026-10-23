/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrPopoverService } from '@clr/angular/popover/common';

import { ClrComboboxModule } from './combobox.module';
import { ClrOptionItems } from './option-items.directive';
import { OptionSelectionService } from './providers/option-selection.service';

@Component({
  template: `
    <ul>
      <li *clrOptionItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class FullTest {
  @ViewChild(ClrOptionItems) optionItems: ClrOptionItems<number>;
  numbers = [0, 1, 2, 3];
  trackBy: TrackByFunction<number>;
}

@Component({
  template: `
    <ul>
      <li *clrOptionItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class TrackByIndexTest {
  @ViewChild(ClrOptionItems) optionItems: ClrOptionItems<number>;
  numbers = [0, 1, 2, 3];
  trackBy: TrackByFunction<number> = index => index;
}

@Component({
  template: `
    <ul>
      <li *clrOptionItems="let n of numbers; field: 'a'">{{ n.a }}</li>
    </ul>
  `,
  providers: [ClrPopoverService],
  standalone: false,
})
class ObjectDataTest {
  @ViewChild(ClrOptionItems) optionItems: ClrOptionItems<number>;
  numbers = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }];
  trackBy: TrackByFunction<number> = index => index;
}

const OPTION_ITEM_PROVIDERS = [OptionSelectionService, ClrPopoverService];

describe('Combobox component', () => {
  describe('Directives', () => {
    describe('ClrOptionItems directive', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('correctly initializes', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrComboboxModule],
            declarations: [FullTest],
            providers: OPTION_ITEM_PROVIDERS,
          });
          testContext.fixture = TestBed.createComponent(FullTest);
          testContext.fixture.detectChanges();
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.clarityDirective = testContext.testComponent.optionItems;
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('can handle changes', () => {
          const initialContent = testContext.fixture.elementRef.nativeElement.textContent;
          expect(initialContent.trim()).toEqual('0123');
          testContext.testComponent.numbers.push(6);
          testContext.fixture.detectChanges();
          const updatedContent = testContext.fixture.elementRef.nativeElement.textContent;

          expect(updatedContent.trim()).toEqual('01236');
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

        it('will not filter on first open', () => {
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3]);
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          testContext.testComponent.numbers.push(12);
          optionService.currentInput = '1';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3, 12]);
        });

        it('can filter out items based on the option service currentInput field', () => {
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3]);
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          optionService.showAllOptions = false;
          testContext.testComponent.numbers.push(12);
          optionService.currentInput = '1';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual([1, 12]);
        });

        it('has case-insensitive filter', () => {
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          optionService.showAllOptions = false;
          testContext.testComponent.numbers.push('Room', 'Broom');
          optionService.currentInput = 'ro';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual(['Room', 'Broom']);
        });

        it('has diacritic-insensitive filter', () => {
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          optionService.showAllOptions = false;
          testContext.testComponent.numbers.push('Ardèche', 'Ardennes', 'Ariège');
          optionService.currentInput = 'arde';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual(['Ardèche', 'Ardennes']);
        });
      });

      describe('handles arrays of simple data correctly', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrComboboxModule],
            declarations: [TrackByIndexTest],
            providers: OPTION_ITEM_PROVIDERS,
          });
          testContext.fixture = TestBed.createComponent(TrackByIndexTest);
          testContext.fixture.detectChanges();
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.clarityDirective = testContext.fixture.componentInstance.optionItems;
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('receives an input for the trackBy option', () => {
          expect(testContext.clarityDirective.iterableProxy.ngForTrackBy).toBe(testContext.testComponent.trackBy);
        });

        it('correctly mutates and resets an array with trackBy', () => {
          // Initial state
          testContext.fixture.nativeElement.querySelectorAll('li:first-child').forEach(li => (li.style.color = 'red'));
          const firstItem = testContext.fixture.nativeElement.querySelector('li');
          expect(firstItem.style.color).toBe('red');
          expect(firstItem.textContent.trim()).toBe('0');

          // First mutation
          testContext.testComponent.numbers.unshift(42);
          testContext.fixture.detectChanges();
          const unshiftedItem = testContext.fixture.nativeElement.querySelector('li');
          expect(testContext.clarityDirective._rawItems).toEqual([42, 0, 1, 2, 3]);
          expect(unshiftedItem.style.color).toBe('red');

          // Resetting
          testContext.testComponent.numbers = [42];
          testContext.fixture.detectChanges();
          const replacedItem = testContext.fixture.nativeElement.querySelector('li');
          expect(replacedItem.style.color).toBe('red');
        });
      });

      describe('handles object arrays correctly', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [ClrComboboxModule],
            declarations: [ObjectDataTest],
            providers: OPTION_ITEM_PROVIDERS,
          });
          testContext.fixture = TestBed.createComponent(ObjectDataTest);
          testContext.fixture.detectChanges();
          testContext.testComponent = testContext.fixture.componentInstance;
          testContext.clarityDirective = testContext.fixture.componentInstance.optionItems;
        });

        afterEach(() => {
          testContext.fixture.destroy();
        });

        it('generates content', () => {
          const initialContent = testContext.fixture.elementRef.nativeElement.textContent;
          expect(initialContent.trim()).toEqual('0123');
        });

        it('sets display field', () => {
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          expect(testContext.clarityDirective._filterField).toEqual('a');
          expect(optionService.displayField).toEqual('a');
        });

        it('handles null values', () => {
          expect(() => {
            testContext.testComponent.numbers = [{ a: null }, ...testContext.testComponent.numbers];
            testContext.fixture.detectChanges();
          }).not.toThrow();
        });

        it('has case-insensitive filter', () => {
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          optionService.showAllOptions = false;
          testContext.testComponent.numbers.push({ a: 'Room' }, { a: 'Broom' });
          optionService.currentInput = 'ro';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.iterableProxy._ngForOf).toEqual([{ a: 'Room' }, { a: 'Broom' }]);
        });

        it('has diacritic-insensitive filter', () => {
          const optionService: OptionSelectionService<any> = TestBed.inject(OptionSelectionService);
          optionService.showAllOptions = false;
          testContext.testComponent.numbers.push({ a: 'Ardèche' }, { a: 'Ardennes' }, { a: 'Ariège' });
          optionService.currentInput = 'arde';
          testContext.fixture.detectChanges();
          expect(testContext.clarityDirective.filteredItems).toEqual([{ a: 'Ardèche' }, { a: 'Ardennes' }]);
        });
      });
    });
  });
});
