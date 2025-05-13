/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./willy-wonka";
export class OompaLoompa {
    // FIXME: Request Injector once we move to Angular 4.2+, it'll allow easier refactors
    constructor(cdr, willyWonka) {
        this.subscription = willyWonka.chocolate.subscribe(() => {
            if (this.latestFlavor !== this.flavor) {
                willyWonka.disableChocolateCheck = true;
                cdr.detectChanges();
                willyWonka.disableChocolateCheck = false;
            }
        });
    }
    ngAfterContentChecked() {
        this.latestFlavor = this.flavor;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
OompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.WillyWonka }], target: i0.ɵɵFactoryTarget.Directive });
OompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: OompaLoompa, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OompaLoompa, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.WillyWonka }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib29tcGEtbG9vbXBhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBMEMsU0FBUyxFQUFhLE1BQU0sZUFBZSxDQUFDOzs7QUFNN0YsTUFBTSxPQUFnQixXQUFXO0lBSS9CLHFGQUFxRjtJQUNyRixZQUFZLEdBQXNCLEVBQUUsVUFBc0I7UUFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDdEQsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JDLFVBQVUsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBQ3hDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDcEIsVUFBVSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQzthQUMxQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUlELHFCQUFxQjtRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbEMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7O3dHQXZCbUIsV0FBVzs0RkFBWCxXQUFXOzJGQUFYLFdBQVc7a0JBRGhDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEFmdGVyQ29udGVudENoZWNrZWQsIENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFdpbGx5V29ua2EgfSBmcm9tICcuL3dpbGx5LXdvbmthJztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgT29tcGFMb29tcGEgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIGxhdGVzdEZsYXZvcjogYW55O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8vIEZJWE1FOiBSZXF1ZXN0IEluamVjdG9yIG9uY2Ugd2UgbW92ZSB0byBBbmd1bGFyIDQuMissIGl0J2xsIGFsbG93IGVhc2llciByZWZhY3RvcnNcbiAgY29uc3RydWN0b3IoY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgd2lsbHlXb25rYTogV2lsbHlXb25rYSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gd2lsbHlXb25rYS5jaG9jb2xhdGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmxhdGVzdEZsYXZvciAhPT0gdGhpcy5mbGF2b3IpIHtcbiAgICAgICAgd2lsbHlXb25rYS5kaXNhYmxlQ2hvY29sYXRlQ2hlY2sgPSB0cnVlO1xuICAgICAgICBjZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB3aWxseVdvbmthLmRpc2FibGVDaG9jb2xhdGVDaGVjayA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYWJzdHJhY3QgZ2V0IGZsYXZvcigpOiBhbnk7XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMubGF0ZXN0Rmxhdm9yID0gdGhpcy5mbGF2b3I7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=