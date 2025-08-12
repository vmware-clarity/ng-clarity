/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { OptionData as OptionProxy } from './providers/combobox-focus-handler.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "./providers/combobox-focus-handler.service";
import * as i3 from "./providers/option-selection.service";
import * as i4 from "@angular/common";
export class ClrOption {
    constructor(elRef, commonStrings, focusHandler, optionSelectionService) {
        this.elRef = elRef;
        this.commonStrings = commonStrings;
        this.focusHandler = focusHandler;
        this.optionSelectionService = optionSelectionService;
        // A proxy with only the necessary data to be used for a11y and the focus handler service.
        this.optionProxy = new OptionProxy(null, null);
        this.optionProxy.el = elRef.nativeElement;
    }
    get optionId() {
        return this._id;
    }
    set optionId(id) {
        this._id = id;
        this.optionProxy.id = this._id;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.optionProxy.value = value;
    }
    get selected() {
        return (this.optionSelectionService.selectionModel && this.optionSelectionService.selectionModel.containsItem(this.value));
    }
    get focusClass() {
        return this.focusHandler.pseudoFocus.containsItem(this.optionProxy);
    }
    ngOnInit() {
        if (!this._id) {
            this._id = 'clr-option-' + uniqueIdFactory();
            this.optionProxy.id = this._id;
        }
    }
    onClick(event) {
        event.stopPropagation();
        if (this.optionSelectionService.multiselectable) {
            this.optionSelectionService.toggle(this.value);
        }
        else {
            this.optionSelectionService.select(this.value);
        }
        // As the popover stays open in multi-select mode now, we have to take focus back to the input
        // This way we achieve two things:
        // - do not lose focus
        // - we're still able to use onBlur for "outside-click" handling
        this.focusHandler.focusInput();
    }
}
ClrOption.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOption, deps: [{ token: i0.ElementRef }, { token: i1.ClrCommonStringsService }, { token: i2.ComboboxFocusHandler }, { token: i3.OptionSelectionService }], target: i0.ɵɵFactoryTarget.Component });
ClrOption.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrOption, selector: "clr-option", inputs: { optionId: ["id", "optionId"], value: ["clrValue", "value"] }, host: { listeners: { "click": "onClick($event)" }, properties: { "class.clr-combobox-option": "true", "attr.role": "\"option\"", "attr.tabindex": "-1", "attr.id": "optionId", "class.active": "this.selected", "class.clr-focus": "this.focusClass" } }, ngImport: i0, template: `
    <ng-content></ng-content>
    <span *ngIf="selected" class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOption, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-option',
                    template: `
    <ng-content></ng-content>
    <span *ngIf="selected" class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
  `,
                    host: {
                        '[class.clr-combobox-option]': 'true',
                        '[attr.role]': '"option"',
                        // Do not remove. Or click-selection will not work.
                        '[attr.tabindex]': '-1',
                        '[attr.id]': 'optionId',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ClrCommonStringsService }, { type: i2.ComboboxFocusHandler }, { type: i3.OptionSelectionService }]; }, propDecorators: { optionId: [{
                type: Input,
                args: ['id']
            }], value: [{
                type: Input,
                args: ['clrValue']
            }], selected: [{
                type: HostBinding,
                args: ['class.active']
            }], focusClass: [{
                type: HostBinding,
                args: ['class.clr-focus']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvb3B0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxXQUFXLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUdoRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUF3QixVQUFVLElBQUksV0FBVyxFQUFFLE1BQU0sNENBQTRDLENBQUM7Ozs7OztBQWdCN0csTUFBTSxPQUFPLFNBQVM7SUFPcEIsWUFDUyxLQUE4QixFQUM5QixhQUFzQyxFQUNyQyxZQUFxQyxFQUNyQyxzQkFBaUQ7UUFIbEQsVUFBSyxHQUFMLEtBQUssQ0FBeUI7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3JDLGlCQUFZLEdBQVosWUFBWSxDQUF5QjtRQUNyQywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQTJCO1FBVjNELDBGQUEwRjtRQUMxRixnQkFBVyxHQUFtQixJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFXeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxFQUFVO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFRO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxDQUNMLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUNsSCxDQUFDO0lBQ0osQ0FBQztJQUVELElBQ0ksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLEdBQUcsZUFBZSxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNoQztJQUNILENBQUM7SUFHRCxPQUFPLENBQUMsS0FBaUI7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsRUFBRTtZQUMvQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoRDthQUFNO1lBQ0wsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDaEQ7UUFDRCw4RkFBOEY7UUFDOUYsa0NBQWtDO1FBQ2xDLHNCQUFzQjtRQUN0QixnRUFBZ0U7UUFDaEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNqQyxDQUFDOztzR0FsRVUsU0FBUzswRkFBVCxTQUFTLG9YQVpWOzs7R0FHVDsyRkFTVSxTQUFTO2tCQWRyQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUU7OztHQUdUO29CQUNELElBQUksRUFBRTt3QkFDSiw2QkFBNkIsRUFBRSxNQUFNO3dCQUNyQyxhQUFhLEVBQUUsVUFBVTt3QkFDekIsbURBQW1EO3dCQUNuRCxpQkFBaUIsRUFBRSxJQUFJO3dCQUN2QixXQUFXLEVBQUUsVUFBVTtxQkFDeEI7aUJBQ0Y7K01Ba0JLLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxJQUFJO2dCQVVQLEtBQUs7c0JBRFIsS0FBSzt1QkFBQyxVQUFVO2dCQVViLFFBQVE7c0JBRFgsV0FBVzt1QkFBQyxjQUFjO2dCQVF2QixVQUFVO3NCQURiLFdBQVc7dUJBQUMsaUJBQWlCO2dCQWE5QixPQUFPO3NCQUROLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbWJvYm94Rm9jdXNIYW5kbGVyLCBPcHRpb25EYXRhIGFzIE9wdGlvblByb3h5IH0gZnJvbSAnLi9wcm92aWRlcnMvY29tYm9ib3gtZm9jdXMtaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IE9wdGlvblNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9vcHRpb24tc2VsZWN0aW9uLnNlcnZpY2UnO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLW9wdGlvbicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWRcIiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmNvbWJvYm94U2VsZWN0ZWQgfX08L3NwYW4+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci1jb21ib2JveC1vcHRpb25dJzogJ3RydWUnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdcIm9wdGlvblwiJyxcbiAgICAvLyBEbyBub3QgcmVtb3ZlLiBPciBjbGljay1zZWxlY3Rpb24gd2lsbCBub3Qgd29yay5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJy0xJyxcbiAgICAnW2F0dHIuaWRdJzogJ29wdGlvbklkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyT3B0aW9uPFQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLy8gQSBwcm94eSB3aXRoIG9ubHkgdGhlIG5lY2Vzc2FyeSBkYXRhIHRvIGJlIHVzZWQgZm9yIGExMXkgYW5kIHRoZSBmb2N1cyBoYW5kbGVyIHNlcnZpY2UuXG4gIG9wdGlvblByb3h5OiBPcHRpb25Qcm94eTxUPiA9IG5ldyBPcHRpb25Qcm94eShudWxsLCBudWxsKTtcblxuICBwcml2YXRlIF9pZDogc3RyaW5nO1xuICBwcml2YXRlIF92YWx1ZTogVDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGZvY3VzSGFuZGxlcjogQ29tYm9ib3hGb2N1c0hhbmRsZXI8VD4sXG4gICAgcHJpdmF0ZSBvcHRpb25TZWxlY3Rpb25TZXJ2aWNlOiBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlPFQ+XG4gICkge1xuICAgIHRoaXMub3B0aW9uUHJveHkuZWwgPSBlbFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgQElucHV0KCdpZCcpXG4gIGdldCBvcHRpb25JZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IG9wdGlvbklkKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMub3B0aW9uUHJveHkuaWQgPSB0aGlzLl9pZDtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmFsdWUnKVxuICBnZXQgdmFsdWUoKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZSh2YWx1ZTogVCkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5vcHRpb25Qcm94eS52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hY3RpdmUnKVxuICBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uU2VydmljZS5zZWxlY3Rpb25Nb2RlbCAmJiB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0aW9uTW9kZWwuY29udGFpbnNJdGVtKHRoaXMudmFsdWUpXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuY2xyLWZvY3VzJylcbiAgZ2V0IGZvY3VzQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNIYW5kbGVyLnBzZXVkb0ZvY3VzLmNvbnRhaW5zSXRlbSh0aGlzLm9wdGlvblByb3h5KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5faWQpIHtcbiAgICAgIHRoaXMuX2lkID0gJ2Nsci1vcHRpb24tJyArIHVuaXF1ZUlkRmFjdG9yeSgpO1xuICAgICAgdGhpcy5vcHRpb25Qcm94eS5pZCA9IHRoaXMuX2lkO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UubXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2UudG9nZ2xlKHRoaXMudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvblNlcnZpY2Uuc2VsZWN0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICAvLyBBcyB0aGUgcG9wb3ZlciBzdGF5cyBvcGVuIGluIG11bHRpLXNlbGVjdCBtb2RlIG5vdywgd2UgaGF2ZSB0byB0YWtlIGZvY3VzIGJhY2sgdG8gdGhlIGlucHV0XG4gICAgLy8gVGhpcyB3YXkgd2UgYWNoaWV2ZSB0d28gdGhpbmdzOlxuICAgIC8vIC0gZG8gbm90IGxvc2UgZm9jdXNcbiAgICAvLyAtIHdlJ3JlIHN0aWxsIGFibGUgdG8gdXNlIG9uQmx1ciBmb3IgXCJvdXRzaWRlLWNsaWNrXCIgaGFuZGxpbmdcbiAgICB0aGlzLmZvY3VzSGFuZGxlci5mb2N1c0lucHV0KCk7XG4gIH1cbn1cbiJdfQ==