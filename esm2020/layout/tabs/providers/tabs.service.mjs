/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { TabsLayout } from '../enums/tabs-layout.enum';
import * as i0 from "@angular/core";
export class TabsService {
    constructor() {
        this.layout = TabsLayout.HORIZONTAL;
        this._children = [];
    }
    get children() {
        return this._children;
    }
    get activeTab() {
        return this.children.find((tab) => {
            return tab.active;
        });
    }
    get overflowTabs() {
        if (this.layout === TabsLayout.VERTICAL) {
            return [];
        }
        else {
            return this.children.filter((tab) => tab.tabLink.inOverflow === true);
        }
    }
    register(tab) {
        this._children.push(tab);
    }
    unregister(tab) {
        const index = this.children.indexOf(tab);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
}
TabsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TabsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TabsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TabsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TabsService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3RhYnMvcHJvdmlkZXJzL3RhYnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRTdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFJdkQsTUFBTSxPQUFPLFdBQVc7SUFEeEI7UUFFRSxXQUFNLEdBQXdCLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFHNUMsY0FBUyxHQUFhLEVBQUUsQ0FBQztLQThCbEM7SUE1QkMsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7WUFDeEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDO1NBQ1g7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDO1NBQy9FO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxHQUFXO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVLENBQUMsR0FBVztRQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7O3dHQWpDVSxXQUFXOzRHQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFEdkIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBUYWJzTGF5b3V0IH0gZnJvbSAnLi4vZW51bXMvdGFicy1sYXlvdXQuZW51bSc7XG5pbXBvcnQgeyBDbHJUYWIgfSBmcm9tICcuLi90YWInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGFic1NlcnZpY2Uge1xuICBsYXlvdXQ6IFRhYnNMYXlvdXQgfCBzdHJpbmcgPSBUYWJzTGF5b3V0LkhPUklaT05UQUw7XG4gIHRhYkNvbnRlbnRWaWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIHByaXZhdGUgX2NoaWxkcmVuOiBDbHJUYWJbXSA9IFtdO1xuXG4gIGdldCBjaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gIH1cblxuICBnZXQgYWN0aXZlVGFiKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbmQoKHRhYjogQ2xyVGFiKSA9PiB7XG4gICAgICByZXR1cm4gdGFiLmFjdGl2ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBvdmVyZmxvd1RhYnMoKSB7XG4gICAgaWYgKHRoaXMubGF5b3V0ID09PSBUYWJzTGF5b3V0LlZFUlRJQ0FMKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigodGFiOiBDbHJUYWIpID0+IHRhYi50YWJMaW5rLmluT3ZlcmZsb3cgPT09IHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyKHRhYjogQ2xyVGFiKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaCh0YWIpO1xuICB9XG5cbiAgdW5yZWdpc3Rlcih0YWI6IENsclRhYikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKHRhYik7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==