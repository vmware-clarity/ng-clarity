import { FormControl, FormGroup } from '@angular/forms';
import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Output, Input, Directive, NgModule, TemplateRef, ViewChild, Component, ElementRef, HostListener, HostBinding, Optional, InjectionToken, Inject, PLATFORM_ID, DOCUMENT, ContentChildren, SkipSelf, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as i2 from '@angular/animations';
import { animation, style, animate, state, transition, trigger, useAnimation } from '@angular/animations';
import { Subject, fromEvent, Observable, isObservable, of } from 'rxjs';
import { ClrLoadingState as ClrLoadingState$1 } from '@clr/angular/utils/loading';
import { takeUntil } from 'rxjs/operators';
import * as i1 from '@angular/cdk/a11y';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import * as i2$1 from '@angular/cdk/drag-drop';
import { CdkDrag, CDK_DROP_LIST, CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import * as i1$1 from '@angular/cdk/bidi';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function triggerAllFormControlValidation(formGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched();
            control.markAsDirty();
            control.updateValueAndValidity();
        }
        else if (control instanceof FormGroup) {
            triggerAllFormControlValidation(control);
        }
    });
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * If we someday want to be able to render the datagrid in a webworker,
 * this is where we would test if we're in headless mode. Right now it's not testing anything, but any access
 * to native DOM elements' methods and properties in the Datagrid happens here.
 */
