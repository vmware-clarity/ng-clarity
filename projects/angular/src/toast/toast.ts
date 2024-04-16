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

  @Input() clrToastType: string = ToastType.INFO;
  @Input() clrToastAutoDismiss = true;
  @Input() clrToastDuration = 10; // In Seconds

  // Tells when node action menu opened
  @Output() clrToastDismiss = new EventEmitter();

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
    this.clrToastAutoDismiss = over;
  }

  /**
   * @method dismiss
   */
  dismiss() {
    this.clrToastDismiss.emit(false);
  }

  /**
   * @method runTimer
   */
  private runTimer() {
    if (this.clrToastDuration > 0) {
      this.ngZone.runOutsideAngular(() => {
        timer(this.clrToastDuration * 1000)
          .pipe(take(1))
          .subscribe(() => {
            this.ngZone.run(() => {
              if (!this.clrToastAutoDismiss) {
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
