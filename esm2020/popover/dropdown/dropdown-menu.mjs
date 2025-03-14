/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, Inject, Input, Optional, SkipSelf, } from '@angular/core';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { AbstractPopover } from '../common/abstract-popover';
import { Point } from '../common/popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import * as i0 from "@angular/core";
import * as i1 from "./providers/dropdown-focus-handler.service";
export class ClrDropdownMenu extends AbstractPopover {
    constructor(injector, parentHost, nested, focusHandler) {
        if (!parentHost) {
            throw new Error('clr-dropdown-menu should only be used inside of a clr-dropdown');
        }
        super(injector, parentHost);
        if (!nested) {
            // Default positioning for normal dropdown is bottom-left
            this.anchorPoint = Point.BOTTOM_LEFT;
            this.popoverPoint = Point.LEFT_TOP;
        }
        else {
            // Default positioning for nested dropdown is right-top
            this.anchorPoint = Point.RIGHT_TOP;
            this.popoverPoint = Point.LEFT_TOP;
        }
        this.popoverOptions.allowMultipleOpen = true;
        this.popoverOptions.ignoreGlobalESCListener = true;
        this.closeOnOutsideClick = true;
        this.focusHandler = focusHandler;
    }
    set position(position) {
        // set the popover values based on menu position
        switch (position) {
            case 'top-right':
                this.anchorPoint = Point.TOP_RIGHT;
                this.popoverPoint = Point.RIGHT_BOTTOM;
                break;
            case 'top-left':
                this.anchorPoint = Point.TOP_LEFT;
                this.popoverPoint = Point.LEFT_BOTTOM;
                break;
            case 'bottom-right':
                this.anchorPoint = Point.BOTTOM_RIGHT;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            case 'bottom-left':
                this.anchorPoint = Point.BOTTOM_LEFT;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case 'right-top':
                this.anchorPoint = Point.RIGHT_TOP;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case 'right-bottom':
                this.anchorPoint = Point.RIGHT_BOTTOM;
                this.popoverPoint = Point.LEFT_BOTTOM;
                break;
            case 'left-top':
                this.anchorPoint = Point.LEFT_TOP;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            case 'left-bottom':
                this.anchorPoint = Point.LEFT_BOTTOM;
                this.popoverPoint = Point.RIGHT_BOTTOM;
                break;
            default:
                this.anchorPoint = Point.BOTTOM_LEFT;
                this.popoverPoint = Point.LEFT_TOP;
                break;
        }
    }
    ngAfterContentInit() {
        this.focusHandler.container = this.el.nativeElement;
        this.items.changes.subscribe(() => this.focusHandler.addChildren(this.items.toArray()));
        // I saw this on GitHub as a solution to avoid code duplication because of missed QueryList changes
        this.items.notifyOnChanges();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.focusHandler.resetChildren();
    }
}
ClrDropdownMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownMenu, deps: [{ token: i0.Injector }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: ClrDropdownMenu, optional: true, skipSelf: true }, { token: i1.DropdownFocusHandler }], target: i0.ɵɵFactoryTarget.Component });
ClrDropdownMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: { position: ["clrPosition", "position"] }, host: { properties: { "class.dropdown-menu": "true", "attr.role": "\"menu\"" } }, queries: [{ propertyName: "items", predicate: FocusableItem }], usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownMenu, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dropdown-menu',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.dropdown-menu]': 'true',
                        '[attr.role]': '"menu"',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: ClrDropdownMenu, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.DropdownFocusHandler }]; }, propDecorators: { items: [{
                type: ContentChildren,
                args: [FocusableItem]
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tbWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24tbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUVmLE1BQU0sRUFFTixLQUFLLEVBRUwsUUFBUSxFQUVSLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBVzFFLE1BQU0sT0FBTyxlQUFnQixTQUFRLGVBQWU7SUFLbEQsWUFDRSxRQUFrQixFQUdsQixVQUFtQyxFQUduQyxNQUF1QixFQUN2QixZQUFrQztRQUVsQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1NBQ25GO1FBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gseURBQXlEO1lBQ3pELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7U0FDcEM7YUFBTTtZQUNMLHVEQUF1RDtZQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQ3BDO1FBQ0QsSUFB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QUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLHVCQUF1QixFQUFFLE1BQU07d0JBQy9CLGFBQWEsRUFBRSxRQUFRO3FCQUN4QjtpQkFDRjs7MEJBUUksUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxtQkFBbUI7OzBCQUUxQixRQUFROzswQkFDUixRQUFROytFQVZxQixLQUFLO3NCQUFwQyxlQUFlO3VCQUFDLGFBQWE7Z0JBa0MxQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRm9jdXNhYmxlSXRlbSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzYWJsZS1pdGVtL2ZvY3VzYWJsZS1pdGVtJztcbmltcG9ydCB7IEFic3RyYWN0UG9wb3ZlciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1wb3BvdmVyJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi4vY29tbW9uL3BvcG92ZXInO1xuaW1wb3J0IHsgUE9QT1ZFUl9IT1NUX0FOQ0hPUiB9IGZyb20gJy4uL2NvbW1vbi9wb3BvdmVyLWhvc3QtYW5jaG9yLnRva2VuJztcbmltcG9ydCB7IERyb3Bkb3duRm9jdXNIYW5kbGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZHJvcGRvd24tZm9jdXMtaGFuZGxlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRyb3Bkb3duLW1lbnUnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wZG93bi1tZW51XSc6ICd0cnVlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnXCJtZW51XCInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEcm9wZG93bk1lbnUgZXh0ZW5kcyBBYnN0cmFjdFBvcG92ZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBAQ29udGVudENoaWxkcmVuKEZvY3VzYWJsZUl0ZW0pIGl0ZW1zOiBRdWVyeUxpc3Q8Rm9jdXNhYmxlSXRlbT47XG5cbiAgcHJpdmF0ZSBmb2N1c0hhbmRsZXI6IERyb3Bkb3duRm9jdXNIYW5kbGVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUE9QT1ZFUl9IT1NUX0FOQ0hPUilcbiAgICBwYXJlbnRIb3N0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBTa2lwU2VsZigpXG4gICAgbmVzdGVkOiBDbHJEcm9wZG93bk1lbnUsXG4gICAgZm9jdXNIYW5kbGVyOiBEcm9wZG93bkZvY3VzSGFuZGxlclxuICApIHtcbiAgICBpZiAoIXBhcmVudEhvc3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2xyLWRyb3Bkb3duLW1lbnUgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnNpZGUgb2YgYSBjbHItZHJvcGRvd24nKTtcbiAgICB9XG4gICAgc3VwZXIoaW5qZWN0b3IsIHBhcmVudEhvc3QpO1xuICAgIGlmICghbmVzdGVkKSB7XG4gICAgICAvLyBEZWZhdWx0IHBvc2l0aW9uaW5nIGZvciBub3JtYWwgZHJvcGRvd24gaXMgYm90dG9tLWxlZnRcbiAgICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBQb2ludC5CT1RUT01fTEVGVDtcbiAgICAgIHRoaXMucG9wb3ZlclBvaW50ID0gUG9pbnQuTEVGVF9UT1A7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgcG9zaXRpb25pbmcgZm9yIG5lc3RlZCBkcm9wZG93biBpcyByaWdodC10b3BcbiAgICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBQb2ludC5SSUdIVF9UT1A7XG4gICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LkxFRlRfVE9QO1xuICAgIH1cbiAgICB0aGlzLnBvcG92ZXJPcHRpb25zLmFsbG93TXVsdGlwbGVPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLnBvcG92ZXJPcHRpb25zLmlnbm9yZUdsb2JhbEVTQ0xpc3RlbmVyID0gdHJ1ZTtcbiAgICB0aGlzLmNsb3NlT25PdXRzaWRlQ2xpY2sgPSB0cnVlO1xuICAgIHRoaXMuZm9jdXNIYW5kbGVyID0gZm9jdXNIYW5kbGVyO1xuICB9XG5cbiAgQElucHV0KCdjbHJQb3NpdGlvbicpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogc3RyaW5nKSB7XG4gICAgLy8gc2V0IHRoZSBwb3BvdmVyIHZhbHVlcyBiYXNlZCBvbiBtZW51IHBvc2l0aW9uXG4gICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LlRPUF9SSUdIVDtcbiAgICAgICAgdGhpcy5wb3BvdmVyUG9pbnQgPSBQb2ludC5SSUdIVF9CT1RUT007XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndG9wLWxlZnQnOlxuICAgICAgICB0aGlzLmFuY2hvclBvaW50ID0gUG9pbnQuVE9QX0xFRlQ7XG4gICAgICAgIHRoaXMucG9wb3ZlclBvaW50ID0gUG9pbnQuTEVGVF9CT1RUT007XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm90dG9tLXJpZ2h0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LkJPVFRPTV9SSUdIVDtcbiAgICAgICAgdGhpcy5wb3BvdmVyUG9pbnQgPSBQb2ludC5SSUdIVF9UT1A7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYm90dG9tLWxlZnQnOlxuICAgICAgICB0aGlzLmFuY2hvclBvaW50ID0gUG9pbnQuQk9UVE9NX0xFRlQ7XG4gICAgICAgIHRoaXMucG9wb3ZlclBvaW50ID0gUG9pbnQuTEVGVF9UT1A7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQtdG9wJzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LlJJR0hUX1RPUDtcbiAgICAgICAgdGhpcy5wb3BvdmVyUG9pbnQgPSBQb2ludC5MRUZUX1RPUDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodC1ib3R0b20nOlxuICAgICAgICB0aGlzLmFuY2hvclBvaW50ID0gUG9pbnQuUklHSFRfQk9UVE9NO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LkxFRlRfQk9UVE9NO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xlZnQtdG9wJzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LkxFRlRfVE9QO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LlJJR0hUX1RPUDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsZWZ0LWJvdHRvbSc6XG4gICAgICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBQb2ludC5MRUZUX0JPVFRPTTtcbiAgICAgICAgdGhpcy5wb3BvdmVyUG9pbnQgPSBQb2ludC5SSUdIVF9CT1RUT007XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LkJPVFRPTV9MRUZUO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LkxFRlRfVE9QO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIuY29udGFpbmVyID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuaXRlbXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5mb2N1c0hhbmRsZXIuYWRkQ2hpbGRyZW4odGhpcy5pdGVtcy50b0FycmF5KCkpKTtcbiAgICAvLyBJIHNhdyB0aGlzIG9uIEdpdEh1YiBhcyBhIHNvbHV0aW9uIHRvIGF2b2lkIGNvZGUgZHVwbGljYXRpb24gYmVjYXVzZSBvZiBtaXNzZWQgUXVlcnlMaXN0IGNoYW5nZXNcbiAgICB0aGlzLml0ZW1zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLmZvY3VzSGFuZGxlci5yZXNldENoaWxkcmVuKCk7XG4gIH1cbn1cbiJdfQ==