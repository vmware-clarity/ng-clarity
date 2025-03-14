/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Inject, Optional } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { IF_ACTIVE_ID } from '../../../utils/conditional/if-active.service';
import * as i0 from "@angular/core";
import * as i1 from "./tabs-willy-wonka";
import * as i2 from "../../../utils/conditional/if-active.service";
export class ActiveOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, id, ifActive) {
        if (!willyWonka) {
            throw new Error('clrTabLink and clr-tab-content should only be used inside of a clr-tabs');
        }
        super(cdr, willyWonka);
        this.ifActive = ifActive;
        this.id = id;
    }
    get flavor() {
        return this.ifActive.current === this.id;
    }
}
ActiveOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ActiveOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.TabsWillyWonka, optional: true }, { token: IF_ACTIVE_ID }, { token: i2.IfActiveService }], target: i0.ɵɵFactoryTarget.Directive });
ActiveOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ActiveOompaLoompa, selector: "[clrTabLink], clr-tab-content", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ActiveOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink], clr-tab-content',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.TabsWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i2.IfActiveService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZlLW9vbXBhLWxvb21wYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2xheW91dC90YWJzL2Nob2NvbGF0ZS9hY3RpdmUtb29tcGEtbG9vbXBhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFxQixTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSw4Q0FBOEMsQ0FBQzs7OztBQU03RixNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztJQUloRCxZQUNFLEdBQXNCLEVBQ1YsVUFBMEIsRUFDaEIsRUFBVSxFQUNoQyxRQUF5QjtRQUV6QixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1NBQzVGO1FBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDM0MsQ0FBQzs7OEdBcEJVLGlCQUFpQixpR0FPbEIsWUFBWTtrR0FQWCxpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFIN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsK0JBQStCO2lCQUMxQzs7MEJBT0ksUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBJbmplY3QsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9vbXBhTG9vbXBhIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBJRl9BQ1RJVkVfSUQsIElmQWN0aXZlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWFjdGl2ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYnNXaWxseVdvbmthIH0gZnJvbSAnLi90YWJzLXdpbGx5LXdvbmthJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclRhYkxpbmtdLCBjbHItdGFiLWNvbnRlbnQnLFxufSlcbmV4cG9ydCBjbGFzcyBBY3RpdmVPb21wYUxvb21wYSBleHRlbmRzIE9vbXBhTG9vbXBhIHtcbiAgcHJpdmF0ZSBpZkFjdGl2ZTogSWZBY3RpdmVTZXJ2aWNlO1xuICBwcml2YXRlIGlkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSB3aWxseVdvbmthOiBUYWJzV2lsbHlXb25rYSxcbiAgICBASW5qZWN0KElGX0FDVElWRV9JRCkgaWQ6IG51bWJlcixcbiAgICBpZkFjdGl2ZTogSWZBY3RpdmVTZXJ2aWNlXG4gICkge1xuICAgIGlmICghd2lsbHlXb25rYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHJUYWJMaW5rIGFuZCBjbHItdGFiLWNvbnRlbnQgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnNpZGUgb2YgYSBjbHItdGFicycpO1xuICAgIH1cbiAgICBzdXBlcihjZHIsIHdpbGx5V29ua2EpO1xuICAgIHRoaXMuaWZBY3RpdmUgPSBpZkFjdGl2ZTtcbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cblxuICBnZXQgZmxhdm9yKCkge1xuICAgIHJldHVybiB0aGlzLmlmQWN0aXZlLmN1cnJlbnQgPT09IHRoaXMuaWQ7XG4gIH1cbn1cbiJdfQ==