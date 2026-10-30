/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import type { Mock } from 'vitest';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { EnumFilterComponent } from './enum-filter.component';
import { FilterFormComponent } from './filter-form.component';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { EnumPropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';

// --- Test Data Helpers ---
const property = 'vmStatus';
const propertyDisplayName = 'Status';
const smallValues = { red: 'Alert', green: 'Normal', blue: 'Info' };

const enumPropertySmall: EnumPropertyDefinition = new EnumPropertyDefinition(
  property,
  propertyDisplayName,
  new Map(Object.entries(smallValues)),
  false, // singleSelect
  true, // searchable
  true, // enableSelectAll
  true // allowNotInOperator (triggers additionalOperators getter)
);

const singleSelectEnumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
  property,
  propertyDisplayName,
  new Map(Object.entries(smallValues)),
  true
);

// Helper to generate large datasets for async/pagination testing
const generateLargeMap = (count: number): Map<string, string> => {
  const map = new Map<string, string>();
  for (let i = 0; i < count; i++) {
    map.set(`key${i}`, `Value${i}`);
  }
  return map;
};

const enumPropertyLarge: EnumPropertyDefinition = new EnumPropertyDefinition(
  property,
  propertyDisplayName,
  generateLargeMap(150) // 150 items to exceed maxInitiallyShownItems (50)
);

const predicateRed = new PropertyPredicate();
predicateRed.filterableProperty = enumPropertySmall;
predicateRed.operator = ComparisonOperator.Equals;
predicateRed.value = 'red';

const propertyFilter: PropertyFilter = new PropertyFilter();
propertyFilter.criteria = [predicateRed];
propertyFilter.operator = LogicalOperator.Or;

