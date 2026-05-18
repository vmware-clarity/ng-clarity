/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClrRadioModule } from '@clr/angular/forms/radio';

import { ClrDatagridSingleSelectionValueAccessor } from './datagrid-single-selection.directive';

interface RowItem {
  id: number;
  name: string;
}

@Component({
  standalone: false,
  template: `
    <input
      #radio
      type="radio"
      clrRadio
      clrDgSingleSelectionRadio
      [clrDgIdentityFn]="identifyBy"
      name="test-radio"
      [value]="rowItem"
      [ngModel]="selected"
    />
  `,
})
class TestHostComponent {
  rowItem: RowItem | undefined;
  selected: RowItem | undefined;
  identifyBy: ((item: RowItem) => unknown) | undefined = (item: RowItem) => item.id;
}

export default function (): void {
  describe('ClrDatagridSingleSelectionValueAccessor', function () {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let radio: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TestHostComponent],
        imports: [FormsModule, ClrRadioModule, ClrDatagridSingleSelectionValueAccessor],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      host = fixture.componentInstance;
      radio = fixture.debugElement.nativeElement.querySelector('input[type=radio]') as HTMLInputElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('does not mark the radio as checked when there is no selection and the row item is a placeholder', async () => {
      host.rowItem = undefined;
      host.selected = undefined;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(false);
    });

    it('does not mark the radio as checked when there is no selection but the row item is real', async () => {
      host.rowItem = { id: 1, name: 'a' };
      host.selected = undefined;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(false);
    });

    it('does not mark the radio as checked when row item is a placeholder even if selection exists', async () => {
      host.rowItem = undefined;
      host.selected = { id: 1, name: 'a' };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(false);
    });

    it('marks the radio as checked when selection identity matches the row item', async () => {
      const item = { id: 1, name: 'a' };
      host.rowItem = item;
      host.selected = item;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(true);
    });

    it('marks the radio as checked when selection matches the row item by identifyBy id (different reference)', async () => {
      host.rowItem = { id: 1, name: 'a' };
      host.selected = { id: 1, name: 'a-clone' };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(true);
    });

    it('does not mark the radio as checked when identities differ', async () => {
      host.rowItem = { id: 1, name: 'a' };
      host.selected = { id: 2, name: 'b' };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(false);
    });

    it('falls back to reference equality when no identifyBy is provided', async () => {
      host.identifyBy = undefined;
      const item = { id: 1, name: 'a' };
      host.rowItem = item;
      host.selected = item;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(true);

      host.selected = { id: 1, name: 'a' };
      fixture.detectChanges();
      await fixture.whenStable();
      expect(radio.checked).toBe(false);
    });
  });
}
