import { FormControl, FormGroup } from '@angular/forms';
import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Output, Input, Directive, NgModule, TemplateRef, ViewChild, ChangeDetectionStrategy, Component, ElementRef, inject, ANIMATION_MODULE_TYPE, InjectionToken, Optional, Inject, PLATFORM_ID, DOCUMENT, HostListener, ContentChildren, SkipSelf, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
export * from '@clr/angular/utils/loading';
export * from '@clr/angular/utils/conditional';
import { Subject, fromEvent, Observable, isObservable, of } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkDrag } from '@angular/cdk/drag-drop';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: DomAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: DomAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: DomAdapter, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: MockDomAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: MockDomAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: MockDomAdapter, decorators: [{
            type: Injectable
        }] });
const MOCK_DOM_ADAPTER_PROVIDER = {
    provide: DomAdapter,
    useClass: MockDomAdapter,
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: OutsideClick, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: OutsideClick, isStandalone: false, selector: "[clrOutsideClick]", inputs: { strict: ["clrStrict", "strict"] }, outputs: { outsideClick: "clrOutsideClick" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: OutsideClick, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const OUSTIDE_CLICK_DIRECTIVES = [OutsideClick];
class ClrOutsideClickModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrOutsideClickModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrOutsideClickModule, declarations: [OutsideClick], imports: [CommonModule], exports: [OutsideClick] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrOutsideClickModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrOutsideClickModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [OUSTIDE_CLICK_DIRECTIVES],
                    exports: [OUSTIDE_CLICK_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TemplateRefContainer {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: TemplateRefContainer, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: TemplateRefContainer, isStandalone: false, selector: "ng-component", viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: TemplateRefContainer, decorators: [{
            type: Component,
            args: [{
                    template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.Eager,
                }]
        }], propDecorators: { template: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTemplateRefModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrTemplateRefModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrTemplateRefModule, declarations: [TemplateRefContainer], imports: [CommonModule], exports: [TemplateRefContainer] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrTemplateRefModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrTemplateRefModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [TemplateRefContainer],
                    exports: [TemplateRefContainer],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class EmptyAnchor {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: EmptyAnchor, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: EmptyAnchor, isStandalone: false, selector: "ng-component", ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: EmptyAnchor, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.Eager,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Internal module, please do not export!
 */
class ClrHostWrappingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrHostWrappingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrHostWrappingModule, declarations: [EmptyAnchor], exports: [EmptyAnchor] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrHostWrappingModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrHostWrappingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [EmptyAnchor],
                    exports: [EmptyAnchor],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function assertNever(value) {
    throw new Error(`Unhandled value: ${value}`);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Equivalent of `style()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationStyle(styles) {
    return { type: 6, styles, offset: null };
}
/** Equivalent of `animate()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationAnimate(timings, styles = null) {
    return { type: 4, styles, timings };
}
/** Equivalent of `state()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationState(name, styles, options) {
    return { type: 0, name, styles, options };
}
/** Equivalent of `transition()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationTransition(expr, steps, options = null) {
    return { type: 1, expr, animation: steps, options };
}
/** Equivalent of `animation()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationReference(steps, options = null) {
    return { type: 8, animation: steps, options };
}
/** Equivalent of `trigger()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
function animationTrigger(name, definitions) {
    return { type: 7, name, definitions, options: {} };
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @deprecated Clarity no longer uses Angular animations; use the `--cds-global-animation-*` tokens instead. */
const defaultAnimationTiming = '0.2s ease-in-out';
/** @deprecated Clarity no longer uses Angular animations; see `ClrExpandableAnimation` and `clrExpandableAnimation`. */
const defaultExpandAnimation = animationReference([
    animationStyle({ height: '{{ startHeight }}px' }),
    animationAnimate(defaultAnimationTiming, animationStyle({ height: '*' })),
], {
    params: {
        startHeight: 0, // default
    },
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @deprecated Clarity no longer uses Angular animations; use `animateHeight()` instead. */
function collapse() {
    'use strict';
    return [
        animationState('true', animationStyle({ height: 0, 'overflow-y': 'hidden' })),
        animationTransition('true => false', [
            animationAnimate(defaultAnimationTiming, animationStyle({ height: '*', 'overflow-y': 'hidden' })),
        ]),
        animationTransition('false => true', [
            animationStyle({ height: '*', 'overflow-y': 'hidden' }),
            animationAnimate(defaultAnimationTiming),
        ]),
    ];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** `animate.enter` handler expanding the added element from 0 to its natural height. */
function expandHeight({ target }) {
    animateHeight(target, { from: 0 });
}
const runningAnimations = new WeakMap();
/**
 * Animates the height of the element from `from` pixels to `to` pixels, or to the height it has once the animation
 * it started before on the same element is canceled. The content is clipped (`clip` rather than `hidden`, which would
 * make the element a scroll container and loosen its `position: sticky` descendants), and stays rendered even when
 * the end state skips it (`content-visibility: hidden`). The animation leaves no style behind: once it is over, the element
 * shows the style of its end state.
 *
 * The duration and easing are the `--cds-global-animation-duration-quick` and `--cds-global-animation-easing-in-out`
 * tokens of the element, unless `easing` is given. It does not animate, and returns `null`, when the duration is 0
 * (low motion theme), when the user prefers reduced motion, or outside of a browser.
 */
function animateHeight(element, { from, to, easing }) {
    if (typeof element.animate !== 'function') {
        return null;
    }
    runningAnimations.get(element)?.cancel();
    runningAnimations.delete(element);
    to ??= measureHeight(element);
    if (from === to) {
        return null;
    }
    const timing = readAnimationTiming(element);
    if (!timing) {
        return null;
    }
    try {
        const animation = element.animate([
            { height: `${from}px`, overflow: 'clip', contentVisibility: 'visible' },
            { height: `${to}px`, overflow: 'clip', contentVisibility: 'visible' },
        ], { ...timing, ...(easing && { easing }) });
        runningAnimations.set(element, animation);
        return animation;
    }
    catch {
        // Invalid customized animation tokens: no animation.
        return null;
    }
}
/**
 * The height of the element as it is rendered, running animations included, with its fractional part. It is 0 outside
 * of a browser.
 */
function measureHeight(element) {
    if (typeof getComputedStyle !== 'function') {
        return 0;
    }
    const height = parseFloat(getComputedStyle(element).height);
    return Number.isFinite(height) ? height : 0;
}
function readAnimationTiming(element) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return null;
    }
    const style = getComputedStyle(element);
    const duration = parseDuration(style.getPropertyValue('--cds-global-animation-duration-quick'));
    const easing = style.getPropertyValue('--cds-global-animation-easing-in-out').trim() || 'ease-in-out';
    return duration > 0 ? { duration, easing } : null;
}
/** Parses a CSS time (`0.2s`, `200ms`) to milliseconds. */
function parseDuration(value) {
    const time = value.trim().toLowerCase();
    const amount = parseFloat(time);
    if (!Number.isFinite(amount)) {
        return 0;
    }
    return time.endsWith('ms') ? amount : amount * 1000;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Whether the application turned animations off with `provideNoopAnimations()` or `NoopAnimationsModule`. Angular's
 * `animate.enter` and `animate.leave` do not honour them, so Clarity components check it to skip their animations,
 * as they did with `@angular/animations`. To be called in an injection context.
 */
function noopAnimations() {
    return inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
        /**
         * Set when Angular adds the element (see the `animate.enter` host listener), so that nothing animates on the first
         * render. Angular calls `animate.enter` handlers only when animations are enabled, and the listener leaves it unset
         * with `provideNoopAnimations()` or `NoopAnimationsModule`.
         */
        this.animates = false;
        /** Whether the application turned animations off with `provideNoopAnimations()` or `NoopAnimationsModule`. */
        this.noopAnimations = noopAnimations();
    }
    updateStartHeight() {
        this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
    }
    initAnimationEffects() {
        // `clip` rather than `hidden`: both clip the content that grows past the animated height, but
        // `hidden` also turns this element into a scroll container, and a scroll container is what a
        // `position: sticky` descendant anchors itself to. Anything sticky inside would come loose for
        // the length of the animation - which is what the datagrid's static columns do. See CDE-3127.
        this.renderer.setStyle(this.element.nativeElement, 'overflow', 'clip');
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
    /**
     * Animates the height of the element from `startHeight` to its current height, then updates `startHeight`. Call it
     * once the change is rendered.
     */
    animateFromStartHeight() {
        const animation = this.animates ? animateHeight(this.element.nativeElement, { from: this.startHeight }) : null;
        (animation?.finished ?? Promise.resolve()).then(() => this.updateStartHeight(), () => {
            // Canceled by the next animation.
        });
    }
    cancelElementAnimations() {
        this.element.nativeElement.getAnimations().forEach(animation => {
            if (animation.playState === 'finished') {
                animation.cancel(); // clears animation-style set on the element
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: BaseExpandableAnimation, deps: [{ token: i0.ElementRef }, { token: DomAdapter }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: BaseExpandableAnimation, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: BaseExpandableAnimation, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: DomAdapter }, { type: i0.Renderer2 }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrExpandableAnimation extends BaseExpandableAnimation {
    constructor() {
        super(...arguments);
        /** Animates the height of the element, from `startHeight` to its new height, each time it changes. */
        this.clrExpandTrigger = false;
    }
    /** @deprecated No longer used: the height animates without Angular animations. To be removed in a future major version. */
    get expandAnimation() {
        return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
    }
    ngOnChanges(changes) {
        if (changes['clrExpandTrigger'] && !changes['clrExpandTrigger'].firstChange) {
            // Once the change is rendered.
            Promise.resolve().then(() => this.animateFromStartHeight());
        }
    }
    /** @deprecated No longer called. To be removed in a future major version. */
    animationStart(_event) {
        // Nothing to do.
    }
    /** @deprecated No longer called. To be removed in a future major version. */
    animationDone(_event) {
        // Nothing to do.
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimation, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: ClrExpandableAnimation, isStandalone: false, selector: "clr-expandable-animation", inputs: { clrExpandTrigger: "clrExpandTrigger" }, host: { listeners: { "animate.enter": "animates = !noopAnimations" } }, providers: [DomAdapter], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimation, decorators: [{
            type: Component,
            args: [{ selector: 'clr-expandable-animation', template: `<ng-content></ng-content>`, providers: [DomAdapter], host: { '(animate.enter)': 'animates = !noopAnimations' }, standalone: false, changeDetection: ChangeDetectionStrategy.Eager, styles: [":host{display:block}\n"] }]
        }], propDecorators: { clrExpandTrigger: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Never provided: stands for the `AnimationBuilder` the directive used to be injected with. */
const UNUSED_ANIMATION_BUILDER = new InjectionToken('UNUSED_ANIMATION_BUILDER');
class ClrExpandableAnimationDirective extends BaseExpandableAnimation {
    /**
     * @param _builder Deprecated and ignored: the height no longer animates with Angular animations. Kept so that
     * subclasses passing an `AnimationBuilder` still compile.
     */
    constructor(element, domAdapter, renderer, _builder) {
        super(element, domAdapter, renderer);
        /** Animates the height of the element, from `startHeight` to its new height, each time it changes. */
        this.expanded = false;
    }
    ngOnChanges(changes) {
        if (changes['expanded'] && !changes['expanded'].firstChange) {
            // Once the change is rendered.
            Promise.resolve().then(() => this.playAnimation());
        }
    }
    /** @deprecated Kept so that subclasses calling `super.ngOnDestroy()` still compile. */
    ngOnDestroy() {
        // Nothing to clean up.
    }
    playAnimation() {
        this.animateFromStartHeight();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationDirective, deps: [{ token: i0.ElementRef }, { token: DomAdapter }, { token: i0.Renderer2 }, { token: UNUSED_ANIMATION_BUILDER, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrExpandableAnimationDirective, isStandalone: false, selector: "[clrExpandableAnimation]", inputs: { expanded: ["clrExpandableAnimation", "expanded"] }, host: { listeners: { "animate.enter": "animates = !noopAnimations" }, properties: { "class.clr-expandable-animation": "true" } }, providers: [DomAdapter], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrExpandableAnimation]',
                    providers: [DomAdapter],
                    host: {
                        '[class.clr-expandable-animation]': 'true',
                        '(animate.enter)': 'animates = !noopAnimations',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: DomAdapter }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [UNUSED_ANIMATION_BUILDER]
                }] }], propDecorators: { expanded: [{
                type: Input,
                args: ['clrExpandableAnimation']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const EXPANDABLE_ANIMATION_DIRECTIVES = [ClrExpandableAnimation, ClrExpandableAnimationDirective];
class ClrExpandableAnimationModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationModule, declarations: [ClrExpandableAnimation, ClrExpandableAnimationDirective], imports: [CommonModule], exports: [ClrExpandableAnimation, ClrExpandableAnimationDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrExpandableAnimationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [EXPANDABLE_ANIMATION_DIRECTIVES],
                    exports: [EXPANDABLE_ANIMATION_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @deprecated Clarity no longer uses Angular animations; use the `clr-fade-enter` and `clr-fade-leave` classes instead. */
function fade(opacity = 1) {
    return [
        animationTransition('void => *', [
            animationStyle({ opacity: 0 }),
            animationAnimate(defaultAnimationTiming, animationStyle({ opacity: opacity })),
        ]),
        animationTransition('* => void', [animationAnimate(defaultAnimationTiming, animationStyle({ opacity: 0 }))]),
    ];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @deprecated Clarity no longer uses Angular animations; use the `clr-fade-slide-<direction>-enter` / `-leave` classes instead. */
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
        animationTransition('void => *', [
            animationStyle({ opacity: 0, transform: transform }),
            animationAnimate(defaultAnimationTiming),
        ]),
        animationTransition('* => void', [
            animationAnimate(defaultAnimationTiming, animationStyle({ opacity: 0, transform: transform })),
        ]),
    ];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @deprecated Clarity no longer uses Angular animations; use the `clr-slide-<direction>-enter` / `-leave` classes instead. */
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
        animationTransition('void => *', [
            animationStyle({ transform: transform }),
            animationAnimate(defaultAnimationTiming),
        ]),
        animationTransition('* => void', [
            animationAnimate(defaultAnimationTiming, animationStyle({ transform: transform })),
        ]),
    ];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    sortColumnAscending: 'Sort Ascending',
    sortColumnDescending: 'Sort Descending',
    clearColumnSort: 'Clear Sort',
    filterColumn: 'Filter Column',
    columnActions: 'Column actions',
    datagridColumnActionsAriaLabel: '{COLUMN} column actions',
    pinColumn: 'Pin Column',
    unpinColumn: 'Unpin Column',
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
    datagridFilterDialogAriaLabel: 'Filter',
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
    comboboxSelectAll: 'Select All',
    comboboxUnselectAll: 'Unselect All',
    comboboxShowAll: 'Show all {ITEMS} selected',
    comboboxAllSelected: 'All {ITEMS} selected',
    comboboxShowLess: 'Show less',
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
    // Card
    expandCardAriaLabel: 'Expand card',
    collapseCardAriaLabel: 'Collapse card',
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrCommonStringsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrCommonStringsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrCommonStringsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInit, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }, { token: FOCUS_ON_VIEW_INIT }, { token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrFocusOnViewInit, isStandalone: false, selector: "[clrFocusOnViewInit]", inputs: { isEnabled: ["clrFocusOnViewInit", "isEnabled"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInit, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const FOCUS_ON_VIEW_INIT_DIRECTIVES = [ClrFocusOnViewInit];
class ClrFocusOnViewInitModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInitModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInitModule, declarations: [ClrFocusOnViewInit], imports: [CommonModule], exports: [ClrFocusOnViewInit] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInitModule, providers: [FOCUS_ON_VIEW_INIT_PROVIDER], imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrFocusOnViewInitModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                    providers: [FOCUS_ON_VIEW_INIT_PROVIDER],
                    exports: [FOCUS_ON_VIEW_INIT_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
    /**
     * The base class resolves its dependencies with `inject()`, so it takes no constructor arguments
     * (`@angular/cdk` 22 declares it that way). The explicit constructor stays as a workaround for the
     * Angular "ɵɵinvalidFactoryDep" error in storybook: https://github.com/storybookjs/storybook/issues/23534
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrStandaloneCdkTrapFocus, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrStandaloneCdkTrapFocus, isStandalone: true, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrStandaloneCdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusItem, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrKeyFocusItem, isStandalone: false, selector: "[clrKeyFocusItem]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusItem, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function preventArrowKeyScroll(event) {
    const key = event.key;
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
        this.focusChange.emit(this._current);
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
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return event.key === Keys.ArrowDown;
            case ClrFocusDirection.HORIZONTAL:
                return event.key === Keys.ArrowRight;
            case ClrFocusDirection.BOTH:
                return event.key === Keys.ArrowDown || event.key === Keys.ArrowRight;
            default:
                return false;
        }
    }
    prevKeyPressed(event) {
        switch (this.direction) {
            case ClrFocusDirection.VERTICAL:
                return event.key === Keys.ArrowUp;
            case ClrFocusDirection.HORIZONTAL:
                return event.key === Keys.ArrowLeft;
            case ClrFocusDirection.BOTH:
                return event.key === Keys.ArrowUp || event.key === Keys.ArrowLeft;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocus, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: ClrKeyFocus, isStandalone: false, selector: "[clrKeyFocus]", inputs: { direction: ["clrDirection", "direction"], focusOnLoad: ["clrFocusOnLoad", "focusOnLoad"], focusableItems: ["clrKeyFocus", "focusableItems"] }, outputs: { focusChange: "clrFocusChange" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)", "click": "setClickedItemCurrent($event)" } }, queries: [{ propertyName: "clrKeyFocusItems", predicate: ClrKeyFocusItem, descendants: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocus, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrKeyFocus]',
                    template: '<ng-content></ng-content>',
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.Eager,
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrRovingTabindex, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: ClrRovingTabindex, isStandalone: false, selector: "[clrRovingTabindex]", inputs: { rovingIndexItems: ["clrRovingTabindex", "rovingIndexItems"], rovingTabindexDisabled: ["clrRovingTabindexDisabled", "rovingTabindexDisabled"] }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrRovingTabindex, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrRovingTabindex]',
                    template: '<ng-content></ng-content>',
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.Eager,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { rovingIndexItems: [{
                type: Input,
                args: ['clrRovingTabindex']
            }], rovingTabindexDisabled: [{
                type: Input,
                args: ['clrRovingTabindexDisabled']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const KEY_FOCUS_DIRECTIVES = [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem];
class ClrKeyFocusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusModule, declarations: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem], imports: [CommonModule], exports: [ClrKeyFocus, ClrRovingTabindex, ClrKeyFocusItem] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrKeyFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [KEY_FOCUS_DIRECTIVES],
                    exports: [KEY_FOCUS_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class FocusableItem {
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let NB_INSTANCES = 0;
function uniqueIdFactory() {
    return 'clr-id-' + NB_INSTANCES++;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: BasicFocusableItem, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: BasicFocusableItem }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: BasicFocusableItem, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
                // take(1) unsubscribes once this move has its item, rather than leaving the subscription open.
                // Left subscribed, every later emission would call moveTo() again with whatever is the first
                // item at that point and focus back to it.
                nextObs.pipe(take(1)).subscribe(item => {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: FocusService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: FocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: FocusService, decorators: [{
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ScrollingService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ScrollingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ScrollingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
class CdkDragModule_CdkDrag extends CdkDrag {
    /**
     * The base class resolves its dependencies with `inject()`, so it takes no constructor arguments
     * (`@angular/cdk` 22 declares it that way). The explicit constructor stays as a workaround for the
     * Angular "ɵɵinvalidFactoryDep" error in storybook: https://github.com/storybookjs/storybook/issues/23534
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule_CdkDrag, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: CdkDragModule_CdkDrag, isStandalone: false, selector: "[cdkDrag]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule_CdkDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkDrag]',
                    standalone: false,
                }]
        }], ctorParameters: () => [] });
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
class CdkDragModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule, declarations: [CdkDragModule_CdkDrag], exports: [CdkDragModule_CdkDrag] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkDragModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkDragModule_CdkDrag],
                    exports: [CdkDragModule_CdkDrag],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
    /**
     * The base class resolves its dependencies with `inject()`, so it takes no constructor arguments
     * (`@angular/cdk` 22 declares it that way). The explicit constructor stays as a workaround for the
     * Angular "ɵɵinvalidFactoryDep" error in storybook: https://github.com/storybookjs/storybook/issues/23534
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        super();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: CdkTrapFocusModule_CdkTrapFocus, isStandalone: false, selector: "[cdkTrapFocus]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTrapFocus]',
                    standalone: false,
                }]
        }], ctorParameters: () => [] });
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
class CdkTrapFocusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule, declarations: [CdkTrapFocusModule_CdkTrapFocus], exports: [CdkTrapFocusModule_CdkTrapFocus] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: CdkTrapFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkTrapFocusModule_CdkTrapFocus],
                    exports: [CdkTrapFocusModule_CdkTrapFocus],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrDestroyService, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrDestroyService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrDestroyService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
 * _content_ container to orient AT the bottom left.
 * In order to calculate the position for the content I need to match up the origin/trigger ClrPosition with the
 * content ClrPosition.
 *
 * Origin TOP_LEFT **AT** Content BOTTOM_LEFT.
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
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ArrowKeyDirection, BASIC_FOCUSABLE_ITEM_PROVIDER, BaseExpandableAnimation, BasicFocusableItem, CdkDragModule, CdkDragModule_CdkDrag, CdkTrapFocusModule, CdkTrapFocusModule_CdkTrapFocus, ClrCommonStringsService, ClrDestroyService, ClrExpandableAnimation, ClrExpandableAnimationDirective, ClrExpandableAnimationModule, ClrFocusOnViewInit, ClrFocusOnViewInitModule, ClrHostWrappingModule, ClrKeyFocus, ClrKeyFocusItem, ClrKeyFocusModule, ClrOutsideClickModule, ClrPosition, ClrRovingTabindex, ClrStandaloneCdkTrapFocus, ClrTemplateRefModule, DATEPICKER_ENABLE_BREAKPOINT, DomAdapter, EXPANDABLE_ANIMATION_DIRECTIVES, EXTRA_LARGE_BREAKPOINT, EmptyAnchor, FOCUS_ON_VIEW_INIT, FOCUS_ON_VIEW_INIT_DIRECTIVES, FOCUS_SERVICE_PROVIDER, FocusService, FocusableItem, HostWrapper, Keys, LARGE_BREAKPOINT, Linkers, MEDIUM_BREAKPOINT, MOCK_DOM_ADAPTER_PROVIDER, MockDomAdapter, MockFocusableItem, OUSTIDE_CLICK_DIRECTIVES, OutsideClick, SMALL_BREAKPOINT, ScrollingService, TemplateRefContainer, animateHeight, assertNever, clrFocusServiceFactory, collapse, commonStringsDefault, customFocusableItemProvider, defaultAnimationTiming, defaultExpandAnimation, expandHeight, fade, fadeSlide, isBooleanAttributeSet, isKeyEitherLetterOrNumber, measureHeight, noopAnimations, preventArrowKeyScroll, slide, triggerAllFormControlValidation, uniqueIdFactory, wrapObservable };
//# sourceMappingURL=clr-angular-utils.mjs.map
