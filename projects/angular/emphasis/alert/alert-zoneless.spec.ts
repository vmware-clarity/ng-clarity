/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrAlert } from './alert';
import { ClrAlertModule } from './alert.module';
import { ClrAlerts } from './alerts';
import { MultiAlertService } from './providers/multi-alert.service';

@Component({
  template: `
    <clr-alert
      [clrAlertType]="type()"
      [clrAlertSizeSmall]="small()"
      [clrAlertLightweight]="lightweight()"
      [(clrAlertClosed)]="closed"
    >
      <clr-alert-item>
        <span class="alert-text">{{ message() }}</span>
      </clr-alert-item>
    </clr-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class AlertHost {
  @ViewChild(ClrAlert) alert: ClrAlert;

  readonly type = signal('info');
  readonly small = signal(false);
  readonly lightweight = signal(false);
  readonly closed = signal(false);
  readonly message = signal('First message');
}

@Component({
  template: `
    <clr-alerts [(clrCurrentAlertIndex)]="index">
      @for (alert of alerts(); track alert.text) {
        <clr-alert [clrAlertType]="alert.type">
          <clr-alert-item>
            <span class="alert-text">{{ alert.text }}</span>
          </clr-alert-item>
        </clr-alert>
      }
    </clr-alerts>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class AlertsHost {
  @ViewChild(ClrAlerts) group: ClrAlerts;
  @ViewChildren(ClrAlert) alertList: QueryList<ClrAlert>;

  readonly index = signal(0);
  readonly alerts = signal([
    { type: 'info', text: 'First' },
    { type: 'danger', text: 'Second' },
  ]);
}

/**
 * A Zone app consumer: its view is checked on every tick, and it never notifies Angular itself.
 */
@Component({
  template: `
    <clr-alerts>
      @for (text of texts; track text) {
        <clr-alert>
          <clr-alert-item>
            <span class="alert-text">{{ text }}</span>
          </clr-alert-item>
        </clr-alert>
      }
    </clr-alerts>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class EagerAlertsHost {
  @ViewChild(ClrAlerts) group: ClrAlerts;
  @ViewChildren(ClrAlert) alertList: QueryList<ClrAlert>;

  texts = ['First', 'Second'];
}

function iconShape(element: HTMLElement): string {
  return element.querySelector('cds-icon.alert-icon').getAttribute('shape');
}

describe('ClrAlert (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<AlertHost>;
  let host: AlertHost;
  let element: HTMLElement;

  function alertBox(): HTMLElement {
    return element.querySelector('.alert');
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ClrAlertModule], declarations: [AlertHost] });
    fixture = TestBed.createComponent(AlertHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('follows host signals for inputs and projected content', async () => {
    expect(alertBox().classList).toContain('alert-info');
    expect(iconShape(element)).toBe('info-standard');

    host.type.set('warning');
    host.small.set(true);
    host.lightweight.set(true);
    host.message.set('Second message');
    await fixture.whenStable();

    expect(alertBox().classList).toContain('alert-warning');
    expect(alertBox().classList).toContain('alert-sm');
    expect(alertBox().classList).toContain('alert-lightweight');
    expect(iconShape(element)).toBe('warning-standard');
    expect(element.querySelector('.alert-text').textContent).toBe('Second message');
  });

  it('renders imperative close() and open() and reports them through clrAlertClosedChange', async () => {
    host.alert.close();
    await fixture.whenStable();
    expect(alertBox()).toBeNull();
    expect(host.closed()).toBe(true);

    host.alert.open();
    await fixture.whenStable();
    expect(alertBox()).not.toBeNull();
    expect(host.closed()).toBe(false);
  });

  it('closes from the close button', async () => {
    element.querySelector<HTMLButtonElement>('button.close').click();
    await fixture.whenStable();

    expect(alertBox()).toBeNull();
    expect(host.closed()).toBe(true);
  });

  it('opens and closes from the host clrAlertClosed signal', async () => {
    host.closed.set(true);
    await fixture.whenStable();
    expect(alertBox()).toBeNull();

    host.closed.set(false);
    await fixture.whenStable();
    expect(alertBox()).not.toBeNull();
  });

  it('updates the alert and its alert items when the type and icon are set on the instance', async () => {
    host.alert.alertType = 'danger';
    await fixture.whenStable();
    expect(alertBox().classList).toContain('alert-danger');
    expect(iconShape(element)).toBe('error-standard');

    host.alert.alertIconShape = 'bell';
    await fixture.whenStable();
    expect(iconShape(element)).toBe('bell');

    host.alert.alertIconShape = 'loading';
    await fixture.whenStable();
    expect(element.querySelector('clr-spinner.alert-spinner')).not.toBeNull();
  });

  it('renders a close() made from an asynchronous callback', async () => {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        host.alert.close();
        resolve();
      })
    );
    await fixture.whenStable();

    expect(alertBox()).toBeNull();
  });
});

describe('ClrAlerts (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<AlertsHost>;
  let host: AlertsHost;
  let element: HTMLElement;

  function hiddenStates(): boolean[] {
    return Array.from<HTMLElement>(element.querySelectorAll('clr-alert')).map(alert =>
      alert.classList.contains('alert-hidden')
    );
  }

  function pagerText(): string {
    return element.querySelector('.alerts-pager-text')?.textContent.trim();
  }

  function groupElement(): HTMLElement {
    return element.querySelector('clr-alerts');
  }

  function service(): MultiAlertService {
    return fixture.debugElement.query(By.directive(ClrAlerts)).injector.get(MultiAlertService);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [ClrAlertModule], declarations: [AlertsHost] });
    fixture = TestBed.createComponent(AlertsHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('shows the first alert and the pager initially', () => {
    expect(hiddenStates()).toEqual([false, true]);
    expect(pagerText()).toBe('1 / 2');
    expect(groupElement().classList).toContain('alert-info');
  });

  it('pages from the pager buttons and reports the index to the host', async () => {
    element.querySelector<HTMLButtonElement>('.alerts-page-up button').click();
    await fixture.whenStable();

    expect(hiddenStates()).toEqual([true, false]);
    expect(pagerText()).toBe('2 / 2');
    expect(host.index()).toBe(1);
    expect(groupElement().classList).toContain('alert-danger');
    expect(element.querySelector('.alerts-page-up button').getAttribute('aria-label')).toBe(
      'Next alert message, 1 of 2'
    );

    element.querySelector<HTMLButtonElement>('.alerts-page-down button').click();
    await fixture.whenStable();

    expect(hiddenStates()).toEqual([false, true]);
    expect(host.index()).toBe(0);
  });

  it('follows the host index signal', async () => {
    host.index.set(1);
    await fixture.whenStable();

    expect(hiddenStates()).toEqual([true, false]);
    expect(pagerText()).toBe('2 / 2');
  });

  it('renders changes made through the ClrAlerts instance', async () => {
    host.group.currentAlertIndex = 1;
    await fixture.whenStable();
    expect(hiddenStates()).toEqual([true, false]);
    expect(host.index()).toBe(1);

    host.group.currentAlert = host.alertList.first;
    await fixture.whenStable();
    expect(hiddenStates()).toEqual([false, true]);
    expect(host.index()).toBe(0);
  });

  it('hides alerts added later and counts them in the pager', async () => {
    host.alerts.update(alerts => [...alerts, { type: 'success', text: 'Third' }]);
    await fixture.whenStable();

    expect(hiddenStates()).toEqual([false, true, true]);
    expect(pagerText()).toBe('1 / 3');

    host.index.set(2);
    await fixture.whenStable();
    expect(hiddenStates()).toEqual([true, true, false]);
    expect(groupElement().classList).toContain('alert-success');
  });

  it('keeps the index in range and removes the pager when alerts are removed', async () => {
    host.index.set(1);
    await fixture.whenStable();

    host.alerts.set([{ type: 'warning', text: 'Only' }]);
    await fixture.whenStable();

    expect(service().current).toBe(0);
    expect(hiddenStates()).toEqual([false]);
    expect(element.querySelector('clr-alerts-pager')).toBeNull();
    expect(groupElement().classList).toContain('alert-warning');
  });

  it('shows the previous alert when the current alert is closed', async () => {
    host.index.set(1);
    await fixture.whenStable();

    host.alertList.last.close();
    await fixture.whenStable();

    expect(element.querySelectorAll('.alert').length).toBe(1);
    expect(hiddenStates()).toEqual([false, true]);
    expect(element.querySelector('clr-alerts-pager')).toBeNull();
    expect(groupElement().classList).toContain('alert-info');
    expect(host.index()).toBe(0);
  });

  it('updates the group type class when the current alert type is set on the instance', async () => {
    host.alertList.first.alertType = 'warning';
    await fixture.whenStable();

    expect(groupElement().classList).toContain('alert-warning');
  });

  it('follows localize() in the pager and alert item labels', async () => {
    TestBed.inject(ClrCommonStringsService).localize({
      next: 'Suivant',
      info: 'Information',
      alertNextAlertAriaLabel: 'Alerte suivante, {CURRENT} sur {COUNT}',
    });
    await fixture.whenStable();

    expect(element.querySelector('.alerts-page-up button').getAttribute('aria-label')).toBe('Alerte suivante, 2 sur 2');
    expect(element.querySelector('.alerts-page-up cds-icon').getAttribute('title')).toBe('Suivant');
    expect(element.querySelector('cds-icon.alert-icon').getAttribute('aria-label')).toBe('Information');
  });

  it('stops reporting changes after it is destroyed', () => {
    const multiAlertService = service();
    const emit = vi.spyOn(host.group.currentAlertIndexChange, 'emit');
    fixture.destroy();

    multiAlertService.next();

    expect(emit).not.toHaveBeenCalled();
  });
});

describe('ClrAlerts in a Zone app (Eager host, plain ticks)', () => {
  let fixture: ComponentFixture<EagerAlertsHost>;
  let host: EagerAlertsHost;
  let element: HTMLElement;

  function hiddenStates(): boolean[] {
    return Array.from<HTMLElement>(element.querySelectorAll('clr-alert')).map(alert =>
      alert.classList.contains('alert-hidden')
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrAlertModule], declarations: [EagerAlertsHost] });
    fixture = TestBed.createComponent(EagerAlertsHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    renderFixture(fixture);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders imperative changes and late alerts on the next tick', () => {
    host.group.currentAlertIndex = 1;
    renderFixture(fixture);
    expect(hiddenStates()).toEqual([true, false]);
    expect(element.querySelector('.alerts-pager-text').textContent.trim()).toBe('2 / 2');

    host.texts = [...host.texts, 'Third'];
    renderFixture(fixture);
    expect(hiddenStates()).toEqual([true, false, true]);
    expect(element.querySelector('.alerts-pager-text').textContent.trim()).toBe('2 / 3');

    host.alertList.get(1).alertType = 'danger';
    renderFixture(fixture);
    expect(element.querySelector('clr-alerts').classList).toContain('alert-danger');
    expect(iconShape(element.querySelectorAll('clr-alert')[1] as HTMLElement)).toBe('error-standard');

    host.alertList.get(1).close();
    renderFixture(fixture);
    expect(element.querySelectorAll('.alert').length).toBe(2);
    expect(hiddenStates()).toEqual([false, true, true]);
    expect(element.querySelector('.alerts-pager-text').textContent.trim()).toBe('1 / 2');
  });
});
