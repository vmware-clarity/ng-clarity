/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrContextEngineService } from '@clr/angular/ai';
import { publishedState } from '@clr/angular/testing';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { ClrDatagridModule } from './datagrid.module';

/** The state the fixture's datagrid publishes. */
function gridState(fixture: ComponentFixture<unknown>, options: ClrContextSnapshotOptions = {}) {
  return publishedState(fixture.nativeElement.querySelector('clr-datagrid'), options);
}

interface Node {
  name: string;
  status: string;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'" [clrFilterValue]="nameFilter">Name</clr-dg-column>
      <clr-dg-column [clrDgField]="'status'">
        <ng-container *clrDgHideableColumn="{ hidden: hideStatus }">Status</ng-container>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer>
        <clr-dg-pagination [clrDgPageSize]="2" [clrDgTotalItems]="total"></clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  standalone: false,
})
class TestComponent {
  total = 4210;
  hideStatus = false;
  nameFilter = '';
  items: Node[] = [
    { name: 'node-1', status: 'ok' },
    { name: 'node-2', status: 'down' },
  ];
}

describe('ClrDatagrid element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('publishes the total row count, which the rendered page cannot show', () => {
    // The DOM holds two rows; the grid holds 4210. Only the component knows the total.
    expect(gridState(fixture).totalRows).toBe(4210);
  });

  it('publishes which columns are filtered, which a closed filter popover cannot show', async () => {
    fixture.componentInstance.nameFilter = 'node-1';
    fixture.detectChanges();
    await fixture.whenStable();

    // Named as the grid's summary names its columns: by header text.
    expect(gridState(fixture).filteredColumns).toEqual(['Name']);
  });

  it('publishes nothing about filters while none are applied', () => {
    expect('filteredColumns' in gridState(fixture)).toBe(false);
  });

  it('publishes which columns are hidden, which the DOM cannot show', () => {
    fixture.componentInstance.hideStatus = true;
    fixture.detectChanges();
    expect(gridState(fixture).hiddenColumns).toEqual(['Status']);
  });

  it('says nothing about selection while rows cannot be selected', () => {
    expect(JSON.stringify(gridState(fixture))).not.toMatch(/"(selectionMode|rows|selection)"/);
  });

  it('publishes nothing about hidden columns while every column is shown', () => {
    expect('hiddenColumns' in gridState(fixture)).toBe(false);
  });

  it('stops publishing once the datagrid is destroyed', () => {
    const host = fixture.nativeElement.querySelector('clr-datagrid');
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(false);
  });
});

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class UnpaginatedTestComponent {
  items: Node[] = [{ name: 'node-1', status: 'ok' }];
}

describe('ClrDatagrid element context without pagination', () => {
  it('publishes no total, since the rows on the page are the rows', () => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, NoopAnimationsModule],
      declarations: [UnpaginatedTestComponent],
    });
    const fixture = TestBed.createComponent(UnpaginatedTestComponent);
    fixture.detectChanges();

    expect('totalRows' in gridState(fixture)).toBe(false);
    fixture.destroy();
  });
});

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'" [clrFilterValue]="filter">Name</clr-dg-column>
      <clr-dg-column [clrDgField]="'salary'" data-clr-context-redact [clrFilterValue]="filter">
        <ng-container *clrDgHideableColumn="{ hidden: true }">Salary</ng-container>
      </clr-dg-column>
      <clr-dg-column [clrDgField]="'ssn'" [clrFilterValue]="filter">
        <span data-clr-context-redact>Social security number</span>
      </clr-dg-column>
      <clr-dg-column [clrDgField]="'code'" class="internal">
        <ng-container *clrDgHideableColumn="{ hidden: true }">Code</ng-container>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class WithheldColumnTestComponent {
  // Matches no row, so that every column with it counts as filtered.
  filter = 'zzz';
  items: Node[] = [{ name: 'node-1', status: 'ok' }];
}

