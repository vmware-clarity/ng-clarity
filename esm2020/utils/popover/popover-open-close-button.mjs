/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/popover-toggle.service";
export class ClrPopoverOpenCloseButton {
    constructor(smartOpenService) {
        this.smartOpenService = smartOpenService;
        this.openCloseChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(smartOpenService.openChange.subscribe(change => {
            this.openCloseChange.next(change);
        }));
    }
    handleClick(event) {
        this.smartOpenService.toggleWithEvent(event);
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrPopoverOpenCloseButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverOpenCloseButton, deps: [{ token: i1.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Directive });
ClrPopoverOpenCloseButton.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: { openCloseChange: "clrPopoverOpenCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-open-close": "true" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverOpenCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverOpenCloseButton]',
                    host: {
                        '[class.clr-smart-open-close]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverToggleService }]; }, propDecorators: { openCloseChange: [{
                type: Output,
                args: ['clrPopoverOpenCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1vcGVuLWNsb3NlLWJ1dHRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1vcGVuLWNsb3NlLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBYSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVd6RixNQUFNLE9BQU8seUJBQXlCO0lBS3BDLFlBQW9CLGdCQUF5QztRQUF6QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXlCO1FBSnhCLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUUzRSxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFHekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFHRCxXQUFXLENBQUMsS0FBaUI7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7c0hBcEJVLHlCQUF5QjswR0FBekIseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBTnJDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtvQkFDdkMsSUFBSSxFQUFFO3dCQUNKLDhCQUE4QixFQUFFLE1BQU07cUJBQ3ZDO2lCQUNGOzhHQUVzQyxlQUFlO3NCQUFuRCxNQUFNO3VCQUFDLDJCQUEyQjtnQkFhbkMsV0FBVztzQkFEVixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgT25EZXN0cm95LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyUG9wb3Zlck9wZW5DbG9zZUJ1dHRvbl0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItc21hcnQtb3Blbi1jbG9zZV0nOiAndHJ1ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclBvcG92ZXJPcGVuQ2xvc2VCdXR0b24gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdjbHJQb3BvdmVyT3BlbkNsb3NlQ2hhbmdlJykgb3BlbkNsb3NlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNtYXJ0T3BlblNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBzbWFydE9wZW5TZXJ2aWNlLm9wZW5DaGFuZ2Uuc3Vic2NyaWJlKGNoYW5nZSA9PiB7XG4gICAgICAgIHRoaXMub3BlbkNsb3NlQ2hhbmdlLm5leHQoY2hhbmdlKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLnNtYXJ0T3BlblNlcnZpY2UudG9nZ2xlV2l0aEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cbn1cbiJdfQ==