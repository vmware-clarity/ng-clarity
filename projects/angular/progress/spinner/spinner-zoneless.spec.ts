/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrSpinnerModule } from './spinner.module';

@Component({
  template: `
    @if (show()) {
      <clr-spinner [clrInline]="inline()" [clrSmall]="small()" [clrMedium]="medium()">{{ text() }}</clr-spinner>
    }
  `,
  imports: [ClrSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly show = signal(true);
  readonly inline = signal(false);
  readonly small = signal(false);
  readonly medium = signal(false);
  readonly text = signal('Loading');
}

/** A zone-era consumer: an Eager host with plain fields that relies on the next tick. */
@Component({
  template: `<clr-spinner [clrSmall]="small">{{ text }}</clr-spinner>`,
  imports: [ClrSpinnerModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  small = false;
  text = 'Loading';
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrSpinner (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  function spinner(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-spinner');
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('updates its size classes and projected text when host signals change', async () => {
    host.medium.set(true);
    host.inline.set(true);
    host.text.set('Saving');
    await fixture.whenStable();
    expect(Array.from(spinner().classList).sort()).toEqual(['spinner', 'spinner-inline', 'spinner-md']);
    expect(spinner().textContent).toBe('Saving');

    host.small.set(true);
    await fixture.whenStable();
    expect(Array.from(spinner().classList).sort()).toEqual(['spinner', 'spinner-inline', 'spinner-sm']);
  });

  it('is removed and created again', async () => {
    host.show.set(false);
    await fixture.whenStable();
    expect(spinner()).toBeNull();

    host.show.set(true);
    await fixture.whenStable();
    expect(spinner().getAttribute('aria-busy')).toBe('true');
  });
});

describe('ClrSpinner (Eager host, Zone tick)', () => {
  it('renders changed host fields on the next tick', () => {
    const fixture = TestBed.createComponent(EagerHost);
    zoneTick(fixture);

    fixture.componentInstance.small = true;
    fixture.componentInstance.text = 'Saving';
    zoneTick(fixture);

    const spinner: HTMLElement = fixture.nativeElement.querySelector('clr-spinner');
    expect(spinner.classList).toContain('spinner-sm');
    expect(spinner.textContent).toBe('Saving');
  });
});
