/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

export enum ToastType {
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

@Component({
  selector: 'clr-toast',
  templateUrl: './toast.html',
})
export class ClrToastComponent implements OnInit, OnDestroy {
  readonly ToastType = ToastType;

  @Input() type: string = ToastType.INFO;
  @Input() title: string;
  @Input() message: string;
  @Input() autoDismiss = true;
  @Input() toastDuration = 10; // In Seconds

  // Tells when node action menu opened
  @Output() whenDismiss = new EventEmitter();

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.runTimer();
  }

  ngOnDestroy() {
    console.log('Destroyed');
  }

  /**
   * @method mouseOver         If the user moves their mouse over the snack, disable auto-dismiss
   * @param over mouse over rout
   */
  mouseOver(over: boolean) {
    this.autoDismiss = over;
  }

  /**
   * @method dismiss
   */
  dismiss() {
    this.whenDismiss.emit(false);
  }

  /**
   * @method runTimer
   */
  private runTimer() {
    if (this.toastDuration > 0) {
      this.ngZone.runOutsideAngular(() => {
        timer(this.toastDuration * 1000)
          .pipe(take(1))
          .subscribe(() => {
            this.ngZone.run(() => {
              if (!this.autoDismiss) {
                this.runTimer();
                return;
              }
              this.dismiss();
            });
          });
      });
    }
  }
}
