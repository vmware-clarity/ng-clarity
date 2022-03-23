/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

// providers
import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import { MultiAlertService } from './providers/multi-alert.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'clr-alert',
  providers: [AlertIconAndTypesService, ClrDestroyService],
  templateUrl: './alert.html',
  styles: [':host { display: block; }'],
})
export class ClrAlert implements OnInit {
  constructor(
    private iconService: AlertIconAndTypesService,
    private cdr: ChangeDetectorRef,
    @Optional() private multiAlertService: MultiAlertService,
    private commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService
  ) {}

  ngOnInit() {
    if (this.multiAlertService) {
      this.multiAlertService.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.hidden = this.multiAlertService.currentAlert !== this;
      });
    }
  }

  @Input('clrAlertSizeSmall') isSmall = false;
  @Input('clrAlertClosable') closable = true;
  @Input('clrAlertAppLevel') isAppLevel = false;

  // Aria
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;

  _closed = false;
  @Input('clrAlertClosed') set closed(value: boolean) {
    if (value && !this._closed) {
      this.close();
    } else if (!value && this._closed) {
      this.open();
    }
  }
  @Output('clrAlertClosedChange') _closedChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input('clrAlertType')
  set alertType(val: string) {
    this.iconService.alertType = val;
  }

  get alertType(): string {
    return this.iconService.alertType;
  }

  @Input('clrAlertIcon')
  set alertIconShape(value: string) {
    this.iconService.alertIconShape = value;
  }

  get alertClass(): string {
    return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
  }

  private _hidden: boolean;

  set hidden(value: boolean) {
    if (value !== this._hidden) {
      this._hidden = value;
      this.cdr.detectChanges();
    }
  }

  get hidden() {
    return this._hidden;
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

  open(): void {
    this._closed = false;
    if (this.multiAlertService) {
      this.multiAlertService.open();
    }
    this._closedChanged.emit(false);
  }
}
