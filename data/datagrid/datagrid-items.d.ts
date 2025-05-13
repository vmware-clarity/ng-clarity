import { NgForOfContext } from '@angular/common';
import { DoCheck, IterableDiffers, OnDestroy, TemplateRef, TrackByFunction, ViewContainerRef } from '@angular/core';
import { Items } from './providers/items';
import * as i0 from "@angular/core";
export declare class ClrDatagridItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private items;
    private iterableProxy;
    private _rawItems;
    private differ;
    private subscriptions;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, items: Items, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    /**
     * Asserts the correct type of the template context that the directive will render.
     * See https://angular.io/guide/structural-directives#typing-the-directives-context
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T>(_dir: ClrDatagridItems<T>, _ctx: unknown): _ctx is NgForOfContext<T>;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridItems<any>, "[clrDgItems][clrDgItemsOf]", never, { "rawItems": "clrDgItemsOf"; "trackBy": "clrDgItemsTrackBy"; }, {}, never, never, false, never>;
}
