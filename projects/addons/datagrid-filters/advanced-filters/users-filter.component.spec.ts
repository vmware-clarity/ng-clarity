/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { of, throwError } from 'rxjs';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DatagridFiltersUserService } from '../datagrid-filters-user-service';
import { FilterFormComponent } from './filter-form.component';
import { ErrorType, UsersFilterComponent } from './users-filter.component';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { PropertyFilter, PropertyPredicate, UserPropertyDefinition } from '../model/datagrid-filters.interfaces';

describe('UsersFilterComponent', () => {
  let component: UsersFilterComponent;
  let fixture: ComponentFixture<UsersFilterComponent>;
  let userServiceMock: any;
  let cdrMock: any;
  let datagridFiltersStrings: DatagridFiltersStrings;

  const exampleDomain = 'example.com';
  const alice = 'alice@example.com';
  const mockDomains = [exampleDomain];
  const mockUsers = ['alice', 'bob', 'charlie'];
  const mockFilterProperty: UserPropertyDefinition = {
    id: 'owner',
    displayName: 'Owner',
    type: 'USER',
    searchable: true,
    sortable: true,
    property: '',
  };

  beforeEach(async () => {
    userServiceMock = {
      getDomains: vi.fn().mockReturnValue(of(mockDomains)),
      searchUsers: vi.fn().mockReturnValue(of(mockUsers)),
    };

    cdrMock = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
    };

    await TestBed.configureTestingModule({
      declarations: [UsersFilterComponent, FilterFormComponent],
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
      providers: [
        FormBuilder,
        { provide: DatagridFiltersUserService, useValue: userServiceMock },
        DatagridFiltersStrings,
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();
    datagridFiltersStrings = TestBed.inject(DatagridFiltersStrings);
  });

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
    fixture = TestBed.createComponent(UsersFilterComponent);
    component = fixture.componentInstance;
    component.filterProperty = mockFilterProperty;
    fixture.detectChanges(); // triggers ngOnInit
    await vi.advanceTimersByTimeAsync(200);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form and load domains on init', () => {
      expect(component.usersSelectionForm).toBeDefined();
      expect(userServiceMock.getDomains).toHaveBeenCalled();
      expect(component.domains).toEqual(mockDomains);
      // Should select first domain by default if none selected
      expect(component.usersSelectionForm.get('domain')?.value).toEqual(mockDomains[0]);
    });

    it('should set default operator to Equals', () => {
      expect(component.usersSelectionForm.get('userOperator')?.value).toBe(ComparisonOperator.Equals);
    });

    it('should add new user to existing propertyFilter and emit both on apply (Edit Mode)', () => {
      // Setup existing filter with 1 user
      const existingFilter = new PropertyFilter();
      existingFilter.operator = LogicalOperator.Or; // Corresponds to Equals
      const p1 = new PropertyPredicate();
      p1.value = 'existing_user@example.com';
      p1.operator = ComparisonOperator.Equals;
      existingFilter.criteria = [p1];

      // Trigger ngOnChanges
      component.propertyFilter = existingFilter;
      component.ngOnChanges({
        propertyFilter: new SimpleChange(null, existingFilter, false),
      });

      // Add a new user to the selection
      component.optionsFormArray.at(2)?.setValue(true);
      component.onOptionChange(2);
      fixture.detectChanges();

      const spy = vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = vi.mocked(spy).mock.lastCall[0];

      // Verify it emits both the original and the newly added predicate
      expect(emittedFilter?.criteria.length).toBe(2);
      expect(emittedFilter?.criteria[0].value).toBe('existing_user@example.com');
      expect(emittedFilter?.criteria[1].value).toBe('bob');
      expect(emittedFilter?.operator).toBe(LogicalOperator.Or);
      expect(emittedFilter?.criteria[0].operator).toBe(ComparisonOperator.Equals);
      expect(emittedFilter?.criteria[1].operator).toBe(ComparisonOperator.Equals);
    });

    it('should update operator and predicates when modifying an initialized 2-user filter (Edit Mode)', () => {
      // Setup existing filter with 2 users and 'Equals' state
      const existingFilter = new PropertyFilter();
      existingFilter.operator = LogicalOperator.Or;
      const p1 = new PropertyPredicate();
      p1.value = 'user1@example.com';
      p1.operator = ComparisonOperator.Equals;
      const p2 = new PropertyPredicate();
      p2.operator = ComparisonOperator.Equals;
      p2.value = 'user2@example.com';

      existingFilter.criteria = [p1, p2];

      // Trigger ngOnChanges
      component.propertyFilter = existingFilter;
      component.ngOnChanges({
        propertyFilter: new SimpleChange(null, existingFilter, false),
      });

      // Add a third user and change the operator to DoesNotEqual
      component.optionsFormArray.at(2)?.setValue(true);
      component.onOptionChange(2);
      component.usersSelectionForm.get('userOperator')?.setValue(ComparisonOperator.DoesNotEqual);
      fixture.detectChanges();

      const spy = vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = vi.mocked(spy).mock.lastCall[0];

      // Verify the top-level operator changed to 'And' (mapping for DoesNotEqual)
      expect(emittedFilter?.operator).toBe(LogicalOperator.And);

      // Verify criteria updated to 3 elements, all matching the new operator
      expect(emittedFilter?.criteria.length).toBe(3);
      expect(emittedFilter?.criteria[0].value).toBe('user1@example.com');
      expect(emittedFilter?.criteria[0].operator).toBe(ComparisonOperator.DoesNotEqual);
      expect(emittedFilter?.criteria[1].value).toBe('user2@example.com');
      expect(emittedFilter?.criteria[1].operator).toBe(ComparisonOperator.DoesNotEqual);
      expect(emittedFilter?.criteria[2].value).toBe('alice');
      expect(emittedFilter?.criteria[2].operator).toBe(ComparisonOperator.DoesNotEqual);
    });

    it('should initialize from propertyFilter (Edit Mode)', () => {
      const existingFilter = new PropertyFilter();
      existingFilter.operator = LogicalOperator.And; // Means "Does Not Equal" UI state
      const p1 = new PropertyPredicate();
      p1.value = 'dave@example.com';
      existingFilter.criteria = [p1];

      // Manually trigger ngOnChanges behavior or re-create component logic
      // Since we already ran detectChanges, let's simulate input change
      component.propertyFilter = existingFilter;
      component.ngOnChanges({
        propertyFilter: new SimpleChange(null, existingFilter, false),
      });

      expect(component.usersSelectionForm.get('userOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
      expect(component.selectedValues.has('dave@example.com')).toBe(true);
    });
  });

  describe('Search Logic', () => {
    it('should search users when searchTerm changes (debounced)', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      const searchTerm = 'al';
      userServiceMock.searchUsers.mockClear();
      component.usersSelectionForm.get('searchTerm')?.setValue(searchTerm);

      // Should not call immediately
      expect(userServiceMock.searchUsers).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(200); // Wait for debounce

      expect(userServiceMock.searchUsers).toHaveBeenCalledWith(searchTerm, exampleDomain);
      expect(component.allFetchedUsers).toEqual(['alice', 'bob', 'charlie']);
      expect(component.visibleUsers.length).toBe(4); // incldue al
    });

    it('should handle search errors gracefully by returning search term as fallback', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      userServiceMock.searchUsers.mockReturnValue(throwError({ status: 500 }));
      const searchTerm = 'unknown_user';

      component.usersSelectionForm.get('searchTerm')?.setValue(searchTerm);
      await vi.advanceTimersByTimeAsync(200);

      expect(component.errorSearchingUsers).toBe(datagridFiltersStrings.errorSearchingUsers);
      // The catchError logic returns of([searchTerm]) if searchTerm exists
      expect(component.allFetchedUsers).toEqual([searchTerm]);
      expect(component.visibleUsers).toContain(searchTerm);
    });

    it('should clear search term when clearSearch is called', () => {
      component.usersSelectionForm.get('searchTerm')?.setValue('testing');
      component.clearSearch();
      expect(component.usersSelectionForm.get('searchTerm')?.value).toBe('');
    });

    it('should re-trigger search when domain changes', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      userServiceMock.searchUsers.mockClear();

      // Change domain
      component.usersSelectionForm.get('domain')?.setValue(exampleDomain);
      await vi.advanceTimersByTimeAsync(200);

      expect(userServiceMock.searchUsers).toHaveBeenCalledWith('', exampleDomain);
    });
  });

  describe('Selection & Checkbox Logic', () => {
    beforeEach(async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // Setup: Search returns alice, bob, charlie
      component.usersSelectionForm.get('searchTerm')?.setValue('');
      await vi.advanceTimersByTimeAsync(200);
    });

    it('should add user to selectedValues when checked', () => {
      const index = 0; // alice
      const checkboxCtrl = component.optionsFormArray.at(index);

      checkboxCtrl.setValue(true);
      component.onOptionChange(index);

      expect(component.selectedValues.has('alice')).toBe(true);
    });

    it('should remove user from selectedValues when unchecked', () => {
      // First select
      component.selectedValues.add('alice');
      component.usersSelectionForm.get('searchTerm')?.setValue('');

      const index = 0;
      const checkboxCtrl = component.optionsFormArray.at(index);

      // Uncheck
      checkboxCtrl.setValue(false);
      component.onOptionChange(index);

      expect(component.selectedValues.has('alice')).toBe(false);
    });

    it('should handle Select All toggling', () => {
      // Select All
      component.usersSelectionForm.get('selectAll')?.setValue(true);
      component.onSelectAllChange();

      expect(component.selectedValues.size).toBe(3); // alice, bob, charlie
      expect(component.optionsFormArray.controls.every(c => c.value === true)).toBe(true);

      // Deselect All
      component.usersSelectionForm.get('selectAll')?.setValue(false);
      component.onSelectAllChange();

      expect(component.selectedValues.size).toBe(0);
    });

    it('should update Select All checkbox state based on individual selections', () => {
      // Manually select all items one by one
      component.optionsFormArray.controls.forEach((c, i) => {
        c.setValue(true);
        component.onOptionChange(i);
      });

      expect(component.usersSelectionForm.get('selectAll')?.value).toBe(true);

      // Uncheck one
      component.optionsFormArray.at(0).setValue(false);
      component.onOptionChange(0);

      expect(component.usersSelectionForm.get('selectAll')?.value).toBe(false);
    });
  });

  describe('Pagination (Load More)', () => {
    beforeEach(() => {
      // Mock a large list of users
      const largeList = Array.from({ length: 60 }, (x, i) => `user${i}`);
      component.allFetchedUsers = largeList;
      // Force page size to 50 (default)
      (component as any).currentMaxShown = 50;
      (component as any).rebuildCheckboxList();
    });

    it('should show only pageSize items initially', () => {
      expect(component.visibleUsers.length).toBe(50);
      expect(component.hasMoreItems).toBe(true);
    });

    it('should load next page when loadMore is called', () => {
      const event = new Event('click');
      component.loadMore(event);

      expect(component.visibleUsers.length).toBe(60); // 50 + 10 remaining
      expect(component.hasMoreItems).toBe(false);
    });
  });

  describe('Custom Search Term Logic', () => {
    it('should display search term as an option if it is not in the results', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // Scenario: User searches for "frank", API returns empty or other users.
      // The code forces "frank" to appear as a selectable option if not matched.
      userServiceMock.searchUsers.mockReturnValue(of([]));
      const term = 'frank';

      component.usersSelectionForm.get('searchTerm')?.setValue(term);
      await vi.advanceTimersByTimeAsync(200);

      // Expect "frank" to be in visible users
      expect(component.visibleUsers).toContain(term);
    });

    it('should NOT duplicate search term if it IS in the results', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // Search "alice", API returns "alice"
      userServiceMock.searchUsers.mockReturnValue(of(['alice']));
      const term = 'alice';

      component.usersSelectionForm.get('searchTerm')?.setValue(term);
      await vi.advanceTimersByTimeAsync(200);

      const occurrences = component.visibleUsers.filter(u => u === 'alice').length;
      expect(occurrences).toBe(1);
    });
  });

  describe('Form Submission', () => {
    it('should emit filter criteria on apply', () => {
      const spy = vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);

      // Select user
      component.selectedValues.add(alice);
      component.usersSelectionForm.get('userOperator')?.setValue(ComparisonOperator.Equals);

      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = vi.mocked(spy).mock.lastCall[0];
      expect(emittedFilter?.operator).toBe(LogicalOperator.Or); // Equals -> OR
      expect(emittedFilter?.criteria.length).toBe(1);
      expect(emittedFilter?.criteria[0].value).toBe(alice);
    });

    it('should emit undefined/void on cancel', () => {
      const spy = vi.spyOn(component.filterCriteriaChange, 'emit').mockImplementation(() => undefined);
      component.onCancelButtonClick();
      expect(spy).toHaveBeenCalledWith(); // no args
    });

    it('should be invalid if no users selected', () => {
      component.selectedValues.clear();
      component.usersSelectionForm.updateValueAndValidity();
      expect(component.usersSelectionForm.valid).toBe(false);
      expect(component.usersSelectionForm.errors?.['required']).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle domain loading error', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      userServiceMock.getDomains.mockReturnValue(throwError('Network Error'));
      // Trigger ngOnInit again to test the flow
      component.ngOnInit();
      // domains stream is subscribed in loadDomains
      await vi.advanceTimersByTimeAsync(200);

      expect(component.errorRetrievingDomains).toBe(datagridFiltersStrings.errorLoadingDomains);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Coverage: Edge Cases & Missing Branches', () => {
    it('should have filterProperty', () => {
      // Explicitly access the property to ensure coverage
      expect(component.filterProperty).toBeDefined();
    });

    it('should handle null search term gracefully in onDomainChange', () => {
      // Force searchTerm control to have a null value (if that's possible in your form config)
      component.usersSelectionForm.get('searchTerm')?.setValue(null);

      // Call the method directly
      component.onDomainChange();

      // Verify it defaulted to empty string ''
      expect(component.usersSelectionForm.get('searchTerm')?.value).toBe('');
    });

    it('should filter selected values when a search term is present', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // 1. Setup Selected Values
      component.selectedValues.add('Alice'); // Partial Match
      component.selectedValues.add('Bob'); // No Match
      component.selectedValues.add('Charlie'); // Exact Match

      // 2. Mock Search Results (Backend returns nothing for this test to isolate selectedValues logic)
      component.allFetchedUsers = [];

      // 3. Set Search Term
      component.usersSelectionForm.get('searchTerm')?.setValue('Charlie');

      await vi.advanceTimersByTimeAsync(200);

      component.selectedValues.clear();
      component.selectedValues.add('Alice');
      component.selectedValues.add('Ali');
      component.selectedValues.add('Bob');

      component.usersSelectionForm.get('searchTerm')?.setValue('Ali');
      await vi.advanceTimersByTimeAsync(200);

      expect(component.visibleUsers).toContain('Alice');
      expect(component.visibleUsers).toContain('Ali');
      expect(component.visibleUsers).not.toContain('Bob');

      // Because exact match was found in selected values, it shouldn't be added again as a "custom user"
      // Count occurrences of "Ali"
      const count = component.visibleUsers.filter(u => u === 'Ali').length;
      expect(count).toBe(1);
    });

    it('should handle empty visible users in updateSelectAllState', () => {
      // Setup empty state
      component.visibleUsers = [];

      // Call the private method (or trigger via onOptionChange/rebuild)
      (component as any).updateSelectAllState();

      // Verify early return behavior: selectAll should be false
      expect(component.usersSelectionForm.get('selectAll')?.value).toBe(false);
    });

    it('should return empty array if error occurs and search term is empty', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
      // Mock error
      userServiceMock.searchUsers.mockReturnValue(throwError('Error'));

      // Set empty search term
      component.usersSelectionForm.get('searchTerm')?.setValue('');

      // Trigger the pipe
      await vi.advanceTimersByTimeAsync(200);

      // The handleError function is called within the pipe.
      // We can test the public handleError method directly to ensure the specific branch is hit.
      component.handleError('some error', ErrorType.USER_SEARCH).subscribe(result => {
        expect(result).toEqual([]);
      });
    });
  });
});
