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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib29tcGEtbG9vbXBhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBMEMsU0FBUyxFQUFhLE1BQU0sZUFBZSxDQUFDOzs7QUFNN0YsTUFBTSxPQUFnQixXQUFXO0lBSS9CLHFGQUFxRjtJQUNyRixZQUFzQixHQUFzQixFQUFFLFVBQXNCO1FBQ2xFLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3RELElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNyQyxVQUFVLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUN4QyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3BCLFVBQVUsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7YUFDMUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFJRCxxQkFBcUI7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDOzt3R0F2Qm1CLFdBQVc7NEZBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQURoQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlckNvbnRlbnRDaGVja2VkLCBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBXaWxseVdvbmthIH0gZnJvbSAnLi93aWxseS13b25rYSc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE9vbXBhTG9vbXBhIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBsYXRlc3RGbGF2b3I6IGFueTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvLyBGSVhNRTogUmVxdWVzdCBJbmplY3RvciBvbmNlIHdlIG1vdmUgdG8gQW5ndWxhciA0LjIrLCBpdCdsbCBhbGxvdyBlYXNpZXIgcmVmYWN0b3JzXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihjZHI6IENoYW5nZURldGVjdG9yUmVmLCB3aWxseVdvbmthOiBXaWxseVdvbmthKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB3aWxseVdvbmthLmNob2NvbGF0ZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubGF0ZXN0Rmxhdm9yICE9PSB0aGlzLmZsYXZvcikge1xuICAgICAgICB3aWxseVdvbmthLmRpc2FibGVDaG9jb2xhdGVDaGVjayA9IHRydWU7XG4gICAgICAgIGNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHdpbGx5V29ua2EuZGlzYWJsZUNob2NvbGF0ZUNoZWNrID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBhYnN0cmFjdCBnZXQgZmxhdm9yKCk6IGFueTtcblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgdGhpcy5sYXRlc3RGbGF2b3IgPSB0aGlzLmZsYXZvcjtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==