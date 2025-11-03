import { ChangeDetectorRef } from '@angular/core';
import { MainContainerWillyWonka } from './main-container-willy-wonka';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ResponsiveNavigationService } from '../providers/responsive-navigation.service';
export declare class NavDetectionOompaLoompa extends OompaLoompa {
    private responsiveNavService;
    constructor(cdr: ChangeDetectorRef, willyWonka: MainContainerWillyWonka, responsiveNavService: ResponsiveNavigationService);
    get flavor(): number;
}
