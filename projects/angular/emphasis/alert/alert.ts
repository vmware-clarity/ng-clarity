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

/** An element, the alert's host or above it, that already announces what changes inside it. */
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
  /**
   * The live-region role of the alert's content: `'alert'` interrupts, `'status'` waits its
   * turn, and `null` (or `'none'`) renders none, for an application that announces the
   * message itself. Left unset — or given anything else, such as the bare attribute — the
   * alert chooses from its type and placement.
   */
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

  /**
   * A polite alert announces what changed in it, not the whole alert again: `status` is
   * atomic by default, and an inline alert typically holds action buttons whose names
   * would be read out with every update.
   */
  protected get ariaAtomic(): 'false' | null {
    return this.ariaRole === 'status' ? 'false' : null;
  }

  ngOnInit() {
    // ngOnChanges does not run for an alert with no bound inputs, so the role is chosen here too.
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

  /**
   * An app-level danger or warning is something the user has to deal with now, so it
   * interrupts; everything else, including any inline alert, where several may render at
   * once, waits its turn. An alert inside a live region the application already has is
   * announced by that region, so it adds no role of its own. `clrAlertRole` overrides both.
   *
   * Chosen on init and on input changes, not on every check: an alert moved into a live
   * region later says so with `clrAlertRole`.
   */
  private chooseRole(): 'alert' | 'status' | null {
    if (this.liveRole !== undefined) {
      return this.liveRole;
    }
    // The host counts too, for an application that put `aria-live` on the `clr-alert`
    // itself; the role this renders is on an element inside it.
    if (this.hostElement.nativeElement.closest(LIVE_REGION_SELECTOR)) {
      return null;
    }
    const urgent = this.alertType === 'danger' || this.alertType === 'warning';
    return urgent && this.isAppLevel ? 'alert' : 'status';
  }
}

/** `clrAlertRole` as the alert understands it: `'none'` is `null`, anything unknown is unset. */
function liveRoleAttribute(value: unknown): 'alert' | 'status' | null | undefined {
  if (value === 'alert' || value === 'status') {
    return value;
  }
  return value === null || value === 'none' ? null : undefined;
}
