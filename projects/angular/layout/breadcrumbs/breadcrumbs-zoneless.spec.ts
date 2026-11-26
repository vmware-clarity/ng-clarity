/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrBreadcrumbs } from './breadcrumbs';
import { ClrBreadcrumbsModule } from './breadcrumbs.module';
import { BreadcrumbItem } from './model/breadcrumbs.model';

const HOME: BreadcrumbItem = { label: 'Home', routerLink: '/home' };
const HOSTS: BreadcrumbItem = { label: 'Hosts', routerLink: '/hosts' };
const HOST: BreadcrumbItem = { label: 'host-01' };

@Component({
  template: `
    @if (show()) {
      <clr-breadcrumbs [items]="items()" (clrBreadcrumbItemClick)="clicked.set($event)"></clr-breadcrumbs>
    }
  `,
  imports: [ClrBreadcrumbsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OnPushHost {
  readonly show = signal(true);
  readonly items = signal<BreadcrumbItem[]>([HOME, HOSTS, HOST]);
  readonly clicked = signal<BreadcrumbItem>(undefined);
}

/** A zone-era consumer: an Eager host with a plain field that relies on the next tick. */
@Component({
  template: `<clr-breadcrumbs [items]="items"></clr-breadcrumbs>`,
  imports: [ClrBreadcrumbsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class EagerHost {
  items: BreadcrumbItem[] = [{ ...HOME }, { ...HOSTS }, { label: 'host-01', href: '/host-01' }];
}

function labels(fixture: ComponentFixture<unknown>): string[] {
  return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-breadcrumb-item'))
    .map(item => item.textContent.trim())
    .filter(Boolean);
}

function expandButton(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('.clr-breadcrumb-expand');
}

/**
 * A Zone.js tick: refreshes every Eager view from the root and skips OnPush views that are not dirty.
 * (`fixture.detectChanges()` in a zoneless TestBed only refreshes views that were notified.)
 */
function zoneTick(fixture: ComponentFixture<unknown>) {
  fixture.componentRef.changeDetectorRef.detectChanges();
  fixture.checkNoChanges();
}

describe('ClrBreadcrumbs (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders the items and updates when the host gives a new array', async () => {
    expect(labels(fixture)).toEqual(['Home', 'Hosts', 'host-01']);
    expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent).toBe('host-01');

    host.items.set([HOME, { label: 'Clusters', routerLink: '/clusters' }, { label: 'cluster-01' }]);
    await fixture.whenStable();
    expect(labels(fixture)).toEqual(['Home', 'Clusters', 'cluster-01']);
  });

  it('collapses long trails and expands them on click', async () => {
    host.items.set([HOME, { label: 'A', href: '/a' }, { label: 'B', href: '/b' }, HOSTS, HOST]);
    await fixture.whenStable();
    expect(labels(fixture)).toEqual(['B', 'Hosts', 'host-01']);

    expandButton(fixture).click();
    await fixture.whenStable();
    expect(expandButton(fixture)).toBeNull();
    expect(labels(fixture)).toEqual(['Home', 'A', 'B', 'Hosts', 'host-01']);
  });

  it('expands from the keyboard', async () => {
    host.items.set([HOME, { label: 'A', href: '/a' }, { label: 'B', href: '/b' }, HOSTS, HOST]);
    await fixture.whenStable();

    expandButton(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(expandButton(fixture)).toBeNull();
    expect(labels(fixture).length).toBe(5);
  });

  it('renders items that arrive after an async task, starting from none', async () => {
    host.items.set([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.clr-breadcrumb-menu')).toBeNull();

    await new Promise<void>(resolve =>
      setTimeout(() => {
        host.items.set([HOME, HOST]);
        resolve();
      })
    );
    await fixture.whenStable();
    expect(labels(fixture)).toEqual(['Home', 'host-01']);
  });

  it('updates its labels when the strings are localized after the first render', async () => {
    host.items.set([HOME, { label: 'A', href: '/a' }, { label: 'B', href: '/b' }, HOST]);
    await fixture.whenStable();

    TestBed.inject(ClrCommonStringsService).localize({ breadcrumbsLabel: 'Trail', expandBreadcrumbsLabel: 'Show all' });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('clr-breadcrumbs').getAttribute('aria-label')).toBe('Trail');
    expect(expandButton(fixture).getAttribute('aria-label')).toBe('Show all');
  });

  it('emits the clicked item', async () => {
    (fixture.nativeElement.querySelector('a') as HTMLAnchorElement).click();
    await fixture.whenStable();
    expect(host.clicked()).toBe(HOME);
  });

  it('is removed and created again', async () => {
    host.show.set(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('clr-breadcrumbs')).toBeNull();

    host.show.set(true);
    await fixture.whenStable();
    expect(labels(fixture)).toEqual(['Home', 'Hosts', 'host-01']);
  });
});

describe('ClrBreadcrumbs (Eager host, Zone tick)', () => {
  let fixture: ComponentFixture<EagerHost>;
  let host: EagerHost;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
    fixture = TestBed.createComponent(EagerHost);
    host = fixture.componentInstance;
    zoneTick(fixture);
  });

  it('renders a new items array on the next tick', () => {
    host.items = [...host.items, { label: 'details' }];
    zoneTick(fixture);
    expect(labels(fixture)).toEqual(['Hosts', 'host-01', 'details']);
    expect(expandButton(fixture)).not.toBeNull();

    host.items = [{ label: 'Clusters', href: '/clusters' }, { label: 'cluster-01' }];
    zoneTick(fixture);
    expect(labels(fixture)).toEqual(['Clusters', 'cluster-01']);
    expect(expandButton(fixture)).toBeNull();
  });

  it('renders in-place changes to the items array and writes to the component instance', () => {
    host.items.splice(1, 0, { label: 'Clusters', href: '/clusters' });
    zoneTick(fixture);
    expect(labels(fixture)).toEqual(['Clusters', 'Hosts', 'host-01']);

    host.items.length = 2;
    zoneTick(fixture);
    expect(labels(fixture)).toEqual(['Home', 'Clusters']);

    const breadcrumbs: ClrBreadcrumbs = fixture.debugElement.query(By.directive(ClrBreadcrumbs)).componentInstance;
    breadcrumbs.items = [{ label: 'Only' }];
    zoneTick(fixture);
    expect(labels(fixture)).toEqual(['Only']);
  });

  it('expands on click and stays expanded on the next tick', () => {
    host.items = [...host.items, { label: 'details' }];
    zoneTick(fixture);

    expandButton(fixture).click();
    zoneTick(fixture);
    expect(expandButton(fixture)).toBeNull();
    expect(labels(fixture).length).toBe(4);
  });
});
