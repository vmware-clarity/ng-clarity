/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Optional } from '@angular/core';

import { OompaLoompa } from '../../utils/chocolate/oompa-loompa';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { AccordionWillyWonka } from './accordion-willy-wonka';

@Directive({ selector: 'clr-accordion-panel' })
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
