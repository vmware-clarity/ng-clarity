import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy, EventEmitter, TemplateRef, ViewContainerRef, OnInit, ElementRef, Renderer2, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoadingListener, ClrLoadingState } from '@clr/angular/utils/loading';
import * as i3 from '@angular/common';

declare const IF_ACTIVE_ID: InjectionToken<number>;
declare function tokenFactory(): number;
declare const IF_ACTIVE_ID_PROVIDER: {
    provide: InjectionToken<number>;
    useFactory: typeof tokenFactory;
};
declare class IfActiveService {
    /********
     * @property _currentChange
     *
     * @description
     * A RXJS Subject that updates and provides subscriptions to for the current current state of a component template
     * implemting the IfActive structural directive.
     *
     */
    private _currentChange;
    /*********
     * @property _current
     *
     * @description
     * A property holding the current value for current/closed state of an IfActive structural directive.
     */
    private _current;
    /*********
     *
     * @description
     * A getter function that provides an observable for the _current Subject.
     *
     */
    get currentChange(): Observable<number>;
    /*********
     *
     * @description
     * A property that gets/sets the current state of _current for this instance of IfActive structural directive.
     * And, broadcasts the new value to all subscribers.
     *
     */
    get current(): number;
    set current(value: number);
    static ɵfac: i0.ɵɵFactoryDeclaration<IfActiveService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfActiveService>;
}

declare class ClrIfActive implements OnDestroy {
    private ifActiveService;
    private id;
    private template;
    private container;
    /**********
     * @property activeChange
     *
     * @description
     * An event emitter that emits when the active property is set to allow for 2way binding when the directive is
     * used with de-structured / de-sugared syntax.
     *
     */
    activeChange: EventEmitter<boolean>;
    private subscription;
    private wasActive;
    constructor(ifActiveService: IfActiveService, id: number, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @description
     * A property that gets/sets IfActiveService.active with value.
     *
     */
    get active(): boolean | string;
    set active(value: boolean | string);
    ngOnDestroy(): void;
    /**
     * @description
     * Function that takes a any value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     */
    updateView(value: boolean): void;
    private checkAndUpdateView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfActive, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfActive, "[clrIfActive]", never, { "active": { "alias": "clrIfActive"; "required": false; }; }, { "activeChange": "clrIfActiveChange"; }, never, never, false, never>;
}

declare class IfExpandService implements LoadingListener {
    expandable: number;
    hasExpandTemplate: boolean;
    protected _loading: boolean;
    protected _expanded: boolean;
    protected _expandChange: Subject<boolean>;
    get loading(): boolean;
    set loading(value: boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    get expandChange(): Observable<boolean>;
    toggle(): void;
    loadingStateChange(state: ClrLoadingState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfExpandService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfExpandService>;
}

declare class ClrIfExpanded implements OnInit, OnDestroy {
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
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfExpanded, "[clrIfExpanded]", never, { "expanded": { "alias": "clrIfExpanded"; "required": false; }; }, { "expandedChange": "clrIfExpandedChange"; }, never, never, false, never>;
}

declare const CONDITIONAL_DIRECTIVES: Type<any>[];
declare class ClrConditionalModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrConditionalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrConditionalModule, [typeof ClrIfActive, typeof ClrIfExpanded], [typeof i3.CommonModule], [typeof ClrIfActive, typeof ClrIfExpanded]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrConditionalModule>;
}

export { CONDITIONAL_DIRECTIVES, ClrConditionalModule, ClrIfActive, ClrIfExpanded, IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, IfActiveService, IfExpandService, tokenFactory };
