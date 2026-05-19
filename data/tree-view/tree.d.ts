import { AfterContentInit, ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import * as i0 from "@angular/core";
export declare class ClrTree<T> implements AfterContentInit, OnDestroy {
    featuresService: TreeFeaturesService<T>;
    private focusManagerService;
    private renderer;
    private el;
    private rootNodes;
    private subscriptions;
    private _isMultiSelectable;
    constructor(featuresService: TreeFeaturesService<T>, focusManagerService: TreeFocusManagerService<T>, renderer: Renderer2, el: ElementRef<HTMLElement>, ngZone: NgZone);
    set lazy(value: boolean);
    get isMultiSelectable(): boolean;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private setMultiSelectable;
    private setRootNodes;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTree<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTree<any>, "clr-tree", never, { "lazy": "clrLazy"; }, {}, ["rootNodes"], ["*"], false, never>;
}