describe('ClrDatagrid element context, columns the application keeps from agents', () => {
  let fixture: ComponentFixture<WithheldColumnTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, NoopAnimationsModule],
      declarations: [WithheldColumnTestComponent],
    });
    fixture = TestBed.createComponent(WithheldColumnTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('names neither a redacted column nor one whose header text is withheld, not even by its field', () => {
    const state = gridState(fixture);

    expect(state['filteredColumns']).toEqual(['Name']);
    expect(JSON.stringify(state)).not.toMatch(/salary|ssn|social/i);
  });

  it('leaves out a column the snapshot excludes, matched on the column itself', () => {
    expect(gridState(fixture)['hiddenColumns']).toEqual(['Code']);
    expect('hiddenColumns' in gridState(fixture, { excludeSelectors: ['clr-datagrid .internal'] })).toBe(false);
  });
});

interface Account {
  name: string;
  status: string;
  number: string;
}

const ACCOUNTS: Account[] = [
  { name: 'checking', status: 'open', number: '4111-01' },
  { name: 'savings', status: 'frozen', number: '4111-02' },
  { name: 'brokerage', status: 'open', number: '4111-03' },
];

@Component({
  template: `
    <clr-datagrid clrDgSelectionType="multi" [(clrDgSelected)]="selected">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Status</clr-dg-column>
      <clr-dg-column>Number</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
        <clr-dg-cell data-clr-context-redact>{{ item.number }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class MultiSelectionTestComponent {
  items = ACCOUNTS;
  selected: Account[] = [ACCOUNTS[1]];
}

@Component({
  template: `
    <clr-datagrid clrDgSelectionType="single" [(clrDgSelected)]="selected">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Status</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class SingleSelectionTestComponent {
  items = ACCOUNTS;
  selected: Account[] = [ACCOUNTS[2]];
}

describe('ClrDatagrid element context, selection', () => {
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, NoopAnimationsModule],
      declarations: [MultiSelectionTestComponent, SingleSelectionTestComponent],
    });
  });

  afterEach(() => fixture?.destroy());

  async function create(component: Type<unknown>) {
    fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('lists the rows of a multi-select grid and which are selected, by their content', async () => {
    await create(MultiSelectionTestComponent);
    const state = gridState(fixture);

    expect(state['selectionMode']).toBe('multi');
    // By the cells the user sees, without the selection cell the grid adds and without
    // a cell the application redacts.
    expect(state['rows']).toEqual(['checking | open', 'savings | frozen', 'brokerage | open']);
    expect(state['selection']).toEqual(['savings | frozen']);
    expect(JSON.stringify(state)).not.toContain('4111');
  });

  it('says which row of a single-select grid is selected', async () => {
    await create(SingleSelectionTestComponent);
    const state = gridState(fixture);

    expect(state['selectionMode']).toBe('single');
    expect(state['selection']).toEqual(['brokerage | open']);
  });

  it('says nothing is selected by leaving the selection out', async () => {
    await create(MultiSelectionTestComponent);
    (fixture.componentInstance as MultiSelectionTestComponent).selected = [];
    fixture.detectChanges();

    expect('selection' in gridState(fixture)).toBe(false);
  });

  it('holds the rows to the collection budget, and leaves them out of a summary snapshot', async () => {
    await create(MultiSelectionTestComponent);

    expect(gridState(fixture, { maxItemsPerCollection: 2 })['rows']).toEqual(['checking | open', 'savings | frozen']);
    const summary = gridState(fixture, { collectionItems: 'summary' });
    expect('rows' in summary).toBe(false);
    expect(summary['selection']).toEqual(['savings | frozen']);
  });

  it('withholds the rows and the selection from a consumer the application does not control', async () => {
    await create(MultiSelectionTestComponent);
    const engine = TestBed.inject(ClrContextEngineService);

    expect(JSON.stringify(engine.getSnapshot().components)).toContain('"selection"');
    engine.enableGlobalAccess('testDatagridClrContext');
    try {
      const accessor = (window as unknown as Record<string, () => unknown>)['testDatagridClrContext'];
      const shared = JSON.stringify(accessor());

      expect(shared).toContain('"selectionMode":"multi"');
      expect(shared).not.toMatch(/"(rows|selection)"|savings \| frozen|4111/);
    } finally {
      engine.disableGlobalAccess();
    }
  });
});
