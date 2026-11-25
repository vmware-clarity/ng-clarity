/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed, Injectable, QueryList, signal } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { ClrAlert } from '../alert';

@Injectable()
export class MultiAlertService {
  private subscription: Subscription | undefined;
  private readonly alerts = signal<ClrAlert[]>([]);
  private readonly index = signal<number>(undefined);
  private readonly openAlerts = computed(() => this.alerts().filter(alert => !alert._closed));
  private _change = new Subject<number>();

  /**
   * The Observable that lets other classes subscribe to changes
   */
  get changes(): Observable<number> {
    return this._change.asObservable();
  }

  get current() {
    return this.index();
  }
  set current(index: number) {
    if (index !== this.index()) {
      this.index.set(index);
      this._change.next(index);
    }
  }

  get activeAlerts() {
    return this.openAlerts();
  }

  get currentAlert() {
    return this.activeAlerts[this.current];
  }
  set currentAlert(alert: ClrAlert) {
    this.current = this.activeAlerts.indexOf(alert);
  }

  get count() {
    return this.activeAlerts.length;
  }

  manage(alerts: QueryList<ClrAlert>) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.alerts.set(alerts.toArray());
    // After receiving alerts' QueryList,
    // we are picking index 0 as current by default if a user hasn't any index
    this.current = typeof this.current === 'number' ? this.current : 0;
    // we have to also broadcast that initial index
    this._change.next(this.current);

    this.subscription = alerts.changes.subscribe(() => {
      this.alerts.set(alerts.toArray());
      if (this.current >= alerts.length) {
        this.current = Math.max(0, alerts.length - 1);
      }
    });
  }

  next() {
    this.moveTo(this.current === this.count - 1 ? 0 : this.current + 1);
  }

  previous() {
    if (this.count === 0) {
      return;
    }
    this.moveTo(this.current === 0 ? this.count - 1 : this.current - 1);
  }

  open() {
    if (this.count === 0) {
      return;
    }
    this.moveTo(this.currentAlert ? this.current : 0);
  }

  close(isCurrentAlert: boolean) {
    if (this.count === 0) {
      return;
    }
    this.moveTo(isCurrentAlert ? Math.max(0, this.current - 1) : this.current);
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Unlike the `current` setter, this always notifies, even when the index stays the same,
   * because the alert at that index can change when an alert opens or closes.
   */
  private moveTo(index: number) {
    this.index.set(index);
    this._change.next(index);
  }
}
