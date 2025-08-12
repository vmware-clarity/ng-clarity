/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/layout.service";
export class ClrLayout {
    constructor(layoutService) {
        this.layoutService = layoutService;
    }
    ngOnInit() {
        // Only set the layout if it is a valid option
        if (this.layout && this.layoutService.isValid(this.layout)) {
            this.layoutService.layout = this.layout;
        }
    }
}
ClrLayout.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLayout, deps: [{ token: i1.LayoutService }], target: i0.ɵɵFactoryTarget.Directive });
ClrLayout.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrLayout, selector: "[clrForm][clrLayout]", inputs: { layout: ["clrLayout", "layout"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLayout, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrForm][clrLayout]',
                }]
        }], ctorParameters: function () { return [{ type: i1.LayoutService }]; }, propDecorators: { layout: [{
                type: Input,
                args: ['clrLayout']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tbW9uL2xheW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDOzs7QUFPekQsTUFBTSxPQUFPLFNBQVM7SUFHcEIsWUFBbUIsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFBRyxDQUFDO0lBRW5ELFFBQVE7UUFDTiw4Q0FBOEM7UUFDOUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQzs7c0dBVlUsU0FBUzswRkFBVCxTQUFTOzJGQUFULFNBQVM7a0JBSHJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtpQkFDakM7b0dBRXFCLE1BQU07c0JBQXpCLEtBQUs7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckZvcm1MYXlvdXQsIExheW91dFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sYXlvdXQuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJGb3JtXVtjbHJMYXlvdXRdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTGF5b3V0IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCdjbHJMYXlvdXQnKSBsYXlvdXQ6IENsckZvcm1MYXlvdXQgfCBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxheW91dFNlcnZpY2U6IExheW91dFNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gT25seSBzZXQgdGhlIGxheW91dCBpZiBpdCBpcyBhIHZhbGlkIG9wdGlvblxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0aGlzLmxheW91dFNlcnZpY2UuaXNWYWxpZCh0aGlzLmxheW91dCkpIHtcbiAgICAgIHRoaXMubGF5b3V0U2VydmljZS5sYXlvdXQgPSB0aGlzLmxheW91dDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==