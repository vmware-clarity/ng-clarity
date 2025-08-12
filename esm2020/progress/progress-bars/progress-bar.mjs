/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, Input } from '@angular/core';
import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ClrProgressBar {
    constructor() {
        this.max = 100;
        /*
         * No need to convert to `number` cause we could have
         * floating point and parseInt will round the numbers
         *
         * working with string won't have any side-effects,
         * we don't do any math so string will do the job.
         */
        this.value = 0;
        this.externalId = '';
    }
    get id() {
        return this._ID;
    }
    set id(value) {
        this._ID = value;
        this.externalId = null;
    }
    get progressClass() {
        return true;
    }
    set clrCompact(value) {
        this._compact = isBooleanAttributeSet(value);
    }
    get compactClass() {
        return this._compact;
    }
    set clrLabeled(value) {
        this._labeled = isBooleanAttributeSet(value);
    }
    get labeledClass() {
        return this._labeled;
    }
    set clrFade(value) {
        this._fade = isBooleanAttributeSet(value);
    }
    get fadeClass() {
        return this._fade;
    }
    set clrLoop(value) {
        this._loop = isBooleanAttributeSet(value);
    }
    get loopClass() {
        return this._loop;
    }
    get warningClass() {
        return this.color === 'warning';
    }
    get successClass() {
        return this.color === 'success';
    }
    get dangerClass() {
        return this.color === 'danger';
    }
    set clrFlash(value) {
        this._flash = isBooleanAttributeSet(value);
    }
    get flashClass() {
        return this._flash;
    }
    /** @deprecated since 2.0, remove in 4.0 */
    set clrFlashDanger(value) {
        this._flashDanger = isBooleanAttributeSet(value);
    }
    get flashDangerClass() {
        return this._flashDanger;
    }
    /**
     * Make sure that we always will have something that is readable
     * for the screen reader
     */
    get displayValue() {
        if (this.displayval) {
            return this.displayval;
        }
        return `${this.value || 0}%`;
    }
    /**
     * Display optional text only when labeled is eneabled
     */
    displayStringValue() {
        return this._labeled;
    }
}
ClrProgressBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrProgressBar, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrProgressBar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrProgressBar, selector: "clr-progress-bar", inputs: { max: ["clrMax", "max"], displayval: ["clrDisplayval", "displayval"], color: ["clrColor", "color"], value: ["clrValue", "value"], id: "id", clrCompact: "clrCompact", clrLabeled: "clrLabeled", clrFade: "clrFade", clrLoop: "clrLoop", clrFlash: "clrFlash", clrFlashDanger: "clrFlashDanger" }, host: { properties: { "attr.id": "this.externalId", "class.progress": "this.progressClass", "class.compact": "this.compactClass", "class.labeled": "this.labeledClass", "class.progress-fade": "this.fadeClass", "class.loop": "this.loopClass", "class.warning": "this.warningClass", "class.success": "this.successClass", "class.danger": "this.dangerClass", "class.flash": "this.flashClass", "class.flash-danger": "this.flashDangerClass" } }, ngImport: i0, template: `
    <progress [id]="id" [attr.max]="max" [attr.value]="value" [attr.data-displayval]="displayValue"></progress>
    <span *ngIf="displayStringValue()">{{ displayValue }}</span>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrProgressBar, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-progress-bar',
                    template: `
    <progress [id]="id" [attr.max]="max" [attr.value]="value" [attr.data-displayval]="displayValue"></progress>
    <span *ngIf="displayStringValue()">{{ displayValue }}</span>
  `,
                }]
        }], propDecorators: { max: [{
                type: Input,
                args: ['clrMax']
            }], displayval: [{
                type: Input,
                args: ['clrDisplayval']
            }], color: [{
                type: Input,
                args: ['clrColor']
            }], value: [{
                type: Input,
                args: ['clrValue']
            }], externalId: [{
                type: HostBinding,
                args: ['attr.id']
            }], id: [{
                type: Input
            }], progressClass: [{
                type: HostBinding,
                args: ['class.progress']
            }], clrCompact: [{
                type: Input,
                args: ['clrCompact']
            }], compactClass: [{
                type: HostBinding,
                args: ['class.compact']
            }], clrLabeled: [{
                type: Input,
                args: ['clrLabeled']
            }], labeledClass: [{
                type: HostBinding,
                args: ['class.labeled']
            }], clrFade: [{
                type: Input,
                args: ['clrFade']
            }], fadeClass: [{
                type: HostBinding,
                args: ['class.progress-fade']
            }], clrLoop: [{
                type: Input,
                args: ['clrLoop']
            }], loopClass: [{
                type: HostBinding,
                args: ['class.loop']
            }], warningClass: [{
                type: HostBinding,
                args: ['class.warning']
            }], successClass: [{
                type: HostBinding,
                args: ['class.success']
            }], dangerClass: [{
                type: HostBinding,
                args: ['class.danger']
            }], clrFlash: [{
                type: Input,
                args: ['clrFlash']
            }], flashClass: [{
                type: HostBinding,
                args: ['class.flash']
            }], clrFlashDanger: [{
                type: Input,
                args: ['clrFlashDanger']
            }], flashDangerClass: [{
                type: HostBinding,
                args: ['class.flash-danger']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcHJvZ3Jlc3MvcHJvZ3Jlc3MtYmFycy9wcm9ncmVzcy1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQVN2RixNQUFNLE9BQU8sY0FBYztJQVAzQjtRQVFtQixRQUFHLEdBQW9CLEdBQUcsQ0FBQztRQUk1Qzs7Ozs7O1dBTUc7UUFDZ0IsVUFBSyxHQUFvQixDQUFDLENBQUM7UUFFdEIsZUFBVSxHQUFHLEVBQUUsQ0FBQztLQXFIekM7SUEzR0MsSUFDSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUNJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUNJLFVBQVUsQ0FBQyxLQUF1QjtRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUNJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQ0ksVUFBVSxDQUFDLEtBQXVCO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQ0ksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLFFB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QUFVO3NCQURiLFdBQVc7dUJBQUMsYUFBYTtnQkFPdEIsY0FBYztzQkFEakIsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBTW5CLGdCQUFnQjtzQkFEbkIsV0FBVzt1QkFBQyxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbXBvbmVudC9pcy1ib29sZWFuLWF0dHJpYnV0ZS1zZXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItcHJvZ3Jlc3MtYmFyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8cHJvZ3Jlc3MgW2lkXT1cImlkXCIgW2F0dHIubWF4XT1cIm1heFwiIFthdHRyLnZhbHVlXT1cInZhbHVlXCIgW2F0dHIuZGF0YS1kaXNwbGF5dmFsXT1cImRpc3BsYXlWYWx1ZVwiPjwvcHJvZ3Jlc3M+XG4gICAgPHNwYW4gKm5nSWY9XCJkaXNwbGF5U3RyaW5nVmFsdWUoKVwiPnt7IGRpc3BsYXlWYWx1ZSB9fTwvc3Bhbj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUHJvZ3Jlc3NCYXIge1xuICBASW5wdXQoJ2Nsck1heCcpIG1heDogbnVtYmVyIHwgc3RyaW5nID0gMTAwO1xuICBASW5wdXQoJ2NsckRpc3BsYXl2YWwnKSBkaXNwbGF5dmFsOiBzdHJpbmc7XG4gIEBJbnB1dCgnY2xyQ29sb3InKSBjb2xvcjogc3RyaW5nO1xuXG4gIC8qXG4gICAqIE5vIG5lZWQgdG8gY29udmVydCB0byBgbnVtYmVyYCBjYXVzZSB3ZSBjb3VsZCBoYXZlXG4gICAqIGZsb2F0aW5nIHBvaW50IGFuZCBwYXJzZUludCB3aWxsIHJvdW5kIHRoZSBudW1iZXJzXG4gICAqXG4gICAqIHdvcmtpbmcgd2l0aCBzdHJpbmcgd29uJ3QgaGF2ZSBhbnkgc2lkZS1lZmZlY3RzLFxuICAgKiB3ZSBkb24ndCBkbyBhbnkgbWF0aCBzbyBzdHJpbmcgd2lsbCBkbyB0aGUgam9iLlxuICAgKi9cbiAgQElucHV0KCdjbHJWYWx1ZScpIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgPSAwO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5pZCcpIGV4dGVybmFsSWQgPSAnJztcblxuICBwcml2YXRlIF9JRDogc3RyaW5nO1xuICBwcml2YXRlIF9sYWJlbGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9mYWRlOiBib29sZWFuO1xuICBwcml2YXRlIF9sb29wOiBib29sZWFuO1xuICBwcml2YXRlIF9mbGFzaDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZmxhc2hEYW5nZXI6IGJvb2xlYW47XG4gIHByaXZhdGUgX2NvbXBhY3Q6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9JRDtcbiAgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX0lEID0gdmFsdWU7XG4gICAgdGhpcy5leHRlcm5hbElkID0gbnVsbDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucHJvZ3Jlc3MnKVxuICBnZXQgcHJvZ3Jlc3NDbGFzcygpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyQ29tcGFjdCcpXG4gIHNldCBjbHJDb21wYWN0KHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fY29tcGFjdCA9IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmNvbXBhY3QnKVxuICBnZXQgY29tcGFjdENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wYWN0O1xuICB9XG5cbiAgQElucHV0KCdjbHJMYWJlbGVkJylcbiAgc2V0IGNsckxhYmVsZWQodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLl9sYWJlbGVkID0gaXNCb29sZWFuQXR0cmlidXRlU2V0KHZhbHVlKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MubGFiZWxlZCcpXG4gIGdldCBsYWJlbGVkQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsZWQ7XG4gIH1cblxuICBASW5wdXQoJ2NsckZhZGUnKVxuICBzZXQgY2xyRmFkZSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuX2ZhZGUgPSBpc0Jvb2xlYW5BdHRyaWJ1dGVTZXQodmFsdWUpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wcm9ncmVzcy1mYWRlJylcbiAgZ2V0IGZhZGVDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZmFkZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyTG9vcCcpXG4gIHNldCBjbHJMb29wKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fbG9vcCA9IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmxvb3AnKVxuICBnZXQgbG9vcENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9sb29wO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy53YXJuaW5nJylcbiAgZ2V0IHdhcm5pbmdDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xvciA9PT0gJ3dhcm5pbmcnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zdWNjZXNzJylcbiAgZ2V0IHN1Y2Nlc3NDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xvciA9PT0gJ3N1Y2Nlc3MnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kYW5nZXInKVxuICBnZXQgZGFuZ2VyQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3IgPT09ICdkYW5nZXInO1xuICB9XG5cbiAgQElucHV0KCdjbHJGbGFzaCcpXG4gIHNldCBjbHJGbGFzaCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuX2ZsYXNoID0gaXNCb29sZWFuQXR0cmlidXRlU2V0KHZhbHVlKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZmxhc2gnKVxuICBnZXQgZmxhc2hDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fZmxhc2g7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgc2luY2UgMi4wLCByZW1vdmUgaW4gNC4wICovXG4gIEBJbnB1dCgnY2xyRmxhc2hEYW5nZXInKVxuICBzZXQgY2xyRmxhc2hEYW5nZXIodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICB0aGlzLl9mbGFzaERhbmdlciA9IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmZsYXNoLWRhbmdlcicpXG4gIGdldCBmbGFzaERhbmdlckNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9mbGFzaERhbmdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHN1cmUgdGhhdCB3ZSBhbHdheXMgd2lsbCBoYXZlIHNvbWV0aGluZyB0aGF0IGlzIHJlYWRhYmxlXG4gICAqIGZvciB0aGUgc2NyZWVuIHJlYWRlclxuICAgKi9cbiAgZ2V0IGRpc3BsYXlWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5kaXNwbGF5dmFsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwbGF5dmFsO1xuICAgIH1cbiAgICByZXR1cm4gYCR7dGhpcy52YWx1ZSB8fCAwfSVgO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgb3B0aW9uYWwgdGV4dCBvbmx5IHdoZW4gbGFiZWxlZCBpcyBlbmVhYmxlZFxuICAgKi9cbiAgZGlzcGxheVN0cmluZ1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbGVkO1xuICB9XG59XG4iXX0=