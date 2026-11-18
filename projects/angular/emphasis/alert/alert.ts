/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  linkedSignal,
  Optional,
  Output,
  signal,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import { MultiAlertService } from './providers/multi-alert.service';

@Component({
  selector: 'clr-alert',
  providers: [AlertIconAndTypesService],
  templateUrl: './alert.html',
  host: { '[class.alert-hidden]': 'hidden' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrAlert {
  @Input('clrAlertSizeSmall') isSmall = false;
  @Input('clrAlertClosable') closable = true;
  @Input('clrAlertAppLevel') isAppLevel = false;
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;

  @Output('clrAlertClosedChange') _closedChanged = new EventEmitter<boolean>(false);

  private readonly isClosed = signal(false);
  /**
   * In a `clr-alerts` group, every alert except the current one is hidden.
   */
  private readonly isHidden = linkedSignal(
    () => !!this.multiAlertService && this.multiAlertService.currentAlert !== this
  );
  private _isLightweight = false;
  private _origAlertType: string;

  constructor(
    private iconService: AlertIconAndTypesService,
    @Optional() private multiAlertService: MultiAlertService,
    private commonStrings: ClrCommonStringsService
  ) {}

  @Input('clrAlertLightweight')
  get isLightweight(): boolean {
    return this._isLightweight;
  }
  set isLightweight(val: boolean) {
    this._isLightweight = val;

    this.configAlertType(this._origAlertType);
  }

  @Input('clrAlertType')
  get alertType(): string {
    return this.iconService.alertType;
  }
  set alertType(val: string) {
    this._origAlertType = val;

    this.configAlertType(val);
  }

  @Input('clrAlertIcon')
  set alertIconShape(value: string) {
    this.iconService.alertIconShape = value;
  }

  @Input('clrAlertClosed')
  set closed(value: boolean) {
    if (value && !this._closed) {
      this.close();
    } else if (!value && this._closed) {
      this.open();
    }
  }

  get _closed() {
    return this.isClosed();
  }
  set _closed(value: boolean) {
    this.isClosed.set(value);
  }

  get alertClass(): string {
    return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
  }

  get hidden() {
    return this.isHidden();
  }
  set hidden(value: boolean) {
    this.isHidden.set(value);
  }

  configAlertType(val: string) {
    this.iconService.alertType = val;
  }

  open(): void {
    this._closed = false;
    if (this.multiAlertService) {
      this.multiAlertService.open();
    }
    this._closedChanged.emit(false);
  }

  close(): void {
    if (!this.closable) {
      return;
    }
    const isCurrentAlert = this.multiAlertService?.currentAlert === this;
    this._closed = true;
    if (this.multiAlertService) {
      this.multiAlertService.close(isCurrentAlert);
    }
    this._closedChanged.emit(true);
  }
}
