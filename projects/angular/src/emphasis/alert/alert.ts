/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import { MultiAlertService } from './providers/multi-alert.service';

@Component({
  selector: 'clr-alert',
  providers: [AlertIconAndTypesService],
  templateUrl: './alert.html',
  styles: [':host { display: block; }'],
})
export class ClrAlert implements OnInit, OnDestroy {
  @Input('clrAlertSizeSmall') isSmall = false;
  @Input('clrAlertClosable') closable = true;
  @Input('clrAlertAppLevel') isAppLevel = false;
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;

  @Output('clrAlertClosedChange') _closedChanged = new EventEmitter<boolean>(false);

  _closed = false;

  private _hidden: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private iconService: AlertIconAndTypesService,
    private cdr: ChangeDetectorRef,
    @Optional() private multiAlertService: MultiAlertService,
    private commonStrings: ClrCommonStringsService
  ) {}

  @Input('clrAlertType')
  get alertType(): string {
    return this.iconService.alertType;
  }
  set alertType(val: string) {
    this.iconService.alertType = val;
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

  get alertClass(): string {
    return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
  }

  get hidden() {
    return this._hidden;
  }
  set hidden(value: boolean) {
    if (value !== this._hidden) {
      this._hidden = value;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    if (this.multiAlertService) {
      this.subscriptions.push(
        this.multiAlertService.changes.subscribe(() => {
          this.hidden = this.multiAlertService.currentAlert !== this;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
