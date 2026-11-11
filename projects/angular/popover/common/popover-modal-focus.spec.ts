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
import { ClrDatagridModule } from '@clr/angular/data/datagrid';
import { ClrModalModule } from '@clr/angular/modal';
import { enableCssAnimations } from '@clr/angular/testing';

@Component({
  template: `
    <clr-modal [clrModalOpen]="open()" [clrModalSkipAnimation]="false">
      <h2 class="modal-title">Modal with actions</h2>
      <div class="modal-body">
        @if (open()) {
          <clr-datagrid>
            <clr-dg-column>Name</clr-dg-column>
            <clr-dg-row>
              <clr-dg-action-overflow [clrDgActionOverflowOpen]="true">
                <button class="action-item">Edit</button>
                <button class="action-item">Delete</button>
              </clr-dg-action-overflow>
              <clr-dg-cell>Item</clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        }
      </div>
    </clr-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ModalActionsHost {
  readonly open = signal(true);
}

describe('Popover focus in a zoneless modal', () => {
  let fixture: ComponentFixture<ModalActionsHost>;
  let restoreAnimations: () => void;

  beforeEach(async () => {
    restoreAnimations = enableCssAnimations();
    TestBed.configureTestingModule({
      declarations: [ModalActionsHost],
      animationsEnabled: true,
      imports: [ClrModalModule, ClrDatagridModule],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });
    fixture = TestBed.createComponent(ModalActionsHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });
  afterEach(() => {
    fixture.destroy();
    restoreAnimations();
  });

  it('keeps the initial action focused after the animated modal settles', async () => {
    const animations = fixture.nativeElement.querySelector('.modal-dialog').getAnimations();
    expect(animations.length).toBeGreaterThan(0);
    await Promise.all(animations.map((animation: Animation) => animation.finished));
    await fixture.whenStable();
    expect(document.activeElement).toBe(document.querySelector('.datagrid-action-overflow .action-item'));
    expect(document.activeElement.textContent).toBe('Edit');
  });

  it('keeps the action menu focused when modal and menu are recreated together', async () => {
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(document.activeElement).toBe(document.querySelector('.datagrid-action-overflow .action-item'));
    expect(document.activeElement.textContent).toBe('Edit');
  });
});
