/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Input } from '@angular/core';
import { BASIC_FOCUSABLE_ITEM_PROVIDER } from '../../utils/focus/focusable-item/basic-focusable-item.service';
import * as i0 from "@angular/core";
import * as i1 from "./dropdown";
import * as i2 from "./providers/dropdown.service";
import * as i3 from "../../utils/focus/focusable-item/focusable-item";
export class ClrDropdownItem {
    constructor(dropdown, _dropdownService, focusableItem) {
        this.dropdown = dropdown;
        this._dropdownService = _dropdownService;
        this.focusableItem = focusableItem;
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
ClrDropdownItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownItem, deps: [{ token: i1.ClrDropdown }, { token: i2.RootDropdownService }, { token: i3.FocusableItem }], target: i0.ɵɵFactoryTarget.Directive });
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
        }], ctorParameters: function () { return [{ type: i1.ClrDropdown }, { type: i2.RootDropdownService }, { type: i3.FocusableItem }]; }, propDecorators: { disabled: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24taXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24taXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvRCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQzs7Ozs7QUFnQjlHLE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQ1UsUUFBcUIsRUFDckIsZ0JBQXFDLEVBQ3JDLGFBQTRCO1FBRjVCLGFBQVEsR0FBUixRQUFRLENBQWE7UUFDckIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFxQjtRQUNyQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNuQyxDQUFDO0lBRUosSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBdUI7UUFDbEMsa0hBQWtIO1FBQ2xILElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBQ0QsSUFBSSxjQUFjLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDaEMsQ0FBQztJQUdPLG1CQUFtQjtRQUN6QixnREFBZ0Q7UUFDaEQscUdBQXFHO1FBQ3JHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRTtZQUN0RixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUU3QyxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xDLDZFQUE2RTtZQUM3RSxnR0FBZ0c7WUFDaEcsWUFBWSxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7U0FDaEU7UUFFRCwrRkFBK0Y7UUFDL0YsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDcEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHTyxjQUFjLENBQUMsTUFBcUI7UUFDMUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFHTyxjQUFjLENBQUMsTUFBcUI7UUFDMUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTyxrQ0FBa0MsQ0FBQyxNQUFhO1FBQ3RELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7WUFDL0MsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRU8sZ0JBQWdCO1FBQ3RCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFakMsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQzFCLFlBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQzs7NEdBekVVLGVBQWU7Z0dBQWYsZUFBZSxtY0FGZixDQUFDLDZCQUE2QixDQUFDOzJGQUUvQixlQUFlO2tCQVgzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLElBQUksRUFBRTt3QkFDSixrQkFBa0IsRUFBRSxVQUFVO3dCQUM5Qix1QkFBdUIsRUFBRSxNQUFNO3dCQUMvQixhQUFhLEVBQUUsWUFBWTt3QkFDM0Isc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsV0FBVyxFQUFFLGdCQUFnQjtxQkFDOUI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7aUJBQzNDO2dLQVNLLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxhQUFhO2dCQWFoQixjQUFjO3NCQURqQixLQUFLO3VCQUFDLElBQUk7Z0JBU0gsbUJBQW1CO3NCQUQxQixZQUFZO3VCQUFDLE9BQU87Z0JBc0JiLGNBQWM7c0JBRHJCLFlBQVk7dUJBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQU1qQyxjQUFjO3NCQURyQixZQUFZO3VCQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEJBU0lDX0ZPQ1VTQUJMRV9JVEVNX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXNhYmxlLWl0ZW0vYmFzaWMtZm9jdXNhYmxlLWl0ZW0uc2VydmljZSc7XG5pbXBvcnQgeyBGb2N1c2FibGVJdGVtIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXNhYmxlLWl0ZW0vZm9jdXNhYmxlLWl0ZW0nO1xuaW1wb3J0IHsgQ2xyRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcbmltcG9ydCB7IFJvb3REcm9wZG93blNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kcm9wZG93bi5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsckRyb3Bkb3duSXRlbV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuZHJvcGRvd24taXRlbV0nOiAndHJ1ZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ1wibWVudWl0ZW1cIicsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuaWRdJzogJ2Ryb3Bkb3duSXRlbUlkJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbQkFTSUNfRk9DVVNBQkxFX0lURU1fUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEcm9wZG93bkl0ZW0ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGRyb3Bkb3duOiBDbHJEcm9wZG93bixcbiAgICBwcml2YXRlIF9kcm9wZG93blNlcnZpY2U6IFJvb3REcm9wZG93blNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmb2N1c2FibGVJdGVtOiBGb2N1c2FibGVJdGVtXG4gICkge31cblxuICBASW5wdXQoJ2NsckRpc2FibGVkJylcbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvY3VzYWJsZUl0ZW0uZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgLy8gRW1wdHkgc3RyaW5nIGF0dHJpYnV0ZSBldmFsdWF0ZXMgdG8gZmFsc2UgYnV0IHNob3VsZCBkaXNhYmxlIHRoZSBpdGVtLCBzbyB3ZSBuZWVkIHRvIGFkZCBhIHNwZWNpYWwgY2FzZSBmb3IgaXQuXG4gICAgdGhpcy5mb2N1c2FibGVJdGVtLmRpc2FibGVkID0gISF2YWx1ZSB8fCB2YWx1ZSA9PT0gJyc7XG4gIH1cblxuICAvKipcbiAgICogTGV0IHlvdSBvdmVyd3JpdGUgdGhlIGZvY3VzYWJsZSBhdXRvIGluY3JlbWVudCBpZC5cbiAgICovXG4gIEBJbnB1dCgnaWQnKVxuICBnZXQgZHJvcGRvd25JdGVtSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNhYmxlSXRlbS5pZDtcbiAgfVxuICBzZXQgZHJvcGRvd25JdGVtSWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuZm9jdXNhYmxlSXRlbS5pZCA9IHZhbHVlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBwcml2YXRlIG9uRHJvcGRvd25JdGVtQ2xpY2soKTogdm9pZCB7XG4gICAgLy8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSByb290IGRyb3Bkb3duIHRyaWdnZXIuXG4gICAgLy8gVGhpcyBpcyBkb25lIEJFRk9SRSB0aGUgZHJvcGRvd24gaXMgY2xvc2VkIHNvIHRoYXQgZm9jdXMgZ2V0cyBtb3ZlZCBwcm9wZXJseSBpZiBhIG1vZGFsIGlzIG9wZW5lZC5cbiAgICBpZiAodGhpcy5kcm9wZG93bi5pc01lbnVDbG9zYWJsZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLmRyb3Bkb3duLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgY29uc3Qgcm9vdERyb3Bkb3duID0gdGhpcy5maW5kUm9vdERyb3Bkb3duKCk7XG5cbiAgICAgIHJvb3REcm9wZG93bi5mb2N1c0hhbmRsZXIuZm9jdXMoKTtcbiAgICAgIC8vIFByZXZlbnQgbW92aW5nIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIgd2hlbiB0aGUgZHJvcGRvd24gbWVudSBpcyBjbG9zZWQuXG4gICAgICAvLyBXaXRob3V0IHRoaXMgbGluZSwgZm9jdXMgY291bGQgYmUgXCJzdG9sZW5cIiBmcm9tIGEgbW9kYWwgdGhhdCB3YXMgb3BlbmVkIGZyb20gYSBkcm9wZG93biBpdGVtLlxuICAgICAgcm9vdERyb3Bkb3duLmZvY3VzSGFuZGxlci5mb2N1c0JhY2tPblRyaWdnZXJXaGVuQ2xvc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIGRyb3Bkb3duIGlzIGNsb3NlZCBhZnRlciBjdXN0b20gZHJvcGRvd24gaXRlbSBjbGljayBldmVudCBoYW5kbGVycyBoYXZlIHJ1bi5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmRyb3Bkb3duLmlzTWVudUNsb3NhYmxlICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuX2Ryb3Bkb3duU2VydmljZS5jbG9zZU1lbnVzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duLnNwYWNlJywgWyckZXZlbnQnXSlcbiAgcHJpdmF0ZSBvblNwYWNlS2V5ZG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbklmRGlzYWJsZWQoJGV2ZW50KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24uZW50ZXInLCBbJyRldmVudCddKVxuICBwcml2YXRlIG9uRW50ZXJLZXlkb3duKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uSWZEaXNhYmxlZCgkZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25JZkRpc2FibGVkKCRldmVudDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgY2xpY2sgZXZlbnRcbiAgICAgICRldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRSb290RHJvcGRvd24oKSB7XG4gICAgbGV0IHJvb3REcm9wZG93biA9IHRoaXMuZHJvcGRvd247XG5cbiAgICB3aGlsZSAocm9vdERyb3Bkb3duLnBhcmVudCkge1xuICAgICAgcm9vdERyb3Bkb3duID0gcm9vdERyb3Bkb3duLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdERyb3Bkb3duO1xuICB9XG59XG4iXX0=