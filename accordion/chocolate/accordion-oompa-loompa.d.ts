import { ChangeDetectorRef } from '@angular/core';
import { AccordionWillyWonka } from './accordion-willy-wonka';
import { OompaLoompa } from '../../utils/chocolate/oompa-loompa';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
export declare class AccordionOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: AccordionWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
}
