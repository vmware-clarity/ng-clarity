/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrComboboxModule } from './combobox.module';

type ElementContextCallback = (options: { includeFormValues?: boolean; maxItemsPerCollection?: number }) => {
  type: string;
  state: Record<string, unknown>;
};

@Component({
  template: `
    <clr-combobox name="fruit" [(ngModel)]="selection">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
        <clr-option clrValue="pear">Pear</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestComponent {
  selection: string | null = 'apple';
}

describe('ClrCombobox element context', () => {
  let fixture: ComponentFixture<TestComponent>;
  let host: HTMLElement;

  function publishedContext(options: Parameters<ElementContextCallback>[0] = {}) {
    const callback = (host as HTMLElement & { clrElementContext?: ElementContextCallback }).clrElementContext;
    if (!callback) {
      throw new Error('expected the combobox to publish a clrElementContext callback');
    }
    return callback(options);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('clr-combobox');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('publishes a context callback on its host element', () => {
    const context = publishedContext();

    expect(context.type).toBe('combobox');
    expect(context.state.multiSelect).toBe(false);
  });

  it('lists its options even while the popover is closed', () => {
    const context = publishedContext({ maxItemsPerCollection: 25 });

    expect(context.state.options).toEqual(['Apple', 'Pear']);
    expect(context.state.optionsAvailable).toBeUndefined();
  });

  it('exposes the selection only when form values are opted in', () => {
    expect(publishedContext().state.value).toBeUndefined();
    expect(publishedContext({ includeFormValues: true }).state.value).toBe('apple');
  });

  it('lists the same options while the popover is open, without screen reader additions', () => {
    fixture.nativeElement.querySelector('button.clr-combobox-trigger').click();
    fixture.detectChanges();

    const context = publishedContext({ maxItemsPerCollection: 25 });

    expect(context.state.options).toEqual(['Apple', 'Pear']);
  });

  it('caps the option list to the collection budget', () => {
    expect(publishedContext({ maxItemsPerCollection: 1 }).state.options).toEqual(['Apple']);
  });

  it('removes the callback when the combobox is destroyed', () => {
    fixture.destroy();

    expect((host as HTMLElement & { clrElementContext?: unknown }).clrElementContext).toBeUndefined();
  });
});
