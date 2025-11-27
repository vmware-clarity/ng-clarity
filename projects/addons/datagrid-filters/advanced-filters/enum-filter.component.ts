/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

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

  private selectedFilterCriteria: PropertyFilter = new PropertyFilter();

  constructor(private formBuilder: FormBuilder, public filterStrings: DatagridFiltersStrings) {}

  get optionsFormArray(): FormArray {
    return this.enumFilterForm.controls.options as FormArray;
  }

  ngOnInit() {
    this.enumFilterForm = this.formBuilder.group({
      selectAll: false,
      options: new FormArray([], this.selectedOptionsValidator()),
      singleSelectOption: [this.propertyFilter?.criteria[0]?.value || this.filterProperty.values.keys().next().value],
    });
    this.updateForm();
    this.selectedFilterCriteria.operator = LogicalOperator.Or;
  }

  ngOnChanges() {
    this.updateData();
    this.updateForm();
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
    this.selectedFilterCriteria.criteria = propertyPredicates;
    this.filterCriteriaChange.emit(this.selectedFilterCriteria);
  }

  onCancelButtonClick(): void {
    this.filterCriteriaChange.emit();
  }

  onSelectAllChange(): void {
    const selectAllValue = this.enumFilterForm.get('selectAll')?.value;
    this.optionsFormArray.controls.forEach(c => {
      c.setValue(selectAllValue);
    });
  }

  onOptionChange(event: any): void {
    if (!event.target.checked) {
      this.selectAll(false);
    } else {
      const totalSelected = this.optionsFormArray.controls
        .map(c => c.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      if (totalSelected === this.optionsFormArray.length) {
        this.selectAll(true);
      }
    }
  }

  private selectedOptionsValidator(): ValidatorFn {
    const validator: ValidatorFn = (control: AbstractControl) => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map((c: AbstractControl) => c.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      return this.filterProperty.singleSelect || totalSelected > 0 ? null : { required: true };
    };
    return validator;
  }

  private updateData(): void {
    this.optionsData = [];
    let enumValues: Map<string, string>;
    if (this.propertyFilter && this.propertyFilter.criteria.length) {
      // Edit mode
      enumValues = (this.propertyFilter.criteria[0].filterableProperty as EnumPropertyDefinition).values;
    } else {
      enumValues = this.filterProperty.values;
    }
    enumValues.forEach((v, k) => {
      this.optionsData.push({ key: k, value: v });
    });
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
    predicate.operator = ComparisonOperator.Equals;
    predicate.value = value;
    return predicate;
  }
}
