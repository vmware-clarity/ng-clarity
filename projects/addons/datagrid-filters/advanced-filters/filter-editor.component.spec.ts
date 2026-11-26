/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ClrCheckboxModule,
  ClrDatepickerModule,
  ClrInputModule,
  ClrRadioModule,
  ClrSelectModule,
} from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { renderFixture } from '@clr/angular/utils/testing';
import { of } from 'rxjs';

import { DateTimeFilterComponent } from './date-time-filter.component';
import { EnumFilterComponent } from './enum-filter.component';
import { FilterEditorComponent } from './filter-editor.component';
import { FilterFormComponent } from './filter-form.component';
import { GeneralFilterComponent } from './general-filter.component';
import { UsersFilterComponent } from './users-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DatagridFiltersUserService } from '../datagrid-filters-user-service';
import { ComparisonOperator, LogicalOperator } from '../model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
  UserPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

const stringProperty = new StringPropertyDefinition('Name', 'name');
const numericProperty = new NumericPropertyDefinition('Count', 'count');
const enumProperty = new EnumPropertyDefinition('State', 'state', new Map([['on', 'Powered on']]));
const dateTimeProperty = new DateTimePropertyDefinition('Created', 'created');
const userProperty = new UserPropertyDefinition('Owner', 'owner');

@Component({
  template: `
    <ng-template #field><span data-test-id="field-slot">Field</span></ng-template>
    <ng-template #actions><button type="button" data-test-id="actions-slot">Remove</button></ng-template>
    <appfx-filter-editor
      [property]="property"
      [propertyFilter]="propertyFilter"
      [fieldTemplate]="withSlots ? field : undefined"
      [actionsTemplate]="withSlots ? actions : undefined"
      (filterCriteriaChange)="emitted.push($event)"
    ></appfx-filter-editor>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
})
class EditorHostComponent {
  property: FilterablePropertyDefinition = stringProperty;
  propertyFilter?: PropertyFilter;
  withSlots = true;
  emitted: (PropertyFilter | undefined)[] = [];
}

describe('FilterEditorComponent', () => {
  let fixture: ComponentFixture<EditorHostComponent>;
  let host: EditorHostComponent;

  beforeEach(() => {
    // The editor is internal to the module (not exported), so the test declares it with the editors it renders.
    TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrDatepickerModule,
        ClrIcon,
        ClrInputModule,
        ClrRadioModule,
        ClrSelectModule,
        ClrSpinnerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        EditorHostComponent,
        FilterEditorComponent,
        FilterFormComponent,
        GeneralFilterComponent,
        EnumFilterComponent,
        DateTimeFilterComponent,
        UsersFilterComponent,
      ],
      providers: [
        DatagridFiltersStrings,
        DatePipe,
        {
          provide: DatagridFiltersUserService,
          useValue: { getDomains: () => of([]), searchUsers: () => of([]) },
        },
      ],
    });
    fixture = TestBed.createComponent(EditorHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  const editorTags = ['appfx-general-filter', 'appfx-enum-filter', 'appfx-datetime-filter', 'appfx-users-filter'];
  const shownEditors = () => editorTags.filter(tag => fixture.nativeElement.querySelector(tag));

  for (const [label, property, tag, editor] of [
    ['a string field', stringProperty, 'appfx-general-filter', GeneralFilterComponent],
    ['a numeric field', numericProperty, 'appfx-general-filter', GeneralFilterComponent],
    ['an enum field', enumProperty, 'appfx-enum-filter', EnumFilterComponent],
    ['a date-time field', dateTimeProperty, 'appfx-datetime-filter', DateTimeFilterComponent],
    ['a user field', userProperty, 'appfx-users-filter', UsersFilterComponent],
  ] as const) {
    it(`shows only ${tag} for ${label}`, () => {
      host.property = property;
      renderFixture(fixture);
      expect(shownEditors()).toEqual([tag]);
      expect(fixture.debugElement.query(By.directive(editor)).componentInstance.filterProperty).toBe(property);
    });
  }

  it('renders the field and actions templates in the editor', () => {
    renderFixture(fixture);
    const editor: HTMLElement = fixture.nativeElement.querySelector('appfx-general-filter');
    expect(editor.querySelector('[data-test-id="field-slot"]')).not.toBeNull();
    expect(editor.querySelector('[data-test-id="actions-slot"]')).not.toBeNull();
  });

  it('renders nothing in the slots without templates', () => {
    host.withSlots = false;
    renderFixture(fixture);
    expect(fixture.nativeElement.querySelector('[data-test-id="field-slot"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-test-id="actions-slot"]')).toBeNull();
  });

  it('passes the filter to edit on to the editor', () => {
    const filter: PropertyFilter = {
      operator: LogicalOperator.Or,
      criteria: [{ filterableProperty: enumProperty, operator: ComparisonOperator.Equals, value: 'on' }],
    };
    host.property = enumProperty;
    host.propertyFilter = filter;
    renderFixture(fixture);
    const editor: EnumFilterComponent = fixture.debugElement.query(By.directive(EnumFilterComponent)).componentInstance;
    expect(editor.propertyFilter).toBe(filter);
  });

  it("passes on the editor's applied filter and its cancel", () => {
    renderFixture(fixture);
    const editor: GeneralFilterComponent = fixture.debugElement.query(
      By.directive(GeneralFilterComponent)
    ).componentInstance;
    const applied: PropertyFilter = { operator: LogicalOperator.And, criteria: [] };
    editor.filterCriteriaChange.emit(applied);
    editor.filterCriteriaChange.emit();
    expect(host.emitted).toEqual([applied, undefined]);
  });
});
