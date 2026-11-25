/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
  DROPDOWN_POSITIONS,
} from '@clr/angular/popover/common';
import {
  ClrCommonStringsService,
  ClrDestroyService,
  FOCUS_SERVICE_PROVIDER,
  uniqueIdFactory,
} from '@clr/angular/utils';
import { takeUntil } from 'rxjs/operators';

import { ClrButton } from './button';
import {
  BUTTON_GROUP_FOCUS_HANDLER_PROVIDER,
  ButtonGroupFocusHandler,
} from '../providers/button-group-focus-handler.service';
import { InitialFocus } from '../providers/button-group-focus.enum';

@Component({
  selector: 'clr-button-group',
  templateUrl: 'button-group.html',
  providers: [ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER],
  hostDirectives: [ClrPopoverHostDirective],
  host: { '[class.btn-group]': 'true' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrButtonGroup implements AfterViewInit {
  @Input('clrToggleButtonAriaLabel') clrToggleButtonAriaLabel: string = this.commonStrings.keys.rowActions;

  @ViewChild('menuToggle') menuToggle!: ElementRef<HTMLElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;

  popoverId = uniqueIdFactory();
  InitialFocus = InitialFocus;

  // Both lists follow the projected buttons and their `clrInMenu` input, in the order of the buttons.
  protected readonly inlineButtons = computed(() => this.buttons().filter(button => !button.inMenu));
  protected readonly menuButtons = computed(() => this.buttons().filter(button => button.inMenu));
  protected popoverType = ClrPopoverType.DROPDOWN;
  private _menuPosition = ClrPopoverPosition.BOTTOM_LEFT;
  private readonly buttons = contentChildren(ClrButton);

  constructor(
    private popoverService: ClrPopoverService,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService,
    private focusHandler: ButtonGroupFocusHandler
  ) {}

  @Input('clrMenuPosition')
  get menuPosition(): ClrPopoverPosition {
    return this._menuPosition;
  }
  set menuPosition(pos: ClrPopoverPosition | string) {
    if (!pos) {
      return;
    }

    const posIndex = DROPDOWN_POSITIONS.indexOf(pos as ClrPopoverPosition);

    if (posIndex === -1) {
      return;
    }

    this._menuPosition = DROPDOWN_POSITIONS[posIndex];
  }

  get open() {
    return this.popoverService.open;
  }

  ngAfterViewInit() {
    this.handleFocusOnMenuOpen();
  }

  openMenu(event: Event, initialFocus: InitialFocus) {
    this.focusHandler.initialFocus = initialFocus;
    if (!this.popoverService.open) {
      this.popoverService.toggleWithEvent(event);
    }
  }

  private handleFocusOnMenuOpen() {
    this.popoverService.popoverVisible.pipe(takeUntil(this.destroy$)).subscribe(visible => {
      // `menu` sits on the element carrying *clrPopoverContent, so the query only
      // resolves once that embedded view has been created and change detection has
      // refreshed it. popoverVisible fires from a setTimeout inside showOverlay(), which
      // is normally late enough - but not guaranteed to be, so dereferencing either
      // ElementRef unguarded can throw and abort this handler.
      if (!visible || !this.menu || !this.menuToggle) {
        return;
      }

      this.focusHandler.initialize({
        menu: this.menu.nativeElement,
        menuToggle: this.menuToggle.nativeElement,
      });
    });
  }
}
