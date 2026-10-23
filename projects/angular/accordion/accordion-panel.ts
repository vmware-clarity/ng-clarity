/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { CollapsiblePanel, CollapsiblePanelModel, CollapsiblePanelService } from '@clr/angular/collapsible-panel';
import { HeadingLevel, IfExpandService } from '@clr/angular/utils';

import { ClrAccordionDescription } from './accordion-description';
import { AccordionService } from './providers/accordion.service';

@Component({
  selector: 'clr-accordion-panel',
  templateUrl: './accordion-panel.html',
  host: { '[class.clr-accordion-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IfExpandService],
  standalone: false,
})
export class ClrAccordionPanel extends CollapsiblePanel implements OnChanges {
  @Input('clrAccordionPanelDisabled') @HostBinding('class.clr-accordion-panel-disabled') disabled = false;
  @Input('clrAccordionPanelOpen') override panelOpen = false;
  @Output('clrAccordionPanelOpenChange') override panelOpenChange = new EventEmitter<boolean>();

  /**
   * Level of the accordion heading from 1 to 6.
   */
  @Input('clrAccordionPanelHeadingLevel') explicitHeadingLevel: HeadingLevel;

  @ContentChildren(ClrAccordionDescription) accordionDescription: QueryList<ClrAccordionDescription>;

  constructor(
    @Optional() @Inject(AccordionService) panelService: CollapsiblePanelService,
    ifExpandService: IfExpandService,
    cdr: ChangeDetectorRef
  ) {
    if (!panelService) {
      throw new Error('clr-accordion-panel should only be used inside of clr-accordion');
    }
    super(panelService, ifExpandService, cdr);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handlePanelInputChanges(changes);
  }

  getPanelStateClasses(panel: CollapsiblePanelModel) {
    return panel.open ? 'clr-accordion-panel-open' : 'clr-accordion-panel-closed';
  }

  getContentId(id: string) {
    return `clr-accordion-content-${id}`;
  }

  getHeaderId(id: string) {
    return `clr-accordion-header-${id}`;
  }
}
