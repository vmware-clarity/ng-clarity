/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Input } from '@angular/core';
import { BASIC_FOCUSABLE_ITEM_PROVIDER } from '../../utils/focus/focusable-item/basic-focusable-item.service';
import { wrapHostContentInsideSpan } from './utils/content-wrapping';
import * as i0 from "@angular/core";
import * as i1 from "./dropdown";
import * as i2 from "./providers/dropdown.service";
import * as i3 from "../../utils/focus/focusable-item/focusable-item";
export class ClrDropdownItem {
    constructor(dropdown, _dropdownService, focusableItem, el, renderer) {
        this.dropdown = dropdown;
        this._dropdownService = _dropdownService;
        this.focusableItem = focusableItem;
        this.el = el;
        this.renderer = renderer;
    }
    get disabled() {
        return this.focusableItem.disabled;
    }
    set disabled(value) {
        // Empty string attribute evaluates to false but should disable the item, so we need to add a special case for it.
        this.focusableItem.disabled = !!value || value === '';
    }
    /**
     * Let you overwrite the focusable auto increment id.
     */
    get dropdownItemId() {
        return this.focusableItem.id;
    }
    set dropdownItemId(value) {
        this.focusableItem.id = value;
    }
    ngAfterViewInit() {
        wrapHostContentInsideSpan(this.el.nativeElement, this.renderer, 'dropdown-item-content');
    }
    onDropdownItemClick() {
        // Move focus back to the root dropdown trigger.
        // This is done BEFORE the dropdown is closed so that focus gets moved properly if a modal is opened.
        if (this.dropdown.isMenuClosable && !this.disabled && this.dropdown.toggleService.open) {
            const rootDropdown = this.findRootDropdown();
            rootDropdown.focusHandler.focus();
            // Prevent moving focus back to the trigger when the dropdown menu is closed.
            // Without this line, focus could be "stolen" from a modal that was opened from a dropdown item.
            rootDropdown.focusHandler.focusBackOnTriggerWhenClosed = false;
        }
        // Ensure that the dropdown is closed after custom dropdown item click event handlers have run.
        setTimeout(() => {
            if (this.dropdown.isMenuClosable && !this.disabled) {
                this._dropdownService.closeMenus();
            }
        });
    }
    onSpaceKeydown($event) {
        this.stopImmediatePropagationIfDisabled($event);
    }
    onEnterKeydown($event) {
        this.stopImmediatePropagationIfDisabled($event);
    }
    stopImmediatePropagationIfDisabled($event) {
        if (this.disabled) {
            $event.preventDefault(); // prevent click event
            $event.stopImmediatePropagation();
        }
    }
    findRootDropdown() {
        let rootDropdown = this.dropdown;
        while (rootDropdown.parent) {
            rootDropdown = rootDropdown.parent;
        }
        return rootDropdown;
    }
}
ClrDropdownItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownItem, deps: [{ token: i1.ClrDropdown }, { token: i2.RootDropdownService }, { token: i3.FocusableItem }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
ClrDropdownItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDropdownItem, selector: "[clrDropdownItem]", inputs: { disabled: ["clrDisabled", "disabled"], dropdownItemId: ["id", "dropdownItemId"] }, host: { listeners: { "click": "onDropdownItemClick()", "keydown.space": "onSpaceKeydown($event)", "keydown.enter": "onEnterKeydown($event)" }, properties: { "class.disabled": "disabled", "class.dropdown-item": "true", "attr.role": "\"menuitem\"", "attr.aria-disabled": "disabled", "attr.id": "dropdownItemId" } }, providers: [BASIC_FOCUSABLE_ITEM_PROVIDER], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDropdownItem]',
                    host: {
                        '[class.disabled]': 'disabled',
                        '[class.dropdown-item]': 'true',
                        '[attr.role]': '"menuitem"',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.id]': 'dropdownItemId',
                    },
                    providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrDropdown }, { type: i2.RootDropdownService }, { type: i3.FocusableItem }, { type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { disabled: [{
                type: Input,
                args: ['clrDisabled']
            }], dropdownItemId: [{
                type: Input,
                args: ['id']
            }], onDropdownItemClick: [{
                type: HostListener,
                args: ['click']
            }], onSpaceKeydown: [{
                type: HostListener,
                args: ['keydown.space', ['$event']]
            }], onEnterKeydown: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24taXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24taXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUV0RixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUk5RyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFhckUsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFDVSxRQUFxQixFQUNyQixnQkFBcUMsRUFDckMsYUFBNEIsRUFDNUIsRUFBYyxFQUNkLFFBQW1CO1FBSm5CLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUMxQixDQUFDO0lBRUosSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBdUI7UUFDbEMsa0hBQWtIO1FBQ2xILElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBQ0QsSUFBSSxjQUFjLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDaEMsQ0FBQztJQUVELGVBQWU7UUFDYix5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUdPLG1CQUFtQjtRQUN6QixnREFBZ0Q7UUFDaEQscUdBQXFHO1FBQ3JHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRTtZQUN0RixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUU3QyxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xDLDZFQUE2RTtZQUM3RSxnR0FBZ0c7WUFDaEcsWUFBWSxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7U0FDaEU7UUFFRCwrRkFBK0Y7UUFDL0YsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDcEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHTyxjQUFjLENBQUMsTUFBcUI7UUFDMUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFHTyxjQUFjLENBQUMsTUFBcUI7UUFDMUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTyxrQ0FBa0MsQ0FBQyxNQUFhO1FBQ3RELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7WUFDL0MsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRU8sZ0JBQWdCO1FBQ3RCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFakMsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQzFCLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQzs7NEdBL0VVLGVBQWU7Z0dBQWYsZUFBZSxtY0FGZixDQUFDLDZCQUE2QixDQUFDOzJGQUUvQixlQUFlO2tCQVgzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLElBQUksRUFBRTt3QkFDSixrQkFBa0IsRUFBRSxVQUFVO3dCQUM5Qix1QkFBdUIsRUFBRSxNQUFNO3dCQUMvQixhQUFhLEVBQUUsWUFBWTt3QkFDM0Isc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsV0FBVyxFQUFFLGdCQUFnQjtxQkFDOUI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7aUJBQzNDO2lOQVdLLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxhQUFhO2dCQWFoQixjQUFjO3NCQURqQixLQUFLO3VCQUFDLElBQUk7Z0JBYUgsbUJBQW1CO3NCQUQxQixZQUFZO3VCQUFDLE9BQU87Z0JBc0JiLGNBQWM7c0JBRHJCLFlBQVk7dUJBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQU1qQyxjQUFjO3NCQURyQixZQUFZO3VCQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQkFTSUNfRk9DVVNBQkxFX0lURU1fUFJPVklERVIgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9mb2N1c2FibGUtaXRlbS9iYXNpYy1mb2N1c2FibGUtaXRlbS5zZXJ2aWNlJztcbmltcG9ydCB7IEZvY3VzYWJsZUl0ZW0gfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9mb2N1c2FibGUtaXRlbS9mb2N1c2FibGUtaXRlbSc7XG5pbXBvcnQgeyBDbHJEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuaW1wb3J0IHsgUm9vdERyb3Bkb3duU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2Ryb3Bkb3duLnNlcnZpY2UnO1xuaW1wb3J0IHsgd3JhcEhvc3RDb250ZW50SW5zaWRlU3BhbiB9IGZyb20gJy4vdXRpbHMvY29udGVudC13cmFwcGluZyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJEcm9wZG93bkl0ZW1dJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLmRyb3Bkb3duLWl0ZW1dJzogJ3RydWUnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdcIm1lbnVpdGVtXCInLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmlkXSc6ICdkcm9wZG93bkl0ZW1JZCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW0JBU0lDX0ZPQ1VTQUJMRV9JVEVNX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRHJvcGRvd25JdGVtIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkcm9wZG93bjogQ2xyRHJvcGRvd24sXG4gICAgcHJpdmF0ZSBfZHJvcGRvd25TZXJ2aWNlOiBSb290RHJvcGRvd25TZXJ2aWNlLFxuICAgIHByaXZhdGUgZm9jdXNhYmxlSXRlbTogRm9jdXNhYmxlSXRlbSxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHt9XG5cbiAgQElucHV0KCdjbHJEaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2FibGVJdGVtLmRpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIC8vIEVtcHR5IHN0cmluZyBhdHRyaWJ1dGUgZXZhbHVhdGVzIHRvIGZhbHNlIGJ1dCBzaG91bGQgZGlzYWJsZSB0aGUgaXRlbSwgc28gd2UgbmVlZCB0byBhZGQgYSBzcGVjaWFsIGNhc2UgZm9yIGl0LlxuICAgIHRoaXMuZm9jdXNhYmxlSXRlbS5kaXNhYmxlZCA9ICEhdmFsdWUgfHwgdmFsdWUgPT09ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIExldCB5b3Ugb3ZlcndyaXRlIHRoZSBmb2N1c2FibGUgYXV0byBpbmNyZW1lbnQgaWQuXG4gICAqL1xuICBASW5wdXQoJ2lkJylcbiAgZ2V0IGRyb3Bkb3duSXRlbUlkKCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzYWJsZUl0ZW0uaWQ7XG4gIH1cbiAgc2V0IGRyb3Bkb3duSXRlbUlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmZvY3VzYWJsZUl0ZW0uaWQgPSB2YWx1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB3cmFwSG9zdENvbnRlbnRJbnNpZGVTcGFuKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5yZW5kZXJlciwgJ2Ryb3Bkb3duLWl0ZW0tY29udGVudCcpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBwcml2YXRlIG9uRHJvcGRvd25JdGVtQ2xpY2soKTogdm9pZCB7XG4gICAgLy8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSByb290IGRyb3Bkb3duIHRyaWdnZXIuXG4gICAgLy8gVGhpcyBpcyBkb25lIEJFRk9SRSB0aGUgZHJvcGRvd24gaXMgY2xvc2VkIHNvIHRoYXQgZm9jdXMgZ2V0cyBtb3ZlZCBwcm9wZXJseSBpZiBhIG1vZGFsIGlzIG9wZW5lZC5cbiAgICBpZiAodGhpcy5kcm9wZG93bi5pc01lbnVDbG9zYWJsZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmRyb3Bkb3duLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgY29uc3Qgcm9vdERyb3Bkb3duID0gdGhpcy5maW5kUm9vdERyb3Bkb3duKCk7XG5cbiAgICAgIHJvb3REcm9wZG93bi5mb2N1c0hhbmRsZXIuZm9jdXMoKTtcbiAgICAgIC8vIFByZXZlbnQgbW92aW5nIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIgd2hlbiB0aGUgZHJvcGRvd24gbWVudSBpcyBjbG9zZWQuXG4gICAgICAvLyBXaXRob3V0IHRoaXMgbGluZSwgZm9jdXMgY291bGQgYmUgXCJzdG9sZW5cIiBmcm9tIGEgbW9kYWwgdGhhdCB3YXMgb3BlbmVkIGZyb20gYSBkcm9wZG93biBpdGVtLlxuICAgICAgcm9vdERyb3Bkb3duLmZvY3VzSGFuZGxlci5mb2N1c0JhY2tPblRyaWdnZXJXaGVuQ2xvc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZCBhZnRlciBjdXN0b20gZHJvcGRvd24gaXRlbSBjbGljayBldmVudCBoYW5kbGVycyBoYXZlIHJ1bi5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3Bkb3duLmlzTWVudUNsb3NhYmxlICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuX2Ryb3Bkb3duU2VydmljZS5jbG9zZU1lbnVzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnNwYWNlJywgWyckZXZlbnQnXSlcbiAgcHJpdmF0ZSBvblNwYWNlS2V5ZG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbklmRGlzYWJsZWQoJGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uZW50ZXInLCBbJyRldmVudCddKVxuICBwcml2YXRlIG9uRW50ZXJLZXlkb3duKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uSWZEaXNhYmxlZCgkZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25JZkRpc2FibGVkKCRldmVudDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgY2xpY2sgZXZlbnRcbiAgICAgICRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRSb290RHJvcGRvd24oKSB7XG4gICAgbGV0IHJvb3REcm9wZG93biA9IHRoaXMuZHJvcGRvd247XG5cbiAgICB3aGlsZSAocm9vdERyb3Bkb3duLnBhcmVudCkge1xuICAgICAgcm9vdERyb3Bkb3duID0gcm9vdERyb3Bkb3duLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdERyb3Bkb3duO1xuICB9XG59XG4iXX0=