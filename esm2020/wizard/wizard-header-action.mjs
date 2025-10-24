/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
let wizardHeaderActionIndex = 0;
export class ClrWizardHeaderAction {
    constructor() {
        // title is explanatory text added to the header action
        this.title = '';
        // If our host has an ID attribute, we use this instead of our index.
        this._id = (wizardHeaderActionIndex++).toString();
        this.disabled = false;
        this.headerActionClicked = new EventEmitter(false);
    }
    get id() {
        return `clr-wizard-header-action-${this._id}`;
    }
    click() {
        if (this.disabled) {
            return;
        }
        // passing the header action id allows users to have one method that
        // routes to many different actions based on the type of header action
        // clicked. this is further aided by users being able to specify ids
        // for their header actions.
        this.headerActionClicked.emit(this._id);
    }
}
ClrWizardHeaderAction.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardHeaderAction, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrWizardHeaderAction.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardHeaderAction, selector: "clr-wizard-header-action", inputs: { title: "title", _id: ["id", "_id"], disabled: ["clrWizardHeaderActionDisabled", "disabled"] }, outputs: { headerActionClicked: "actionClicked" }, host: { classAttribute: "clr-wizard-header-action-wrapper" }, ngImport: i0, template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardHeaderAction, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-header-action',
                    template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `,
                    host: { class: 'clr-wizard-header-action-wrapper' },
                }]
        }], propDecorators: { title: [{
                type: Input,
                args: ['title']
            }], _id: [{
                type: Input,
                args: ['id']
            }], disabled: [{
                type: Input,
                args: ['clrWizardHeaderActionDisabled']
            }], headerActionClicked: [{
                type: Output,
                args: ['actionClicked']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLWhlYWRlci1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy93aXphcmQvd2l6YXJkLWhlYWRlci1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUV2RSxJQUFJLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQWtCaEMsTUFBTSxPQUFPLHFCQUFxQjtJQWhCbEM7UUFpQkUsdURBQXVEO1FBQ3ZDLFVBQUssR0FBRyxFQUFFLENBQUM7UUFFM0IscUVBQXFFO1FBQ3hELFFBQUcsR0FBVyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUxQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWhDLHdCQUFtQixHQUFHLElBQUksWUFBWSxDQUFTLEtBQUssQ0FBQyxDQUFDO0tBaUJoRjtJQWZDLElBQUksRUFBRTtRQUNKLE9BQU8sNEJBQTRCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFFRCxvRUFBb0U7UUFDcEUsc0VBQXNFO1FBQ3RFLG9FQUFvRTtRQUNwRSw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7a0hBekJVLHFCQUFxQjtzR0FBckIscUJBQXFCLDBSQWR0Qjs7Ozs7Ozs7Ozs7R0FXVDsyRkFHVSxxQkFBcUI7a0JBaEJqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwwQkFBMEI7b0JBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDtvQkFDRCxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsa0NBQWtDLEVBQUU7aUJBQ3BEOzhCQUdpQixLQUFLO3NCQUFwQixLQUFLO3VCQUFDLE9BQU87Z0JBR0QsR0FBRztzQkFBZixLQUFLO3VCQUFDLElBQUk7Z0JBRTZCLFFBQVE7c0JBQS9DLEtBQUs7dUJBQUMsK0JBQStCO2dCQUViLG1CQUFtQjtzQkFBM0MsTUFBTTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5sZXQgd2l6YXJkSGVhZGVyQWN0aW9uSW5kZXggPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItd2l6YXJkLWhlYWRlci1hY3Rpb24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3M9XCJidG4gY2xyLXdpemFyZC1oZWFkZXItYWN0aW9uIGJ0bi1saW5rXCJcbiAgICAgIFtpZF09XCJpZFwiXG4gICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgKGNsaWNrKT1cImNsaWNrKClcIlxuICAgICAgW3RpdGxlXT1cInRpdGxlXCJcbiAgICA+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9idXR0b24+XG4gIGAsXG4gIGhvc3Q6IHsgY2xhc3M6ICdjbHItd2l6YXJkLWhlYWRlci1hY3Rpb24td3JhcHBlcicgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyV2l6YXJkSGVhZGVyQWN0aW9uIHtcbiAgLy8gdGl0bGUgaXMgZXhwbGFuYXRvcnkgdGV4dCBhZGRlZCB0byB0aGUgaGVhZGVyIGFjdGlvblxuICBASW5wdXQoJ3RpdGxlJykgdGl0bGUgPSAnJztcblxuICAvLyBJZiBvdXIgaG9zdCBoYXMgYW4gSUQgYXR0cmlidXRlLCB3ZSB1c2UgdGhpcyBpbnN0ZWFkIG9mIG91ciBpbmRleC5cbiAgQElucHV0KCdpZCcpIF9pZDogc3RyaW5nID0gKHdpemFyZEhlYWRlckFjdGlvbkluZGV4KyspLnRvU3RyaW5nKCk7XG5cbiAgQElucHV0KCdjbHJXaXphcmRIZWFkZXJBY3Rpb25EaXNhYmxlZCcpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgQE91dHB1dCgnYWN0aW9uQ2xpY2tlZCcpIGhlYWRlckFjdGlvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oZmFsc2UpO1xuXG4gIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgY2xyLXdpemFyZC1oZWFkZXItYWN0aW9uLSR7dGhpcy5faWR9YDtcbiAgfVxuXG4gIGNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcGFzc2luZyB0aGUgaGVhZGVyIGFjdGlvbiBpZCBhbGxvd3MgdXNlcnMgdG8gaGF2ZSBvbmUgbWV0aG9kIHRoYXRcbiAgICAvLyByb3V0ZXMgdG8gbWFueSBkaWZmZXJlbnQgYWN0aW9ucyBiYXNlZCBvbiB0aGUgdHlwZSBvZiBoZWFkZXIgYWN0aW9uXG4gICAgLy8gY2xpY2tlZC4gdGhpcyBpcyBmdXJ0aGVyIGFpZGVkIGJ5IHVzZXJzIGJlaW5nIGFibGUgdG8gc3BlY2lmeSBpZHNcbiAgICAvLyBmb3IgdGhlaXIgaGVhZGVyIGFjdGlvbnMuXG4gICAgdGhpcy5oZWFkZXJBY3Rpb25DbGlja2VkLmVtaXQodGhpcy5faWQpO1xuICB9XG59XG4iXX0=