/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrDatagridModule } from './datagrid.module';

interface Node {
  name: string;
}

@Component({
  template: `
    @if (selectable) {
      <clr-datagrid clrDgSelectionType="multi" [(clrDgSelected)]="selected">
        <clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        </clr-dg-row>
      </clr-datagrid>
    } @else {
      <clr-datagrid>
        <clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        </clr-dg-row>
      </clr-datagrid>
    }
  `,
  standalone: false,
})
class TestComponent {
  selectable = true;
  items: Node[] = [{ name: 'node-1' }, { name: 'node-2' }];
  selected: Node[] = [];
}

describe('ClrDatagrid selection, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  function grid(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="grid"]');
  }

  function dataRows(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('clr-dg-row [role="row"]'));
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

  it('declares that more than one row may be selected', () => {
    expect(grid().getAttribute('aria-multiselectable')).toBe('true');
  });

  it('reports every row as unselected before anything is chosen', () => {
    expect(dataRows().map(row => row.getAttribute('aria-selected'))).toEqual(['false', 'false']);
  });

  it('reports a row as selected once it is chosen', () => {
    fixture.componentInstance.selected = [fixture.componentInstance.items[0]];
    fixture.detectChanges();

    expect(dataRows().map(row => row.getAttribute('aria-selected'))).toEqual(['true', 'false']);
  });

  it('says nothing about selection in a grid whose rows cannot be selected', () => {
    fixture.componentInstance.selectable = false;
    fixture.detectChanges();

    expect(grid().hasAttribute('aria-multiselectable')).toBe(false);
    expect(dataRows().every(row => !row.hasAttribute('aria-selected'))).toBe(true);
  });
});
