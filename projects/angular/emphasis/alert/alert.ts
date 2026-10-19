/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import { MultiAlertService } from './providers/multi-alert.service';

const LIVE_REGION_SELECTOR = '[aria-live]:not([aria-live="off"]), [role="alert"], [role="status"], [role="log"]';

@Component({
  selector: 'clr-alert',
  providers: [AlertIconAndTypesService],
  templateUrl: './alert.html',
  standalone: false,
})
export class ClrAlert implements OnInit, OnChanges, OnDestroy {
  @Input('clrAlertSizeSmall') isSmall = false;
  @Input('clrAlertClosable') closable = true;
  @Input('clrAlertAppLevel') isAppLevel = false;
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;
  /** Live-region role of the content; `null` or `'none'` renders none. Unset, it follows type and placement. */
  @Input({ alias: 'clrAlertRole', transform: liveRoleAttribute }) liveRole: 'alert' | 'status' | null | undefined =
    undefined;

  @Output('clrAlertClosedChange') _closedChanged = new EventEmitter<boolean>(false);

  _closed = false;

  /** How this alert is announced; see `chooseRole`. */
  protected ariaRole: 'alert' | 'status' | null = null;

  private _hidden: boolean;
  private subscriptions: Subscription[] = [];
  private _isLightweight = false;
  private _origAlertType: string;

  constructor(
    private iconService: AlertIconAndTypesService,
    private cdr: ChangeDetectorRef,
    @Optional() private multiAlertService: MultiAlertService,
    private commonStrings: ClrCommonStringsService,
    private renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>
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

  get alertClass(): string {
    return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
  }

  get hidden() {
    return this._hidden;
  }
  set hidden(value: boolean) {
    if (value !== this._hidden) {
      this._hidden = value;

      // CDE-1249 @HostBinding('class.alert-hidden') decoration will raise error in console https://angular.io/errors/NG0100
      if (this._hidden) {
        this.renderer.addClass(this.hostElement.nativeElement, 'alert-hidden');
      } else {
        this.renderer.removeClass(this.hostElement.nativeElement, 'alert-hidden');
      }
      this.cdr.detectChanges();
    }
  }

  /** `status` is atomic by default, which would reread the alert's action buttons on every update. */
  protected get ariaAtomic(): 'false' | null {
    return this.ariaRole === 'status' ? 'false' : null;
  }

  ngOnInit() {
    // ngOnChanges does not run for an alert with no bound inputs.
    this.ariaRole = this.chooseRole();

    if (this.multiAlertService) {
      this.subscriptions.push(
        this.multiAlertService.changes.subscribe(() => {
          this.hidden = this.multiAlertService.currentAlert !== this;
        })
      );
    }
  }

  ngOnChanges() {
    this.ariaRole = this.chooseRole();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    if (this.multiAlertService?.activeAlerts) {
      this.multiAlertService.close(isCurrentAlert);
    }
    this._closedChanged.emit(true);
  }

  /** App-level danger and warning interrupt; others wait. Inside an existing live region, no role is added. */
  private chooseRole(): 'alert' | 'status' | null {
    if (this.liveRole !== undefined) {
      return this.liveRole;
    }
    if (this.hostElement.nativeElement.closest(LIVE_REGION_SELECTOR)) {
      return null;
    }
    const urgent = this.alertType === 'danger' || this.alertType === 'warning';
    return urgent && this.isAppLevel ? 'alert' : 'status';
  }
}

function liveRoleAttribute(value: unknown): 'alert' | 'status' | null | undefined {
  if (value === 'alert' || value === 'status') {
    return value;
  }
  return value === null || value === 'none' ? null : undefined;
}
