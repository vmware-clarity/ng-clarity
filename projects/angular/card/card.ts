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
    '[class.card-collapsed]': 'collapsible && !expanded',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCard {
  @Input({ alias: 'clrCardFooterCollapsible', transform: booleanAttribute }) footerCollapsible = true;
  @Output('clrCardExpandedChange') expandedChange = new EventEmitter<boolean>();

  readonly headerContentId = `clr-card-header-content-${uniqueIdFactory()}`;
  readonly contentId = `clr-card-content-${uniqueIdFactory()}`;

  private readonly _collapsible = signal(false);
  private readonly _expanded = signal(true);

  @Input({ alias: 'clrCardCollapsible', transform: booleanAttribute })
  get collapsible(): boolean {
    return this._collapsible();
  }
  set collapsible(value: boolean) {
    this._collapsible.set(value);
  }

  @Input({ alias: 'clrCardExpanded', transform: booleanAttribute })
  get expanded(): boolean {
    return this._expanded();
  }
  set expanded(value: boolean) {
    this._expanded.set(value);
  }

  /**
   * Toggles the expanded state of a collapsible card and emits `clrCardExpandedChange`.
   * Setting the `clrCardExpanded` input programmatically does not emit.
   */
  toggle() {
    if (!this.collapsible) {
      return;
    }
    this._expanded.set(!this._expanded());
    this.expandedChange.emit(this._expanded());
  }
}
