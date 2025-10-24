/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { take } from 'rxjs/operators';
import { Keys } from '../../../utils/enums/keys.enum';
import { ArrowKeyDirection } from '../../../utils/focus/arrow-key-direction.enum';
import { customFocusableItemProvider } from '../../../utils/focus/focusable-item/custom-focusable-item-provider';
import { normalizeKey } from '../../../utils/focus/key-focus/util';
import { PseudoFocusModel } from '../model/pseudo-focus.model';
import * as i0 from "@angular/core";
import * as i1 from "../../../utils/popover/providers/popover-toggle.service";
import * as i2 from "./option-selection.service";
export class ComboboxFocusHandler {
    constructor(rendererFactory, toggleService, selectionService, platformId) {
        this.toggleService = toggleService;
        this.selectionService = selectionService;
        this.platformId = platformId;
        this.pseudoFocus = new PseudoFocusModel();
        this.optionData = [];
        this.handleFocusSubscription();
        // Direct renderer injection can be problematic and leads to failing tests at least
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    get trigger() {
        return this._trigger;
    }
    set trigger(el) {
        this._trigger = el;
        this.addFocusOnBlurListener(el);
    }
    get listbox() {
        return this._listbox;
    }
    set listbox(el) {
        this._listbox = el;
        this.addFocusOnBlurListener(el);
    }
    get textInput() {
        return this._textInput;
    }
    set textInput(el) {
        this._textInput = el;
        this.renderer.listen(el, 'keydown', event => !this.handleTextInput(event));
        this.addFocusOnBlurListener(el);
    }
    focusInput() {
        if (this.textInput && isPlatformBrowser(this.platformId)) {
            this.textInput.focus();
        }
    }
    focusFirstActive() {
        if (this.optionData.length > 0) {
            if (this.selectionService.selectionModel.isEmpty()) {
                this.pseudoFocus.select(this.optionData[0]);
            }
            else {
                let firstActive;
                if (this.selectionService.multiselectable) {
                    firstActive = this.selectionService.selectionModel.model[0];
                }
                else {
                    firstActive = this.selectionService.selectionModel.model;
                }
                const activeProxy = this.optionData.find(option => option.value === firstActive);
                if (activeProxy) {
                    // active element is visible
                    this.pseudoFocus.select(activeProxy);
                }
                else {
                    // we have active element, but it's filtered out
                    this.pseudoFocus.select(this.optionData[0]);
                }
                this.scrollIntoSelectedModel('auto');
            }
        }
    }
    addOptionValues(options) {
        this.optionData = options;
    }
    handleFocusSubscription() {
        this.toggleService.openChange.subscribe(open => {
            if (!open) {
                this.pseudoFocus.model = null;
            }
        });
    }
    moveFocusTo(direction) {
        let index = this.optionData.findIndex(option => option.equals(this.pseudoFocus.model));
        if (direction === ArrowKeyDirection.UP) {
            if (index === -1 || index === 0) {
                index = this.optionData.length - 1;
            }
            else {
                index--;
            }
        }
        else if (direction === ArrowKeyDirection.DOWN) {
            if (index === -1 || index === this.optionData.length - 1) {
                index = 0;
            }
            else {
                index++;
            }
        }
        this.pseudoFocus.select(this.optionData[index]);
        this.scrollIntoSelectedModel();
    }
    openAndMoveTo(direction) {
        if (!this.toggleService.open) {
            this.toggleService.openChange.pipe(take(1)).subscribe(open => {
                if (open) {
                    this.moveFocusTo(direction);
                }
            });
            this.toggleService.open = true;
        }
        else {
            this.moveFocusTo(direction);
        }
    }
    // this service is only interested in keys that may move the focus
    handleTextInput(event) {
        let preventDefault = false;
        const key = normalizeKey(event.key);
        if (event) {
            switch (key) {
                case Keys.Enter:
                    if (this.toggleService.open && this.pseudoFocus.model) {
                        if (this.selectionService.multiselectable) {
                            this.selectionService.toggle(this.pseudoFocus.model.value);
                        }
                        else {
                            this.selectionService.select(this.pseudoFocus.model.value);
                        }
                        preventDefault = true;
                    }
                    break;
                case Keys.Space:
                    if (!this.toggleService.open) {
                        this.toggleService.open = true;
                        preventDefault = true;
                    }
                    break;
                case Keys.ArrowUp:
                    this.preventViewportScrolling(event);
                    this.openAndMoveTo(ArrowKeyDirection.UP);
                    preventDefault = true;
                    break;
                case Keys.ArrowDown:
                    this.preventViewportScrolling(event);
                    this.openAndMoveTo(ArrowKeyDirection.DOWN);
                    preventDefault = true;
                    break;
                default:
                    // Any other keypress
                    if (event.key !== Keys.Tab &&
                        !(this.selectionService.multiselectable && event.key === Keys.Backspace) &&
                        !(event.key === Keys.Escape) &&
                        !this.toggleService.open) {
                        this.toggleService.open = true;
                    }
                    break;
            }
        }
        return preventDefault;
    }
    scrollIntoSelectedModel(behavior = 'smooth') {
        if (this.pseudoFocus.model && this.pseudoFocus.model.el) {
            this.pseudoFocus.model.el.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
        }
    }
    preventViewportScrolling(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    addFocusOnBlurListener(el) {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.listen(el, 'blur', event => {
                if (this.focusOutOfComponent(event)) {
                    this.toggleService.open = false;
                    // Workaround for popover close-on-outside-click timing issues in Edge browser
                    if (this.componentCdRef) {
                        this.componentCdRef.detectChanges();
                    }
                }
            });
        }
    }
    focusOutOfComponent(event) {
        // event.relatedTarget is null in IE11. In that case we use document.activeElement
        // which points to the element that becomes active as the blur event occurs on the input.
        const target = (event.relatedTarget || document.activeElement);
        return !(this.textInput.contains(target) || this.trigger.contains(target) || this.listbox.contains(target));
    }
}
ComboboxFocusHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ComboboxFocusHandler, deps: [{ token: i0.RendererFactory2 }, { token: i1.ClrPopoverToggleService }, { token: i2.OptionSelectionService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ComboboxFocusHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ComboboxFocusHandler });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ComboboxFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.RendererFactory2 }, { type: i1.ClrPopoverToggleService }, { type: i2.OptionSelectionService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
export const COMBOBOX_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(ComboboxFocusHandler);
export class OptionData {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }
    equals(other) {
        if (!other) {
            return false;
        }
        return this.id === other.id && this.value === other.value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3gtZm9jdXMtaGFuZGxlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvcHJvdmlkZXJzL2NvbWJvYm94LWZvY3VzLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBcUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ2hILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDbEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDakgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRW5FLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBSS9ELE1BQU0sT0FBTyxvQkFBb0I7SUFZL0IsWUFDRSxlQUFpQyxFQUN6QixhQUFzQyxFQUN0QyxnQkFBMkMsRUFDdEIsVUFBZTtRQUZwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDdEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEyQjtRQUN0QixlQUFVLEdBQVYsVUFBVSxDQUFLO1FBWjlDLGdCQUFXLEdBQW9DLElBQUksZ0JBQWdCLEVBQWlCLENBQUM7UUFNN0UsZUFBVSxHQUFvQixFQUFFLENBQUM7UUFRdkMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsbUZBQW1GO1FBQ25GLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFB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QyxNQUFNLCtCQUErQixHQUFHLDJCQUEyQixDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFFakcsTUFBTSxPQUFPLFVBQVU7SUFHckIsWUFBbUIsRUFBVSxFQUFTLEtBQVE7UUFBM0IsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQUc7SUFBRyxDQUFDO0lBRWxELE1BQU0sQ0FBQyxLQUFvQjtRQUN6QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM1RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lELCBSZW5kZXJlcjIsIFJlbmRlcmVyRmFjdG9yeTIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEtleXMgfSBmcm9tICcuLi8uLi8uLi91dGlscy9lbnVtcy9rZXlzLmVudW0nO1xuaW1wb3J0IHsgQXJyb3dLZXlEaXJlY3Rpb24gfSBmcm9tICcuLi8uLi8uLi91dGlscy9mb2N1cy9hcnJvdy1rZXktZGlyZWN0aW9uLmVudW0nO1xuaW1wb3J0IHsgY3VzdG9tRm9jdXNhYmxlSXRlbVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXNhYmxlLWl0ZW0vY3VzdG9tLWZvY3VzYWJsZS1pdGVtLXByb3ZpZGVyJztcbmltcG9ydCB7IG5vcm1hbGl6ZUtleSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBQc2V1ZG9Gb2N1c01vZGVsIH0gZnJvbSAnLi4vbW9kZWwvcHNldWRvLWZvY3VzLm1vZGVsJztcbmltcG9ydCB7IE9wdGlvblNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL29wdGlvbi1zZWxlY3Rpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21ib2JveEZvY3VzSGFuZGxlcjxUPiB7XG4gIC8vIFdlIG5lZWQgYSBDaGFuZ2UgRGV0ZWN0b3IgZnJvbSB0aGUgcmVsYXRlZCBjb21wb25lbnQsIHNvIHdlIGNhbiB1cGRhdGUgaXQgb24gQmx1clxuICAvLyAod2hpY2ggaXMgbmVlZGVkIGJlY2F1c2Ugb2YgRWRnZSBzcGVjaWZpYyBsaWZlY3ljbGUgbWlzLWJlaGF2aW9yKVxuICBjb21wb25lbnRDZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG4gIHBzZXVkb0ZvY3VzOiBQc2V1ZG9Gb2N1c01vZGVsPE9wdGlvbkRhdGE8VD4+ID0gbmV3IFBzZXVkb0ZvY3VzTW9kZWw8T3B0aW9uRGF0YTxUPj4oKTtcblxuICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjI7XG4gIHByaXZhdGUgX3RyaWdnZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIF9saXN0Ym94OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfdGV4dElucHV0OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBvcHRpb25EYXRhOiBPcHRpb25EYXRhPFQ+W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIsXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwcml2YXRlIHNlbGVjdGlvblNlcnZpY2U6IE9wdGlvblNlbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgdGhpcy5oYW5kbGVGb2N1c1N1YnNjcmlwdGlvbigpO1xuICAgIC8vIERpcmVjdCByZW5kZXJlciBpbmplY3Rpb24gY2FuIGJlIHByb2JsZW1hdGljIGFuZCBsZWFkcyB0byBmYWlsaW5nIHRlc3RzIGF0IGxlYXN0XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcbiAgfVxuXG4gIGdldCB0cmlnZ2VyKCkge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyO1xuICB9XG4gIHNldCB0cmlnZ2VyKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX3RyaWdnZXIgPSBlbDtcbiAgICB0aGlzLmFkZEZvY3VzT25CbHVyTGlzdGVuZXIoZWwpO1xuICB9XG5cbiAgZ2V0IGxpc3Rib3goKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3Rib3g7XG4gIH1cbiAgc2V0IGxpc3Rib3goZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fbGlzdGJveCA9IGVsO1xuICAgIHRoaXMuYWRkRm9jdXNPbkJsdXJMaXN0ZW5lcihlbCk7XG4gIH1cblxuICBnZXQgdGV4dElucHV0KCkge1xuICAgIHJldHVybiB0aGlzLl90ZXh0SW5wdXQ7XG4gIH1cbiAgc2V0IHRleHRJbnB1dChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLl90ZXh0SW5wdXQgPSBlbDtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbCwgJ2tleWRvd24nLCBldmVudCA9PiAhdGhpcy5oYW5kbGVUZXh0SW5wdXQoZXZlbnQpKTtcbiAgICB0aGlzLmFkZEZvY3VzT25CbHVyTGlzdGVuZXIoZWwpO1xuICB9XG5cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBpZiAodGhpcy50ZXh0SW5wdXQgJiYgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy50ZXh0SW5wdXQuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBmb2N1c0ZpcnN0QWN0aXZlKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbkRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5pc0VtcHR5KCkpIHtcbiAgICAgICAgdGhpcy5wc2V1ZG9Gb2N1cy5zZWxlY3QodGhpcy5vcHRpb25EYXRhWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBmaXJzdEFjdGl2ZTogVDtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uU2VydmljZS5tdWx0aXNlbGVjdGFibGUpIHtcbiAgICAgICAgICBmaXJzdEFjdGl2ZSA9ICh0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwubW9kZWwgYXMgVFtdKVswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaXJzdEFjdGl2ZSA9IHRoaXMuc2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbC5tb2RlbCBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFjdGl2ZVByb3h5ID0gdGhpcy5vcHRpb25EYXRhLmZpbmQob3B0aW9uID0+IG9wdGlvbi52YWx1ZSA9PT0gZmlyc3RBY3RpdmUpO1xuICAgICAgICBpZiAoYWN0aXZlUHJveHkpIHtcbiAgICAgICAgICAvLyBhY3RpdmUgZWxlbWVudCBpcyB2aXNpYmxlXG4gICAgICAgICAgdGhpcy5wc2V1ZG9Gb2N1cy5zZWxlY3QoYWN0aXZlUHJveHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHdlIGhhdmUgYWN0aXZlIGVsZW1lbnQsIGJ1dCBpdCdzIGZpbHRlcmVkIG91dFxuICAgICAgICAgIHRoaXMucHNldWRvRm9jdXMuc2VsZWN0KHRoaXMub3B0aW9uRGF0YVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY3JvbGxJbnRvU2VsZWN0ZWRNb2RlbCgnYXV0bycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZE9wdGlvblZhbHVlcyhvcHRpb25zOiBPcHRpb25EYXRhPFQ+W10pIHtcbiAgICB0aGlzLm9wdGlvbkRhdGEgPSBvcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVGb2N1c1N1YnNjcmlwdGlvbigpIHtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUob3BlbiA9PiB7XG4gICAgICBpZiAoIW9wZW4pIHtcbiAgICAgICAgdGhpcy5wc2V1ZG9Gb2N1cy5tb2RlbCA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVGb2N1c1RvKGRpcmVjdGlvbjogQXJyb3dLZXlEaXJlY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLm9wdGlvbkRhdGEuZmluZEluZGV4KG9wdGlvbiA9PiBvcHRpb24uZXF1YWxzKHRoaXMucHNldWRvRm9jdXMubW9kZWwpKTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBBcnJvd0tleURpcmVjdGlvbi5VUCkge1xuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA9PT0gMCkge1xuICAgICAgICBpbmRleCA9IHRoaXMub3B0aW9uRGF0YS5sZW5ndGggLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gQXJyb3dLZXlEaXJlY3Rpb24uRE9XTikge1xuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA9PT0gdGhpcy5vcHRpb25EYXRhLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wc2V1ZG9Gb2N1cy5zZWxlY3QodGhpcy5vcHRpb25EYXRhW2luZGV4XSk7XG4gICAgdGhpcy5zY3JvbGxJbnRvU2VsZWN0ZWRNb2RlbCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuQW5kTW92ZVRvKGRpcmVjdGlvbjogQXJyb3dLZXlEaXJlY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSB7XG4gICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcGVuID0+IHtcbiAgICAgICAgaWYgKG9wZW4pIHtcbiAgICAgICAgICB0aGlzLm1vdmVGb2N1c1RvKGRpcmVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdmVGb2N1c1RvKGRpcmVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gdGhpcyBzZXJ2aWNlIGlzIG9ubHkgaW50ZXJlc3RlZCBpbiBrZXlzIHRoYXQgbWF5IG1vdmUgdGhlIGZvY3VzXG4gIHByaXZhdGUgaGFuZGxlVGV4dElucHV0KGV2ZW50OiBLZXlib2FyZEV2ZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IHByZXZlbnREZWZhdWx0ID0gZmFsc2U7XG4gICAgY29uc3Qga2V5ID0gbm9ybWFsaXplS2V5KGV2ZW50LmtleSk7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlIEtleXMuRW50ZXI6XG4gICAgICAgICAgaWYgKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuICYmIHRoaXMucHNldWRvRm9jdXMubW9kZWwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvblNlcnZpY2UubXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2VydmljZS50b2dnbGUodGhpcy5wc2V1ZG9Gb2N1cy5tb2RlbC52YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0KHRoaXMucHNldWRvRm9jdXMubW9kZWwudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldmVudERlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlzLlNwYWNlOlxuICAgICAgICAgIGlmICghdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5cy5BcnJvd1VwOlxuICAgICAgICAgIHRoaXMucHJldmVudFZpZXdwb3J0U2Nyb2xsaW5nKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLm9wZW5BbmRNb3ZlVG8oQXJyb3dLZXlEaXJlY3Rpb24uVVApO1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlzLkFycm93RG93bjpcbiAgICAgICAgICB0aGlzLnByZXZlbnRWaWV3cG9ydFNjcm9sbGluZyhldmVudCk7XG4gICAgICAgICAgdGhpcy5vcGVuQW5kTW92ZVRvKEFycm93S2V5RGlyZWN0aW9uLkRPV04pO1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBBbnkgb3RoZXIga2V5cHJlc3NcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBldmVudC5rZXkgIT09IEtleXMuVGFiICYmXG4gICAgICAgICAgICAhKHRoaXMuc2VsZWN0aW9uU2VydmljZS5tdWx0aXNlbGVjdGFibGUgJiYgZXZlbnQua2V5ID09PSBLZXlzLkJhY2tzcGFjZSkgJiZcbiAgICAgICAgICAgICEoZXZlbnQua2V5ID09PSBLZXlzLkVzY2FwZSkgJiZcbiAgICAgICAgICAgICF0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlblxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByZXZlbnREZWZhdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxJbnRvU2VsZWN0ZWRNb2RlbChiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJykge1xuICAgIGlmICh0aGlzLnBzZXVkb0ZvY3VzLm1vZGVsICYmIHRoaXMucHNldWRvRm9jdXMubW9kZWwuZWwpIHtcbiAgICAgIHRoaXMucHNldWRvRm9jdXMubW9kZWwuZWwuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvciwgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICduZWFyZXN0JyB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByZXZlbnRWaWV3cG9ydFNjcm9sbGluZyhldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIGFkZEZvY3VzT25CbHVyTGlzdGVuZXIoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAnYmx1cicsIGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNPdXRPZkNvbXBvbmVudChldmVudCkpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIHBvcG92ZXIgY2xvc2Utb24tb3V0c2lkZS1jbGljayB0aW1pbmcgaXNzdWVzIGluIEVkZ2UgYnJvd3NlclxuICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudENkUmVmKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudENkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9jdXNPdXRPZkNvbXBvbmVudChldmVudDogRm9jdXNFdmVudCk6IGJvb2xlYW4ge1xuICAgIC8vIGV2ZW50LnJlbGF0ZWRUYXJnZXQgaXMgbnVsbCBpbiBJRTExLiBJbiB0aGF0IGNhc2Ugd2UgdXNlIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAvLyB3aGljaCBwb2ludHMgdG8gdGhlIGVsZW1lbnQgdGhhdCBiZWNvbWVzIGFjdGl2ZSBhcyB0aGUgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0LlxuICAgIGNvbnN0IHRhcmdldCA9IChldmVudC5yZWxhdGVkVGFyZ2V0IHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIGFzIE5vZGU7XG4gICAgcmV0dXJuICEodGhpcy50ZXh0SW5wdXQuY29udGFpbnModGFyZ2V0KSB8fCB0aGlzLnRyaWdnZXIuY29udGFpbnModGFyZ2V0KSB8fCB0aGlzLmxpc3Rib3guY29udGFpbnModGFyZ2V0KSk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IENPTUJPQk9YX0ZPQ1VTX0hBTkRMRVJfUFJPVklERVIgPSBjdXN0b21Gb2N1c2FibGVJdGVtUHJvdmlkZXIoQ29tYm9ib3hGb2N1c0hhbmRsZXIpO1xuXG5leHBvcnQgY2xhc3MgT3B0aW9uRGF0YTxUPiB7XG4gIGVsOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIHZhbHVlOiBUKSB7fVxuXG4gIGVxdWFscyhvdGhlcjogT3B0aW9uRGF0YTxUPik6IGJvb2xlYW4ge1xuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaWQgPT09IG90aGVyLmlkICYmIHRoaXMudmFsdWUgPT09IG90aGVyLnZhbHVlO1xuICB9XG59XG4iXX0=