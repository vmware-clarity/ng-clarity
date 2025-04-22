/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, Input } from '@angular/core';
import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import * as i0 from "@angular/core";
export class ClrSpinner {
    /**
     * Default class for all spinners. This class is always true
     */
    get spinnerClass() {
        return true;
    }
    get inlineClass() {
        return this._inline;
    }
    set clrInline(value) {
        this._inline = isBooleanAttributeSet(value);
    }
    get inverseClass() {
        return this._inverse;
    }
    set clrInverse(value) {
        this._inverse = isBooleanAttributeSet(value);
    }
    get smallClass() {
        return this._small;
    }
    set clrSmall(value) {
        this._small = isBooleanAttributeSet(value);
    }
    /**
     * When clrSmall & clrMedium are set both to true.
     * The CSS with high priority will be small - so medium size will be ignored.
     *
     * For this reason if clrSmall is set we won't add clrMedium class.
     *
     * NOTE: This is dictated by the CSS rules.
     * DON'T USE clrSmall & clrMedium to toggle classes. This could change without notice.
     *
     * Also there is no logical need to have both of them set to TRUE or FALSE.
     */
    get mediumClass() {
        if (this._small) {
            return false;
        }
        return this._medium;
    }
    set clrMedium(value) {
        this._medium = isBooleanAttributeSet(value);
    }
}
ClrSpinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSpinner, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrSpinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSpinner, selector: "clr-spinner", inputs: { clrInline: "clrInline", clrInverse: "clrInverse", clrSmall: "clrSmall", clrMedium: "clrMedium" }, host: { properties: { "attr.aria-busy": "true", "class.spinner": "this.spinnerClass", "class.spinner-inline": "this.inlineClass", "class.spinner-inverse": "this.inverseClass", "class.spinner-sm": "this.smallClass", "class.spinner-md": "this.mediumClass" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSpinner, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-spinner',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[attr.aria-busy]': 'true',
                    },
                }]
        }], propDecorators: { spinnerClass: [{
                type: HostBinding,
                args: ['class.spinner']
            }], inlineClass: [{
                type: HostBinding,
                args: ['class.spinner-inline']
            }], clrInline: [{
                type: Input,
                args: ['clrInline']
            }], inverseClass: [{
                type: HostBinding,
                args: ['class.spinner-inverse']
            }], clrInverse: [{
                type: Input,
                args: ['clrInverse']
            }], smallClass: [{
                type: HostBinding,
                args: ['class.spinner-sm']
            }], clrSmall: [{
                type: Input,
                args: ['clrSmall']
            }], mediumClass: [{
                type: HostBinding,
                args: ['class.spinner-md']
            }], clrMedium: [{
                type: Input,
                args: ['clrMedium']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3Byb2dyZXNzL3NwaW5uZXIvc3Bpbm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7QUFTdkYsTUFBTSxPQUFPLFVBQVU7SUFNckI7O09BRUc7SUFDSCxJQUNJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQ0ksU0FBUyxDQUFDLEtBQXVCO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQ0ksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFDSSxVQUFVLENBQUMsS0FBdUI7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFDSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUNJLFFBQVEsQ0FBQyxLQUF1QjtRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsSUFDSSxXQUFXO1FBQ2IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFDSSxTQUFTLENBQUMsS0FBdUI7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDOzt1R0FsRVUsVUFBVTsyRkFBVixVQUFVLGthQUxYLDJCQUEyQjsyRkFLMUIsVUFBVTtrQkFQdEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLE1BQU07cUJBQzNCO2lCQUNGOzhCQVdLLFlBQVk7c0JBRGYsV0FBVzt1QkFBQyxlQUFlO2dCQU14QixXQUFXO3NCQURkLFdBQVc7dUJBQUMsc0JBQXNCO2dCQU0vQixTQUFTO3NCQURaLEtBQUs7dUJBQUMsV0FBVztnQkFNZCxZQUFZO3NCQURmLFdBQVc7dUJBQUMsdUJBQXVCO2dCQU1oQyxVQUFVO3NCQURiLEtBQUs7dUJBQUMsWUFBWTtnQkFNZixVQUFVO3NCQURiLFdBQVc7dUJBQUMsa0JBQWtCO2dCQU0zQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsVUFBVTtnQkFpQmIsV0FBVztzQkFEZCxXQUFXO3VCQUFDLGtCQUFrQjtnQkFTM0IsU0FBUztzQkFEWixLQUFLO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbXBvbmVudC9pcy1ib29sZWFuLWF0dHJpYnV0ZS1zZXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItc3Bpbm5lcicsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuYXJpYS1idXN5XSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU3Bpbm5lciB7XG4gIHByaXZhdGUgX2lubGluZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaW52ZXJzZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfc21hbGw6IGJvb2xlYW47XG4gIHByaXZhdGUgX21lZGl1bTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVmYXVsdCBjbGFzcyBmb3IgYWxsIHNwaW5uZXJzLiBUaGlzIGNsYXNzIGlzIGFsd2F5cyB0cnVlXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNwaW5uZXInKVxuICBnZXQgc3Bpbm5lckNsYXNzKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zcGlubmVyLWlubGluZScpXG4gIGdldCBpbmxpbmVDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5faW5saW5lO1xuICB9XG5cbiAgQElucHV0KCdjbHJJbmxpbmUnKVxuICBzZXQgY2xySW5saW5lKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5faW5saW5lID0gaXNCb29sZWFuQXR0cmlidXRlU2V0KHZhbHVlKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc3Bpbm5lci1pbnZlcnNlJylcbiAgZ2V0IGludmVyc2VDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5faW52ZXJzZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xySW52ZXJzZScpXG4gIHNldCBjbHJJbnZlcnNlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5faW52ZXJzZSA9IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNwaW5uZXItc20nKVxuICBnZXQgc21hbGxDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc21hbGw7XG4gIH1cblxuICBASW5wdXQoJ2NsclNtYWxsJylcbiAgc2V0IGNsclNtYWxsKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fc21hbGwgPSBpc0Jvb2xlYW5BdHRyaWJ1dGVTZXQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gY2xyU21hbGwgJiBjbHJNZWRpdW0gYXJlIHNldCBib3RoIHRvIHRydWUuXG4gICAqIFRoZSBDU1Mgd2l0aCBoaWdoIHByaW9yaXR5IHdpbGwgYmUgc21hbGwgLSBzbyBtZWRpdW0gc2l6ZSB3aWxsIGJlIGlnbm9yZWQuXG4gICAqXG4gICAqIEZvciB0aGlzIHJlYXNvbiBpZiBjbHJTbWFsbCBpcyBzZXQgd2Ugd29uJ3QgYWRkIGNsck1lZGl1bSBjbGFzcy5cbiAgICpcbiAgICogTk9URTogVGhpcyBpcyBkaWN0YXRlZCBieSB0aGUgQ1NTIHJ1bGVzLlxuICAgKiBET04nVCBVU0UgY2xyU21hbGwgJiBjbHJNZWRpdW0gdG8gdG9nZ2xlIGNsYXNzZXMuIFRoaXMgY291bGQgY2hhbmdlIHdpdGhvdXQgbm90aWNlLlxuICAgKlxuICAgKiBBbHNvIHRoZXJlIGlzIG5vIGxvZ2ljYWwgbmVlZCB0byBoYXZlIGJvdGggb2YgdGhlbSBzZXQgdG8gVFJVRSBvciBGQUxTRS5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3Muc3Bpbm5lci1tZCcpXG4gIGdldCBtZWRpdW1DbGFzcygpIHtcbiAgICBpZiAodGhpcy5fc21hbGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lZGl1bTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyTWVkaXVtJylcbiAgc2V0IGNsck1lZGl1bSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuX21lZGl1bSA9IGlzQm9vbGVhbkF0dHJpYnV0ZVNldCh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==