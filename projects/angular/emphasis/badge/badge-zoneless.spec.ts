/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@clr/angular/emphasis/common';

import { ClrBadge } from './badge';

@Component({
  template: `
    @if (show()) {
      <clr-badge [clrColor]="color()" [clrType]="type()">{{ count() }}</clr-badge>
    }
  `,
  imports: [ClrBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly show = signal(true);
  readonly color = signal('');
  readonly type = signal<Type | string>(Type.Solid);
  readonly count = signal(1);
}

/** A zone-era consumer: an Eager host with plain fields that relies on the next tick. */
@Component({
  template: `<clr-badge [clrColor]="color">{{ count }}</clr-badge>`,
  imports: [ClrBadge],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  color = '';
  count = 2;
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrBadge (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  function badgeElement(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-badge');
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('updates its classes and projected content when host signals change', async () => {
    host.color.set('danger');
    host.type.set(Type.Outlined);
    host.count.set(5);
    await fixture.whenStable();

    expect(badgeElement().classList).toContain('outlined');
    expect(badgeElement().classList).toContain('badge-danger');
    expect(badgeElement().textContent).toBe('5');
  });

  it('is created again after it was removed', async () => {
    host.show.set(false);
    await fixture.whenStable();
    expect(badgeElement()).toBeNull();

    host.count.set(9);
    host.show.set(true);
    await fixture.whenStable();
    expect(badgeElement().textContent).toBe('9');
  });
});

describe('ClrBadge (Eager host, Zone tick)', () => {
  it('renders changed host fields on the next tick', () => {
    const fixture = TestBed.createComponent(EagerHost);
    zoneTick(fixture);

    fixture.componentInstance.color = 'success';
    fixture.componentInstance.count = 3;
    zoneTick(fixture);

    const badge: HTMLElement = fixture.nativeElement.querySelector('clr-badge');
    expect(badge.classList).toContain('badge-success');
    expect(badge.textContent).toBe('3');
  });
});
