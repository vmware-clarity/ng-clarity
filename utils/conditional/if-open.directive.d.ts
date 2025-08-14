import { EventEmitter, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ClrPopoverToggleService } from '../popover/providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class ClrIfOpen implements OnDestroy {
    private toggleService;
    private template;
    private container;
    static ngAcceptInputType_open: boolean | '';
    /**********
     * @property openChange
     *
     * @description
     * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
     * used with de-structured / de-sugared syntax.
     */
    openChange: EventEmitter<boolean>;
    private subscription;
    constructor(toggleService: ClrPopoverToggleService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @description
     * A property that gets/sets ClrPopoverToggleService.open with value.
     */
    get open(): boolean | string;
    set open(value: boolean | string);
    ngOnDestroy(): void;
    /**
     * @description
     * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     *
     * @param value
     */
    updateView(value: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfOpen, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfOpen, "[clrIfOpen]", never, { "open": "clrIfOpen"; }, { "openChange": "clrIfOpenChange"; }, never, never, false, never>;
}
