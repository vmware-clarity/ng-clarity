/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { defaultExpandAnimation } from '../constants';
import { BaseExpandableAnimation } from './base-expandable-animation';
import * as i0 from "@angular/core";
export class ClrExpandableAnimation extends BaseExpandableAnimation {
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
}
ClrExpandableAnimation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, deps: null, target: i0.ɵɵFactoryTarget.Component });
ClrExpandableAnimation.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrExpandableAnimation, selector: "clr-expandable-animation", inputs: { clrExpandTrigger: "clrExpandTrigger" }, host: { listeners: { "@expandAnimation.start": "animationStart($event)", "@expandAnimation.done": "animationDone($event)" }, properties: { "@expandAnimation": "this.expandAnimation" } }, providers: [DomAdapter], usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, decorators: [{
            type: Component,
            args: [{ selector: 'clr-expandable-animation', template: `<ng-content></ng-content>`, animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])], providers: [DomAdapter], styles: [":host{display:block}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1hbmltYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFrQixVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7QUFldEUsTUFBTSxPQUFPLHNCQUF1QixTQUFRLHVCQUF1QjtJQWJuRTs7UUFjVyxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7S0FtQm5DO0lBakJDLElBQ0ksZUFBZTtRQUNqQixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7SUFDckYsQ0FBQztJQUdELGNBQWMsQ0FBQyxLQUFxQjtRQUNsQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFxQjtRQUNqQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQzs7bUhBbkJVLHNCQUFzQjt1R0FBdEIsc0JBQXNCLGdTQUZ0QixDQUFDLFVBQVUsQ0FBQyxpREFUYiwyQkFBMkIsa0VBUXpCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzsyRkFHckcsc0JBQXNCO2tCQWJsQyxTQUFTOytCQUNFLDBCQUEwQixZQUMxQiwyQkFBMkIsY0FRekIsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQ3JHLENBQUMsVUFBVSxDQUFDOzhCQUdkLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFHRixlQUFlO3NCQURsQixXQUFXO3VCQUFDLGtCQUFrQjtnQkFNL0IsY0FBYztzQkFEYixZQUFZO3VCQUFDLHdCQUF3QixFQUFFLENBQUMsUUFBUSxDQUFDO2dCQU9sRCxhQUFhO3NCQURaLFlBQVk7dUJBQUMsdUJBQXVCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEFuaW1hdGlvbkV2ZW50LCB0cmFuc2l0aW9uLCB0cmlnZ2VyLCB1c2VBbmltYXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRG9tQWRhcHRlciB9IGZyb20gJy4uLy4uL2RvbS1hZGFwdGVyL2RvbS1hZGFwdGVyJztcbmltcG9ydCB7IGRlZmF1bHRFeHBhbmRBbmltYXRpb24gfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgQmFzZUV4cGFuZGFibGVBbmltYXRpb24gfSBmcm9tICcuL2Jhc2UtZXhwYW5kYWJsZS1hbmltYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZXhwYW5kYWJsZS1hbmltYXRpb24nLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdleHBhbmRBbmltYXRpb24nLCBbdHJhbnNpdGlvbigndHJ1ZSA8PT4gZmFsc2UnLCBbdXNlQW5pbWF0aW9uKGRlZmF1bHRFeHBhbmRBbmltYXRpb24pXSldKV0sXG4gIHByb3ZpZGVyczogW0RvbUFkYXB0ZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uIGV4dGVuZHMgQmFzZUV4cGFuZGFibGVBbmltYXRpb24ge1xuICBASW5wdXQoKSBjbHJFeHBhbmRUcmlnZ2VyID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdAZXhwYW5kQW5pbWF0aW9uJylcbiAgZ2V0IGV4cGFuZEFuaW1hdGlvbigpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdGhpcy5jbHJFeHBhbmRUcmlnZ2VyLCBwYXJhbXM6IHsgc3RhcnRIZWlnaHQ6IHRoaXMuc3RhcnRIZWlnaHQgfSB9O1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignQGV4cGFuZEFuaW1hdGlvbi5zdGFydCcsIFsnJGV2ZW50J10pXG4gIGFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgdGhpcy5pbml0QW5pbWF0aW9uRWZmZWN0cygpO1xuICAgIH1cbiAgfVxuICBASG9zdExpc3RlbmVyKCdAZXhwYW5kQW5pbWF0aW9uLmRvbmUnLCBbJyRldmVudCddKVxuICBhbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgdGhpcy5jbGVhbnVwQW5pbWF0aW9uRWZmZWN0cygpO1xuICAgIH1cbiAgfVxufVxuIl19