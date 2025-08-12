/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Inject, Output } from '@angular/core';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { ColumnResizerService } from '../providers/column-resizer.service';
import { COLUMN_STATE, COLUMN_STATE_PROVIDER } from '../providers/column-state.provider';
import { HIDDEN_COLUMN_CLASS, STRICT_WIDTH_CLASS } from './constants';
import * as i0 from "@angular/core";
import * as i1 from "./render-organizer";
import * as i2 from "../../../utils/dom-adapter/dom-adapter";
import * as i3 from "../providers/column-resizer.service";
import * as i4 from "../providers/columns.service";
import * as i5 from "rxjs";
export class DatagridHeaderRenderer {
    constructor(el, renderer, organizer, domAdapter, columnResizerService, columnsService, columnState) {
        this.el = el;
        this.renderer = renderer;
        this.domAdapter = domAdapter;
        this.columnResizerService = columnResizerService;
        this.columnsService = columnsService;
        this.columnState = columnState;
        this.resizeEmitter = new EventEmitter();
        /**
         * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
         */
        this.widthSet = false;
        this.autoSet = false;
        this.subscriptions = [];
        this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth()));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    getColumnWidthState() {
        const strictWidth = this.detectStrictWidth();
        return {
            width: this.computeWidth(strictWidth),
            strictWidth: strictWidth,
        };
    }
    setColumnState(index) {
        this.columnsService.columns[index] = this.columnState;
    }
    setWidth(state) {
        if (state.strictWidth) {
            if (this.columnResizerService.resizedBy) {
                this.resizeEmitter.emit(state.width);
                this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
                this.widthSet = false;
            }
            // Don't set width if there is a user-defined one. Just add the strict width class.
            this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
            this.autoSet = false;
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
            this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
            this.widthSet = true;
            this.autoSet = true;
        }
    }
    setHidden(state) {
        if (state.hidden) {
            this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
    }
    clearWidth() {
        // remove the width only if we set it, and it is not changed by dragging.
        if (this.widthSet && !this.columnResizerService.resizedBy) {
            this.renderer.setStyle(this.el.nativeElement, 'width', null);
        }
        if (this.autoSet) {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        }
    }
    detectStrictWidth() {
        if (this.columnResizerService.resizedBy) {
            return this.columnResizerService.widthAfterResize;
        }
        else if (this.autoSet) {
            return 0;
        }
        else {
            return this.domAdapter.userDefinedWidth(this.el.nativeElement);
        }
    }
    computeWidth(strictWidth) {
        let width = strictWidth;
        if (!width) {
            width = this.domAdapter.scrollWidth(this.el.nativeElement);
        }
        return width;
    }
}
DatagridHeaderRenderer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridHeaderRenderer, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.DatagridRenderOrganizer }, { token: i2.DomAdapter }, { token: i3.ColumnResizerService }, { token: i4.ColumnsService }, { token: COLUMN_STATE }], target: i0.ɵɵFactoryTarget.Directive });
DatagridHeaderRenderer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: DatagridHeaderRenderer, selector: "clr-dg-column", outputs: { resizeEmitter: "clrDgColumnResize" }, providers: [ColumnResizerService, COLUMN_STATE_PROVIDER], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DatagridHeaderRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-column',
                    providers: [ColumnResizerService, COLUMN_STATE_PROVIDER],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.DatagridRenderOrganizer }, { type: i2.DomAdapter }, { type: i3.ColumnResizerService }, { type: i4.ColumnsService }, { type: i5.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [COLUMN_STATE]
                }] }]; }, propDecorators: { resizeEmitter: [{
                type: Output,
                args: ['clrDgColumnResize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXJlbmRlcmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9yZW5kZXIvaGVhZGVyLXJlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsTUFBTSxFQUFhLE1BQU0sRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUkxRyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUUvRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFFekYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sYUFBYSxDQUFDOzs7Ozs7O0FBT3RFLE1BQU0sT0FBTyxzQkFBc0I7SUFVakMsWUFDVSxFQUEyQixFQUMzQixRQUFtQixFQUMzQixTQUFrQyxFQUMxQixVQUFzQixFQUN0QixvQkFBMEMsRUFDMUMsY0FBOEIsRUFDUixXQUF5QztRQU4vRCxPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUMzQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBRW5CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUMxQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDUixnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7UUFoQjVDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUV4RTs7V0FFRztRQUNLLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFXekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJ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O1FBQ3ZCLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRTtZQUN2QyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQztTQUNuRDthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN2QixPQUFPLENBQUMsQ0FBQztTQUNWO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFTyxZQUFZLENBQUMsV0FBbUI7UUFDdEMsSUFBSSxLQUFLLEdBQVcsV0FBVyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM1RDtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7bUhBNUZVLHNCQUFzQix3TUFpQnZCLFlBQVk7dUdBakJYLHNCQUFzQix5RkFGdEIsQ0FBQyxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQzsyRkFFN0Msc0JBQXNCO2tCQUpsQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQztpQkFDekQ7OzBCQWtCSSxNQUFNOzJCQUFDLFlBQVk7NENBaEJPLGFBQWE7c0JBQXpDLE1BQU07dUJBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBPbkRlc3Ryb3ksIE91dHB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRSZW5kZXJTdGVwIH0gZnJvbSAnLi4vZW51bXMvcmVuZGVyLXN0ZXAuZW51bSc7XG5pbXBvcnQgeyBDb2x1bW5TdGF0ZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvY29sdW1uLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5SZXNpemVyU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9jb2x1bW4tcmVzaXplci5zZXJ2aWNlJztcbmltcG9ydCB7IENPTFVNTl9TVEFURSwgQ09MVU1OX1NUQVRFX1BST1ZJREVSIH0gZnJvbSAnLi4vcHJvdmlkZXJzL2NvbHVtbi1zdGF0ZS5wcm92aWRlcic7XG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4uL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSElEREVOX0NPTFVNTl9DTEFTUywgU1RSSUNUX1dJRFRIX0NMQVNTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIgfSBmcm9tICcuL3JlbmRlci1vcmdhbml6ZXInO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjbHItZGctY29sdW1uJyxcbiAgcHJvdmlkZXJzOiBbQ29sdW1uUmVzaXplclNlcnZpY2UsIENPTFVNTl9TVEFURV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIERhdGFncmlkSGVhZGVyUmVuZGVyZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdjbHJEZ0NvbHVtblJlc2l6ZScpIHJlc2l6ZUVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBjb2x1bW4gaGFzIGEgc3RyaWN0IHdpZHRoLCBzbyBpdCBkb2Vzbid0IHNocmluayBvciBleHBhbmQgYmFzZWQgb24gdGhlIGNvbnRlbnQuXG4gICAqL1xuICBwcml2YXRlIHdpZHRoU2V0ID0gZmFsc2U7XG4gIHByaXZhdGUgYXV0b1NldCA9IGZhbHNlO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIG9yZ2FuaXplcjogRGF0YWdyaWRSZW5kZXJPcmdhbml6ZXIsXG4gICAgcHJpdmF0ZSBkb21BZGFwdGVyOiBEb21BZGFwdGVyLFxuICAgIHByaXZhdGUgY29sdW1uUmVzaXplclNlcnZpY2U6IENvbHVtblJlc2l6ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlLFxuICAgIEBJbmplY3QoQ09MVU1OX1NUQVRFKSBwcml2YXRlIGNvbHVtblN0YXRlOiBCZWhhdmlvclN1YmplY3Q8Q29sdW1uU3RhdGU+XG4gICkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgb3JnYW5pemVyLmZpbHRlclJlbmRlclN0ZXBzKERhdGFncmlkUmVuZGVyU3RlcC5DTEVBUl9XSURUSFMpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsZWFyV2lkdGgoKSlcbiAgICApO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIGdldENvbHVtbldpZHRoU3RhdGUoKTogUGFydGlhbDxDb2x1bW5TdGF0ZT4ge1xuICAgIGNvbnN0IHN0cmljdFdpZHRoID0gdGhpcy5kZXRlY3RTdHJpY3RXaWR0aCgpO1xuICAgIHJldHVybiB7XG4gICAgICB3aWR0aDogdGhpcy5jb21wdXRlV2lkdGgoc3RyaWN0V2lkdGgpLFxuICAgICAgc3RyaWN0V2lkdGg6IHN0cmljdFdpZHRoLFxuICAgIH07XG4gIH1cblxuICBzZXRDb2x1bW5TdGF0ZShpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zW2luZGV4XSA9IHRoaXMuY29sdW1uU3RhdGU7XG4gIH1cblxuICBzZXRXaWR0aChzdGF0ZTogQ29sdW1uU3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuc3RyaWN0V2lkdGgpIHtcbiAgICAgIGlmICh0aGlzLmNvbHVtblJlc2l6ZXJTZXJ2aWNlLnJlc2l6ZWRCeSkge1xuICAgICAgICB0aGlzLnJlc2l6ZUVtaXR0ZXIuZW1pdChzdGF0ZS53aWR0aCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBzdGF0ZS53aWR0aCArICdweCcpO1xuICAgICAgICB0aGlzLndpZHRoU2V0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBEb24ndCBzZXQgd2lkdGggaWYgdGhlcmUgaXMgYSB1c2VyLWRlZmluZWQgb25lLiBKdXN0IGFkZCB0aGUgc3RyaWN0IHdpZHRoIGNsYXNzLlxuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFNUUklDVF9XSURUSF9DTEFTUyk7XG4gICAgICB0aGlzLmF1dG9TZXQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFNUUklDVF9XSURUSF9DTEFTUyk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgc3RhdGUud2lkdGggKyAncHgnKTtcbiAgICAgIHRoaXMud2lkdGhTZXQgPSB0cnVlO1xuICAgICAgdGhpcy5hdXRvU2V0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBzZXRIaWRkZW4oc3RhdGU6IENvbHVtblN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLmhpZGRlbikge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIEhJRERFTl9DT0xVTU5fQ0xBU1MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGVhcldpZHRoKCkge1xuICAgIC8vIHJlbW92ZSB0aGUgd2lkdGggb25seSBpZiB3ZSBzZXQgaXQsIGFuZCBpdCBpcyBub3QgY2hhbmdlZCBieSBkcmFnZ2luZy5cbiAgICBpZiAodGhpcy53aWR0aFNldCAmJiAhdGhpcy5jb2x1bW5SZXNpemVyU2VydmljZS5yZXNpemVkQnkpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBudWxsKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXV0b1NldCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFNUUklDVF9XSURUSF9DTEFTUyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RTdHJpY3RXaWR0aCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmNvbHVtblJlc2l6ZXJTZXJ2aWNlLnJlc2l6ZWRCeSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29sdW1uUmVzaXplclNlcnZpY2Uud2lkdGhBZnRlclJlc2l6ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b1NldCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRvbUFkYXB0ZXIudXNlckRlZmluZWRXaWR0aCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29tcHV0ZVdpZHRoKHN0cmljdFdpZHRoOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGxldCB3aWR0aDogbnVtYmVyID0gc3RyaWN0V2lkdGg7XG4gICAgaWYgKCF3aWR0aCkge1xuICAgICAgd2lkdGggPSB0aGlzLmRvbUFkYXB0ZXIuc2Nyb2xsV2lkdGgodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHdpZHRoO1xuICB9XG59XG4iXX0=