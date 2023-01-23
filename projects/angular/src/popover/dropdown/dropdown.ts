/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';

import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { PopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER } from './providers/dropdown-focus-handler.service';
import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './providers/dropdown.service';

@Component({
  selector: 'clr-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.dropdown]': 'true',
    '[class.open]': 'toggleService.open',
  },
  providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
  hostDirectives: [PopoverHostDirective],
})
export class ClrDropdown implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf()
    @Optional()
    public parent: ClrDropdown,
    public toggleService: ClrPopoverToggleService,
    private cdr: ChangeDetectorRef,
    dropdownService: RootDropdownService
  ) {
    this.subscriptions.push(dropdownService.changes.subscribe(value => (this.toggleService.open = value)));
    this.subscriptions.push(toggleService.openChange.subscribe(() => this.cdr.markForCheck()));
  }

  @Input('clrCloseMenuOnItemClick') isMenuClosable = true;

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
