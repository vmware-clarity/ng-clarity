/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Type } from '@clr/angular/emphasis/common';

import { ClrLabel } from './label';

@Component({
  template: `
    @if (show()) {
      <clr-label
        [clrColor]="color()"
        [clrText]="text()"
        [clrBadgeText]="badgeText()"
        [clrType]="type()"
        [clrClickable]="clickable()"
        [clrDisabled]="disabled()"
        (click)="clicks.set(clicks() + 1)"
        >{{ projected() }}</clr-label
      >
    }
  `,
  imports: [ClrLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly show = signal(true);
  readonly color = signal('');
  readonly text = signal('');
  readonly badgeText = signal('');
  readonly type = signal<Type | string>(Type.Outlined);
  readonly clickable = signal(false);
  readonly disabled = signal(false);
  readonly projected = signal('Projected');
  readonly clicks = signal(0);
}

/** A zone-era consumer: an Eager host with plain fields that relies on the next tick. */
@Component({
  template: `<clr-label [clrText]="text" [clrBadgeText]="badgeText" [clrColor]="color">{{ projected }}</clr-label>`,
  imports: [ClrLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  text = '';
  badgeText = '';
  color = '';
  projected = 'Eager';
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrLabel (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  function labelElement(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-label');
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('updates the text, badge, classes and attributes when host signals change', async () => {
    host.text.set('Name');
    host.badgeText.set('42');
    host.color.set('blue');
    host.type.set(Type.Solid);
    host.clickable.set(true);
    await fixture.whenStable();

    expect(labelElement().querySelector('.text').textContent).toBe('Name');
    expect(labelElement().querySelector('clr-badge').textContent).toBe('42');
    expect(labelElement().classList).toContain('label-blue');
    expect(labelElement().classList).toContain('solid');
    expect(labelElement().getAttribute('role')).toBe('button');
    expect(labelElement().getAttribute('tabindex')).toBe('0');

    host.disabled.set(true);
    await fixture.whenStable();
    expect(labelElement().getAttribute('tabindex')).toBeNull();
    expect(labelElement().getAttribute('aria-disabled')).toBe('true');

    host.text.set('');
    host.badgeText.set('');
    await fixture.whenStable();
    expect(labelElement().querySelector('.text')).toBeNull();
    expect(labelElement().querySelector('clr-badge')).toBeNull();
  });

  it('updates projected content', async () => {
    host.projected.set('Changed');
    await fixture.whenStable();
    expect(labelElement().textContent.trim()).toBe('Changed');
  });

  it('renders an update made after an async task', async () => {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        host.badgeText.set('later');
        resolve();
      })
    );
    await fixture.whenStable();
    expect(labelElement().querySelector('clr-badge').textContent).toBe('later');
  });

  it('keeps blocking clicks after the disabled state changes, and is removed cleanly', async () => {
    host.clickable.set(true);
    host.disabled.set(true);
    await fixture.whenStable();
    labelElement().click();
    expect(host.clicks()).toBe(0);

    host.disabled.set(false);
    await fixture.whenStable();
    labelElement().click();
    expect(host.clicks()).toBe(1);

    host.show.set(false);
    await fixture.whenStable();
    expect(labelElement()).toBeNull();

    host.show.set(true);
    await fixture.whenStable();
    expect(labelElement().textContent.trim()).toBe('Projected');
  });
});

describe('ClrLabel (Eager host, Zone tick)', () => {
  it('renders changed host fields on the next tick', () => {
    const fixture = TestBed.createComponent(EagerHost);
    zoneTick(fixture);

    Object.assign(fixture.componentInstance, { text: 'Text', badgeText: '3', color: 'info', projected: 'Changed' });
    zoneTick(fixture);

    const element: HTMLElement = fixture.nativeElement.querySelector('clr-label');
    expect(element.querySelector('.text').textContent).toBe('Text');
    expect(element.querySelector('clr-badge').textContent).toBe('3');
    expect(element.classList).toContain('label-info');
    expect(element.textContent).toContain('Changed');
  });
});

describe('ClrLabel (programmatic writes)', () => {
  it('renders values written to the component instance', async () => {
    const fixture = TestBed.createComponent(OnPushHost);
    await fixture.whenStable();
    const label: ClrLabel = fixture.debugElement.query(By.directive(ClrLabel)).componentInstance;

    label.textContent = 'Written';
    label.badgeText = '7';
    label.color = 'success';
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement.querySelector('clr-label');
    expect(element.querySelector('.text').textContent).toBe('Written');
    expect(element.querySelector('clr-badge').textContent).toBe('7');
    expect(element.classList).toContain('label-success');
  });
});
