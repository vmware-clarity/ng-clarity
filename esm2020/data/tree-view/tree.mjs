/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, Input, } from '@angular/core';
import { fromEvent } from 'rxjs';
import { TREE_FEATURES_PROVIDER } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';
import * as i0 from "@angular/core";
import * as i1 from "./tree-features.service";
import * as i2 from "./tree-focus-manager.service";
import * as i3 from "@angular/common";
import * as i4 from "./recursive-children";
export class ClrTree {
    constructor(featuresService, focusManagerService, renderer, el, ngZone) {
        this.featuresService = featuresService;
        this.focusManagerService = focusManagerService;
        this.renderer = renderer;
        this.el = el;
        this.subscriptions = [];
        this._isMultiSelectable = false;
        const subscription = ngZone.runOutsideAngular(() => fromEvent(el.nativeElement, 'focusin').subscribe((event) => {
            if (event.target === el.nativeElement) {
                // After discussing with the team, I've made it so that when the tree receives focus, the first visible node will be focused.
                // This will prevent from the page scrolling abruptly to the first selected node if it exist in a deeply nested tree.
                focusManagerService.focusFirstVisibleNode();
                // when the first child gets focus,
                // tree should no longer have tabindex of 0.
                renderer.removeAttribute(el.nativeElement, 'tabindex');
            }
        }));
        this.subscriptions.push(subscription);
    }
    set lazy(value) {
        this.featuresService.eager = !value;
    }
    get isMultiSelectable() {
        return this._isMultiSelectable;
    }
    ngAfterContentInit() {
        this.setRootNodes();
        this.subscriptions.push(this.rootNodes.changes.subscribe(() => {
            this.setMultiSelectable();
            this.setRootNodes();
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setMultiSelectable() {
        if (this.featuresService.selectable && this.rootNodes.length > 0) {
            this._isMultiSelectable = true;
            this.renderer.setAttribute(this.el.nativeElement, 'aria-multiselectable', 'true');
        }
        else {
            this._isMultiSelectable = false;
            this.renderer.removeAttribute(this.el.nativeElement, 'aria-multiselectable');
        }
    }
    setRootNodes() {
        // if node has no parent, it's a root node
        // for recursive tree, this.rootNodes registers also nested children
        // so we have to use filter to extract the ones that are truly root nodes
        this.focusManagerService.rootNodeModels = this.rootNodes.map(node => node._model).filter(node => !node.parent);
    }
}
ClrTree.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTree, deps: [{ token: i1.TreeFeaturesService }, { token: i2.TreeFocusManagerService }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
ClrTree.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTree, selector: "clr-tree", inputs: { lazy: ["clrLazy", "lazy"] }, host: { attributes: { "tabindex": "0" }, properties: { "attr.role": "\"tree\"" } }, providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService], queries: [{ propertyName: "rootNodes", predicate: ClrTreeNode }], ngImport: i0, template: `
    <ng-content></ng-content>
    <clr-recursive-children
      *ngIf="featuresService.recursion"
      [children]="featuresService.recursion.root"
    ></clr-recursive-children>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.RecursiveChildren, selector: "clr-recursive-children", inputs: ["parent", "children"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTree, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tree',
                    template: `
    <ng-content></ng-content>
    <clr-recursive-children
      *ngIf="featuresService.recursion"
      [children]="featuresService.recursion.root"
    ></clr-recursive-children>
  `,
                    providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService],
                    host: {
                        tabindex: '0',
                        '[attr.role]': '"tree"',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.TreeFeaturesService }, { type: i2.TreeFocusManagerService }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { rootNodes: [{
                type: ContentChildren,
                args: [ClrTreeNode]
            }], lazy: [{
                type: Input,
                args: ['clrLazy']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvdHJlZS12aWV3L3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFFZixLQUFLLEdBS04sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFL0MsT0FBTyxFQUFFLHNCQUFzQixFQUF1QixNQUFNLHlCQUF5QixDQUFDO0FBQ3RGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7Ozs7OztBQWlCMUMsTUFBTSxPQUFPLE9BQU87SUFNbEIsWUFDUyxlQUF1QyxFQUN0QyxtQkFBK0MsRUFDL0MsUUFBbUIsRUFDbkIsRUFBMkIsRUFDbkMsTUFBYztRQUpQLG9CQUFlLEdBQWYsZUFBZSxDQUF3QjtRQUN0Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQTRCO1FBQy9DLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsT0FBRSxHQUFGLEVBQUUsQ0FBeUI7UUFQN0Isa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ25DLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQVNqQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQ2pELFNBQVMsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUNyRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLGFBQWEsRUFBRTtnQkFDckMsNkhBQTZIO2dCQUM3SCxxSEFBcUg7Z0JBQ3JILG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzVDLG1DQUFtQztnQkFDbkMsNENBQTRDO2dCQUM1QyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDeEQ7UUFDSCxDQUFDLENBQUMsQ0FDSCxDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQ0ksSUFBSSxDQUFDLEtBQWM7UUFDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTyxrQkFBa0I7UUFDeEIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDaEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNuRjthQUFNO1lBQ0wsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQztJQUVPLFlBQVk7UUFDbEIsMENBQTBDO1FBQzFDLG9FQUFvRTtRQUNwRSx5RUFBeUU7UUFDekUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqSCxDQUFDOztvR0FwRVUsT0FBTzt3RkFBUCxPQUFPLDhKQU5QLENBQUMsc0JBQXNCLEVBQUUsdUJBQXVCLENBQUMsb0RBTzNDLFdBQVcsNkJBZGxCOzs7Ozs7R0FNVDsyRkFPVSxPQUFPO2tCQWZuQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixRQUFRLEVBQUU7Ozs7OztHQU1UO29CQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLHVCQUF1QixDQUFDO29CQUM1RCxJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLEdBQUc7d0JBQ2IsYUFBYSxFQUFFLFFBQVE7cUJBQ3hCO2lCQUNGO3NOQUV1QyxTQUFTO3NCQUE5QyxlQUFlO3VCQUFDLFdBQVc7Z0JBNkJ4QixJQUFJO3NCQURQLEtBQUs7dUJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgVFJFRV9GRUFUVVJFU19QUk9WSURFUiwgVHJlZUZlYXR1cmVzU2VydmljZSB9IGZyb20gJy4vdHJlZS1mZWF0dXJlcy5zZXJ2aWNlJztcbmltcG9ydCB7IFRyZWVGb2N1c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi90cmVlLWZvY3VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJUcmVlTm9kZSB9IGZyb20gJy4vdHJlZS1ub2RlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXRyZWUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8Y2xyLXJlY3Vyc2l2ZS1jaGlsZHJlblxuICAgICAgKm5nSWY9XCJmZWF0dXJlc1NlcnZpY2UucmVjdXJzaW9uXCJcbiAgICAgIFtjaGlsZHJlbl09XCJmZWF0dXJlc1NlcnZpY2UucmVjdXJzaW9uLnJvb3RcIlxuICAgID48L2Nsci1yZWN1cnNpdmUtY2hpbGRyZW4+XG4gIGAsXG4gIHByb3ZpZGVyczogW1RSRUVfRkVBVFVSRVNfUFJPVklERVIsIFRyZWVGb2N1c01hbmFnZXJTZXJ2aWNlXSxcbiAgaG9zdDoge1xuICAgIHRhYmluZGV4OiAnMCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ1widHJlZVwiJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVHJlZTxUPiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyVHJlZU5vZGUpIHByaXZhdGUgcm9vdE5vZGVzOiBRdWVyeUxpc3Q8Q2xyVHJlZU5vZGU8VD4+O1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBfaXNNdWx0aVNlbGVjdGFibGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZmVhdHVyZXNTZXJ2aWNlOiBUcmVlRmVhdHVyZXNTZXJ2aWNlPFQ+LFxuICAgIHByaXZhdGUgZm9jdXNNYW5hZ2VyU2VydmljZTogVHJlZUZvY3VzTWFuYWdlclNlcnZpY2U8VD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PlxuICAgICAgZnJvbUV2ZW50KGVsLm5hdGl2ZUVsZW1lbnQsICdmb2N1c2luJykuc3Vic2NyaWJlKChldmVudDogRm9jdXNFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBlbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgLy8gQWZ0ZXIgZGlzY3Vzc2luZyB3aXRoIHRoZSB0ZWFtLCBJJ3ZlIG1hZGUgaXQgc28gdGhhdCB3aGVuIHRoZSB0cmVlIHJlY2VpdmVzIGZvY3VzLCB0aGUgZmlyc3QgdmlzaWJsZSBub2RlIHdpbGwgYmUgZm9jdXNlZC5cbiAgICAgICAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBmcm9tIHRoZSBwYWdlIHNjcm9sbGluZyBhYnJ1cHRseSB0byB0aGUgZmlyc3Qgc2VsZWN0ZWQgbm9kZSBpZiBpdCBleGlzdCBpbiBhIGRlZXBseSBuZXN0ZWQgdHJlZS5cbiAgICAgICAgICBmb2N1c01hbmFnZXJTZXJ2aWNlLmZvY3VzRmlyc3RWaXNpYmxlTm9kZSgpO1xuICAgICAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IGNoaWxkIGdldHMgZm9jdXMsXG4gICAgICAgICAgLy8gdHJlZSBzaG91bGQgbm8gbG9uZ2VyIGhhdmUgdGFiaW5kZXggb2YgMC5cbiAgICAgICAgICByZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUoZWwubmF0aXZlRWxlbWVudCwgJ3RhYmluZGV4Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG4gIH1cblxuICBASW5wdXQoJ2NsckxhenknKVxuICBzZXQgbGF6eSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZmVhdHVyZXNTZXJ2aWNlLmVhZ2VyID0gIXZhbHVlO1xuICB9XG5cbiAgZ2V0IGlzTXVsdGlTZWxlY3RhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLl9pc011bHRpU2VsZWN0YWJsZTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnNldFJvb3ROb2RlcygpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5yb290Tm9kZXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldE11bHRpU2VsZWN0YWJsZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0Um9vdE5vZGVzKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRNdWx0aVNlbGVjdGFibGUoKSB7XG4gICAgaWYgKHRoaXMuZmVhdHVyZXNTZXJ2aWNlLnNlbGVjdGFibGUgJiYgdGhpcy5yb290Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5faXNNdWx0aVNlbGVjdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1tdWx0aXNlbGVjdGFibGUnLCAndHJ1ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc011bHRpU2VsZWN0YWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1tdWx0aXNlbGVjdGFibGUnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFJvb3ROb2RlcygpOiB2b2lkIHtcbiAgICAvLyBpZiBub2RlIGhhcyBubyBwYXJlbnQsIGl0J3MgYSByb290IG5vZGVcbiAgICAvLyBmb3IgcmVjdXJzaXZlIHRyZWUsIHRoaXMucm9vdE5vZGVzIHJlZ2lzdGVycyBhbHNvIG5lc3RlZCBjaGlsZHJlblxuICAgIC8vIHNvIHdlIGhhdmUgdG8gdXNlIGZpbHRlciB0byBleHRyYWN0IHRoZSBvbmVzIHRoYXQgYXJlIHRydWx5IHJvb3Qgbm9kZXNcbiAgICB0aGlzLmZvY3VzTWFuYWdlclNlcnZpY2Uucm9vdE5vZGVNb2RlbHMgPSB0aGlzLnJvb3ROb2Rlcy5tYXAobm9kZSA9PiBub2RlLl9tb2RlbCkuZmlsdGVyKG5vZGUgPT4gIW5vZGUucGFyZW50KTtcbiAgfVxufVxuIl19