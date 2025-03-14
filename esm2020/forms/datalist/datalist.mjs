/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/datalist-id.service";
export class ClrDatalist {
    constructor(datalistIdService) {
        this.datalistIdService = datalistIdService;
        this.subscriptions = [];
    }
    set id(idValue) {
        if (!!idValue && this.datalistIdService) {
            this.datalistId = idValue;
            this.datalistIdService.id = idValue;
        }
        else if (idValue) {
            this.datalistId = idValue;
        }
    }
    ngAfterContentInit() {
        if (!this.datalistIdService) {
            return;
        }
        this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.datalistId = id)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrDatalist.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalist, deps: [{ token: i1.DatalistIdService, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatalist.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatalist, selector: "datalist", inputs: { id: "id" }, host: { properties: { "id": "datalistId" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalist, decorators: [{
            type: Directive,
            args: [{
                    selector: 'datalist',
                    host: {
                        '[id]': 'datalistId',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.DatalistIdService, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRhbGlzdC9kYXRhbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBb0IsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVc3RSxNQUFNLE9BQU8sV0FBVztJQUt0QixZQUFnQyxpQkFBb0M7UUFBcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUY1RCxrQkFBYSxHQUFtQixFQUFFLENBQUM7SUFFNEIsQ0FBQztJQUV4RSxJQUNJLEVBQUUsQ0FBQyxPQUFlO1FBQ3BCLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDckM7YUFBTSxJQUFJLE9BQU8sRUFBRTtZQUNsQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7O3dHQTFCVSxXQUFXOzRGQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFOdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsSUFBSSxFQUFFO3dCQUNKLE1BQU0sRUFBRSxZQUFZO3FCQUNyQjtpQkFDRjs7MEJBTWMsUUFBUTs0Q0FHakIsRUFBRTtzQkFETCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBEaXJlY3RpdmUsIElucHV0LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IERhdGFsaXN0SWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0YWxpc3QtaWQuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2RhdGFsaXN0JyxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ2RhdGFsaXN0SWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhbGlzdCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBkYXRhbGlzdElkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgZGF0YWxpc3RJZFNlcnZpY2U6IERhdGFsaXN0SWRTZXJ2aWNlKSB7fVxuXG4gIEBJbnB1dCgpXG4gIHNldCBpZChpZFZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoISFpZFZhbHVlICYmIHRoaXMuZGF0YWxpc3RJZFNlcnZpY2UpIHtcbiAgICAgIHRoaXMuZGF0YWxpc3RJZCA9IGlkVmFsdWU7XG4gICAgICB0aGlzLmRhdGFsaXN0SWRTZXJ2aWNlLmlkID0gaWRWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKGlkVmFsdWUpIHtcbiAgICAgIHRoaXMuZGF0YWxpc3RJZCA9IGlkVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICghdGhpcy5kYXRhbGlzdElkU2VydmljZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmRhdGFsaXN0SWRTZXJ2aWNlLmlkQ2hhbmdlLnN1YnNjcmliZShpZCA9PiAodGhpcy5kYXRhbGlzdElkID0gaWQpKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=