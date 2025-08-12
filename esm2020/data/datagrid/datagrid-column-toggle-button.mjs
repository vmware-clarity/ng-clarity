/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Output } from '@angular/core';
import { DatagridColumnChanges } from './enums/column-changes.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "./providers/columns.service";
export class ClrDatagridColumnToggleButton {
    constructor(commonStrings, columnsService) {
        this.commonStrings = commonStrings;
        this.columnsService = columnsService;
        this.allSelected = new EventEmitter();
    }
    get clrAllSelected() {
        return this.allSelected.asObservable();
    }
    get allHideablesVisible() {
        return this.hideableColumns().filter(column => column.value.hidden).length === 0;
    }
    selectAll() {
        this.hideableColumns().forEach(hideableColumn => this.columnsService.emitStateChange(hideableColumn, {
            hidden: false,
            changes: [DatagridColumnChanges.HIDDEN],
        }));
        this.allSelected.next(true);
    }
    hideableColumns() {
        return this.columnsService.columns.filter(column => column.value.hideable);
    }
}
ClrDatagridColumnToggleButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnToggleButton, deps: [{ token: i1.ClrCommonStringsService }, { token: i2.ColumnsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridColumnToggleButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridColumnToggleButton, selector: "clr-dg-column-toggle-button", outputs: { clrAllSelected: "clrAllSelected" }, ngImport: i0, template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnToggleButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-toggle-button',
                    template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }, { type: i2.ColumnsService }]; }, propDecorators: { clrAllSelected: [{
                type: Output,
                args: ['clrAllSelected']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLXRvZ2dsZS1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLWNvbHVtbi10b2dnbGUtYnV0dG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSWhFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7O0FBaUJwRSxNQUFNLE9BQU8sNkJBQTZCO0lBR3hDLFlBQW1CLGFBQXNDLEVBQVUsY0FBOEI7UUFBOUUsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBRnpGLGdCQUFXLEdBQXFCLElBQUksWUFBWSxFQUFFLENBQUM7SUFFeUMsQ0FBQztJQUVyRyxJQUNJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQzlDLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRTtZQUNsRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQztTQUN4QyxDQUFDLENBQ0gsQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyxlQUFlO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RSxDQUFDOzswSEExQlUsNkJBQTZCOzhHQUE3Qiw2QkFBNkIsa0hBWDlCOzs7Ozs7Ozs7R0FTVDsyRkFFVSw2QkFBNkI7a0JBYnpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsUUFBUSxFQUFFOzs7Ozs7Ozs7R0FTVDtpQkFDRjsySUFPSyxjQUFjO3NCQURqQixNQUFNO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGFncmlkQ29sdW1uQ2hhbmdlcyB9IGZyb20gJy4vZW51bXMvY29sdW1uLWNoYW5nZXMuZW51bSc7XG5pbXBvcnQgeyBDb2x1bW5TdGF0ZSB9IGZyb20gJy4vaW50ZXJmYWNlcy9jb2x1bW4tc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLWNvbHVtbi10b2dnbGUtYnV0dG9uJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cImJ0biBidG4tc20gYnRuLWxpbmsgc3dpdGNoLWJ1dHRvblwiXG4gICAgICAoY2xpY2spPVwic2VsZWN0QWxsKClcIlxuICAgICAgW2Rpc2FibGVkXT1cImFsbEhpZGVhYmxlc1Zpc2libGVcIlxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgPlxuICAgICAge3sgY29tbW9uU3RyaW5ncy5rZXlzLnNlbGVjdEFsbCB9fVxuICAgIDwvYnV0dG9uPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZENvbHVtblRvZ2dsZUJ1dHRvbiB7XG4gIHByaXZhdGUgYWxsU2VsZWN0ZWQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLCBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSkge31cblxuICBAT3V0cHV0KCdjbHJBbGxTZWxlY3RlZCcpXG4gIGdldCBjbHJBbGxTZWxlY3RlZCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5hbGxTZWxlY3RlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBhbGxIaWRlYWJsZXNWaXNpYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmhpZGVhYmxlQ29sdW1ucygpLmZpbHRlcihjb2x1bW4gPT4gY29sdW1uLnZhbHVlLmhpZGRlbikubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuaGlkZWFibGVDb2x1bW5zKCkuZm9yRWFjaChoaWRlYWJsZUNvbHVtbiA9PlxuICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5lbWl0U3RhdGVDaGFuZ2UoaGlkZWFibGVDb2x1bW4sIHtcbiAgICAgICAgaGlkZGVuOiBmYWxzZSxcbiAgICAgICAgY2hhbmdlczogW0RhdGFncmlkQ29sdW1uQ2hhbmdlcy5ISURERU5dLFxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMuYWxsU2VsZWN0ZWQubmV4dCh0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZWFibGVDb2x1bW5zKCk6IEJlaGF2aW9yU3ViamVjdDxDb2x1bW5TdGF0ZT5bXSB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1ucy5maWx0ZXIoY29sdW1uID0+IGNvbHVtbi52YWx1ZS5oaWRlYWJsZSk7XG4gIH1cbn1cbiJdfQ==