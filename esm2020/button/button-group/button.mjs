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
        <ng-container *ngIf="inMenu; then inMenuTemplate; else defaultTemplate"></ng-container>
      </button>
    </ng-template>
    <ng-template #defaultTemplate>
      <ng-content></ng-content>
    </ng-template>
    <ng-template #inMenuTemplate>
      <span class="dropdown-item-content">
        <ng-container [ngTemplateOutlet]="defaultTemplate"></ng-container>
      </span>
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
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
        <ng-container *ngIf="inMenu; then inMenuTemplate; else defaultTemplate"></ng-container>
      </button>
    </ng-template>
    <ng-template #defaultTemplate>
      <ng-content></ng-content>
    </ng-template>
    <ng-template #inMenuTemplate>
      <span class="dropdown-item-content">
        <ng-container [ngTemplateOutlet]="defaultTemplate"></ng-container>
      </span>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYnV0dG9uL2J1dHRvbi1ncm91cC9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQWUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR25ILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7OztBQStCdkUsTUFBTSxPQUFPLFNBQVM7SUFnQnBCLFlBQytCLGdCQUFrQyxFQUNoQyxvQkFBMEM7UUFENUMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNoQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBakIxRCxXQUFNLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFPbkQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUN2QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixVQUFLLEdBQVcsSUFBSSxDQUFDO1FBQ3JCLFVBQUssR0FBVyxJQUFJLENBQUM7UUFDckIsY0FBUyxHQUFRLElBQUksQ0FBQztRQUN0QixRQUFHLEdBQVcsZUFBZSxFQUFFLENBQUM7SUFLckMsQ0FBQztJQUVKLElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsS0FBYztRQUN2QixLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoQixJQUFJLElBQUksQ0FB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LEVBQUUsQ0FBQywySkF4QnZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCVDsyRkFHVSxTQUFTO2tCQTVCckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCVDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxXQUFXLEVBQUUsQ0FBQztpQkFDbEU7OzBCQWtCSSxRQUFROzswQkFDUixRQUFROzswQkFBSSxRQUFROzRDQWpCTixNQUFNO3NCQUF0QixNQUFNO3VCQUFDLE9BQU87Z0JBQ1ksdUJBQXVCO3NCQUFqRCxLQUFLO3VCQUFDLGtCQUFrQjtnQkFFMEIsV0FBVztzQkFBN0QsU0FBUzt1QkFBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBa0I3QyxNQUFNO3NCQURULEtBQUs7dUJBQUMsV0FBVztnQkFpQmQsVUFBVTtzQkFEYixLQUFLO3VCQUFDLE9BQU87Z0JBZVYsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLE1BQU07Z0JBV1QsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLE1BQU07Z0JBV1QsRUFBRTtzQkFETCxLQUFLO3VCQUFDLElBQUk7Z0JBV1AsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3B0aW9uYWwsIE91dHB1dCwgU2tpcFNlbGYsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlckxpbmtBY3RpdmUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi8uLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyTG9hZGluZ1N0YXRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nJztcbmltcG9ydCB7IExvYWRpbmdMaXN0ZW5lciB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZy1saXN0ZW5lcic7XG5pbXBvcnQgeyBCdXR0b25Jbkdyb3VwU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9idXR0b24taW4tZ3JvdXAuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1idXR0b24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjYnV0dG9uUHJvamVjdGVkUmVmPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBbY2xhc3NdPVwiY2xhc3NOYW1lc1wiXG4gICAgICAgIChjbGljayk9XCJlbWl0Q2xpY2soKVwiXG4gICAgICAgIFthdHRyLnR5cGVdPVwidHlwZVwiXG4gICAgICAgIFthdHRyLm5hbWVdPVwibmFtZVwiXG4gICAgICAgIFthdHRyLmRpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW2F0dHIucm9sZV09XCJyb2xlXCJcbiAgICAgICAgW2F0dHIuaWRdPVwiaWRcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInNwaW5uZXIgc3Bpbm5lci1pbmxpbmVcIiAqbmdJZj1cImxvYWRpbmdcIj48L3NwYW4+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpbk1lbnU7IHRoZW4gaW5NZW51VGVtcGxhdGU7IGVsc2UgZGVmYXVsdFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNpbk1lbnVUZW1wbGF0ZT5cbiAgICAgIDxzcGFuIGNsYXNzPVwiZHJvcGRvd24taXRlbS1jb250ZW50XCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGVmYXVsdFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICA8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBMb2FkaW5nTGlzdGVuZXIsIHVzZUV4aXN0aW5nOiBDbHJCdXR0b24gfV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckJ1dHRvbiBpbXBsZW1lbnRzIExvYWRpbmdMaXN0ZW5lciB7XG4gIEBPdXRwdXQoJ2NsaWNrJykgX2NsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG4gIEBJbnB1dCgncm91dGVyTGlua0FjdGl2ZScpIHJvdXRlckxpbmtBY3RpdmVDbGFzc2VzOiBzdHJpbmc7XG5cbiAgQFZpZXdDaGlsZCgnYnV0dG9uUHJvamVjdGVkUmVmJywgeyBzdGF0aWM6IHRydWUgfSkgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPENsckJ1dHRvbj47XG5cbiAgbG9hZGluZzogYm9vbGVhbjtcblxuICBwcml2YXRlIF9pbk1lbnUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlU2VydmljZSA9IGZhbHNlO1xuICBwcml2YXRlIF9jbGFzc05hbWVzID0gJ2J0bic7XG4gIHByaXZhdGUgX25hbWU6IHN0cmluZyA9IG51bGw7XG4gIHByaXZhdGUgX3R5cGU6IHN0cmluZyA9IG51bGw7XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBhbnkgPSBudWxsO1xuICBwcml2YXRlIF9pZDogc3RyaW5nID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSByb3V0ZXJMaW5rQWN0aXZlOiBSb3V0ZXJMaW5rQWN0aXZlLFxuICAgIEBTa2lwU2VsZigpIEBPcHRpb25hbCgpIHB1YmxpYyBidXR0b25Jbkdyb3VwU2VydmljZTogQnV0dG9uSW5Hcm91cFNlcnZpY2VcbiAgKSB7fVxuXG4gIEBJbnB1dCgnY2xySW5NZW51JylcbiAgZ2V0IGluTWVudSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5NZW51O1xuICB9XG4gIHNldCBpbk1lbnUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB2YWx1ZSA9ICEhdmFsdWU7XG4gICAgaWYgKHRoaXMuX2luTWVudSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX2luTWVudSA9IHZhbHVlO1xuICAgICAgLy8gV2UgY2hlY2sgaWYgdGhlIHNlcnZpY2UgZmxhZyBpcyBlbmFibGVkXG4gICAgICAvLyBhbmQgaWYgdGhlIHNlcnZpY2UgZXhpc3RzIGJlY2F1c2UgdGhlIHNlcnZpY2UgaXMgb3B0aW9uYWxcbiAgICAgIGlmICh0aGlzLl9lbmFibGVTZXJ2aWNlICYmIHRoaXMuYnV0dG9uSW5Hcm91cFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5idXR0b25Jbkdyb3VwU2VydmljZS51cGRhdGVCdXR0b25Hcm91cCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsYXNzJylcbiAgZ2V0IGNsYXNzTmFtZXMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJMaW5rQWN0aXZlPy5pc0FjdGl2ZSA/IGAke3RoaXMuX2NsYXNzTmFtZXN9ICR7dGhpcy5yb3V0ZXJMaW5rQWN0aXZlQ2xhc3Nlc31gIDogdGhpcy5fY2xhc3NOYW1lcztcbiAgfVxuICBzZXQgY2xhc3NOYW1lcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZXM6IHN0cmluZ1tdID0gdmFsdWUuc3BsaXQoJyAnKTtcbiAgICAgIGlmIChjbGFzc05hbWVzLmluZGV4T2YoJ2J0bicpID09PSAtMSkge1xuICAgICAgICBjbGFzc05hbWVzLnB1c2goJ2J0bicpO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuam9pbignICcpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnbmFtZScpXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCd0eXBlJylcbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuICBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3R5cGUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2lkJylcbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2lkID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBnZXQgcm9sZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluTWVudSA/ICdtZW51aXRlbScgOiBudWxsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2VuYWJsZVNlcnZpY2UgPSB0cnVlO1xuICB9XG5cbiAgbG9hZGluZ1N0YXRlQ2hhbmdlKHN0YXRlOiBDbHJMb2FkaW5nU3RhdGUpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRpbmcgPSBzdGF0ZSA9PT0gQ2xyTG9hZGluZ1N0YXRlLkxPQURJTkc7XG4gIH1cblxuICBlbWl0Q2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy5fY2xpY2suZW1pdCh0cnVlKTtcbiAgfVxufVxuIl19