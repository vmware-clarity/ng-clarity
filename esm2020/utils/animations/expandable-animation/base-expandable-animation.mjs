/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../dom-adapter/dom-adapter";
export class BaseExpandableAnimation {
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
}
BaseExpandableAnimation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: BaseExpandableAnimation, deps: [{ token: i0.ElementRef }, { token: i1.DomAdapter }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
BaseExpandableAnimation.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: BaseExpandableAnimation, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: BaseExpandableAnimation, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DomAdapter }, { type: i0.Renderer2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1leHBhbmRhYmxlLWFuaW1hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2FuaW1hdGlvbnMvZXhwYW5kYWJsZS1hbmltYXRpb24vYmFzZS1leHBhbmRhYmxlLWFuaW1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXlCLE1BQU0sZUFBZSxDQUFDOzs7QUFLakUsTUFBTSxPQUFPLHVCQUF1QjtJQUdsQyxZQUNZLE9BQWdDLEVBQ2hDLFVBQXNCLEVBQ3RCLFFBQW1CO1FBRm5CLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2hDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUwvQixnQkFBVyxHQUFHLENBQUMsQ0FBQztJQU1iLENBQUM7SUFFSixpQkFBaUI7UUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWxFLDJFQUEyRTtRQUMzRSxxSEFBcUg7UUFDckgsaUhBQWlIO1FBQ2pILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3RCxJQUFJLFNBQVMsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO2dCQUN0QyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyw0Q0FBNEM7YUFDakU7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O29IQW5DVSx1QkFBdUI7d0dBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQURuQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNlRXhwYW5kYWJsZUFuaW1hdGlvbiB7XG4gIHN0YXJ0SGVpZ2h0ID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIGRvbUFkYXB0ZXI6IERvbUFkYXB0ZXIsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7fVxuXG4gIHVwZGF0ZVN0YXJ0SGVpZ2h0KCkge1xuICAgIHRoaXMuc3RhcnRIZWlnaHQgPSB0aGlzLmRvbUFkYXB0ZXIuY29tcHV0ZWRIZWlnaHQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHx8IDA7XG4gIH1cblxuICBpbml0QW5pbWF0aW9uRWZmZWN0cygpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG4gIH1cblxuICBjbGVhbnVwQW5pbWF0aW9uRWZmZWN0cyhjYW5jZWxBbmltYXRpb25zID0gZmFsc2UpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnb3ZlcmZsb3cnKTtcblxuICAgIC8vIEEgXCJzYWZlXCIgYXV0by11cGRhdGUgb2YgdGhlIGhlaWdodCBlbnN1cmluZyBiYXNpYyBPT1RCIHVzZXIgZXhwZXJpZW5jZSAuXG4gICAgLy8gUHJvbmUgdG8gc21hbGwganVtcHMgaW4gaW5pdGlhbCBhbmltYXRpb24gaGVpZ2h0IGlmIGRhdGEgd2FzIGNoYW5nZWQgaW4gdGhlIG1lYW50aW1lLCB0aGUgd2luZG93IHdhcyByZXNpemVkLCBldGMuXG4gICAgLy8gRm9yIG9wdGltYWwgYmVoYXZpb3IgY2FsbCBtYW51YWxseSB1cGRhdGVTdGFydEhlaWdodCgpIGZyb20gdGhlIHBhcmVudCBjb21wb25lbnQgYmVmb3JlIGluaXRpYXRpbmcgdGhlIHVwZGF0ZS5cbiAgICB0aGlzLnVwZGF0ZVN0YXJ0SGVpZ2h0KCk7XG4gICAgaWYgKGNhbmNlbEFuaW1hdGlvbnMpIHtcbiAgICAgIHRoaXMuY2FuY2VsRWxlbWVudEFuaW1hdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNhbmNlbEVsZW1lbnRBbmltYXRpb25zKCkge1xuICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEFuaW1hdGlvbnMoKS5mb3JFYWNoKGFuaW1hdGlvbiA9PiB7XG4gICAgICBpZiAoYW5pbWF0aW9uLnBsYXlTdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICBhbmltYXRpb24uY2FuY2VsKCk7IC8vIGNsZWFycyBhbmltYXRpb24tc3R5bGUgc2V0IG9uIHRoZSBlbGVtZW50XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==