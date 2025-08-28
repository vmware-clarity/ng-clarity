/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER, DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './providers/dropdown.service';

@Component({
  selector: 'clr-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.dropdown]': 'true',
    '[class.open]': 'toggleService.open',
  },
  providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrDropdown implements OnDestroy {
  @Input('clrCloseMenuOnItemClick') isMenuClosable = true;

  private subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf()
    @Optional()
    public parent: ClrDropdown,
    public toggleService: ClrPopoverToggleService,
    public focusHandler: DropdownFocusHandler,
    cdr: ChangeDetectorRef,
    dropdownService: RootDropdownService
  ) {
    this.subscriptions.push(dropdownService.changes.subscribe(value => (toggleService.open = value)));
    this.subscriptions.push(toggleService.openChange.subscribe(() => cdr.markForCheck()));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
