/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { uniqueIdFactory } from '@clr/angular/utils';

@Component({
  selector: 'clr-card',
  templateUrl: './card.html',
  host: {
    '[class.card]': 'true',
    '[class.clr-card]': 'true',
    '[class.card-collapsible]': 'collapsible',
    '[class.card-collapsed]': 'collapsible && collapsed',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCard {
  @Input({ alias: 'clrCardFooterCollapsible', transform: booleanAttribute }) footerCollapsible = true;
  @Output('clrCardCollapsedChange') collapsedChange = new EventEmitter<boolean>();

  readonly headerContentId = `clr-card-header-content-${uniqueIdFactory()}`;
  readonly contentId = `clr-card-content-${uniqueIdFactory()}`;

  // Signals so that OnPush content children (the header) reading this state through the template
  // are refreshed whenever it changes, without manual subscriptions or markForCheck calls.
  private readonly _collapsible = signal(false);
  private readonly _collapsed = signal(false);

  @Input({ alias: 'clrCardCollapsible', transform: booleanAttribute })
  get collapsible(): boolean {
    return this._collapsible();
  }
  set collapsible(value: boolean) {
    this._collapsible.set(value);
  }

  @Input({ alias: 'clrCardCollapsed', transform: booleanAttribute })
  get collapsed(): boolean {
    return this._collapsed();
  }
  set collapsed(value: boolean) {
    this._collapsed.set(value);
  }

  /**
   * Toggles the collapsed state of a collapsible card and emits `clrCardCollapsedChange`.
   * Setting the `clrCardCollapsed` input programmatically does not emit.
   */
  toggle() {
    if (!this.collapsible) {
      return;
    }
    this._collapsed.set(!this._collapsed());
    this.collapsedChange.emit(this._collapsed());
  }
}
