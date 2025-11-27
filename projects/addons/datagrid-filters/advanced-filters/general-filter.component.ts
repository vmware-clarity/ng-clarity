/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, Unit } from '../model/datagrid-filters.enums';
import {
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

const enterKey = 'Enter';
const unmericPatternRegex = '^-?[0-9]+$';

/**
 * General filter component collects filtering criteria for string and numeric based properties
 *
 */

@Component({
  selector: 'appfx-general-filter',
  standalone: false,
  templateUrl: 'general-filter.component.html',
  styleUrls: ['../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralFilterComponent implements OnInit, OnChanges {
  /**
   * Property used for filtering
   */
  #filterProperty: StringPropertyDefinition | NumericPropertyDefinition;
  readonly logicalOperators: LogicalOperator[];
  readonly isEmptyOperator: ComparisonOperator = ComparisonOperator.IsEmpty;
  generalFilterForm: FormGroup;
  comparisonOperators: ComparisonOperator[];
  units: Unit[] = [];
  isNumericUnitProperty = false;
  additionalPredicate = false;
  isEmptyPrimaryPredicate = false;
  isEmptySecondaryPredicate = false;

  /**
   * In case the component is used for filter editing
   */
  @Input() propertyFilter: PropertyFilter;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  protected LogicalOperator = LogicalOperator;

  private selectedFilterCriteria: PropertyFilter = new PropertyFilter();
  private primaryPredicate: PropertyPredicate = new PropertyPredicate();
  private secondaryPredicate: PropertyPredicate = new PropertyPredicate();

  constructor(private formBuilder: FormBuilder, public filterStrings: DatagridFiltersStrings) {
    this.logicalOperators = [LogicalOperator.And, LogicalOperator.Or];
  }

  @Input()
  get filterProperty(): StringPropertyDefinition | NumericPropertyDefinition {
    return this.#filterProperty;
  }
  set filterProperty(filterProperty: StringPropertyDefinition | NumericPropertyDefinition) {
    this.#filterProperty = filterProperty;
    this.primaryPredicate.filterableProperty = filterProperty;
    this.secondaryPredicate.filterableProperty = filterProperty;
  }

  ngOnInit() {
    this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
    this.comparisonOperators = this.filterProperty.getOperators();
    this.units = this.applicableUnits();

    // To handle edit mode with operator IsEmpty
    let validators: ValidatorFn[] = [];
    if (this.propertyFilter?.criteria[0]?.operator === this.isEmptyOperator) {
      this.isEmptyPrimaryPredicate = true;
    } else {
      validators = this.initValidators();
    }

    this.generalFilterForm = this.formBuilder.group({
      primaryOperator: [this.initOperator(0)],
      primaryValue: [this.initValue(0), validators],
      primaryUnit: [this.initUnit(0)],
      logicalOperator: [this.propertyFilter?.operator || LogicalOperator.And],
    });

    this.generalFilterForm.get('primaryOperator')?.valueChanges.subscribe((operator: ComparisonOperator) => {
      if (operator === this.isEmptyOperator) {
        this.removeValidators('primaryValue');
        this.isEmptyPrimaryPredicate = true;
        this.selectLogicalOperator(LogicalOperator.Or);
      } else {
        this.addValidators('primaryValue', validators);
        this.isEmptyPrimaryPredicate = false;
      }
    });

    if (this.propertyFilter?.criteria?.length === 2) {
      this.enableSecondaryPredicate();
    }
  }

  ngOnChanges() {
    this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
    this.comparisonOperators = this.filterProperty.getOperators();
    // Update property units
    if (this.isNumericUnitProperty && this.generalFilterForm) {
      this.units = this.applicableUnits();
      this.generalFilterForm.patchValue({
        primaryUnit: this.initUnit(0),
      });
      if (this.additionalPredicate) {
        this.generalFilterForm.patchValue({
          secondaryUnit: this.initUnit(1),
        });
      }
    }
  }

  onInputKeyPress(event: KeyboardEvent): void {
    if (event.key === enterKey) {
      event.stopPropagation();
      event.preventDefault();
      if (this.generalFilterForm.valid) {
        this.onApplyButtonClick();
      }
    }
  }

  enableSecondaryPredicate(): void {
    this.additionalPredicate = true;
    // To handle edit mode with operator IsEmpty
    let validators: ValidatorFn[] = [];
    if (this.propertyFilter?.criteria[1]?.operator === this.isEmptyOperator) {
      this.isEmptySecondaryPredicate = true;
    } else {
      validators = this.initValidators();
    }
    this.generalFilterForm.addControl('secondaryOperator', new FormControl(this.initOperator(1)));
    this.generalFilterForm.addControl('secondaryValue', new FormControl(this.initValue(1), validators));
    this.generalFilterForm.addControl('secondaryUnit', new FormControl(this.initUnit(1)));
    this.generalFilterForm.get('secondaryOperator')?.valueChanges.subscribe((operator: ComparisonOperator) => {
      if (operator === this.isEmptyOperator) {
        this.removeValidators('secondaryValue');
        this.isEmptySecondaryPredicate = true;
        this.selectLogicalOperator(LogicalOperator.Or);
      } else {
        this.addValidators('secondaryValue', validators);
        this.isEmptySecondaryPredicate = false;
      }
    });
  }

  disableSecondaryPredicate(): void {
    this.additionalPredicate = false;
    this.generalFilterForm.removeControl('secondaryOperator');
    this.generalFilterForm.removeControl('secondaryValue');
  }

  onApplyButtonClick(): void {
    this.primaryPredicate.operator = this.generalFilterForm.value.primaryOperator;
    this.primaryPredicate.value = this.generalFilterForm.value.primaryValue;
    if (this.isNumericUnitProperty) {
      // Selected value and unit are stored, in order to be able to be rendered in edit mode.
      // They are stored in an array, because there are up to two conditions for a single property.
      this.primaryPredicate.filterableProperty.selectedValue = [this.generalFilterForm.value.primaryValue];
      this.primaryPredicate.filterableProperty.selectedUnit = [this.generalFilterForm.value.primaryUnit];
      this.primaryPredicate.value = this.convertValue(
        this.generalFilterForm.value.primaryValue,
        this.generalFilterForm.value.primaryUnit
      );
    }
    this.selectedFilterCriteria.criteria = [this.primaryPredicate];
    this.selectedFilterCriteria.operator =
      this.filterProperty.logicalOperator ?? this.generalFilterForm.value.logicalOperator;
    if (this.additionalPredicate) {
      this.secondaryPredicate.operator = this.generalFilterForm.value.secondaryOperator;
      this.secondaryPredicate.value = this.generalFilterForm.value.secondaryValue;
      if (this.isNumericUnitProperty) {
        this.secondaryPredicate.filterableProperty.selectedValue.push(this.generalFilterForm.value.secondaryValue);
        this.secondaryPredicate.filterableProperty.selectedUnit.push(this.generalFilterForm.value.secondaryUnit);
        this.secondaryPredicate.value = this.convertValue(
          this.generalFilterForm.value.secondaryValue,
          this.generalFilterForm.value.secondaryUnit
        );
      }
      this.selectedFilterCriteria.criteria.push(this.secondaryPredicate);
    }
    this.filterCriteriaChange.emit(this.selectedFilterCriteria);
  }

  onCancelButtonClick(): void {
    this.filterCriteriaChange.emit();
  }

  private addValidators(formControlName: string, validators: ValidatorFn[]): void {
    this.generalFilterForm.get(formControlName)?.addValidators(validators);
    this.generalFilterForm.get(formControlName)?.updateValueAndValidity();
  }

  private removeValidators(formControlName: string): void {
    this.generalFilterForm.get(formControlName)?.clearValidators();
    this.generalFilterForm.get(formControlName)?.updateValueAndValidity();
  }

  private selectLogicalOperator(operator: LogicalOperator): void {
    this.generalFilterForm.patchValue({
      logicalOperator: operator,
    });
  }

  private initOperator(index: number): ComparisonOperator {
    const selectedOperator: ComparisonOperator = this.propertyFilter?.criteria[index]?.operator;
    const defaultOperator: ComparisonOperator =
      this.filterProperty instanceof StringPropertyDefinition ? ComparisonOperator.Contains : ComparisonOperator.Equals;
    return selectedOperator || defaultOperator;
  }

  private initValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [Validators.required];
    if (this.filterProperty instanceof NumericPropertyDefinition) {
      validators.push(Validators.pattern(unmericPatternRegex));
    }
    return validators;
  }

  private isNumericUnitFilterProperty(): boolean {
    return this.filterProperty instanceof NumericPropertyDefinition && this.filterProperty.unit !== undefined;
  }

  private applicableUnits(): Unit[] {
    if (this.isNumericUnitProperty) {
      const propertyUnit: Unit = (this.filterProperty as NumericPropertyDefinition).unit;
      switch (propertyUnit) {
        case Unit.Byte:
          return [Unit.Byte, Unit.KB, Unit.MB, Unit.GB, Unit.TB];
        case Unit.KB:
          return [Unit.KB, Unit.MB, Unit.GB, Unit.TB];
        case Unit.MB:
          return [Unit.MB, Unit.GB, Unit.TB];
        case Unit.GB:
          return [Unit.GB, Unit.TB];
        case Unit.TB:
          return [Unit.TB];
        case Unit.BytePS:
          return [Unit.BytePS, Unit.KBytePS, Unit.MBytePS, Unit.GBytePS];
        case Unit.KBytePS:
          return [Unit.KBytePS, Unit.MBytePS, Unit.GBytePS];
        case Unit.MBytePS:
          return [Unit.MBytePS, Unit.GBytePS];
        case Unit.GBytePS:
          return [Unit.GBytePS];
        case Unit.BitPS:
          return [Unit.BitPS, Unit.KBitPS, Unit.MBitPS, Unit.GBitPS];
        case Unit.KBitPS:
          return [Unit.KBitPS, Unit.MBitPS, Unit.GBitPS];
        case Unit.MBitPS:
          return [Unit.MBitPS, Unit.GBitPS];
        case Unit.GBitPS:
          return [Unit.GBitPS];
        case Unit.HZ:
          return [Unit.HZ, Unit.KHZ, Unit.MHZ, Unit.GHZ];
        case Unit.KHZ:
          return [Unit.KHZ, Unit.MHZ, Unit.GHZ];
        case Unit.MHZ:
          return [Unit.MHZ, Unit.GHZ];
        case Unit.GHZ:
          return [Unit.GHZ];
        default:
          return [];
      }
    }
    return [];
  }

  private initUnit(index: number): Unit {
    if (this.isNumericUnitProperty) {
      if (this.propertyFilter?.criteria[index]) {
        return this.getSelectedUnit(index);
      } else {
        return this.units.length > 0 ? this.units[0] : Unit.MB;
      }
    }
    return Unit.MB;
  }

  private getSelectedUnit(index: number): Unit {
    const selectedUnit: Unit = this.propertyFilter.criteria[index].filterableProperty.selectedUnit[index] as Unit;
    return selectedUnit;
  }

  private initValue(index: number): any {
    if (this.isNumericUnitProperty) {
      return this.propertyFilter?.criteria[index]?.filterableProperty.selectedValue[index] || '';
    } else {
      return this.propertyFilter?.criteria[index]?.value || '';
    }
  }

  private convertValue(value: number, sourceUnit: Unit): number {
    if (this.isNumericUnitProperty) {
      const targetUnit = (this.filterProperty as NumericPropertyDefinition).unit;
      if (targetUnit === sourceUnit) {
        return value;
      }
      switch (targetUnit) {
        case Unit.Byte:
          switch (sourceUnit) {
            case Unit.KB:
              return value * 1024;
            case Unit.MB:
              return value * 1024 * 1024;
            case Unit.GB:
              return value * 1024 * 1024 * 1024;
            case Unit.TB:
              return value * 1024 * 1024 * 1024 * 1024;
            default:
              return value;
          }
        case Unit.KB:
          switch (sourceUnit) {
            case Unit.MB:
              return value * 1024;
            case Unit.GB:
              return value * 1024 * 1024;
            case Unit.TB:
              return value * 1024 * 1024 * 1024;
            default:
              return value;
          }
        case Unit.MB:
          switch (sourceUnit) {
            case Unit.GB:
              return value * 1024;
            case Unit.TB:
              return value * 1024 * 1024;
            default:
              return value;
          }
        case Unit.GB:
          switch (sourceUnit) {
            case Unit.TB:
              return value * 1024;
            default:
              return value;
          }
        case Unit.HZ:
          switch (sourceUnit) {
            case Unit.KHZ:
              return value * 1000;
            case Unit.MHZ:
              return value * 1000 * 1000;
            case Unit.GHZ:
              return value * 1000 * 1000 * 1000;
            default:
              return value;
          }
        case Unit.KHZ:
          switch (sourceUnit) {
            case Unit.MHZ:
              return value * 1000;
            case Unit.GHZ:
              return value * 1000 * 1000;
            default:
              return value;
          }
        case Unit.MHZ:
          switch (sourceUnit) {
            case Unit.GHZ:
              return value * 1000;
            default:
              return value;
          }
        case Unit.BytePS:
          switch (sourceUnit) {
            case Unit.KBytePS:
              return value * 1000;
            case Unit.MBytePS:
              return value * 1000 * 1000;
            case Unit.GBytePS:
              return value * 1000 * 1000 * 1000;
            default:
              return value;
          }
        case Unit.KBytePS:
          switch (sourceUnit) {
            case Unit.MBytePS:
              return value * 1000;
            case Unit.GBytePS:
              return value * 1000 * 1000;
            default:
              return value;
          }
        case Unit.MBytePS:
          switch (sourceUnit) {
            case Unit.GBytePS:
              return value * 1000;
            default:
              return value;
          }
        case Unit.BitPS:
          switch (sourceUnit) {
            case Unit.KBitPS:
              return value * 1000;
            case Unit.MBitPS:
              return value * 1000 * 1000;
            case Unit.GBitPS:
              return value * 1000 * 1000 * 1000;
            default:
              return value;
          }
        case Unit.KBitPS:
          switch (sourceUnit) {
            case Unit.MBitPS:
              return value * 1000;
            case Unit.GBitPS:
              return value * 1000 * 1000;
            default:
              return value;
          }
        case Unit.MBitPS:
          switch (sourceUnit) {
            case Unit.GBitPS:
              return value * 1000;
            default:
              return value;
          }
        default:
          return value;
      }
    }
    return value;
  }
}
