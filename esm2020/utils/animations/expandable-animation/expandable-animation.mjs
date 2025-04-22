/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
import * as i0 from "@angular/core";
import * as i1 from "../../dom-adapter/dom-adapter";
export class ClrExpandableAnimation {
    constructor(element, domAdapter, renderer) {
        this.element = element;
        this.domAdapter = domAdapter;
        this.renderer = renderer;
        this.clrExpandTrigger = false;
        this.startHeight = 0;
    }
    get expandAnimation() {
        return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
    }
    animationStart(event) {
        if (event.fromState !== 'void') {
            this.renderer.setStyle(this.element.nativeElement, 'overflow', 'hidden');
        }
    }
    animationDone(event) {
        if (event.fromState !== 'void') {
            this.renderer.removeStyle(this.element.nativeElement, 'overflow');
            // A "safe" auto-update of the height ensuring basic OOTB user experience .
            // Prone to small jumps in initial animation height if data was changed in the meantime, window was resized, etc.
            // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
            this.updateStartHeight();
        }
    }
    updateStartHeight() {
        this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
    }
}
ClrExpandableAnimation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, deps: [{ token: i0.ElementRef }, { token: i1.DomAdapter }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
ClrExpandableAnimation.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrExpandableAnimation, selector: "clr-expandable-animation", inputs: { clrExpandTrigger: "clrExpandTrigger" }, host: { listeners: { "@expandAnimation.start": "animationStart($event)", "@expandAnimation.done": "animationDone($event)" }, properties: { "@expandAnimation": "this.expandAnimation" } }, providers: [DomAdapter], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{display:block}\n"], animations: [
        trigger('expandAnimation', [
            transition('true <=> false', [
                style({ height: '{{startHeight}}px' }),
                animate('0.2s ease-in-out', style({ height: '*' })),
            ]),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimation, decorators: [{
            type: Component,
            args: [{ selector: 'clr-expandable-animation', template: `<ng-content></ng-content>`, animations: [
                        trigger('expandAnimation', [
                            transition('true <=> false', [
                                style({ height: '{{startHeight}}px' }),
                                animate('0.2s ease-in-out', style({ height: '*' })),
                            ]),
                        ]),
                    ], providers: [DomAdapter], styles: [":host{display:block}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1hbmltYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBa0IsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBQUUsU0FBUyxFQUFjLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRW5HLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7O0FBc0IzRCxNQUFNLE9BQU8sc0JBQXNCO0lBS2pDLFlBQW9CLE9BQWdDLEVBQVUsVUFBc0IsRUFBVSxRQUFtQjtRQUE3RixZQUFPLEdBQVAsT0FBTyxDQUF5QjtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBSnhHLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUVsQyxnQkFBVyxHQUFHLENBQUMsQ0FBQztJQUVvRyxDQUFDO0lBRXJILElBQ0ksZUFBZTtRQUNqQixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7SUFDckYsQ0FBQztJQUdELGNBQWMsQ0FBQyxLQUFxQjtRQUNsQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMxRTtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBcUI7UUFDakMsSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUVsRSwyRUFBMkU7WUFDM0UsaUhBQWlIO1lBQ2pILGlIQUFpSDtZQUNqSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxpQkFBaUI7UUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JGLENBQUM7O21IQWhDVSxzQkFBc0I7dUdBQXRCLHNCQUFzQixnU0FGdEIsQ0FBQyxVQUFVLENBQUMsMEJBaEJiLDJCQUEyQixrRUFRekI7UUFDVixPQUFPLENBQUMsaUJBQWlCLEVBQUU7WUFDekIsVUFBVSxDQUFDLGdCQUFnQixFQUFFO2dCQUMzQixLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ3BELENBQUM7U0FDSCxDQUFDO0tBQ0g7MkZBR1Usc0JBQXNCO2tCQXBCbEMsU0FBUzsrQkFDRSwwQkFBMEIsWUFDMUIsMkJBQTJCLGNBUXpCO3dCQUNWLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTs0QkFDekIsVUFBVSxDQUFDLGdCQUFnQixFQUFFO2dDQUMzQixLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztnQ0FDdEMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDOzZCQUNwRCxDQUFDO3lCQUNILENBQUM7cUJBQ0gsYUFDVSxDQUFDLFVBQVUsQ0FBQztrSkFHZCxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBT0YsZUFBZTtzQkFEbEIsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBTS9CLGNBQWM7c0JBRGIsWUFBWTt1QkFBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFPbEQsYUFBYTtzQkFEWixZQUFZO3VCQUFDLHVCQUF1QixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBhbmltYXRlLCBBbmltYXRpb25FdmVudCwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZXhwYW5kYWJsZS1hbmltYXRpb24nLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdleHBhbmRBbmltYXRpb24nLCBbXG4gICAgICB0cmFuc2l0aW9uKCd0cnVlIDw9PiBmYWxzZScsIFtcbiAgICAgICAgc3R5bGUoeyBoZWlnaHQ6ICd7e3N0YXJ0SGVpZ2h0fX1weCcgfSksXG4gICAgICAgIGFuaW1hdGUoJzAuMnMgZWFzZS1pbi1vdXQnLCBzdHlsZSh7IGhlaWdodDogJyonIH0pKSxcbiAgICAgIF0pLFxuICAgIF0pLFxuICBdLFxuICBwcm92aWRlcnM6IFtEb21BZGFwdGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbiB7XG4gIEBJbnB1dCgpIGNsckV4cGFuZFRyaWdnZXIgPSBmYWxzZTtcblxuICBzdGFydEhlaWdodCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBkb21BZGFwdGVyOiBEb21BZGFwdGVyLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgQEhvc3RCaW5kaW5nKCdAZXhwYW5kQW5pbWF0aW9uJylcbiAgZ2V0IGV4cGFuZEFuaW1hdGlvbigpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdGhpcy5jbHJFeHBhbmRUcmlnZ2VyLCBwYXJhbXM6IHsgc3RhcnRIZWlnaHQ6IHRoaXMuc3RhcnRIZWlnaHQgfSB9O1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignQGV4cGFuZEFuaW1hdGlvbi5zdGFydCcsIFsnJGV2ZW50J10pXG4gIGFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgIH1cbiAgfVxuICBASG9zdExpc3RlbmVyKCdAZXhwYW5kQW5pbWF0aW9uLmRvbmUnLCBbJyRldmVudCddKVxuICBhbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ292ZXJmbG93Jyk7XG5cbiAgICAgIC8vIEEgXCJzYWZlXCIgYXV0by11cGRhdGUgb2YgdGhlIGhlaWdodCBlbnN1cmluZyBiYXNpYyBPT1RCIHVzZXIgZXhwZXJpZW5jZSAuXG4gICAgICAvLyBQcm9uZSB0byBzbWFsbCBqdW1wcyBpbiBpbml0aWFsIGFuaW1hdGlvbiBoZWlnaHQgaWYgZGF0YSB3YXMgY2hhbmdlZCBpbiB0aGUgbWVhbnRpbWUsIHdpbmRvdyB3YXMgcmVzaXplZCwgZXRjLlxuICAgICAgLy8gRm9yIG9wdGltYWwgYmVoYXZpb3IgY2FsbCBtYW51YWxseSB1cGRhdGVTdGFydEhlaWdodCgpIGZyb20gdGhlIHBhcmVudCBjb21wb25lbnQgYmVmb3JlIGluaXRpYXRpbmcgdGhlIHVwZGF0ZS5cbiAgICAgIHRoaXMudXBkYXRlU3RhcnRIZWlnaHQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTdGFydEhlaWdodCgpIHtcbiAgICB0aGlzLnN0YXJ0SGVpZ2h0ID0gdGhpcy5kb21BZGFwdGVyLmNvbXB1dGVkSGVpZ2h0KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KSB8fCAwO1xuICB9XG59XG4iXX0=