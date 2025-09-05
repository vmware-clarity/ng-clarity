/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Optional, Output, SkipSelf, ViewChild } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../providers/button-in-group.service";
import * as i3 from "@angular/common";
export class ClrButton {
    constructor(routerLinkActive, buttonInGroupService) {
        this.routerLinkActive = routerLinkActive;
        this.buttonInGroupService = buttonInGroupService;
        this._click = new EventEmitter(false);
        this._inMenu = false;
        this._enableService = false;
        this._classNames = 'btn';
        this._name = null;
        this._type = null;
        this._disabled = null;
        this._id = uniqueIdFactory();
    }
    get inMenu() {
        return this._inMenu;
    }
    set inMenu(value) {
        value = !!value;
        if (this._inMenu !== value) {
            this._inMenu = value;
            // We check if the service flag is enabled
            // and if the service exists because the service is optional
            if (this._enableService && this.buttonInGroupService) {
                this.buttonInGroupService.updateButtonGroup(this);
            }
        }
    }
    get classNames() {
        return this.routerLinkActive?.isActive ? `${this._classNames} ${this.routerLinkActiveClasses}` : this._classNames;
    }
    set classNames(value) {
        if (typeof value === 'string') {
            const classNames = value.split(' ');
            if (classNames.indexOf('btn') === -1) {
                classNames.push('btn');
            }
            this._classNames = classNames.join(' ');
        }
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (typeof value === 'string') {
            this._name = value;
        }
    }
    get type() {
        return this._type;
    }
    set type(value) {
        if (typeof value === 'string') {
            this._type = value;
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        if (typeof value === 'string') {
            this._id = value;
        }
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value !== null && value !== false) {
            this._disabled = '';
        }
        else {
            this._disabled = null;
        }
    }
    get role() {
        return this.inMenu ? 'menuitem' : null;
    }
    ngAfterViewInit() {
        this._enableService = true;
    }
    loadingStateChange(state) {
        this.loading = state === ClrLoadingState.LOADING;
    }
    emitClick() {
        this._click.emit(true);
    }
}
ClrButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButton, deps: [{ token: i1.RouterLinkActive, optional: true }, { token: i2.ButtonInGroupService, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Component });
ClrButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrButton, selector: "clr-button", inputs: { routerLinkActiveClasses: ["routerLinkActive", "routerLinkActiveClasses"], inMenu: ["clrInMenu", "inMenu"], classNames: ["class", "classNames"], name: "name", type: "type", id: "id", disabled: "disabled" }, outputs: { _click: "click" }, providers: [{ provide: LoadingListener, useExisting: ClrButton }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["buttonProjectedRef"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #buttonProjectedRef>
      <button
        [class]="classNames"
        (click)="emitClick()"
        [attr.type]="type"
        [attr.name]="name"
        [attr.disabled]="disabled"
        [attr.role]="role"
        [attr.id]="id"
      >
        <span class="spinner spinner-inline" *ngIf="loading"></span>
        <ng-content></ng-content>
      </button>
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-button',
                    template: `
    <ng-template #buttonProjectedRef>
      <button
        [class]="classNames"
        (click)="emitClick()"
        [attr.type]="type"
        [attr.name]="name"
        [attr.disabled]="disabled"
        [attr.role]="role"
        [attr.id]="id"
      >
        <span class="spinner spinner-inline" *ngIf="loading"></span>
        <ng-content></ng-content>
      </button>
    </ng-template>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrButton }],
                }]
        }], ctorParameters: function () { return [{ type: i1.RouterLinkActive, decorators: [{
                    type: Optional
                }] }, { type: i2.ButtonInGroupService, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }]; }, propDecorators: { _click: [{
                type: Output,
                args: ['click']
            }], routerLinkActiveClasses: [{
                type: Input,
                args: ['routerLinkActive']
            }], templateRef: [{
                type: ViewChild,
                args: ['buttonProjectedRef', { static: true }]
            }], inMenu: [{
                type: Input,
                args: ['clrInMenu']
            }], classNames: [{
                type: Input,
                args: ['class']
            }], name: [{
                type: Input,
                args: ['name']
            }], type: [{
                type: Input,
                args: ['type']
            }], id: [{
                type: Input,
                args: ['id']
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYnV0dG9uL2J1dHRvbi1ncm91cC9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQWUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR25ILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7OztBQXVCdkUsTUFBTSxPQUFPLFNBQVM7SUFnQnBCLFlBQytCLGdCQUFrQyxFQUNoQyxvQkFBMEM7UUFENUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNoQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBakIxRCxXQUFNLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFPbkQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBQ3JCLFVBQUssR0FBVyxJQUFJLENBQUM7UUFDckIsY0FBUyxHQUFRLElBQUksQ0FBQztRQUN0QixRQUFHLEdBQVcsZUFBZSxFQUFFLENBQUM7SUFLckMsQ0FBQztJQUVKLElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsS0FBYztRQUN2QixLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoQixJQUFJLElBQUksQ0FB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LEVBQUUsQ0FBQywySkFoQnZEOzs7Ozs7Ozs7Ozs7Ozs7R0FlVDsyRkFHVSxTQUFTO2tCQXBCckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7R0FlVDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxXQUFXLEVBQUUsQ0FBQztpQkFDbEU7OzBCQWtCSSxRQUFROzswQkFDUixRQUFROzswQkFBSSxRQUFROzRDQWpCTixNQUFNO3NCQUF0QixNQUFNO3VCQUFDLE9BQU87Z0JBQ1ksdUJBQXVCO3NCQUFqRCxLQUFLO3VCQUFDLGtCQUFrQjtnQkFFMEIsV0FBVztzQkFBN0QsU0FBUzt1QkFBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBa0I3QyxNQUFNO3NCQURULEtBQUs7dUJBQUMsV0FBVztnQkFpQmQsVUFBVTtzQkFEYixLQUFLO3VCQUFDLE9BQU87Z0JBZVYsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLE1BQU07Z0JBV1QsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLE1BQU07Z0JBV1QsRUFBRTtzQkFETCxLQUFLO3VCQUFDLElBQUk7Z0JBV1AsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3B0aW9uYWwsIE91dHB1dCwgU2tpcFNlbGYsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlckxpbmtBY3RpdmUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyTG9hZGluZ1N0YXRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nJztcbmltcG9ydCB7IExvYWRpbmdMaXN0ZW5lciB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZy1saXN0ZW5lcic7XG5pbXBvcnQgeyBCdXR0b25Jbkdyb3VwU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9idXR0b24taW4tZ3JvdXAuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1idXR0b24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjYnV0dG9uUHJvamVjdGVkUmVmPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBbY2xhc3NdPVwiY2xhc3NOYW1lc1wiXG4gICAgICAgIChjbGljayk9XCJlbWl0Q2xpY2soKVwiXG4gICAgICAgIFthdHRyLnR5cGVdPVwidHlwZVwiXG4gICAgICAgIFthdHRyLm5hbWVdPVwibmFtZVwiXG4gICAgICAgIFthdHRyLmRpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW2F0dHIucm9sZV09XCJyb2xlXCJcbiAgICAgICAgW2F0dHIuaWRdPVwiaWRcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInNwaW5uZXIgc3Bpbm5lci1pbmxpbmVcIiAqbmdJZj1cImxvYWRpbmdcIj48L3NwYW4+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogQ2xyQnV0dG9uIH1dLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJCdXR0b24gaW1wbGVtZW50cyBMb2FkaW5nTGlzdGVuZXIge1xuICBAT3V0cHV0KCdjbGljaycpIF9jbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuICBASW5wdXQoJ3JvdXRlckxpbmtBY3RpdmUnKSByb3V0ZXJMaW5rQWN0aXZlQ2xhc3Nlczogc3RyaW5nO1xuXG4gIEBWaWV3Q2hpbGQoJ2J1dHRvblByb2plY3RlZFJlZicsIHsgc3RhdGljOiB0cnVlIH0pIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDbHJCdXR0b24+O1xuXG4gIGxvYWRpbmc6IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBfaW5NZW51ID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZVNlcnZpY2UgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2xhc3NOYW1lcyA9ICdidG4nO1xuICBwcml2YXRlIF9uYW1lOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIF90eXBlOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYW55ID0gbnVsbDtcbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyTGlua0FjdGl2ZTogUm91dGVyTGlua0FjdGl2ZSxcbiAgICBAU2tpcFNlbGYoKSBAT3B0aW9uYWwoKSBwdWJsaWMgYnV0dG9uSW5Hcm91cFNlcnZpY2U6IEJ1dHRvbkluR3JvdXBTZXJ2aWNlXG4gICkge31cblxuICBASW5wdXQoJ2NsckluTWVudScpXG4gIGdldCBpbk1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2luTWVudTtcbiAgfVxuICBzZXQgaW5NZW51KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdmFsdWUgPSAhIXZhbHVlO1xuICAgIGlmICh0aGlzLl9pbk1lbnUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9pbk1lbnUgPSB2YWx1ZTtcbiAgICAgIC8vIFdlIGNoZWNrIGlmIHRoZSBzZXJ2aWNlIGZsYWcgaXMgZW5hYmxlZFxuICAgICAgLy8gYW5kIGlmIHRoZSBzZXJ2aWNlIGV4aXN0cyBiZWNhdXNlIHRoZSBzZXJ2aWNlIGlzIG9wdGlvbmFsXG4gICAgICBpZiAodGhpcy5fZW5hYmxlU2VydmljZSAmJiB0aGlzLmJ1dHRvbkluR3JvdXBTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uSW5Hcm91cFNlcnZpY2UudXBkYXRlQnV0dG9uR3JvdXAodGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbGFzcycpXG4gIGdldCBjbGFzc05hbWVzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucm91dGVyTGlua0FjdGl2ZT8uaXNBY3RpdmUgPyBgJHt0aGlzLl9jbGFzc05hbWVzfSAke3RoaXMucm91dGVyTGlua0FjdGl2ZUNsYXNzZXN9YCA6IHRoaXMuX2NsYXNzTmFtZXM7XG4gIH1cbiAgc2V0IGNsYXNzTmFtZXModmFsdWU6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWVzOiBzdHJpbmdbXSA9IHZhbHVlLnNwbGl0KCcgJyk7XG4gICAgICBpZiAoY2xhc3NOYW1lcy5pbmRleE9mKCdidG4nKSA9PT0gLTEpIHtcbiAgICAgICAgY2xhc3NOYW1lcy5wdXNoKCdidG4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NsYXNzTmFtZXMgPSBjbGFzc05hbWVzLmpvaW4oJyAnKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ25hbWUnKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG4gIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgndHlwZScpXG4gIGdldCB0eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cbiAgc2V0IHR5cGUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl90eXBlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdpZCcpXG4gIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9pZCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnZGlzYWJsZWQnKVxuICBnZXQgZGlzYWJsZWQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJvbGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbk1lbnUgPyAnbWVudWl0ZW0nIDogbnVsbDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9lbmFibGVTZXJ2aWNlID0gdHJ1ZTtcbiAgfVxuXG4gIGxvYWRpbmdTdGF0ZUNoYW5nZShzdGF0ZTogQ2xyTG9hZGluZ1N0YXRlKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gc3RhdGUgPT09IENsckxvYWRpbmdTdGF0ZS5MT0FESU5HO1xuICB9XG5cbiAgZW1pdENsaWNrKCk6IHZvaWQge1xuICAgIHRoaXMuX2NsaWNrLmVtaXQodHJ1ZSk7XG4gIH1cbn1cbiJdfQ==