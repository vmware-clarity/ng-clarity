/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, ElementRef, HostBinding, Inject, Input, ViewChild, ViewContainerRef, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { IfActiveService } from '../../utils/conditional/if-active.service';
import { ClrKeyFocus } from '../../utils/focus/key-focus/key-focus';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { TabsLayout } from './enums/tabs-layout.enum';
import { TabsService } from './providers/tabs.service';
import { ClrTab } from './tab';
import { ClrTabAction } from './tab-action.directive';
import { ClrTabOverflowContent } from './tab-overflow-content';
import { TABS_ID, TABS_ID_PROVIDER } from './tabs-id.provider';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/conditional/if-active.service";
import * as i2 from "../../utils/popover/providers/popover-toggle.service";
import * as i3 from "./providers/tabs.service";
import * as i4 from "../../utils/i18n/common-strings.service";
import * as i5 from "../../utils/popover/popover-host.directive";
import * as i6 from "@angular/common";
import * as i7 from "../../icon/icon";
import * as i8 from "../../utils/focus/key-focus/key-focus";
import * as i9 from "./tab-overflow-content";
export class ClrTabs {
    constructor(ifActiveService, toggleService, tabsService, tabsId, commonStrings) {
        this.ifActiveService = ifActiveService;
        this.toggleService = toggleService;
        this.tabsService = tabsService;
        this.tabsId = tabsId;
        this.commonStrings = commonStrings;
        this.tabLinkElements = [];
        // in order to check focus is triggered by click
        // we are using this _mousedown flag
        this._mousedown = false;
        this.subscriptions = [];
        this._tabLinkDirectives = [];
    }
    get layout() {
        return this.tabsService.layout;
    }
    set layout(layout) {
        if (Object.keys(TabsLayout)
            .map(key => {
            return TabsLayout[key];
        })
            .indexOf(layout) >= 0) {
            this.tabsService.layout = layout;
        }
    }
    get tabLinkDirectives() {
        return this._tabLinkDirectives;
    }
    get activeTabInOverflow() {
        return this.tabsService.overflowTabs.indexOf(this.tabsService.activeTab) > -1;
    }
    get activeTabPosition() {
        return this._tabLinkDirectives.findIndex(link => link.active);
    }
    get isCurrentInOverflow() {
        return this.keyFocus.current >= this.overflowPosition;
    }
    get isVertical() {
        return this.layout === TabsLayout.VERTICAL;
    }
    set tabOverflowEl(value) {
        this._tabOverflowEl = value && value.nativeElement;
        if (this.toggleService.open && value) {
            // only when tab overflow view element is registered,
            // we need to move the focus to the first item
            this.keyFocus.focusCurrent();
        }
    }
    get overflowPosition() {
        return this._tabLinkDirectives.filter(link => !link.inOverflow).length;
    }
    set tabContentViewContainer(value) {
        this.tabsService.tabContentViewContainer = value;
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.listenForTabLinkChanges());
        this.subscriptions.push(this.listedForTabsActionsChanges());
        if (typeof this.ifActiveService.current === 'undefined' && this.tabLinkDirectives[0]) {
            this.tabLinkDirectives[0].activate();
        }
        // set initial current position
        this.keyFocus.current = this.activeTabPosition;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
    toggleOverflowOnPosition(position) {
        // we need to check current position to determine
        // whether we need to open the tab overflow or not
        this.toggleService.open = position >= this.overflowPosition;
    }
    resetKeyFocusCurrentToActive(event) {
        const keyFocusContainsFocus = this.keyFocus.nativeElement.contains(event.relatedTarget);
        if (!keyFocusContainsFocus && this.keyFocus.current !== this.activeTabPosition) {
            this.keyFocus.current = this.activeTabPosition;
        }
    }
    toggleOverflowOnClick() {
        if (this.isCurrentInOverflow && this.toggleService.open) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
        else {
            this.keyFocus.moveTo(this.overflowPosition);
        }
        // once click handler completes running,
        // reset the _mousedown flag
        this._mousedown = false;
    }
    openOverflowOnFocus() {
        // This method should be called only on keyboard generated focus
        // when the active tab is in the overflow
        if (!this._mousedown && !this.toggleService.open) {
            this.keyFocus.moveTo(this.activeTabPosition);
        }
    }
    closeOnFocusOut(event) {
        if (!this._tabOverflowEl.contains(event.relatedTarget) &&
            this.toggleService.open &&
            !this._mousedown) {
            this.toggleService.open = false;
            // if the focus is out of overflow and lands on the active tab link
            // which is currently visible, set the key focus current to activeTabPosition
            if (this.tabLinkElements[this.activeTabPosition] === event.relatedTarget) {
                this.keyFocus.current = this.activeTabPosition;
            }
        }
    }
    closeOnEscapeKey() {
        // Move current to the last visible focusable item
        this.keyFocus.moveTo(this.overflowPosition - 1);
    }
    closeOnOutsideClick(event, tabOverflowTrigger) {
        // Exit early if the event target is the trigger element itself or element that's inside the trigger element.
        // This is because we have another handler on the tabOverflowTrigger element itself.
        // As this handler method is on the document level so the event bubbles up to it and conflicts
        // with the tabOverflowTrigger handler resulting in opening the tab overflow and closing it right away consecutively.
        const isTabsAction = this.tabsActions.some(action => action.nativeElement.contains(event.target));
        if (event.target === tabOverflowTrigger ||
            tabOverflowTrigger.contains(event.target) ||
            isTabsAction) {
            return;
        }
        // Move current to the last visible focusable item
        if (!this._tabOverflowEl.contains(event.target) && this.isCurrentInOverflow) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
    }
    setTabLinkElements() {
        this._tabLinkDirectives = this.tabs.map(tab => tab.tabLink);
        this.tabLinkElements = this._tabLinkDirectives.map(tab => tab.el.nativeElement);
        if (this.tabsActions && this.tabsActions) {
            this.tabLinkElements.push(...this.tabsActions.map(action => action.nativeElement));
        }
    }
    listenForTabLinkChanges() {
        return this.tabs.changes
            .pipe(startWith(this.tabs.map(tab => tab.tabLink)))
            .subscribe(() => this.setTabLinkElements());
    }
    listedForTabsActionsChanges() {
        return this.tabsActions.changes.subscribe(() => this.setTabLinkElements());
    }
}
ClrTabs.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabs, deps: [{ token: i1.IfActiveService }, { token: i2.ClrPopoverToggleService }, { token: i3.TabsService }, { token: TABS_ID }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrTabs.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTabs, selector: "clr-tabs", inputs: { layout: ["clrLayout", "layout"] }, host: { properties: { "class.tabs-vertical": "this.isVertical" } }, providers: [IfActiveService, TabsService, TABS_ID_PROVIDER], queries: [{ propertyName: "tabsActions", predicate: ClrTabAction, descendants: true, read: ElementRef }, { propertyName: "tabs", predicate: ClrTab }], viewQueries: [{ propertyName: "keyFocus", first: true, predicate: ClrKeyFocus, descendants: true, static: true }, { propertyName: "tabOverflowEl", first: true, predicate: ClrTabOverflowContent, descendants: true, read: ElementRef }, { propertyName: "tabContentViewContainer", first: true, predicate: ["tabContentViewContainer"], descendants: true, read: ViewContainerRef, static: true }], hostDirectives: [{ directive: i5.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      <ng-container *ngFor="let link of tabLinkDirectives">
        <ng-container *ngIf="link.tabsId === tabsId && !link.inOverflow">
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="tabsService.overflowTabs.length > 0">
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="toggleService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !toggleService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="toggleService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [attr.status]="toggleService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          <clr-tab-overflow-content
            *ngIf="toggleService.open"
            (document:keydown.escape)="closeOnEscapeKey()"
            (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
            (focusout)="closeOnFocusOut($event)"
          >
            <ng-container *ngFor="let link of tabLinkDirectives">
              <ng-container
                *ngIf="link.tabsId === tabsId && link.inOverflow"
                [ngTemplateOutlet]="link.templateRefContainer.template"
              ></ng-container>
            </ng-container>
          </clr-tab-overflow-content>
        </div>
      </ng-container>
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i8.ClrKeyFocus, selector: "[clrKeyFocus]", inputs: ["clrDirection", "clrFocusOnLoad", "clrKeyFocus"], outputs: ["clrFocusChange"] }, { kind: "component", type: i9.ClrTabOverflowContent, selector: "clr-tab-overflow-content" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabs, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs',
                    template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      <ng-container *ngFor="let link of tabLinkDirectives">
        <ng-container *ngIf="link.tabsId === tabsId && !link.inOverflow">
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="tabsService.overflowTabs.length > 0">
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="toggleService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !toggleService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="toggleService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [attr.status]="toggleService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          <clr-tab-overflow-content
            *ngIf="toggleService.open"
            (document:keydown.escape)="closeOnEscapeKey()"
            (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
            (focusout)="closeOnFocusOut($event)"
          >
            <ng-container *ngFor="let link of tabLinkDirectives">
              <ng-container
                *ngIf="link.tabsId === tabsId && link.inOverflow"
                [ngTemplateOutlet]="link.templateRefContainer.template"
              ></ng-container>
            </ng-container>
          </clr-tab-overflow-content>
        </div>
      </ng-container>
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `,
                    providers: [IfActiveService, TabsService, TABS_ID_PROVIDER],
                    hostDirectives: [ClrPopoverHostDirective],
                }]
        }], ctorParameters: function () { return [{ type: i1.IfActiveService }, { type: i2.ClrPopoverToggleService }, { type: i3.TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }, { type: i4.ClrCommonStringsService }]; }, propDecorators: { keyFocus: [{
                type: ViewChild,
                args: [ClrKeyFocus, { static: true }]
            }], tabsActions: [{
                type: ContentChildren,
                args: [ClrTabAction, { read: ElementRef, descendants: true }]
            }], tabs: [{
                type: ContentChildren,
                args: [ClrTab]
            }], layout: [{
                type: Input,
                args: ['clrLayout']
            }], isVertical: [{
                type: HostBinding,
                args: ['class.tabs-vertical']
            }], tabOverflowEl: [{
                type: ViewChild,
                args: [ClrTabOverflowContent, { read: ElementRef }]
            }], tabContentViewContainer: [{
                type: ViewChild,
                args: ['tabContentViewContainer', { static: true, read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2xheW91dC90YWJzL3RhYnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBR0wsU0FBUyxFQUNULGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUVwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUVyRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXRELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFtRS9ELE1BQU0sT0FBTyxPQUFPO0lBZ0JsQixZQUNTLGVBQWdDLEVBQ2hDLGFBQXNDLEVBQ3RDLFdBQXdCLEVBQ1AsTUFBYyxFQUMvQixhQUFzQztRQUp0QyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ1AsV0FBTSxH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QWUxQyx1QkFBdUI7c0JBRGxDLFNBQVM7dUJBQUMseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJZkFjdGl2ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1hY3RpdmUuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJLZXlGb2N1cyB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy9rZXktZm9jdXMnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3BvcG92ZXItaG9zdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3Byb3ZpZGVycy9wb3BvdmVyLXRvZ2dsZS5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYnNMYXlvdXQgfSBmcm9tICcuL2VudW1zL3RhYnMtbGF5b3V0LmVudW0nO1xuaW1wb3J0IHsgVGFic1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90YWJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyVGFiIH0gZnJvbSAnLi90YWInO1xuaW1wb3J0IHsgQ2xyVGFiQWN0aW9uIH0gZnJvbSAnLi90YWItYWN0aW9uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDbHJUYWJMaW5rIH0gZnJvbSAnLi90YWItbGluay5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyVGFiT3ZlcmZsb3dDb250ZW50IH0gZnJvbSAnLi90YWItb3ZlcmZsb3ctY29udGVudCc7XG5pbXBvcnQgeyBUQUJTX0lELCBUQUJTX0lEX1BST1ZJREVSIH0gZnJvbSAnLi90YWJzLWlkLnByb3ZpZGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXRhYnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bFxuICAgICAgY2xhc3M9XCJuYXZcIlxuICAgICAgcm9sZT1cInRhYmxpc3RcIlxuICAgICAgW2NscktleUZvY3VzXT1cInRhYkxpbmtFbGVtZW50c1wiXG4gICAgICBjbHJEaXJlY3Rpb249XCJib3RoXCJcbiAgICAgIChjbHJGb2N1c0NoYW5nZSk9XCJ0b2dnbGVPdmVyZmxvd09uUG9zaXRpb24oJGV2ZW50KVwiXG4gICAgICAoZm9jdXNvdXQpPVwicmVzZXRLZXlGb2N1c0N1cnJlbnRUb0FjdGl2ZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8IS0tdGFiIGxpbmtzLS0+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBsaW5rIG9mIHRhYkxpbmtEaXJlY3RpdmVzXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsaW5rLnRhYnNJZCA9PT0gdGFic0lkICYmICFsaW5rLmluT3ZlcmZsb3dcIj5cbiAgICAgICAgICA8bGkgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzPVwibmF2LWl0ZW1cIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGluay50ZW1wbGF0ZVJlZkNvbnRhaW5lci50ZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidGFic1NlcnZpY2Uub3ZlcmZsb3dUYWJzLmxlbmd0aCA+IDBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRhYnMtb3ZlcmZsb3cgYm90dG9tLXJpZ2h0XCIgcm9sZT1cInByZXNlbnRhdGlvblwiIFtjbGFzcy5vcGVuXT1cInRvZ2dsZVNlcnZpY2Uub3BlblwiPlxuICAgICAgICAgIDxsaSByb2xlPVwiYXBwbGljYXRpb25cIiBjbGFzcz1cIm5hdi1pdGVtXCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICN0YWJPdmVyZmxvd1RyaWdnZXJcbiAgICAgICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWxpbmsgbmF2LWxpbmsgZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImFjdGl2ZVRhYkluT3ZlcmZsb3cgJiYgIXRvZ2dsZVNlcnZpY2Uub3BlbiA/IDAgOiAtMVwiXG4gICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiYWN0aXZlVGFiSW5PdmVyZmxvd1wiXG4gICAgICAgICAgICAgIFtjbGFzcy5vcGVuXT1cInRvZ2dsZVNlcnZpY2Uub3BlblwiXG4gICAgICAgICAgICAgIChtb3VzZWRvd24pPVwiX21vdXNlZG93biA9IHRydWVcIlxuICAgICAgICAgICAgICAoZm9jdXMpPVwib3Blbk92ZXJmbG93T25Gb2N1cygpXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZU92ZXJmbG93T25DbGljaygpXCJcbiAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLm1vcmVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAgICAgICBzaGFwZT1cImVsbGlwc2lzLWhvcml6b250YWxcIlxuICAgICAgICAgICAgICAgIFthdHRyLnN0YXR1c109XCJ0b2dnbGVTZXJ2aWNlLm9wZW4gPyAnaW5mbycgOiBudWxsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMubW9yZVwiXG4gICAgICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICA8IS0tdGFiIGxpbmtzIGluIG92ZXJmbG93IG1lbnUtLT5cbiAgICAgICAgICA8Y2xyLXRhYi1vdmVyZmxvdy1jb250ZW50XG4gICAgICAgICAgICAqbmdJZj1cInRvZ2dsZVNlcnZpY2Uub3BlblwiXG4gICAgICAgICAgICAoZG9jdW1lbnQ6a2V5ZG93bi5lc2NhcGUpPVwiY2xvc2VPbkVzY2FwZUtleSgpXCJcbiAgICAgICAgICAgIChkb2N1bWVudDpjbGljayk9XCJjbG9zZU9uT3V0c2lkZUNsaWNrKCRldmVudCwgdGFiT3ZlcmZsb3dUcmlnZ2VyKVwiXG4gICAgICAgICAgICAoZm9jdXNvdXQpPVwiY2xvc2VPbkZvY3VzT3V0KCRldmVudClcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGxpbmsgb2YgdGFiTGlua0RpcmVjdGl2ZXNcIj5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICpuZ0lmPVwibGluay50YWJzSWQgPT09IHRhYnNJZCAmJiBsaW5rLmluT3ZlcmZsb3dcIlxuICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpbmsudGVtcGxhdGVSZWZDb250YWluZXIudGVtcGxhdGVcIlxuICAgICAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L2Nsci10YWItb3ZlcmZsb3ctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci10YWJzLWFjdGlvbnNcIj48L25nLWNvbnRlbnQ+XG4gICAgPC91bD5cbiAgICA8bmctY29udGFpbmVyICN0YWJDb250ZW50Vmlld0NvbnRhaW5lcj48L25nLWNvbnRhaW5lcj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbSWZBY3RpdmVTZXJ2aWNlLCBUYWJzU2VydmljZSwgVEFCU19JRF9QUk9WSURFUl0sXG4gIGhvc3REaXJlY3RpdmVzOiBbQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUYWJzIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgdGFiTGlua0VsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gW107XG5cbiAgLy8gaW4gb3JkZXIgdG8gY2hlY2sgZm9jdXMgaXMgdHJpZ2dlcmVkIGJ5IGNsaWNrXG4gIC8vIHdlIGFyZSB1c2luZyB0aGlzIF9tb3VzZWRvd24gZmxhZ1xuICBfbW91c2Vkb3duID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZChDbHJLZXlGb2N1cywgeyBzdGF0aWM6IHRydWUgfSkga2V5Rm9jdXM6IENscktleUZvY3VzO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyVGFiQWN0aW9uLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIGRlc2NlbmRhbnRzOiB0cnVlIH0pIHRhYnNBY3Rpb25zOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyVGFiKSBwcml2YXRlIHRhYnM6IFF1ZXJ5TGlzdDxDbHJUYWI+O1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBfdGFiT3ZlcmZsb3dFbDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX3RhYkxpbmtEaXJlY3RpdmVzOiBDbHJUYWJMaW5rW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgaWZBY3RpdmVTZXJ2aWNlOiBJZkFjdGl2ZVNlcnZpY2UsXG4gICAgcHVibGljIHRvZ2dsZVNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlLFxuICAgIHB1YmxpYyB0YWJzU2VydmljZTogVGFic1NlcnZpY2UsXG4gICAgQEluamVjdChUQUJTX0lEKSBwdWJsaWMgdGFic0lkOiBudW1iZXIsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge31cblxuICBASW5wdXQoJ2NsckxheW91dCcpXG4gIGdldCBsYXlvdXQoKTogVGFic0xheW91dCB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudGFic1NlcnZpY2UubGF5b3V0O1xuICB9XG4gIHNldCBsYXlvdXQobGF5b3V0OiBUYWJzTGF5b3V0IHwgc3RyaW5nKSB7XG4gICAgaWYgKFxuICAgICAgT2JqZWN0LmtleXMoVGFic0xheW91dClcbiAgICAgICAgLm1hcChrZXkgPT4ge1xuICAgICAgICAgIHJldHVybiAoVGFic0xheW91dCBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtrZXldO1xuICAgICAgICB9KVxuICAgICAgICAuaW5kZXhPZihsYXlvdXQpID49IDBcbiAgICApIHtcbiAgICAgIHRoaXMudGFic1NlcnZpY2UubGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cbiAgfVxuXG4gIGdldCB0YWJMaW5rRGlyZWN0aXZlcygpOiBDbHJUYWJMaW5rW10ge1xuICAgIHJldHVybiB0aGlzLl90YWJMaW5rRGlyZWN0aXZlcztcbiAgfVxuXG4gIGdldCBhY3RpdmVUYWJJbk92ZXJmbG93KCkge1xuICAgIHJldHVybiB0aGlzLnRhYnNTZXJ2aWNlLm92ZXJmbG93VGFicy5pbmRleE9mKHRoaXMudGFic1NlcnZpY2UuYWN0aXZlVGFiKSA+IC0xO1xuICB9XG5cbiAgZ2V0IGFjdGl2ZVRhYlBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90YWJMaW5rRGlyZWN0aXZlcy5maW5kSW5kZXgobGluayA9PiBsaW5rLmFjdGl2ZSk7XG4gIH1cblxuICBnZXQgaXNDdXJyZW50SW5PdmVyZmxvdygpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlGb2N1cy5jdXJyZW50ID49IHRoaXMub3ZlcmZsb3dQb3NpdGlvbjtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MudGFicy12ZXJ0aWNhbCcpXG4gIGdldCBpc1ZlcnRpY2FsKCkge1xuICAgIHJldHVybiB0aGlzLmxheW91dCA9PT0gVGFic0xheW91dC5WRVJUSUNBTDtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoQ2xyVGFiT3ZlcmZsb3dDb250ZW50LCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgc2V0IHRhYk92ZXJmbG93RWwodmFsdWU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5fdGFiT3ZlcmZsb3dFbCA9IHZhbHVlICYmIHZhbHVlLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKHRoaXMudG9nZ2xlU2VydmljZS5vcGVuICYmIHZhbHVlKSB7XG4gICAgICAvLyBvbmx5IHdoZW4gdGFiIG92ZXJmbG93IHZpZXcgZWxlbWVudCBpcyByZWdpc3RlcmVkLFxuICAgICAgLy8gd2UgbmVlZCB0byBtb3ZlIHRoZSBmb2N1cyB0byB0aGUgZmlyc3QgaXRlbVxuICAgICAgdGhpcy5rZXlGb2N1cy5mb2N1c0N1cnJlbnQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBvdmVyZmxvd1Bvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90YWJMaW5rRGlyZWN0aXZlcy5maWx0ZXIobGluayA9PiAhbGluay5pbk92ZXJmbG93KS5sZW5ndGg7XG4gIH1cblxuICBAVmlld0NoaWxkKCd0YWJDb250ZW50Vmlld0NvbnRhaW5lcicsIHsgc3RhdGljOiB0cnVlLCByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pXG4gIHByaXZhdGUgc2V0IHRhYkNvbnRlbnRWaWV3Q29udGFpbmVyKHZhbHVlOiBWaWV3Q29udGFpbmVyUmVmKSB7XG4gICAgdGhpcy50YWJzU2VydmljZS50YWJDb250ZW50Vmlld0NvbnRhaW5lciA9IHZhbHVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yVGFiTGlua0NoYW5nZXMoKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy5saXN0ZWRGb3JUYWJzQWN0aW9uc0NoYW5nZXMoKSk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaWZBY3RpdmVTZXJ2aWNlLmN1cnJlbnQgPT09ICd1bmRlZmluZWQnICYmIHRoaXMudGFiTGlua0RpcmVjdGl2ZXNbMF0pIHtcbiAgICAgIHRoaXMudGFiTGlua0RpcmVjdGl2ZXNbMF0uYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgaW5pdGlhbCBjdXJyZW50IHBvc2l0aW9uXG4gICAgdGhpcy5rZXlGb2N1cy5jdXJyZW50ID0gdGhpcy5hY3RpdmVUYWJQb3NpdGlvbjtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiB7XG4gICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZU92ZXJmbG93T25Qb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgLy8gd2UgbmVlZCB0byBjaGVjayBjdXJyZW50IHBvc2l0aW9uIHRvIGRldGVybWluZVxuICAgIC8vIHdoZXRoZXIgd2UgbmVlZCB0byBvcGVuIHRoZSB0YWIgb3ZlcmZsb3cgb3Igbm90XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSBwb3NpdGlvbiA+PSB0aGlzLm92ZXJmbG93UG9zaXRpb247XG4gIH1cblxuICByZXNldEtleUZvY3VzQ3VycmVudFRvQWN0aXZlKGV2ZW50OiBGb2N1c0V2ZW50KSB7XG4gICAgY29uc3Qga2V5Rm9jdXNDb250YWluc0ZvY3VzID0gdGhpcy5rZXlGb2N1cy5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnJlbGF0ZWRUYXJnZXQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIGlmICgha2V5Rm9jdXNDb250YWluc0ZvY3VzICYmIHRoaXMua2V5Rm9jdXMuY3VycmVudCAhPT0gdGhpcy5hY3RpdmVUYWJQb3NpdGlvbikge1xuICAgICAgdGhpcy5rZXlGb2N1cy5jdXJyZW50ID0gdGhpcy5hY3RpdmVUYWJQb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVPdmVyZmxvd09uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuaXNDdXJyZW50SW5PdmVyZmxvdyAmJiB0aGlzLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgdGhpcy5rZXlGb2N1cy5tb3ZlVG8odGhpcy5vdmVyZmxvd1Bvc2l0aW9uIC0gMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMua2V5Rm9jdXMubW92ZVRvKHRoaXMub3ZlcmZsb3dQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gb25jZSBjbGljayBoYW5kbGVyIGNvbXBsZXRlcyBydW5uaW5nLFxuICAgIC8vIHJlc2V0IHRoZSBfbW91c2Vkb3duIGZsYWdcbiAgICB0aGlzLl9tb3VzZWRvd24gPSBmYWxzZTtcbiAgfVxuXG4gIG9wZW5PdmVyZmxvd09uRm9jdXMoKSB7XG4gICAgLy8gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uIGtleWJvYXJkIGdlbmVyYXRlZCBmb2N1c1xuICAgIC8vIHdoZW4gdGhlIGFjdGl2ZSB0YWIgaXMgaW4gdGhlIG92ZXJmbG93XG4gICAgaWYgKCF0aGlzLl9tb3VzZWRvd24gJiYgIXRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSB7XG4gICAgICB0aGlzLmtleUZvY3VzLm1vdmVUbyh0aGlzLmFjdGl2ZVRhYlBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZU9uRm9jdXNPdXQoZXZlbnQ6IEZvY3VzRXZlbnQpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5fdGFiT3ZlcmZsb3dFbC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50KSAmJlxuICAgICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gJiZcbiAgICAgICF0aGlzLl9tb3VzZWRvd25cbiAgICApIHtcbiAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2U7XG5cbiAgICAgIC8vIGlmIHRoZSBmb2N1cyBpcyBvdXQgb2Ygb3ZlcmZsb3cgYW5kIGxhbmRzIG9uIHRoZSBhY3RpdmUgdGFiIGxpbmtcbiAgICAgIC8vIHdoaWNoIGlzIGN1cnJlbnRseSB2aXNpYmxlLCBzZXQgdGhlIGtleSBmb2N1cyBjdXJyZW50IHRvIGFjdGl2ZVRhYlBvc2l0aW9uXG4gICAgICBpZiAodGhpcy50YWJMaW5rRWxlbWVudHNbdGhpcy5hY3RpdmVUYWJQb3NpdGlvbl0gPT09IGV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5rZXlGb2N1cy5jdXJyZW50ID0gdGhpcy5hY3RpdmVUYWJQb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9zZU9uRXNjYXBlS2V5KCkge1xuICAgIC8vIE1vdmUgY3VycmVudCB0byB0aGUgbGFzdCB2aXNpYmxlIGZvY3VzYWJsZSBpdGVtXG4gICAgdGhpcy5rZXlGb2N1cy5tb3ZlVG8odGhpcy5vdmVyZmxvd1Bvc2l0aW9uIC0gMSk7XG4gIH1cblxuICBjbG9zZU9uT3V0c2lkZUNsaWNrKGV2ZW50OiBFdmVudCwgdGFiT3ZlcmZsb3dUcmlnZ2VyOiBIVE1MRWxlbWVudCkge1xuICAgIC8vIEV4aXQgZWFybHkgaWYgdGhlIGV2ZW50IHRhcmdldCBpcyB0aGUgdHJpZ2dlciBlbGVtZW50IGl0c2VsZiBvciBlbGVtZW50IHRoYXQncyBpbnNpZGUgdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAgICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2UgaGF2ZSBhbm90aGVyIGhhbmRsZXIgb24gdGhlIHRhYk92ZXJmbG93VHJpZ2dlciBlbGVtZW50IGl0c2VsZi5cbiAgICAvLyBBcyB0aGlzIGhhbmRsZXIgbWV0aG9kIGlzIG9uIHRoZSBkb2N1bWVudCBsZXZlbCBzbyB0aGUgZXZlbnQgYnViYmxlcyB1cCB0byBpdCBhbmQgY29uZmxpY3RzXG4gICAgLy8gd2l0aCB0aGUgdGFiT3ZlcmZsb3dUcmlnZ2VyIGhhbmRsZXIgcmVzdWx0aW5nIGluIG9wZW5pbmcgdGhlIHRhYiBvdmVyZmxvdyBhbmQgY2xvc2luZyBpdCByaWdodCBhd2F5IGNvbnNlY3V0aXZlbHkuXG4gICAgY29uc3QgaXNUYWJzQWN0aW9uID0gdGhpcy50YWJzQWN0aW9ucy5zb21lKGFjdGlvbiA9PlxuICAgICAgKGFjdGlvbi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpXG4gICAgKTtcbiAgICBpZiAoXG4gICAgICBldmVudC50YXJnZXQgPT09IHRhYk92ZXJmbG93VHJpZ2dlciB8fFxuICAgICAgdGFiT3ZlcmZsb3dUcmlnZ2VyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkgfHxcbiAgICAgIGlzVGFic0FjdGlvblxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1vdmUgY3VycmVudCB0byB0aGUgbGFzdCB2aXNpYmxlIGZvY3VzYWJsZSBpdGVtXG4gICAgaWYgKCF0aGlzLl90YWJPdmVyZmxvd0VsLmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkgJiYgdGhpcy5pc0N1cnJlbnRJbk92ZXJmbG93KSB7XG4gICAgICB0aGlzLmtleUZvY3VzLm1vdmVUbyh0aGlzLm92ZXJmbG93UG9zaXRpb24gLSAxKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFRhYkxpbmtFbGVtZW50cygpIHtcbiAgICB0aGlzLl90YWJMaW5rRGlyZWN0aXZlcyA9IHRoaXMudGFicy5tYXAodGFiID0+IHRhYi50YWJMaW5rKTtcbiAgICB0aGlzLnRhYkxpbmtFbGVtZW50cyA9IHRoaXMuX3RhYkxpbmtEaXJlY3RpdmVzLm1hcCh0YWIgPT4gdGFiLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmICh0aGlzLnRhYnNBY3Rpb25zICYmIHRoaXMudGFic0FjdGlvbnMpIHtcbiAgICAgIHRoaXMudGFiTGlua0VsZW1lbnRzLnB1c2goLi4udGhpcy50YWJzQWN0aW9ucy5tYXAoYWN0aW9uID0+IGFjdGlvbi5uYXRpdmVFbGVtZW50KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JUYWJMaW5rQ2hhbmdlcygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLnRhYnMubWFwKHRhYiA9PiB0YWIudGFiTGluaykpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNldFRhYkxpbmtFbGVtZW50cygpKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVkRm9yVGFic0FjdGlvbnNDaGFuZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYnNBY3Rpb25zLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuc2V0VGFiTGlua0VsZW1lbnRzKCkpO1xuICB9XG59XG4iXX0=