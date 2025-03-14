/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT } from '@angular/common';
import { Component, ContentChildren, Inject, Input, Optional, } from '@angular/core';
import { fromEvent } from 'rxjs';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';
import { IF_ACTIVE_ID } from '../../utils/conditional/if-active.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrOption } from './option';
import * as i0 from "@angular/core";
import * as i1 from "./providers/option-selection.service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "./providers/combobox-focus-handler.service";
import * as i4 from "../../utils/popover/providers/popover-toggle.service";
import * as i5 from "@angular/common";
import * as i6 from "../../progress/spinner/spinner";
let nbOptionsComponents = 0;
export class ClrOptions {
    constructor(optionSelectionService, id, el, commonStrings, focusHandler, toggleService, parentHost, document) {
        this.optionSelectionService = optionSelectionService;
        this.id = id;
        this.el = el;
        this.commonStrings = commonStrings;
        this.focusHandler = focusHandler;
        this.toggleService = toggleService;
        this.document = document;
        this.loading = false;
        this.subscriptions = [];
        if (!parentHost) {
            throw new Error('clr-options should only be used inside of a clr-combobox');
        }
        if (!this.optionsId) {
            this.optionsId = 'clr-options-' + nbOptionsComponents++;
        }
    }
    get items() {
        return this._items;
    }
    set items(items) {
        this._items = items;
        this.focusHandler.addOptionValues(this._items.map(option => option.optionProxy));
    }
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions() {
        return !this.optionSelectionService.loading && this.items.length === 0;
    }
    get noResultsElementId() {
        return `${this.optionsId}-no-results`;
    }
    ngAfterViewInit() {
        this.focusHandler.listbox = this.el.nativeElement;
        this.subscriptions.push(fromEvent(this.document, 'scroll', { capture: true }).subscribe(event => {
            if (this.toggleService.open &&
                event.target !== this.el.nativeElement &&
                event.target !== this.focusHandler.textInput) {
                this.toggleService.open = false;
            }
        }), this.items.changes.subscribe(items => {
            if (items.length) {
                setTimeout(() => {
                    this.focusHandler.focusFirstActive();
                });
            }
            else {
                this.focusHandler.pseudoFocus.pop();
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    searchText(input) {
        return this.commonStrings.parse(this.commonStrings.keys.comboboxSearching, { INPUT: input });
    }
    loadingStateChange(state) {
        this.loading = state === ClrLoadingState.LOADING;
    }
}
ClrOptions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptions, deps: [{ token: i1.OptionSelectionService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i2.ClrCommonStringsService }, { token: i3.ComboboxFocusHandler }, { token: i4.ClrPopoverToggleService }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ClrOptions.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrOptions, selector: "clr-options", inputs: { optionsId: ["id", "optionsId"] }, host: { properties: { "class.clr-combobox-options": "true", "attr.role": "\"listbox\"", "id": "optionsId" } }, providers: [{ provide: LoadingListener, useExisting: ClrOptions }], queries: [{ propertyName: "items", predicate: ClrOption }], ngImport: i0, template: `
    <div *ngIf="optionSelectionService.loading" class="clr-combobox-options-loading">
      <clr-spinner clrInline>
        {{ commonStrings.keys.loading }}
      </clr-spinner>
      <span class="clr-combobox-options-text">
        {{ searchText(optionSelectionService.currentInput) }}
      </span>
    </div>

    <!-- Rendered if data set is empty -->
    <div *ngIf="emptyOptions" [id]="noResultsElementId" role="option">
      <span class="clr-combobox-options-empty-text">
        {{ commonStrings.keys.comboboxNoResults }}
      </span>
    </div>

    <!--Option Groups and Options will be projected here-->
    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i6.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrOptions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-options',
                    template: `
    <div *ngIf="optionSelectionService.loading" class="clr-combobox-options-loading">
      <clr-spinner clrInline>
        {{ commonStrings.keys.loading }}
      </clr-spinner>
      <span class="clr-combobox-options-text">
        {{ searchText(optionSelectionService.currentInput) }}
      </span>
    </div>

    <!-- Rendered if data set is empty -->
    <div *ngIf="emptyOptions" [id]="noResultsElementId" role="option">
      <span class="clr-combobox-options-empty-text">
        {{ commonStrings.keys.comboboxNoResults }}
      </span>
    </div>

    <!--Option Groups and Options will be projected here-->
    <ng-content></ng-content>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrOptions }],
                    host: {
                        '[class.clr-combobox-options]': 'true',
                        '[attr.role]': '"listbox"',
                        '[id]': 'optionsId',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.OptionSelectionService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.ElementRef }, { type: i2.ClrCommonStringsService }, { type: i3.ComboboxFocusHandler }, { type: i4.ClrPopoverToggleService }, { type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { optionsId: [{
                type: Input,
                args: ['id']
            }], items: [{
                type: ContentChildren,
                args: [ClrOption]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbWJvYm94L29wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUVMLFNBQVMsRUFDVCxlQUFlLEVBRWYsTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEdBRVQsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFL0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDckYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRXpFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFdkUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7QUFJckMsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7QUErQjVCLE1BQU0sT0FBTyxVQUFVO0lBUXJCLFlBQ1Msc0JBQWlELEVBQzNCLEVBQVUsRUFDL0IsRUFBMkIsRUFDNUIsYUFBc0MsRUFDckMsWUFBcUMsRUFDckMsYUFBc0MsRUFHOUMsVUFBbUMsRUFDVCxRQUFhO1FBVGhDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBMkI7UUFDM0IsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUMvQixPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDckMsaUJBQVksR0FBWixZQUFZLENBQXlCO1FBQ3JDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUlwQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FB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T0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsZ0RBb0NqRCxTQUFTLDZCQXhEaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQlQ7MkZBUVUsVUFBVTtrQkE3QnRCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CVDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxZQUFZLEVBQUUsQ0FBQztvQkFDbEUsSUFBSSxFQUFFO3dCQUNKLDhCQUE4QixFQUFFLE1BQU07d0JBQ3RDLGFBQWEsRUFBRSxXQUFXO3dCQUMxQixNQUFNLEVBQUUsV0FBVztxQkFDcEI7aUJBQ0Y7OzBCQVdJLE1BQU07MkJBQUMsWUFBWTs7MEJBS25CLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsbUJBQW1COzswQkFFMUIsTUFBTTsyQkFBQyxRQUFROzRDQWpCTCxTQUFTO3NCQUFyQixLQUFLO3VCQUFDLElBQUk7Z0JBNkJQLEtBQUs7c0JBRFIsZUFBZTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFBPUE9WRVJfSE9TVF9BTkNIT1IgfSBmcm9tICcuLi8uLi9wb3BvdmVyL2NvbW1vbi9wb3BvdmVyLWhvc3QtYW5jaG9yLnRva2VuJztcbmltcG9ydCB7IElGX0FDVElWRV9JRCB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWFjdGl2ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckxvYWRpbmdTdGF0ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZyc7XG5pbXBvcnQgeyBMb2FkaW5nTGlzdGVuZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2FkaW5nL2xvYWRpbmctbGlzdGVuZXInO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IENsck9wdGlvbiB9IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7IENvbWJvYm94Rm9jdXNIYW5kbGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvY29tYm9ib3gtZm9jdXMtaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IE9wdGlvblNlbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9vcHRpb24tc2VsZWN0aW9uLnNlcnZpY2UnO1xuXG5sZXQgbmJPcHRpb25zQ29tcG9uZW50cyA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1vcHRpb25zJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwib3B0aW9uU2VsZWN0aW9uU2VydmljZS5sb2FkaW5nXCIgY2xhc3M9XCJjbHItY29tYm9ib3gtb3B0aW9ucy1sb2FkaW5nXCI+XG4gICAgICA8Y2xyLXNwaW5uZXIgY2xySW5saW5lPlxuICAgICAgICB7eyBjb21tb25TdHJpbmdzLmtleXMubG9hZGluZyB9fVxuICAgICAgPC9jbHItc3Bpbm5lcj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLWNvbWJvYm94LW9wdGlvbnMtdGV4dFwiPlxuICAgICAgICB7eyBzZWFyY2hUZXh0KG9wdGlvblNlbGVjdGlvblNlcnZpY2UuY3VycmVudElucHV0KSB9fVxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBSZW5kZXJlZCBpZiBkYXRhIHNldCBpcyBlbXB0eSAtLT5cbiAgICA8ZGl2ICpuZ0lmPVwiZW1wdHlPcHRpb25zXCIgW2lkXT1cIm5vUmVzdWx0c0VsZW1lbnRJZFwiIHJvbGU9XCJvcHRpb25cIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLWNvbWJvYm94LW9wdGlvbnMtZW1wdHktdGV4dFwiPlxuICAgICAgICB7eyBjb21tb25TdHJpbmdzLmtleXMuY29tYm9ib3hOb1Jlc3VsdHMgfX1cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS1PcHRpb24gR3JvdXBzIGFuZCBPcHRpb25zIHdpbGwgYmUgcHJvamVjdGVkIGhlcmUtLT5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogQ2xyT3B0aW9ucyB9XSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWNvbWJvYm94LW9wdGlvbnNdJzogJ3RydWUnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdcImxpc3Rib3hcIicsXG4gICAgJ1tpZF0nOiAnb3B0aW9uc0lkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyT3B0aW9uczxUPiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIExvYWRpbmdMaXN0ZW5lciwgT25EZXN0cm95IHtcbiAgQElucHV0KCdpZCcpIG9wdGlvbnNJZDogc3RyaW5nO1xuXG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgX2l0ZW1zOiBRdWVyeUxpc3Q8Q2xyT3B0aW9uPFQ+PjtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG9wdGlvblNlbGVjdGlvblNlcnZpY2U6IE9wdGlvblNlbGVjdGlvblNlcnZpY2U8VD4sXG4gICAgQEluamVjdChJRl9BQ1RJVkVfSUQpIHB1YmxpYyBpZDogbnVtYmVyLFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGZvY3VzSGFuZGxlcjogQ29tYm9ib3hGb2N1c0hhbmRsZXI8VD4sXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUE9QT1ZFUl9IT1NUX0FOQ0hPUilcbiAgICBwYXJlbnRIb3N0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBhbnlcbiAgKSB7XG4gICAgaWYgKCFwYXJlbnRIb3N0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nsci1vcHRpb25zIHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGEgY2xyLWNvbWJvYm94Jyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnNJZCkge1xuICAgICAgdGhpcy5vcHRpb25zSWQgPSAnY2xyLW9wdGlvbnMtJyArIG5iT3B0aW9uc0NvbXBvbmVudHMrKztcbiAgICB9XG4gIH1cblxuICBAQ29udGVudENoaWxkcmVuKENsck9wdGlvbilcbiAgZ2V0IGl0ZW1zKCk6IFF1ZXJ5TGlzdDxDbHJPcHRpb248VD4+IHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gIH1cbiAgc2V0IGl0ZW1zKGl0ZW1zOiBRdWVyeUxpc3Q8Q2xyT3B0aW9uPFQ+Pikge1xuICAgIHRoaXMuX2l0ZW1zID0gaXRlbXM7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIuYWRkT3B0aW9uVmFsdWVzKHRoaXMuX2l0ZW1zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9wdGlvblByb3h5KSk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgdGhlIGxpc3Qgb2Ygb3B0aW9ucyBpcyBlbXB0eSwgbWVhbmluZyBpdCBkb2Vzbid0IGNvbnRhaW4gYW55IGl0ZW1zXG4gICAqL1xuICBnZXQgZW1wdHlPcHRpb25zKCkge1xuICAgIHJldHVybiAhdGhpcy5vcHRpb25TZWxlY3Rpb25TZXJ2aWNlLmxvYWRpbmcgJiYgdGhpcy5pdGVtcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICBnZXQgbm9SZXN1bHRzRWxlbWVudElkKCkge1xuICAgIHJldHVybiBgJHt0aGlzLm9wdGlvbnNJZH0tbm8tcmVzdWx0c2A7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5mb2N1c0hhbmRsZXIubGlzdGJveCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQsICdzY3JvbGwnLCB7IGNhcHR1cmU6IHRydWUgfSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuICYmXG4gICAgICAgICAgKGV2ZW50IGFzIEV2ZW50KS50YXJnZXQgIT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgIChldmVudCBhcyBFdmVudCkudGFyZ2V0ICE9PSB0aGlzLmZvY3VzSGFuZGxlci50ZXh0SW5wdXRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLml0ZW1zLmNoYW5nZXMuc3Vic2NyaWJlKGl0ZW1zID0+IHtcbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb2N1c0hhbmRsZXIuZm9jdXNGaXJzdEFjdGl2ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZm9jdXNIYW5kbGVyLnBzZXVkb0ZvY3VzLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgc2VhcmNoVGV4dChpbnB1dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jb21ib2JveFNlYXJjaGluZywgeyBJTlBVVDogaW5wdXQgfSk7XG4gIH1cblxuICBsb2FkaW5nU3RhdGVDaGFuZ2Uoc3RhdGU6IENsckxvYWRpbmdTdGF0ZSk6IHZvaWQge1xuICAgIHRoaXMubG9hZGluZyA9IHN0YXRlID09PSBDbHJMb2FkaW5nU3RhdGUuTE9BRElORztcbiAgfVxufVxuIl19