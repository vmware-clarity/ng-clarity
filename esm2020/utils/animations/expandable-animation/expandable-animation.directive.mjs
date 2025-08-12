/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { useAnimation } from '@angular/animations';
import { Directive, Input } from '@angular/core';
import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { defaultExpandAnimation } from '../constants';
import { BaseExpandableAnimation } from './base-expandable-animation';
import * as i0 from "@angular/core";
import * as i1 from "../../dom-adapter/dom-adapter";
import * as i2 from "@angular/animations";
export class ClrExpandableAnimationDirective extends BaseExpandableAnimation {
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
}
ClrExpandableAnimationDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationDirective, deps: [{ token: i0.ElementRef }, { token: i1.DomAdapter }, { token: i0.Renderer2 }, { token: i2.AnimationBuilder }], target: i0.ɵɵFactoryTarget.Directive });
ClrExpandableAnimationDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrExpandableAnimationDirective, selector: "[clrExpandableAnimation]", inputs: { expanded: ["clrExpandableAnimation", "expanded"] }, host: { properties: { "class.clr-expandable-animation": "true" } }, providers: [DomAdapter], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrExpandableAnimation]',
                    providers: [DomAdapter],
                    host: {
                        '[class.clr-expandable-animation]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DomAdapter }, { type: i0.Renderer2 }, { type: i2.AnimationBuilder }]; }, propDecorators: { expanded: [{
                type: Input,
                args: ['clrExpandableAnimation']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1hbmltYXRpb24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvYW5pbWF0aW9ucy9leHBhbmRhYmxlLWFuaW1hdGlvbi9leHBhbmRhYmxlLWFuaW1hdGlvbi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQXFDLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFrRCxNQUFNLGVBQWUsQ0FBQztBQUU3RyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDM0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBU3RFLE1BQU0sT0FBTywrQkFBZ0MsU0FBUSx1QkFBdUI7SUFLMUUsWUFDRSxPQUFnQyxFQUNoQyxVQUFzQixFQUN0QixRQUFtQixFQUNYLE9BQXlCO1FBRWpDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRjdCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBUkYsYUFBUSxHQUFHLEtBQUssQ0FBQztJQVdsRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUMzRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN2QjtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU87YUFDdkIsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1RixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsQ0FBQzs7NEhBdENVLCtCQUErQjtnSEFBL0IsK0JBQStCLHFMQUwvQixDQUFDLFVBQVUsQ0FBQzsyRkFLWiwrQkFBK0I7a0JBUDNDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUN2QixJQUFJLEVBQUU7d0JBQ0osa0NBQWtDLEVBQUUsTUFBTTtxQkFDM0M7aUJBQ0Y7aUxBRWtDLFFBQVE7c0JBQXhDLEtBQUs7dUJBQUMsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBbmltYXRpb25CdWlsZGVyLCBBbmltYXRpb25QbGF5ZXIsIHVzZUFuaW1hdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgZGVmYXVsdEV4cGFuZEFuaW1hdGlvbiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBCYXNlRXhwYW5kYWJsZUFuaW1hdGlvbiB9IGZyb20gJy4vYmFzZS1leHBhbmRhYmxlLWFuaW1hdGlvbic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJFeHBhbmRhYmxlQW5pbWF0aW9uXScsXG4gIHByb3ZpZGVyczogW0RvbUFkYXB0ZXJdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItZXhwYW5kYWJsZS1hbmltYXRpb25dJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uRGlyZWN0aXZlIGV4dGVuZHMgQmFzZUV4cGFuZGFibGVBbmltYXRpb24gaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyRXhwYW5kYWJsZUFuaW1hdGlvbicpIGV4cGFuZGVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBwbGF5ZXI6IEFuaW1hdGlvblBsYXllcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBkb21BZGFwdGVyOiBEb21BZGFwdGVyLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBidWlsZGVyOiBBbmltYXRpb25CdWlsZGVyXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnQsIGRvbUFkYXB0ZXIsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1snZXhwYW5kZWQnXSAmJiAhY2hhbmdlc1snZXhwYW5kZWQnXS5maXJzdENoYW5nZSkge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLnBsYXlBbmltYXRpb24oKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5wbGF5ZXI/LmRlc3Ryb3koKTtcbiAgfVxuXG4gIHBsYXlBbmltYXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxheWVyKSB7XG4gICAgICB0aGlzLnBsYXllci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5ZXIgPSB0aGlzLmJ1aWxkZXJcbiAgICAgIC5idWlsZChbdXNlQW5pbWF0aW9uKGRlZmF1bHRFeHBhbmRBbmltYXRpb24sIHsgcGFyYW1zOiB7IHN0YXJ0SGVpZ2h0OiB0aGlzLnN0YXJ0SGVpZ2h0IH0gfSldKVxuICAgICAgLmNyZWF0ZSh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG5cbiAgICB0aGlzLnBsYXllci5vblN0YXJ0KCgpID0+IHRoaXMuaW5pdEFuaW1hdGlvbkVmZmVjdHMoKSk7XG5cbiAgICB0aGlzLnBsYXllci5vbkRvbmUoKCkgPT4gdGhpcy5jbGVhbnVwQW5pbWF0aW9uRWZmZWN0cyh0cnVlKSk7XG5cbiAgICB0aGlzLnBsYXllci5wbGF5KCk7XG4gIH1cbn1cbiJdfQ==