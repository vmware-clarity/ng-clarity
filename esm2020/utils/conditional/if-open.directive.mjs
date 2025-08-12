/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../popover/providers/popover-toggle.service";
/**********
 *
 * @class ClrIfOpen
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: ClrPopoverToggleService to maintain state between itself and the component
 * using it in the component template.
 *
 */
export class ClrIfOpen {
    constructor(toggleService, template, container) {
        this.toggleService = toggleService;
        this.template = template;
        this.container = container;
        /**********
         * @property openChange
         *
         * @description
         * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
         * used with de-structured / de-sugared syntax.
         */
        this.openChange = new EventEmitter(false);
        this.subscription = toggleService.openChange.subscribe(change => {
            this.updateView(change);
            this.openChange.emit(change);
        });
    }
    /**
     * @description
     * A property that gets/sets ClrPopoverToggleService.open with value.
     */
    get open() {
        return this.toggleService.open;
    }
    set open(value) {
        this.toggleService.open = value;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * @description
     * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     *
     * @param value
     */
    updateView(value) {
        if (value) {
            this.container.createEmbeddedView(this.template);
        }
        else {
            this.container.clear();
        }
    }
}
ClrIfOpen.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfOpen, deps: [{ token: i1.ClrPopoverToggleService }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfOpen.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfOpen, selector: "[clrIfOpen]", inputs: { open: ["clrIfOpen", "open"] }, outputs: { openChange: "clrIfOpenChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfOpen, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfOpen]',
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverToggleService }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; }, propDecorators: { openChange: [{
                type: Output,
                args: ['clrIfOpenChange']
            }], open: [{
                type: Input,
                args: ['clrIfOpen']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtb3Blbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9jb25kaXRpb25hbC9pZi1vcGVuLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLEVBQWlDLE1BQU0sZUFBZSxDQUFDOzs7QUFTakg7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFjcEIsWUFDVSxhQUFzQyxFQUN0QyxRQUEwQixFQUMxQixTQUEyQjtRQUYzQixrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDdEMsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDMUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFkckM7Ozs7OztXQU1HO1FBQ3dCLGVBQVUsR0FBRyxJQUFJLFlBQVksQ0FBVSxLQUFLLENBQUMsQ0FBQztRQVN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSSxJQUFJLENBQUMsS0FBdUI7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBZ0IsQ0FBQztJQUM3QyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFVBQVUsQ0FBQyxLQUFjO1FBQ3ZCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOztzR0F0RFUsU0FBUzswRkFBVCxTQUFTOzJGQUFULFNBQVM7a0JBZHJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7aUJBQ3hCO3VLQXNCNEIsVUFBVTtzQkFBcEMsTUFBTTt1QkFBQyxpQkFBaUI7Z0JBb0JyQixJQUFJO3NCQURQLEtBQUs7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZPcGVuXScsXG59KVxuXG4vKioqKioqKioqKlxuICpcbiAqIEBjbGFzcyBDbHJJZk9wZW5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgc3RydWN0dXJhbCBkaXJlY3RpdmUgdGhhdCBjb250cm9scyB3aGV0aGVyIG9yIG5vdCB0aGUgYXNzb2NpYXRlZCBUZW1wbGF0ZVJlZiBpcyBpbnN0YW50aWF0ZWQgb3Igbm90LlxuICogSXQgbWFrZXMgdXNlIG9mIGEgQ29tcG9uZW50IGluc3RhbmNlIGxldmVsIHNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIHRvIG1haW50YWluIHN0YXRlIGJldHdlZW4gaXRzZWxmIGFuZCB0aGUgY29tcG9uZW50XG4gKiB1c2luZyBpdCBpbiB0aGUgY29tcG9uZW50IHRlbXBsYXRlLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENscklmT3BlbiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcGVuOiBib29sZWFuIHwgJyc7XG5cbiAgLyoqKioqKioqKipcbiAgICogQHByb3BlcnR5IG9wZW5DaGFuZ2VcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFuIGV2ZW50IGVtaXR0ZXIgdGhhdCBlbWl0cyB3aGVuIHRoZSBvcGVuIHByb3BlcnR5IGlzIHNldCB0byBhbGxvdyBmb3IgMndheSBiaW5kaW5nIHdoZW4gdGhlIGRpcmVjdGl2ZSBpc1xuICAgKiB1c2VkIHdpdGggZGUtc3RydWN0dXJlZCAvIGRlLXN1Z2FyZWQgc3ludGF4LlxuICAgKi9cbiAgQE91dHB1dCgnY2xySWZPcGVuQ2hhbmdlJykgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIHByaXZhdGUgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgdGhpcy51cGRhdGVWaWV3KGNoYW5nZSk7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChjaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIHByb3BlcnR5IHRoYXQgZ2V0cy9zZXRzIENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlLm9wZW4gd2l0aCB2YWx1ZS5cbiAgICovXG4gIEBJbnB1dCgnY2xySWZPcGVuJylcbiAgZ2V0IG9wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuO1xuICB9XG4gIHNldCBvcGVuKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSB2YWx1ZSBhcyBib29sZWFuO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRnVuY3Rpb24gdGhhdCB0YWtlcyBhIGJvb2xlYW4gdmFsdWUgYW5kIGVpdGhlciBjcmVhdGVkIGFuIGVtYmVkZGVkIHZpZXcgZm9yIHRoZSBhc3NvY2lhdGVkIFZpZXdDb250YWluZXJSZWYgb3IsXG4gICAqIENsZWFycyBhbGwgdmlld3MgZnJvbSB0aGUgVmlld0NvbnRhaW5lclJlZlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHVwZGF0ZVZpZXcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250YWluZXIuY2xlYXIoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==