/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions, ClrElementContextCallback } from '@clr/angular/utils';

import { ClrDatagridModule } from './datagrid.module';

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

  const budgets: Required<ClrContextSnapshotOptions> = {
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
    includeText: true,
    includeFrames: true,
    excludeCategories: [],
    excludeRoles: [],
    excludeSelectors: [],
    rootSelector: '',
    maxDepth: 0,
    focus: 'page',
    collectionItems: 'all',
    includeRoutes: false,
  };

  function published(): ReturnType<ClrElementContextCallback> {
    const host = fixture.nativeElement.querySelector('clr-datagrid') as HTMLElement & {
      [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback;
    };
    const callback = host[CLR_ELEMENT_CONTEXT_PROPERTY];
    if (!callback) {
      throw new Error('expected the datagrid to publish an element context callback');
    }
    return callback(budgets);
  }

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
    expect(published()?.state?.totalRows).toBe(4210);
  });

  it('publishes which columns are filtered, which a closed filter popover cannot show', async () => {
    fixture.componentInstance.nameFilter = 'node-1';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(published()?.state?.filteredColumns).toEqual(['name']);
  });

  it('publishes nothing about filters while none are applied', () => {
    expect('filteredColumns' in (published()?.state ?? {})).toBe(false);
  });

  it('publishes which columns are hidden, which the DOM cannot show', () => {
    fixture.componentInstance.hideStatus = true;
    fixture.detectChanges();
    expect(published()?.state?.hiddenColumns).toEqual(['status']);
  });

  it('publishes nothing about hidden columns while every column is shown', () => {
    expect('hiddenColumns' in (published()?.state ?? {})).toBe(false);
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
    const host = fixture.nativeElement.querySelector('clr-datagrid') as HTMLElement & {
      [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback;
    };
    const published = host[CLR_ELEMENT_CONTEXT_PROPERTY];

    const budgets = {
      maxTextLength: 100,
      maxItemsPerCollection: 25,
      maxComponents: 100,
      includeDomComponents: true,
      includeText: true,
      includeFrames: true,
      excludeCategories: [],
      excludeRoles: [],
      excludeSelectors: [],
      rootSelector: '',
      maxDepth: 0,
      focus: 'page',
      collectionItems: 'all',
      includeRoutes: false,
    } as Required<ClrContextSnapshotOptions>;

    expect(published && 'totalRows' in (published(budgets)?.state ?? {})).toBeFalsy();
    fixture.destroy();
  });
});
