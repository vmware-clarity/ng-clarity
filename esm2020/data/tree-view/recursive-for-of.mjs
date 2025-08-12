/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import * as i0 from "@angular/core";
import * as i1 from "./tree-features.service";
export class ClrRecursiveForOf {
    constructor(template, featuresService, cdr) {
        this.template = template;
        this.featuresService = featuresService;
        this.cdr = cdr;
    }
    // I'm using OnChanges instead of OnInit to easily keep up to date with dynamic trees. Maybe optimizable later.
    ngOnChanges() {
        let wrapped;
        if (Array.isArray(this.nodes)) {
            wrapped = this.nodes.map(node => new RecursiveTreeNodeModel(node, null, this.getChildren, this.featuresService));
        }
        else {
            wrapped = [new RecursiveTreeNodeModel(this.nodes, null, this.getChildren, this.featuresService)];
        }
        if (!this.childrenFetchSubscription) {
            this.childrenFetchSubscription = this.featuresService.childrenFetched.pipe(debounceTime(0)).subscribe(() => {
                this.cdr.detectChanges();
            });
        }
        this.featuresService.recursion = {
            template: this.template,
            root: wrapped,
        };
    }
    ngOnDestroy() {
        if (this.childrenFetchSubscription) {
            this.childrenFetchSubscription.unsubscribe();
        }
    }
}
ClrRecursiveForOf.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRecursiveForOf, deps: [{ token: i0.TemplateRef }, { token: i1.TreeFeaturesService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrRecursiveForOf.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrRecursiveForOf, selector: "[clrRecursiveFor][clrRecursiveForOf]", inputs: { nodes: ["clrRecursiveForOf", "nodes"], getChildren: ["clrRecursiveForGetChildren", "getChildren"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRecursiveForOf, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRecursiveFor][clrRecursiveForOf]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i1.TreeFeaturesService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { nodes: [{
                type: Input,
                args: ['clrRecursiveForOf']
            }], getChildren: [{
                type: Input,
                args: ['clrRecursiveForGetChildren']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdXJzaXZlLWZvci1vZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvdHJlZS12aWV3L3JlY3Vyc2l2ZS1mb3Itb2YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQXFCLFNBQVMsRUFBRSxLQUFLLEVBQXFDLE1BQU0sZUFBZSxDQUFDO0FBRXZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUc5QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7O0FBWTVFLE1BQU0sT0FBTyxpQkFBaUI7SUFTNUIsWUFDVSxRQUFrRCxFQUNsRCxlQUF1QyxFQUN2QyxHQUFzQjtRQUZ0QixhQUFRLEdBQVIsUUFBUSxDQUEwQztRQUNsRCxvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsUUFBRyxHQUFILEdBQUcsQ0FBbUI7SUFDN0IsQ0FBQztJQUVKLCtHQUErRztJQUMvRyxXQUFXO1FBQ1QsSUFBSSxPQUFvQyxDQUFDO1FBQ3pDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDbEg7YUFBTTtZQUNMLE9BQU8sR0FBRyxDQUFDLElBQUksc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUNsRztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUU7WUFDbkMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUN6RyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsR0FBRztZQUMvQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtZQUNsQyxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDOUM7SUFDSCxDQUFDOzs4R0F2Q1UsaUJBQWlCO2tHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFIN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0NBQXNDO2lCQUNqRDtvS0FHNkIsS0FBSztzQkFBaEMsS0FBSzt1QkFBQyxtQkFBbUI7Z0JBR1csV0FBVztzQkFBL0MsS0FBSzt1QkFBQyw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBc3luY0FycmF5IH0gZnJvbSAnLi9tb2RlbHMvYXN5bmMtYXJyYXknO1xuaW1wb3J0IHsgUmVjdXJzaXZlVHJlZU5vZGVNb2RlbCB9IGZyb20gJy4vbW9kZWxzL3JlY3Vyc2l2ZS10cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU5vZGVNb2RlbCB9IGZyb20gJy4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlRmVhdHVyZXNTZXJ2aWNlIH0gZnJvbSAnLi90cmVlLWZlYXR1cmVzLnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsclJlY3Vyc2l2ZUZvck9mQ29udGV4dDxUPiB7XG4gICRpbXBsaWNpdDogVDtcbiAgY2xyTW9kZWw6IFRyZWVOb2RlTW9kZWw8VD47XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJSZWN1cnNpdmVGb3JdW2NsclJlY3Vyc2l2ZUZvck9mXScsXG59KVxuZXhwb3J0IGNsYXNzIENsclJlY3Vyc2l2ZUZvck9mPFQ+IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvLyBUT0RPOiBhY2NlcHQgTmdJdGVyYWJsZTxUPlxuICBASW5wdXQoJ2NsclJlY3Vyc2l2ZUZvck9mJykgbm9kZXM6IFQgfCBUW107XG5cbiAgLy8gVE9ETzogYWNjZXB0IE5nSXRlcmFibGU8VD4gcmV0dXJuIHR5cGVcbiAgQElucHV0KCdjbHJSZWN1cnNpdmVGb3JHZXRDaGlsZHJlbicpIGdldENoaWxkcmVuOiAobm9kZTogVCkgPT4gQXN5bmNBcnJheTxUPjtcblxuICBwcml2YXRlIGNoaWxkcmVuRmV0Y2hTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxDbHJSZWN1cnNpdmVGb3JPZkNvbnRleHQ8VD4+LFxuICAgIHByaXZhdGUgZmVhdHVyZXNTZXJ2aWNlOiBUcmVlRmVhdHVyZXNTZXJ2aWNlPFQ+LFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHt9XG5cbiAgLy8gSSdtIHVzaW5nIE9uQ2hhbmdlcyBpbnN0ZWFkIG9mIE9uSW5pdCB0byBlYXNpbHkga2VlcCB1cCB0byBkYXRlIHdpdGggZHluYW1pYyB0cmVlcy4gTWF5YmUgb3B0aW1pemFibGUgbGF0ZXIuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGxldCB3cmFwcGVkOiBSZWN1cnNpdmVUcmVlTm9kZU1vZGVsPFQ+W107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5ub2RlcykpIHtcbiAgICAgIHdyYXBwZWQgPSB0aGlzLm5vZGVzLm1hcChub2RlID0+IG5ldyBSZWN1cnNpdmVUcmVlTm9kZU1vZGVsKG5vZGUsIG51bGwsIHRoaXMuZ2V0Q2hpbGRyZW4sIHRoaXMuZmVhdHVyZXNTZXJ2aWNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdyYXBwZWQgPSBbbmV3IFJlY3Vyc2l2ZVRyZWVOb2RlTW9kZWwodGhpcy5ub2RlcywgbnVsbCwgdGhpcy5nZXRDaGlsZHJlbiwgdGhpcy5mZWF0dXJlc1NlcnZpY2UpXTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoaWxkcmVuRmV0Y2hTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuY2hpbGRyZW5GZXRjaFN1YnNjcmlwdGlvbiA9IHRoaXMuZmVhdHVyZXNTZXJ2aWNlLmNoaWxkcmVuRmV0Y2hlZC5waXBlKGRlYm91bmNlVGltZSgwKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5mZWF0dXJlc1NlcnZpY2UucmVjdXJzaW9uID0ge1xuICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsXG4gICAgICByb290OiB3cmFwcGVkLFxuICAgIH07XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jaGlsZHJlbkZldGNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuRmV0Y2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==