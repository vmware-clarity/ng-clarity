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
        if (this.tabsActions) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2xheW91dC90YWJzL3RhYnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsV0FBVyxFQUNYLE1BQU0sRUFDTixLQUFLLEVBR0wsU0FBUyxFQUNULGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUVwRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUVyRixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXRELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFtRS9ELE1BQU0sT0FBTyxPQUFPO0lBZ0JsQixZQUNTLGVBQWdDLEVBQ2hDLGFBQXNDLEVBQ3RDLFdBQXdCLEVBQ1AsTUFBYyxFQUMvQixhQUFzQztRQUp0QyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ1AsV0FBTSxH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QUFTO3VCQUFDLHlCQUF5QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSWZBY3RpdmVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvaWYtYWN0aXZlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyS2V5Rm9jdXMgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMva2V5LWZvY3VzJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBUYWJzTGF5b3V0IH0gZnJvbSAnLi9lbnVtcy90YWJzLWxheW91dC5lbnVtJztcbmltcG9ydCB7IFRhYnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdGFicy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclRhYiB9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7IENsclRhYkFjdGlvbiB9IGZyb20gJy4vdGFiLWFjdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyVGFiTGluayB9IGZyb20gJy4vdGFiLWxpbmsuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclRhYk92ZXJmbG93Q29udGVudCB9IGZyb20gJy4vdGFiLW92ZXJmbG93LWNvbnRlbnQnO1xuaW1wb3J0IHsgVEFCU19JRCwgVEFCU19JRF9QUk9WSURFUiB9IGZyb20gJy4vdGFicy1pZC5wcm92aWRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10YWJzJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWxcbiAgICAgIGNsYXNzPVwibmF2XCJcbiAgICAgIHJvbGU9XCJ0YWJsaXN0XCJcbiAgICAgIFtjbHJLZXlGb2N1c109XCJ0YWJMaW5rRWxlbWVudHNcIlxuICAgICAgY2xyRGlyZWN0aW9uPVwiYm90aFwiXG4gICAgICAoY2xyRm9jdXNDaGFuZ2UpPVwidG9nZ2xlT3ZlcmZsb3dPblBvc2l0aW9uKCRldmVudClcIlxuICAgICAgKGZvY3Vzb3V0KT1cInJlc2V0S2V5Rm9jdXNDdXJyZW50VG9BY3RpdmUoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPCEtLXRhYiBsaW5rcy0tPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbGluayBvZiB0YWJMaW5rRGlyZWN0aXZlc1wiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibGluay50YWJzSWQgPT09IHRhYnNJZCAmJiAhbGluay5pbk92ZXJmbG93XCI+XG4gICAgICAgICAgPGxpIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzcz1cIm5hdi1pdGVtXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxpbmsudGVtcGxhdGVSZWZDb250YWluZXIudGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRhYnNTZXJ2aWNlLm92ZXJmbG93VGFicy5sZW5ndGggPiAwXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJzLW92ZXJmbG93IGJvdHRvbS1yaWdodFwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBbY2xhc3Mub3Blbl09XCJ0b2dnbGVTZXJ2aWNlLm9wZW5cIj5cbiAgICAgICAgICA8bGkgcm9sZT1cImFwcGxpY2F0aW9uXCIgY2xhc3M9XCJuYXYtaXRlbVwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAjdGFiT3ZlcmZsb3dUcmlnZ2VyXG4gICAgICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1saW5rIG5hdi1saW5rIGRyb3Bkb3duLXRvZ2dsZVwiXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJhY3RpdmVUYWJJbk92ZXJmbG93ICYmICF0b2dnbGVTZXJ2aWNlLm9wZW4gPyAwIDogLTFcIlxuICAgICAgICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImFjdGl2ZVRhYkluT3ZlcmZsb3dcIlxuICAgICAgICAgICAgICBbY2xhc3Mub3Blbl09XCJ0b2dnbGVTZXJ2aWNlLm9wZW5cIlxuICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIl9tb3VzZWRvd24gPSB0cnVlXCJcbiAgICAgICAgICAgICAgKGZvY3VzKT1cIm9wZW5PdmVyZmxvd09uRm9jdXMoKVwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVPdmVyZmxvd09uQ2xpY2soKVwiXG4gICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5tb3JlXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgICAgICAgc2hhcGU9XCJlbGxpcHNpcy1ob3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5zdGF0dXNdPVwidG9nZ2xlU2VydmljZS5vcGVuID8gJ2luZm8nIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLm1vcmVcIlxuICAgICAgICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPCEtLXRhYiBsaW5rcyBpbiBvdmVyZmxvdyBtZW51LS0+XG4gICAgICAgICAgPGNsci10YWItb3ZlcmZsb3ctY29udGVudFxuICAgICAgICAgICAgKm5nSWY9XCJ0b2dnbGVTZXJ2aWNlLm9wZW5cIlxuICAgICAgICAgICAgKGRvY3VtZW50OmtleWRvd24uZXNjYXBlKT1cImNsb3NlT25Fc2NhcGVLZXkoKVwiXG4gICAgICAgICAgICAoZG9jdW1lbnQ6Y2xpY2spPVwiY2xvc2VPbk91dHNpZGVDbGljaygkZXZlbnQsIHRhYk92ZXJmbG93VHJpZ2dlcilcIlxuICAgICAgICAgICAgKGZvY3Vzb3V0KT1cImNsb3NlT25Gb2N1c091dCgkZXZlbnQpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBsaW5rIG9mIHRhYkxpbmtEaXJlY3RpdmVzXCI+XG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAqbmdJZj1cImxpbmsudGFic0lkID09PSB0YWJzSWQgJiYgbGluay5pbk92ZXJmbG93XCJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJsaW5rLnRlbXBsYXRlUmVmQ29udGFpbmVyLnRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPC9jbHItdGFiLW92ZXJmbG93LWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItdGFicy1hY3Rpb25zXCI+PC9uZy1jb250ZW50PlxuICAgIDwvdWw+XG4gICAgPG5nLWNvbnRhaW5lciAjdGFiQ29udGVudFZpZXdDb250YWluZXI+PC9uZy1jb250YWluZXI+XG4gIGAsXG4gIHByb3ZpZGVyczogW0lmQWN0aXZlU2VydmljZSwgVGFic1NlcnZpY2UsIFRBQlNfSURfUFJPVklERVJdLFxuICBob3N0RGlyZWN0aXZlczogW0NsclBvcG92ZXJIb3N0RGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVGFicyBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHRhYkxpbmtFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IFtdO1xuXG4gIC8vIGluIG9yZGVyIHRvIGNoZWNrIGZvY3VzIGlzIHRyaWdnZXJlZCBieSBjbGlja1xuICAvLyB3ZSBhcmUgdXNpbmcgdGhpcyBfbW91c2Vkb3duIGZsYWdcbiAgX21vdXNlZG93biA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoQ2xyS2V5Rm9jdXMsIHsgc3RhdGljOiB0cnVlIH0pIGtleUZvY3VzOiBDbHJLZXlGb2N1cztcblxuICBAQ29udGVudENoaWxkcmVuKENsclRhYkFjdGlvbiwgeyByZWFkOiBFbGVtZW50UmVmLCBkZXNjZW5kYW50czogdHJ1ZSB9KSB0YWJzQWN0aW9uczogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAQ29udGVudENoaWxkcmVuKENsclRhYikgcHJpdmF0ZSB0YWJzOiBRdWVyeUxpc3Q8Q2xyVGFiPjtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX3RhYk92ZXJmbG93RWw6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIF90YWJMaW5rRGlyZWN0aXZlczogQ2xyVGFiTGlua1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlmQWN0aXZlU2VydmljZTogSWZBY3RpdmVTZXJ2aWNlLFxuICAgIHB1YmxpYyB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwdWJsaWMgdGFic1NlcnZpY2U6IFRhYnNTZXJ2aWNlLFxuICAgIEBJbmplY3QoVEFCU19JRCkgcHVibGljIHRhYnNJZDogbnVtYmVyLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHt9XG5cbiAgQElucHV0KCdjbHJMYXlvdXQnKVxuICBnZXQgbGF5b3V0KCk6IFRhYnNMYXlvdXQgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRhYnNTZXJ2aWNlLmxheW91dDtcbiAgfVxuICBzZXQgbGF5b3V0KGxheW91dDogVGFic0xheW91dCB8IHN0cmluZykge1xuICAgIGlmIChcbiAgICAgIE9iamVjdC5rZXlzKFRhYnNMYXlvdXQpXG4gICAgICAgIC5tYXAoa2V5ID0+IHtcbiAgICAgICAgICByZXR1cm4gKFRhYnNMYXlvdXQgYXMgUmVjb3JkPHN0cmluZywgYW55Pilba2V5XTtcbiAgICAgICAgfSlcbiAgICAgICAgLmluZGV4T2YobGF5b3V0KSA+PSAwXG4gICAgKSB7XG4gICAgICB0aGlzLnRhYnNTZXJ2aWNlLmxheW91dCA9IGxheW91dDtcbiAgICB9XG4gIH1cblxuICBnZXQgdGFiTGlua0RpcmVjdGl2ZXMoKTogQ2xyVGFiTGlua1tdIHtcbiAgICByZXR1cm4gdGhpcy5fdGFiTGlua0RpcmVjdGl2ZXM7XG4gIH1cblxuICBnZXQgYWN0aXZlVGFiSW5PdmVyZmxvdygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJzU2VydmljZS5vdmVyZmxvd1RhYnMuaW5kZXhPZih0aGlzLnRhYnNTZXJ2aWNlLmFjdGl2ZVRhYikgPiAtMTtcbiAgfVxuXG4gIGdldCBhY3RpdmVUYWJQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFiTGlua0RpcmVjdGl2ZXMuZmluZEluZGV4KGxpbmsgPT4gbGluay5hY3RpdmUpO1xuICB9XG5cbiAgZ2V0IGlzQ3VycmVudEluT3ZlcmZsb3coKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5Rm9jdXMuY3VycmVudCA+PSB0aGlzLm92ZXJmbG93UG9zaXRpb247XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnRhYnMtdmVydGljYWwnKVxuICBnZXQgaXNWZXJ0aWNhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5sYXlvdXQgPT09IFRhYnNMYXlvdXQuVkVSVElDQUw7XG4gIH1cblxuICBAVmlld0NoaWxkKENsclRhYk92ZXJmbG93Q29udGVudCwgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gIHNldCB0YWJPdmVyZmxvd0VsKHZhbHVlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuX3RhYk92ZXJmbG93RWwgPSB2YWx1ZSAmJiB2YWx1ZS5uYXRpdmVFbGVtZW50O1xuICAgIGlmICh0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiAmJiB2YWx1ZSkge1xuICAgICAgLy8gb25seSB3aGVuIHRhYiBvdmVyZmxvdyB2aWV3IGVsZW1lbnQgaXMgcmVnaXN0ZXJlZCxcbiAgICAgIC8vIHdlIG5lZWQgdG8gbW92ZSB0aGUgZm9jdXMgdG8gdGhlIGZpcnN0IGl0ZW1cbiAgICAgIHRoaXMua2V5Rm9jdXMuZm9jdXNDdXJyZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3ZlcmZsb3dQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFiTGlua0RpcmVjdGl2ZXMuZmlsdGVyKGxpbmsgPT4gIWxpbmsuaW5PdmVyZmxvdykubGVuZ3RoO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgndGFiQ29udGVudFZpZXdDb250YWluZXInLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KVxuICBwcml2YXRlIHNldCB0YWJDb250ZW50Vmlld0NvbnRhaW5lcih2YWx1ZTogVmlld0NvbnRhaW5lclJlZikge1xuICAgIHRoaXMudGFic1NlcnZpY2UudGFiQ29udGVudFZpZXdDb250YWluZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmxpc3RlbkZvclRhYkxpbmtDaGFuZ2VzKCkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVkRm9yVGFic0FjdGlvbnNDaGFuZ2VzKCkpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmlmQWN0aXZlU2VydmljZS5jdXJyZW50ID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLnRhYkxpbmtEaXJlY3RpdmVzWzBdKSB7XG4gICAgICB0aGlzLnRhYkxpbmtEaXJlY3RpdmVzWzBdLmFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgLy8gc2V0IGluaXRpYWwgY3VycmVudCBwb3NpdGlvblxuICAgIHRoaXMua2V5Rm9jdXMuY3VycmVudCA9IHRoaXMuYWN0aXZlVGFiUG9zaXRpb247XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4ge1xuICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVPdmVyZmxvd09uUG9zaXRpb24ocG9zaXRpb246IG51bWJlcikge1xuICAgIC8vIHdlIG5lZWQgdG8gY2hlY2sgY3VycmVudCBwb3NpdGlvbiB0byBkZXRlcm1pbmVcbiAgICAvLyB3aGV0aGVyIHdlIG5lZWQgdG8gb3BlbiB0aGUgdGFiIG92ZXJmbG93IG9yIG5vdFxuICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gcG9zaXRpb24gPj0gdGhpcy5vdmVyZmxvd1Bvc2l0aW9uO1xuICB9XG5cbiAgcmVzZXRLZXlGb2N1c0N1cnJlbnRUb0FjdGl2ZShldmVudDogRm9jdXNFdmVudCkge1xuICAgIGNvbnN0IGtleUZvY3VzQ29udGFpbnNGb2N1cyA9IHRoaXMua2V5Rm9jdXMubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcbiAgICBpZiAoIWtleUZvY3VzQ29udGFpbnNGb2N1cyAmJiB0aGlzLmtleUZvY3VzLmN1cnJlbnQgIT09IHRoaXMuYWN0aXZlVGFiUG9zaXRpb24pIHtcbiAgICAgIHRoaXMua2V5Rm9jdXMuY3VycmVudCA9IHRoaXMuYWN0aXZlVGFiUG9zaXRpb247XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlT3ZlcmZsb3dPbkNsaWNrKCkge1xuICAgIGlmICh0aGlzLmlzQ3VycmVudEluT3ZlcmZsb3cgJiYgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4pIHtcbiAgICAgIHRoaXMua2V5Rm9jdXMubW92ZVRvKHRoaXMub3ZlcmZsb3dQb3NpdGlvbiAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmtleUZvY3VzLm1vdmVUbyh0aGlzLm92ZXJmbG93UG9zaXRpb24pO1xuICAgIH1cblxuICAgIC8vIG9uY2UgY2xpY2sgaGFuZGxlciBjb21wbGV0ZXMgcnVubmluZyxcbiAgICAvLyByZXNldCB0aGUgX21vdXNlZG93biBmbGFnXG4gICAgdGhpcy5fbW91c2Vkb3duID0gZmFsc2U7XG4gIH1cblxuICBvcGVuT3ZlcmZsb3dPbkZvY3VzKCkge1xuICAgIC8vIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgb25seSBvbiBrZXlib2FyZCBnZW5lcmF0ZWQgZm9jdXNcbiAgICAvLyB3aGVuIHRoZSBhY3RpdmUgdGFiIGlzIGluIHRoZSBvdmVyZmxvd1xuICAgIGlmICghdGhpcy5fbW91c2Vkb3duICYmICF0aGlzLnRvZ2dsZVNlcnZpY2Uub3Blbikge1xuICAgICAgdGhpcy5rZXlGb2N1cy5tb3ZlVG8odGhpcy5hY3RpdmVUYWJQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VPbkZvY3VzT3V0KGV2ZW50OiBGb2N1c0V2ZW50KSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuX3RhYk92ZXJmbG93RWwuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudCkgJiZcbiAgICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuICYmXG4gICAgICAhdGhpcy5fbW91c2Vkb3duXG4gICAgKSB7XG4gICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuXG4gICAgICAvLyBpZiB0aGUgZm9jdXMgaXMgb3V0IG9mIG92ZXJmbG93IGFuZCBsYW5kcyBvbiB0aGUgYWN0aXZlIHRhYiBsaW5rXG4gICAgICAvLyB3aGljaCBpcyBjdXJyZW50bHkgdmlzaWJsZSwgc2V0IHRoZSBrZXkgZm9jdXMgY3VycmVudCB0byBhY3RpdmVUYWJQb3NpdGlvblxuICAgICAgaWYgKHRoaXMudGFiTGlua0VsZW1lbnRzW3RoaXMuYWN0aXZlVGFiUG9zaXRpb25dID09PSBldmVudC5yZWxhdGVkVGFyZ2V0KSB7XG4gICAgICAgIHRoaXMua2V5Rm9jdXMuY3VycmVudCA9IHRoaXMuYWN0aXZlVGFiUG9zaXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2VPbkVzY2FwZUtleSgpIHtcbiAgICAvLyBNb3ZlIGN1cnJlbnQgdG8gdGhlIGxhc3QgdmlzaWJsZSBmb2N1c2FibGUgaXRlbVxuICAgIHRoaXMua2V5Rm9jdXMubW92ZVRvKHRoaXMub3ZlcmZsb3dQb3NpdGlvbiAtIDEpO1xuICB9XG5cbiAgY2xvc2VPbk91dHNpZGVDbGljayhldmVudDogRXZlbnQsIHRhYk92ZXJmbG93VHJpZ2dlcjogSFRNTEVsZW1lbnQpIHtcbiAgICAvLyBFeGl0IGVhcmx5IGlmIHRoZSBldmVudCB0YXJnZXQgaXMgdGhlIHRyaWdnZXIgZWxlbWVudCBpdHNlbGYgb3IgZWxlbWVudCB0aGF0J3MgaW5zaWRlIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAgLy8gVGhpcyBpcyBiZWNhdXNlIHdlIGhhdmUgYW5vdGhlciBoYW5kbGVyIG9uIHRoZSB0YWJPdmVyZmxvd1RyaWdnZXIgZWxlbWVudCBpdHNlbGYuXG4gICAgLy8gQXMgdGhpcyBoYW5kbGVyIG1ldGhvZCBpcyBvbiB0aGUgZG9jdW1lbnQgbGV2ZWwgc28gdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdG8gaXQgYW5kIGNvbmZsaWN0c1xuICAgIC8vIHdpdGggdGhlIHRhYk92ZXJmbG93VHJpZ2dlciBoYW5kbGVyIHJlc3VsdGluZyBpbiBvcGVuaW5nIHRoZSB0YWIgb3ZlcmZsb3cgYW5kIGNsb3NpbmcgaXQgcmlnaHQgYXdheSBjb25zZWN1dGl2ZWx5LlxuICAgIGNvbnN0IGlzVGFic0FjdGlvbiA9IHRoaXMudGFic0FjdGlvbnMuc29tZShhY3Rpb24gPT5cbiAgICAgIChhY3Rpb24ubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KVxuICAgICk7XG4gICAgaWYgKFxuICAgICAgZXZlbnQudGFyZ2V0ID09PSB0YWJPdmVyZmxvd1RyaWdnZXIgfHxcbiAgICAgIHRhYk92ZXJmbG93VHJpZ2dlci5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpIHx8XG4gICAgICBpc1RhYnNBY3Rpb25cbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNb3ZlIGN1cnJlbnQgdG8gdGhlIGxhc3QgdmlzaWJsZSBmb2N1c2FibGUgaXRlbVxuICAgIGlmICghdGhpcy5fdGFiT3ZlcmZsb3dFbC5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpICYmIHRoaXMuaXNDdXJyZW50SW5PdmVyZmxvdykge1xuICAgICAgdGhpcy5rZXlGb2N1cy5tb3ZlVG8odGhpcy5vdmVyZmxvd1Bvc2l0aW9uIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRUYWJMaW5rRWxlbWVudHMoKSB7XG4gICAgdGhpcy5fdGFiTGlua0RpcmVjdGl2ZXMgPSB0aGlzLnRhYnMubWFwKHRhYiA9PiB0YWIudGFiTGluayk7XG4gICAgdGhpcy50YWJMaW5rRWxlbWVudHMgPSB0aGlzLl90YWJMaW5rRGlyZWN0aXZlcy5tYXAodGFiID0+IHRhYi5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAodGhpcy50YWJzQWN0aW9ucykge1xuICAgICAgdGhpcy50YWJMaW5rRWxlbWVudHMucHVzaCguLi50aGlzLnRhYnNBY3Rpb25zLm1hcChhY3Rpb24gPT4gYWN0aW9uLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvclRhYkxpbmtDaGFuZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMudGFicy5tYXAodGFiID0+IHRhYi50YWJMaW5rKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuc2V0VGFiTGlua0VsZW1lbnRzKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZWRGb3JUYWJzQWN0aW9uc0NoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFic0FjdGlvbnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZXRUYWJMaW5rRWxlbWVudHMoKSk7XG4gIH1cbn1cbiJdfQ==