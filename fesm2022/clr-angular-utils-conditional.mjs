import * as i0 from '@angular/core';
import { InjectionToken, Injectable, EventEmitter, Input, Output, Inject, Directive, Optional, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { ClrLoadingState } from '@clr/angular/utils/loading';
import { CommonModule } from '@angular/common';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let activeCounter = 0;
const IF_ACTIVE_ID = new InjectionToken('IF_ACTIVE_ID');
function tokenFactory() {
    return ++activeCounter;
}
const IF_ACTIVE_ID_PROVIDER = {
    provide: IF_ACTIVE_ID,
    useFactory: tokenFactory,
};
/*********
 * @class IfActiveService
 *
 * @description
 * An injectable service used by IfActive structural directives and the components that implement IfActive in their
 * templates. It holds the value of the current state and provides an Observable that both the directive and the
 * implementing component can subscribe to in order to take action on current value changes.
 *
 */
class IfActiveService {
    constructor() {
        /********
         * @property _currentChange
         *
         * @description
         * A RXJS Subject that updates and provides subscriptions to for the current current state of a component template
         * implemting the IfActive structural directive.
         *
         */
        this._currentChange = new Subject();
    }
    /*********
     *
     * @description
     * A getter function that provides an observable for the _current Subject.
     *
     */
    get currentChange() {
        return this._currentChange.asObservable();
    }
    /*********
     *
     * @description
     * A property that gets/sets the current state of _current for this instance of IfActive structural directive.
     * And, broadcasts the new value to all subscribers.
     *
     */
    get current() {
        return this._current;
    }
    set current(value) {
        if (this._current !== value) {
            this._current = value;
            this._currentChange.next(value);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfActiveService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfActiveService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfActiveService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**********
 *
 * @class ClrIfActive
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: IfActiveService to maintain state between itself and
 * the component using it in the component template.
 *
 */
class ClrIfActive {
    constructor(ifActiveService, id, template, container) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.template = template;
        this.container = container;
        /**********
         * @property activeChange
         *
         * @description
         * An event emitter that emits when the active property is set to allow for 2way binding when the directive is
         * used with de-structured / de-sugared syntax.
         *
         */
        this.activeChange = new EventEmitter(false);
        this.wasActive = false;
        this.checkAndUpdateView(ifActiveService.current);
        this.subscription = ifActiveService.currentChange.subscribe(newCurrentId => {
            this.checkAndUpdateView(newCurrentId);
        });
    }
    /**
     * @description
     * A property that gets/sets IfActiveService.active with value.
     *
     */
    get active() {
        return this.ifActiveService.current === this.id;
    }
    set active(value) {
        if (value) {
            this.ifActiveService.current = this.id;
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * @description
     * Function that takes a any value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     */
    updateView(value) {
        if (value) {
            this.container.createEmbeddedView(this.template);
        }
        else {
            this.container.clear();
        }
    }
    checkAndUpdateView(currentId) {
        const isNowActive = currentId === this.id;
        // only emit if the new active state is changed since last time.
        if (isNowActive !== this.wasActive) {
            this.updateView(isNowActive);
            this.activeChange.emit(isNowActive);
            this.wasActive = isNowActive;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfActive, deps: [{ token: IfActiveService }, { token: IF_ACTIVE_ID }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrIfActive, isStandalone: false, selector: "[clrIfActive]", inputs: { active: ["clrIfActive", "active"] }, outputs: { activeChange: "clrIfActiveChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfActive, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfActive]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { activeChange: [{
                type: Output,
                args: ['clrIfActiveChange']
            }], active: [{
                type: Input,
                args: ['clrIfActive']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class IfExpandService {
    constructor() {
        this.expandable = 0;
        this.hasExpandTemplate = false;
        this._loading = false;
        this._expanded = false;
        this._expandChange = new Subject();
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        value = !!value;
        if (value !== this._loading) {
            this._loading = value;
        }
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        value = !!value;
        if (value !== this._expanded) {
            this._expanded = value;
            this._expandChange.next(value);
        }
    }
    get expandChange() {
        return this._expandChange.asObservable();
    }
    toggle() {
        this.expanded = !this._expanded;
    }
    loadingStateChange(state) {
        switch (state) {
            case ClrLoadingState.LOADING:
                this.loading = true;
                break;
            default:
                this.loading = false;
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfExpandService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfExpandService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: IfExpandService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrIfExpanded {
    constructor(template, container, el, renderer, expand) {
        this.template = template;
        this.container = container;
        this.el = el;
        this.renderer = renderer;
        this.expand = expand;
        this.expandedChange = new EventEmitter(true);
        this._expanded = false;
        /**
         * Subscriptions to all the services and queries changes
         */
        this._subscriptions = [];
        this._subscriptions.push(expand.expandChange.subscribe(() => {
            this.updateView();
            this.expandedChange.emit(expand.expanded);
        }));
        expand.hasExpandTemplate = !!template;
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        if (typeof value === 'boolean') {
            this.expand.expanded = value;
            this._expanded = value;
        }
    }
    ngOnInit() {
        this.expand.expandable++;
        this.updateView();
    }
    ngOnDestroy() {
        this.expand.expandable--;
        this._subscriptions.forEach((sub) => sub.unsubscribe());
    }
    updateView() {
        if (this.expand.expanded && this.container.length !== 0) {
            return;
        }
        if (this.template) {
            if (this.expand.expanded) {
                // Should we pass a context? I don't see anything useful to pass right now,
                // but we can come back to it in the future as a solution for additional features.
                this.container.createEmbeddedView(this.template);
            }
            else {
                // TODO: Move when we move the animation logic to Datagrid Row Expand
                // We clear before the animation is over. Not ideal, but doing better would involve a much heavier
                // process for very little gain. Once Angular animations are dynamic enough, we should be able to
                // get the optimal behavior.
                this.container.clear();
            }
        }
        else {
            try {
                // If we don't have a template ref, we fallback to a crude display: none for now.
                if (this.expand.expanded) {
                    this.renderer.setStyle(this.el.nativeElement, 'display', null);
                }
                else {
                    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (e) {
                // We catch the case where clrIfExpanded was put on a non-DOM element, and we just do nothing
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfExpanded, deps: [{ token: i0.TemplateRef, optional: true }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: IfExpandService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrIfExpanded, isStandalone: false, selector: "[clrIfExpanded]", inputs: { expanded: ["clrIfExpanded", "expanded"] }, outputs: { expandedChange: "clrIfExpandedChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfExpanded, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfExpanded]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: IfExpandService }], propDecorators: { expandedChange: [{
                type: Output,
                args: ['clrIfExpandedChange']
            }], expanded: [{
                type: Input,
                args: ['clrIfExpanded']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CONDITIONAL_DIRECTIVES = [ClrIfActive, ClrIfExpanded];
class ClrConditionalModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrConditionalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrConditionalModule, declarations: [ClrIfActive, ClrIfExpanded], imports: [CommonModule], exports: [ClrIfActive, ClrIfExpanded] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrConditionalModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrConditionalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CONDITIONAL_DIRECTIVES],
                    exports: [CONDITIONAL_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CONDITIONAL_DIRECTIVES, ClrConditionalModule, ClrIfActive, ClrIfExpanded, IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, IfActiveService, IfExpandService, tokenFactory };
//# sourceMappingURL=clr-angular-utils-conditional.mjs.map
