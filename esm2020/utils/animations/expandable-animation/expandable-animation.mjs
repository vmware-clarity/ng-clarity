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
import * as i1 from "../../dom-adapter/dom-adapter";
export class ClrExpandableAnimation extends BaseExpandableAnimation {
    constructor(element, domAdapter, renderer) {
        super(element, domAdapter, renderer);
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
ClrExpandableAnimation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, deps: [{ token: i0.ElementRef }, { token: i1.DomAdapter }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
ClrExpandableAnimation.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrExpandableAnimation, selector: "clr-expandable-animation", inputs: { clrExpandTrigger: "clrExpandTrigger" }, host: { listeners: { "@expandAnimation.start": "animationStart($event)", "@expandAnimation.done": "animationDone($event)" }, properties: { "@expandAnimation": "this.expandAnimation" } }, providers: [DomAdapter], usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, decorators: [{
            type: Component,
            args: [{ selector: 'clr-expandable-animation', template: `<ng-content></ng-content>`, animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])], providers: [DomAdapter], styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DomAdapter }, { type: i0.Renderer2 }]; }, propDecorators: { clrExpandTrigger: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1hbmltYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFrQixVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQWMsV0FBVyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFbkcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzNELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBZXRFLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSx1QkFBdUI7SUFHakUsWUFBWSxPQUFnQyxFQUFFLFVBQXNCLEVBQUUsUUFBbUI7UUFDdkYsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIOUIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBSWxDLENBQUM7SUFFRCxJQUNJLGVBQWU7UUFDakIsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0lBQ3JGLENBQUM7SUFHRCxjQUFjLENBQUMsS0FBcUI7UUFDbEMsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUM5QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBcUI7UUFDakMsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUM5QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7O21IQXZCVSxzQkFBc0I7dUdBQXRCLHNCQUFzQixnU0FGdEIsQ0FBQyxVQUFVLENBQUMsaURBVGIsMkJBQTJCLGtFQVF6QixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7MkZBR3JHLHNCQUFzQjtrQkFibEMsU0FBUzsrQkFDRSwwQkFBMEIsWUFDMUIsMkJBQTJCLGNBUXpCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUNyRyxDQUFDLFVBQVUsQ0FBQztrSkFHZCxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBT0YsZUFBZTtzQkFEbEIsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBTS9CLGNBQWM7c0JBRGIsWUFBWTt1QkFBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFPbEQsYUFBYTtzQkFEWixZQUFZO3VCQUFDLHVCQUF1QixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBbmltYXRpb25FdmVudCwgdHJhbnNpdGlvbiwgdHJpZ2dlciwgdXNlQW5pbWF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRG9tQWRhcHRlciB9IGZyb20gJy4uLy4uL2RvbS1hZGFwdGVyL2RvbS1hZGFwdGVyJztcbmltcG9ydCB7IGRlZmF1bHRFeHBhbmRBbmltYXRpb24gfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgQmFzZUV4cGFuZGFibGVBbmltYXRpb24gfSBmcm9tICcuL2Jhc2UtZXhwYW5kYWJsZS1hbmltYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZXhwYW5kYWJsZS1hbmltYXRpb24nLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdleHBhbmRBbmltYXRpb24nLCBbdHJhbnNpdGlvbigndHJ1ZSA8PT4gZmFsc2UnLCBbdXNlQW5pbWF0aW9uKGRlZmF1bHRFeHBhbmRBbmltYXRpb24pXSldKV0sXG4gIHByb3ZpZGVyczogW0RvbUFkYXB0ZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uIGV4dGVuZHMgQmFzZUV4cGFuZGFibGVBbmltYXRpb24ge1xuICBASW5wdXQoKSBjbHJFeHBhbmRUcmlnZ2VyID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIGRvbUFkYXB0ZXI6IERvbUFkYXB0ZXIsIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICBzdXBlcihlbGVtZW50LCBkb21BZGFwdGVyLCByZW5kZXJlcik7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ0BleHBhbmRBbmltYXRpb24nKVxuICBnZXQgZXhwYW5kQW5pbWF0aW9uKCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB0aGlzLmNsckV4cGFuZFRyaWdnZXIsIHBhcmFtczogeyBzdGFydEhlaWdodDogdGhpcy5zdGFydEhlaWdodCB9IH07XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdAZXhwYW5kQW5pbWF0aW9uLnN0YXJ0JywgWyckZXZlbnQnXSlcbiAgYW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB7XG4gICAgICB0aGlzLmluaXRBbmltYXRpb25FZmZlY3RzKCk7XG4gICAgfVxuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ0BleHBhbmRBbmltYXRpb24uZG9uZScsIFsnJGV2ZW50J10pXG4gIGFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB7XG4gICAgICB0aGlzLmNsZWFudXBBbmltYXRpb25FZmZlY3RzKCk7XG4gICAgfVxuICB9XG59XG4iXX0=