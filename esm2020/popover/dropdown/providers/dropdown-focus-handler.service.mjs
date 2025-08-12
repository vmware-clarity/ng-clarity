/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, SkipSelf } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ArrowKeyDirection } from '../../../utils/focus/arrow-key-direction.enum';
import { customFocusableItemProvider } from '../../../utils/focus/focusable-item/custom-focusable-item-provider';
import { Linkers } from '../../../utils/focus/focusable-item/linkers';
import { wrapObservable } from '../../../utils/focus/wrap-observable';
import { uniqueIdFactory } from '../../../utils/id-generator/id-generator.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../utils/popover/providers/popover-toggle.service";
import * as i2 from "../../../utils/focus/focus.service";
export class DropdownFocusHandler {
    constructor(renderer, parent, toggleService, focusService, platformId) {
        this.renderer = renderer;
        this.parent = parent;
        this.toggleService = toggleService;
        this.focusService = focusService;
        this.platformId = platformId;
        this.id = uniqueIdFactory();
        this.focusBackOnTriggerWhenClosed = false;
        this._unlistenFuncs = [];
        this.resetChildren();
        this.moveToFirstItemWhenOpen();
        if (!parent) {
            this.handleRootFocus();
        }
    }
    get trigger() {
        return this._trigger;
    }
    set trigger(el) {
        this._trigger = el;
        if (this.parent) {
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowright', event => this.toggleService.toggleWithEvent(event)));
        }
        else {
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowup', event => this.toggleService.toggleWithEvent(event)));
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowdown', event => this.toggleService.toggleWithEvent(event)));
            this.focusService.listenToArrowKeys(el);
        }
    }
    get container() {
        return this._container;
    }
    set container(el) {
        this._container = el;
        // whether root container or not, tab key should always toggle (i.e. close) the container
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.tab', event => this.toggleService.toggleWithEvent(event)));
        if (this.parent) {
            // if it's a nested container, pressing escape has the same effect as pressing left key, which closes the current
            // popup and moves up to its parent. Here, we stop propagation so that the parent container
            // doesn't receive the escape keydown
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.escape', event => {
                this.focusService.move(ArrowKeyDirection.LEFT);
                event.stopPropagation();
            }));
        }
        else {
            // The root container is the only one we register to the focus service, others do not need focus
            this.focusService.registerContainer(el);
            // The root container will simply close the container when escape key is pressed
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.escape', event => this.toggleService.toggleWithEvent(event)));
            // When the user moves focus outside of the menu, we close the dropdown
            this._unlistenFuncs.push(this.renderer.listen(el, 'blur', event => {
                // we clear out any existing focus on the items
                this.children.pipe(take(1)).subscribe(items => items.forEach(item => item.blur()));
                // event.relatedTarget is null in IE11. In that case we use document.activeElement which correctly points
                // to the element we want to check. Note that other browsers might point document.activeElement to the
                // wrong element. This is ok, because all the other browsers we support relies on event.relatedTarget.
                const target = event.relatedTarget || document.activeElement;
                // If the user clicks on an item which triggers the blur, we don't want to close it since it may open a submenu.
                // In the case of needing to close it (i.e. user selected an item and the dropdown menu is set to close on
                // selection), dropdown-item.ts handles it.
                if (target && isPlatformBrowser(this.platformId)) {
                    if (el.contains(target) || target === this.trigger) {
                        return;
                    }
                }
                // We let the user move focus to where the want, we don't force the focus back on the trigger
                this.focusBackOnTriggerWhenClosed = false;
                this.toggleService.open = false;
            }));
        }
    }
    ngOnDestroy() {
        this._unlistenFuncs.forEach((unlisten) => unlisten());
        this.focusService.detachListeners();
    }
    /**
     * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
     */
    moveToFirstItemWhenOpen() {
        const subscription = this.toggleService.openChange.subscribe(open => {
            if (open && this.toggleService.originalEvent) {
                // Even if we properly waited for ngAfterViewInit, the container still wouldn't be attached to the DOM.
                // So setTimeout is the only way to wait for the container to be ready to move focus to first item.
                setTimeout(() => {
                    this.focusService.moveTo(this);
                    if (this.parent) {
                        this.focusService.move(ArrowKeyDirection.RIGHT);
                    }
                    else {
                        this.focusService.move(ArrowKeyDirection.DOWN);
                    }
                });
            }
        });
        this._unlistenFuncs.push(() => subscription.unsubscribe());
    }
    /**
     * Focus on the menu when it opens, and focus back on the root trigger when the whole dropdown becomes closed
     */
    handleRootFocus() {
        const subscription = this.toggleService.openChange.subscribe(open => {
            if (!open) {
                // We reset the state of the focus service both on initialization and when closing.
                this.focusService.reset(this);
                // But we only actively focus the trigger when closing, not on initialization.
                if (this.focusBackOnTriggerWhenClosed) {
                    this.focus();
                }
            }
            this.focusBackOnTriggerWhenClosed = open;
        });
        this._unlistenFuncs.push(() => subscription.unsubscribe());
    }
    focus() {
        if (this.trigger && isPlatformBrowser(this.platformId)) {
            this.trigger.focus();
        }
    }
    blur() {
        if (this.trigger && isPlatformBrowser(this.platformId)) {
            this.trigger.blur();
        }
    }
    activate() {
        if (isPlatformBrowser(this.platformId)) {
            this.trigger.click();
        }
    }
    resetChildren() {
        this.children = new ReplaySubject(1);
        if (this.parent) {
            this.right = this.openAndGetChildren().pipe(map(all => all[0]));
        }
        else {
            this.down = this.openAndGetChildren().pipe(map(all => all[0]));
            this.up = this.openAndGetChildren().pipe(map(all => all[all.length - 1]));
        }
    }
    addChildren(children) {
        Linkers.linkVertical(children);
        if (this.parent) {
            Linkers.linkParent(children, this.closeAndGetThis(), ArrowKeyDirection.LEFT);
        }
        this.children.next(children);
    }
    openAndGetChildren() {
        return wrapObservable(this.children, () => (this.toggleService.open = true));
    }
    closeAndGetThis() {
        return wrapObservable(of(this), () => (this.toggleService.open = false));
    }
}
DropdownFocusHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DropdownFocusHandler, deps: [{ token: i0.Renderer2 }, { token: DropdownFocusHandler, optional: true, skipSelf: true }, { token: i1.ClrPopoverToggleService }, { token: i2.FocusService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
DropdownFocusHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DropdownFocusHandler });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DropdownFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: DropdownFocusHandler, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i1.ClrPopoverToggleService }, { type: i2.FocusService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
export const DROPDOWN_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(DropdownFocusHandler);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tZm9jdXMtaGFuZGxlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci9kcm9wZG93bi9wcm92aWRlcnMvZHJvcGRvd24tZm9jdXMtaGFuZGxlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQWEsUUFBUSxFQUFFLFdBQVcsRUFBYSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUcsT0FBTyxFQUFjLEVBQUUsRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUVsRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQztBQUVqSCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxrREFBa0QsQ0FBQzs7OztBQUluRixNQUFNLE9BQU8sb0JBQW9CO0lBYS9CLFlBQ1UsUUFBbUIsRUFHbkIsTUFBNEIsRUFDNUIsYUFBc0MsRUFDdEMsWUFBMEIsRUFDTCxVQUFlO1FBTnBDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFHbkIsV0FBTSxHQUFOLE1BQU0sQ0FBc0I7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ0wsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQW5COUMs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QUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0U7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLFFBQXlCO1FBQ25DLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRU8sZUFBZTtRQUNyQixPQUFPLGNBQWMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7O2lIQW5NVSxvQkFBb0IsK0tBb0JyQixXQUFXO3FIQXBCVixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVTs7MEJBZ0JOLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUlSLE1BQU07MkJBQUMsV0FBVzs7QUFrTHZCLE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHLDJCQUEyQixDQUFDLG9CQUFvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95LCBPcHRpb25hbCwgUExBVEZPUk1fSUQsIFJlbmRlcmVyMiwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFycm93S2V5RGlyZWN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZm9jdXMvYXJyb3cta2V5LWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7IEZvY3VzU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgY3VzdG9tRm9jdXNhYmxlSXRlbVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXNhYmxlLWl0ZW0vY3VzdG9tLWZvY3VzYWJsZS1pdGVtLXByb3ZpZGVyJztcbmltcG9ydCB7IEZvY3VzYWJsZUl0ZW0gfSBmcm9tICcuLi8uLi8uLi91dGlscy9mb2N1cy9mb2N1c2FibGUtaXRlbS9mb2N1c2FibGUtaXRlbSc7XG5pbXBvcnQgeyBMaW5rZXJzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXNhYmxlLWl0ZW0vbGlua2Vycyc7XG5pbXBvcnQgeyB3cmFwT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2ZvY3VzL3dyYXAtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERyb3Bkb3duRm9jdXNIYW5kbGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBGb2N1c2FibGVJdGVtIHtcbiAgaWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcbiAgZm9jdXNCYWNrT25UcmlnZ2VyV2hlbkNsb3NlZCA9IGZhbHNlO1xuXG4gIHJpZ2h0PzogT2JzZXJ2YWJsZTxGb2N1c2FibGVJdGVtPjtcbiAgZG93bj86IE9ic2VydmFibGU8Rm9jdXNhYmxlSXRlbT47XG4gIHVwPzogT2JzZXJ2YWJsZTxGb2N1c2FibGVJdGVtPjtcblxuICBwcml2YXRlIF90cmlnZ2VyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogUmVwbGF5U3ViamVjdDxGb2N1c2FibGVJdGVtW10+O1xuICBwcml2YXRlIF91bmxpc3RlbkZ1bmNzOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBAU2tpcFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHJpdmF0ZSBwYXJlbnQ6IERyb3Bkb3duRm9jdXNIYW5kbGVyLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmb2N1c1NlcnZpY2U6IEZvY3VzU2VydmljZSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueVxuICApIHtcbiAgICB0aGlzLnJlc2V0Q2hpbGRyZW4oKTtcbiAgICB0aGlzLm1vdmVUb0ZpcnN0SXRlbVdoZW5PcGVuKCk7XG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHRoaXMuaGFuZGxlUm9vdEZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHRyaWdnZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyaWdnZXI7XG4gIH1cbiAgc2V0IHRyaWdnZXIoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5fdHJpZ2dlciA9IGVsO1xuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAna2V5ZG93bi5hcnJvd3JpZ2h0JywgZXZlbnQgPT4gdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCkpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAna2V5ZG93bi5hcnJvd3VwJywgZXZlbnQgPT4gdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCkpXG4gICAgICApO1xuICAgICAgdGhpcy5fdW5saXN0ZW5GdW5jcy5wdXNoKFxuICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbCwgJ2tleWRvd24uYXJyb3dkb3duJywgZXZlbnQgPT4gdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCkpXG4gICAgICApO1xuICAgICAgdGhpcy5mb2N1c1NlcnZpY2UubGlzdGVuVG9BcnJvd0tleXMoZWwpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuICBzZXQgY29udGFpbmVyKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGVsO1xuXG4gICAgLy8gd2hldGhlciByb290IGNvbnRhaW5lciBvciBub3QsIHRhYiBrZXkgc2hvdWxkIGFsd2F5cyB0b2dnbGUgKGkuZS4gY2xvc2UpIHRoZSBjb250YWluZXJcbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goXG4gICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbCwgJ2tleWRvd24udGFiJywgZXZlbnQgPT4gdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCkpXG4gICAgKTtcblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgLy8gaWYgaXQncyBhIG5lc3RlZCBjb250YWluZXIsIHByZXNzaW5nIGVzY2FwZSBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzIHByZXNzaW5nIGxlZnQga2V5LCB3aGljaCBjbG9zZXMgdGhlIGN1cnJlbnRcbiAgICAgIC8vIHBvcHVwIGFuZCBtb3ZlcyB1cCB0byBpdHMgcGFyZW50LiBIZXJlLCB3ZSBzdG9wIHByb3BhZ2F0aW9uIHNvIHRoYXQgdGhlIHBhcmVudCBjb250YWluZXJcbiAgICAgIC8vIGRvZXNuJ3QgcmVjZWl2ZSB0aGUgZXNjYXBlIGtleWRvd25cbiAgICAgIHRoaXMuX3VubGlzdGVuRnVuY3MucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLmVzY2FwZScsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmZvY3VzU2VydmljZS5tb3ZlKEFycm93S2V5RGlyZWN0aW9uLkxFRlQpO1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHJvb3QgY29udGFpbmVyIGlzIHRoZSBvbmx5IG9uZSB3ZSByZWdpc3RlciB0byB0aGUgZm9jdXMgc2VydmljZSwgb3RoZXJzIGRvIG5vdCBuZWVkIGZvY3VzXG4gICAgICB0aGlzLmZvY3VzU2VydmljZS5yZWdpc3RlckNvbnRhaW5lcihlbCk7XG5cbiAgICAgIC8vIFRoZSByb290IGNvbnRhaW5lciB3aWxsIHNpbXBseSBjbG9zZSB0aGUgY29udGFpbmVyIHdoZW4gZXNjYXBlIGtleSBpcyBwcmVzc2VkXG4gICAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAna2V5ZG93bi5lc2NhcGUnLCBldmVudCA9PiB0aGlzLnRvZ2dsZVNlcnZpY2UudG9nZ2xlV2l0aEV2ZW50KGV2ZW50KSlcbiAgICAgICk7XG5cbiAgICAgIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgZm9jdXMgb3V0c2lkZSBvZiB0aGUgbWVudSwgd2UgY2xvc2UgdGhlIGRyb3Bkb3duXG4gICAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAnYmx1cicsIGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyB3ZSBjbGVhciBvdXQgYW55IGV4aXN0aW5nIGZvY3VzIG9uIHRoZSBpdGVtc1xuICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoaXRlbXMgPT4gaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uYmx1cigpKSk7XG5cbiAgICAgICAgICAvLyBldmVudC5yZWxhdGVkVGFyZ2V0IGlzIG51bGwgaW4gSUUxMS4gSW4gdGhhdCBjYXNlIHdlIHVzZSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IHdoaWNoIGNvcnJlY3RseSBwb2ludHNcbiAgICAgICAgICAvLyB0byB0aGUgZWxlbWVudCB3ZSB3YW50IHRvIGNoZWNrLiBOb3RlIHRoYXQgb3RoZXIgYnJvd3NlcnMgbWlnaHQgcG9pbnQgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB0byB0aGVcbiAgICAgICAgICAvLyB3cm9uZyBlbGVtZW50LiBUaGlzIGlzIG9rLCBiZWNhdXNlIGFsbCB0aGUgb3RoZXIgYnJvd3NlcnMgd2Ugc3VwcG9ydCByZWxpZXMgb24gZXZlbnQucmVsYXRlZFRhcmdldC5cbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC5yZWxhdGVkVGFyZ2V0IHx8IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgdXNlciBjbGlja3Mgb24gYW4gaXRlbSB3aGljaCB0cmlnZ2VycyB0aGUgYmx1ciwgd2UgZG9uJ3Qgd2FudCB0byBjbG9zZSBpdCBzaW5jZSBpdCBtYXkgb3BlbiBhIHN1Ym1lbnUuXG4gICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgbmVlZGluZyB0byBjbG9zZSBpdCAoaS5lLiB1c2VyIHNlbGVjdGVkIGFuIGl0ZW0gYW5kIHRoZSBkcm9wZG93biBtZW51IGlzIHNldCB0byBjbG9zZSBvblxuICAgICAgICAgIC8vIHNlbGVjdGlvbiksIGRyb3Bkb3duLWl0ZW0udHMgaGFuZGxlcyBpdC5cbiAgICAgICAgICBpZiAodGFyZ2V0ICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmIChlbC5jb250YWlucyh0YXJnZXQpIHx8IHRhcmdldCA9PT0gdGhpcy50cmlnZ2VyKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gV2UgbGV0IHRoZSB1c2VyIG1vdmUgZm9jdXMgdG8gd2hlcmUgdGhlIHdhbnQsIHdlIGRvbid0IGZvcmNlIHRoZSBmb2N1cyBiYWNrIG9uIHRoZSB0cmlnZ2VyXG4gICAgICAgICAgdGhpcy5mb2N1c0JhY2tPblRyaWdnZXJXaGVuQ2xvc2VkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdW5saXN0ZW5GdW5jcy5mb3JFYWNoKCh1bmxpc3RlbjogKCkgPT4gdm9pZCkgPT4gdW5saXN0ZW4oKSk7XG4gICAgdGhpcy5mb2N1c1NlcnZpY2UuZGV0YWNoTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGRyb3Bkb3duIHdhcyBvcGVuZWQgYnkgY2xpY2tpbmcgb24gdGhlIHRyaWdnZXIsIHdlIGF1dG9tYXRpY2FsbHkgbW92ZSB0byB0aGUgZmlyc3QgaXRlbVxuICAgKi9cbiAgbW92ZVRvRmlyc3RJdGVtV2hlbk9wZW4oKSB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKG9wZW4gPT4ge1xuICAgICAgaWYgKG9wZW4gJiYgdGhpcy50b2dnbGVTZXJ2aWNlLm9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgLy8gRXZlbiBpZiB3ZSBwcm9wZXJseSB3YWl0ZWQgZm9yIG5nQWZ0ZXJWaWV3SW5pdCwgdGhlIGNvbnRhaW5lciBzdGlsbCB3b3VsZG4ndCBiZSBhdHRhY2hlZCB0byB0aGUgRE9NLlxuICAgICAgICAvLyBTbyBzZXRUaW1lb3V0IGlzIHRoZSBvbmx5IHdheSB0byB3YWl0IGZvciB0aGUgY29udGFpbmVyIHRvIGJlIHJlYWR5IHRvIG1vdmUgZm9jdXMgdG8gZmlyc3QgaXRlbS5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5mb2N1c1NlcnZpY2UubW92ZVRvKHRoaXMpO1xuICAgICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1c1NlcnZpY2UubW92ZShBcnJvd0tleURpcmVjdGlvbi5SSUdIVCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNTZXJ2aWNlLm1vdmUoQXJyb3dLZXlEaXJlY3Rpb24uRE9XTik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3VubGlzdGVuRnVuY3MucHVzaCgoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXMgb24gdGhlIG1lbnUgd2hlbiBpdCBvcGVucywgYW5kIGZvY3VzIGJhY2sgb24gdGhlIHJvb3QgdHJpZ2dlciB3aGVuIHRoZSB3aG9sZSBkcm9wZG93biBiZWNvbWVzIGNsb3NlZFxuICAgKi9cbiAgaGFuZGxlUm9vdEZvY3VzKCkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHRoaXMudG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShvcGVuID0+IHtcbiAgICAgIGlmICghb3Blbikge1xuICAgICAgICAvLyBXZSByZXNldCB0aGUgc3RhdGUgb2YgdGhlIGZvY3VzIHNlcnZpY2UgYm90aCBvbiBpbml0aWFsaXphdGlvbiBhbmQgd2hlbiBjbG9zaW5nLlxuICAgICAgICB0aGlzLmZvY3VzU2VydmljZS5yZXNldCh0aGlzKTtcbiAgICAgICAgLy8gQnV0IHdlIG9ubHkgYWN0aXZlbHkgZm9jdXMgdGhlIHRyaWdnZXIgd2hlbiBjbG9zaW5nLCBub3Qgb24gaW5pdGlhbGl6YXRpb24uXG4gICAgICAgIGlmICh0aGlzLmZvY3VzQmFja09uVHJpZ2dlcldoZW5DbG9zZWQpIHtcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZm9jdXNCYWNrT25UcmlnZ2VyV2hlbkNsb3NlZCA9IG9wZW47XG4gICAgfSk7XG5cbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2goKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgZm9jdXMoKSB7XG4gICAgaWYgKHRoaXMudHJpZ2dlciAmJiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLnRyaWdnZXIuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBibHVyKCkge1xuICAgIGlmICh0aGlzLnRyaWdnZXIgJiYgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy50cmlnZ2VyLmJsdXIoKTtcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy50cmlnZ2VyLmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXRDaGlsZHJlbigpIHtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3IFJlcGxheVN1YmplY3Q8Rm9jdXNhYmxlSXRlbVtdPigxKTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucmlnaHQgPSB0aGlzLm9wZW5BbmRHZXRDaGlsZHJlbigpLnBpcGUobWFwKGFsbCA9PiBhbGxbMF0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb3duID0gdGhpcy5vcGVuQW5kR2V0Q2hpbGRyZW4oKS5waXBlKG1hcChhbGwgPT4gYWxsWzBdKSk7XG4gICAgICB0aGlzLnVwID0gdGhpcy5vcGVuQW5kR2V0Q2hpbGRyZW4oKS5waXBlKG1hcChhbGwgPT4gYWxsW2FsbC5sZW5ndGggLSAxXSkpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENoaWxkcmVuKGNoaWxkcmVuOiBGb2N1c2FibGVJdGVtW10pIHtcbiAgICBMaW5rZXJzLmxpbmtWZXJ0aWNhbChjaGlsZHJlbik7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBMaW5rZXJzLmxpbmtQYXJlbnQoY2hpbGRyZW4sIHRoaXMuY2xvc2VBbmRHZXRUaGlzKCksIEFycm93S2V5RGlyZWN0aW9uLkxFRlQpO1xuICAgIH1cbiAgICB0aGlzLmNoaWxkcmVuLm5leHQoY2hpbGRyZW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuQW5kR2V0Q2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHdyYXBPYnNlcnZhYmxlKHRoaXMuY2hpbGRyZW4sICgpID0+ICh0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IHRydWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xvc2VBbmRHZXRUaGlzKCkge1xuICAgIHJldHVybiB3cmFwT2JzZXJ2YWJsZShvZih0aGlzKSwgKCkgPT4gKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2UpKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgRFJPUERPV05fRk9DVVNfSEFORExFUl9QUk9WSURFUiA9IGN1c3RvbUZvY3VzYWJsZUl0ZW1Qcm92aWRlcihEcm9wZG93bkZvY3VzSGFuZGxlcik7XG4iXX0=