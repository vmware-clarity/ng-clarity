/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Directive, Input } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import * as i0 from "@angular/core";
export class ClrStackViewCustomTags {
}
ClrStackViewCustomTags.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewCustomTags, deps: [], target: i0.ɵɵFactoryTarget.Directive });
ClrStackViewCustomTags.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrStackViewCustomTags, selector: "clr-stack-content", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewCustomTags, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-stack-content',
                }]
        }] });
export class ClrStackViewLabel {
    constructor() {
        this._generatedId = null;
        this._id = null;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        if (typeof val === 'string' && val !== '') {
            this._id = val;
        }
        else {
            this._id = this._generatedId + '';
        }
    }
    ngOnInit() {
        this._generatedId = 'clr-stack-label-' + uniqueIdFactory();
        if (!this.id) {
            this._id = this._generatedId + '';
        }
    }
}
ClrStackViewLabel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewLabel, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrStackViewLabel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrStackViewLabel, selector: "clr-stack-label", inputs: { id: "id" }, host: { properties: { "attr.id": "id" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewLabel, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-stack-label',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[attr.id]': 'id',
                    },
                }]
        }], propDecorators: { id: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stdmlldy1jdXN0b20tdGFncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvc3RhY2stdmlldy9zdGFjay12aWV3LWN1c3RvbS10YWdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRXBFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQzs7QUFLaEYsTUFBTSxPQUFPLHNCQUFzQjs7bUhBQXRCLHNCQUFzQjt1R0FBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBSGxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7O0FBYUQsTUFBTSxPQUFPLGlCQUFpQjtJQVA5QjtRQVFVLGlCQUFZLEdBQVcsSUFBSSxDQUFDO1FBRTVCLFFBQUcsR0FBVyxJQUFJLENBQUM7S0FxQjVCO0lBbkJDLElBQ0ksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDO0lBQ0QsSUFBSSxFQUFFLENBQUMsR0FBVztRQUNoQixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsWUFBWSxHQUFHLGtCQUFrQixHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1osSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUNuQztJQUNILENBQUM7OzhHQXZCVSxpQkFBaUI7a0dBQWpCLGlCQUFpQix3SEFMbEIsMkJBQTJCOzJGQUsxQixpQkFBaUI7a0JBUDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtpQkFDRjs4QkFPSyxFQUFFO3NCQURMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1zdGFjay1jb250ZW50Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU3RhY2tWaWV3Q3VzdG9tVGFncyB7XG4gIC8vIE5vIGJlaGF2aW9yXG4gIC8vIFRoZSBvbmx5IHB1cnBvc2UgaXMgdG8gXCJkZWNsYXJlXCIgdGhlIHRhZyBpbiBBbmd1bGFyXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1zdGFjay1sYWJlbCcsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU3RhY2tWaWV3TGFiZWwgaW1wbGVtZW50cyBPbkluaXQge1xuICBwcml2YXRlIF9nZW5lcmF0ZWRJZDogc3RyaW5nID0gbnVsbDtcblxuICBwcml2YXRlIF9pZDogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWw6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwgIT09ICcnKSB7XG4gICAgICB0aGlzLl9pZCA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faWQgPSB0aGlzLl9nZW5lcmF0ZWRJZCArICcnO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2dlbmVyYXRlZElkID0gJ2Nsci1zdGFjay1sYWJlbC0nICsgdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgIHRoaXMuX2lkID0gdGhpcy5fZ2VuZXJhdGVkSWQgKyAnJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==