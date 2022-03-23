/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ElementRef, Input, Optional, SkipSelf } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER } from './providers/dropdown-focus-handler.service';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrDestroyService } from '../../utils/destroy';
import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './providers/dropdown.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';

@Component({
  selector: 'clr-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.dropdown]': 'true',
    '[class.open]': 'toggleService.open',
  },
  providers: [
    ROOT_DROPDOWN_PROVIDER,
    { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef },
    FOCUS_SERVICE_PROVIDER,
    ClrPopoverToggleService,
    DROPDOWN_FOCUS_HANDLER_PROVIDER,
    ClrDestroyService,
  ],
})
export class ClrDropdown {
  @Input('clrCloseMenuOnItemClick') isMenuClosable = true;

  constructor(
    @SkipSelf()
    @Optional()
    public parent: ClrDropdown,
    public toggleService: ClrPopoverToggleService,
    private cdr: ChangeDetectorRef,
    dropdownService: RootDropdownService,
    destroy$: ClrDestroyService
  ) {
    dropdownService.changes.pipe(takeUntil(destroy$)).subscribe(value => (this.toggleService.open = value));
    toggleService.openChange.pipe(takeUntil(destroy$)).subscribe(() => this.cdr.markForCheck());
  }
}
