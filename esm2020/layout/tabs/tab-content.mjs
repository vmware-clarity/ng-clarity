/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { IF_ACTIVE_ID } from '../../utils/conditional/if-active.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/conditional/if-active.service";
import * as i2 from "./providers/tabs.service";
let nbTabContentComponents = 0;
export class ClrTabContent {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        if (!this.tabContentId) {
            this.tabContentId = 'clr-tab-content-' + nbTabContentComponents++;
        }
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    get ariaLabelledBy() {
        return this.tabsService.children.find(tab => tab.tabLink.id === this.id)?.tabLink?.tabLinkId;
    }
    // The template must be applied on the top-down phase of view-child initialization to prevent
    // components in the content from initializing before a content container exists.
    // Some child components need their container for sizing calculations.
    set templateRef(value) {
        this.viewRef = this.tabsService.tabContentViewContainer.createEmbeddedView(value);
    }
    ngOnDestroy() {
        const index = this.tabsService.tabContentViewContainer.indexOf(this.viewRef);
        if (index > -1) {
            this.tabsService.tabContentViewContainer.remove(index);
        }
    }
}
ClrTabContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabContent, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i2.TabsService }], target: i0.ɵɵFactoryTarget.Component });
ClrTabContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTabContent, selector: "clr-tab-content", inputs: { tabContentId: ["id", "tabContentId"] }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["tabContentProjectedRef"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab-content',
                    template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i2.TabsService }]; }, propDecorators: { tabContentId: [{
                type: Input,
                args: ['id']
            }], templateRef: [{
                type: ViewChild,
                args: ['tabContentProjectedRef', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdGFicy90YWItY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQW1CLE1BQU0sRUFBRSxLQUFLLEVBQTBCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RyxPQUFPLEVBQUUsWUFBWSxFQUFtQixNQUFNLDJDQUEyQyxDQUFDOzs7O0FBRzFGLElBQUksc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO0FBb0IvQixNQUFNLE9BQU8sYUFBYTtJQUt4QixZQUNTLGVBQWdDLEVBQ1YsRUFBVSxFQUMvQixXQUF3QjtRQUZ6QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDVixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQy9CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBRWhDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQztTQUNuRTtJQUNILENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO0lBQy9GLENBQUM7SUFFRCw2RkFBNkY7SUFDN0YsaUZBQWlGO0lBQ2pGLHNFQUFzRTtJQUN0RSxJQUNZLFdBQVcsQ0FBQyxLQUFpQztRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0UsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7OzBHQXBDVSxhQUFhLGlEQU9kLFlBQVk7OEZBUFgsYUFBYSw4T0FoQmQ7Ozs7Ozs7Ozs7Ozs7O0dBY1Q7MkZBRVUsYUFBYTtrQkFsQnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7OztHQWNUO2lCQUNGOzswQkFRSSxNQUFNOzJCQUFDLFlBQVk7c0VBTlQsWUFBWTtzQkFBeEIsS0FBSzt1QkFBQyxJQUFJO2dCQTBCQyxXQUFXO3NCQUR0QixTQUFTO3VCQUFDLHdCQUF3QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbWJlZGRlZFZpZXdSZWYsIEluamVjdCwgSW5wdXQsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJRl9BQ1RJVkVfSUQsIElmQWN0aXZlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWFjdGl2ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdGFicy5zZXJ2aWNlJztcblxubGV0IG5iVGFiQ29udGVudENvbXBvbmVudHMgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItdGFiLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjdGFiQ29udGVudFByb2plY3RlZFJlZj5cbiAgICAgIDxzZWN0aW9uXG4gICAgICAgIFtpZF09XCJ0YWJDb250ZW50SWRcIlxuICAgICAgICByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICBjbGFzcz1cInRhYi1jb250ZW50XCJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVcIlxuICAgICAgICBbaGlkZGVuXT1cIiFhY3RpdmVcIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIlxuICAgICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCIhYWN0aXZlXCJcbiAgICAgID5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9zZWN0aW9uPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENsclRhYkNvbnRlbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2lkJykgdGFiQ29udGVudElkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSB2aWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8Q2xyVGFiQ29udGVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlmQWN0aXZlU2VydmljZTogSWZBY3RpdmVTZXJ2aWNlLFxuICAgIEBJbmplY3QoSUZfQUNUSVZFX0lEKSBwdWJsaWMgaWQ6IG51bWJlcixcbiAgICBwcml2YXRlIHRhYnNTZXJ2aWNlOiBUYWJzU2VydmljZVxuICApIHtcbiAgICBpZiAoIXRoaXMudGFiQ29udGVudElkKSB7XG4gICAgICB0aGlzLnRhYkNvbnRlbnRJZCA9ICdjbHItdGFiLWNvbnRlbnQtJyArIG5iVGFiQ29udGVudENvbXBvbmVudHMrKztcbiAgICB9XG4gIH1cblxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLmlmQWN0aXZlU2VydmljZS5jdXJyZW50ID09PSB0aGlzLmlkO1xuICB9XG5cbiAgZ2V0IGFyaWFMYWJlbGxlZEJ5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudGFic1NlcnZpY2UuY2hpbGRyZW4uZmluZCh0YWIgPT4gdGFiLnRhYkxpbmsuaWQgPT09IHRoaXMuaWQpPy50YWJMaW5rPy50YWJMaW5rSWQ7XG4gIH1cblxuICAvLyBUaGUgdGVtcGxhdGUgbXVzdCBiZSBhcHBsaWVkIG9uIHRoZSB0b3AtZG93biBwaGFzZSBvZiB2aWV3LWNoaWxkIGluaXRpYWxpemF0aW9uIHRvIHByZXZlbnRcbiAgLy8gY29tcG9uZW50cyBpbiB0aGUgY29udGVudCBmcm9tIGluaXRpYWxpemluZyBiZWZvcmUgYSBjb250ZW50IGNvbnRhaW5lciBleGlzdHMuXG4gIC8vIFNvbWUgY2hpbGQgY29tcG9uZW50cyBuZWVkIHRoZWlyIGNvbnRhaW5lciBmb3Igc2l6aW5nIGNhbGN1bGF0aW9ucy5cbiAgQFZpZXdDaGlsZCgndGFiQ29udGVudFByb2plY3RlZFJlZicsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHByaXZhdGUgc2V0IHRlbXBsYXRlUmVmKHZhbHVlOiBUZW1wbGF0ZVJlZjxDbHJUYWJDb250ZW50Pikge1xuICAgIHRoaXMudmlld1JlZiA9IHRoaXMudGFic1NlcnZpY2UudGFiQ29udGVudFZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHZhbHVlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy50YWJzU2VydmljZS50YWJDb250ZW50Vmlld0NvbnRhaW5lci5pbmRleE9mKHRoaXMudmlld1JlZik7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMudGFic1NlcnZpY2UudGFiQ29udGVudFZpZXdDb250YWluZXIucmVtb3ZlKGluZGV4KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==