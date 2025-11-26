/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Optional } from '@angular/core';
import { IfExpandService, OompaLoompa } from '@clr/angular/src/utils';

import { AccordionWillyWonka } from './accordion-willy-wonka';

@Directive({
  selector: 'clr-accordion-panel',
  standalone: false,
})
export class AccordionOompaLoompa extends OompaLoompa {
  private expand: IfExpandService;

  constructor(cdr: ChangeDetectorRef, @Optional() willyWonka: AccordionWillyWonka, ifExpandService: IfExpandService) {
    if (!willyWonka) {
      throw new Error('clr-accordion-panel should only be used inside of clr-accordion');
    }
    super(cdr, willyWonka);
    this.expand = ifExpandService;
  }

  get flavor() {
    return this.expand.expanded;
  }
}