describe('EnumFilterComponent', () => {
  let component: EnumFilterComponent;
  let fixture: ComponentFixture<EnumFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrRadioModule,
        ClrSelectModule,
        ClrInputModule,
        ClrIcon,
        ClrSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [EnumFilterComponent, FilterFormComponent],
      providers: [DatagridFiltersStrings],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumFilterComponent);
    component = fixture.componentInstance;
    // Default setup
    fixture.componentRef.setInput('filterProperty', enumPropertySmall);
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Initialization (Small Data)', () => {
    it('should initialize correctly with default values', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50); // Allow initial async load
      fixture.detectChanges();

      expect(component.optionsData.length).toBe(3);
      expect(component.filteredOptions.length).toBe(3);
      expect(component.enumFilterForm).toBeDefined();
      expect(component.enumFilterForm.get('enumOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
      expect(component.additionalOperators).toBe(true); // Because allowNotInOperator is true
    });

    it('should initialize in Edit Mode (pre-selected values)', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('propertyFilter', propertyFilter);
      // Input changes are delivered through Angular.
      await vi.advanceTimersByTimeAsync(50);
      fixture.detectChanges();

      const redControl = component.optionsFormArray.controls[0]; // red
      const greenControl = component.optionsFormArray.controls[1]; // green

      expect(redControl.value).toBe(true);
      expect(greenControl.value).toBe(false);
      // Operator sync check
      expect(component.enumFilterForm.get('enumOperator')?.value).toBe(ComparisonOperator.Equals);
    });

    it('should sync "DoesNotEqual" operator correctly from PropertyFilter', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      const filterAnd = new PropertyFilter();
      filterAnd.criteria = [predicateRed];
      filterAnd.operator = LogicalOperator.And; // Implies DoesNotEqual

      fixture.componentRef.setInput('propertyFilter', filterAnd);
      await fixture.whenStable();

      await vi.advanceTimersByTimeAsync(50);

      expect(component.enumFilterForm?.get('enumOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
    });
  });

  describe('Async Loading & Large Data', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('filterProperty', enumPropertyLarge);
    });

    it('should handle large datasets by showing loading indicator and splicing results', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      await fixture.whenStable();
      expect(component.isProcessing).toBe(false);
      // Should only show maxInitiallyShownItems (50)
      expect(component.filteredOptions.length).toBe(50);
      // But total searchable length is 150
      expect(component.searchResultsLen).toBe(150);
    });

    it('should load more items when loadMore() is called', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);

      expect(component.filteredOptions.length).toBe(50);

      component.loadMore();
      expect(component.isProcessing).toBe(true);

      await vi.advanceTimersByTimeAsync(50); // Wait for loadMore async

      // 50 + 100 step
      expect(component.filteredOptions.length).toBe(150);
      expect(component.isProcessing).toBe(false);
    });
  });

  describe('Search Logic', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('filterProperty', enumPropertySmall); // red, green, blue
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);
    });

    function enterSearch(term: string) {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="searchTerm"]');
      input.value = term;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    it('should filter options by value (case insensitive)', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      enterSearch('alert');

      await vi.advanceTimersByTimeAsync(200); // Debounce
      await vi.advanceTimersByTimeAsync(50); // Async search execution

      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0].data.value).toBe('Alert');
    });

    it('should filter options by key', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      enterSearch('gree'); // matches 'green'

      await vi.advanceTimersByTimeAsync(200);
      await vi.advanceTimersByTimeAsync(50);

      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0].data.key).toBe('green');
    });

    it('should clear search and restore full list', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      enterSearch('alert');
      await vi.advanceTimersByTimeAsync(250);
      expect(component.filteredOptions.length).toBe(1);

      const clearSearch: HTMLElement = fixture.nativeElement.querySelector('cds-icon[clrInputSuffix]');
      clearSearch.click();
      await vi.advanceTimersByTimeAsync(250); // Value change logic triggers again

      expect(component.enumFilterForm.get('searchTerm')?.value).toBe('');
      expect(component.filteredOptions.length).toBe(3);
    });
  });

  describe('Interaction: Search + Selection', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('filterProperty', enumPropertySmall);
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);
    });

    it('Select All should only select filtered (visible) options', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // 1. Search for "Alert" (red)
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="searchTerm"]');
      input.value = 'Alert';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(250);
      expect(component.filteredOptions.length).toBe(1);

      // 2. Click Select All
      const selectAll: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="selectAll"]');
      selectAll.click();
      await vi.advanceTimersByTimeAsync(50);

      // 3. Assert "red" is selected, "green/blue" are NOT
      // red is index 0, green is 1, blue is 2
      expect(component.optionsFormArray.at(0).value).toBe(true);
      expect(component.optionsFormArray.at(1).value).toBe(false);
      expect(component.optionsFormArray.at(2).value).toBe(false);
    });

    it('should update "selectedCount" correctly when individual options change', () => {
      // Select 1 item
      component.optionsFormArray.at(0).setValue(true);
      component.onOptionChange();
      expect(component.selectedCount).toBe(1);

      // Select another
      component.optionsFormArray.at(1).setValue(true);
      component.onOptionChange();
      expect(component.selectedCount).toBe(2);
    });

    it('should toggle "Select All" checkbox state based on individual selections', () => {
      // Select all manually
      component.optionsFormArray.controls.forEach(c => c.setValue(true));
      component.onOptionChange();
      expect(component.enumFilterForm.get('selectAll')?.value).toBe(true);

      // Deselect one
      component.optionsFormArray.at(0).setValue(false);
      component.onOptionChange();
      expect(component.enumFilterForm.get('selectAll')?.value).toBe(false);
    });
  });

  describe('Operators & Validation', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('filterProperty', enumPropertySmall);
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);
    });

    it('should update filter criteria operator when form operator changes', () => {
      vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      const opControl = component.enumFilterForm.get('enumOperator');

      // Change to DoesNotEqual and verify via emitted filter
      opControl?.setValue(ComparisonOperator.DoesNotEqual);
      component.optionsFormArray.at(0).setValue(true);
      component.onOptionChange();
      component.onApplyButtonClick();
      const emittedAnd = vi.mocked(component.filterCriteriaChange.emit as Mock).mock.lastCall[0] as PropertyFilter;
      expect(emittedAnd.operator).toBe(LogicalOperator.And);

      // Change back to Equals
      opControl?.setValue(ComparisonOperator.Equals);
      component.onApplyButtonClick();
      const emittedOr = vi.mocked(component.filterCriteriaChange.emit as Mock).mock.lastCall[0] as PropertyFilter;
      expect(emittedOr.operator).toBe(LogicalOperator.Or);
    });

    it('should validate form: invalid if nothing selected (multiselect)', () => {
      // Deselect all
      component.optionsFormArray.controls.forEach(c => c.setValue(false));
      component.onOptionChange(); // updates validation

      expect(component.enumFilterForm.valid).toBe(false);

      // Select one
      component.optionsFormArray.at(0).setValue(true);
      component.onOptionChange();
      expect(component.enumFilterForm.valid).toBe(true);
    });
  });

  describe('Single Select Mode', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('filterProperty', singleSelectEnumProperty);
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);
    });

    it('should create valid form without requiring array selection', () => {
      // Single select uses 'singleSelectOption' control, not the array checkboxes
      expect(component.enumFilterForm.valid).toBe(true);
    });

    it('onApply should emit correct single value criteria', () => {
      vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

      component.enumFilterForm.get('singleSelectOption')?.setValue('green');
      component.onApplyButtonClick();

      const emitSpy = component.filterCriteriaChange.emit as Mock;
      const emittedCriteria = vi.mocked(emitSpy).mock.lastCall[0] as PropertyFilter;
      expect(emittedCriteria.criteria.length).toBe(1);
      expect(emittedCriteria.criteria[0].value).toBe('green');
    });
  });

  describe('Apply & Cancel Actions', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      fixture.componentRef.setInput('filterProperty', enumPropertySmall);
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);
    });

    it('onApply (multiselect) should collect all checked values', () => {
      vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

      // Select 1 and 3 (Alert and Info)
      component.optionsFormArray.at(0).setValue(true); // red
      component.optionsFormArray.at(2).setValue(true); // blue

      component.onApplyButtonClick();

      const emitSpy = component.filterCriteriaChange.emit as Mock;
      const emittedCriteria = vi.mocked(emitSpy).mock.lastCall[0] as PropertyFilter;
      expect(emittedCriteria.criteria.length).toBe(2);
      expect(emittedCriteria.criteria[0].value).toBe('red');
      expect(emittedCriteria.criteria[1].value).toBe('blue');
    });

    it('onCancel should emit empty event', () => {
      vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      component.onCancelButtonClick();
      expect(component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
  });
  describe('Additional Coverage: Branch & Input Logic', () => {
    it('should verify performSearch logic and update options when filterProperty input is changed', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // 1. Initialize with Small Property (3 items)
      fixture.componentRef.setInput('filterProperty', enumPropertySmall);
      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50);

      expect(component.optionsData.length).toBe(3);
      expect(component.filteredOptions.length).toBe(3);

      // 2. Change Input to Large Property (150 items)
      // This tests the ngOnChanges -> initializeFilter -> performSearch flow
      fixture.componentRef.setInput('filterProperty', enumPropertyLarge);

      await vi.advanceTimersByTimeAsync(50);

      // performSearch('') is called implicitly, populating filteredOptions up to max limit
      expect(component.optionsData.length).toBe(150);
      expect(component.filteredOptions.length).toBe(50); // default max shown
      expect(component.searchResultsLen).toBe(150);
    });

    it('should auto-check "Select All" if propertyFilter contains ALL options (updateForm branch)', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // Create a filter that includes every single option available in 'enumPropertySmall'
      const allSelectedFilter = new PropertyFilter();
      allSelectedFilter.criteria = [
        {
          filterableProperty: enumPropertySmall,
          operator: ComparisonOperator.Equals,
          value: 'red',
        } as PropertyPredicate,
        {
          filterableProperty: enumPropertySmall,
          operator: ComparisonOperator.Equals,
          value: 'green',
        } as PropertyPredicate,
        {
          filterableProperty: enumPropertySmall,
          operator: ComparisonOperator.Equals,
          value: 'blue',
        } as PropertyPredicate,
      ];

      fixture.componentRef.setInput('filterProperty', enumPropertySmall);
      fixture.componentRef.setInput('propertyFilter', allSelectedFilter);

      await fixture.whenStable();
      await vi.advanceTimersByTimeAsync(50); // wait for async init

      // This hits the branch: if (selectedOptions.length === this.optionsData.length)
      expect(component.enumFilterForm.get('selectAll')?.value).toBe(true);

      // Verify individual controls are also checked
      component.optionsFormArray.controls.forEach(c => expect(c.value).toBe(true));
    });

    describe('Single Select Initialization Logic', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('filterProperty', singleSelectEnumProperty);
      });

      it('should set singleSelectOption to the specific value from propertyFilter (If branch)', async () => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
        // Define a filter for 'green' to hit the 'if (this.propertyFilter)' block
        const greenFilter = new PropertyFilter();
        greenFilter.criteria = [
          {
            filterableProperty: singleSelectEnumProperty,
            operator: ComparisonOperator.Equals,
            value: 'green',
          } as PropertyPredicate,
        ];
        fixture.componentRef.setInput('propertyFilter', greenFilter);

        await fixture.whenStable();
        await vi.advanceTimersByTimeAsync(50);

        expect(component.enumFilterForm.get('singleSelectOption')?.value).toBe('green');
      });
    });
  });
});
