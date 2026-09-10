/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { collapsiblePanelExpandAnimation } from '@clr/angular/collapsible-panel';
import { IfExpandService, uniqueIdFactory } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'clr-card',
  templateUrl: './card.html',
  host: { '[class.card]': 'true', '[class.clr-card]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: collapsiblePanelExpandAnimation,
  providers: [IfExpandService],
  standalone: false,
})
export class ClrCard implements OnInit, OnDestroy {
  @Input({ alias: 'clrCardCollapsible', transform: booleanAttribute }) collapsible = false;
  @Input({ alias: 'clrCardFooterCollapsible', transform: booleanAttribute }) footerCollapsible = true;
  @Output('clrCardCollapsedChange') collapsedChange = new EventEmitter<boolean>();

  readonly cardId = uniqueIdFactory();
  readonly headerId = `clr-card-header-${this.cardId}`;
  readonly contentId = `clr-card-content-${this.cardId}`;

  private subscription: Subscription;

  constructor(
    public expandService: IfExpandService,
    private cdr: ChangeDetectorRef
  ) {
    expandService.expanded = true;
  }

  @Input('clrCardCollapsed')
  get collapsed(): boolean {
    return !this.expandService.expanded;
  }
  set collapsed(value: boolean) {
    this.expandService.expanded = !value;
  }

  ngOnInit() {
    // The toggle button lives in the content-projected ClrCardHeader, a separate component, so a
    // click there mutating this.expandService doesn't automatically mark this component dirty.
    // Subscribing here ensures our own template (region visibility, animation trigger) refreshes.
    this.subscription = this.expandService.expandChange.subscribe(expanded => {
      this.collapsedChange.emit(!expanded);
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
