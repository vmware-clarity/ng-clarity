/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  signal,
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
import { ButtonInGroupService } from '../providers/button-in-group.service';

@Component({
  selector: 'clr-button-group',
  templateUrl: 'button-group.html',
  providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER],
  hostDirectives: [ClrPopoverHostDirective],
  host: { '[class.btn-group]': 'true' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrButtonGroup implements AfterContentInit, AfterViewInit {
  @Input('clrToggleButtonAriaLabel') clrToggleButtonAriaLabel: string = this.commonStrings.keys.rowActions;

  @ViewChild('menuToggle') menuToggle!: ElementRef<HTMLElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLElement>;

  @ContentChildren(ClrButton) buttons!: QueryList<ClrButton>;

  popoverId = uniqueIdFactory();
  InitialFocus = InitialFocus;

  protected popoverType = ClrPopoverType.DROPDOWN;
  private _menuPosition = ClrPopoverPosition.BOTTOM_LEFT;
  private readonly projectedButtons = signal<ClrButton[]>([]);
  // Both lists follow the projected buttons and their `clrInMenu` input, in the order of the buttons.
  private readonly _inlineButtons = computed(() => this.projectedButtons().filter(button => !button.inMenu));
  private readonly _menuButtons = computed(() => this.projectedButtons().filter(button => button.inMenu));

  constructor(
    // Deprecated: the button group no longer uses this service. It is only kept for compatibility
    // and will be removed in a future major version.
    public buttonGroupNewService: ButtonInGroupService,
    private popoverService: ClrPopoverService,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService,
    private focusHandler: ButtonGroupFocusHandler
  ) {}

  get inlineButtons(): ClrButton[] {
    return this._inlineButtons();
  }

  get menuButtons(): ClrButton[] {
    return this._menuButtons();
  }

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

  /**
   * Initializes the buttons and follows the changes of the projected content.
   */
  ngAfterContentInit() {
    this.initializeButtons();
    this.buttons.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.initializeButtons());
  }

  ngAfterViewInit() {
    this.handleFocusOnMenuOpen();
  }

  /**
   * @deprecated The buttons are arranged automatically, following their `clrInMenu` input. This does nothing.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rearrangeButton(button: ClrButton): void {}

  /**
   * Finds the order of a button w.r.t other buttons
   */
  getMoveIndex(buttonToMove: ClrButton): number {
    const tempArr: ClrButton[] = this.buttons.filter(button => button.inMenu === buttonToMove.inMenu);
    return tempArr.indexOf(buttonToMove);
  }

  /**
   * Reads the projected buttons again. The lists of inline and menu buttons follow from them.
   */
  initializeButtons(): void {
    this.projectedButtons.set(this.buttons.toArray());
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
