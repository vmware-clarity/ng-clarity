/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input } from '@angular/core';
import { Keys } from '../../../utils/enums/keys.enum';
import { ClrKeyFocus } from './key-focus';
import * as i0 from "@angular/core";
export class ClrRovingTabindex extends ClrKeyFocus {
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
}
ClrRovingTabindex.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRovingTabindex, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
ClrRovingTabindex.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrRovingTabindex, selector: "[clrRovingTabindex]", inputs: { rovingIndexItems: ["clrRovingTabindex", "rovingIndexItems"], rovingTabindexDisabled: ["clrRovingTabindexDisabled", "rovingTabindexDisabled"] }, usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRovingTabindex, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrRovingTabindex]',
                    template: '<ng-content></ng-content>',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { rovingIndexItems: [{
                type: Input,
                args: ['clrRovingTabindex']
            }], rovingTabindexDisabled: [{
                type: Input,
                args: ['clrRovingTabindexDisabled']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm92aW5nLXRhYmluZGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvZm9jdXMva2V5LWZvY3VzL3JvdmluZy10YWJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRXhFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUV0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQU0xQyxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUdoRCxZQUFZLFVBQW1DLEVBQVUsUUFBbUI7UUFDMUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRHFDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFGcEUsYUFBUSxHQUFHLEtBQUssQ0FBQztJQUl6QixDQUFDO0lBRUQsdUZBQXVGO0lBQ3ZGLElBQ0ksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxnQkFBZ0IsQ0FBQyxRQUF1QztRQUMxRCxJQUFJLENBQUMsY0FBYyxHQUFHLFFBQWdDLENBQUM7SUFDekQsQ0FBQztJQUVELElBQ0ksc0JBQXNCLENBQUMsUUFBaUI7UUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2RDtJQUNILENBQUM7SUFFUSxtQkFBbUIsQ0FBQyxLQUFvQjtRQUMvQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FB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QUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ2hFO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUM5RTtJQUNILENBQUM7OzhHQWxGVSxpQkFBaUI7a0dBQWpCLGlCQUFpQiw0T0FGbEIsMkJBQTJCOzJGQUUxQixpQkFBaUI7a0JBSjdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLDJCQUEyQjtpQkFDdEM7eUhBVUssZ0JBQWdCO3NCQURuQixLQUFLO3VCQUFDLG1CQUFtQjtnQkFTdEIsc0JBQXNCO3NCQUR6QixLQUFLO3VCQUFDLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi8uLi91dGlscy9lbnVtcy9rZXlzLmVudW0nO1xuaW1wb3J0IHsgRm9jdXNhYmxlSXRlbSB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDbHJLZXlGb2N1cyB9IGZyb20gJy4va2V5LWZvY3VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW2NsclJvdmluZ1RhYmluZGV4XScsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG59KVxuZXhwb3J0IGNsYXNzIENsclJvdmluZ1RhYmluZGV4IGV4dGVuZHMgQ2xyS2V5Rm9jdXMge1xuICBwcml2YXRlIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgLy8gUHJveHkgdGhlIGlucHV0LCBhcyB0aGUgc2VsZWN0b3IgbmFtZSBmcm9tIHBhcmVudCBjbGFzcyB3aWxsIHN0aWxsIGJlIFwiY2xyS2V5Rm9jdXNcIi5cbiAgQElucHV0KCdjbHJSb3ZpbmdUYWJpbmRleCcpXG4gIGdldCByb3ZpbmdJbmRleEl0ZW1zKCk6IEFycmF5PEZvY3VzYWJsZUl0ZW0+IHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2FibGVJdGVtcztcbiAgfVxuICBzZXQgcm92aW5nSW5kZXhJdGVtcyhlbGVtZW50czogQXJyYXk8Rm9jdXNhYmxlSXRlbT4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLmZvY3VzYWJsZUl0ZW1zID0gZWxlbWVudHMgYXMgQXJyYXk8Rm9jdXNhYmxlSXRlbT47XG4gIH1cblxuICBASW5wdXQoJ2NsclJvdmluZ1RhYmluZGV4RGlzYWJsZWQnKVxuICBzZXQgcm92aW5nVGFiaW5kZXhEaXNhYmxlZChkaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICBpZiAodGhpcy5jdXJyZW50SXRlbSkge1xuICAgICAgdGhpcy5zZXRUYWJpbmRleCh0aGlzLmN1cnJlbnRJdGVtLCBkaXNhYmxlZCA/IC0xIDogMCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnByZXZLZXlQcmVzc2VkKGV2ZW50KSAmJiB0aGlzLmN1cnJlbnRGb2N1c0lzTm90Rmlyc3RJdGVtKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlVGFiaW5kZXgodGhpcy5jdXJyZW50IC0gMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5leHRLZXlQcmVzc2VkKGV2ZW50KSAmJiB0aGlzLmN1cnJlbnRGb2N1c0lzTm90TGFzdEl0ZW0oKSkge1xuICAgICAgdGhpcy51cGRhdGVUYWJpbmRleCh0aGlzLmN1cnJlbnQgKyAxKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IEtleXMuSG9tZSkge1xuICAgICAgdGhpcy51cGRhdGVUYWJpbmRleCgwKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmNvZGUgPT09IEtleXMuRW5kKSB7XG4gICAgICB0aGlzLnVwZGF0ZVRhYmluZGV4KHRoaXMuZm9jdXNhYmxlSXRlbXMubGVuZ3RoIC0gMSk7XG4gICAgfVxuICAgIHN1cGVyLmhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgc2V0Q2xpY2tlZEl0ZW1DdXJyZW50KGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgcG9zaXRpb246IG51bWJlcjtcblxuICAgIGlmICh0aGlzLmZvY3VzYWJsZUl0ZW1zWzBdLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHBvc2l0aW9uID0gdGhpcy5mb2N1c2FibGVJdGVtcy5tYXAoaXRlbSA9PiBpdGVtLm5hdGl2ZUVsZW1lbnQpLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb24gPSB0aGlzLmZvY3VzYWJsZUl0ZW1zLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPiAtMSkge1xuICAgICAgdGhpcy51cGRhdGVUYWJpbmRleChwb3NpdGlvbik7XG4gICAgfVxuICAgIHN1cGVyLnNldENsaWNrZWRJdGVtQ3VycmVudChldmVudCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5pdGlhbGl6ZUZvY3VzKCkge1xuICAgIGlmICh0aGlzLmZvY3VzYWJsZUl0ZW1zICYmIHRoaXMuZm9jdXNhYmxlSXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZvY3VzYWJsZUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIHRoaXMuc2V0VGFiaW5kZXgoaXRlbSwgLTEpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGZvY3VzIHdhcyBvbiBhbiBlbGVtZW50LCB3aG9zZSBpbmRleCBpcyBubyBsb25nZXIgYXZhaWxhYmxlLlxuICAgICAgLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gc29tZSBvZiB0aGUgZm9jdXNhYmxlIGVsZW1lbnRzIGFyZSBiZWluZyByZW1vdmVkLlxuICAgICAgLy8gSW4gc3VjaCBjYXNlcywgdGhlIG5ldyBmb2N1cyBpcyBpbml0aWFsaXplZCBvbiB0aGUgbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnQgPj0gdGhpcy5mb2N1c2FibGVJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5mb2N1c2FibGVJdGVtcy5sZW5ndGggLSAxO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuY3VycmVudEl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRUYWJpbmRleCh0aGlzLmN1cnJlbnRJdGVtLCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIuaW5pdGlhbGl6ZUZvY3VzKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRhYmluZGV4KG5ld0luZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFRhYmluZGV4KHRoaXMuY3VycmVudEl0ZW0sIC0xKTtcbiAgICB0aGlzLnNldFRhYmluZGV4KHRoaXMuZm9jdXNhYmxlSXRlbXNbbmV3SW5kZXhdLCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VGFiaW5kZXgoaXRlbTogRm9jdXNhYmxlSXRlbSwgdmFsdWU6IG51bWJlcikge1xuICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGl0ZW0sICd0YWJpbmRleCcsIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShpdGVtLm5hdGl2ZUVsZW1lbnQsICd0YWJpbmRleCcsIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxufVxuIl19