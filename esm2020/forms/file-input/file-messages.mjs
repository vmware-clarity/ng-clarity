/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, inject, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT = new InjectionToken('ClrFileMessagesTemplateContext');
export class ClrFileInfo {
}
ClrFileInfo.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInfo, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrFileInfo.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInfo, selector: "clr-file-info", host: { properties: { "class.clr-subtext": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInfo, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-info',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                    },
                }]
        }] });
export class ClrFileSuccess {
    constructor() {
        this.context = inject(CLR_FILE_MESSAGES_TEMPLATE_CONTEXT);
    }
}
ClrFileSuccess.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileSuccess, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrFileSuccess.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileSuccess, selector: "clr-file-success", host: { properties: { "style.display": "context.success ? \"inline-block\" : \"none\"", "class.clr-subtext": "true", "class.success": "true" } }, ngImport: i0, template: `<ng-content *ngIf="context.success"></ng-content>`, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileSuccess, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-success',
                    // We check for success here so that consumers don't have to.
                    template: `<ng-content *ngIf="context.success"></ng-content>`,
                    host: {
                        '[style.display]': 'context.success ? "inline-block" : "none"',
                        '[class.clr-subtext]': 'true',
                        '[class.success]': 'true',
                    },
                }]
        }] });
export class ClrFileError {
}
ClrFileError.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileError, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrFileError.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileError, selector: "clr-file-error", host: { properties: { "class.clr-subtext": "true", "class.error": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileError, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-file-error',
                    // The host should have an `*ngIf` or `@if` that checks for the relevant error.
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-subtext]': 'true',
                        '[class.error]': 'true',
                    },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tZXNzYWdlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1tZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSWxFLE1BQU0sQ0FBQyxNQUFNLGtDQUFrQyxHQUFHLElBQUksY0FBYyxDQUNsRSxnQ0FBZ0MsQ0FDakMsQ0FBQztBQVNGLE1BQU0sT0FBTyxXQUFXOzt3R0FBWCxXQUFXOzRGQUFYLFdBQVcsNEdBTFosMkJBQTJCOzJGQUsxQixXQUFXO2tCQVB2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0oscUJBQXFCLEVBQUUsTUFBTTtxQkFDOUI7aUJBQ0Y7O0FBYUQsTUFBTSxPQUFPLGNBQWM7SUFWM0I7UUFXcUIsWUFBTyxHQUFtQyxNQUFNLENBQUMsa0NBQWtDLENBQUMsQ0FBQztLQUN6Rzs7MkdBRlksY0FBYzsrRkFBZCxjQUFjLDBNQVBmLG1EQUFtRDsyRkFPbEQsY0FBYztrQkFWMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1Qiw2REFBNkQ7b0JBQzdELFFBQVEsRUFBRSxtREFBbUQ7b0JBQzdELElBQUksRUFBRTt3QkFDSixpQkFBaUIsRUFBRSwyQ0FBMkM7d0JBQzlELHFCQUFxQixFQUFFLE1BQU07d0JBQzdCLGlCQUFpQixFQUFFLE1BQU07cUJBQzFCO2lCQUNGOztBQWNELE1BQU0sT0FBTyxZQUFZOzt5R0FBWixZQUFZOzZGQUFaLFlBQVksb0lBTmIsMkJBQTJCOzJGQU0xQixZQUFZO2tCQVR4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLCtFQUErRTtvQkFDL0UsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLHFCQUFxQixFQUFFLE1BQU07d0JBQzdCLGVBQWUsRUFBRSxNQUFNO3FCQUN4QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBpbmplY3QsIEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dCB9IGZyb20gJy4vZmlsZS1tZXNzYWdlcy10ZW1wbGF0ZSc7XG5cbmV4cG9ydCBjb25zdCBDTFJfRklMRV9NRVNTQUdFU19URU1QTEFURV9DT05URVhUID0gbmV3IEluamVjdGlvblRva2VuPENsckZpbGVNZXNzYWdlc1RlbXBsYXRlQ29udGV4dD4oXG4gICdDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZUNvbnRleHQnXG4pO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZmlsZS1pbmZvJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLXN1YnRleHRdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGaWxlSW5mbyB7fVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZmlsZS1zdWNjZXNzJyxcbiAgLy8gV2UgY2hlY2sgZm9yIHN1Y2Nlc3MgaGVyZSBzbyB0aGF0IGNvbnN1bWVycyBkb24ndCBoYXZlIHRvLlxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50ICpuZ0lmPVwiY29udGV4dC5zdWNjZXNzXCI+PC9uZy1jb250ZW50PmAsXG4gIGhvc3Q6IHtcbiAgICAnW3N0eWxlLmRpc3BsYXldJzogJ2NvbnRleHQuc3VjY2VzcyA/IFwiaW5saW5lLWJsb2NrXCIgOiBcIm5vbmVcIicsXG4gICAgJ1tjbGFzcy5jbHItc3VidGV4dF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5zdWNjZXNzXSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRmlsZVN1Y2Nlc3Mge1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGVDb250ZXh0ID0gaW5qZWN0KENMUl9GSUxFX01FU1NBR0VTX1RFTVBMQVRFX0NPTlRFWFQpO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZmlsZS1lcnJvcicsXG4gIC8vIFRoZSBob3N0IHNob3VsZCBoYXZlIGFuIGAqbmdJZmAgb3IgYEBpZmAgdGhhdCBjaGVja3MgZm9yIHRoZSByZWxldmFudCBlcnJvci5cbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLXN1YnRleHRdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZXJyb3JdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGaWxlRXJyb3Ige31cbiJdfQ==