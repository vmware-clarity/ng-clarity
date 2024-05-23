/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER, DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './providers/dropdown.service';

@Component({
  selector: 'clr-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.clr-dropdown]': 'true',
    '[class.dropdown]': 'true',
    '[class.open]': 'popoverService.open',
  },
  providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  hostDirectives: [ClrPopoverHostDirective],
})
export class ClrDropdown implements OnDestroy {
  @Input('clrCloseMenuOnItemClick') isMenuClosable = true;

  private subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf()
    @Optional()
    public parent: ClrDropdown,
    public popoverService: ClrPopoverService,
    public focusHandler: DropdownFocusHandler,
    private cdr: ChangeDetectorRef,
    dropdownService: RootDropdownService
  ) {
    this.subscriptions.push(dropdownService.changes.subscribe(value => (this.popoverService.open = value)));
    this.subscriptions.push(popoverService.openChange.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
