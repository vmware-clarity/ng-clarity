import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { IfExpandService } from './if-expanded.service';
import * as i0 from "@angular/core";
export declare class ClrIfExpanded implements OnInit, OnDestroy {
    private template;
    private container;
    private el;
    private renderer;
    private expand;
    expandedChange: EventEmitter<boolean>;
    private _expanded;
    /**
     * Subscriptions to all the services and queries changes
     */
    private _subscriptions;
    constructor(template: TemplateRef<any>, container: ViewContainerRef, el: ElementRef<HTMLElement>, renderer: Renderer2, expand: IfExpandService);
    get expanded(): boolean | string;
    set expanded(value: boolean | string);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private updateView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfExpanded, [{ optional: true; }, null, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfExpanded, "[clrIfExpanded]", never, { "expanded": "clrIfExpanded"; }, { "expandedChange": "clrIfExpandedChange"; }, never, never, false, never>;
}
