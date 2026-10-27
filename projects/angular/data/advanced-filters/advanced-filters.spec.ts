/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrAdvancedFilters } from './advanced-filters';
import { ClrAdvancedFiltersModule } from './advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from './enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLayout } from './enums/advanced-filter-layout.enum';
import { ClrAdvancedFilterLogic as Logic } from './enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from './enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from './enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFiltersFilter } from './filter/advanced-filters-filter';
import { ClrAdvancedFiltersGroup } from './group/advanced-filters-group';
import { ClrAdvancedFilterField } from './interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from './models/advanced-filter-group.model';
import { ClrAdvancedFilter } from './models/advanced-filter.model';
import { ClrAdvancedFiltersPills } from './pills/advanced-filters-pills';
import { ClrStringFilterValidator } from './validators/string-filter-validator';

const BUDGET: ClrAdvancedFilterField = { key: 'budget', label: 'Budget', type: FieldType.NUMBER };
const COUNTRY: ClrAdvancedFilterField = { key: 'country', label: 'Country', type: FieldType.STRING };
const ORDERED: ClrAdvancedFilterField = { key: 'ordered', label: 'Ordered on', type: FieldType.DATE };
const ACTIVE: ClrAdvancedFilterField = { key: 'active', label: 'Active', type: FieldType.BOOLEAN };
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  options: [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu', label: 'EU Central' },
  ],
};
const FIELDS = [BUDGET, COUNTRY, ORDERED, ACTIVE, REGION];

@Component({
  template: `
    <clr-advanced-filters
      [clrFields]="fields"
      [(clrFilter)]="filter"
      [clrMaxDepth]="maxDepth"
      [clrLayout]="layout"
      (clrFilterChange)="changes = changes + 1"
    ></clr-advanced-filters>
  `,
  standalone: false,
})
class TestHost {
  fields: ClrAdvancedFilterField[] | undefined = FIELDS;
  filter: ClrAdvancedFilterGroup | null = null;
  maxDepth = 3;
  layout: ClrAdvancedFilterLayout | `${ClrAdvancedFilterLayout}` = ClrAdvancedFilterLayout.TREE;
  changes = 0;
}

