/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { ClrDropdownMenu } from '@clr/angular/popover/dropdown';

import { ClrDropdownMenuPrivate } from './clarity-private/dropdown-menu';
import { FocusableItemProvider } from './focusable-item-provider';

@Component({
  selector: 'focusable-item-collector',
  standalone: false,
  template: '<ng-content></ng-content>',
})
/**
 * Does the job of the parent ClrDropdownMenu which isn't able to collect the child FocusableItems
 * because they are not in the content but in a nested template. see menu.component.html
 */
export class FocusableItemCollectorComponent implements AfterContentInit {
  @Input() parentMenu: ClrDropdownMenu;

  @ContentChildren(FocusableItemProvider, { descendants: true }) items: QueryList<FocusableItemProvider>;

  ngAfterContentInit(): void {
    const focusHandler = (this.parentMenu as unknown as ClrDropdownMenuPrivate).focusHandler;
    const originalAddChildren = focusHandler.addChildren;

    //overrides the addChildren as it's called with empty array and overrides the value we pass.
    focusHandler.addChildren = () => {};
    //the code here is the same as in ClrDropdownMenu.ngAfterContentInit
    this.items.changes.subscribe(() =>
      originalAddChildren.call(
        focusHandler,
        this.items.map(item => item.getFocusableItem())
      )
    );
    this.items.notifyOnChanges();
  }
}
