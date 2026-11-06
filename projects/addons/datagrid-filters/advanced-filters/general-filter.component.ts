/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { uniqueIdFactory } from '@clr/angular/utils';

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
  readonly id = uniqueIdFactory();
  readonly logicalOperators: LogicalOperator[];
  readonly isEmptyOperator: ComparisonOperator = ComparisonOperator.IsEmpty;

  generalFilterForm: FormGroup;
  comparisonOperators: ComparisonOperator[];
  units: Unit[] = [];
  isNumericUnitProperty = false;
  @Input() filterProperty: StringPropertyDefinition | NumericPropertyDefinition;
  /**
   * In case the component is used for filter editing
   */
  @Input() propertyFilter: PropertyFilter;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  protected LogicalOperator = LogicalOperator;
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor(
    private formBuilder: FormBuilder,
    public filterStrings: DatagridFiltersStrings
  ) {
    this.logicalOperators = [LogicalOperator.And, LogicalOperator.Or];
  }

  get conditions(): FormArray<FormGroup> {
    return this.generalFilterForm.controls.conditions as FormArray<FormGroup>;
  }

  get hasEmptyPredicate(): boolean {
    return this.conditions.controls.some(condition => condition.controls.operator.value === this.isEmptyOperator);
  }

  ngOnInit() {
    this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
    this.comparisonOperators = this.filterProperty.getOperators();
    this.units = this.applicableUnits();

    const conditionCount = this.filterProperty.singleCondition
      ? 1
      : Math.max(1, this.propertyFilter?.criteria.length ?? 0);
    this.generalFilterForm = this.formBuilder.group({
      conditions: this.formBuilder.array(
        Array.from({ length: conditionCount }, (_, index) => this.createCondition(index))
      ),
      logicalOperator: [this.filterProperty.logicalOperator ?? this.propertyFilter?.operator ?? LogicalOperator.And],
    });
    this.conditions.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateConditionValidators());
    this.updateConditionValidators();
  }

  ngOnChanges() {
    this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
    this.comparisonOperators = this.filterProperty.getOperators();
    // Update property units
    if (this.isNumericUnitProperty && this.generalFilterForm) {
      this.units = this.applicableUnits();
      this.conditions.controls.forEach((condition, index) => condition.controls.unit.setValue(this.initUnit(index)));
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

  addCondition(): void {
    if (!this.filterProperty.singleCondition) {
      this.conditions.push(this.createCondition());
      this.focusCondition(this.conditions.length - 1);
    }
  }

  removeCondition(index: number): void {
    if (this.conditions.length > 1 && index >= 0 && index < this.conditions.length) {
      this.conditions.removeAt(index);
      this.focusCondition(Math.min(index, this.conditions.length - 1));
    }
  }

  onApplyButtonClick(): void {
    if (!this.generalFilterForm.valid) {
      return;
    }
    const rows = this.conditions.getRawValue();
    const filter = new PropertyFilter();
    if (this.isNumericUnitProperty) {
      // Typed values and units stay on this filter (aligned with its criteria), not on the shared definition.
      filter.editorState = { values: rows.map(row => row.value), units: rows.map(row => row.unit) };
    }
    filter.operator = this.filterProperty.logicalOperator ?? this.generalFilterForm.value.logicalOperator;
    filter.criteria = rows.map(row => {
      const predicate = new PropertyPredicate();
      predicate.filterableProperty = this.filterProperty;
      predicate.operator = row.operator;
      predicate.value = row.operator === this.isEmptyOperator ? undefined : this.convertValue(row.value, row.unit);
      return predicate;
    });
    this.filterCriteriaChange.emit(filter);
  }

  onCancelButtonClick(): void {
    this.filterCriteriaChange.emit();
  }

  private createCondition(index = -1): FormGroup {
    const operator = this.initOperator(index);
    return this.formBuilder.group({
      operator: [operator, Validators.required],
      value: [this.initValue(index), operator === this.isEmptyOperator ? [] : this.initValidators()],
      unit: [this.initUnit(index)],
    });
  }

  private updateConditionValidators(): void {
    this.conditions.controls.forEach(condition => {
      const value = condition.controls.value;
      value.setValidators(condition.controls.operator.value === this.isEmptyOperator ? [] : this.initValidators());
      value.updateValueAndValidity({ emitEvent: false });
    });
    if (this.hasEmptyPredicate && this.filterProperty.logicalOperator === undefined) {
      this.generalFilterForm.controls.logicalOperator.setValue(LogicalOperator.Or, { emitEvent: false });
    }
  }

  private focusCondition(index: number): void {
    afterNextRender(
      () => {
        this.elementRef.nativeElement
          .querySelectorAll<HTMLElement>('.filter-condition-row')
          [index]?.querySelector<HTMLInputElement | HTMLSelectElement>('input, select')
          ?.focus();
      },
      { injector: this.injector }
    );
  }

  private initOperator(index: number): ComparisonOperator {
    const selectedOperator: ComparisonOperator = this.propertyFilter?.criteria[index]?.operator;
    const defaultOperator: ComparisonOperator =
      this.filterProperty instanceof StringPropertyDefinition ? ComparisonOperator.Contains : ComparisonOperator.Equals;
    return (
      selectedOperator ??
      (this.comparisonOperators.includes(defaultOperator) ? defaultOperator : this.comparisonOperators[0])
    );
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
    const selectedUnit: Unit =
      this.propertyFilter.editorState?.units?.[index] ?? (this.filterProperty as NumericPropertyDefinition).unit;
    return selectedUnit;
  }

  private initValue(index: number): any {
    if (this.isNumericUnitProperty) {
      return this.propertyFilter?.editorState?.values?.[index] ?? this.propertyFilter?.criteria[index]?.value ?? '';
    } else {
      return this.propertyFilter?.criteria[index]?.value ?? '';
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
