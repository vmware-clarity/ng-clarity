import { AfterContentChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { WillyWonka } from './willy-wonka';
export declare abstract class OompaLoompa implements AfterContentChecked, OnDestroy {
    private latestFlavor;
    private subscription;
    protected constructor(cdr: ChangeDetectorRef, willyWonka: WillyWonka);
    abstract get flavor(): any;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
}
