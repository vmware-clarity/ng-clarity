/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, EventEmitter, HostBinding, Input, Optional, Output, SkipSelf, } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrStackViewLabel } from './stack-view-custom-tags';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "@angular/common";
import * as i3 from "../../icon/icon";
import * as i4 from "../../utils/animations/expandable-animation/expandable-animation";
export class ClrStackBlock {
    /*
     * This would be more efficient with @ContentChildren, with the parent ClrStackBlock
     * querying for children StackBlocks, but this feature is not available when downgrading
     * the component for Angular 1.
     */
    constructor(parent, commonStrings) {
        this.parent = parent;
        this.commonStrings = commonStrings;
        this.expanded = false;
        this.expandable = false;
        this.expandedChange = new EventEmitter(false);
        this.focused = false;
        this.uniqueId = uniqueIdFactory();
        this._changedChildren = 0;
        this._fullyInitialized = false;
        this._changed = false;
        if (parent) {
            parent.addChild();
        }
    }
    set setChangedValue(value) {
        this._changed = value;
        if (this.parent && this._fullyInitialized) {
            if (value) {
                this.parent._changedChildren++;
            }
            else {
                this.parent._changedChildren--;
            }
        }
    }
    get getChangedValue() {
        return this._changed || (this._changedChildren > 0 && !this.expanded);
    }
    get onStackLabelFocus() {
        return this.expandable && !this.expanded && this.focused;
    }
    get labelledById() {
        return this.stackBlockTitle.id;
    }
    get headingLevel() {
        if (this.ariaLevel) {
            return this.ariaLevel + '';
        }
        return this.parent ? '4' : '3';
    }
    get caretDirection() {
        return this.expanded ? 'down' : 'right';
    }
    get role() {
        return this.expandable ? 'button' : null;
    }
    get tabIndex() {
        return this.expandable ? '0' : null;
    }
    get ariaExpanded() {
        if (!this.expandable) {
            return null;
        }
        else {
            return this.expanded ? 'true' : 'false';
        }
    }
    ngOnInit() {
        // in order to access the parent ClrStackBlock's properties,
        // the child ClrStackBlock has to be fully initialized at first.
        this._fullyInitialized = true;
    }
    addChild() {
        this.expandable = true;
    }
    toggleExpand(event) {
        if (eventIsInputEvent(event)) {
            return;
        }
        if (this.expandable) {
            this.expanded = !this.expanded;
            this.expandedChange.emit(this.expanded);
        }
    }
    getStackChildrenId() {
        return this.expanded ? `clr-stack-children-${this.uniqueId}` : null;
    }
    preventDefaultIfNotInputEvent(event) {
        if (eventIsInputEvent(event)) {
            return;
        }
        event.preventDefault();
    }
}
ClrStackBlock.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackBlock, deps: [{ token: ClrStackBlock, optional: true, skipSelf: true }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrStackBlock.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrStackBlock, selector: "clr-stack-block", inputs: { expanded: ["clrSbExpanded", "expanded"], expandable: ["clrSbExpandable", "expandable"], ariaLevel: ["clrStackViewLevel", "ariaLevel"], setChangedValue: ["clrSbNotifyChange", "setChangedValue"] }, outputs: { expandedChange: "clrSbExpandedChange" }, host: { properties: { "class.stack-block": "true", "attr.role": "\"heading\"", "attr.aria-level": "headingLevel", "class.stack-block-expanded": "this.expanded", "class.stack-block-expandable": "this.expandable", "class.stack-block-changed": "this.getChangedValue", "class.on-focus": "this.onStackLabelFocus" } }, queries: [{ propertyName: "stackBlockTitle", first: true, predicate: ClrStackViewLabel, descendants: true }], ngImport: i0, template: `
    <!-- The 'preventDefault' for the space keydown event prevents the page
         from scrolling when a stack block is toggled via the space key. -->
    <div
      class="stack-block-label"
      (click)="toggleExpand($event)"
      (keyup.enter)="toggleExpand($event)"
      (keyup.space)="toggleExpand($event)"
      (keydown.space)="preventDefaultIfNotInputEvent($event)"
      (focus)="focused = true"
      (blur)="focused = false"
      [id]="uniqueId"
      [attr.role]="role"
      [attr.tabindex]="tabIndex"
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="getStackChildrenId()"
    >
      <cds-icon shape="angle" class="stack-block-caret" [attr.direction]="caretDirection"></cds-icon>
      <span class="clr-sr-only" *ngIf="getChangedValue">{{ commonStrings.keys.stackViewChanged }}</span>
      <div class="stack-view-key">
        <!-- This structure changed to fix #3567 and the a11y request was to move away from dl's -->
        <!-- I added the key class to update css targets for the original component style -->
        <ng-content select="clr-stack-label"></ng-content>
      </div>
      <div class="stack-block-content">
        <ng-content></ng-content>
      </div>
    </div>

    <clr-expandable-animation [clrExpandTrigger]="expanded" class="stack-children">
      <div
        [style.height]="expanded ? 'auto' : 0"
        role="region"
        *ngIf="expanded"
        [attr.id]="getStackChildrenId()"
        [attr.aria-labelledby]="labelledById"
      >
        <ng-content select="clr-stack-block"></ng-content>
      </div>
    </clr-expandable-animation>
  `, isInline: true, styles: [":host{display:block}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i4.ClrExpandableAnimation, selector: "clr-expandable-animation", inputs: ["clrExpandTrigger"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackBlock, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stack-block', template: `
    <!-- The 'preventDefault' for the space keydown event prevents the page
         from scrolling when a stack block is toggled via the space key. -->
    <div
      class="stack-block-label"
      (click)="toggleExpand($event)"
      (keyup.enter)="toggleExpand($event)"
      (keyup.space)="toggleExpand($event)"
      (keydown.space)="preventDefaultIfNotInputEvent($event)"
      (focus)="focused = true"
      (blur)="focused = false"
      [id]="uniqueId"
      [attr.role]="role"
      [attr.tabindex]="tabIndex"
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="getStackChildrenId()"
    >
      <cds-icon shape="angle" class="stack-block-caret" [attr.direction]="caretDirection"></cds-icon>
      <span class="clr-sr-only" *ngIf="getChangedValue">{{ commonStrings.keys.stackViewChanged }}</span>
      <div class="stack-view-key">
        <!-- This structure changed to fix #3567 and the a11y request was to move away from dl's -->
        <!-- I added the key class to update css targets for the original component style -->
        <ng-content select="clr-stack-label"></ng-content>
      </div>
      <div class="stack-block-content">
        <ng-content></ng-content>
      </div>
    </div>

    <clr-expandable-animation [clrExpandTrigger]="expanded" class="stack-children">
      <div
        [style.height]="expanded ? 'auto' : 0"
        role="region"
        *ngIf="expanded"
        [attr.id]="getStackChildrenId()"
        [attr.aria-labelledby]="labelledById"
      >
        <ng-content select="clr-stack-block"></ng-content>
      </div>
    </clr-expandable-animation>
  `, host: {
                        '[class.stack-block]': 'true',
                        '[attr.role]': '"heading"',
                        '[attr.aria-level]': 'headingLevel',
                    }, styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: ClrStackBlock, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i1.ClrCommonStringsService }]; }, propDecorators: { expanded: [{
                type: Input,
                args: ['clrSbExpanded']
            }, {
                type: HostBinding,
                args: ['class.stack-block-expanded']
            }], expandable: [{
                type: Input,
                args: ['clrSbExpandable']
            }, {
                type: HostBinding,
                args: ['class.stack-block-expandable']
            }], ariaLevel: [{
                type: Input,
                args: ['clrStackViewLevel']
            }], expandedChange: [{
                type: Output,
                args: ['clrSbExpandedChange']
            }], stackBlockTitle: [{
                type: ContentChild,
                args: [ClrStackViewLabel]
            }], setChangedValue: [{
                type: Input,
                args: ['clrSbNotifyChange']
            }], getChangedValue: [{
                type: HostBinding,
                args: ['class.stack-block-changed']
            }], onStackLabelFocus: [{
                type: HostBinding,
                args: ['class.on-focus']
            }] } });
function eventIsInputEvent(event) {
    const targetElement = event?.target;
    return targetElement?.tagName
        ? ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT', 'OPTION'].includes(targetElement.tagName)
        : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stYmxvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL3N0YWNrLXZpZXcvc3RhY2stYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7OztBQTREN0QsTUFBTSxPQUFPLGFBQWE7SUFvQnhCOzs7O09BSUc7SUFDSCxZQUdVLE1BQXFCLEVBQ3RCLGFBQXNDO1FBRHJDLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDdEIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBNUJvQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2IsZUFBVSxHQUFHLEtBQUssQ0FBQztRQU8zRCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBSWpGLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsYUFBUSxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRXJCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQWF2QixJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRCxJQUNJLGVBQWUsQ0FBQyxLQUFjO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMs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RSxpQkFBaUIsWUFDakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q1QsUUFVSzt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3dCQUM3QixhQUFhLEVBQUUsV0FBVzt3QkFDMUIsbUJBQW1CLEVBQUUsY0FBYztxQkFDcEM7OzBCQTRCRSxRQUFROzswQkFDUixRQUFRO2tGQTFCd0QsUUFBUTtzQkFBMUUsS0FBSzt1QkFBQyxlQUFlOztzQkFBRyxXQUFXO3VCQUFDLDRCQUE0QjtnQkFDTSxVQUFVO3NCQUFoRixLQUFLO3VCQUFDLGlCQUFpQjs7c0JBQUcsV0FBVzt1QkFBQyw4QkFBOEI7Z0JBS3pDLFNBQVM7c0JBQXBDLEtBQUs7dUJBQUMsbUJBQW1CO2dCQUVLLGNBQWM7c0JBQTVDLE1BQU07dUJBQUMscUJBQXFCO2dCQUVJLGVBQWU7c0JBQS9DLFlBQVk7dUJBQUMsaUJBQWlCO2dCQTBCM0IsZUFBZTtzQkFEbEIsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBY3RCLGVBQWU7c0JBRGxCLFdBQVc7dUJBQUMsMkJBQTJCO2dCQU1wQyxpQkFBaUI7c0JBRHBCLFdBQVc7dUJBQUMsZ0JBQWdCOztBQXVFL0IsU0FBUyxpQkFBaUIsQ0FBQyxLQUFhO0lBQ3RDLE1BQU0sYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFxQixDQUFDO0lBRW5ELE9BQU8sYUFBYSxFQUFFLE9BQU87UUFDM0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUMxRixDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ1osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNraXBTZWxmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENsclN0YWNrVmlld0xhYmVsIH0gZnJvbSAnLi9zdGFjay12aWV3LWN1c3RvbS10YWdzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXN0YWNrLWJsb2NrJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8IS0tIFRoZSAncHJldmVudERlZmF1bHQnIGZvciB0aGUgc3BhY2Uga2V5ZG93biBldmVudCBwcmV2ZW50cyB0aGUgcGFnZVxuICAgICAgICAgZnJvbSBzY3JvbGxpbmcgd2hlbiBhIHN0YWNrIGJsb2NrIGlzIHRvZ2dsZWQgdmlhIHRoZSBzcGFjZSBrZXkuIC0tPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic3RhY2stYmxvY2stbGFiZWxcIlxuICAgICAgKGNsaWNrKT1cInRvZ2dsZUV4cGFuZCgkZXZlbnQpXCJcbiAgICAgIChrZXl1cC5lbnRlcik9XCJ0b2dnbGVFeHBhbmQoJGV2ZW50KVwiXG4gICAgICAoa2V5dXAuc3BhY2UpPVwidG9nZ2xlRXhwYW5kKCRldmVudClcIlxuICAgICAgKGtleWRvd24uc3BhY2UpPVwicHJldmVudERlZmF1bHRJZk5vdElucHV0RXZlbnQoJGV2ZW50KVwiXG4gICAgICAoZm9jdXMpPVwiZm9jdXNlZCA9IHRydWVcIlxuICAgICAgKGJsdXIpPVwiZm9jdXNlZCA9IGZhbHNlXCJcbiAgICAgIFtpZF09XCJ1bmlxdWVJZFwiXG4gICAgICBbYXR0ci5yb2xlXT1cInJvbGVcIlxuICAgICAgW2F0dHIudGFiaW5kZXhdPVwidGFiSW5kZXhcIlxuICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJhcmlhRXhwYW5kZWRcIlxuICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJnZXRTdGFja0NoaWxkcmVuSWQoKVwiXG4gICAgPlxuICAgICAgPGNkcy1pY29uIHNoYXBlPVwiYW5nbGVcIiBjbGFzcz1cInN0YWNrLWJsb2NrLWNhcmV0XCIgW2F0dHIuZGlyZWN0aW9uXT1cImNhcmV0RGlyZWN0aW9uXCI+PC9jZHMtaWNvbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIiAqbmdJZj1cImdldENoYW5nZWRWYWx1ZVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5zdGFja1ZpZXdDaGFuZ2VkIH19PC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz1cInN0YWNrLXZpZXcta2V5XCI+XG4gICAgICAgIDwhLS0gVGhpcyBzdHJ1Y3R1cmUgY2hhbmdlZCB0byBmaXggIzM1NjcgYW5kIHRoZSBhMTF5IHJlcXVlc3Qgd2FzIHRvIG1vdmUgYXdheSBmcm9tIGRsJ3MgLS0+XG4gICAgICAgIDwhLS0gSSBhZGRlZCB0aGUga2V5IGNsYXNzIHRvIHVwZGF0ZSBjc3MgdGFyZ2V0cyBmb3IgdGhlIG9yaWdpbmFsIGNvbXBvbmVudCBzdHlsZSAtLT5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLXN0YWNrLWxhYmVsXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic3RhY2stYmxvY2stY29udGVudFwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxjbHItZXhwYW5kYWJsZS1hbmltYXRpb24gW2NsckV4cGFuZFRyaWdnZXJdPVwiZXhwYW5kZWRcIiBjbGFzcz1cInN0YWNrLWNoaWxkcmVuXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIFtzdHlsZS5oZWlnaHRdPVwiZXhwYW5kZWQgPyAnYXV0bycgOiAwXCJcbiAgICAgICAgcm9sZT1cInJlZ2lvblwiXG4gICAgICAgICpuZ0lmPVwiZXhwYW5kZWRcIlxuICAgICAgICBbYXR0ci5pZF09XCJnZXRTdGFja0NoaWxkcmVuSWQoKVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJsYWJlbGxlZEJ5SWRcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItc3RhY2stYmxvY2tcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Nsci1leHBhbmRhYmxlLWFuaW1hdGlvbj5cbiAgYCxcbiAgLy8gQ3VzdG9tIGVsZW1lbnRzIGFyZSBpbmxpbmUgYnkgZGVmYXVsdFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIC8vIE1ha2Ugc3VyZSB0aGUgaG9zdCBoYXMgdGhlIHByb3BlciBjbGFzcyBmb3Igc3R5bGluZyBwdXJwb3Nlc1xuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5zdGFjay1ibG9ja10nOiAndHJ1ZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ1wiaGVhZGluZ1wiJyxcbiAgICAnW2F0dHIuYXJpYS1sZXZlbF0nOiAnaGVhZGluZ0xldmVsJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU3RhY2tCbG9jayBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgnY2xyU2JFeHBhbmRlZCcpIEBIb3N0QmluZGluZygnY2xhc3Muc3RhY2stYmxvY2stZXhwYW5kZWQnKSBleHBhbmRlZCA9IGZhbHNlO1xuICBASW5wdXQoJ2NsclNiRXhwYW5kYWJsZScpIEBIb3N0QmluZGluZygnY2xhc3Muc3RhY2stYmxvY2stZXhwYW5kYWJsZScpIGV4cGFuZGFibGUgPSBmYWxzZTtcblxuICAvKipcbiAgICogRGVwdGggb2YgdGhlIHN0YWNrIHZpZXcgc3RhcnRpbmcgZnJvbSAxIGZvciBmaXJzdCBsZXZlbFxuICAgKi9cbiAgQElucHV0KCdjbHJTdGFja1ZpZXdMZXZlbCcpIGFyaWFMZXZlbDogbnVtYmVyO1xuXG4gIEBPdXRwdXQoJ2NsclNiRXhwYW5kZWRDaGFuZ2UnKSBleHBhbmRlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyU3RhY2tWaWV3TGFiZWwpIHN0YWNrQmxvY2tUaXRsZTogYW55O1xuXG4gIGZvY3VzZWQgPSBmYWxzZTtcbiAgdW5pcXVlSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICBwcml2YXRlIF9jaGFuZ2VkQ2hpbGRyZW4gPSAwO1xuICBwcml2YXRlIF9mdWxseUluaXRpYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2NoYW5nZWQgPSBmYWxzZTtcblxuICAvKlxuICAgKiBUaGlzIHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IHdpdGggQENvbnRlbnRDaGlsZHJlbiwgd2l0aCB0aGUgcGFyZW50IENsclN0YWNrQmxvY2tcbiAgICogcXVlcnlpbmcgZm9yIGNoaWxkcmVuIFN0YWNrQmxvY2tzLCBidXQgdGhpcyBmZWF0dXJlIGlzIG5vdCBhdmFpbGFibGUgd2hlbiBkb3duZ3JhZGluZ1xuICAgKiB0aGUgY29tcG9uZW50IGZvciBBbmd1bGFyIDEuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBAU2tpcFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHJpdmF0ZSBwYXJlbnQ6IENsclN0YWNrQmxvY2ssXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hZGRDaGlsZCgpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyU2JOb3RpZnlDaGFuZ2UnKVxuICBzZXQgc2V0Q2hhbmdlZFZhbHVlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2hhbmdlZCA9IHZhbHVlO1xuXG4gICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMuX2Z1bGx5SW5pdGlhbGl6ZWQpIHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnBhcmVudC5fY2hhbmdlZENoaWxkcmVuKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhcmVudC5fY2hhbmdlZENoaWxkcmVuLS07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zdGFjay1ibG9jay1jaGFuZ2VkJylcbiAgZ2V0IGdldENoYW5nZWRWYWx1ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlZCB8fCAodGhpcy5fY2hhbmdlZENoaWxkcmVuID4gMCAmJiAhdGhpcy5leHBhbmRlZCk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm9uLWZvY3VzJylcbiAgZ2V0IG9uU3RhY2tMYWJlbEZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGUgJiYgIXRoaXMuZXhwYW5kZWQgJiYgdGhpcy5mb2N1c2VkO1xuICB9XG5cbiAgZ2V0IGxhYmVsbGVkQnlJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFja0Jsb2NrVGl0bGUuaWQ7XG4gIH1cblxuICBnZXQgaGVhZGluZ0xldmVsKCkge1xuICAgIGlmICh0aGlzLmFyaWFMZXZlbCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXJpYUxldmVsICsgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gJzQnIDogJzMnO1xuICB9XG5cbiAgZ2V0IGNhcmV0RGlyZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgPyAnZG93bicgOiAncmlnaHQnO1xuICB9XG5cbiAgZ2V0IHJvbGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRhYmxlID8gJ2J1dHRvbicgOiBudWxsO1xuICB9XG5cbiAgZ2V0IHRhYkluZGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kYWJsZSA/ICcwJyA6IG51bGw7XG4gIH1cblxuICBnZXQgYXJpYUV4cGFuZGVkKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmV4cGFuZGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gaW4gb3JkZXIgdG8gYWNjZXNzIHRoZSBwYXJlbnQgQ2xyU3RhY2tCbG9jaydzIHByb3BlcnRpZXMsXG4gICAgLy8gdGhlIGNoaWxkIENsclN0YWNrQmxvY2sgaGFzIHRvIGJlIGZ1bGx5IGluaXRpYWxpemVkIGF0IGZpcnN0LlxuICAgIHRoaXMuX2Z1bGx5SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgYWRkQ2hpbGQoKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbmRhYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIHRvZ2dsZUV4cGFuZChldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50SXNJbnB1dEV2ZW50KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmV4cGFuZGFibGUpIHtcbiAgICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgICAgIHRoaXMuZXhwYW5kZWRDaGFuZ2UuZW1pdCh0aGlzLmV4cGFuZGVkKTtcbiAgICB9XG4gIH1cblxuICBnZXRTdGFja0NoaWxkcmVuSWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgPyBgY2xyLXN0YWNrLWNoaWxkcmVuLSR7dGhpcy51bmlxdWVJZH1gIDogbnVsbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBwcmV2ZW50RGVmYXVsdElmTm90SW5wdXRFdmVudChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoZXZlbnRJc0lucHV0RXZlbnQoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBldmVudElzSW5wdXRFdmVudChldmVudD86IEV2ZW50KSB7XG4gIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBldmVudD8udGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuXG4gIHJldHVybiB0YXJnZXRFbGVtZW50Py50YWdOYW1lXG4gICAgPyBbJ0lOUFVUJywgJ1RFWFRBUkVBJywgJ0JVVFRPTicsICdBJywgJ1NFTEVDVCcsICdPUFRJT04nXS5pbmNsdWRlcyh0YXJnZXRFbGVtZW50LnRhZ05hbWUpXG4gICAgOiBmYWxzZTtcbn1cbiJdfQ==