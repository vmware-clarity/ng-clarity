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
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
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
  items: Node[] = [{ name: 'node-1' }, { name: 'node-2' }];
}

describe('ClrDatagrid element context', () => {
  let fixture: ComponentFixture<TestComponent>;

  const budgets: Required<ClrContextSnapshotOptions> = {
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 100,
    includeDomComponents: true,
    includeActions: true,
    includeFormValues: false,
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
    expect(published()?.state?.rowCount).toBe(4210);
  });

  it('stops publishing once the datagrid is destroyed', () => {
    const host = fixture.nativeElement.querySelector('clr-datagrid');
    fixture.destroy();

    expect(CLR_ELEMENT_CONTEXT_PROPERTY in host).toBe(false);
  });
});
