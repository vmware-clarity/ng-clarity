/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnInit,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { AccordionService } from './providers/accordion.service';
import { ClrAccordionPanel } from './accordion-panel';
import { AccordionStrategy } from './enums/accordion-strategy.enum';

@Component({
  selector: 'clr-accordion',
  template: `<ng-content></ng-content>`,
  host: { '[class.clr-accordion]': 'true' },
  providers: [AccordionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrAccordion implements OnInit, OnChanges, AfterViewInit {
  @Input('clrAccordionMultiPanel') multiPanel: boolean | string = false;
  @ContentChildren(ClrAccordionPanel, { descendants: true })
  panels: QueryList<ClrAccordionPanel>;

  constructor(private accordionService: AccordionService) {}

  ngOnInit() {
    this.setAccordionStrategy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
      this.setAccordionStrategy();
    }
  }

  ngAfterViewInit() {
    this.listenForDOMChanges();
  }

  private setAccordionStrategy() {
    const strategy = this.multiPanel ? AccordionStrategy.Multi : AccordionStrategy.Default;
    this.accordionService.setStrategy(strategy);
  }

  private listenForDOMChanges() {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    this.panels.changes
      .pipe(startWith(this.panels))
      .subscribe((panels: QueryList<ClrAccordionPanel>) =>
        this.accordionService.updatePanelOrder(panels.toArray().map(p => p.id))
      );
  }
}
