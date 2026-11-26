/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrProgressBar } from './progress-bar';
import { ClrProgressBarModule } from './progress-bar.module';

@Component({
  template: `
    @if (show()) {
      <clr-progress-bar
        [id]="id()"
        [clrValue]="value()"
        [clrMax]="max()"
        [clrDisplayval]="displayval()"
        [clrLabeled]="labeled()"
        [clrColor]="color()"
      ></clr-progress-bar>
    }
  `,
  imports: [ClrProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly show = signal(true);
  readonly id = signal('progress');
  readonly value = signal<number | string>(10);
  readonly max = signal<number | string>(100);
  readonly displayval = signal<string>(undefined);
  readonly labeled = signal(false);
  readonly color = signal('');
}

/** A zone-era consumer: an Eager host with plain fields that relies on the next tick. */
@Component({
  template: `<clr-progress-bar
    clrLabeled
    [clrValue]="value"
    [clrMax]="max"
    [clrDisplayval]="displayval"
  ></clr-progress-bar>`,
  imports: [ClrProgressBarModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  value = 0;
  max = 100;
  displayval: string;
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrProgressBar (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  function hostElement(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-progress-bar');
  }

  function progress(): HTMLProgressElement {
    return fixture.nativeElement.querySelector('progress');
  }

  function label(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-progress-bar span');
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('updates the progress element when host signals change', async () => {
    host.value.set(40);
    host.max.set(80);
    host.id.set('changed');
    await fixture.whenStable();

    expect(progress().getAttribute('value')).toBe('40');
    expect(progress().getAttribute('max')).toBe('80');
    expect(progress().getAttribute('data-displayval')).toBe('40%');
    expect(progress().id).toBe('changed');
  });

  it('shows and hides the label and follows the display value', async () => {
    expect(label()).toBeNull();

    host.labeled.set(true);
    await fixture.whenStable();
    expect(label().textContent).toBe('10%');

    host.displayval.set('Ten of a hundred');
    await fixture.whenStable();
    expect(label().textContent).toBe('Ten of a hundred');

    host.labeled.set(false);
    await fixture.whenStable();
    expect(label()).toBeNull();
  });

  it('updates its host classes when the color changes', async () => {
    host.color.set('success');
    await fixture.whenStable();
    expect(hostElement().classList).toContain('success');

    host.color.set('danger');
    await fixture.whenStable();
    expect(hostElement().classList).not.toContain('success');
    expect(hostElement().classList).toContain('danger');
  });

  it('renders values that arrive after an async task', async () => {
    host.labeled.set(true);
    await fixture.whenStable();

    for (const value of [20, 60, 100]) {
      await new Promise<void>(resolve =>
        setTimeout(() => {
          host.value.set(value);
          resolve();
        })
      );
      await fixture.whenStable();
      expect(progress().getAttribute('value')).toBe(String(value));
      expect(label().textContent).toBe(`${value}%`);
    }
  });

  it('is created again with the current values after it was removed', async () => {
    host.show.set(false);
    await fixture.whenStable();
    expect(progress()).toBeNull();

    host.value.set(55);
    host.show.set(true);
    await fixture.whenStable();
    expect(progress().getAttribute('value')).toBe('55');
  });
});

describe('ClrProgressBar (Eager host, Zone tick)', () => {
  it('renders changed host fields on the next tick', () => {
    const fixture = TestBed.createComponent(EagerHost);
    zoneTick(fixture);

    Object.assign(fixture.componentInstance, { value: 30, max: 60, displayval: 'Half' });
    zoneTick(fixture);

    const progress: HTMLProgressElement = fixture.nativeElement.querySelector('progress');
    expect(progress.getAttribute('value')).toBe('30');
    expect(progress.getAttribute('max')).toBe('60');
    expect(fixture.nativeElement.querySelector('clr-progress-bar span').textContent).toBe('Half');
  });
});

describe('ClrProgressBar (programmatic writes)', () => {
  it('renders values written to the component instance', async () => {
    const fixture = TestBed.createComponent(OnPushHost);
    await fixture.whenStable();
    const bar: ClrProgressBar = fixture.debugElement.query(By.directive(ClrProgressBar)).componentInstance;

    bar.value = 55;
    bar.max = 200;
    bar.color = 'danger';
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement.querySelector('clr-progress-bar');
    const progress = element.querySelector('progress');
    expect(progress.getAttribute('value')).toBe('55');
    expect(progress.getAttribute('max')).toBe('200');
    expect(element.classList).toContain('danger');
  });
});
