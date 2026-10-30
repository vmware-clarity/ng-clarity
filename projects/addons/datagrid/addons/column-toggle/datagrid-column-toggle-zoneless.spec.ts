/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { DatagridColumnToggleComponent } from './datagrid-column-toggle.component';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';

@Component({
  template: `@if (show()) {
    <appfx-dg-column-toggle [columns]="columns"></appfx-dg-column-toggle>
  }`,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ToggleHost {
  readonly show = signal(true);
  readonly columns = [
    { uid: 'name', displayName: 'Name', field: 'name' },
    { uid: 'state', displayName: 'State', field: 'state' },
  ];
}

for (const zoneless of [false, true]) {
  describe(`Column toggle (${zoneless ? 'zoneless' : 'zone-based'}, OnPush host)`, () => {
    let fixture: ComponentFixture<ToggleHost>;
    let trigger: HTMLButtonElement;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ToggleHost, DatagridColumnToggleComponent],
        imports: [CommonModule, FormsModule, OverlayModule, A11yModule, ClarityModule],
        providers: [
          DatagridStrings,
          zoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection(),
          provideCheckNoChangesConfig({ exhaustive: true }),
        ],
      });
      fixture = TestBed.createComponent(ToggleHost);
      fixture.autoDetectChanges();
      await fixture.whenStable();
      trigger = fixture.nativeElement.querySelector('.column-toggle-action');
    });
    afterEach(() => fixture.destroy());

    it('links the trigger to the attached overlay and clears the relationship on close', async () => {
      trigger.click();
      await fixture.whenStable();
      const id = trigger.getAttribute('aria-controls');
      expect(id).toBeTruthy();
      expect(trigger.getAttribute('aria-owns')).toBe(id);
      expect(document.getElementById(id).querySelector('[role="dialog"]')).not.toBeNull();
      (document.querySelector('.switch-header button') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(trigger.getAttribute('aria-controls')).toBeNull();
      expect(trigger.getAttribute('aria-owns')).toBeNull();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('clears the overlay relationship after a native backdrop click', async () => {
      trigger.click();
      await fixture.whenStable();
      (document.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
      await fixture.whenStable();
      expect(trigger.getAttribute('aria-controls')).toBeNull();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('can be destroyed with an attached overlay', async () => {
      trigger.click();
      await fixture.whenStable();
      fixture.componentInstance.show.set(false);
      await fixture.whenStable();
      expect(document.querySelector('.column-switch')).toBeNull();
    });
  });
}
