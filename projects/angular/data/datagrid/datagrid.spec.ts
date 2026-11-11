/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EmbeddedViewRef, Input, TrackByFunction } from '@angular/core';
import {
  createTestHelpers,
  delay,
  expectActiveElementNotToBe,
  expectActiveElementToBe,
  TestContext,
} from '@clr/angular/testing';
import { Subject } from 'rxjs';

import { DatagridPropertyStringFilter } from './built-in/filters/datagrid-property-string-filter';
import { DatagridStringFilterImpl } from './built-in/filters/datagrid-string-filter-impl';
import { ClrDatagrid } from './datagrid';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { DATAGRID_SPEC_PROVIDERS } from './helpers';
import { ClrDatagridComparatorInterface } from './interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { ClrDatagridStringFilterInterface } from './interfaces/string-filter.interface';
import { DetailService } from './providers/detail.service';
import { MockDisplayModeService } from './providers/display-mode.mock';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { ClrDatagridItemsIdentityFunction, Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { HIDDEN_COLUMN_CLASS } from './render/constants';
import { DatagridRenderOrganizer } from './render/render-organizer';

function getFixedColumnViews(datagrid: ClrDatagrid): EmbeddedViewRef<void>[] {
  return (
    datagrid as unknown as {
      fixedColumnViews: EmbeddedViewRef<void>[];
    }
  ).fixedColumnViews;
}

@Component({
  template: `
    @if (!destroy) {
      <clr-datagrid
        [(clrDgSelected)]="selected"
        [clrDgSelectionType]="selectionType"
        [clrDgLoading]="loading"
        [clrDgDisablePageFocus]="disableFocus"
        (clrDgRefresh)="refresh($event)"
      >
        <clr-dg-column>
          First
          @if (filter) {
            <clr-dg-filter [clrDgFilter]="testFilter"></clr-dg-filter>
          }
        </clr-dg-column>
        <clr-dg-column>Second</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items">
          <clr-dg-cell>{{ item }}</clr-dg-cell>
          <clr-dg-cell>{{ item * item }}</clr-dg-cell>
        </clr-dg-row>
        <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
      </clr-datagrid>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FullTest {
  items = [1, 2, 3];

  disableFocus = false;
  loading = false;
  selected: number[] | undefined;
  selectionType: SelectionType = SelectionType.None;

  nbRefreshed = 0;
  latestState: ClrDatagridStateInterface;

  fakeLoad = false;

  // ClrDatagridFilterInterface needed to test the non-emission of refresh on destroy, even with an active filter
  filter = false;
  testFilter = new TestFilter();

  destroy = false;

  refresh(state: ClrDatagridStateInterface) {
    this.nbRefreshed++;
    this.latestState = state;
    this.loading = this.fakeLoad;
  }
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      @for (item of items; track item.id) {
        <clr-dg-row>
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
        </clr-dg-row>
      }

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NgForTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
}

// Have to wrap the OnPush component otherwise change detection doesn't run.
// The secret here is OnPush only updates on input changes, hence the wrapper.
@Component({
  template: `<multi-select-test [items]="items" [selected]="selected"></multi-select-test>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class OnPushTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
  selected: any[] = [];
}

@Component({
  selector: 'multi-select-test',
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.id }}</clr-dg-cell>
        <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class MultiSelectionTest {
  @Input() items: any[] = [];
  @Input() selected: any[] = [];
}

@Component({
  template: `
    <clr-datagrid
      [clrDgCustomSelectAllEnabled]="clrDgCustomSelectAllEnabled"
      [clrDgSelectAllDisabled]="clrDgSelectAllDisabled"
      [(clrDgSelected)]="selected"
      [clrDgSelectionType]="'multi'"
      (clrDgCustomSelectAll)="clrDgCustomSelectAllEventSpy($event)"
    >
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class MultiSelectionSimpleTest {
  items: any[] = [1, 2, 3, 4, 5, 6, 7];
  selected: any[] = [];
  @Input() clrDgCustomSelectAllEnabled = false;
  @Input() clrDgSelectAllDisabled = false;

  readonly clrDgCustomSelectAllEventSpy = vi.fn();
}

@Component({
  template: `
    <clr-datagrid [clrDgItemsIdentityFn]="dgTrackByFn" [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
      <clr-dg-column>Value</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items; trackBy: ngForTrackByFn" [clrDgItem]="item">
        <clr-dg-cell>{{ item.value }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class MultiSelectionNgForTest {
  items: {
    value: number;
  }[] = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
  selected: {
    value: number;
  }[] = [];

  ngForTrackByFn: TrackByFunction<{
    value: number;
  }> = (_index, item) => item.value;
  dgTrackByFn: ClrDatagridItemsIdentityFunction<{
    value: number;
  }> = item => item.value;
}

@Component({
  template: `
    <clr-datagrid
      [(clrDgSelected)]="selected"
      [clrDgSelectionType]="'single'"
      clrDgSingleSelectionAriaLabel="Select row from Datagrid"
    >
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer (click)="selected = null">{{ selected }}</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SingleSelectionTest {
  items = [1, 2, 3];

  selected: number[] = null;
}

@Component({
  template: `
    <clr-datagrid clrDgSingleActionableAriaLabel="Select one of actionable rows">
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items">
        @if (item > showIfGreaterThan) {
          <clr-dg-action-overflow>
            <button class="action-item">Edit</button>
          </clr-dg-action-overflow>
        }

        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ActionableRowTest {
  items = [1, 2, 3];
  showIfGreaterThan = 0;
}

@Component({
  template: `
    <clr-datagrid clrDetailExpandableAriaLabel="Expand one of the rows">
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
        @if (expandable) {
          <clr-dg-row-detail *clrIfExpanded>Detail</clr-dg-row-detail>
        }
      </clr-dg-row>

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExpandableRowTest {
  items = [1, 2, 3];
  expandable = true;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row>
        <clr-dg-cell>First item</clr-dg-cell>
        <clr-dg-cell>Second item</clr-dg-cell>
        <clr-dg-row-detail *clrIfExpanded="true">Detail</clr-dg-row-detail>
      </clr-dg-row>
      <clr-dg-footer></clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExpandedOnInitTest {
  expandable = true;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items; index as i">
        @if (action && i === 1) {
          <clr-dg-action-overflow>
            <button class="action-item">Edit</button>
          </clr-dg-action-overflow>
        }
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        <clr-dg-cell>{{ item * item }}</clr-dg-cell>
        @if (expandable && i === 1) {
          <clr-dg-row-detail *clrIfExpanded>Detail</clr-dg-row-detail>
        }
      </clr-dg-row>

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class LateRowFeaturesClrDgItemsTest {
  items = [1, 2, 3];
  action = false;
  expandable = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      @for (item of items; track item.id; let i = $index) {
        <clr-dg-row>
          @if (action && i === 1) {
            <clr-dg-action-overflow>
              <button class="action-item">Edit</button>
            </clr-dg-action-overflow>
          }
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
          @if (expandable && i === 1) {
            <clr-dg-row-detail *clrIfExpanded>Detail</clr-dg-row-detail>
          }
        </clr-dg-row>
      }

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class LateRowFeaturesForTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
  action = false;
  expandable = false;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item }}</clr-dg-cell>
        @if (expandable) {
          <clr-dg-row-detail *clrIfExpanded>Detail</clr-dg-row-detail>
        }
      </clr-dg-row>

      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class MixedExpandableRowTest {
  items = [1, 2, 3, 4];
  private _expandable = true;
  get expandable() {
    this._expandable = !this._expandable;
    return this._expandable;
  }
}
class TestComparator implements ClrDatagridComparatorInterface<number> {
  compare(_a: number, _b: number): number {
    return 0;
  }
}

class TestFilter implements ClrDatagridFilterInterface<number> {
  changes = new Subject<boolean>();

  isActive(): boolean {
    return true;
  }

  accepts(_n: number): boolean {
    return true;
  }
}

class TestCustomStateFilter extends TestFilter {
  private innerState: any;

  constructor(stateCode: string) {
    super();
    this.innerState = { stateCode: stateCode };
  }

  get state() {
    return this.innerState;
  }
}

class TestStringFilter implements ClrDatagridStringFilterInterface<number> {
  accepts(_item: number, _search: string) {
    return true;
  }
}

@Component({
  selector: 'hidden-column-test',
  template: `
    <clr-datagrid>
      <clr-dg-column>
        <ng-container *clrDgHideableColumn="{ hidden: true }">First</ng-container>
      </clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      @for (item of items; track item.id) {
        <clr-dg-row>
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
        </clr-dg-row>
      }
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class HiddenColumnTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>First</clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      @for (item of items; track item.id) {
        <clr-dg-row>
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
        </clr-dg-row>
      }
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ProjectionTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>
        <ng-container *clrDgHideableColumn="{ hidden: firstColumnHidden }">First</ng-container>
      </clr-dg-column>
      <clr-dg-column>Second</clr-dg-column>

      @for (item of items; track item.id) {
        <clr-dg-row>
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.value * item.value }}</clr-dg-cell>
          <clr-dg-row-detail *clrIfExpanded="true" [clrDgReplace]="replaceCells">
            <clr-dg-cell class="first-expandable-row-cell">{{ item.id }} (col 1 detail)</clr-dg-cell>
            <clr-dg-cell>{{ item.value * item.value }} detail (col 2 detail)</clr-dg-cell>
          </clr-dg-row-detail>
        </clr-dg-row>
      }

      <ng-template [(clrIfDetail)]="detailItem">
        <clr-dg-detail>
          <clr-datagrid>
            <clr-dg-column>Detail Column</clr-dg-column>
            <clr-dg-row>
              <clr-dg-cell class="nested-datagrid-cell">Detail Cell</clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </clr-dg-detail>
      </ng-template>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExpandedCellsTest {
  items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
  ];
  detailItem = null;
  replaceCells = false;
  firstColumnHidden = false;
}

@Component({
  template: `
    <clr-tabs>
      <clr-tab>
        <button clrTabLink id="link1">Tab1</button>
        <clr-tab-content *clrIfActive>
          <clr-datagrid>
            <clr-dg-column [style.width.px]="123">Column1</clr-dg-column>
            <clr-dg-column>Column2</clr-dg-column>

            <clr-dg-row *clrDgItems="let item of items">
              <clr-dg-cell>{{ item }}</clr-dg-cell>
              <clr-dg-cell></clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TabsIntegrationTest {
  items = Array(10).fill(0);
}

@Component({
  template: `
    <clr-datagrid [clrDgItemsIdentityFn]="trackById">
      <clr-dg-column>Item</clr-dg-column>
      @for (item of items; track item.id) {
        <clr-dg-row [clrDgItem]="item">
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
        </clr-dg-row>
      }
      <clr-dg-detail *clrIfDetail></clr-dg-detail>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class PanelTrackByTest {
  items = Array.from(Array(3), (v, i) => {
    return { name: v, id: i };
  });
  trackById: ClrDatagridItemsIdentityFunction<{
    id: number;
  }> = item => item.id;
}
@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Item</clr-dg-column>
      <clr-dg-column>Name</clr-dg-column>
      @for (item of items; track item.id) {
        <clr-dg-row [clrDgItem]="item">
          <clr-dg-cell>{{ item.id }}</clr-dg-cell>
          <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        </clr-dg-row>
      }
      <ng-template [(clrIfDetail)]="preState" let-detail>
        <clr-dg-detail></clr-dg-detail>
      </ng-template>
    </clr-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class PanelInitializeOpenedTest {
  items = Array.from(Array(3), (v, i) => {
    return { name: v, id: i };
  });
  preState = this.items[0];
}

describe('Datagrid', () => {
  describe('Components', () => {
    describe('ClrDatagrid component', () => {
      const helpers = createTestHelpers();

      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      describe('Typescript API', () => {
        let context: TestContext<ClrDatagrid<number>, FullTest>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, FullTest>(ClrDatagrid, FullTest);
        });

        it('allows to manually force a refresh of displayed items when data mutates', () => {
          const items = context.getClarityProvider(Items);
          let refreshed = false;
          items.change.subscribe(() => (refreshed = true));
          expect(refreshed).toBe(false);
          context.clarityDirective.dataChanged();
          expect(refreshed).toBe(true);
        });

        it('allows to manually resize the datagrid', async () => {
          context.detectChanges();
          await delay();

          const organizer: DatagridRenderOrganizer = context.getClarityProvider(DatagridRenderOrganizer);
          let resizeSteps = 0;
          organizer.renderStep.subscribe(() => {
            resizeSteps++;
          });
          expect(resizeSteps).toBe(0);
          context.clarityDirective.resize();
          expect(resizeSteps).toBe(5);
        });
      });

      describe('Template API', () => {
        let context: TestContext<ClrDatagrid<number>, FullTest>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, FullTest>(ClrDatagrid, FullTest);
        });

        it('should create default values for clrDgSingleSelectionAriaLabel, clrDgSingleActionableAriaLabel, clrDetailExpandableAriaLabel', () => {
          expect(context.clarityDirective.clrDgSingleSelectionAriaLabel).toBe('Single selection header');
          expect(context.clarityDirective.clrDgSingleActionableAriaLabel).toBe('Single actionable header');
          expect(context.clarityDirective.clrDetailExpandableAriaLabel).toBe('Toggle more row content');
        });

        it('receives an input for the loading state', () => {
          expect(context.clarityDirective.loading).toBe(false);
          context.testComponent.loading = true;
          context.detectChanges();
          expect(context.clarityDirective.loading).toBe(true);
        });

        it('offers two-way binding on the currently selected items', async () => {
          const selection = context.getClarityProvider(Selection);
          context.testComponent.selectionType = SelectionType.Multi;
          context.detectChanges();
          await delay();
          context.testComponent.selected = [2];
          context.detectChanges();
          await delay();

          expect(selection.current).toEqual([2]);
          selection.setSelected(1, true);
          context.detectChanges();
          await delay();

          expect(context.testComponent.selected).toEqual([2, 1]);
        });
        it('allows to set pre-selected items when initializing the full list of items', () => {
          const selection = context.getClarityProvider(Selection);
          context.testComponent.selectionType = SelectionType.Multi;
          context.detectChanges();
          context.testComponent.items = [4, 5, 6];
          context.testComponent.selected = [5];
          context.detectChanges();
          expect(selection.current).toEqual([5]);
        });

        it('treats an undefined selection as empty', async () => {
          const selection = context.getClarityProvider(Selection);
          context.testComponent.selectionType = SelectionType.Multi;
          context.testComponent.selected = [2];
          context.detectChanges();
          await delay();
          expect(selection.current).toEqual([2]);

          context.testComponent.selected = undefined;
          context.detectChanges();
          await delay();
          expect(selection.current).toEqual([]);
          // Let the two-way binding settle, as the application's change detection would.
          context.detectChanges();

          selection.setSelected(1, true);
          context.detectChanges();
          await delay();
          expect(context.testComponent.selected).toEqual([1]);
        });

        describe('clrDgRefresh output', () => {
          it('does not emit when the datagrid is ready', () => {
            expect(context.testComponent.nbRefreshed).toBe(0);
          });

          it('emits once when the sort order changes', () => {
            context.testComponent.nbRefreshed = 0;
            const sort = context.getClarityProvider(Sort);
            sort.toggle(new TestComparator());
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(1);
          });

          it('emits once when the filters change', () => {
            context.testComponent.nbRefreshed = 0;
            const filters = context.getClarityProvider(FiltersProvider);
            const filter = new TestFilter();
            filters.add(filter);
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(1);
          });

          it('emits once when the filters change when currentPage > 1', () => {
            // filter change should set the page to 1, so we expect two events that trigger emits
            // datagrid should consolidate and still emit once
            context.testComponent.items = [1, 2, 3, 4, 5, 6];
            context.detectChanges();
            const page: Page = context.getClarityProvider(Page);
            page.size = 2;
            page.current = 2;
            context.testComponent.nbRefreshed = 0;
            const filters = context.getClarityProvider(FiltersProvider);
            const filter = new TestFilter();
            filters.add(filter);
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(1);
          });

          it('emits once when the page changes', () => {
            context.testComponent.nbRefreshed = 0;
            const page: Page = context.getClarityProvider(Page);
            page.current = 2;
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(1);
          });

          it('emits once when the page size changes', () => {
            context.testComponent.nbRefreshed = 0;
            const page: Page = context.getClarityProvider(Page);
            page.size = 2;
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(1);
            page.size = 5;
            context.detectChanges();
            expect(context.testComponent.nbRefreshed).toBe(2);
            page.resetPageSize();
            expect(context.testComponent.nbRefreshed).toBe(3);
          });

          it('emits the complete state of the datagrid', () => {
            context.testComponent.items = [1, 2, 3, 4, 5, 6];
            context.detectChanges();
            const comparator = new TestComparator();
            const sort = context.getClarityProvider(Sort);
            sort.toggle(comparator);
            const filters = context.getClarityProvider(FiltersProvider);
            const filter = new TestFilter();
            filters.add(filter);
            const page: Page = context.getClarityProvider(Page);
            page.size = 2;
            page.current = 2;
            context.detectChanges();
            expect(context.testComponent.latestState).toEqual({
              page: {
                from: 2,
                to: 3,
                size: 2,
                current: 2,
              },
              sort: {
                by: comparator,
                reverse: false,
              },
              filters: [filter],
            });
          });

          it('emits the correct data for all filter types', () => {
            const filters = context.getClarityProvider(FiltersProvider);
            const customFilter = new TestFilter();
            const testStringFilter = new DatagridStringFilterImpl(new TestStringFilter());
            testStringFilter.value = 'whatever';
            const builtinStringFilter = new DatagridStringFilterImpl(new DatagridPropertyStringFilter('test'));
            const filterWithState = new TestCustomStateFilter('test');
            builtinStringFilter.value = '1234';
            filters.add(customFilter); // custom filter
            filters.add(testStringFilter); // custom ClrDatagridStringFilterInterface ??
            filters.add(builtinStringFilter);
            filters.add(filterWithState);
            context.detectChanges();
            expect(context.testComponent.latestState.filters).toEqual([
              customFilter,
              testStringFilter,
              { property: 'test', value: '1234' },
              { stateCode: 'test' },
            ]);
          });

          it('emits early enough to avoid expression changed errors on the loading input', () => {
            context.testComponent.fakeLoad = true;
            const page: Page = context.getClarityProvider(Page);
            page.current = 2;
            expect(() => context.detectChanges()).not.toThrow();
          });

          it('focuses the datagrid on page change', () => {
            expectActiveElementNotToBe(context.clarityDirective.datagridTable.nativeElement);
            context.getClarityProvider(Page).current = 2;
            expectActiveElementToBe(context.clarityDirective.datagridTable.nativeElement);
          });

          it('does not focus the datagrid on page change when disabled', () => {
            context.testComponent.disableFocus = true;
            context.detectChanges();
            expectActiveElementNotToBe(context.clarityDirective.datagridTable.nativeElement);
            context.getClarityProvider(Page).current = 2;
            expectActiveElementNotToBe(context.clarityDirective.datagridTable.nativeElement);
          });
        });
      });

      describe('View basics', () => {
        let context: TestContext<ClrDatagrid<number>, FullTest>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, FullTest>(ClrDatagrid, FullTest);
        });

        it('projects columns in the header', () => {
          const headers = context.clarityElement.querySelectorAll('.datagrid-column');
          expect(headers.length).not.toBeFalsy();
        });

        it('projects the footer', () => {
          expect(context.clarityElement.querySelector('.datagrid-footer')).not.toBeNull();
        });

        it('adds a11y roles to datagrid', () => {
          const tableWrapper = context.clarityElement.querySelector('.datagrid-table');
          expect(tableWrapper.attributes.role.value).toEqual('grid');

          const header = context.clarityElement.querySelector('.datagrid-header');
          expect(header.attributes.role.value).toEqual('rowgroup');

          const row = context.clarityElement.querySelector('.datagrid-row');
          expect(row.attributes.role.value).toEqual('row');

          const columns = context.clarityElement.querySelectorAll('.datagrid-column');
          columns.forEach(column => expect(column.attributes.role.value).toEqual('columnheader'));
        });
      });

      describe('Iterators', () => {
        it('projects rows when using ngFor', () => {
          testContext.context = helpers.create(ClrDatagrid, NgForTest);
          const rows = testContext.context.clarityElement.querySelectorAll('.datagrid-cell');
          expect(['1', '1', '2', '4', '3', '9']).toEqual([...rows].map(r => r.textContent));
        });

        it('uses the rows template when using clrDgItems', () => {
          testContext.context = helpers.create(ClrDatagrid, FullTest);
          const rows = testContext.context.clarityElement.querySelectorAll('.datagrid-cell');
          expect(['1', '1', '2', '4', '3', '9']).toEqual([...rows].map(r => r.textContent));
        });
      });

      describe('Actionable rows', () => {
        let context: TestContext<ClrDatagrid<number>, ActionableRowTest>;
        let rowActionService: RowActionService;
        let headActionOverflowCell: HTMLElement;
        let actionOverflowCell: HTMLElement[];
        let actionOverflow: HTMLElement[];

        it('it has cells for action overflows if there is at least one of them.', () => {
          context = helpers.create<ClrDatagrid<number>, ActionableRowTest>(ClrDatagrid, ActionableRowTest);
          rowActionService = context.getClarityProvider(RowActionService);
          expect(rowActionService.hasActionableRow).toBe(true);
          const datagridHead = context.clarityElement.querySelector('.datagrid-header');
          headActionOverflowCell = datagridHead.querySelector('.datagrid-column.datagrid-row-actions');
          actionOverflowCell = context.clarityElement.querySelectorAll('.datagrid-row-actions');
          actionOverflow = context.clarityElement.querySelectorAll('clr-dg-action-overflow');
          expect(headActionOverflowCell).not.toBeNull();
          expect(actionOverflowCell.length).toEqual(4);
          expect(actionOverflow.length).toEqual(3);
        });

        it('it has no cells for action overflows if there is none of them.', () => {
          context = helpers.create<ClrDatagrid<number>, ActionableRowTest>(ClrDatagrid, ActionableRowTest);
          rowActionService = context.getClarityProvider(RowActionService);
          context.testComponent.showIfGreaterThan = 10;
          context.detectChanges();
          actionOverflow = context.clarityElement.querySelectorAll('clr-dg-action-overflow');
          expect(actionOverflow.length).toEqual(0);
          expect(rowActionService.hasActionableRow).toBe(false);
          const datagridHead = context.clarityElement.querySelector('.datagrid-header');
          headActionOverflowCell = datagridHead.querySelector('.datagrid-column.datagrid-row-actions');
          actionOverflowCell = context.clarityElement.querySelectorAll('clr-dg-cell.datagrid-single-select');
          expect(headActionOverflowCell).toBeNull();
          expect(actionOverflowCell.length).toEqual(0);
        });

        it('should have screen reader only text with value `Select one of actionable rows`', () => {
          context = helpers.create<ClrDatagrid<number>, ActionableRowTest>(ClrDatagrid, ActionableRowTest);
          context.getClarityProvider(RowActionService);
          expect(
            context.clarityElement.querySelector('.datagrid-header .datagrid-column.datagrid-row-actions .clr-sr-only')
              .textContent
          ).toBe('Select one of actionable rows');
        });
      });

      describe('Expandable rows', () => {
        it('detects if there is at least one expandable row', () => {
          const context = helpers.create(ClrDatagrid, ExpandableRowTest);
          const globalExpandableRows: ExpandableRowsCount = context.getClarityProvider(ExpandableRowsCount);
          expect(globalExpandableRows.hasExpandableRow).toBe(true);
          expect(context.clarityElement.querySelector('.datagrid-column.datagrid-expandable-caret')).not.toBeNull();
          context.testComponent.expandable = false;
          context.detectChanges();
          expect(globalExpandableRows.hasExpandableRow).toBe(false);
          expect(context.clarityElement.querySelector('.datagrid-column.datagrid-expandable-caret')).toBeNull();
        });

        it('can expand rows on initialization', async () => {
          const context = helpers.create(ClrDatagrid, ExpandedOnInitTest);
          const caretIcon = context.clarityElement.querySelector('.datagrid-expandable-caret-icon');
          expect(caretIcon).not.toBeNull();
          expect(caretIcon.getAttribute('direction')).toBe('down');
          const rowDetail = context.clarityElement.querySelector('.datagrid-row-detail');
          expect(rowDetail).not.toBeNull();
        });

        it('hides cells in dg-row-detail when column is hidden and rows are replaced', () => {
          const context = helpers.create(ClrDatagrid, ExpandedCellsTest);
          context.testComponent.replaceCells = true;
          context.testComponent.firstColumnHidden = true;
          context.detectChanges();

          const hiddenCell: HTMLElement = context.clarityElement.querySelector('.first-expandable-row-cell');
          expect(hiddenCell.classList).toContain(HIDDEN_COLUMN_CLASS);
          expect(window.getComputedStyle(hiddenCell).display).toBe('none');
        });

        it('shows cells in dg-row-detail when column is shown and rows are replaced', () => {
          const context = helpers.create(ClrDatagrid, ExpandedCellsTest);
          context.testComponent.replaceCells = true;
          context.testComponent.firstColumnHidden = false;
          context.detectChanges();

          const hiddenCell: HTMLElement = context.clarityElement.querySelector('.first-expandable-row-cell');
          expect(hiddenCell.classList).not.toContain(HIDDEN_COLUMN_CLASS);
          expect(window.getComputedStyle(hiddenCell).display).toBe('block');
        });

        // regression test for CDE-2199
        it('does not hide cells in nested datagrid', () => {
          const context = helpers.create(ClrDatagrid, ExpandedCellsTest);
          context.testComponent.firstColumnHidden = false;
          context.testComponent.detailItem = context.testComponent.items[0];
          context.detectChanges();

          // It is important to hide column after first render for this test.
          context.testComponent.firstColumnHidden = true;
          context.detectChanges();

          // The expandable row cell should be hidden.
          const firstExpandableRowCell: HTMLElement =
            context.clarityElement.querySelector('.first-expandable-row-cell');
          expect(firstExpandableRowCell.classList).toContain(HIDDEN_COLUMN_CLASS);
          expect(window.getComputedStyle(firstExpandableRowCell).display).toBe('none');

          // The nested datagrid cell should not be hidden.
          const nestedDatagridCell: HTMLElement = context.clarityElement.querySelector('.nested-datagrid-cell');
          expect(nestedDatagridCell.classList).not.toContain(HIDDEN_COLUMN_CLASS);
          expect(window.getComputedStyle(nestedDatagridCell).display).toBe('block');
        });

        it('can render mixed expandable/non-expandable', () => {
          const context = helpers.create(ClrDatagrid, MixedExpandableRowTest);
          const caretIcons = context.clarityElement.querySelectorAll('.datagrid-expandable-caret-icon');
          expect(caretIcons.length).toBe(2);
          const datagridCells = context.clarityElement.querySelectorAll('.datagrid-cell');
          expect(datagridCells.length).toBe(8); // 4 items * (1 for the data + 1 for the caret/placeholder)
        });

        it('should have aria-label with value `Expand one of the rows`', () => {
          const context = helpers.create(ClrDatagrid, ExpandableRowTest);
          context.getClarityProvider(RowActionService);
          expect(
            context.clarityElement.querySelector(
              '.datagrid-header .datagrid-column.datagrid-expandable-caret .clr-sr-only'
            ).textContent
          ).toBe('Expand one of the rows');
        });
      });

      describe('Single selection', () => {
        let context: TestContext<ClrDatagrid<number>, SingleSelectionTest>;
        let selection: Selection<number>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, SingleSelectionTest>(ClrDatagrid, SingleSelectionTest, [
            Selection,
          ]);
          selection = context.getClarityProvider(Selection) as Selection<number>;
        });

        describe('Template API', () => {
          it('sets the currentSingle binding', () => {
            expect(selection.currentSingle).toBeUndefined();
            context.testComponent.selected = [1];
            context.detectChanges();
            expect(selection.currentSingle).toEqual(1);
            context.testComponent.selected = [null];
            context.detectChanges();
            expect(selection.currentSingle).toBeNull();
          });

          it('does not emit a change event for on initialization, before selection', () => {
            let singleSelectedChangeCount = 0;
            const sub = context.clarityDirective.selectedChanged.subscribe(() => singleSelectedChangeCount++);

            expect(selection.currentSingle).toBeUndefined();
            expect(singleSelectedChangeCount).toEqual(0);

            sub.unsubscribe();
          });

          it('it does not emits a change event when changing the selection through input', async () => {
            let singleSelectedChangeCount = 0;
            const sub = context.clarityDirective.selectedChanged.subscribe(() => singleSelectedChangeCount++);

            context.testComponent.selected = [1];
            context.detectChanges();
            await delay();

            expect(selection.currentSingle).toEqual(1);
            expect(singleSelectedChangeCount).toEqual(0);

            sub.unsubscribe();
          });

          it('it does not emit a change event when setting selection to undefined/null if already undefined/null', async () => {
            context.detectChanges();
            await delay();

            let singleSelectedChangeCount = 0;
            const sub = context.clarityDirective.selectedChanged.subscribe(() => singleSelectedChangeCount++);

            expect(selection.currentSingle).toBeUndefined();
            expect(singleSelectedChangeCount).toEqual(0);

            context.testComponent.selected = [undefined];
            context.detectChanges();
            await delay();

            expect(selection.currentSingle).toBeUndefined();
            expect(singleSelectedChangeCount).toEqual(0);

            sub.unsubscribe();
          });

          it('it does emit a change event when selecting the same value', async () => {
            let singleSelectedChangeCount = 0;
            const sub = context.clarityDirective.selectedChanged.subscribe(() => singleSelectedChangeCount++);

            context.testComponent.selected = [1];
            context.detectChanges();
            await delay();

            expect(selection.currentSingle).toEqual(1);
            expect(singleSelectedChangeCount).toEqual(0);

            // re-assigning to the same value should not increase the singleSelectedChangeCount
            context.testComponent.selected = [1];
            context.detectChanges();
            await delay();

            expect(selection.currentSingle).toEqual(1);
            expect(singleSelectedChangeCount).toEqual(1);

            sub.unsubscribe();
          });

          it('offers two way binding on the currentSingle value', async () => {
            expect(selection.currentSingle).toBeUndefined();
            context.testComponent.selected = [1];
            context.detectChanges();
            await delay();
            expect(selection.currentSingle).toEqual(1);
            selection.current = [2];
            context.detectChanges();
            await delay();
            expect(context.testComponent.selected[0]).toEqual(2);
          });
        });

        describe('View', () => {
          /*
                 * For some reason this test is breaking all other tests.
                 * Not sure why - need to investigate more
                 *
                it('should have aria-label with  value Select', function() {
                  expect(context.clarityElement.querySelector('.datagrid-header .datagrid-column.datagrid-select')
                  .getAttribute('aria-label')).toBe('Select row from Datagrid');
                });
                */

          it('sets the proper selected class', () => {
            const row = context.clarityElement.querySelectorAll('.datagrid-row')[1];
            expect(row.classList.contains('datagrid-selected')).toBeFalsy();
            selection.current = [1];
            context.detectChanges();
            expect(row.classList.contains('datagrid-selected')).toBeTruthy();
          });
        });
      });

      describe('Multi selection (OnPush)', () => {
        let context: TestContext<ClrDatagrid<number>, OnPushTest>;
        let selection: Selection<number>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, OnPushTest>(
            ClrDatagrid,
            OnPushTest,
            [Selection],
            [MultiSelectionTest]
          );
          selection = context.getClarityProvider(Selection) as Selection<number>;
        });

        describe('Template API', () => {
          it('sets the selected binding with OnPush', () => {
            selection.selectionType = SelectionType.Multi;
            expect(selection.current).toEqual(context.testComponent.selected);
            context.testComponent.selected = [1];
            context.detectChanges();
            expect(selection.current).toEqual(context.testComponent.selected);
            context.testComponent.selected = [];
            context.detectChanges();
            expect(selection.current).toEqual(context.testComponent.selected);
          });
        });
      });

      describe('Multi selection', () => {
        let context: TestContext<ClrDatagrid<number>, MultiSelectionSimpleTest>;
        let selection: Selection<number>;

        beforeEach(() => {
          context = helpers.create<ClrDatagrid<number>, MultiSelectionSimpleTest>(
            ClrDatagrid,
            MultiSelectionSimpleTest,
            [Selection]
          );
          selection = context.getClarityProvider(Selection) as Selection<number>;
        });

        describe('Select all', () => {
          let selectAllCheckbox: HTMLInputElement;
          let itemCheckboxes: HTMLInputElement[];

          beforeEach(() => {
            [selectAllCheckbox, ...itemCheckboxes] = context.clarityElement.querySelectorAll('input[type=checkbox]');
          });

          describe('default select all', () => {
            it('selects all rows (empty selection)', () => {
              selectAllCheckbox.click();
              expect(selection.current).toEqual([1, 2, 3, 4, 5, 6, 7]);
            });

            it('selects all rows (partial selection)', () => {
              itemCheckboxes[0].click();
              itemCheckboxes[1].click();
              selectAllCheckbox.click();

              expect(selection.current).toEqual([1, 2, 3, 4, 5, 6, 7]);
            });

            it('deselects all rows', () => {
              for (const itemCheckbox of itemCheckboxes) {
                itemCheckbox.click();
              }

              selectAllCheckbox.click();

              expect(selection.current).toEqual([]);
            });

            it('does not emit custom select all event', () => {
              selectAllCheckbox.click();

              expect(context.testComponent.clrDgCustomSelectAllEventSpy).not.toHaveBeenCalled();
            });
          });

          describe('custom select all', () => {
            beforeEach(() => {
              context.testComponent.clrDgCustomSelectAllEnabled = true;
              context.detectChanges();
            });

            it('emits the custom select all event', () => {
              selectAllCheckbox.click();
              selectAllCheckbox.click();

              expect(context.testComponent.clrDgCustomSelectAllEventSpy).toHaveBeenCalledTimes(2);
              expect(vi.mocked(context.testComponent.clrDgCustomSelectAllEventSpy).mock.calls[0]).toEqual([true]);
              expect(vi.mocked(context.testComponent.clrDgCustomSelectAllEventSpy).mock.lastCall).toEqual([false]);
            });

            it('does not modify the selection', () => {
              selectAllCheckbox.click();

              expect(selection.current).toEqual([]);
            });
          });

          describe('disabled select all', () => {
            it('select all checkbox is enabled by default', () => {
              expect(selectAllCheckbox.disabled).toBe(false);
            });

            it('disables the select all checkbox when clrDgSelectAllDisabled is true', () => {
              context.testComponent.clrDgSelectAllDisabled = true;
              context.detectChanges();

              expect(selectAllCheckbox.disabled).toBe(true);
            });

            it('re-enables the select all checkbox when clrDgSelectAllDisabled is set back to false', () => {
              context.testComponent.clrDgSelectAllDisabled = true;
              context.detectChanges();
              expect(selectAllCheckbox.disabled).toBe(true);

              context.testComponent.clrDgSelectAllDisabled = false;
              context.detectChanges();
              expect(selectAllCheckbox.disabled).toBe(false);
            });

            it('does not change the selection when disabled and clicked', () => {
              context.testComponent.clrDgSelectAllDisabled = true;
              context.detectChanges();

              selectAllCheckbox.click();

              expect(selection.current).toEqual([]);
            });

            it('does not emit the custom select all event when disabled', () => {
              context.testComponent.clrDgCustomSelectAllEnabled = true;
              context.testComponent.clrDgSelectAllDisabled = true;
              context.detectChanges();

              selectAllCheckbox.click();

              expect(context.testComponent.clrDgCustomSelectAllEventSpy).not.toHaveBeenCalled();
            });

            it('individual row checkboxes remain functional when select all is disabled', () => {
              context.testComponent.clrDgSelectAllDisabled = true;
              context.detectChanges();

              itemCheckboxes[0].click();

              expect(selection.current).toEqual([1]);
            });
          });
        });

        describe('Range selection', () => {
          let checkboxes: HTMLElement[];

          beforeEach(() => {
            checkboxes = Array.from(context.clarityElement.querySelectorAll('input[type=checkbox]')) as HTMLElement[];
          });

          it('updates selection independently without Shift key', () => {
            // We use .clr-control-label because the datagrid implementation hides the
            // real checkbox and only leaves visible the label area.
            expect(checkboxes.length).toEqual(8); // "select all" option in header included
            checkboxes[1].click();
            expect(selection.current).toEqual([1]);
            checkboxes[3].click();
            expect(selection.current).toEqual([1, 3]);
          });

          it('updates selection range when Shift key pressed', async () => {
            const selectedChange = vi.spyOn(context.clarityDirective.selectedChanged, 'emit');
            checkboxes[1].click();
            expect(selection.current).toEqual([1]);
            expect(selection.shiftPressed).toBe(false);
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
            expect(selection.shiftPressed).toBe(true);
            checkboxes[3].click();
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            await delay();
            expect(selection.shiftPressed).toBe(false);
            expect(selectedChange).toHaveBeenCalledWith([1, 2, 3]);
            expect(selection.current).toEqual([1, 2, 3]);
          });

          it('updates selection range in reverse order', () => {
            checkboxes[3].click();
            expect(selection.current).toEqual([3]);
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
            checkboxes[1].click();
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            // We don't really care about the order, do we?
            expect(selection.current.every(x => [1, 2, 3].includes(x))).toBe(true);
          });

          it('can update ranges in a sequence, without releasing Shift', () => {
            // first range
            checkboxes[1].click();
            expect(selection.current).toEqual([1]);
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
            checkboxes[3].click();
            expect(selection.current).toEqual([1, 2, 3]);
            // second range
            checkboxes[5].click();
            expect(selection.current).toEqual([1, 2, 3, 4, 5]);
            checkboxes[7].click();
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            // final state
            expect(selection.current.every(x => [1, 2, 3, 4, 5, 6, 7].includes(x))).toBe(true);
          });

          it('can update ranges in a sequence, releasing Shift', () => {
            // first range
            checkboxes[1].click();
            expect(selection.current).toEqual([1]);
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
            checkboxes[3].click();
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            expect(selection.current).toEqual([1, 2, 3]);
            // second range
            checkboxes[5].click();
            expect(selection.current).toEqual([1, 2, 3, 5]);
            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
            checkboxes[7].click();
            document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            expect(selection.current.includes(4)).toBe(false);
            // final state
            expect(selection.current.every(x => [1, 2, 3, 5, 6, 7].includes(x))).toBe(true);
          });

          it('can deselect items inside a range', async () => {
            // define range
            selection.current.push(1, 2, 3, 4, 5, 6, 7);
            context.detectChanges();
            await delay();
            // // deselect inside range
            checkboxes[2].click();
            checkboxes[4].click();
            checkboxes[6].click();
            context.detectChanges();
            await delay();
            expect(selection.current).toEqual([1, 3, 5, 7]);
          });
        });
      });

      describe('Multi selection with @for', () => {
        let context: TestContext<ClrDatagrid, MultiSelectionNgForTest>;

        beforeEach(() => {
          context = helpers.create(ClrDatagrid, MultiSelectionNgForTest, [Selection]);
        });

        it('should preserve selection when row items change but row query list does not change', async () => {
          context.testComponent.items = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();

          const rowsChangeHandler = vi.fn();
          const rowsSubscription = context.clarityDirective.rows.changes.subscribe(rowsChangeHandler);

          context.testElement.querySelector('clr-dg-row input[type="checkbox"]').click();
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();
          expect(context.testComponent.selected).toEqual([{ value: 1 }]);

          // Break item references and test that the selection is preserved.
          context.testComponent.items = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();
          expect(context.testComponent.selected).toEqual([{ value: 1 }]);

          // The rows query list should not have changed.
          expect(rowsChangeHandler).not.toHaveBeenCalled();
          rowsSubscription.unsubscribe();
        });

        it('should preserve selection when row items and row query list both change', async () => {
          context.testComponent.items = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();

          const rowsChangeHandler = vi.fn();
          const rowsSubscription = context.clarityDirective.rows.changes.subscribe(rowsChangeHandler);

          context.testElement.querySelector('clr-dg-row input[type="checkbox"]').click();
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();
          expect(context.testComponent.selected).toEqual([{ value: 1 }]);

          // Break item references and test that the selection is preserved. (One less item to force the rows query list to change.)
          context.testComponent.items = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
          context.detectChanges();
          // Selection emits through an RxJS zero-delay timer, outside Angular rendering stability.
          await delay();
          await context.fixture.whenStable();
          expect(context.testComponent.selected).toEqual([{ value: 1 }]);

          // The rows query list should have changed.
          expect(rowsChangeHandler).toHaveBeenCalled();
          rowsSubscription.unsubscribe();
        });
      });

      describe('Rows becoming actionable or expandable late', function () {
        function expectFixedColumns(context: TestContext<ClrDatagrid, any>, actions: boolean, expandable: boolean) {
          const header = context.clarityElement.querySelector('.datagrid-header');
          expect(!!header.querySelector('.datagrid-row-actions')).toBe(actions);
          expect(!!header.querySelector('.datagrid-expandable-caret')).toBe(expandable);
        }

        describe('clrDgItems', function () {
          it('renders the action column when a row gets an action overflow', function () {
            const context = helpers.create(ClrDatagrid, LateRowFeaturesClrDgItemsTest);
            expectFixedColumns(context, false, false);
            context.testComponent.action = true;
            expect(() => context.detectChanges()).not.toThrow();
            expectFixedColumns(context, true, false);
          });

          it('renders the expand column when a row gets a row detail', function () {
            const context = helpers.create(ClrDatagrid, LateRowFeaturesClrDgItemsTest);
            context.testComponent.expandable = true;
            expect(() => context.detectChanges()).not.toThrow();
            expectFixedColumns(context, false, true);
          });
        });

        describe('ngFor', function () {
          it('renders the action column when a row gets an action overflow', function () {
            const context = helpers.create(ClrDatagrid, LateRowFeaturesForTest);
            expectFixedColumns(context, false, false);
            context.testComponent.action = true;
            expect(() => context.detectChanges()).not.toThrow();
            expectFixedColumns(context, true, false);
          });

          it('renders the expand column when a row gets a row detail', function () {
            const context = helpers.create(ClrDatagrid, LateRowFeaturesForTest);
            context.testComponent.expandable = true;
            expect(() => context.detectChanges()).not.toThrow();
            expectFixedColumns(context, false, true);
          });
        });

        describe('column hidden by default', function () {
          it('renders columns hidden by default without errors', function () {
            const context = helpers.create(ClrDatagrid, HiddenColumnTest);
            expect(() => context.detectChanges()).not.toThrow();
          });

          it('hides the separator on the last visible column', function () {
            const context = helpers.create(ClrDatagrid, HiddenColumnTest);
            context.detectChanges();
            const visibleHeaders = context.clarityElement.querySelectorAll(
              '[role=columnheader].datagrid-column:not(.datagrid-hidden-column)'
            );
            expect(visibleHeaders.length).toEqual(1);
            expect(visibleHeaders[0].querySelector('clr-dg-column-separator')).toBeFalsy();
          });
        });
      });

      describe('Content Projection', () => {
        let context: TestContext<ClrDatagrid<any>, ProjectionTest>;
        let displayModeService: MockDisplayModeService;

        beforeEach(() => {
          context = helpers.createWithOverrideComponent<ClrDatagrid<any>, ProjectionTest>(
            ClrDatagrid,
            ProjectionTest,
            [],
            [],
            DATAGRID_SPEC_PROVIDERS
          );
          displayModeService = context.getClarityProvider(DisplayModeService) as MockDisplayModeService;
        });

        it('moves columns into the display container', () => {
          displayModeService.updateView(DatagridDisplayMode.DISPLAY);
          const displayHeader = context.clarityElement.querySelector('.datagrid-header');
          const displayColumns = displayHeader.querySelectorAll('.datagrid-column');
          expect(displayColumns.length).toBe(2);
        });

        it('moves rows into the display container', () => {
          displayModeService.updateView(DatagridDisplayMode.DISPLAY);
          const displayTable = context.clarityElement.querySelector('.datagrid-table');
          const displayRows = displayTable.querySelectorAll('.datagrid-row');
          expect(displayRows.length).toBe(4);
        });

        it('moves columns into the calculation container', () => {
          displayModeService.updateView(DatagridDisplayMode.CALCULATE);
          const calculationHeader = context.clarityElement.querySelector('.datagrid-calculation-header');
          const calculationColumns = calculationHeader.querySelectorAll('.datagrid-column');
          expect(calculationColumns.length).toBe(2);
        });

        it('moves the rows into the calculation container', () => {
          displayModeService.updateView(DatagridDisplayMode.CALCULATE);
          const calculationTable = context.clarityElement.querySelector('.datagrid-calculation-table');
          const calculationRows = calculationTable.querySelectorAll('.datagrid-row');
          expect(calculationRows.length).toBe(3);
        });

        it('destroys the fixed columns it created when it leaves calculate mode', () => {
          // a fixed column is only rendered when the datagrid has something to put in it
          context.getClarityProvider(ExpandableRowsCount).register();
          displayModeService.updateView(DatagridDisplayMode.CALCULATE);

          const fixedColumnViews = [...getFixedColumnViews(context.clarityDirective)];
          expect(fixedColumnViews.length).toBeGreaterThan(0);

          displayModeService.updateView(DatagridDisplayMode.DISPLAY);

          // detaching them from the container is not enough - an undestroyed view keeps the whole
          // datagrid alive for as long as the application lives
          expect(fixedColumnViews.every(view => view.destroyed)).toBe(true);
          expect(getFixedColumnViews(context.clarityDirective).length).toBe(0);
        });

        it('destroys the fixed columns it created when the datagrid is destroyed', () => {
          context.getClarityProvider(ExpandableRowsCount).register();
          displayModeService.updateView(DatagridDisplayMode.CALCULATE);

          const fixedColumnViews = [...getFixedColumnViews(context.clarityDirective)];
          expect(fixedColumnViews.length).toBeGreaterThan(0);

          context.clarityDirective.ngOnDestroy();

          expect(fixedColumnViews.every(view => view.destroyed)).toBe(true);
        });

        it('projects async row cells in correct order', () => {
          context.testComponent.items.push({ id: 7, value: 7 });
          context.detectChanges();
          const rows = context.clarityElement.querySelectorAll('.datagrid-row');
          const lastAddedRow = rows[rows.length - 1];
          const lastAddedRowCells = lastAddedRow.querySelectorAll('.datagrid-cell');
          expect(lastAddedRowCells[0].textContent).toBe('7');
          expect(lastAddedRowCells[1].textContent).toBe('49');
        });
      });

      describe('Integration with TabsContent and *clrIfActive', () => {
        let context: TestContext<ClrDatagrid, TabsIntegrationTest>;

        beforeEach(() => {
          context = helpers.create(ClrDatagrid, TabsIntegrationTest, DATAGRID_SPEC_PROVIDERS);
        });

        // Tests that tab-content was already attached to DOM when datagrid column width calculation was completed.
        it('column width calculation has completed', () => {
          expect(context.clarityElement.querySelector('.datagrid-column').getAttribute('style')).not.toBe(
            'width: 0px;'
          );
        });

        // Tests if manual style="width: 123px" was applied and not overridden during the calculation from the above test.
        it('column width manual setting is applied', async () => {
          context.detectChanges();
          await delay();

          expect(context.clarityElement.querySelector('.datagrid-column').clientWidth).toBe(123);

          context.detectChanges();
          await delay();

          expect(context.clarityElement.querySelector('.datagrid-column').getAttribute('style')).toBe('width: 123px;');
        });
      });

      describe('detail pane and track by', () => {
        let context: TestContext<ClrDatagrid, PanelTrackByTest>;
        let detailService;

        beforeEach(() => {
          context = helpers.create(ClrDatagrid, PanelTrackByTest, DATAGRID_SPEC_PROVIDERS);
          detailService = context.getClarityProvider(DetailService) as DetailService;
        });

        it('should keep open the panel', () => {
          /**
           * trackBy function is defined inside the testComponent and
           * it is tracking by `id` so unless the id is not changed the
           * item must stay the same.
           */
          /* Open second detail pane */
          const detailButton = context.clarityElement.querySelectorAll('.datagrid-detail-caret-button')[1];
          detailService.open(context.testComponent.items[1], detailButton);
          context.detectChanges();

          /* make sure that the state is set */
          expect(detailService.state).toEqual(context.testComponent.items[1]);

          /* update the name of the second pane */
          context.testComponent.items[1].name = 'changed';
          context.detectChanges();

          /* make sure that the same item is still selected */
          expect(detailService.state).toEqual(context.testComponent.items[1]);
        });
      });

      describe('detail pane overlay class', () => {
        let context: TestContext<ClrDatagrid, PanelTrackByTest>;
        let detailService: DetailService;

        beforeEach(() => {
          context = helpers.create(ClrDatagrid, PanelTrackByTest, DATAGRID_SPEC_PROVIDERS);
          detailService = context.getClarityProvider(DetailService) as DetailService;
          context.detectChanges();
        });

        it('should not have datagrid-detail-overlay class by default', () => {
          expect(context.clarityElement.classList).not.toContain('datagrid-detail-overlay');
        });

        it('should add datagrid-detail-overlay class when detailWidth is 100', () => {
          detailService.detailWidth = 100;
          context.detectChanges();
          expect(context.clarityElement.classList).toContain('datagrid-detail-overlay');
        });

        it('should remove datagrid-detail-overlay class when detailWidth is no longer 100', () => {
          detailService.detailWidth = 100;
          context.detectChanges();
          expect(context.clarityElement.classList).toContain('datagrid-detail-overlay');

          detailService.detailWidth = 80;
          context.detectChanges();
          expect(context.clarityElement.classList).not.toContain('datagrid-detail-overlay');
        });
      });

      describe('initialize datagrid with opened detail', () => {
        let context: TestContext<ClrDatagrid, PanelInitializeOpenedTest>;

        beforeEach(() => {
          context = helpers.create(ClrDatagrid, PanelInitializeOpenedTest, DATAGRID_SPEC_PROVIDERS);
        });

        it('should be with opened panel and one column visible', () => {
          const hiddenColumns = context.clarityElement.querySelectorAll('[role=columnheader].datagrid-hidden-column');

          /* make sure that the state is set */
          expect(hiddenColumns.length).toEqual(1);
        });
      });
    });
  });
});
