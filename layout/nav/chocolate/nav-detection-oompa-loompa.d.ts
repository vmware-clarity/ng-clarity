import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ResponsiveNavigationService } from '../providers/responsive-navigation.service';
import { MainContainerWillyWonka } from './main-container-willy-wonka';
import * as i0 from "@angular/core";
export declare class NavDetectionOompaLoompa extends OompaLoompa {
    private responsiveNavService;
    constructor(cdr: ChangeDetectorRef, willyWonka: MainContainerWillyWonka, responsiveNavService: ResponsiveNavigationService);
    get flavor(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavDetectionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NavDetectionOompaLoompa, "clr-header", never, {}, {}, never, never, false, never>;
}
