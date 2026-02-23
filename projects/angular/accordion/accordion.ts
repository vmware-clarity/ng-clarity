/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { CollapsiblePanelService, CollapsiblePanelStrategy } from '@clr/angular/collapsible-panel';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { ClrAccordionPanel } from './accordion-panel';

@Component({
  selector: 'clr-accordion',
  template: `<ng-content></ng-content>`,
  host: { '[class.clr-accordion]': 'true' },
  providers: [CollapsiblePanelService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrAccordion implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input('clrAccordionMultiPanel') multiPanel: boolean | string = false;
  @ContentChildren(ClrAccordionPanel) panels: QueryList<ClrAccordionPanel>;
  private subscriptions: Subscription[] = [];

  constructor(private panelService: CollapsiblePanelService) {}

  ngOnInit() {
    this.setAccordionStrategy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
      this.setAccordionStrategy();
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(this.listenForDOMChanges());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private setAccordionStrategy() {
    const strategy = this.multiPanel ? CollapsiblePanelStrategy.Multi : CollapsiblePanelStrategy.Default;
    this.panelService.setStrategy(strategy);
  }

  private listenForDOMChanges() {
    return this.panels.changes
      .pipe(startWith(this.panels))
      .subscribe((panels: QueryList<ClrAccordionPanel>) =>
        this.panelService.updatePanelOrder(panels.toArray().map(p => p.id))
      );
  }
}
