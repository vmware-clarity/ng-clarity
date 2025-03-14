/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Linkers } from '../../utils/focus/focusable-item/linkers';
import { InitialFocus } from './button-group-focus.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/focus/focus.service";
import * as i2 from "../../utils";
export class ButtonGroupFocusHandler {
    constructor(focusService, toggleService, renderer) {
        this.focusService = focusService;
        this.toggleService = toggleService;
        this.renderer = renderer;
        this.initialFocus = InitialFocus.FIRST_ITEM;
        this._unlistenFuncs = [];
    }
    ngOnDestroy() {
        this._unlistenFuncs.forEach((unlisten) => unlisten());
        this.focusService.detachListeners();
    }
    initialize({ menu, menuToggle }) {
        this.menu = menu;
        this.menuToggle = menuToggle;
        this.focusService.registerContainer(this.menu, '-1');
        this.listenToKeys();
        this.linkButtons();
        switch (this.initialFocus) {
            case InitialFocus.LAST_ITEM:
                this.focusLastItem();
                break;
            default:
                this.focusFirstItem();
                break;
        }
    }
    resetButtonsFocus() {
        this.buttons.forEach(button => {
            button.blur();
        });
    }
    listenToKeys() {
        this._unlistenFuncs.push(this.renderer.listen(this.menu, 'keydown.shift.tab', event => this.closeMenu(event, false)));
        this._unlistenFuncs.push(this.renderer.listen(this.menu, 'keydown.tab', event => this.closeMenu(event, true)));
    }
    closeMenu(event, focusBackOnToggle) {
        this.toggleService.toggleWithEvent(event);
        if (focusBackOnToggle) {
            this.menuToggle.focus();
        }
        this.resetButtonsFocus();
    }
    linkButtons() {
        const buttonElements = Array.from(this.menu.children);
        this.buttons = buttonElements.map(buttonElement => {
            this._unlistenFuncs.push(this.renderer.listen(buttonElement, 'click', event => this.closeMenu(event, true)));
            return {
                id: buttonElement.id,
                value: buttonElement,
                focus: () => {
                    buttonElement.setAttribute('tabindex', '0');
                    buttonElement.focus();
                },
                blur: () => {
                    buttonElement.setAttribute('tabindex', '-1');
                    buttonElement.blur();
                },
            };
        });
        this.resetButtonsFocus();
        Linkers.linkVertical(this.buttons);
    }
    focusFirstItem() {
        if (this.buttons.length) {
            this.focusService.moveTo(this.buttons[0]);
        }
        this.initialFocus = InitialFocus.FIRST_ITEM;
    }
    focusLastItem() {
        if (this.buttons.length) {
            this.focusService.moveTo(this.buttons[this.buttons.length - 1]);
        }
        this.initialFocus = InitialFocus.FIRST_ITEM;
    }
}
ButtonGroupFocusHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonGroupFocusHandler, deps: [{ token: i1.FocusService }, { token: i2.ClrPopoverToggleService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable });
ButtonGroupFocusHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonGroupFocusHandler });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonGroupFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.FocusService }, { type: i2.ClrPopoverToggleService }, { type: i0.Renderer2 }]; } });
export const BUTTON_GROUP_FOCUS_HANDLER_PROVIDER = {
    provide: ButtonGroupFocusHandler,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWdyb3VwLWZvY3VzLWhhbmRsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2J1dHRvbi9wcm92aWRlcnMvYnV0dG9uLWdyb3VwLWZvY3VzLWhhbmRsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFLdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQUd6RCxNQUFNLE9BQU8sdUJBQXVCO0lBUWxDLFlBQ1UsWUFBMEIsRUFDMUIsYUFBc0MsRUFDdEMsUUFBbUI7UUFGbkIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFWN0IsaUJBQVksR0FBaUIsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUs3QyxtQkFBYyxHQUFtQixFQUFFLENBQUM7SUFNekMsQ0FBQztJQUVKLFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQW9CLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBa0Q7UUFDN0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FB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LFlBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQzlDLENBQUM7SUFFTyxhQUFhO1FBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0lBQzlDLENBQUM7O29IQTNGVSx1QkFBdUI7d0hBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVOztBQStGWCxNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBRztJQUNqRCxPQUFPLEVBQUUsdUJBQXVCO0NBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEZvY3VzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9jdXNhYmxlSXRlbSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzYWJsZS1pdGVtL2ZvY3VzYWJsZS1pdGVtJztcbmltcG9ydCB7IExpbmtlcnMgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9mb2N1c2FibGUtaXRlbS9saW5rZXJzJztcbmltcG9ydCB7IEluaXRpYWxGb2N1cyB9IGZyb20gJy4vYnV0dG9uLWdyb3VwLWZvY3VzLmVudW0nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQnV0dG9uR3JvdXBGb2N1c0hhbmRsZXIge1xuICBpbml0aWFsRm9jdXM6IEluaXRpYWxGb2N1cyA9IEluaXRpYWxGb2N1cy5GSVJTVF9JVEVNO1xuXG4gIHByaXZhdGUgbWVudTogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgbWVudVRvZ2dsZTogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgYnV0dG9uczogRm9jdXNhYmxlSXRlbVtdO1xuICBwcml2YXRlIF91bmxpc3RlbkZ1bmNzOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZm9jdXNTZXJ2aWNlOiBGb2N1c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3VubGlzdGVuRnVuY3MuZm9yRWFjaCgodW5saXN0ZW46ICgpID0+IHZvaWQpID0+IHVubGlzdGVuKCkpO1xuICAgIHRoaXMuZm9jdXNTZXJ2aWNlLmRldGFjaExpc3RlbmVycygpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSh7IG1lbnUsIG1lbnVUb2dnbGUgfTogeyBtZW51OiBIVE1MRWxlbWVudDsgbWVudVRvZ2dsZTogSFRNTEVsZW1lbnQgfSkge1xuICAgIHRoaXMubWVudSA9IG1lbnU7XG4gICAgdGhpcy5tZW51VG9nZ2xlID0gbWVudVRvZ2dsZTtcblxuICAgIHRoaXMuZm9jdXNTZXJ2aWNlLnJlZ2lzdGVyQ29udGFpbmVyKHRoaXMubWVudSwgJy0xJyk7XG4gICAgdGhpcy5saXN0ZW5Ub0tleXMoKTtcbiAgICB0aGlzLmxpbmtCdXR0b25zKCk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuaW5pdGlhbEZvY3VzKSB7XG4gICAgICBjYXNlIEluaXRpYWxGb2N1cy5MQVNUX0lURU06XG4gICAgICAgIHRoaXMuZm9jdXNMYXN0SXRlbSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZm9jdXNGaXJzdEl0ZW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldEJ1dHRvbnNGb2N1cygpIHtcbiAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLmJsdXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuVG9LZXlzKCkge1xuICAgIHRoaXMuX3VubGlzdGVuRnVuY3MucHVzaChcbiAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMubWVudSwgJ2tleWRvd24uc2hpZnQudGFiJywgZXZlbnQgPT4gdGhpcy5jbG9zZU1lbnUoZXZlbnQsIGZhbHNlKSlcbiAgICApO1xuICAgIHRoaXMuX3VubGlzdGVuRnVuY3MucHVzaCh0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLm1lbnUsICdrZXlkb3duLnRhYicsIGV2ZW50ID0+IHRoaXMuY2xvc2VNZW51KGV2ZW50LCB0cnVlKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZU1lbnUoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGZvY3VzQmFja09uVG9nZ2xlOiBib29sZWFuKSB7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCk7XG4gICAgaWYgKGZvY3VzQmFja09uVG9nZ2xlKSB7XG4gICAgICB0aGlzLm1lbnVUb2dnbGUuZm9jdXMoKTtcbiAgICB9XG4gICAgdGhpcy5yZXNldEJ1dHRvbnNGb2N1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaW5rQnV0dG9ucygpIHtcbiAgICBjb25zdCBidXR0b25FbGVtZW50cyA9IEFycmF5LmZyb20odGhpcy5tZW51LmNoaWxkcmVuKSBhcyBIVE1MRWxlbWVudFtdO1xuICAgIHRoaXMuYnV0dG9ucyA9IGJ1dHRvbkVsZW1lbnRzLm1hcDxGb2N1c2FibGVJdGVtPihidXR0b25FbGVtZW50ID0+IHtcbiAgICAgIHRoaXMuX3VubGlzdGVuRnVuY3MucHVzaCh0aGlzLnJlbmRlcmVyLmxpc3RlbihidXR0b25FbGVtZW50LCAnY2xpY2snLCBldmVudCA9PiB0aGlzLmNsb3NlTWVudShldmVudCwgdHJ1ZSkpKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBidXR0b25FbGVtZW50LmlkLFxuICAgICAgICB2YWx1ZTogYnV0dG9uRWxlbWVudCxcbiAgICAgICAgZm9jdXM6ICgpID0+IHtcbiAgICAgICAgICBidXR0b25FbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgYmx1cjogKCkgPT4ge1xuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgIGJ1dHRvbkVsZW1lbnQuYmx1cigpO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLnJlc2V0QnV0dG9uc0ZvY3VzKCk7XG4gICAgTGlua2Vycy5saW5rVmVydGljYWwodGhpcy5idXR0b25zKTtcbiAgfVxuXG4gIHByaXZhdGUgZm9jdXNGaXJzdEl0ZW0oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZm9jdXNTZXJ2aWNlLm1vdmVUbyh0aGlzLmJ1dHRvbnNbMF0pO1xuICAgIH1cbiAgICB0aGlzLmluaXRpYWxGb2N1cyA9IEluaXRpYWxGb2N1cy5GSVJTVF9JVEVNO1xuICB9XG5cbiAgcHJpdmF0ZSBmb2N1c0xhc3RJdGVtKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZvY3VzU2VydmljZS5tb3ZlVG8odGhpcy5idXR0b25zW3RoaXMuYnV0dG9ucy5sZW5ndGggLSAxXSk7XG4gICAgfVxuICAgIHRoaXMuaW5pdGlhbEZvY3VzID0gSW5pdGlhbEZvY3VzLkZJUlNUX0lURU07XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJVVFRPTl9HUk9VUF9GT0NVU19IQU5ETEVSX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBCdXR0b25Hcm91cEZvY3VzSGFuZGxlcixcbn07XG4iXX0=