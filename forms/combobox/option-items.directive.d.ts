import { NgForOfContext } from '@angular/common';
import { DoCheck, IterableDiffers, OnDestroy, TemplateRef, TrackByFunction, ViewContainerRef } from '@angular/core';
import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { OptionSelectionService } from './providers/option-selection.service';
import * as i0 from "@angular/core";
export declare class ClrOptionItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private optionService;
    private positionService;
    private iterableProxy;
    private _rawItems;
    private filteredItems;
    private subscriptions;
    private filter;
    private _filterField;
    private differ;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, optionService: OptionSelectionService<T>, positionService: ClrPopoverPositionService, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    set field(field: string);
    get hasResults(): number;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    private updateItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionItems<any>, "[clrOptionItems][clrOptionItemsOf]", never, { "rawItems": "clrOptionItemsOf"; "trackBy": "clrOptionItemsTrackBy"; "field": "clrOptionItemsField"; }, {}, never, never, false, never>;
}
