/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Allows modal overflow area to be scrollable via keyboard.
 * The modal body will focus with keyboard navigation only.
 * This allows inner focusable items to be focused without
 * the overflow scroll being focused.
 */
export class ClrModalBody {
    constructor(renderer, host, ngZone) {
        this.renderer = renderer;
        this.host = host;
        this.tabindex = '0';
        this.unlisteners = [];
        ngZone.runOutsideAngular(() => {
            this.observer = new ResizeObserver(() => this.addOrRemoveTabIndex());
            this.observer.observe(host.nativeElement);
            this.unlisteners.push(renderer.listen(host.nativeElement, 'mouseup', () => {
                // set the tabindex binding back when click is completed with mouseup
                this.addOrRemoveTabIndex();
            }), renderer.listen(host.nativeElement, 'mousedown', () => {
                // tabindex = 0 binding should be removed
                // so it won't be focused when click starts with mousedown
                this.removeTabIndex();
            }));
        });
    }
    ngOnDestroy() {
        while (this.unlisteners.length) {
            this.unlisteners.pop()();
        }
        this.observer.disconnect();
        this.observer = null;
    }
    addTabIndex() {
        this.renderer.setAttribute(this.host.nativeElement, 'tabindex', this.tabindex);
    }
    removeTabIndex() {
        this.renderer.removeAttribute(this.host.nativeElement, 'tabindex');
    }
    addOrRemoveTabIndex() {
        const modalBody = this.host.nativeElement.parentElement;
        if (modalBody && modalBody.clientHeight < modalBody.scrollHeight) {
            this.addTabIndex();
        }
        else {
            this.removeTabIndex();
        }
    }
}
ClrModalBody.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModalBody, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
ClrModalBody.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrModalBody, selector: ".modal-body", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrModalBody, decorators: [{
            type: Directive,
            args: [{
                    selector: '.modal-body',
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL21vZGFsLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUE0QyxNQUFNLGVBQWUsQ0FBQzs7QUFFcEY7Ozs7O0dBS0c7QUFJSCxNQUFNLE9BQU8sWUFBWTtJQUt2QixZQUE2QixRQUFtQixFQUFtQixJQUE2QixFQUFFLE1BQWM7UUFBbkYsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFtQixTQUFJLEdBQUosSUFBSSxDQUF5QjtRQUp4RixhQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ2YsZ0JBQVcsR0FBbUIsRUFBRSxDQUFDO1FBSXZDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUUxQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDbkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xELHFFQUFxRTtnQkFDckUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDLEVBQ0YsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ3BELHlDQUF5QztnQkFDekMsMERBQTBEO2dCQUMxRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzlCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztTQUMxQjtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVPLFdBQVc7UUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRU8sY0FBYztRQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztRQUV4RCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUU7WUFDaEUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDOzt5R0FqRFUsWUFBWTs2RkFBWixZQUFZOzJGQUFaLFlBQVk7a0JBSHhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7aUJBQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25EZXN0cm95LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBBbGxvd3MgbW9kYWwgb3ZlcmZsb3cgYXJlYSB0byBiZSBzY3JvbGxhYmxlIHZpYSBrZXlib2FyZC5cbiAqIFRoZSBtb2RhbCBib2R5IHdpbGwgZm9jdXMgd2l0aCBrZXlib2FyZCBuYXZpZ2F0aW9uIG9ubHkuXG4gKiBUaGlzIGFsbG93cyBpbm5lciBmb2N1c2FibGUgaXRlbXMgdG8gYmUgZm9jdXNlZCB3aXRob3V0XG4gKiB0aGUgb3ZlcmZsb3cgc2Nyb2xsIGJlaW5nIGZvY3VzZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJy5tb2RhbC1ib2R5Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTW9kYWxCb2R5IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSB0YWJpbmRleCA9ICcwJztcbiAgcHJpdmF0ZSB1bmxpc3RlbmVyczogVm9pZEZ1bmN0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBvYnNlcnZlcjogUmVzaXplT2JzZXJ2ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIHJlYWRvbmx5IGhvc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLm9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVUYWJJbmRleCgpKTtcbiAgICAgIHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShob3N0Lm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICB0aGlzLnVubGlzdGVuZXJzLnB1c2goXG4gICAgICAgIHJlbmRlcmVyLmxpc3Rlbihob3N0Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAgIC8vIHNldCB0aGUgdGFiaW5kZXggYmluZGluZyBiYWNrIHdoZW4gY2xpY2sgaXMgY29tcGxldGVkIHdpdGggbW91c2V1cFxuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVUYWJJbmRleCgpO1xuICAgICAgICB9KSxcbiAgICAgICAgcmVuZGVyZXIubGlzdGVuKGhvc3QubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICAvLyB0YWJpbmRleCA9IDAgYmluZGluZyBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAgICAgIC8vIHNvIGl0IHdvbid0IGJlIGZvY3VzZWQgd2hlbiBjbGljayBzdGFydHMgd2l0aCBtb3VzZWRvd25cbiAgICAgICAgICB0aGlzLnJlbW92ZVRhYkluZGV4KCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgd2hpbGUgKHRoaXMudW5saXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnVubGlzdGVuZXJzLnBvcCgpKCk7XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5vYnNlcnZlciA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFkZFRhYkluZGV4KCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnLCB0aGlzLnRhYmluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlVGFiSW5kZXgoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQsICd0YWJpbmRleCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRPclJlbW92ZVRhYkluZGV4KCkge1xuICAgIGNvbnN0IG1vZGFsQm9keSA9IHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAobW9kYWxCb2R5ICYmIG1vZGFsQm9keS5jbGllbnRIZWlnaHQgPCBtb2RhbEJvZHkuc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLmFkZFRhYkluZGV4KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlVGFiSW5kZXgoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==