/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { ClrCommonStringsService, clrPublishElementContext } from '@clr/angular/utils';
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
export class ClrAlert implements OnInit, DoCheck, OnDestroy {
  @Input('clrAlertSizeSmall') isSmall = false;
  @Input('clrAlertClosable') closable = true;
  @Input('clrAlertAppLevel') isAppLevel = false;
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;
  /**
   * The live-region role of the alert's content: `'alert'` interrupts, `'status'` waits its
   * turn, and `null` renders none, for an application that announces the message itself.
   * Left unset, the alert chooses (see {@link ariaRole}).
   */
  @Input('clrAlertRole') liveRole: 'alert' | 'status' | null | undefined = undefined;

  @Output('clrAlertClosedChange') _closedChanged = new EventEmitter<boolean>(false);

  _closed = false;

  private _hidden: boolean;
  private subscriptions: Subscription[] = [];
  private _isLightweight = false;
  private _origAlertType: string;
  private teardownElementContext?: () => void;
  /** The role chosen for this check; see {@link ariaRole}. */
  private renderedRole: 'alert' | 'status' | null = null;

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
   * How this alert should be announced. An app-level danger or warning describes
   * something the user has to deal with now, so it interrupts; everything else — an
   * informational alert, and any alert placed inline in the content, where several may
   * render at once — is reported politely and waits its turn.
   *
   * Without a role an alert is announced by nothing at all, and its severity lives only
   * in a CSS class, which neither assistive technology nor page-context tooling can read.
   *
   * An alert placed inside a live region the application already has is announced by
   * that region, so it adds none of its own, which would announce it twice; the
   * `clrAlertRole` input overrides either choice.
   *
   * A `status` region is atomic by default, which would re-read the whole alert — its
   * buttons included — whenever any part of it changed; see {@link ariaAtomic}.
   *
   * Chosen once per check, in `ngDoCheck`, before the template reads it.
   */
  protected get ariaRole(): 'alert' | 'status' | null {
    return this.renderedRole;
  }

  /**
   * A polite alert announces what changed in it, not the whole alert again: `status` is
   * atomic by default, and an inline alert typically holds action buttons whose names
   * would be read out with every update.
   */
  protected get ariaAtomic(): 'false' | null {
    return this.renderedRole === 'status' ? 'false' : null;
  }

  ngOnInit() {
    // role="alert" versus role="status" only says important versus informational. Which
    // of danger, warning, success, info or neutral this is lives in a CSS class, which
    // nothing can read semantically, so the component reports it directly.
    this.teardownElementContext = clrPublishElementContext(this.hostElement.nativeElement, () => ({
      state: { severity: this.alertType },
    }));

    if (this.multiAlertService) {
      this.subscriptions.push(
        this.multiAlertService.changes.subscribe(() => {
          this.hidden = this.multiAlertService.currentAlert !== this;
        })
      );
    }
  }

  ngDoCheck() {
    // Checked each time rather than once: an alert can be moved into a live region.
    this.renderedRole = this.chooseRole();
  }

  ngOnDestroy() {
    this.teardownElementContext?.();
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
