import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { IfActiveService } from '../../../utils/conditional/if-active.service';
import { TabsWillyWonka } from './tabs-willy-wonka';
import * as i0 from "@angular/core";
export declare class ActiveOompaLoompa extends OompaLoompa {
    private ifActive;
    private id;
    constructor(cdr: ChangeDetectorRef, willyWonka: TabsWillyWonka, id: number, ifActive: IfActiveService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActiveOompaLoompa, [null, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ActiveOompaLoompa, "[clrTabLink], clr-tab-content", never, {}, {}, never, never, false, never>;
}
