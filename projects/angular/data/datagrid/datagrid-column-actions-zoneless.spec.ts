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
    @if (show()) {
      <clr-datagrid>
        <clr-dg-column>
          <span>{{ title() }}</span>
          <clr-dg-column-actions></clr-dg-column-actions>
        </clr-dg-column>
        <clr-dg-row><clr-dg-cell>Value</clr-dg-cell></clr-dg-row>
      </clr-datagrid>
    }
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ColumnActionsHost {
  readonly title = signal('Name');
  readonly show = signal(true);
}

describe('Column action labels (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ColumnActionsHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ColumnActionsHost],
      imports: [ClrDatagridModule],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });
    fixture = TestBed.createComponent(ColumnActionsHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  function label() {
    return fixture.nativeElement.querySelector('.datagrid-column-actions-toggle')?.getAttribute('aria-label');
  }

  it('uses the initially projected title without changing bindings during a check', () => {
    expect(label()).toBe('Name column actions');
  });

  it('updates when the projected title changes', async () => {
    fixture.componentInstance.title.set('Updated name');
    await fixture.whenStable();
    expect(label()).toBe('Updated name column actions');
  });

  it('uses the generic label for a blank title and follows a later title', async () => {
    fixture.componentInstance.title.set('   ');
    await fixture.whenStable();
    expect(label()).toBe('Column actions');
    fixture.componentInstance.title.set('Restored');
    await fixture.whenStable();
    expect(label()).toBe('Restored column actions');
  });

  it('stops updating when the datagrid is destroyed', async () => {
    fixture.componentInstance.show.set(false);
    await fixture.whenStable();
    fixture.componentInstance.title.set('After destroy');
    await fixture.whenStable();
    expect(label()).toBeUndefined();
  });
});
