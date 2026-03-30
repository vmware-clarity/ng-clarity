/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClrCheckboxModule,
  ClrIconModule,
  ClrInputModule,
  ClrRadioModule,
  ClrSelectModule,
  ClrSpinnerModule,
} from '@clr/angular';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { EnumPropertyDefinition, PropertyFilter, PropertyPredicate } from '../model/datagrid-filters.interfaces';
import { EnumFilterComponent } from './enum-filter.component';
import { FilterFormComponent } from './filter-form.component';

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
        ClrIconModule,
        ClrSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [EnumFilterComponent, FilterFormComponent],
      providers: [DatagridFiltersStrings],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumFilterComponent);
    component = fixture.componentInstance;
    // Default setup
    component.filterProperty = enumPropertySmall;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Initialization (Small Data)', () => {
    it('should initialize correctly with default values', fakeAsync(() => {
      component.ngOnInit();
      tick(50); // Allow initial async load
      fixture.detectChanges();

      expect(component.optionsData.length).toBe(3);
      expect(component.filteredOptions.length).toBe(3);
      expect(component.enumFilterForm).toBeDefined();
      expect(component.enumFilterForm.get('enumOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
      expect(component.additionalOperators).toBeTrue(); // Because allowNotInOperator is true
      flush();
    }));

    it('should initialize in Edit Mode (pre-selected values)', fakeAsync(() => {
      component.propertyFilter = propertyFilter;
      component.ngOnChanges(); // Trigger reload
      tick(50);
      fixture.detectChanges();

      const redControl = component.optionsFormArray.controls[0]; // red
      const greenControl = component.optionsFormArray.controls[1]; // green

      expect(redControl.value).toBeTrue();
      expect(greenControl.value).toBeFalse();
      // Operator sync check: Or maps to Equals in Edit Mode
      expect(component.enumFilterForm.get('enumOperator')?.value).toBe(ComparisonOperator.Equals);
      flush();
    }));

    it('should sync "DoesNotEqual" operator correctly from PropertyFilter', fakeAsync(() => {
      const filterAnd = new PropertyFilter();
      filterAnd.criteria = [predicateRed];
      filterAnd.operator = LogicalOperator.And; // Implies DoesNotEqual

      component.propertyFilter = filterAnd;
      component.ngOnInit();
      component.ngOnChanges();
      tick(50);

      expect(component.enumFilterForm?.get('enumOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
    }));
  });

  describe('Async Loading & Large Data', () => {
    beforeEach(() => {
      component.filterProperty = enumPropertyLarge;
    });

    it('should handle large datasets by showing loading indicator and splicing results', fakeAsync(() => {
      component.ngOnInit();
      expect(component.isProcessing).toBeFalse();
      // Should only show maxInitiallyShownItems (50)
      expect(component.filteredOptions.length).toBe(50);
      // But total searchable length is 150
      expect(component.searchResultsLen).toBe(150);
    }));

    it('should load more items when loadMore() is called', fakeAsync(() => {
      component.ngOnInit();
      tick(50);

      expect(component.filteredOptions.length).toBe(50);

      component.loadMore();
      expect(component.isProcessing).toBeTrue();

      tick(50); // Wait for loadMore async

      // 50 + 100 step
      expect(component.filteredOptions.length).toBe(150);
      expect(component.isProcessing).toBeFalse();
    }));
  });

  describe('Search Logic', () => {
    beforeEach(fakeAsync(() => {
      component.filterProperty = enumPropertySmall; // red, green, blue
      component.ngOnInit();
      tick(50);
    }));

    it('should filter options by value (case insensitive)', fakeAsync(() => {
      const searchControl = component.enumFilterForm.get('searchTerm');
      searchControl?.setValue('Re'); // Should match 'red'/'Alert' (if key matched) or just check logic
      // Actually values are Alert, Normal, Info. Keys are red, green, blue.

      // Let's search by Value "Alert"
      searchControl?.setValue('alert');

      tick(200); // Debounce
      tick(50); // Async search execution

      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0].data.value).toBe('Alert');
    }));

    it('should filter options by key', fakeAsync(() => {
      const searchControl = component.enumFilterForm.get('searchTerm');
      searchControl?.setValue('gree'); // matches 'green'

      tick(200);
      tick(50);

      expect(component.filteredOptions.length).toBe(1);
      expect(component.filteredOptions[0].data.key).toBe('green');
    }));

    it('should clear search and restore full list', fakeAsync(() => {
      component.enumFilterForm.get('searchTerm')?.setValue('alert');
      tick(250);
      expect(component.filteredOptions.length).toBe(1);

      component.clearSearch();
      tick(250); // Value change logic triggers again

      expect(component.enumFilterForm.get('searchTerm')?.value).toBe('');
      expect(component.filteredOptions.length).toBe(3);
    }));
  });

  describe('Interaction: Search + Selection', () => {
    beforeEach(fakeAsync(() => {
      component.filterProperty = enumPropertySmall;
      component.ngOnInit();
      tick(50);
    }));

    it('Select All should only select filtered (visible) options', fakeAsync(() => {
      // 1. Search for "Alert" (red)
      component.enumFilterForm.get('searchTerm')?.setValue('Alert');
      tick(250);
      expect(component.filteredOptions.length).toBe(1);

      // 2. Click Select All
      component.enumFilterForm.get('selectAll')?.setValue(true);
      component.onSelectAllChange(); // Trigger manually as we are bypassing template binding
      tick(50);

      // 3. Assert "red" is selected, "green/blue" are NOT
      // red is index 0, green is 1, blue is 2
      expect(component.optionsFormArray.at(0).value).toBeTrue();
      expect(component.optionsFormArray.at(1).value).toBeFalse();
      expect(component.optionsFormArray.at(2).value).toBeFalse();
    }));

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
      expect(component.enumFilterForm.get('selectAll')?.value).toBeTrue();

      // Deselect one
      component.optionsFormArray.at(0).setValue(false);
      component.onOptionChange();
      expect(component.enumFilterForm.get('selectAll')?.value).toBeFalse();
    });
  });

  describe('Operators & Validation', () => {
    beforeEach(fakeAsync(() => {
      component.filterProperty = enumPropertySmall;
      component.ngOnInit();
      tick(50);
    }));

    it('should update filter criteria operator when form operator changes', () => {
      spyOn(component.filterCriteriaChange, 'emit');
      const opControl = component.enumFilterForm.get('enumOperator');

      // Change to DoesNotEqual and verify via emitted filter
      opControl?.setValue(ComparisonOperator.DoesNotEqual);
      component.optionsFormArray.at(0).setValue(true);
      component.onOptionChange();
      component.onApplyButtonClick();
      const emittedAnd = (component.filterCriteriaChange.emit as jasmine.Spy).calls.mostRecent()
        .args[0] as PropertyFilter;
      expect(emittedAnd.operator).toBe(LogicalOperator.And);

      // Change back to Equals
      opControl?.setValue(ComparisonOperator.Equals);
      component.onApplyButtonClick();
      const emittedOr = (component.filterCriteriaChange.emit as jasmine.Spy).calls.mostRecent()
        .args[0] as PropertyFilter;
      expect(emittedOr.operator).toBe(LogicalOperator.Or);
    });

    it('should validate form: invalid if nothing selected (multiselect)', () => {
      // Deselect all
      component.optionsFormArray.controls.forEach(c => c.setValue(false));
      component.onOptionChange(); // updates validation

      expect(component.enumFilterForm.valid).toBeFalse();

      // Select one
      component.optionsFormArray.at(0).setValue(true);
      component.onOptionChange();
      expect(component.enumFilterForm.valid).toBeTrue();
    });
  });

  describe('Single Select Mode', () => {
    beforeEach(fakeAsync(() => {
      component.filterProperty = singleSelectEnumProperty;
      component.ngOnInit();
      tick(50);
    }));

    it('should create valid form without requiring array selection', () => {
      // Single select uses 'singleSelectOption' control, not the array checkboxes
      expect(component.enumFilterForm.valid).toBeTrue();
    });

    it('onApply should emit correct single value criteria', () => {
      spyOn(component.filterCriteriaChange, 'emit');

      component.enumFilterForm.get('singleSelectOption')?.setValue('green');
      component.onApplyButtonClick();

      const emitSpy = component.filterCriteriaChange.emit as jasmine.Spy;
      const emittedCriteria = emitSpy.calls.mostRecent().args[0] as PropertyFilter;
      expect(emittedCriteria.criteria.length).toBe(1);
      expect(emittedCriteria.criteria[0].value).toBe('green');
    });
  });

  describe('Apply & Cancel Actions', () => {
    beforeEach(fakeAsync(() => {
      component.filterProperty = enumPropertySmall;
      component.ngOnInit();
      tick(50);
    }));

    it('onApply (multiselect) should collect all checked values', () => {
      spyOn(component.filterCriteriaChange, 'emit');

      // Select 1 and 3 (Alert and Info)
      component.optionsFormArray.at(0).setValue(true); // red
      component.optionsFormArray.at(2).setValue(true); // blue

      component.onApplyButtonClick();

      const emitSpy = component.filterCriteriaChange.emit as jasmine.Spy;
      const emittedCriteria = emitSpy.calls.mostRecent().args[0] as PropertyFilter;
      expect(emittedCriteria.criteria.length).toBe(2);
      expect(emittedCriteria.criteria[0].value).toBe('red');
      expect(emittedCriteria.criteria[1].value).toBe('blue');
    });

    it('onCancel should emit empty event', () => {
      spyOn(component.filterCriteriaChange, 'emit');
      component.onCancelButtonClick();
      expect(component.filterCriteriaChange.emit).toHaveBeenCalledWith();
    });
  });
  describe('Additional Coverage: Branch & Input Logic', () => {
    it('should verify performSearch logic and update options when filterProperty input is changed', fakeAsync(() => {
      // 1. Initialize with Small Property (3 items)
      component.filterProperty = enumPropertySmall;
      component.ngOnInit();
      tick(50);

      expect(component.optionsData.length).toBe(3);
      expect(component.filteredOptions.length).toBe(3);

      // 2. Change Input to Large Property (150 items)
      // This tests the ngOnChanges -> initializeFilter -> performSearch flow
      component.filterProperty = enumPropertyLarge;
      component.ngOnChanges();
      tick(50);

      // performSearch('') is called implicitly, populating filteredOptions up to max limit
      expect(component.optionsData.length).toBe(150);
      expect(component.filteredOptions.length).toBe(50); // default max shown
      expect(component.searchResultsLen).toBe(150);
    }));

    it('should auto-check "Select All" if propertyFilter contains ALL options (updateForm branch)', fakeAsync(() => {
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

      component.filterProperty = enumPropertySmall;
      component.propertyFilter = allSelectedFilter;

      component.ngOnInit();
      tick(50); // wait for async init

      // This hits the branch: if (selectedOptions.length === this.optionsData.length)
      expect(component.enumFilterForm.get('selectAll')?.value).toBeTrue();

      // Verify individual controls are also checked
      component.optionsFormArray.controls.forEach(c => expect(c.value).toBeTrue());
    }));

    describe('Single Select Initialization Logic', () => {
      beforeEach(() => {
        component.filterProperty = singleSelectEnumProperty;
      });

      it('should set singleSelectOption to the specific value from propertyFilter (If branch)', fakeAsync(() => {
        // Define a filter for 'green' to hit the 'if (this.propertyFilter)' block
        const greenFilter = new PropertyFilter();
        greenFilter.criteria = [
          {
            filterableProperty: singleSelectEnumProperty,
            operator: ComparisonOperator.Equals,
            value: 'green',
          } as PropertyPredicate,
        ];
        component.propertyFilter = greenFilter;

        component.ngOnInit();
        tick(50);

        expect(component.enumFilterForm.get('singleSelectOption')?.value).toBe('green');
      }));
    });
  });
});
