/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDatagridModule } from './datagrid.module';

@Component({
  template: `
    <clr-datagrid>
      @for (column of columns(); track column.id) {
        <clr-dg-column [clrDgPinnable]="true" [clrDgPinned]="column.pinned">{{ column.id }}</clr-dg-column>
      }
      <clr-dg-row *clrDgItems="let item of items">
        @for (column of columns(); track column.id) {
          <clr-dg-cell>{{ column.id }}</clr-dg-cell>
        }
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SeparatorHost {
  readonly columns = signal([
    { id: 'First', pinned: false },
    { id: 'Second', pinned: false },
    { id: 'Third', pinned: false },
  ]);
  readonly items = [1];
}

describe('Column separators (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<SeparatorHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SeparatorHost],
      imports: [ClrDatagridModule],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });
    fixture = TestBed.createComponent(SeparatorHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  function separator(title: string) {
    const columns = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-dg-column'));
    return !!columns
      .find(column => column.querySelector('.datagrid-column-title')?.textContent.trim() === title)
      ?.querySelector('clr-dg-column-separator');
  }

  function pin(id: string, pinned: boolean) {
    fixture.componentInstance.columns.update(columns =>
      columns.map(column => (column.id === id ? { ...column, pinned } : column))
    );
  }

  it('updates separators when the first column is pinned', async () => {
    pin('First', true);
    await fixture.whenStable();
    expect(separator('First')).toBe(true);
    expect(separator('Second')).toBe(true);
    expect(separator('Third')).toBe(false);
  });

  it('moves the last separator when the last column is pinned and unpinned', async () => {
    pin('Third', true);
    await fixture.whenStable();
    expect(separator('Third')).toBe(true);
    expect(separator('Second')).toBe(false);
    pin('Third', false);
    await fixture.whenStable();
    expect(separator('Third')).toBe(false);
    expect(separator('Second')).toBe(true);
  });

  it('updates separators when columns are reordered with a pinned column', async () => {
    pin('First', true);
    await fixture.whenStable();
    fixture.componentInstance.columns.update(([first, second, third]) => [first, third, second]);
    await fixture.whenStable();
    expect(separator('First')).toBe(true);
    expect(separator('Third')).toBe(true);
    expect(separator('Second')).toBe(false);
  });
});
