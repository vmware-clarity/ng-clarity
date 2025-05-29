import { AfterContentChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { WillyWonka } from './willy-wonka';
import * as i0 from "@angular/core";
export declare abstract class OompaLoompa implements AfterContentChecked, OnDestroy {
    private latestFlavor;
    private subscription;
    protected constructor(cdr: ChangeDetectorRef, willyWonka: WillyWonka);
    abstract get flavor(): any;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OompaLoompa, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OompaLoompa, never, never, {}, {}, never, never, false, never>;
}
