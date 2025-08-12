/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostListener, Inject, Input, Optional } from '@angular/core';
import { assertNever } from '../../utils/assert/assert.helpers';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { AbstractPopover } from '../common/abstract-popover';
import { Point } from '../common/popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import * as i0 from "@angular/core";
import * as i1 from "./providers/tooltip-id.service";
import * as i2 from "./providers/tooltip-mouse.service";
const POSITIONS = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'];
const SIZES = ['xs', 'sm', 'md', 'lg'];
const defaultPosition = 'right';
const defaultSize = 'sm';
export class ClrTooltipContent extends AbstractPopover {
    constructor(injector, parentHost, tooltipIdService, tooltipMouseService) {
        super(injector, parentHost);
        this.tooltipIdService = tooltipIdService;
        this.tooltipMouseService = tooltipMouseService;
        if (!parentHost) {
            throw new Error('clr-tooltip-content should only be used inside of a clr-tooltip');
        }
        // Set the default id in case consumer does not supply a custom id.
        this.id = uniqueIdFactory();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        const id = value || '';
        this._id = id;
        this.tooltipIdService.updateId(id);
    }
    get position() {
        return this._position;
    }
    set position(value) {
        const oldPosition = this._position;
        const newPosition = POSITIONS.includes(value) ? value : defaultPosition;
        this._position = newPosition;
        this.updateCssClass({ oldClass: `tooltip-${oldPosition}`, newClass: `tooltip-${newPosition}` });
        // set the popover values based on direction
        switch (newPosition) {
            case 'top-right':
                this.anchorPoint = Point.TOP_CENTER;
                this.popoverPoint = Point.LEFT_BOTTOM;
                break;
            case 'top-left':
                this.anchorPoint = Point.TOP_CENTER;
                this.popoverPoint = Point.RIGHT_BOTTOM;
                break;
            case 'bottom-right':
                this.anchorPoint = Point.BOTTOM_CENTER;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case 'bottom-left':
                this.anchorPoint = Point.BOTTOM_CENTER;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            case 'right':
                this.anchorPoint = Point.RIGHT_CENTER;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case 'left':
                this.anchorPoint = Point.LEFT_CENTER;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            default:
                assertNever(newPosition);
        }
    }
    get size() {
        return this._size;
    }
    set size(value) {
        const oldSize = this._size;
        const newSize = SIZES.includes(value) ? value : defaultSize;
        this._size = newSize;
        this.updateCssClass({ oldClass: `tooltip-${oldSize}`, newClass: `tooltip-${newSize}` });
    }
    ngOnInit() {
        this.size = this.size || defaultSize;
        this.position = this.position || defaultPosition;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterContent();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveContent();
    }
    updateCssClass({ oldClass, newClass }) {
        this.renderer.removeClass(this.el.nativeElement, oldClass);
        this.renderer.addClass(this.el.nativeElement, newClass);
    }
}
ClrTooltipContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltipContent, deps: [{ token: i0.Injector }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: i1.TooltipIdService }, { token: i2.TooltipMouseService }], target: i0.ɵɵFactoryTarget.Component });
ClrTooltipContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTooltipContent, selector: "clr-tooltip-content", inputs: { id: "id", position: ["clrPosition", "position"], size: ["clrSize", "size"] }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-content": "true", "style.opacity": "1", "attr.role": "\"tooltip\"", "id": "id" } }, usesInheritance: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltipContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip-content',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.tooltip-content]': 'true',
                        '[style.opacity]': '1',
                        '[attr.role]': '"tooltip"',
                        '[id]': 'id',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: i1.TooltipIdService }, { type: i2.TooltipMouseService }]; }, propDecorators: { id: [{
                type: Input
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }], size: [{
                type: Input,
                args: ['clrSize']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1jb250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci90b29sdGlwL3Rvb2x0aXAtY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sRUFBWSxLQUFLLEVBQVUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9HLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQUkxRSxNQUFNLFNBQVMsR0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFVLENBQUM7QUFHckcsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUV2QyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUM7QUFDaEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBWXpCLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxlQUFlO0lBS3BELFlBQ0UsUUFBa0IsRUFHbEIsVUFBbUMsRUFDM0IsZ0JBQWtDLEVBQ2xDLG1CQUF3QztRQUVoRCxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBSHBCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUlo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QUs7dUJBQUMsYUFBYTtnQkEyQ2hCLElBQUk7c0JBRFAsS0FBSzt1QkFBQyxTQUFTO2dCQWtCUixZQUFZO3NCQURuQixZQUFZO3VCQUFDLFlBQVk7Z0JBTWxCLFlBQVk7c0JBRG5CLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdCwgSW5qZWN0b3IsIElucHV0LCBPbkluaXQsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGFzc2VydE5ldmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvYXNzZXJ0L2Fzc2VydC5oZWxwZXJzJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBBYnN0cmFjdFBvcG92ZXIgfSBmcm9tICcuLi9jb21tb24vYWJzdHJhY3QtcG9wb3Zlcic7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4uL2NvbW1vbi9wb3BvdmVyJztcbmltcG9ydCB7IFBPUE9WRVJfSE9TVF9BTkNIT1IgfSBmcm9tICcuLi9jb21tb24vcG9wb3Zlci1ob3N0LWFuY2hvci50b2tlbic7XG5pbXBvcnQgeyBUb29sdGlwSWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdG9vbHRpcC1pZC5zZXJ2aWNlJztcbmltcG9ydCB7IFRvb2x0aXBNb3VzZVNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90b29sdGlwLW1vdXNlLnNlcnZpY2UnO1xuXG5jb25zdCBQT1NJVElPTlMgPSBbJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAncmlnaHQnLCAnbGVmdCddIGFzIGNvbnN0O1xudHlwZSBQb3NpdGlvbiA9IHR5cGVvZiBQT1NJVElPTlNbbnVtYmVyXTtcblxuY29uc3QgU0laRVMgPSBbJ3hzJywgJ3NtJywgJ21kJywgJ2xnJ107XG5cbmNvbnN0IGRlZmF1bHRQb3NpdGlvbiA9ICdyaWdodCc7XG5jb25zdCBkZWZhdWx0U2l6ZSA9ICdzbSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10b29sdGlwLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy50b29sdGlwLWNvbnRlbnRdJzogJ3RydWUnLFxuICAgICdbc3R5bGUub3BhY2l0eV0nOiAnMScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ1widG9vbHRpcFwiJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclRvb2x0aXBDb250ZW50IGV4dGVuZHMgQWJzdHJhY3RQb3BvdmVyIGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfcG9zaXRpb246IHN0cmluZztcbiAgcHJpdmF0ZSBfc2l6ZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUE9QT1ZFUl9IT1NUX0FOQ0hPUilcbiAgICBwYXJlbnRIb3N0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIHRvb2x0aXBJZFNlcnZpY2U6IFRvb2x0aXBJZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b29sdGlwTW91c2VTZXJ2aWNlOiBUb29sdGlwTW91c2VTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yLCBwYXJlbnRIb3N0KTtcblxuICAgIGlmICghcGFyZW50SG9zdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHItdG9vbHRpcC1jb250ZW50IHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGEgY2xyLXRvb2x0aXAnKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGRlZmF1bHQgaWQgaW4gY2FzZSBjb25zdW1lciBkb2VzIG5vdCBzdXBwbHkgYSBjdXN0b20gaWQuXG4gICAgdGhpcy5pZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuICB9XG5cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgaWQgPSB2YWx1ZSB8fCAnJztcblxuICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgdGhpcy50b29sdGlwSWRTZXJ2aWNlLnVwZGF0ZUlkKGlkKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyUG9zaXRpb24nKVxuICBnZXQgcG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG4gIHNldCBwb3NpdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgb2xkUG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbjtcbiAgICBjb25zdCBuZXdQb3NpdGlvbiA9IFBPU0lUSU9OUy5pbmNsdWRlcyh2YWx1ZSBhcyBhbnkpID8gKHZhbHVlIGFzIFBvc2l0aW9uKSA6IGRlZmF1bHRQb3NpdGlvbjtcblxuICAgIHRoaXMuX3Bvc2l0aW9uID0gbmV3UG9zaXRpb247XG4gICAgdGhpcy51cGRhdGVDc3NDbGFzcyh7IG9sZENsYXNzOiBgdG9vbHRpcC0ke29sZFBvc2l0aW9ufWAsIG5ld0NsYXNzOiBgdG9vbHRpcC0ke25ld1Bvc2l0aW9ufWAgfSk7XG5cbiAgICAvLyBzZXQgdGhlIHBvcG92ZXIgdmFsdWVzIGJhc2VkIG9uIGRpcmVjdGlvblxuICAgIHN3aXRjaCAobmV3UG9zaXRpb24pIHtcbiAgICAgIGNhc2UgJ3RvcC1yaWdodCc6XG4gICAgICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBQb2ludC5UT1BfQ0VOVEVSO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LkxFRlRfQk9UVE9NO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RvcC1sZWZ0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LlRPUF9DRU5URVI7XG4gICAgICAgIHRoaXMucG9wb3ZlclBvaW50ID0gUG9pbnQuUklHSFRfQk9UVE9NO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBQb2ludC5CT1RUT01fQ0VOVEVSO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LkxFRlRfVE9QO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbS1sZWZ0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LkJPVFRPTV9DRU5URVI7XG4gICAgICAgIHRoaXMucG9wb3ZlclBvaW50ID0gUG9pbnQuUklHSFRfVE9QO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LlJJR0hUX0NFTlRFUjtcbiAgICAgICAgdGhpcy5wb3BvdmVyUG9pbnQgPSBQb2ludC5MRUZUX1RPUDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgdGhpcy5hbmNob3JQb2ludCA9IFBvaW50LkxFRlRfQ0VOVEVSO1xuICAgICAgICB0aGlzLnBvcG92ZXJQb2ludCA9IFBvaW50LlJJR0hUX1RPUDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhc3NlcnROZXZlcihuZXdQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJTaXplJylcbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gIH1cbiAgc2V0IHNpemUodmFsdWU6IHN0cmluZykge1xuICAgIGNvbnN0IG9sZFNpemUgPSB0aGlzLl9zaXplO1xuICAgIGNvbnN0IG5ld1NpemUgPSBTSVpFUy5pbmNsdWRlcyh2YWx1ZSkgPyB2YWx1ZSA6IGRlZmF1bHRTaXplO1xuXG4gICAgdGhpcy5fc2l6ZSA9IG5ld1NpemU7XG4gICAgdGhpcy51cGRhdGVDc3NDbGFzcyh7IG9sZENsYXNzOiBgdG9vbHRpcC0ke29sZFNpemV9YCwgbmV3Q2xhc3M6IGB0b29sdGlwLSR7bmV3U2l6ZX1gIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zaXplID0gdGhpcy5zaXplIHx8IGRlZmF1bHRTaXplO1xuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uIHx8IGRlZmF1bHRQb3NpdGlvbjtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBwcml2YXRlIG9uTW91c2VFbnRlcigpIHtcbiAgICB0aGlzLnRvb2x0aXBNb3VzZVNlcnZpY2Uub25Nb3VzZUVudGVyQ29udGVudCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXG4gIHByaXZhdGUgb25Nb3VzZUxlYXZlKCkge1xuICAgIHRoaXMudG9vbHRpcE1vdXNlU2VydmljZS5vbk1vdXNlTGVhdmVDb250ZW50KCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNzc0NsYXNzKHsgb2xkQ2xhc3MsIG5ld0NsYXNzIH06IHsgb2xkQ2xhc3M6IHN0cmluZzsgbmV3Q2xhc3M6IHN0cmluZyB9KSB7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG9sZENsYXNzKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgbmV3Q2xhc3MpO1xuICB9XG59XG4iXX0=