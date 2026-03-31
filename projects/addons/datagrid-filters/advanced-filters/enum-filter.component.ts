/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import {
  EnumPropertyData,
  EnumPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
} from '../model/datagrid-filters.interfaces';

/**
 * Enum filter component collects filtering criteria for enum based properties
 *
 */

@Component({
  selector: 'appfx-enum-filter',
  standalone: false,
  templateUrl: 'enum-filter.component.html',
  styleUrls: ['enum-filter.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnumFilterComponent implements OnInit, OnChanges {
  /**
   * Property used for filtering
   */
  @Input() filterProperty: EnumPropertyDefinition;

  /**
   * In case the component is used for filter editing
   */
  @Input() propertyFilter: PropertyFilter;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  enumFilterForm: FormGroup;
  optionsData: EnumPropertyData[] = [];
  filteredOptions: { data: EnumPropertyData; index: number }[] = [];
  enumOperators = [ComparisonOperator.DoesNotEqual, ComparisonOperator.Equals];
  isProcessing = false;
  searchResultsLen = 0;
  selectedCount = 0;

  readonly #maxInitiallyShownItems = 50;
  readonly #loadingTimeoutDelayMs = 50;
  #maxShownItems = this.#maxInitiallyShownItems;
  #selectedFilterCriteria = new PropertyFilter();

  constructor(
    private formBuilder: FormBuilder,
    public filterStrings: DatagridFiltersStrings,
    private cdr: ChangeDetectorRef
  ) {}

  get additionalOperators(): boolean {
    return this.filterProperty.supportedOperators?.length === 2;
  }

  get optionsFormArray(): FormArray {
    return this.enumFilterForm?.controls.options as FormArray;
  }

  ngOnInit() {
    this.enumFilterForm = this.formBuilder.group({
      enumOperator: [this.additionalOperators ? ComparisonOperator.DoesNotEqual : ComparisonOperator.Equals],
      searchTerm: [''],
      selectAll: false,
      options: new FormArray([], this.selectedOptionsValidator()),
      singleSelectOption: [],
    });

    this.enumFilterForm.get('enumOperator')?.valueChanges.subscribe((op: ComparisonOperator) => {
      this.#selectedFilterCriteria.operator =
        op === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
    });

    this.enumFilterForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((term: string) => {
        this.runAsyncOperation(() => this.performSearch(term));
      });

    this.runAsyncOperation(() => this.initializeFilter());
  }

  ngOnChanges() {
    if (this.enumFilterForm) {
      this.runAsyncOperation(() => {
        this.initializeFilter();
        this.enumFilterForm.get('searchTerm')?.setValue('', { emitEvent: false });
        this.performSearch('');
      });
    }
  }

  loadMore(): void {
    this.runAsyncOperation(() => {
      this.#maxShownItems += 100;
      this.performSearch(this.enumFilterForm.get('searchTerm')?.value);
    });
  }

  onSelectAllChange(): void {
    this.runAsyncOperation(() => {
      const selectAllValue = this.enumFilterForm.get('selectAll')?.value;
      const visibleIndices = new Set(this.filteredOptions.map(opt => opt.index));
      const searching = this.searchResultsLen === this.optionsData.length;

      this.optionsFormArray.controls.forEach((control: AbstractControl, index: number) => {
        if ((searching || visibleIndices.has(index)) && control.value !== selectAllValue) {
          control.setValue(selectAllValue, { emitEvent: false });
        }
      });

      this.updateSelectedCount();
      this.enumFilterForm.controls.options.updateValueAndValidity();
    });
  }

  onOptionChange(): void {
    this.updateSelectedCount();

    const allSelected = this.selectedCount === this.optionsFormArray.length;
    const selectAllControl = this.enumFilterForm.get('selectAll');

    if (selectAllControl?.value !== allSelected) {
      selectAllControl?.setValue(allSelected, { emitEvent: false });
    }

    this.enumFilterForm.controls.options.updateValueAndValidity();
  }

  clearSearch() {
    this.enumFilterForm.get('searchTerm')?.setValue('');
  }

  onApplyButtonClick(): void {
    const propertyPredicates: PropertyPredicate[] = [];
    if (this.filterProperty.singleSelect) {
      propertyPredicates.push(this.createEnumPropertyPredicate(this.enumFilterForm.value.singleSelectOption));
    } else {
      const selectedOptionsKeys: string[] = this.enumFilterForm.value.options
        .map((checked: boolean, i: number) => (checked ? this.optionsData[i].key : null))
        .filter((v: string | null) => v !== null);
      selectedOptionsKeys.forEach(value => {
        propertyPredicates.push(this.createEnumPropertyPredicate(value));
      });
    }
    this.#selectedFilterCriteria.criteria = propertyPredicates;
    this.filterCriteriaChange.emit(this.#selectedFilterCriteria);
  }

  onCancelButtonClick(): void {
    this.filterCriteriaChange.emit();
  }

  private runAsyncOperation(action: () => void): void {
    const isHeavyLoad = this.optionsData.length > this.#maxInitiallyShownItems;

    if (isHeavyLoad) {
      this.isProcessing = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        action();
        this.isProcessing = false;
        this.cdr.markForCheck();
      }, this.#loadingTimeoutDelayMs);
    } else {
      action();
    }
  }

  private initializeFilter(): void {
    this.updateData();
    this.updateForm();
    this.performSearch('');

    let initialOp = ComparisonOperator.Equals;
    if (this.additionalOperators) {
      initialOp =
        this.propertyFilter?.operator === LogicalOperator.Or
          ? ComparisonOperator.Equals
          : ComparisonOperator.DoesNotEqual;
    }
    this.enumFilterForm.controls.enumOperator.setValue(initialOp, { emitEvent: false });

    this.updateSelectedCount();
  }

  private performSearch(term = ''): void {
    const normalizedTerm = term.toLowerCase();

    const allMatches = this.optionsData
      .map((data, index) => ({ data, index }))
      .filter(
        item =>
          !normalizedTerm ||
          item.data.value.toLowerCase().includes(normalizedTerm) ||
          item.data.key.toLowerCase().includes(normalizedTerm)
      );

    this.searchResultsLen = allMatches.length;
    this.filteredOptions = allMatches.slice(0, this.#maxShownItems);
    this.cdr.markForCheck();
  }

  private updateSelectedCount(): void {
    this.selectedCount = this.optionsFormArray.controls.reduce(
      (acc: number, control: AbstractControl) => acc + (control.value ? 1 : 0),
      0
    );
  }

  private selectedOptionsValidator(): ValidatorFn {
    const validator: ValidatorFn = () =>
      this.filterProperty.singleSelect || this.selectedCount > 0 ? null : { required: true };
    return validator;
  }

  private updateData(): void {
    this.optionsData = [];
    let enumValues: Map<string, string>;
    if (this.propertyFilter && this.propertyFilter.criteria.length) {
      enumValues = (this.propertyFilter.criteria[0].filterableProperty as EnumPropertyDefinition).values;
    } else {
      enumValues = this.filterProperty.values;
    }
    enumValues.forEach((v, k) => {
      this.optionsData.push({ key: k, value: v });
    });
    if (this.additionalOperators) {
      this.enumFilterForm?.controls.enumOperator.setValue(
        this.propertyFilter?.operator === LogicalOperator.Or
          ? ComparisonOperator.Equals
          : ComparisonOperator.DoesNotEqual
      );
    } else {
      this.enumFilterForm?.controls.enumOperator.setValue(ComparisonOperator.Equals);
    }
  }

  private updateForm(): void {
    if (this.enumFilterForm) {
      this.optionsFormArray.clear();
      this.selectAll(false);
      const selectedOptions: any[] = [];
      if (this.propertyFilter) {
        this.propertyFilter.criteria.forEach(predicate => {
          selectedOptions.push(predicate.value);
        });
      }
      this.optionsData.forEach(option =>
        this.optionsFormArray.push(new FormControl(selectedOptions.includes(option.key)))
      );
      if (selectedOptions.length === this.optionsData.length) {
        this.selectAll(true);
      }
      if (this.filterProperty.singleSelect) {
        const singleSelectForm = this.enumFilterForm.get('singleSelectOption');
        if (this.propertyFilter) {
          singleSelectForm?.setValue(this.propertyFilter.criteria[0].value);
        } else {
          singleSelectForm?.setValue(this.filterProperty.values.keys().next().value);
        }
      }
    }
  }

  private selectAll(value: boolean): void {
    this.enumFilterForm.patchValue({
      selectAll: value,
    });
  }

  private createEnumPropertyPredicate(value: string): PropertyPredicate {
    const predicate = new PropertyPredicate();
    predicate.filterableProperty = this.filterProperty;
    predicate.operator = this.enumFilterForm.controls.enumOperator.value;
    predicate.value = value;
    return predicate;
  }
}
