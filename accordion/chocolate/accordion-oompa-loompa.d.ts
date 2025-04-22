import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../utils/chocolate/oompa-loompa';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { AccordionWillyWonka } from './accordion-willy-wonka';
import * as i0 from "@angular/core";
export declare class AccordionOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: AccordionWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccordionOompaLoompa, "clr-accordion-panel", never, {}, {}, never, never, false, never>;
}
