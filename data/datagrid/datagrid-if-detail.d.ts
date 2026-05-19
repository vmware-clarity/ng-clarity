import { EventEmitter, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { DetailService } from './providers/detail.service';
import * as i0 from "@angular/core";
export declare class ClrIfDetail implements OnInit, OnDestroy {
    private templateRef;
    private viewContainer;
    private detailService;
    stateChange: EventEmitter<any>;
    private subscriptions;
    private skip;
    private embeddedViewRef;
    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef, detailService: DetailService);
    set state(model: any);
    get viewContext(): {
        $implicit: any;
    };
    ngOnInit(): void;
    ngOnDestroy(): void;
    private togglePanel;
    /**
     * For a given outlet instance, we create a proxy object that delegates
     * to the user-specified context. This allows changing, or swapping out
     * the context object completely without having to destroy/re-create the view.
     */
    private _createContextForwardProxy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfDetail, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfDetail, "[clrIfDetail]", never, { "state": "clrIfDetail"; }, { "stateChange": "clrIfDetailChange"; }, never, never, false, never>;
}
