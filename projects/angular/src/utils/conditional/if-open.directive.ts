/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from '../popover';

@Directive({
  selector: '[clrIfOpen]',
  standalone: false,
})

/**********
 *
 * @class ClrIfOpen
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: ClrPopoverService to maintain state between itself and the component
 * using it in the component template.
 *
 */
export class ClrIfOpen implements OnDestroy {
  static ngAcceptInputType_open: boolean | '';

  /**********
   * @property openChange
   *
   * @description
   * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
   * used with de-structured / de-sugared syntax.
   */
  @Output('clrIfOpenChange') openChange = new EventEmitter<boolean>(false);

  private subscription: Subscription;

  constructor(
    private popoverService: ClrPopoverService,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    this.subscription = popoverService.openChange.subscribe(change => {
      this.updateView(change);
      this.openChange.emit(change);
    });
  }

  /**
   * @description
   * A property that gets/sets ClrPopoverService.open with value.
   */
  @Input('clrIfOpen')
  get open() {
    return this.popoverService.open;
  }
  set open(value: boolean | string) {
    this.popoverService.open = value as boolean;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @description
   * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
   * Clears all views from the ViewContainerRef
   *
   * @param value
   */
  updateView(value: boolean) {
    if (value) {
      this.container.createEmbeddedView(this.template);
    } else {
      this.container.clear();
    }
  }
}
