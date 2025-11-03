import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { IfExpandService } from './if-expanded.service';
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
}
