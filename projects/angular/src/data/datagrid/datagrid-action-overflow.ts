/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrKeyFocus } from '../../utils/focus/key-focus';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { RowActionService } from './providers/row-action-service';

let clrDgActionId = 0;

@Component({
  selector: 'clr-dg-action-overflow',
  hostDirectives: [ClrPopoverHostDirective],
  template: `
    <button
      class="datagrid-action-toggle"
      type="button"
      role="button"
      aria-haspopup="true"
      #anchor
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="open"
      [attr.aria-label]="buttonLabel || commonStrings.keys.rowActions"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
    >
      <cds-icon shape="ellipsis-vertical" [attr.title]="buttonLabel || commonStrings.keys.rowActions"></cds-icon>
    </button>

    <div
      class="datagrid-action-overflow"
      [id]="popoverId"
      [attr.aria-hidden]="!open"
      [attr.id]="popoverId"
      clrKeyFocus
      cdkTrapFocus
      (click)="closeOverflowContent($event)"
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class ClrDatagridActionOverflow implements OnDestroy {
  @Input('clrDgActionOverflowButtonLabel') buttonLabel: string;

  @Output('clrDgActionOverflowOpenChange') openChange = new EventEmitter<boolean>(false);

  popoverId = uniqueIdFactory();

  smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.CENTER,
    content: ClrAlignment.CENTER,
  };

  @ViewChild(ClrKeyFocus) private readonly keyFocus: ClrKeyFocus;

  private _open = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private rowActionService: RowActionService,
    public commonStrings: ClrCommonStringsService,
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone,
    private popoverService: ClrPopoverService
  ) {
    this.rowActionService.register();
    this.subscriptions.push(
      this.popoverService.openChange.subscribe(openState => {
        this.open = openState;
      }),
      this.popoverService.popoverVisible.subscribe(visible => {
        if (visible) {
          this.initializeFocus();
        }
      })
    );
    this.popoverId = 'clr-action-menu' + clrDgActionId++;
  }

  @Input('clrDgActionOverflowOpen')
  get open() {
    return this._open;
  }
  set open(open: boolean) {
    const openState = !!open;
    if (!!openState !== this.open) {
      // prevents chocolate mess
      this.popoverService.open = openState;
      this.openChange.emit(openState);
      this._open = openState;
    }
  }

  ngOnDestroy() {
    this.rowActionService.unregister();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeOverflowContent(event: Event): void {
    this.popoverService.toggleWithEvent(event);
  }

  private initializeFocus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button.action-item'));

      if (buttons.length) {
        this.keyFocus.current = 0;
        this.keyFocus.focusableItems = buttons;

        this.keyFocus.focusCurrent();
      }
    }
  }
}