describe('ClrAdvancedFilters', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  function component(): ClrAdvancedFilters {
    return fixture.debugElement.query(By.directive(ClrAdvancedFilters)).componentInstance;
  }

  function groups(): ClrAdvancedFiltersGroup[] {
    return fixture.debugElement.queryAll(By.directive(ClrAdvancedFiltersGroup)).map(debug => debug.componentInstance);
  }

  function filterNodes(): ClrAdvancedFiltersFilter[] {
    return fixture.debugElement.queryAll(By.directive(ClrAdvancedFiltersFilter)).map(debug => debug.componentInstance);
  }

  function texts(): string[] {
    return fixture.debugElement
      .queryAll(By.css('.clr-advanced-filters-filter-text'))
      .map(debug => debug.nativeElement.textContent.trim());
  }

  function tree(filters: ClrAdvancedFilter[], nested: ClrAdvancedFilter[] = []): ClrAdvancedFilterGroup {
    const root = new ClrAdvancedFilterGroup();
    filters.forEach(filter => root.addChild(filter));
    if (nested.length) {
      const group = root.addChild(new ClrAdvancedFilterGroup());
      group.logic = Logic.OR;
      nested.forEach(filter => group.addChild(filter));
    }
    return root;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  describe('the tree', () => {
    it('starts with an empty AND root when no filter is given', () => {
      fixture.detectChanges();
      expect(component().root).toEqual(jasmine.any(ClrAdvancedFilterGroup));
      expect(component().root.logic).toBe(Logic.AND);
      expect(groups().length).toBe(1);
      expect(filterNodes().length).toBe(0);
    });

    it('renders the given root as it is, with nested groups and every filter as text', () => {
      host.filter = tree(
        [new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)],
        [new ClrAdvancedFilter(COUNTRY, Operator.CONTAINS, 'dfsd')]
      );
      fixture.detectChanges();

      expect(component().root).toBe(host.filter);
      expect(groups().map(group => group.level)).toEqual([1, 2]);
      expect(texts()).toEqual(['Budget: greater than 60', 'Country: contains dfsd']);
    });

    it('starts groups expanded', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();
      const node = fixture.debugElement.query(By.css('.clr-tree-node-content-container'));
      expect(node.nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('updates when the tree is changed in code', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();

      host.filter.addChild(new ClrAdvancedFilter(COUNTRY, Operator.IS_EMPTY));
      (host.filter.children[0] as ClrAdvancedFilter).value = 70;
      fixture.detectChanges();

      expect(texts()).toEqual(['Budget: greater than 70', 'Country: is empty']);
    });

    it('shows a filter that code left incomplete with a placeholder and an error icon', () => {
      const filter = new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60);
      host.filter = tree([filter]);
      fixture.detectChanges();

      filter.operator = Operator.BETWEEN;
      fixture.detectChanges();

      expect(texts()).toEqual(['Budget: between (missing value)']);
      expect(
        fixture.debugElement.query(By.css('.clr-advanced-filters-incomplete-icon cds-icon[status="danger"]'))
      ).not.toBeNull();
    });
  });

  describe('changes', () => {
    it('emits the root after a change the user makes', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();
      const root = host.filter;
      let emitted: ClrAdvancedFilterGroup | undefined;
      component().filterChange.subscribe(value => (emitted = value));

      fixture.debugElement.query(By.css('.clr-advanced-filters-logic input[id$="-or"]')).nativeElement.click();
      fixture.detectChanges();

      expect(emitted).toBe(root);
      expect(host.changes).toBe(1);
    });

    it('emits nothing for changes made in code', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();
      host.filter.logic = Logic.OR;
      fixture.detectChanges();
      expect(host.changes).toBe(0);
    });

    it('starts a new empty root for anything that is not a group', () => {
      host.filter = { logic: Logic.OR, children: [] } as unknown as ClrAdvancedFilterGroup;
      fixture.detectChanges();
      expect(component().root).toEqual(jasmine.any(ClrAdvancedFilterGroup));
      expect(component().root).not.toBe(host.filter);
    });
  });

  describe('field definitions', () => {
    it('gives a built-in field without a validator the validator of its type, without changing the definition', () => {
      fixture.detectChanges();
      const budget = component().fields.find(field => field.key === 'budget');
      expect(budget.validator.validate({ field: 'budget', operator: Operator.CONTAINS, value: 'a' })).toBe(
        Code.UNSUPPORTED_OPERATOR
      );
      expect(BUDGET.validator).toBeUndefined();
    });

    it('gives every field its own validator, also fields of the same type', () => {
      host.fields = [COUNTRY, { ...COUNTRY, key: 'city', label: 'City' }];
      fixture.detectChanges();
      const [country, city] = component().fields;
      expect(country.validator).toEqual(jasmine.any(ClrStringFilterValidator));
      expect(city.validator).toEqual(jasmine.any(ClrStringFilterValidator));
      expect(city.validator).not.toBe(country.validator);
    });

    it('keeps a field that brings its own validator as it is', () => {
      const own = { ...BUDGET, validator: new ClrStringFilterValidator() };
      host.fields = [own];
      fixture.detectChanges();
      expect(component().fields[0]).toBe(own);
    });

    it('keeps a field of a type without a built-in validator as it is', () => {
      const custom: ClrAdvancedFilterField = { key: 'ip', label: 'IP', type: 'ip' as FieldType };
      host.fields = [custom];
      fixture.detectChanges();
      expect(component().fields[0]).toBe(custom);
      expect(custom.validator).toBeUndefined();
    });

    it('removes the filters whose field key is gone, also when the definitions change later', () => {
      host.filter = tree(
        [new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)],
        [new ClrAdvancedFilter(COUNTRY, Operator.CONTAINS, 'x')]
      );
      fixture.detectChanges();

      host.fields = [COUNTRY];
      fixture.detectChanges();
      expect(texts()).toEqual(['Country: contains x']);

      host.fields = [];
      fixture.detectChanges();
      expect(texts()).toEqual([]);
    });

    it('keeps the filters when a definition is replaced by another object with the same key', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();

      host.fields = FIELDS.map(field => ({ ...field }));
      fixture.detectChanges();

      expect(texts()).toEqual(['Budget: greater than 60']);
    });

    it('keeps the filters while no definitions were given', () => {
      host.fields = undefined;
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      fixture.detectChanges();
      expect(host.filter.children.length).toBe(1);
    });
  });

  describe('layout', () => {
    function pills(): ClrAdvancedFiltersPills | undefined {
      return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPills))?.componentInstance;
    }

    it('shows the tree by default', () => {
      fixture.detectChanges();
      expect(component().layout).toBe(ClrAdvancedFilterLayout.TREE);
      expect(groups().length).toBe(1);
      expect(pills()).toBeUndefined();
    });

    it('shows pills for the same root and fields, and switches back to the tree', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      host.layout = 'pills';
      fixture.detectChanges();
      expect(groups().length).toBe(0);
      expect(pills().root).toBe(host.filter);
      expect(pills().fields).toBe(component().fields);

      host.layout = ClrAdvancedFilterLayout.TREE;
      fixture.detectChanges();
      expect(pills()).toBeUndefined();
      expect(texts()).toEqual(['Budget: greater than 60']);
    });

    it('shows the tree for any other value', () => {
      host.layout = 'chips' as ClrAdvancedFilterLayout;
      fixture.detectChanges();
      expect(groups().length).toBe(1);
      expect(pills()).toBeUndefined();
    });

    it('emits the root after a change the user makes in the pills', () => {
      host.filter = tree([new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60)]);
      host.layout = ClrAdvancedFilterLayout.PILLS;
      fixture.detectChanges();
      pills().clearAll();
      expect(host.changes).toBe(1);
      expect(host.filter.children.length).toBe(0);
    });
  });
});
