/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClrCheckboxModule,
  ClrIconModule,
  ClrInputModule,
  ClrRadioModule,
  ClrSelectModule,
  ClrSpinnerModule,
} from '@clr/angular';
import { of, throwError } from 'rxjs';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DatagridFiltersUserService } from '../datagrid-filters-user-service';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { PropertyFilter, PropertyPredicate, UserPropertyDefinition } from '../model/datagrid-filters.interfaces';
import { FilterFormComponent } from './filter-form.component';
import { ErrorType, UsersFilterComponent } from './users-filter.component';

describe('UsersFilterComponent', () => {
  let component: UsersFilterComponent;
  let fixture: ComponentFixture<UsersFilterComponent>;
  let userServiceMock: any;
  let cdrMock: any;
  let datagridFiltersStrings: DatagridFiltersStrings;

  const broadcomDomain = 'broadcom.com';
  const exampleDomain = 'example.com';
  const alice = 'alice@broadcom.com';
  const mockDomains = [broadcomDomain, exampleDomain];
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
      getDomains: jasmine.createSpy('getDomains').and.returnValue(of(mockDomains)),
      searchUsers: jasmine.createSpy('searchUsers').and.returnValue(of(mockUsers)),
      formatUser: jasmine.createSpy('formatUser').and.callFake((user: string, domain?: string) => {
        if (user.includes('@')) {
          return user;
        }
        return user + (domain ? '@' + domain : '');
      }),
    };

    cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    await TestBed.configureTestingModule({
      declarations: [UsersFilterComponent, FilterFormComponent],
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
      providers: [
        FormBuilder,
        { provide: DatagridFiltersUserService, useValue: userServiceMock },
        DatagridFiltersStrings,
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();
    datagridFiltersStrings = TestBed.inject(DatagridFiltersStrings);
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(UsersFilterComponent);
    component = fixture.componentInstance;
    component.filterProperty = mockFilterProperty;
    fixture.detectChanges(); // triggers ngOnInit
    tick(200);
  }));

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
      p1.value = 'existing_user@broadcom.com';
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

      const spy = spyOn(component.filterCriteriaChange, 'emit');
      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = spy.calls.mostRecent().args[0];

      // Verify it emits both the original and the newly added predicate
      expect(emittedFilter?.criteria.length).toBe(2);
      expect(emittedFilter?.criteria[0].value).toBe('existing_user@broadcom.com');
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
      p1.value = 'user1@broadcom.com';
      p1.operator = ComparisonOperator.Equals;
      const p2 = new PropertyPredicate();
      p2.operator = ComparisonOperator.Equals;
      p2.value = 'user2@broadcom.com';

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

      const spy = spyOn(component.filterCriteriaChange, 'emit');
      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = spy.calls.mostRecent().args[0];

      // Verify the top-level operator changed to 'And' (mapping for DoesNotEqual)
      expect(emittedFilter?.operator).toBe(LogicalOperator.And);

      // Verify criteria updated to 3 elements, all matching the new operator
      expect(emittedFilter?.criteria.length).toBe(3);
      expect(emittedFilter?.criteria[0].value).toBe('user1@broadcom.com');
      expect(emittedFilter?.criteria[0].operator).toBe(ComparisonOperator.DoesNotEqual);
      expect(emittedFilter?.criteria[1].value).toBe('user2@broadcom.com');
      expect(emittedFilter?.criteria[1].operator).toBe(ComparisonOperator.DoesNotEqual);
      expect(emittedFilter?.criteria[2].value).toBe('alice');
      expect(emittedFilter?.criteria[2].operator).toBe(ComparisonOperator.DoesNotEqual);
    });

    it('should initialize from propertyFilter (Edit Mode)', () => {
      const existingFilter = new PropertyFilter();
      existingFilter.operator = LogicalOperator.And; // Means "Does Not Equal" UI state
      const p1 = new PropertyPredicate();
      p1.value = 'dave@broadcom.com';
      existingFilter.criteria = [p1];

      // Manually trigger ngOnChanges behavior or re-create component logic
      // Since we already ran detectChanges, let's simulate input change
      component.propertyFilter = existingFilter;
      component.ngOnChanges({
        propertyFilter: new SimpleChange(null, existingFilter, false),
      });

      expect(component.usersSelectionForm.get('userOperator')?.value).toBe(ComparisonOperator.DoesNotEqual);
      expect(component.selectedValues.has('dave@broadcom.com')).toBeTrue();
    });
  });

  describe('Search Logic', () => {
    it('should search users when searchTerm changes (debounced)', fakeAsync(() => {
      const searchTerm = 'al';
      userServiceMock.searchUsers.calls.reset();
      component.usersSelectionForm.get('searchTerm')?.setValue(searchTerm);

      // Should not call immediately
      expect(userServiceMock.searchUsers).not.toHaveBeenCalled();

      tick(200); // Wait for debounce

      expect(userServiceMock.searchUsers).toHaveBeenCalledWith(searchTerm, broadcomDomain);
      expect(component.allFetchedUsers).toEqual(['alice', 'bob', 'charlie']);
      expect(component.visibleUsers.length).toBe(4); // incldue al
    }));

    it('should handle search errors gracefully by returning search term as fallback', fakeAsync(() => {
      userServiceMock.searchUsers.and.returnValue(throwError({ status: 500 }));
      const searchTerm = 'unknown_user';

      component.usersSelectionForm.get('searchTerm')?.setValue(searchTerm);
      tick(200);

      expect(component.errorSearchingUsers).toBe(datagridFiltersStrings.errorSearchingUsers);
      // The catchError logic returns of([searchTerm]) if searchTerm exists
      expect(component.allFetchedUsers).toEqual([searchTerm]);
      expect(component.visibleUsers).toContain(searchTerm);
    }));

    it('should clear search term when clearSearch is called', () => {
      component.usersSelectionForm.get('searchTerm')?.setValue('testing');
      component.clearSearch();
      expect(component.usersSelectionForm.get('searchTerm')?.value).toBe('');
    });

    it('should re-trigger search when domain changes', fakeAsync(() => {
      userServiceMock.searchUsers.calls.reset();

      // Change domain
      component.usersSelectionForm.get('domain')?.setValue(exampleDomain);
      tick(200);

      expect(userServiceMock.searchUsers).toHaveBeenCalledWith('', exampleDomain);
    }));
  });

  describe('Selection & Checkbox Logic', () => {
    beforeEach(fakeAsync(() => {
      // Setup: Search returns alice, bob, charlie
      component.usersSelectionForm.get('searchTerm')?.setValue('');
      tick(200);
    }));

    it('should add user to selectedValues when checked', () => {
      const index = 0; // alice
      const checkboxCtrl = component.optionsFormArray.at(index);

      checkboxCtrl.setValue(true);
      component.onOptionChange(index);

      expect(component.selectedValues.has('alice')).toBeTrue();
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

      expect(component.selectedValues.has('alice')).toBeFalse();
    });

    it('should handle Select All toggling', () => {
      // Select All
      component.usersSelectionForm.get('selectAll')?.setValue(true);
      component.onSelectAllChange();

      expect(component.selectedValues.size).toBe(3); // alice, bob, charlie
      expect(component.optionsFormArray.controls.every(c => c.value === true)).toBeTrue();

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

      expect(component.usersSelectionForm.get('selectAll')?.value).toBeTrue();

      // Uncheck one
      component.optionsFormArray.at(0).setValue(false);
      component.onOptionChange(0);

      expect(component.usersSelectionForm.get('selectAll')?.value).toBeFalse();
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
      expect(component.hasMoreItems).toBeTrue();
    });

    it('should load next page when loadMore is called', () => {
      const event = new Event('click');
      component.loadMore(event);

      expect(component.visibleUsers.length).toBe(60); // 50 + 10 remaining
      expect(component.hasMoreItems).toBeFalse();
    });
  });

  describe('Custom Search Term Logic', () => {
    it('should display search term as an option if it is not in the results', fakeAsync(() => {
      // Scenario: User searches for "frank", API returns empty or other users.
      // The code forces "frank" to appear as a selectable option if not matched.
      userServiceMock.searchUsers.and.returnValue(of([]));
      const term = 'frank';

      component.usersSelectionForm.get('searchTerm')?.setValue(term);
      tick(200);

      // Expect "frank" to be in visible users
      expect(component.visibleUsers).toContain(term);
    }));

    it('should NOT duplicate search term if it IS in the results', fakeAsync(() => {
      // Search "alice", API returns "alice"
      userServiceMock.searchUsers.and.returnValue(of(['alice']));
      const term = 'alice';

      component.usersSelectionForm.get('searchTerm')?.setValue(term);
      tick(200);

      const occurrences = component.visibleUsers.filter(u => u === 'alice').length;
      expect(occurrences).toBe(1);
    }));
  });

  describe('Form Submission', () => {
    it('should emit filter criteria on apply', () => {
      const spy = spyOn(component.filterCriteriaChange, 'emit');

      // Select user
      component.selectedValues.add(alice);
      component.usersSelectionForm.get('userOperator')?.setValue(ComparisonOperator.Equals);

      component.onApplyButtonClick();

      expect(spy).toHaveBeenCalled();
      const emittedFilter = spy.calls.mostRecent().args[0];
      expect(emittedFilter?.operator).toBe(LogicalOperator.Or); // Equals -> OR
      expect(emittedFilter?.criteria.length).toBe(1);
      expect(emittedFilter?.criteria[0].value).toBe(alice);
    });

    it('should emit undefined/void on cancel', () => {
      const spy = spyOn(component.filterCriteriaChange, 'emit');
      component.onCancelButtonClick();
      expect(spy).toHaveBeenCalledWith(); // no args
    });

    it('should be invalid if no users selected', () => {
      component.selectedValues.clear();
      component.usersSelectionForm.updateValueAndValidity();
      expect(component.usersSelectionForm.valid).toBeFalse();
      expect(component.usersSelectionForm.errors?.['required']).toBeTrue();
    });
  });

  describe('Error Handling', () => {
    it('should handle domain loading error', fakeAsync(() => {
      userServiceMock.getDomains.and.returnValue(throwError('Network Error'));
      // Trigger ngOnInit again to test the flow
      component.ngOnInit();
      // domains stream is subscribed in loadDomains
      tick(200);

      expect(component.errorRetrievingDomains).toBe(datagridFiltersStrings.errorLoadingDomains);
      expect(component.isLoading).toBeFalse();
    }));
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

    it('should filter selected values when a search term is present', fakeAsync(() => {
      // 1. Setup Selected Values
      component.selectedValues.add('Alice'); // Partial Match
      component.selectedValues.add('Bob'); // No Match
      component.selectedValues.add('Charlie'); // Exact Match

      // 2. Mock Search Results (Backend returns nothing for this test to isolate selectedValues logic)
      component.allFetchedUsers = [];

      // 3. Set Search Term
      component.usersSelectionForm.get('searchTerm')?.setValue('Charlie');

      tick(200);

      component.selectedValues.clear();
      component.selectedValues.add('Alice');
      component.selectedValues.add('Ali');
      component.selectedValues.add('Bob');

      component.usersSelectionForm.get('searchTerm')?.setValue('Ali');
      tick(200);

      expect(component.visibleUsers).toContain('Alice');
      expect(component.visibleUsers).toContain('Ali');
      expect(component.visibleUsers).not.toContain('Bob');

      // Because exact match was found in selected values, it shouldn't be added again as a "custom user"
      // Count occurrences of "Ali"
      const count = component.visibleUsers.filter(u => u === 'Ali').length;
      expect(count).toBe(1);
    }));

    it('should handle empty visible users in updateSelectAllState', () => {
      // Setup empty state
      component.visibleUsers = [];

      // Call the private method (or trigger via onOptionChange/rebuild)
      (component as any).updateSelectAllState();

      // Verify early return behavior: selectAll should be false
      expect(component.usersSelectionForm.get('selectAll')?.value).toBe(false);
    });

    it('should return empty array if error occurs and search term is empty', fakeAsync(() => {
      // Mock error
      userServiceMock.searchUsers.and.returnValue(throwError('Error'));

      // Set empty search term
      component.usersSelectionForm.get('searchTerm')?.setValue('');

      // Trigger the pipe
      tick(200);

      // The handleError function is called within the pipe.
      // We can test the public handleError method directly to ensure the specific branch is hit.
      component.handleError('some error', ErrorType.USER_SEARCH).subscribe(result => {
        expect(result).toEqual([]);
      });
    }));
  });
});
