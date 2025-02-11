/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrPopoverEventsService } from '../../utils/popover/providers/popover-events.service';
import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrComboboxModule } from './combobox.module';
import { ClrOptionItems } from './option-items.directive';
import { OptionSelectionService } from './providers/option-selection.service';

@Component({
  template: `
    <ul>
      <li *clrOptionItems="let n of numbers; trackBy: trackBy">{{ n }}</li>
    </ul>
  `,
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
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
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
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
  providers: [ClrPopoverEventsService, ClrPopoverPositionService],
})
class ObjectDataTest {
  @ViewChild(ClrOptionItems) optionItems: ClrOptionItems<number>;
  numbers = [{ a: 0 }, { a: 1 }, { a: 2 }, { a: 3 }];
  trackBy: TrackByFunction<number> = index => index;
}

const OPTION_ITEM_PROVIDERS = [OptionSelectionService, ClrPopoverToggleService];

export default function (): void {
  describe('ClrOptionItems directive', function () {
    describe('correctly initializes', () => {
      beforeEach(function () {
        TestBed.configureTestingModule({
          imports: [ClrComboboxModule],
          declarations: [FullTest],
          providers: OPTION_ITEM_PROVIDERS,
        });
        this.fixture = TestBed.createComponent(FullTest);
        this.fixture.detectChanges();
        this.testComponent = this.fixture.componentInstance;
        this.clarityDirective = this.testComponent.optionItems;
      });

      afterEach(function () {
        this.fixture.destroy();
      });

      it('can handle changes', function () {
        const initialContent = this.fixture.elementRef.nativeElement.textContent;
        expect(initialContent.trim()).toEqual('0123');
        this.testComponent.numbers.push(6);
        this.fixture.detectChanges();
        const updatedContent = this.fixture.elementRef.nativeElement.textContent;

        expect(updatedContent.trim()).toEqual('01236');
      });

      it('handles a null input for the array of items', function () {
        this.testComponent.numbers = null;
        this.fixture.detectChanges();
        expect(this.clarityDirective._rawItems).toEqual([]);
      });

      it('handles an undefined input for the array of items', function () {
        this.testComponent.numbers = undefined;
        this.fixture.detectChanges();
        expect(this.clarityDirective._rawItems).toEqual([]);
      });

      it('will not filter on first open', function () {
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3]);
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        this.testComponent.numbers.push(12);
        optionService.currentInput = '1';
        this.fixture.detectChanges();
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3, 12]);
      });

      it('can filter out items based on the option service currentInput field', function () {
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual([0, 1, 2, 3]);
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        optionService.showAllOptions = false;
        this.testComponent.numbers.push(12);
        optionService.currentInput = '1';
        this.fixture.detectChanges();
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual([1, 12]);
      });

      it('has case-insensitive filter', function () {
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        optionService.showAllOptions = false;
        this.testComponent.numbers.push('Room', 'Broom');
        optionService.currentInput = 'ro';
        this.fixture.detectChanges();
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual(['Room', 'Broom']);
      });

      it('has diacritic-insensitive filter', function () {
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        optionService.showAllOptions = false;
        this.testComponent.numbers.push('Ardèche', 'Ardennes', 'Ariège');
        optionService.currentInput = 'arde';
        this.fixture.detectChanges();
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual(['Ardèche', 'Ardennes']);
      });
    });

    describe('handles arrays of simple data correctly', () => {
      beforeEach(function () {
        TestBed.configureTestingModule({
          imports: [ClrComboboxModule],
          declarations: [TrackByIndexTest],
          providers: OPTION_ITEM_PROVIDERS,
        });
        this.fixture = TestBed.createComponent(TrackByIndexTest);
        this.fixture.detectChanges();
        this.testComponent = this.fixture.componentInstance;
        this.clarityDirective = this.fixture.componentInstance.optionItems;
      });

      afterEach(function () {
        this.fixture.destroy();
      });

      it('receives an input for the trackBy option', function () {
        expect(this.clarityDirective.iterableProxy.ngForTrackBy).toBe(this.testComponent.trackBy);
      });

      it('correctly mutates and resets an array with trackBy', function () {
        // Initial state
        this.fixture.nativeElement.querySelectorAll('li:first-child').forEach(li => (li.style.color = 'red'));
        const firstItem = this.fixture.nativeElement.querySelector('li');
        expect(firstItem.style.color).toBe('red');
        expect(firstItem.textContent.trim()).toBe('0');

        // First mutation
        this.testComponent.numbers.unshift(42);
        this.fixture.detectChanges();
        const unshiftedItem = this.fixture.nativeElement.querySelector('li');
        expect(this.clarityDirective._rawItems).toEqual([42, 0, 1, 2, 3]);
        expect(unshiftedItem.style.color).toBe('red');

        // Resetting
        this.testComponent.numbers = [42];
        this.fixture.detectChanges();
        const replacedItem = this.fixture.nativeElement.querySelector('li');
        expect(replacedItem.style.color).toBe('red');
      });
    });

    describe('handles object arrays correctly', () => {
      beforeEach(function () {
        TestBed.configureTestingModule({
          imports: [ClrComboboxModule],
          declarations: [ObjectDataTest],
          providers: OPTION_ITEM_PROVIDERS,
        });
        this.fixture = TestBed.createComponent(ObjectDataTest);
        this.fixture.detectChanges();
        this.testComponent = this.fixture.componentInstance;
        this.clarityDirective = this.fixture.componentInstance.optionItems;
      });

      afterEach(function () {
        this.fixture.destroy();
      });

      it('generates content', function () {
        const initialContent = this.fixture.elementRef.nativeElement.textContent;
        expect(initialContent.trim()).toEqual('0123');
      });

      it('sets display field', function () {
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        expect(this.clarityDirective._filterField).toEqual('a');
        expect(optionService.displayField).toEqual('a');
      });

      it('handles null values', function () {
        expect(() => {
          this.testComponent.numbers = [{ a: null }, ...this.testComponent.numbers];
          this.fixture.detectChanges();
        }).not.toThrow();
      });

      it('has case-insensitive filter', function () {
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        optionService.showAllOptions = false;
        this.testComponent.numbers.push({ a: 'Room' }, { a: 'Broom' });
        optionService.currentInput = 'ro';
        this.fixture.detectChanges();
        expect(this.clarityDirective.iterableProxy._ngForOf).toEqual([{ a: 'Room' }, { a: 'Broom' }]);
      });

      it('has diacritic-insensitive filter', function () {
        const optionService: OptionSelectionService<any> = TestBed.get(OptionSelectionService);
        optionService.showAllOptions = false;
        this.testComponent.numbers.push({ a: 'Ardèche' }, { a: 'Ardennes' }, { a: 'Ariège' });
        optionService.currentInput = 'arde';
        this.fixture.detectChanges();
        expect(this.clarityDirective.filteredItems).toEqual([{ a: 'Ardèche' }, { a: 'Ardennes' }]);
      });
    });
  });
}
