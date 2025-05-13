/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, ContentChildren, ElementRef, Input, Optional, } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrLabel } from '../common';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrRadio } from './radio';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/layout.service";
import * as i2 from "../common/providers/control-class.service";
import * as i3 from "../common/providers/ng-control.service";
import * as i4 from "../common/if-control-state/if-control-state.service";
import * as i5 from "@angular/common";
import * as i6 from "../common/label";
import * as i7 from "../../icon/icon";
export class ClrRadioContainer extends ClrAbstractContainer {
    constructor(layoutService, controlClassService, ngControlService, ifControlStateService) {
        super(ifControlStateService, layoutService, controlClassService, ngControlService);
        this.layoutService = layoutService;
        this.controlClassService = controlClassService;
        this.ngControlService = ngControlService;
        this.ifControlStateService = ifControlStateService;
        this.inline = false;
        this._generatedId = uniqueIdFactory();
    }
    /*
     * Here we want to support the following cases
     * clrInline - true by presence
     * clrInline="true|false" - unless it is explicitly false, strings are considered true
     * [clrInline]="true|false" - expect a boolean
     */
    get clrInline() {
        return this.inline;
    }
    set clrInline(value) {
        if (typeof value === 'string') {
            this.inline = value === 'false' ? false : true;
        }
        else {
            this.inline = !!value;
        }
    }
    ngAfterContentInit() {
        this.setAriaRoles();
        this.setAriaLabelledBy();
    }
    setAriaRoles() {
        this.role = this.radios.length ? 'radiogroup' : null;
    }
    setAriaLabelledBy() {
        const _id = this.groupLabel?.nativeElement.getAttribute('id');
        if (!_id) {
            this.groupLabel?.nativeElement.setAttribute('id', this._generatedId);
            this.ariaLabelledBy = this.radios.length ? this._generatedId : null;
        }
        else {
            this.ariaLabelledBy = this.radios.length ? _id : null;
        }
    }
}
ClrRadioContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioContainer, deps: [{ token: i1.LayoutService, optional: true }, { token: i2.ControlClassService }, { token: i3.NgControlService }, { token: i4.IfControlStateService }], target: i0.ɵɵFactoryTarget.Component });
ClrRadioContainer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrRadioContainer, selector: "clr-radio-container", inputs: { clrInline: "clrInline" }, host: { properties: { "class.clr-form-control": "true", "class.clr-form-control-disabled": "control?.disabled", "class.clr-row": "addGrid()", "attr.role": "role", "attr.aria-labelledby": "ariaLabelledBy" } }, providers: [NgControlService, IfControlStateService, ControlClassService, ContainerIdService], queries: [{ propertyName: "groupLabel", first: true, predicate: ClrLabel, descendants: true, read: ElementRef, static: true }, { propertyName: "radios", predicate: ClrRadio, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      <div *ngIf="showHelper" class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
      <div *ngIf="showValid || showInvalid" class="clr-subtext-wrapper">
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-radio-container',
                    template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [class.clr-control-inline]="clrInline" [ngClass]="controlClass()">
      <ng-content select="clr-radio-wrapper"></ng-content>
      <div *ngIf="showHelper" class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper"></ng-content>
      </div>
      <div *ngIf="showValid || showInvalid" class="clr-subtext-wrapper">
        <cds-icon
          *ngIf="showInvalid"
          class="clr-validate-icon"
          shape="exclamation-circle"
          status="danger"
          aria-hidden="true"
        ></cds-icon>
        <cds-icon
          *ngIf="showValid"
          class="clr-validate-icon"
          shape="check-circle"
          status="success"
          aria-hidden="true"
        ></cds-icon>
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `,
                    host: {
                        '[class.clr-form-control]': 'true',
                        '[class.clr-form-control-disabled]': 'control?.disabled',
                        '[class.clr-row]': 'addGrid()',
                        '[attr.role]': 'role',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                    },
                    providers: [NgControlService, IfControlStateService, ControlClassService, ContainerIdService],
                }]
        }], ctorParameters: function () { return [{ type: i1.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i2.ControlClassService }, { type: i3.NgControlService }, { type: i4.IfControlStateService }]; }, propDecorators: { radios: [{
                type: ContentChildren,
                args: [ClrRadio, { descendants: true }]
            }], groupLabel: [{
                type: ContentChild,
                args: [ClrLabel, { read: ElementRef, static: true }]
            }], clrInline: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8tY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcmFkaW8vcmFkaW8tY29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUVMLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixLQUFLLEVBQ0wsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7Ozs7OztBQXlDbkMsTUFBTSxPQUFPLGlCQUFrQixTQUFRLG9CQUFvQjtJQVV6RCxZQUNpQyxhQUE0QixFQUN4QyxtQkFBd0MsRUFDeEMsZ0JBQWtDLEVBQ2xDLHFCQUE0QztRQUUvRCxLQUFLLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFMcEQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDeEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFQekQsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGlCQUFZLEdBQUcsZUFBZSxFQUFFLENBQUM7SUFTekMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxLQUF1QjtRQUNuQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ2hEO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRVEsa0JBQWtCO1FBQ3pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8sWUFBWTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN2RCxDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsSUFBSSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ3JFO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUN2RDtJQUNILENBQUM7OzhHQXREVSxpQkFBaUI7a0dBQWpCLGlCQUFpQixtU0FGakIsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQyxrRUFPL0UsUUFBUSwyQkFBVSxVQUFVLHVEQUR6QixRQUFRLHVFQXpDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJUOzJGQVVVLGlCQUFpQjtrQkF2QzdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQlQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDBCQUEwQixFQUFFLE1BQU07d0JBQ2xDLG1DQUFtQyxFQUFFLG1CQUFtQjt3QkFDeEQsaUJBQWlCLEVBQUUsV0FBVzt3QkFDOUIsYUFBYSxFQUFFLE1BQU07d0JBQ3JCLHdCQUF3QixFQUFFLGdCQUFnQjtxQkFDM0M7b0JBQ0QsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLENBQUM7aUJBQzlGOzswQkFZSSxRQUFRO2lKQVB1QyxNQUFNO3NCQUF2RCxlQUFlO3VCQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7Z0JBQ1ksVUFBVTtzQkFBckUsWUFBWTt1QkFBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBcUJ0RCxTQUFTO3NCQURaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENsckxhYmVsIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7IENsckFic3RyYWN0Q29udGFpbmVyIH0gZnJvbSAnLi4vY29tbW9uL2Fic3RyYWN0LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBJZkNvbnRyb2xTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vaWYtY29udHJvbC1zdGF0ZS9pZi1jb250cm9sLXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udGFpbmVySWRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250YWluZXItaWQuc2VydmljZSc7XG5pbXBvcnQgeyBDb250cm9sQ2xhc3NTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3Byb3ZpZGVycy9jb250cm9sLWNsYXNzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5b3V0U2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbGF5b3V0LnNlcnZpY2UnO1xuaW1wb3J0IHsgTmdDb250cm9sU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvbmctY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENsclJhZGlvIH0gZnJvbSAnLi9yYWRpbyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1yYWRpby1jb250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgIDxsYWJlbCAqbmdJZj1cIiFsYWJlbCAmJiBhZGRHcmlkKClcIj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItY29udHJvbC1jb250YWluZXJcIiBbY2xhc3MuY2xyLWNvbnRyb2wtaW5saW5lXT1cImNscklubGluZVwiIFtuZ0NsYXNzXT1cImNvbnRyb2xDbGFzcygpXCI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItcmFkaW8td3JhcHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDxkaXYgKm5nSWY9XCJzaG93SGVscGVyXCIgY2xhc3M9XCJjbHItc3VidGV4dC13cmFwcGVyXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1jb250cm9sLWhlbHBlclwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cInNob3dWYWxpZCB8fCBzaG93SW52YWxpZFwiIGNsYXNzPVwiY2xyLXN1YnRleHQtd3JhcHBlclwiPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNob3dJbnZhbGlkXCJcbiAgICAgICAgICBjbGFzcz1cImNsci12YWxpZGF0ZS1pY29uXCJcbiAgICAgICAgICBzaGFwZT1cImV4Y2xhbWF0aW9uLWNpcmNsZVwiXG4gICAgICAgICAgc3RhdHVzPVwiZGFuZ2VyXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzaG93VmFsaWRcIlxuICAgICAgICAgIGNsYXNzPVwiY2xyLXZhbGlkYXRlLWljb25cIlxuICAgICAgICAgIHNoYXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgICBzdGF0dXM9XCJzdWNjZXNzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWNvbnRyb2wtZXJyb3JcIiAqbmdJZj1cInNob3dJbnZhbGlkXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItY29udHJvbC1zdWNjZXNzXCIgKm5nSWY9XCJzaG93VmFsaWRcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWZvcm0tY29udHJvbF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXSc6ICdjb250cm9sPy5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5jbHItcm93XSc6ICdhZGRHcmlkKCknLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG4gIH0sXG4gIHByb3ZpZGVyczogW05nQ29udHJvbFNlcnZpY2UsIElmQ29udHJvbFN0YXRlU2VydmljZSwgQ29udHJvbENsYXNzU2VydmljZSwgQ29udGFpbmVySWRTZXJ2aWNlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUmFkaW9Db250YWluZXIgZXh0ZW5kcyBDbHJBYnN0cmFjdENvbnRhaW5lciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICByb2xlOiBzdHJpbmc7XG4gIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJSYWRpbywgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSByYWRpb3M6IFF1ZXJ5TGlzdDxDbHJSYWRpbz47XG4gIEBDb250ZW50Q2hpbGQoQ2xyTGFiZWwsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pIGdyb3VwTGFiZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIHByaXZhdGUgaW5saW5lID0gZmFsc2U7XG4gIHByaXZhdGUgX2dlbmVyYXRlZElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIG92ZXJyaWRlIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGNvbnRyb2xDbGFzc1NlcnZpY2U6IENvbnRyb2xDbGFzc1NlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIG5nQ29udHJvbFNlcnZpY2U6IE5nQ29udHJvbFNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIGlmQ29udHJvbFN0YXRlU2VydmljZTogSWZDb250cm9sU3RhdGVTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGlmQ29udHJvbFN0YXRlU2VydmljZSwgbGF5b3V0U2VydmljZSwgY29udHJvbENsYXNzU2VydmljZSwgbmdDb250cm9sU2VydmljZSk7XG4gIH1cblxuICAvKlxuICAgKiBIZXJlIHdlIHdhbnQgdG8gc3VwcG9ydCB0aGUgZm9sbG93aW5nIGNhc2VzXG4gICAqIGNscklubGluZSAtIHRydWUgYnkgcHJlc2VuY2VcbiAgICogY2xySW5saW5lPVwidHJ1ZXxmYWxzZVwiIC0gdW5sZXNzIGl0IGlzIGV4cGxpY2l0bHkgZmFsc2UsIHN0cmluZ3MgYXJlIGNvbnNpZGVyZWQgdHJ1ZVxuICAgKiBbY2xySW5saW5lXT1cInRydWV8ZmFsc2VcIiAtIGV4cGVjdCBhIGJvb2xlYW5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjbHJJbmxpbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5saW5lO1xuICB9XG4gIHNldCBjbHJJbmxpbmUodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5pbmxpbmUgPSB2YWx1ZSA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbmxpbmUgPSAhIXZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldEFyaWFSb2xlcygpO1xuICAgIHRoaXMuc2V0QXJpYUxhYmVsbGVkQnkoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0QXJpYVJvbGVzKCkge1xuICAgIHRoaXMucm9sZSA9IHRoaXMucmFkaW9zLmxlbmd0aCA/ICdyYWRpb2dyb3VwJyA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHNldEFyaWFMYWJlbGxlZEJ5KCkge1xuICAgIGNvbnN0IF9pZCA9IHRoaXMuZ3JvdXBMYWJlbD8ubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgaWYgKCFfaWQpIHtcbiAgICAgIHRoaXMuZ3JvdXBMYWJlbD8ubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5fZ2VuZXJhdGVkSWQpO1xuICAgICAgdGhpcy5hcmlhTGFiZWxsZWRCeSA9IHRoaXMucmFkaW9zLmxlbmd0aCA/IHRoaXMuX2dlbmVyYXRlZElkIDogbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hcmlhTGFiZWxsZWRCeSA9IHRoaXMucmFkaW9zLmxlbmd0aCA/IF9pZCA6IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=