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
import { ClrTreeViewModule } from '@clr/angular/data/tree-view';

import { ClrAdvancedFiltersGroup } from './advanced-filters-group';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};
const COUNTRY: ClrAdvancedFilterField = {
  key: 'country',
  label: 'Country',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};

@Component({
  template: `
    <clr-tree>
      <clr-advanced-filters-group
        ngProjectAs="clr-tree-node"
        [group]="group"
        [fields]="fields"
        [level]="1"
        [maxDepth]="maxDepth"
        (edit)="edits = edits + 1"
      ></clr-advanced-filters-group>
    </clr-tree>
  `,
  standalone: false,
})
class TestHost {
  group = new ClrAdvancedFilterGroup();
  fields = [BUDGET, COUNTRY];
  maxDepth = 3;
  edits = 0;
}

describe('ClrAdvancedFiltersGroup', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  function groups(): ClrAdvancedFiltersGroup[] {
    return fixture.debugElement.queryAll(By.directive(ClrAdvancedFiltersGroup)).map(debug => debug.componentInstance);
  }

  function texts(): string[] {
    return fixture.debugElement
      .queryAll(By.css('.clr-advanced-filters-filter-text'))
      .map(debug => debug.nativeElement.textContent.trim());
  }

  function click(selector: string, index = 0): void {
    fixture.debugElement.queryAll(By.css(selector))[index].nativeElement.click();
    fixture.detectChanges();
  }

  /**
   * Lets the focus that a group moves after the next render happen.
   */
  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function focusedText(): string {
    const active = document.activeElement as HTMLElement;
    return active.getAttribute('role') === 'treeitem'
      ? active.textContent.trim()
      : `not a tree item: ${active.tagName}`;
  }

  beforeEach(() => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, {
      add: { exports: [ClrAdvancedFiltersGroup, ClrTreeViewModule] },
    });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    host.group.addChild(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60));
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  describe('header', () => {
    it('switches the logic and emits', () => {
      click('.clr-advanced-filters-logic input[id$="-or"]');
      expect(host.group.logic).toBe(Logic.OR);
      expect(host.edits).toBe(1);
    });

    it('emits nothing when the logic does not change', () => {
      groups()[0].setLogic(Logic.AND);
      expect(host.edits).toBe(0);
    });

    it('labels the group by its logic', () => {
      const header = () => fixture.debugElement.query(By.css('.clr-advanced-filters-group-header')).nativeElement;
      expect(header().getAttribute('aria-label')).toBe('Filter group, all filters must match');
      click('.clr-advanced-filters-logic input[id$="-or"]');
      expect(header().getAttribute('aria-label')).toBe('Filter group, any filter can match');
    });

    it('adds an empty group as the last child, and emits', () => {
      click('.clr-advanced-filters-add-group');
      expect(host.group.children[1]).toEqual(jasmine.any(ClrAdvancedFilterGroup));
      expect(groups().map(group => group.level)).toEqual([1, 2]);
      expect(host.edits).toBe(1);
    });

    it('disables Add group at the maximum depth, with a reason, and adds nothing when called anyway', () => {
      host.maxDepth = 1;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.clr-advanced-filters-add-group')
      ).nativeElement;
      expect(button.disabled).toBeTrue();
      expect(document.getElementById(button.getAttribute('aria-describedby')).textContent).toContain(
        'Maximum nesting depth reached'
      );

      groups()[0].addGroup();
      expect(host.group.children.length).toBe(1);
      expect(host.edits).toBe(0);
    });

    it('offers Clear all on the root and remove on nested groups', () => {
      host.group.addChild(new ClrAdvancedFilterGroup());
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('.clr-advanced-filters-clear-all')).length).toBe(1);
      expect(
        fixture.debugElement.queryAll(By.css('.clr-advanced-filters-group-header .clr-advanced-filters-remove')).length
      ).toBe(1);
    });

    it('explains Clear all and remove in tooltips', async () => {
      host.group.addChild(new ClrAdvancedFilterGroup());
      fixture.detectChanges();
      const tooltipOf = async (selector: string) => {
        const button: HTMLElement = fixture.debugElement.query(By.css(selector)).nativeElement;
        expect(button.hasAttribute('title')).toBeFalse();
        button.focus();
        fixture.detectChanges();
        await fixture.whenStable();
        return document.getElementById(button.getAttribute('aria-describedby')).textContent.trim();
      };
      expect(await tooltipOf('.clr-advanced-filters-clear-all')).toBe('Clear all');
      expect(await tooltipOf('.clr-advanced-filters-group-header .clr-advanced-filters-remove')).toBe('Remove group');
    });

    it('clears all and emits', () => {
      click('.clr-advanced-filters-clear-all');
      expect(host.group.children).toEqual([]);
      expect(texts()).toEqual([]);
      expect(host.edits).toBe(1);
    });

    it('removes a nested group with its subtree, and emits', () => {
      const nested = host.group.addChild(new ClrAdvancedFilterGroup());
      nested.addChild(new ClrAdvancedFilter(COUNTRY, Operator.IS_EMPTY));
      fixture.detectChanges();

      click('.clr-advanced-filters-group-header .clr-advanced-filters-remove');

      expect(host.group.children.length).toBe(1);
      expect(texts()).toEqual(['Budget: greater than 60']);
      expect(host.edits).toBe(1);
    });

    it('keeps the keys of its controls away from the tree', () => {
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      spyOn(event, 'stopPropagation').and.callThrough();
      fixture.debugElement.query(By.css('.clr-advanced-filters-add-group')).nativeElement.dispatchEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('adds a filter applied from its Add filter popover, and emits', () => {
      groups()[0].addFilter(new ClrAdvancedFilter(COUNTRY, Operator.CONTAINS, 'x'));
      fixture.detectChanges();
      expect(texts()).toEqual(['Budget: greater than 60', 'Country: contains x']);
      expect(host.edits).toBe(1);
    });
  });

  describe('children', () => {
    it('shows the filters before the groups, each in the order of the model, which keeps its own order', () => {
      const root = host.group;
      const budget = root.children[0];
      const first = root.addChild(new ClrAdvancedFilterGroup(), 0);
      const second = root.addChild(new ClrAdvancedFilterGroup());
      const country = root.addChild(new ClrAdvancedFilter(COUNTRY, Operator.IS_EMPTY));
      fixture.detectChanges();

      expect(groups()[0].visibleChildren).toEqual([budget, country, first, second]);
      expect(root.children).toEqual([first, budget, second, country]);
      const nodes = Array.from(
        fixture.nativeElement.querySelectorAll('clr-advanced-filters-filter, clr-advanced-filters-group')
      ) as HTMLElement[];
      expect(nodes.map(node => node.tagName.toLowerCase().replace('clr-advanced-filters-', ''))).toEqual([
        'group',
        'filter',
        'filter',
        'group',
        'group',
      ]);
    });

    it('tells groups and filters apart', () => {
      const group = groups()[0];
      const filter = host.group.children[0];
      const nested = new ClrAdvancedFilterGroup();
      expect([group.asGroup(nested), group.asFilter(nested)]).toEqual([nested, null]);
      expect([group.asGroup(filter), group.asFilter(filter)]).toEqual([null, filter as ClrAdvancedFilter]);
    });

    it('updates when the tree is changed in code', () => {
      host.group.addChild(new ClrAdvancedFilter(COUNTRY, Operator.IS_EMPTY));
      fixture.detectChanges();
      expect(texts()).toEqual(['Budget: greater than 60', 'Country: is empty']);
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      host.group.addChild(new ClrAdvancedFilter(COUNTRY, Operator.CONTAINS, 'x'));
      fixture.detectChanges();
    });

    it('moves to the next sibling after a removal', async () => {
      click('clr-advanced-filters-filter .clr-advanced-filters-remove', 0);
      await settle();
      expect(focusedText()).toContain('Country: contains x');
    });

    it('moves to the previous sibling after removing the last child', async () => {
      click('clr-advanced-filters-filter .clr-advanced-filters-remove', 1);
      await settle();
      expect(focusedText()).toContain('Budget: greater than 60');
    });

    it('moves to the group after removing its only child', async () => {
      click('clr-advanced-filters-filter .clr-advanced-filters-remove', 1);
      await settle();
      click('clr-advanced-filters-filter .clr-advanced-filters-remove', 0);
      await settle();
      expect(focusedText()).toContain('Add filter');
    });

    it('moves to the new filter after a field change replaced one, at its place as shown', async () => {
      // The model order is group, budget, country; the view shows budget, country, group.
      host.group.addChild(new ClrAdvancedFilterGroup(), 0);
      fixture.detectChanges();
      const country = fixture.debugElement.queryAll(By.css('clr-advanced-filters-filter'))[1].componentInstance;

      country.apply({ field: BUDGET, operator: Operator.LESS_THAN, value: 5 });
      await settle();

      expect(texts()).toEqual(['Budget: greater than 60', 'Budget: less than 5']);
      expect(focusedText()).toContain('Budget: less than 5');
    });

    it('can be given to the group node', () => {
      groups()[0].focus();
      expect(focusedText()).toContain('Add filter');
    });
  });
});
