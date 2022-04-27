/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { MultiAlertService } from './providers/multi-alert.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { Subscription } from 'rxjs';
import { ClrAlertItem } from './alert-item';
import { CdsAlert } from '@cds/core/alert';

@Component({
  selector: 'clr-alert',
  template: `
    <cds-alert-group
      *ngIf="!_closed"
      [hidden]="hidden"
      [type]="isAppLevel ? 'banner' : 'default'"
      [status]="alertType"
      [size]="isSmall ? 'sm' : 'default'"
    >
      <cds-pagination class="pager" slot="pager" *ngIf="multiAlertService?.count > 1" aria-label="pagination">
        <cds-pagination-button
          [attr.aria-label]="commonStrings.keys.previous"
          action="prev"
          (click)="pageDown()"
        ></cds-pagination-button>
        <span aria-label="current page">{{ multiAlertService.current + 1 }} / {{ multiAlertService.count }}</span>
        <cds-pagination-button
          [attr.aria-label]="commonStrings.keys.next"
          action="next"
          (click)="pageUp()"
        ></cds-pagination-button>
      </cds-pagination>
      <ng-content></ng-content>
    </cds-alert-group>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .pager {
        min-height: 30px;
      }

      cds-pagination-button {
        --color: var(--cds-global-color-white);
      }
    `,
  ],
})
export class ClrAlert implements OnInit, OnDestroy {
  @Input('clrAlertSizeSmall') isSmall = false;

  @Input('clrAlertClosable') closable = true;

  @Input('clrAlertAppLevel') isAppLevel = false;

  @Input('clrAlertType') alertType = 'info';

  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;

  @ContentChildren(ClrAlertItem, { descendants: true }) private alertItems: QueryList<ClrAlertItem>;

  private subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private multiAlertService: MultiAlertService,
    private commonStrings: ClrCommonStringsService,
    private hostElement: ElementRef
  ) {}

  ngOnInit() {
    if (this.multiAlertService) {
      this.subscriptions.push(
        this.multiAlertService.changes.subscribe(() => {
          console.log(this.multiAlertService.currentAlert !== this);
          this.hidden = this.multiAlertService.currentAlert !== this;
        })
      );
    }
  }

  ngOnChanges() {
    this.updateClosable();
  }

  ngAfterContentInit() {
    Array.from((this.hostElement.nativeElement as HTMLElement).querySelectorAll<CdsAlert>('cds-alert')).forEach(
      cdsAlert => {
        cdsAlert.addEventListener('closeChange', () => this.close());
      }
    );

    this.updateClosable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  _closed = false;
  @Input('clrAlertClosed') set closed(value: boolean) {
    if (value && !this._closed) {
      this.close();
    } else if (!value && this._closed) {
      this.open();
    }
  }
  @Output('clrAlertClosedChange') _closedChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

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

  pageUp() {
    this.multiAlertService.next();
  }

  pageDown() {
    this.multiAlertService.previous();
  }

  private updateClosable() {
    if (this.alertItems?.length) {
      Array.from(this.alertItems)[0].closable = this.closable;
    }
  }
}
