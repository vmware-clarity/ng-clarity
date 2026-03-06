/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DatagridFiltersUserService } from '../datagrid-filters-user-service';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import { PropertyFilter, PropertyPredicate, UserPropertyDefinition } from '../model/datagrid-filters.interfaces';

export enum ErrorType {
  DOMAIN,
  USER_SEARCH,
}

@Component({
  selector: 'appfx-users-filter',
  standalone: false,
  templateUrl: 'users-filter.component.html',
  styleUrls: ['users-filter.component.scss', '../common-styles.scss', 'enum-filter.component.scss'],
})
export class UsersFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filterProperty: UserPropertyDefinition;
  @Input() propertyFilter: PropertyFilter;
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  userOperators = [ComparisonOperator.Equals, ComparisonOperator.DoesNotEqual];
  usersSelectionForm: FormGroup;
  isLoading = false;
  domains: string[] = [''];
  errorRetrievingDomains?: string;
  errorSearchingUsers?: string;
  allFetchedUsers: string[] = [];
  visibleUsers: string[] = [];
  selectedValues: Set<string> = new Set<string>();

  readonly #pageSize = 50;
  #currentMaxShown = this.#pageSize;
  #selectedFilterCriteria = new PropertyFilter();
  readonly #searchTermDebounceTime = 200;
  #destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public filterStrings: DatagridFiltersStrings,
    private userService: DatagridFiltersUserService
  ) {}

  get optionsFormArray(): FormArray {
    return this.usersSelectionForm?.get('options') as FormArray;
  }

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.allFetchedUsers.length;
  }

  ngOnInit() {
    this.createUsersSelectionForm();
    this.setupListeners();
    this.initializeSelectionInEditMode();
    this.loadDomains();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propertyFilter'] && !changes['propertyFilter'].firstChange) {
      this.initializeSelectionInEditMode();
      this.rebuildCheckboxList();
    }
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }

  onDomainChange(): void {
    const term = this.usersSelectionForm.get('searchTerm')?.value || '';
    this.usersSelectionForm.get('searchTerm')?.setValue(term);
  }

  fetchUsers(searchTerm: string): Observable<string[]> {
    return this.userService.searchUsers(searchTerm, this.usersSelectionForm.get('domain')?.value);
  }

  loadMore(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.#currentMaxShown += this.#pageSize;
    this.rebuildCheckboxList();
  }

  onOptionChange(index: number): void {
    const user = this.visibleUsers[index];
    const isChecked = this.optionsFormArray.at(index).value;

    if (isChecked) {
      this.selectedValues.add(user);
    } else {
      this.selectedValues.delete(user);
    }

    this.updateSelectAllState();
    this.usersSelectionForm.updateValueAndValidity();
  }

  onSelectAllChange(): void {
    const selectAllValue = this.usersSelectionForm.get('selectAll')?.value;

    this.optionsFormArray.controls.forEach((ctrl: AbstractControl) => {
      (ctrl as FormControl).setValue(selectAllValue, { emitEvent: false });
    });

    this.visibleUsers.forEach(user => {
      if (selectAllValue) {
        this.selectedValues.add(user);
      } else {
        this.selectedValues.delete(user);
      }
    });

    this.usersSelectionForm.updateValueAndValidity();
  }

  clearSearch(): void {
    this.usersSelectionForm.get('searchTerm')?.setValue('');
  }

  handleError(error: any, errorType: ErrorType): Observable<string[]> {
    if (errorType === ErrorType.USER_SEARCH) {
      console.error('Error searching users: ', error);
      this.errorSearchingUsers = this.filterStrings.errorSearchingUsers;
    } else if (errorType === ErrorType.DOMAIN) {
      console.error('Error loading domains: ', error);
      this.errorRetrievingDomains = this.filterStrings.errorLoadingDomains;
    }
    this.isLoading = false;
    this.cdr.markForCheck();
    if (errorType === ErrorType.DOMAIN) {
      return of([]);
    } else {
      const searchValue = this.usersSelectionForm.get('searchTerm')?.value as string;
      return searchValue ? of([searchValue]) : of([]);
    }
  }

  showLoading(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
  }

  hideLoading(): void {
    this.isLoading = false;
    this.cdr.markForCheck();
  }

  formatUser(user: string): string {
    if (user.includes('@')) {
      return user;
    }
    const domain = this.usersSelectionForm.get('domain')?.value;
    return user + (domain ? '@' + domain : '');
  }

  onCancelButtonClick() {
    this.filterCriteriaChange.emit();
  }

  onApplyButtonClick(): void {
    const comparisonOperator = this.usersSelectionForm.get('userOperator')?.value || ComparisonOperator.Equals;
    this.#selectedFilterCriteria.criteria = Array.from(this.selectedValues).map((userValue: string) =>
      this.createUserPropertyPredicate(userValue, comparisonOperator)
    );
    this.#selectedFilterCriteria.operator =
      comparisonOperator === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
    this.filterCriteriaChange.emit(this.#selectedFilterCriteria);
  }

  private setupListeners(): void {
    this.usersSelectionForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        takeUntil(this.#destroy$),
        tap(() => {
          this.showLoading();
          this.errorSearchingUsers = undefined;
        }),
        debounceTime(this.#searchTermDebounceTime),
        switchMap((term: string) =>
          this.fetchUsers(term).pipe(catchError((error: any) => this.handleError(error, ErrorType.USER_SEARCH)))
        ),
        tap((results: string[]) => {
          this.allFetchedUsers = results.map(u => this.formatUser(u));
          this.resetPagination();
          this.rebuildCheckboxList();
          this.hideLoading();
        })
      )
      .subscribe();

    this.usersSelectionForm
      .get('userOperator')
      ?.valueChanges.pipe(takeUntil(this.#destroy$))
      .subscribe((op: ComparisonOperator) => {
        this.#selectedFilterCriteria.operator =
          op === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
      });

    this.usersSelectionForm.get('userOperator')?.setValue(ComparisonOperator.Equals);

    this.usersSelectionForm
      .get('domain')
      ?.valueChanges.pipe(takeUntil(this.#destroy$))
      .subscribe(() => {
        this.usersSelectionForm.get('searchTerm')?.setValue('');
      });
  }

  private loadDomains(): void {
    this.showLoading();
    this.userService
      .getDomains()
      .pipe(
        takeUntil(this.#destroy$),
        catchError((error: any) => this.handleError(error, ErrorType.DOMAIN))
      )
      .subscribe((domains: string[]) => {
        this.domains = domains;
        const currentDomain = this.usersSelectionForm.get('domain')?.value;
        if (domains.length > 0 && !currentDomain) {
          this.usersSelectionForm.get('domain')?.setValue(domains[0]);
        }
      });
  }

  private resetPagination(): void {
    this.#currentMaxShown = this.#pageSize;
  }

  private createUsersSelectionForm(): void {
    this.usersSelectionForm = this.fb.group(
      {
        userOperator: [ComparisonOperator.Equals],
        domain: [null],
        searchTerm: [''],
        selectAll: [false],
        options: this.fb.array([]),
      },
      { validators: this.selectionValidator }
    );
  }

  private initializeSelectionInEditMode(): void {
    if (!this.propertyFilter) {
      return;
    }

    const initialOp =
      this.propertyFilter.operator === LogicalOperator.And
        ? ComparisonOperator.DoesNotEqual
        : ComparisonOperator.Equals;
    this.usersSelectionForm.get('userOperator')?.setValue(initialOp, { emitEvent: false });

    const users: string[] = this.propertyFilter.criteria?.map(c => c.value) || [];
    this.selectedValues = new Set(users);
    this.usersSelectionForm.updateValueAndValidity();
  }

  private rebuildCheckboxList(): void {
    const slicedUsers = this.allFetchedUsers.slice(0, this.#currentMaxShown);
    this.visibleUsers = [];
    const visibleUsersSet = new Set<string>();
    const searchTerm = this.usersSelectionForm.get('searchTerm')?.value;
    let searchTermMatchCustomUser = false;

    if (searchTerm) {
      this.selectedValues.forEach((user: string) => {
        if (user.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
          this.visibleUsers.push(user);
          visibleUsersSet.add(user);
        }
        if (user === searchTerm) {
          searchTermMatchCustomUser = true;
        }
      });
      if (!searchTermMatchCustomUser) {
        this.visibleUsers.push(searchTerm);
        visibleUsersSet.add(searchTerm);
      }
    } else {
      this.selectedValues.forEach(user => {
        if (!visibleUsersSet.has(user)) {
          this.visibleUsers.push(user);
          visibleUsersSet.add(user);
        }
      });
    }

    slicedUsers
      .filter(user => !visibleUsersSet.has(user))
      .forEach(filteredUser => this.visibleUsers.push(filteredUser));

    const optionsArr = this.optionsFormArray;
    optionsArr.clear();

    this.visibleUsers.forEach(user => {
      const isSelected = this.selectedValues.has(user);
      optionsArr.push(new FormControl(isSelected));
    });

    this.updateSelectAllState();
    this.cdr.markForCheck();
  }

  private updateSelectAllState(): void {
    if (this.visibleUsers.length === 0) {
      this.usersSelectionForm.get('selectAll')?.setValue(false, { emitEvent: false });
      return;
    }

    const allVisibleSelected = this.visibleUsers.every(u => this.selectedValues.has(u));
    this.usersSelectionForm.get('selectAll')?.setValue(allVisibleSelected, { emitEvent: false });
  }

  private selectionValidator: ValidatorFn = (): ValidationErrors | null => {
    return this.selectedValues.size > 0 ? null : { required: true };
  };

  private createUserPropertyPredicate(value: string, comparisonOperator: ComparisonOperator): PropertyPredicate {
    const res = new PropertyPredicate();
    res.filterableProperty = this.filterProperty;
    res.operator = comparisonOperator;
    res.value = value;
    return res;
  }
}
