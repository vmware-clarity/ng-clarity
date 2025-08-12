/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, Inject } from '@angular/core';
import { IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER } from '../../utils/conditional/if-active.service';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/conditional/if-active.service";
import * as i2 from "./providers/tabs.service";
export class ClrTab {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        tabsService.register(this);
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    ngOnDestroy() {
        this.tabsService.unregister(this);
    }
}
ClrTab.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTab, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i2.TabsService }], target: i0.ɵɵFactoryTarget.Component });
ClrTab.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTab, selector: "clr-tab", providers: [IF_ACTIVE_ID_PROVIDER], queries: [{ propertyName: "tabLink", first: true, predicate: ClrTabLink, descendants: true, static: true }, { propertyName: "tabContent", first: true, predicate: ClrTabContent, descendants: true, static: true }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTab, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab',
                    template: `<ng-content></ng-content>`,
                    providers: [IF_ACTIVE_ID_PROVIDER],
                }]
        }], ctorParameters: function () { return [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i2.TabsService }]; }, propDecorators: { tabLink: [{
                type: ContentChild,
                args: [ClrTabLink, { static: true }]
            }], tabContent: [{
                type: ContentChild,
                args: [ClrTabContent, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3RhYnMvdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWhFLE9BQU8sRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQW1CLE1BQU0sMkNBQTJDLENBQUM7QUFFakgsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7QUFPbEQsTUFBTSxPQUFPLE1BQU07SUFJakIsWUFDUyxlQUFnQyxFQUNWLEVBQVUsRUFDL0IsV0FBd0I7UUFGekIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ1YsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUMvQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUVoQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDOzttR0FsQlUsTUFBTSxpREFNUCxZQUFZO3VGQU5YLE1BQU0sa0NBRk4sQ0FBQyxxQkFBcUIsQ0FBQywrREFHcEIsVUFBVSwyRkFDVixhQUFhLDhEQUxqQiwyQkFBMkI7MkZBRzFCLE1BQU07a0JBTGxCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2lCQUNuQzs7MEJBT0ksTUFBTTsyQkFBQyxZQUFZO3NFQUxzQixPQUFPO3NCQUFsRCxZQUFZO3VCQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBQ0ssVUFBVTtzQkFBeEQsWUFBWTt1QkFBQyxhQUFhLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElGX0FDVElWRV9JRCwgSUZfQUNUSVZFX0lEX1BST1ZJREVSLCBJZkFjdGl2ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1hY3RpdmUuc2VydmljZSc7XG5pbXBvcnQgeyBUYWJzU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3RhYnMuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJUYWJDb250ZW50IH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQgeyBDbHJUYWJMaW5rIH0gZnJvbSAnLi90YWItbGluay5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItdGFiJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgcHJvdmlkZXJzOiBbSUZfQUNUSVZFX0lEX1BST1ZJREVSXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVGFiIHtcbiAgQENvbnRlbnRDaGlsZChDbHJUYWJMaW5rLCB7IHN0YXRpYzogdHJ1ZSB9KSB0YWJMaW5rOiBDbHJUYWJMaW5rO1xuICBAQ29udGVudENoaWxkKENsclRhYkNvbnRlbnQsIHsgc3RhdGljOiB0cnVlIH0pIHRhYkNvbnRlbnQ6IENsclRhYkNvbnRlbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlmQWN0aXZlU2VydmljZTogSWZBY3RpdmVTZXJ2aWNlLFxuICAgIEBJbmplY3QoSUZfQUNUSVZFX0lEKSBwdWJsaWMgaWQ6IG51bWJlcixcbiAgICBwcml2YXRlIHRhYnNTZXJ2aWNlOiBUYWJzU2VydmljZVxuICApIHtcbiAgICB0YWJzU2VydmljZS5yZWdpc3Rlcih0aGlzKTtcbiAgfVxuXG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWZBY3RpdmVTZXJ2aWNlLmN1cnJlbnQgPT09IHRoaXMuaWQ7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnRhYnNTZXJ2aWNlLnVucmVnaXN0ZXIodGhpcyk7XG4gIH1cbn1cbiJdfQ==