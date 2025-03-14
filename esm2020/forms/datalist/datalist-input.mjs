/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Optional, Self, } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDatalistContainer } from './datalist-container';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/focus.service";
import * as i2 from "@angular/forms";
import * as i3 from "./providers/datalist-id.service";
export class ClrDatalistInput extends WrappedFormControl {
    constructor(focusService, vcr, injector, control, renderer, el, datalistIdService) {
        super(vcr, ClrDatalistContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.datalistIdService = datalistIdService;
        if (!focusService) {
            throw new Error('clrDatalist requires being wrapped in <clr-datalist-container>');
        }
    }
    ngAfterContentInit() {
        // Subscriptions is inherited from WrappedFormControl, unsubscribe is handled there
        this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.listValue = id)));
    }
    triggerFocus() {
        if (this.focusService) {
            this.focusService.focused = true;
        }
    }
    triggerValidation() {
        super.triggerValidation();
        if (this.focusService) {
            this.focusService.focused = false;
        }
    }
}
ClrDatalistInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistInput, deps: [{ token: i1.FocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i2.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i3.DatalistIdService }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatalistInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatalistInput, selector: "[clrDatalistInput]", host: { listeners: { "focus": "triggerFocus()", "blur": "triggerValidation()" }, properties: { "class.clr-input": "true", "attr.list": "listValue" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDatalistInput]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[attr.list]': 'listValue',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.FocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i2.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i3.DatalistIdService }]; }, propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWxpc3QtaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRhbGlzdC9kYXRhbGlzdC1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUVaLFFBQVEsRUFFUixJQUFJLEdBRUwsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7O0FBVTVELE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxrQkFBd0M7SUFHNUUsWUFDc0IsWUFBMEIsRUFDOUMsR0FBcUIsRUFDckIsUUFBa0IsRUFHbEIsT0FBa0IsRUFDbEIsUUFBbUIsRUFDbkIsRUFBZ0MsRUFDeEIsaUJBQW9DO1FBRTVDLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFWOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFRdEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUk1QyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztTQUNuRjtJQUNILENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsbUZBQW1GO1FBQ25GLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBR1EsaUJBQWlCO1FBQ3hCLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDbkM7SUFDSCxDQUFDOzs2R0F2Q1UsZ0JBQWdCO2lHQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFQNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixJQUFJLEVBQUU7d0JBQ0osbUJBQW1CLEVBQUUsTUFBTTt3QkFDM0IsYUFBYSxFQUFFLFdBQVc7cUJBQzNCO2lCQUNGOzswQkFLSSxRQUFROzswQkFHUixJQUFJOzswQkFDSixRQUFROzZIQW1CWCxZQUFZO3NCQURYLFlBQVk7dUJBQUMsT0FBTztnQkFRWixpQkFBaUI7c0JBRHpCLFlBQVk7dUJBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTZWxmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyRGF0YWxpc3RDb250YWluZXIgfSBmcm9tICcuL2RhdGFsaXN0LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBEYXRhbGlzdElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGFsaXN0LWlkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyRGF0YWxpc3RJbnB1dF0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItaW5wdXRdJzogJ3RydWUnLFxuICAgICdbYXR0ci5saXN0XSc6ICdsaXN0VmFsdWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhbGlzdElucHV0IGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsckRhdGFsaXN0Q29udGFpbmVyPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBsaXN0VmFsdWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGZvY3VzU2VydmljZTogRm9jdXNTZXJ2aWNlLFxuICAgIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgY29udHJvbDogTmdDb250cm9sLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHJpdmF0ZSBkYXRhbGlzdElkU2VydmljZTogRGF0YWxpc3RJZFNlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJEYXRhbGlzdENvbnRhaW5lciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG5cbiAgICBpZiAoIWZvY3VzU2VydmljZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHJEYXRhbGlzdCByZXF1aXJlcyBiZWluZyB3cmFwcGVkIGluIDxjbHItZGF0YWxpc3QtY29udGFpbmVyPicpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAvLyBTdWJzY3JpcHRpb25zIGlzIGluaGVyaXRlZCBmcm9tIFdyYXBwZWRGb3JtQ29udHJvbCwgdW5zdWJzY3JpYmUgaXMgaGFuZGxlZCB0aGVyZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuZGF0YWxpc3RJZFNlcnZpY2UuaWRDaGFuZ2Uuc3Vic2NyaWJlKGlkID0+ICh0aGlzLmxpc3RWYWx1ZSA9IGlkKSkpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICB0cmlnZ2VyRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuZm9jdXNTZXJ2aWNlKSB7XG4gICAgICB0aGlzLmZvY3VzU2VydmljZS5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgb3ZlcnJpZGUgdHJpZ2dlclZhbGlkYXRpb24oKSB7XG4gICAgc3VwZXIudHJpZ2dlclZhbGlkYXRpb24oKTtcbiAgICBpZiAodGhpcy5mb2N1c1NlcnZpY2UpIHtcbiAgICAgIHRoaXMuZm9jdXNTZXJ2aWNlLmZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==