/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Input, Optional, Output, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./if-expanded.service";
export class ClrIfExpanded {
    constructor(template, container, el, renderer, expand) {
        this.template = template;
        this.container = container;
        this.el = el;
        this.renderer = renderer;
        this.expand = expand;
        this.expandedChange = new EventEmitter(true);
        this._expanded = false;
        /**
         * Subscriptions to all the services and queries changes
         */
        this._subscriptions = [];
        this._subscriptions.push(expand.expandChange.subscribe(() => {
            this.updateView();
            this.expandedChange.emit(expand.expanded);
        }));
        expand.hasExpandTemplate = !!template;
    }
    get expanded() {
        return this._expanded;
    }
    set expanded(value) {
        if (typeof value === 'boolean') {
            this.expand.expanded = value;
            this._expanded = value;
        }
    }
    ngOnInit() {
        this.expand.expandable++;
        this.updateView();
    }
    ngOnDestroy() {
        this.expand.expandable--;
        this._subscriptions.forEach((sub) => sub.unsubscribe());
    }
    updateView() {
        if (this.expand.expanded && this.container.length !== 0) {
            return;
        }
        if (this.template) {
            if (this.expand.expanded) {
                // Should we pass a context? I don't see anything useful to pass right now,
                // but we can come back to it in the future as a solution for additional features.
                this.container.createEmbeddedView(this.template);
            }
            else {
                // TODO: Move when we move the animation logic to Datagrid Row Expand
                // We clear before the animation is over. Not ideal, but doing better would involve a much heavier
                // process for very little gain. Once Angular animations are dynamic enough, we should be able to
                // get the optimal behavior.
                this.container.clear();
            }
        }
        else {
            try {
                // If we don't have a template ref, we fallback to a crude display: none for now.
                if (this.expand.expanded) {
                    this.renderer.setStyle(this.el.nativeElement, 'display', null);
                }
                else {
                    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
                }
            }
            catch (e) {
                // We catch the case where clrIfExpanded was put on a non-DOM element, and we just do nothing
            }
        }
    }
}
ClrIfExpanded.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfExpanded, deps: [{ token: i0.TemplateRef, optional: true }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfExpanded.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfExpanded, selector: "[clrIfExpanded]", inputs: { expanded: ["clrIfExpanded", "expanded"] }, outputs: { expandedChange: "clrIfExpandedChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfExpanded, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfExpanded]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.IfExpandService }]; }, propDecorators: { expandedChange: [{
                type: Output,
                args: ['clrIfExpandedChange']
            }], expanded: [{
                type: Input,
                args: ['clrIfExpanded']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtZXhwYW5kZWQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY29uZGl0aW9uYWwvaWYtZXhwYW5kZWQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEdBSVAsTUFBTSxlQUFlLENBQUM7OztBQVF2QixNQUFNLE9BQU8sYUFBYTtJQVV4QixZQUNzQixRQUEwQixFQUN0QyxTQUEyQixFQUMzQixFQUEyQixFQUMzQixRQUFtQixFQUNuQixNQUF1QjtRQUpYLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQ3RDLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLE9BQUUsR0FBRixFQUFFLENBQXlCO1FBQzNCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFkRixtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBRXhFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFMUI7O1dBRUc7UUFDSyxtQkFBYyxHQUFtQixFQUFFLENBQUM7UUFTMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ3RCLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUNILENBQUM7UUFFRixNQUFNLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUF1QjtRQUNsQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQWlCLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTyxVQUFVO1FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZELE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUN4QiwyRUFBMkU7Z0JBQzNFLGtGQUFrRjtnQkFDbEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbEQ7aUJBQU07Z0JBQ0wscUVBQXFFO2dCQUNyRSxrR0FBa0c7Z0JBQ2xHLGlHQUFpRztnQkFDakcsNEJBQTRCO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7YUFBTTtZQUNMLElBQUk7Z0JBQ0YsaUZBQWlGO2dCQUNqRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO29CQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2hFO3FCQUFNO29CQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDbEU7YUFDRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLDZGQUE2RjthQUM5RjtTQUNGO0lBQ0gsQ0FBQzs7MEdBNUVVLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUh6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7aUJBQzVCOzswQkFZSSxRQUFROzBKQVZvQixjQUFjO3NCQUE1QyxNQUFNO3VCQUFDLHFCQUFxQjtnQkEyQnpCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuL2lmLWV4cGFuZGVkLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZFeHBhbmRlZF0nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJJZkV4cGFuZGVkIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdjbHJJZkV4cGFuZGVkQ2hhbmdlJykgZXhwYW5kZWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KHRydWUpO1xuXG4gIHByaXZhdGUgX2V4cGFuZGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbnMgdG8gYWxsIHRoZSBzZXJ2aWNlcyBhbmQgcXVlcmllcyBjaGFuZ2VzXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgcHJpdmF0ZSBjb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZXhwYW5kOiBJZkV4cGFuZFNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZXhwYW5kLmV4cGFuZENoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgdGhpcy5leHBhbmRlZENoYW5nZS5lbWl0KGV4cGFuZC5leHBhbmRlZCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBleHBhbmQuaGFzRXhwYW5kVGVtcGxhdGUgPSAhIXRlbXBsYXRlO1xuICB9XG5cbiAgQElucHV0KCdjbHJJZkV4cGFuZGVkJylcbiAgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4gfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9leHBhbmRlZDtcbiAgfVxuICBzZXQgZXhwYW5kZWQodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHRoaXMuZXhwYW5kLmV4cGFuZGVkID0gdmFsdWU7XG4gICAgICB0aGlzLl9leHBhbmRlZCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZXhwYW5kLmV4cGFuZGFibGUrKztcbiAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZXhwYW5kLmV4cGFuZGFibGUtLTtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVZpZXcoKSB7XG4gICAgaWYgKHRoaXMuZXhwYW5kLmV4cGFuZGVkICYmIHRoaXMuY29udGFpbmVyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZW1wbGF0ZSkge1xuICAgICAgaWYgKHRoaXMuZXhwYW5kLmV4cGFuZGVkKSB7XG4gICAgICAgIC8vIFNob3VsZCB3ZSBwYXNzIGEgY29udGV4dD8gSSBkb24ndCBzZWUgYW55dGhpbmcgdXNlZnVsIHRvIHBhc3MgcmlnaHQgbm93LFxuICAgICAgICAvLyBidXQgd2UgY2FuIGNvbWUgYmFjayB0byBpdCBpbiB0aGUgZnV0dXJlIGFzIGEgc29sdXRpb24gZm9yIGFkZGl0aW9uYWwgZmVhdHVyZXMuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IE1vdmUgd2hlbiB3ZSBtb3ZlIHRoZSBhbmltYXRpb24gbG9naWMgdG8gRGF0YWdyaWQgUm93IEV4cGFuZFxuICAgICAgICAvLyBXZSBjbGVhciBiZWZvcmUgdGhlIGFuaW1hdGlvbiBpcyBvdmVyLiBOb3QgaWRlYWwsIGJ1dCBkb2luZyBiZXR0ZXIgd291bGQgaW52b2x2ZSBhIG11Y2ggaGVhdmllclxuICAgICAgICAvLyBwcm9jZXNzIGZvciB2ZXJ5IGxpdHRsZSBnYWluLiBPbmNlIEFuZ3VsYXIgYW5pbWF0aW9ucyBhcmUgZHluYW1pYyBlbm91Z2gsIHdlIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgICAgIC8vIGdldCB0aGUgb3B0aW1hbCBiZWhhdmlvci5cbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHRlbXBsYXRlIHJlZiwgd2UgZmFsbGJhY2sgdG8gYSBjcnVkZSBkaXNwbGF5OiBub25lIGZvciBub3cuXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZC5leHBhbmRlZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gV2UgY2F0Y2ggdGhlIGNhc2Ugd2hlcmUgY2xySWZFeHBhbmRlZCB3YXMgcHV0IG9uIGEgbm9uLURPTSBlbGVtZW50LCBhbmQgd2UganVzdCBkbyBub3RoaW5nXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=