class DomAdapter {
    /*
      We clone the element and take its measurements from outside the grid
      so we don't trigger reflow for the whole datagrid.
    */
    userDefinedWidth(element) {
        const clonedElement = element.cloneNode(true);
        if (clonedElement.id) {
            clonedElement.id = clonedElement.id + '-clone';
        }
        clonedElement.classList.add('datagrid-cell-width-zero');
        document.body.appendChild(clonedElement);
        const userDefinedWidth = this.clientRect(clonedElement).width;
        clonedElement.remove();
        return userDefinedWidth;
    }
    scrollBarWidth(element) {
        return element.offsetWidth - element.clientWidth;
    }
    scrollWidth(element) {
        return element.scrollWidth || 0;
    }
    computedHeight(element) {
        return parseInt(getComputedStyle(element).getPropertyValue('height'), 10);
    }
    clientRect(element) {
        const elementClientRect = element.getBoundingClientRect();
        return {
            top: parseInt(elementClientRect.top, 10),
            bottom: parseInt(elementClientRect.bottom, 10),
            left: parseInt(elementClientRect.left, 10),
            right: parseInt(elementClientRect.right, 10),
            width: parseInt(elementClientRect.width, 10),
            height: parseInt(elementClientRect.height, 10),
        };
    }
    minWidth(element) {
        return parseInt(getComputedStyle(element).getPropertyValue('min-width'), 10);
    }
    focus(element) {
        element.focus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DomAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DomAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DomAdapter, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDomAdapter extends DomAdapter {
    constructor() {
        super(...arguments);
        this._userDefinedWidth = 0;
        this._scrollBarWidth = 0;
        this._scrollWidth = 0;
        this._computedHeight = 0;
    }
    userDefinedWidth(_element) {
        return this._userDefinedWidth;
    }
    scrollBarWidth(_element) {
        return this._scrollBarWidth;
    }
    scrollWidth(_element) {
        return this._scrollWidth;
    }
    computedHeight(_element) {
        return this._computedHeight;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MockDomAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MockDomAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: MockDomAdapter, decorators: [{
            type: Injectable
        }] });
const MOCK_DOM_ADAPTER_PROVIDER = {
    provide: DomAdapter,
    useClass: MockDomAdapter,
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class OutsideClick {
    constructor(host, renderer, ngZone) {
        this.strict = false;
        this.outsideClick = new EventEmitter(false);
        ngZone.runOutsideAngular(() => {
            this.documentClickListener = renderer.listen('document', 'click', (event) => {
                // Compare the element in the DOM on which the mouse was clicked
                // with the current actionMenu native HTML element.
                if (host.nativeElement === event.target) {
                    return;
                }
                if (!this.strict && host.nativeElement.contains(event.target)) {
                    return;
                }
                // We'll run change detection only if the click event actually happened outside of
                // the host element.
                ngZone.run(() => {
                    this.outsideClick.emit(event);
                });
            });
        });
    }
    ngOnDestroy() {
        this.documentClickListener();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OutsideClick, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: OutsideClick, isStandalone: false, selector: "[clrOutsideClick]", inputs: { strict: ["clrStrict", "strict"] }, outputs: { outsideClick: "clrOutsideClick" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OutsideClick, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrOutsideClick]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }], propDecorators: { strict: [{
                type: Input,
                args: ['clrStrict']
            }], outsideClick: [{
                type: Output,
                args: ['clrOutsideClick']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const OUSTIDE_CLICK_DIRECTIVES = [OutsideClick];
class ClrOutsideClickModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOutsideClickModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrOutsideClickModule, declarations: [OutsideClick], imports: [CommonModule], exports: [OutsideClick] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOutsideClickModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrOutsideClickModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [OUSTIDE_CLICK_DIRECTIVES],
                    exports: [OUSTIDE_CLICK_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TemplateRefContainer {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TemplateRefContainer, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: TemplateRefContainer, isStandalone: false, selector: "ng-component", viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TemplateRefContainer, decorators: [{
            type: Component,
            args: [{
                    template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], propDecorators: { template: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTemplateRefModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTemplateRefModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTemplateRefModule, declarations: [TemplateRefContainer], imports: [CommonModule], exports: [TemplateRefContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTemplateRefModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTemplateRefModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [TemplateRefContainer],
                    exports: [TemplateRefContainer],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * TODO:
 * Using core functions like:
 * - pluckPixelValue
 * - getCssPropertyValue
 *
 * to get the value of the design token.
 *
 * Note: Memoization/Cache usage possible.
 */
// iPad mini screen width
// http://stephen.io/mediaqueries/#iPadMini
const DATEPICKER_ENABLE_BREAKPOINT = 768;
const SMALL_BREAKPOINT = 576;
const MEDIUM_BREAKPOINT = 768;
const LARGE_BREAKPOINT = 992;
const EXTRA_LARGE_BREAKPOINT = 1200;

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class EmptyAnchor {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: EmptyAnchor, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: EmptyAnchor, isStandalone: false, selector: "ng-component", ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: EmptyAnchor, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 * TODO - make sure these comment annotations do not break ng-packgr.
 */
class HostWrapper {
    constructor(containerType, vcr, index = 0) {
        this.injector = vcr.injector;
        // If the host is already wrapped, we don't do anything
        if (!this.injector.get(containerType, null)) {
            const el = this.injector.get(ElementRef);
            // We need a new anchor, since we're projecting the current one.
            vcr.createComponent(EmptyAnchor);
            // Craft the element array based on what slot to use. Angular only uses the index to determine
            // which ng-content to project into, so if you have more than one ng-content you'll need to set
            // the index in the constructor appropriately
            const element = [];
            element[index] = [el.nativeElement];
            // We're assuming only one projection slot, but in more complex cases we might want to provide
            // a different array of projected elements.
            const containerRef = vcr.createComponent(containerType, {
                projectableNodes: element,
            });
            // We can now remove the useless anchor
            vcr.remove(0);
            // We keep the wrapper's injector to access the dependencies that weren't available before.
            this.injector = containerRef.injector;
        }
    }
    get(token, notFoundValue) {
        return this.injector.get(token, notFoundValue);
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Internal module, please do not export!
 */
class ClrHostWrappingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrHostWrappingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrHostWrappingModule, declarations: [EmptyAnchor], exports: [EmptyAnchor] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrHostWrappingModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrHostWrappingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [EmptyAnchor],
                    exports: [EmptyAnchor],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function assertNever(value) {
    throw new Error(`Unhandled value: ${value}`);
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function isBooleanAttributeSet(value) {
    // for null just return false no need to check anything
    if (value === null) {
        return false;
    }
    if (typeof value === 'string') {
        // Empty string is valid, 'true' as string is also valid
        return value.length >= 0;
    }
    // Boolean value will be read as it is, everything else is false
    return typeof value === 'boolean' ? value : false;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const defaultAnimationTiming = '0.2s ease-in-out';
const defaultExpandAnimation = animation([style({ height: '{{ startHeight }}px' }), animate(defaultAnimationTiming, style({ height: '*' }))], {
    params: {
        startHeight: 0, // default
    },
});

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function collapse() {
    'use strict';
    return [
        state('true', style({ height: 0, 'overflow-y': 'hidden' })),
        transition('true => false', [animate(defaultAnimationTiming, style({ height: '*', 'overflow-y': 'hidden' }))]),
        transition('false => true', [style({ height: '*', 'overflow-y': 'hidden' }), animate(defaultAnimationTiming)]),
    ];
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class BaseExpandableAnimation {
    constructor(element, domAdapter, renderer) {
        this.element = element;
        this.domAdapter = domAdapter;
        this.renderer = renderer;
        this.startHeight = 0;
    }
    updateStartHeight() {
        this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
    }
    initAnimationEffects() {
        this.renderer.setStyle(this.element.nativeElement, 'overflow', 'hidden');
    }
    cleanupAnimationEffects(cancelAnimations = false) {
        this.renderer.removeStyle(this.element.nativeElement, 'overflow');
        // A "safe" auto-update of the height ensuring basic OOTB user experience .
        // Prone to small jumps in initial animation height if data was changed in the meantime, the window was resized, etc.
        // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
        this.updateStartHeight();
        if (cancelAnimations) {
            this.cancelElementAnimations();
        }
    }
    cancelElementAnimations() {
        this.element.nativeElement.getAnimations().forEach(animation => {
            if (animation.playState === 'finished') {
                animation.cancel(); // clears animation-style set on the element
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: BaseExpandableAnimation, deps: [{ token: i0.ElementRef }, { token: DomAdapter }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: BaseExpandableAnimation, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: BaseExpandableAnimation, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: DomAdapter }, { type: i0.Renderer2 }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrExpandableAnimation extends BaseExpandableAnimation {
    constructor() {
        super(...arguments);
        this.clrExpandTrigger = false;
    }
    get expandAnimation() {
        return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
    }
    animationStart(event) {
        if (event.fromState !== 'void') {
            this.initAnimationEffects();
        }
    }
    animationDone(event) {
        if (event.fromState !== 'void') {
            this.cleanupAnimationEffects();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimation, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrExpandableAnimation, isStandalone: false, selector: "clr-expandable-animation", inputs: { clrExpandTrigger: "clrExpandTrigger" }, host: { listeners: { "@expandAnimation.start": "animationStart($event)", "@expandAnimation.done": "animationDone($event)" }, properties: { "@expandAnimation": "this.expandAnimation" } }, providers: [DomAdapter], usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimation, decorators: [{
            type: Component,
            args: [{ selector: 'clr-expandable-animation', template: `<ng-content></ng-content>`, animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])], providers: [DomAdapter], standalone: false, styles: [":host{display:block}\n"] }]
        }], propDecorators: { clrExpandTrigger: [{
                type: Input
            }], expandAnimation: [{
                type: HostBinding,
                args: ['@expandAnimation']
            }], animationStart: [{
                type: HostListener,
                args: ['@expandAnimation.start', ['$event']]
            }], animationDone: [{
                type: HostListener,
                args: ['@expandAnimation.done', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrExpandableAnimationDirective extends BaseExpandableAnimation {
    constructor(element, domAdapter, renderer, builder) {
        super(element, domAdapter, renderer);
        this.builder = builder;
        this.expanded = false;
    }
    ngOnChanges(changes) {
        if (changes['expanded'] && !changes['expanded'].firstChange) {
            Promise.resolve().then(() => this.playAnimation());
        }
    }
    ngOnDestroy() {
        this.player?.destroy();
    }
    playAnimation() {
        if (this.player) {
            this.player.destroy();
        }
        this.player = this.builder
            .build([useAnimation(defaultExpandAnimation, { params: { startHeight: this.startHeight } })])
            .create(this.element.nativeElement);
        this.player.onStart(() => this.initAnimationEffects());
        this.player.onDone(() => this.cleanupAnimationEffects(true));
        this.player.play();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationDirective, deps: [{ token: i0.ElementRef }, { token: DomAdapter }, { token: i0.Renderer2 }, { token: i2.AnimationBuilder }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrExpandableAnimationDirective, isStandalone: false, selector: "[clrExpandableAnimation]", inputs: { expanded: ["clrExpandableAnimation", "expanded"] }, host: { properties: { "class.clr-expandable-animation": "true" } }, providers: [DomAdapter], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrExpandableAnimation]',
                    providers: [DomAdapter],
                    host: {
                        '[class.clr-expandable-animation]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: DomAdapter }, { type: i0.Renderer2 }, { type: i2.AnimationBuilder }], propDecorators: { expanded: [{
                type: Input,
                args: ['clrExpandableAnimation']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const EXPANDABLE_ANIMATION_DIRECTIVES = [ClrExpandableAnimation, ClrExpandableAnimationDirective];
class ClrExpandableAnimationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationModule, declarations: [ClrExpandableAnimation, ClrExpandableAnimationDirective], imports: [CommonModule], exports: [ClrExpandableAnimation, ClrExpandableAnimationDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrExpandableAnimationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [EXPANDABLE_ANIMATION_DIRECTIVES],
                    exports: [EXPANDABLE_ANIMATION_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function fade(opacity = 1) {
    return [
        transition('void => *', [style({ opacity: 0 }), animate(defaultAnimationTiming, style({ opacity: opacity }))]),
        transition('* => void', [animate(defaultAnimationTiming, style({ opacity: 0 }))]),
    ];
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function fadeSlide(direction) {
    let transform = null;
    if (direction === 'up') {
        transform = 'translate(0, 25%)';
    }
    else if (direction === 'down') {
        transform = 'translate(0, -25%)';
    }
    else if (direction === 'left') {
        transform = 'translate(25%, 0)';
    }
    else if (direction === 'right') {
        transform = 'translate(-25%, 0)';
    }
    else {
        throw new Error('Unknown direction ' + direction + ' for slide animation.');
    }
    return [
        transition('void => *', [style({ opacity: 0, transform: transform }), animate(defaultAnimationTiming)]),
        transition('* => void', [animate(defaultAnimationTiming, style({ opacity: 0, transform: transform }))]),
    ];
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function slide(direction) {
    let transform = null;
    if (direction === 'up') {
        transform = 'translate(0, 25%)';
    }
    else if (direction === 'down') {
        transform = 'translate(0, -25%)';
    }
    else if (direction === 'left') {
        transform = 'translate(25%, 0)';
    }
    else if (direction === 'right') {
        transform = 'translate(-25%, 0)';
    }
    else {
        throw new Error('Unknown direction ' + direction + ' for slide animation.');
    }
    return [
        transition('void => *', [style({ transform: transform }), animate(defaultAnimationTiming)]),
        transition('* => void', [animate(defaultAnimationTiming, style({ transform: transform }))]),
    ];
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
class LoadingListener {
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrLoadingState;
(function (ClrLoadingState) {
    ClrLoadingState[ClrLoadingState["DEFAULT"] = 0] = "DEFAULT";
    ClrLoadingState[ClrLoadingState["LOADING"] = 1] = "LOADING";
    ClrLoadingState[ClrLoadingState["SUCCESS"] = 2] = "SUCCESS";
    ClrLoadingState[ClrLoadingState["ERROR"] = 3] = "ERROR";
})(ClrLoadingState || (ClrLoadingState = {}));
class ClrLoading {
    // We find the first parent that handles something loading
    constructor(listener) {
        this.listener = listener;
        this._loadingState = ClrLoadingState.DEFAULT;
    }
    get loadingState() {
        return this._loadingState;
    }
    set loadingState(value) {
        if (value === true) {
            value = ClrLoadingState.LOADING;
        }
        else if (!value) {
            value = ClrLoadingState.DEFAULT;
        }
        if (value === this._loadingState) {
            return;
        }
        this._loadingState = value;
        if (this.listener) {
            this.listener.loadingStateChange(value);
        }
    }
    ngOnDestroy() {
        this.loadingState = ClrLoadingState.DEFAULT;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoading, deps: [{ token: LoadingListener, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrLoading, isStandalone: false, selector: "[clrLoading]", inputs: { loadingState: ["clrLoading", "loadingState"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoading, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrLoading]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LoadingListener, decorators: [{
                    type: Optional
                }] }], propDecorators: { loadingState: [{
                type: Input,
                args: ['clrLoading']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_LOADING_DIRECTIVES = [ClrLoading];
class ClrLoadingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, declarations: [ClrLoading], imports: [CommonModule], exports: [ClrLoading] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_LOADING_DIRECTIVES],
                    exports: [CLR_LOADING_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
            case ClrLoadingState$1.LOADING:
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

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const commonStringsDefault = {
    open: 'Open',
    close: 'Close',
    show: 'Show',
    hide: 'Hide',
    apply: 'Apply',
    cancel: 'Cancel',
    expand: 'Expand',
    collapse: 'Collapse',
    more: 'More',
    select: 'Select',
    selectAll: 'Select All',
    previous: 'Previous',
    next: 'Next',
    current: 'Jump to current',
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    danger: 'Error',
    neutral: 'Neutral',
    unknown: 'Unknown',
    rowActions: 'Available actions',
    pickColumns: 'Manage Columns',
    showColumns: 'Show Columns',
    sortColumn: 'Sort Column',
    firstPage: 'First Page',
    lastPage: 'Last Page',
    nextPage: 'Next Page',
    previousPage: 'Previous Page',
    currentPage: 'Current Page',
    totalPages: 'Total Pages',
    filterItems: 'Filter items',
    minValue: 'Min value',
    maxValue: 'Max value',
    modalContentStart: 'Beginning of Modal Content',
    modalContentEnd: 'End of Modal Content',
    sidePanelPin: 'Pin Side Panel',
    showColumnsMenuDescription: 'Show or hide columns menu',
    allColumnsSelected: 'All columns selected',
    signpostToggle: 'Signpost Toggle',
    signpostClose: 'Close',
    loading: 'Loading',
    // Datagrid
    detailPaneStart: 'Start of row details',
    detailPaneEnd: 'End of row details',
    singleSelectionAriaLabel: 'Single selection header',
    singleActionableAriaLabel: 'Single actionable header',
    detailExpandableAriaLabel: 'Toggle more row content',
    datagridFilterAriaLabel: '{COLUMN} filter',
    datagridFilterLabel: '{COLUMN} filter',
    datagridFilterDialogAriaLabel: 'Filter dialog',
    columnSeparatorAriaLabel: 'Column resize handle',
    columnSeparatorDescription: 'Use left or right key to resize the column',
    fromLabel: 'From',
    toLabel: 'To',
    // Alert
    alertCloseButtonAriaLabel: 'Close alert',
    alertNextAlertAriaLabel: 'Next alert message, {CURRENT} of {COUNT}',
    alertPreviousAlertAriaLabel: 'Previous alert message, {CURRENT} of {COUNT}',
    // Date Picker
    datepickerDialogLabel: 'Choose date',
    datepickerToggleChooseDateLabel: 'Choose date',
    datepickerToggleChangeDateLabel: 'Change date, {SELECTED_DATE}',
    datepickerPreviousMonth: 'Previous month',
    datepickerCurrentMonth: 'Current month',
    datepickerNextMonth: 'Next month',
    datepickerPreviousDecade: 'Previous decade',
    datepickerNextDecade: 'Next decade',
    datepickerCurrentDecade: 'Current decade',
    datepickerSelectMonthText: 'Select month, the current month is {CALENDAR_MONTH}',
    datepickerSelectYearText: 'Select year, the current year is {CALENDAR_YEAR}',
    datepickerSelectedLabel: '{FULL_DATE} - Selected',
    // Stack View
    stackViewChanged: 'Value changed.',
    // Responsive Nav
    responsiveNavToggleOpen: 'Open navigation menu',
    responsiveNavToggleClose: 'Close navigation menu',
    responsiveNavOverflowOpen: 'Open navigation overflow menu',
    responsiveNavOverflowClose: 'Close navigation overflow menu',
    //Vertical Nav
    verticalNavToggle: 'Toggle vertical navigation',
    // Timeline steps
    timelineStepNotStarted: 'Not started',
    timelineStepCurrent: 'Current',
    timelineStepSuccess: 'Completed',
    timelineStepError: 'Error',
    timelineStepProcessing: 'In progress',
    // Combobox
    comboboxDelete: 'Delete selected option',
    comboboxSearching: 'Searching for matches for "{INPUT}"',
    comboboxSelection: 'Selection',
    comboboxSelected: 'Selected',
    comboboxNoResults: 'No results',
    comboboxOpen: 'Show options',
    // Datagrid expandable rows
    datagridExpandableBeginningOf: 'Beginning of',
    datagridExpandableEndOf: 'End of',
    datagridExpandableRowContent: 'Expandable row content',
    datagridExpandableRowsHelperText: `Screen reader table commands may not work for viewing expanded content, please use your screen reader's browse mode to read the content exposed by this button`,
    // Wizard
    wizardStep: 'Step',
    wizardStepCurrent: 'Current',
    wizardStepSuccess: 'Completed',
    wizardStepError: 'Error',
    wizardStepnavAriaLabel: 'Wizard steps',
    /**
     * Password Input
     * Screen-reader text for the hide/show password field button
     */
    passwordHide: 'Hide password for {LABEL}',
    passwordShow: 'Show password for {LABEL}',
    /**
     * Datagrid footer; sr-only text after the number of selected rows.
     */
    selectedRows: 'Selected rows',
    // Accordion/Stepper
    stepComplete: 'Step {STEP} complete',
    stepError: 'Error in step {STEP}',
    // File input
    browse: 'Browse',
    fileCount: '{COUNT} files',
    clearFile: 'Clear {FILE}',
    clearFiles: 'Clear {COUNT} files',
    // Tree
    selectedTreeNode: 'selected',
    unselectedTreeNode: 'unselected',
    // Breadcrumbs
    breadcrumbsLabel: 'breadcrumbs',
    expandBreadcrumbsLabel: 'Expand breadcrumbs',
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCommonStringsService {
    constructor() {
        this._strings = commonStringsDefault;
    }
    /**
     * Access to all of the keys as strings
     */
    get keys() {
        return this._strings;
    }
    /**
     * Allows you to pass in new overrides for localization
     */
    localize(overrides) {
        this._strings = { ...this._strings, ...overrides };
    }
    /**
     * Parse a string with a set of tokens to replace
     */
    parse(source, tokens = {}) {
        const names = Object.keys(tokens);
        let output = source;
        if (names.length) {
            names.forEach(name => {
                output = output.replace(`{${name}}`, tokens[name]);
            });
        }
        return output;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonStringsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonStringsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrCommonStringsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const FOCUS_ON_VIEW_INIT = new InjectionToken('FOCUS_ON_VIEW_INIT');
// This provider holds the default value for clrFocusOnViewInit directive's isEnabled property.
// So users can interject this provider and set their own value for this provider.
const FOCUS_ON_VIEW_INIT_PROVIDER = {
    provide: FOCUS_ON_VIEW_INIT,
    useValue: true,
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*  This directive is for guiding the document focus to the newly added content when its view is initialized
    so that assistive technologies can read its content. */
class ClrFocusOnViewInit {
    constructor(el, platformId, focusOnViewInit, document, renderer, ngZone) {
        this.el = el;
        this.platformId = platformId;
        this.focusOnViewInit = focusOnViewInit;
        this.renderer = renderer;
        this.directFocus = true; // true if the element gets focused without need to set tabindex;
        this.destroy$ = new Subject();
        this._isEnabled = focusOnViewInit;
        // Angular compiler doesn't understand the type Document
        // when working out the metadata for injectable parameters,
        // even though it understands the injection token DOCUMENT
        // https://github.com/angular/angular/issues/20351
        this.document = document;
        ngZone.runOutsideAngular(() => fromEvent(el.nativeElement, 'focusout')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            if (!this.directFocus) {
                // manually set attributes and styles should be removed
                renderer.removeAttribute(el.nativeElement, 'tabindex');
                renderer.setStyle(el.nativeElement, 'outline', null);
            }
        }));
    }
    set isEnabled(value) {
        if (this.focusOnViewInit && typeof value === 'boolean') {
            this._isEnabled = value;
        }
    }
    ngAfterViewInit() {
        this.focus();
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    focus() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (!this._isEnabled) {
            return;
        }
        if (this.document && this.document.activeElement !== this.el.nativeElement) {
            this.el.nativeElement.focus();
            if (this.document.activeElement !== this.el.nativeElement) {
                // if it's not directly focused now, it means it was a non-interactive element
                // so we need to give it a tabindex.
                this.directFocus = false;
                this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
                this.renderer.setStyle(this.el.nativeElement, 'outline', 'none');
                this.el.nativeElement.focus();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInit, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }, { token: FOCUS_ON_VIEW_INIT }, { token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrFocusOnViewInit, isStandalone: false, selector: "[clrFocusOnViewInit]", inputs: { isEnabled: ["clrFocusOnViewInit", "isEnabled"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInit, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrFocusOnViewInit]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [FOCUS_ON_VIEW_INIT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.NgZone }], propDecorators: { isEnabled: [{
                type: Input,
                args: ['clrFocusOnViewInit']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const FOCUS_ON_VIEW_INIT_DIRECTIVES = [ClrFocusOnViewInit];
class ClrFocusOnViewInitModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, declarations: [ClrFocusOnViewInit], imports: [CommonModule], exports: [ClrFocusOnViewInit] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, providers: [FOCUS_ON_VIEW_INIT_PROVIDER], imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrFocusOnViewInitModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                    providers: [FOCUS_ON_VIEW_INIT_PROVIDER],
                    exports: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef, focusTrapFactory, document) {
        super(elementRef, focusTrapFactory, document);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStandaloneCdkTrapFocus, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrStandaloneCdkTrapFocus, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStandaloneCdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrFocusDirection;
(function (ClrFocusDirection) {
    ClrFocusDirection["VERTICAL"] = "vertical";
    ClrFocusDirection["HORIZONTAL"] = "horizontal";
    ClrFocusDirection["BOTH"] = "both";
})(ClrFocusDirection || (ClrFocusDirection = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrKeyFocusItem {
    constructor(elementRef, platformId) {
        this.elementRef = elementRef;
        this.platformId = platformId;
    }
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    focus() {
        if (isPlatformBrowser(this.platformId)) {
            this.elementRef.nativeElement.focus();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusItem, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrKeyFocusItem, isStandalone: false, selector: "[clrKeyFocusItem]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrKeyFocusItem]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var Keys;
(function (Keys) {
    Keys["ArrowLeft"] = "ArrowLeft";
    Keys["ArrowUp"] = "ArrowUp";
    Keys["ArrowRight"] = "ArrowRight";
    Keys["ArrowDown"] = "ArrowDown";
    Keys["Backspace"] = "Backspace";
    Keys["Tab"] = "Tab";
    Keys["Enter"] = "Enter";
    Keys["Escape"] = "Escape";
    Keys["Space"] = "Space";
    Keys["Spacebar"] = " ";
    Keys["Home"] = "Home";
    Keys["End"] = "End";
    Keys["PageDown"] = "PageDown";
    Keys["PageUp"] = "PageUp";
})(Keys || (Keys = {}));
var IEKeys;
(function (IEKeys) {
    IEKeys["ArrowUp"] = "Up";
    IEKeys["ArrowDown"] = "Down";
    IEKeys["ArrowRight"] = "Right";
    IEKeys["ArrowLeft"] = "Left";
    IEKeys["Space"] = "Spacebar";
    IEKeys["Escape"] = "Esc";
})(IEKeys || (IEKeys = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function normalizeKey(key) {
    if (key === Keys.ArrowUp || key === IEKeys.ArrowUp) {
        return Keys.ArrowUp;
    }
    else if (key === Keys.ArrowDown || key === IEKeys.ArrowDown) {
        return Keys.ArrowDown;
    }
    else if (key === Keys.ArrowRight || key === IEKeys.ArrowRight) {
        return Keys.ArrowRight;
    }
    else if (key === Keys.ArrowLeft || key === IEKeys.ArrowLeft) {
        return Keys.ArrowLeft;
    }
    else if (key === Keys.Space || key === IEKeys.Space) {
        return Keys.Space;
    }
    else if (key === Keys.Escape || key === IEKeys.Escape) {
        return Keys.Escape;
    }
    else {
        return key;
    }
}
function preventArrowKeyScroll(event) {
    const key = normalizeKey(event.key);
    if (key === Keys.ArrowUp || key === Keys.ArrowDown || key === Keys.ArrowLeft || key === Keys.ArrowRight) {
        // prevent element container scroll
        // MDN references this is really the only way to prevent native browser interactions
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
        event.preventDefault();
    }
}
function isKeyEitherLetterOrNumber(event) {
    const char = event.key;
    // Only letter characters differ when they switch between lowercase and uppercase, whether it's an English or non-English letter.
    return char.toLowerCase() !== char.toUpperCase() || (char >= '0' && char <= '9');
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrKeyFocus {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.direction = ClrFocusDirection.VERTICAL;
        this.focusOnLoad = false;
        this.subscriptions = [];
        this.focusChange = new EventEmitter();
        this._current = 0;
    }
    /**
     * Here we use `any` cause any other type require reworking all methods below and a lot of more ifs.
     * this method will only work with array with FocusableItems anyway so any other value will be ignored.
     */
    get focusableItems() {
        if (this._focusableItems) {
            return this._focusableItems;
        }
        else if (this.clrKeyFocusItems) {
            return this.clrKeyFocusItems.toArray();
        }
        return [];
    }
    set focusableItems(elements) {
        // We accept a list of focusable elements (HTMLElements or existing Directives) or auto query for clrKeyFocusItem
        // We accept a list reference in the cases where we cannot use ContentChildren to query
        // ContentChildren can be unavailable if content is projected outside the scope of the component (see tabs).
        if (Array.isArray(elements) && elements.length) {
            this._focusableItems = elements;
            this.initializeFocus();
        }
    }
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    get current() {
        return this._current;
    }
    set current(value) {
        if (this._current !== value) {
            this._current = value;
        }
    }
    get currentItem() {
        return this.focusableItems[this._current];
    }
    get currentItemElement() {
        return this.currentItem.nativeElement ? this.currentItem.nativeElement : this.currentItem;
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.listenForItemUpdates());
        this.initializeFocus();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    handleKeyboardEvent(event) {
        // Make sure event was originated on the current item's element
        if (this.currentItemElement !== event.target) {
            const position = this.getItemPosition(event.target);
            if (this.positionInRange(position)) {
                this.current = position;
            }
        }
        if (this.prevKeyPressed(event) && this.currentFocusIsNotFirstItem()) {
            this.moveTo(this.current - 1);
        }
        else if (this.nextKeyPressed(event) && this.currentFocusIsNotLastItem()) {
            this.moveTo(this.current + 1);
        }
        else if (event.code === Keys.Home) {
            this.moveTo(0);
        }
        else if (event.code === Keys.End) {
            this.moveTo(this.focusableItems.length - 1);
        }
        preventArrowKeyScroll(event);
    }
    setClickedItemCurrent(event) {
        const position = this.getItemPosition(event.target);
        if (position > -1) {
            this.moveTo(position);
        }
    }
    focusCurrent() {
        this.currentItem.focus();
        this.focusChange.next(this._current);
    }
    moveTo(position) {
        if (this.positionInRange(position)) {
            this.current = position;
            this.focusCurrent();
        }
    }
    positionInRange(position) {
        return position >= 0 && position < this.focusableItems.length;
    }
    currentFocusIsNotFirstItem() {
        return this._current - 1 >= 0;
    }
    currentFocusIsNotLastItem() {
        return this._current + 1 < this.focusableItems.length;
    }
    initializeFocus() {
        if (this.focusableItems && this.focusableItems.length) {
            // It is possible that the focus was on an element, whose index is no longer available.
            // This can happen when some of the focusable elements are being removed.
            // In such cases, the new focus is initialized on the last focusable element.
            if (this._current >= this.focusableItems.length) {
                this._current = this.focusableItems.length - 1;
            }
            if (this.focusOnLoad) {
                this.currentItem.focus();
                this.focusChange.emit();
            }
        }
    }
    nextKeyPressed(event) {
        const key = normalizeKey(event.key);
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return key === Keys.ArrowDown;
            case ClrFocusDirection.HORIZONTAL:
                return key === Keys.ArrowRight;
            case ClrFocusDirection.BOTH:
                return key === Keys.ArrowDown || key === Keys.ArrowRight;
            default:
                return false;
        }
    }
    prevKeyPressed(event) {
        const key = normalizeKey(event.key);
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return key === Keys.ArrowUp;
            case ClrFocusDirection.HORIZONTAL:
                return key === Keys.ArrowLeft;
            case ClrFocusDirection.BOTH:
                return key === Keys.ArrowUp || key === Keys.ArrowLeft;
            default:
                return false;
        }
    }
    getItemPosition(item) {
        if (this._focusableItems) {
            return this.focusableItems.indexOf(item);
        }
        else {
            return this.focusableItems.map(_item => _item.nativeElement).indexOf(item);
        }
    }
    listenForItemUpdates() {
        return this.clrKeyFocusItems.changes.subscribe(() => {
            this.initializeFocus();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocus, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrKeyFocus, isStandalone: false, selector: "[clrKeyFocus]", inputs: { direction: ["clrDirection", "direction"], focusOnLoad: ["clrFocusOnLoad", "focusOnLoad"], focusableItems: ["clrKeyFocus", "focusableItems"] }, outputs: { focusChange: "clrFocusChange" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)", "click": "setClickedItemCurrent($event)" } }, queries: [{ propertyName: "clrKeyFocusItems", predicate: ClrKeyFocusItem, descendants: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocus, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrKeyFocus]',
                    template: '<ng-content></ng-content>',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { direction: [{
                type: Input,
                args: ['clrDirection']
            }], focusOnLoad: [{
                type: Input,
                args: ['clrFocusOnLoad']
            }], clrKeyFocusItems: [{
                type: ContentChildren,
                args: [ClrKeyFocusItem, { descendants: true }]
            }], focusChange: [{
                type: Output,
                args: ['clrFocusChange']
            }], focusableItems: [{
                type: Input,
                args: ['clrKeyFocus']
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], setClickedItemCurrent: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRovingTabindex extends ClrKeyFocus {
    constructor(elementRef, renderer) {
        super(elementRef);
        this.renderer = renderer;
        this.disabled = false;
    }
    // Proxy the input, as the selector name from parent class will still be "clrKeyFocus".
    get rovingIndexItems() {
        return this.focusableItems;
    }
    set rovingIndexItems(elements) {
        this.focusableItems = elements;
    }
    set rovingTabindexDisabled(disabled) {
        this.disabled = disabled;
        if (this.currentItem) {
            this.setTabindex(this.currentItem, disabled ? -1 : 0);
        }
    }
    handleKeyboardEvent(event) {
        if (this.prevKeyPressed(event) && this.currentFocusIsNotFirstItem()) {
            this.updateTabindex(this.current - 1);
        }
        else if (this.nextKeyPressed(event) && this.currentFocusIsNotLastItem()) {
            this.updateTabindex(this.current + 1);
        }
        else if (event.code === Keys.Home) {
            this.updateTabindex(0);
        }
        else if (event.code === Keys.End) {
            this.updateTabindex(this.focusableItems.length - 1);
        }
        super.handleKeyboardEvent(event);
    }
    setClickedItemCurrent(event) {
        let position;
        if (this.focusableItems[0].nativeElement) {
            position = this.focusableItems.map(item => item.nativeElement).indexOf(event.target);
        }
        else {
            position = this.focusableItems.indexOf(event.target);
        }
        if (position > -1) {
            this.updateTabindex(position);
        }
        super.setClickedItemCurrent(event);
    }
    initializeFocus() {
        if (this.focusableItems && this.focusableItems.length) {
            this.focusableItems.forEach(item => {
                this.setTabindex(item, -1);
            });
            // It is possible that the focus was on an element, whose index is no longer available.
            // This can happen when some of the focusable elements are being removed.
            // In such cases, the new focus is initialized on the last focusable element.
            if (this.current >= this.focusableItems.length) {
                this.current = this.focusableItems.length - 1;
            }
            if (!this.disabled && this.currentItem) {
                this.setTabindex(this.currentItem, 0);
            }
        }
        super.initializeFocus();
    }
    updateTabindex(newIndex) {
        this.setTabindex(this.currentItem, -1);
        this.setTabindex(this.focusableItems[newIndex], 0);
    }
    setTabindex(item, value) {
        if (item instanceof HTMLElement) {
            this.renderer.setAttribute(item, 'tabindex', value.toString());
        }
        else {
            this.renderer.setAttribute(item.nativeElement, 'tabindex', value.toString());
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRovingTabindex, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrRovingTabindex, isStandalone: false, selector: "[clrRovingTabindex]", inputs: { rovingIndexItems: ["clrRovingTabindex", "rovingIndexItems"], rovingTabindexDisabled: ["clrRovingTabindexDisabled", "rovingTabindexDisabled"] }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrRovingTabindex, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrRovingTabindex]',
                    template: '<ng-content></ng-content>',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { rovingIndexItems: [{
                type: Input,
                args: ['clrRovingTabindex']
            }], rovingTabindexDisabled: [{
                type: Input,
                args: ['clrRovingTabindexDisabled']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const KEY_FOCUS_DIRECTIVES = [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem];
class ClrKeyFocusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusModule, declarations: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem], imports: [CommonModule], exports: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrKeyFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [KEY_FOCUS_DIRECTIVES],
                    exports: [KEY_FOCUS_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class FocusableItem {
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockFocusableItem {
    constructor(id) {
        this.id = id;
        this.disabled = false;
    }
    focus() {
        // Do nothing
    }
    blur() {
        // Do nothing
    }
    activate() {
        // Do nothing
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let NB_INSTANCES = 0;
function uniqueIdFactory() {
    return 'clr-id-' + NB_INSTANCES++;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class BasicFocusableItem {
    constructor(el, renderer, platformId) {
        this.el = el;
        this.renderer = renderer;
        this.platformId = platformId;
        this.id = uniqueIdFactory();
        this.disabled = false;
        renderer.setAttribute(el.nativeElement, 'id', this.id);
        renderer.setAttribute(el.nativeElement, 'tabindex', '-1');
    }
    focus() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
            this.el.nativeElement.focus();
            this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    }
    blur() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
            this.el.nativeElement.blur();
        }
    }
    activate() {
        if (isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.click();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: BasicFocusableItem, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: BasicFocusableItem }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: BasicFocusableItem, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
const BASIC_FOCUSABLE_ITEM_PROVIDER = [
    {
        provide: FocusableItem,
        useClass: BasicFocusableItem,
    },
];

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function customFocusableItemProvider(implementation) {
    return [
        implementation,
        {
            provide: FocusableItem,
            useExisting: implementation,
        },
    ];
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class Linkers {
    /**
     * Links a set of focusable items to a parent along one direction
     */
    static linkParent(items, parent, direction) {
        items.forEach(item => (item[direction] = parent));
    }
    /**
     * Double-links a set of focusable items vertically, possibly looping
     */
    static linkVertical(items, loop = true) {
        items.forEach((item, index) => {
            if (index > 0) {
                item.up = items[index - 1];
            }
            if (index < items.length - 1) {
                item.down = items[index + 1];
            }
        });
        if (loop && items.length > 1) {
            items[0].up = items[items.length - 1];
            items[items.length - 1].down = items[0];
        }
    }
}
// Right now I only need the two linkers above, but we can easily add more linkers. A couple examples:
// export function linkHorizontal(items: FocusableItem[], loop = true);
// export function linkTable(items: FocusableItem[][]);

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function wrapObservable(observable, onSubscribe, onUnsubscribe) {
    return Observable.create((observer) => {
        onSubscribe(observer);
        const subscription = observable.subscribe(observer);
        return () => {
            subscription.unsubscribe();
            if (onUnsubscribe) {
                onUnsubscribe(observer);
            }
        };
    });
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ArrowKeyDirection;
(function (ArrowKeyDirection) {
    ArrowKeyDirection["UP"] = "up";
    ArrowKeyDirection["DOWN"] = "down";
    ArrowKeyDirection["LEFT"] = "left";
    ArrowKeyDirection["RIGHT"] = "right";
})(ArrowKeyDirection || (ArrowKeyDirection = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class FocusService {
    constructor(renderer) {
        this.renderer = renderer;
        this._unlistenFuncsMap = new Map();
    }
    get current() {
        return this._current;
    }
    reset(first) {
        this._current = first;
    }
    registerContainer(el) {
        // The following listeners return false when there was an action to take for the key pressed,
        // in order to prevent the default behavior of that key.
        const unlistenFuncs = [];
        unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowup', () => !this.move(ArrowKeyDirection.UP)));
        unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowdown', () => !this.move(ArrowKeyDirection.DOWN)));
        unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowleft', () => !this.move(ArrowKeyDirection.LEFT)));
        // arrow right can be used only for nested triggers.
        // unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowright', () => !this.move(ArrowKeyDirection.RIGHT)));
        unlistenFuncs.push(this.renderer.listen(el, 'keydown.space', () => !this.activateCurrent()));
        unlistenFuncs.push(this.renderer.listen(el, 'keydown.enter', () => !this.activateCurrent()));
        this._unlistenFuncsMap.set(el, unlistenFuncs);
    }
    moveTo(item) {
        /**
         * Make sure that item is not undefined,
         * This is safety net in the case that someone sometime decide to
         * call this method without having FocusableItem.
         */
        if (item === undefined) {
            return;
        }
        if (this.current) {
            this.current.blur();
        }
        item.focus();
        this._current = item;
    }
    move(direction) {
        let moved = false;
        if (this.current) {
            const next = this.current[direction];
            if (next) {
                // Turning the value into an Observable isn't great, but it's the fastest way to avoid code duplication.
                // If performance ever matters for this, we can refactor using additional private methods.
                const nextObs = isObservable(next) ? next : of(next);
                nextObs.subscribe(item => {
                    if (item) {
                        this.moveTo(item);
                        moved = true;
                    }
                });
            }
        }
        return moved;
    }
    activateCurrent() {
        if (this.current && this.current.activate) {
            this.current.activate();
            return true;
        }
        return false;
    }
    detachListeners(el) {
        const unlistenFuncs = this._unlistenFuncsMap.get(el);
        unlistenFuncs?.forEach(unlisten => unlisten());
        this._unlistenFuncsMap.delete(el);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FocusService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FocusService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }] });
function clrFocusServiceFactory(existing, renderer) {
    return existing || new FocusService(renderer);
}
const FOCUS_SERVICE_PROVIDER = {
    provide: FocusService,
    useFactory: clrFocusServiceFactory,
    deps: [[new Optional(), new SkipSelf(), FocusService], Renderer2],
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ScrollingService {
    constructor(_document) {
        this._document = _document;
    }
    stopScrolling() {
        this._document.body.classList.add('no-scrolling');
    }
    resumeScrolling() {
        if (this._document.body.classList.contains('no-scrolling')) {
            this._document.body.classList.remove('no-scrolling');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ScrollingService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ScrollingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ScrollingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
class CdkDragModule_CdkDrag extends CdkDrag {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef, dropContainer, document, ngZone, viewContainerRef, config, dir, dragDrop, changeDetectorRef) {
        super(elementRef, dropContainer, document, ngZone, viewContainerRef, config, dir, dragDrop, changeDetectorRef);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule_CdkDrag, deps: [{ token: i0.ElementRef }, { token: CDK_DROP_LIST, optional: true }, { token: DOCUMENT, optional: true }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: CDK_DRAG_CONFIG, optional: true }, { token: i1$1.Directionality }, { token: i2$1.DragDrop }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: CdkDragModule_CdkDrag, isStandalone: false, selector: "[cdkDrag]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule_CdkDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkDrag]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_DROP_LIST]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_DRAG_CONFIG]
                }] }, { type: i1$1.Directionality }, { type: i2$1.DragDrop }, { type: i0.ChangeDetectorRef }] });
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
class CdkDragModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule, declarations: [CdkDragModule_CdkDrag], exports: [CdkDragModule_CdkDrag] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkDragModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkDragModule_CdkDrag],
                    exports: [CdkDragModule_CdkDrag],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef, focusTrapFactory, document) {
        super(elementRef, focusTrapFactory, document);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: CdkTrapFocusModule_CdkTrapFocus, isStandalone: false, selector: "[cdkTrapFocus]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTrapFocus]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
class CdkTrapFocusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule, declarations: [CdkTrapFocusModule_CdkTrapFocus], exports: [CdkTrapFocusModule_CdkTrapFocus] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: CdkTrapFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkTrapFocusModule_CdkTrapFocus],
                    exports: [CdkTrapFocusModule_CdkTrapFocus],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * @description
 *
 * Developers should explicitly add this service to providers; it then can be injected
 * into a constructor and used as a notifier for the `takeUntil` operator. This eliminates
 * the need for boilerplates with subscriptions, and we don't need to implement the `OnDestroy`
 * interface and teardown subscriptions there.
 *
 * This can be used as follows:
 * ```ts
 * @Component({
 *   selector: 'clr-button-group',
 *   templateUrl: 'button-group.html',
 *   providers: [ClrDestroyService],
 * })
 * export class ClrButtonGroup {
 *   constructor(public buttonGroupNewService: ButtonInGroupService, private destroy$: ClrDestroyService) {}
 *
 *   ngAfterContentInit() {
 *     this.buttonGroupNewService.changes.pipe(takeUntil(this.destroy$)).subscribe(button => this.rearrangeButton(button));
 *   }
 * }
 * ```
 */
class ClrDestroyService extends Subject {
    ngOnDestroy() {
        this.next();
        this.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDestroyService, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDestroyService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDestroyService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A (clockwise) enumeration for positions around an element.
 *
 *     A    B    C
 *  L  ----------- D
 *     |         |
 *     |         |
 *  K  |         | E
 *     |         |
 *     |         |
 *  J  ----------- F
 *     I    H    G
 *
 * TOP_LEFT      = A
 * TOP_CENTER    = B
 * TOP_RIGHT     = C
 * RIGHT_TOP     = D
 * RIGHT_CENTER  = E
 * RIGHT_BOTTOM  = F
 * BOTTOM_RIGHT  = G
 * BOTTOM_CENTER = H
 * BOTTOM_LEFT   = I
 * LEFT_BOTTOM   = J
 * LEFT_CENTER   = K
 * LEFT_TOP      = L
 *
 *
 * Consumers tell us that they want something to display on the TOP_LEFT of the trigger and that they want the
 * _content_ container to anchor/orient AT the bottom left.
 * In order to calculate the position for the content I need to match up the anchor/toggle ClrPosition with the
 * content ClrPosition.
 *
 * Anchor TOP_LEFT **AT** Content BOTTOM_LEFT.
 *     -----------
 *     |         |
 *     |         |
 *     | content |
 *     |         |
 *     |         |
 *     -----------
 *     |/
 *     -----------
 *     |         |
 *     |         |
 *     | trigger |
 *     |         |
 *     |         |
 *     -----------
 *
 */
var ClrPosition;
(function (ClrPosition) {
    ClrPosition[ClrPosition["TOP_LEFT"] = 0] = "TOP_LEFT";
    ClrPosition[ClrPosition["TOP_CENTER"] = 1] = "TOP_CENTER";
    ClrPosition[ClrPosition["TOP_RIGHT"] = 2] = "TOP_RIGHT";
    ClrPosition[ClrPosition["RIGHT_TOP"] = 3] = "RIGHT_TOP";
    ClrPosition[ClrPosition["RIGHT_CENTER"] = 4] = "RIGHT_CENTER";
    ClrPosition[ClrPosition["RIGHT_BOTTOM"] = 5] = "RIGHT_BOTTOM";
    ClrPosition[ClrPosition["BOTTOM_RIGHT"] = 6] = "BOTTOM_RIGHT";
    ClrPosition[ClrPosition["BOTTOM_CENTER"] = 7] = "BOTTOM_CENTER";
    ClrPosition[ClrPosition["BOTTOM_LEFT"] = 8] = "BOTTOM_LEFT";
    ClrPosition[ClrPosition["LEFT_BOTTOM"] = 9] = "LEFT_BOTTOM";
    ClrPosition[ClrPosition["LEFT_CENTER"] = 10] = "LEFT_CENTER";
    ClrPosition[ClrPosition["LEFT_TOP"] = 11] = "LEFT_TOP";
})(ClrPosition || (ClrPosition = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * After a conversation with the Angular core team, it turns out we don't have much of a choice for our
 * declarative API, we need to fight against change detection and its one-way flow. This is
 * currently the least dirty solution to do what we want.
 *
 * Do not modify or even use this class unless you know exactly what you're doing.
 * It has the potential to trigger change detection loops or kill app performances.
 */
class WillyWonka {
    constructor() {
        this.disableChocolateCheck = false;
        this._chocolate = new Subject();
    }
    get chocolate() {
        return this._chocolate.asObservable();
    }
    ngAfterViewChecked() {
        if (!this.disableChocolateCheck) {
            this._chocolate.next();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WillyWonka, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: WillyWonka, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WillyWonka, decorators: [{
            type: Directive
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class OompaLoompa {
    // FIXME: Request Injector once we move to Angular 4.2+, it'll allow easier refactors
    constructor(cdr, willyWonka) {
        this.subscription = willyWonka.chocolate.subscribe(() => {
            if (this.latestFlavor !== this.flavor) {
                willyWonka.disableChocolateCheck = true;
                cdr.detectChanges();
                willyWonka.disableChocolateCheck = false;
            }
        });
    }
    ngAfterContentChecked() {
        this.latestFlavor = this.flavor;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: WillyWonka }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: OompaLoompa, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: OompaLoompa, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: WillyWonka }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ArrowKeyDirection, BASIC_FOCUSABLE_ITEM_PROVIDER, BaseExpandableAnimation, BasicFocusableItem, CLR_LOADING_DIRECTIVES, CONDITIONAL_DIRECTIVES, CdkDragModule, CdkDragModule_CdkDrag, CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus, ClrCommonStringsService, ClrConditionalModule, ClrDestroyService, ClrExpandableAnimation, ClrExpandableAnimationDirective, ClrExpandableAnimationModule, ClrFocusOnViewInit, ClrFocusOnViewInitModule, ClrHostWrappingModule, ClrIfActive, ClrIfExpanded, ClrKeyFocus, ClrKeyFocusItem, ClrKeyFocusModule, ClrLoading, ClrLoadingModule, ClrLoadingState, ClrOutsideClickModule, ClrPosition, ClrRovingTabindex, ClrStandaloneCdkTrapFocus, ClrTemplateRefModule, DATEPICKER_ENABLE_BREAKPOINT, DomAdapter, EXPANDABLE_ANIMATION_DIRECTIVES, EXTRA_LARGE_BREAKPOINT, EmptyAnchor, FOCUS_ON_VIEW_INIT, FOCUS_ON_VIEW_INIT_DIRECTIVES, FOCUS_SERVICE_PROVIDER, FocusService, FocusableItem, HostWrapper, IEKeys, IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, IfActiveService, IfExpandService, Keys, LARGE_BREAKPOINT, Linkers, LoadingListener, MEDIUM_BREAKPOINT, MOCK_DOM_ADAPTER_PROVIDER, MockDomAdapter, MockFocusableItem, OUSTIDE_CLICK_DIRECTIVES, OompaLoompa, OutsideClick, SMALL_BREAKPOINT, ScrollingService, TemplateRefContainer, WillyWonka, assertNever, clrFocusServiceFactory, collapse, commonStringsDefault, customFocusableItemProvider, defaultAnimationTiming, defaultExpandAnimation, fade, fadeSlide, isBooleanAttributeSet, isKeyEitherLetterOrNumber, normalizeKey, preventArrowKeyScroll, slide, tokenFactory, triggerAllFormControlValidation, uniqueIdFactory, wrapObservable };
//# sourceMappingURL=clr-angular-utils.mjs.map
