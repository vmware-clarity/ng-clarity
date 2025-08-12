/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../../modal/modal-stack.service";
export class DetailService {
    constructor(modalStackService) {
        this.modalStackService = modalStackService;
        this.preventScroll = false;
        this.toggleState = false;
        this._enabled = false;
        this._state = new BehaviorSubject(this.toggleState);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(state) {
        this._enabled = state;
    }
    get preventFocusScroll() {
        return this.preventScroll;
    }
    set preventFocusScroll(preventScroll) {
        this.preventScroll = preventScroll;
    }
    get state() {
        return this.cache;
    }
    get stateChange() {
        return this._state.asObservable();
    }
    get isOpen() {
        return this.toggleState === true;
    }
    open(item, button) {
        this.cache = item;
        this.button = button;
        this.toggleState = true;
        this._state.next(this.toggleState);
        this.modalStackService.trackModalOpen(this);
    }
    close() {
        this.toggleState = false;
        this.returnFocus();
        this._state.next(this.toggleState);
        this.modalStackService.trackModalClose(this);
    }
    returnFocus() {
        if (this.button) {
            this.button.focus({ preventScroll: this.preventFocusScroll });
            this.button = null;
        }
    }
    toggle(item, button) {
        if (this.isRowOpen(item) || !item) {
            this.close();
        }
        else {
            this.open(item, button);
        }
    }
    isRowOpen(item) {
        return !!(this.toggleState && this.cache === item);
    }
}
DetailService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DetailService, deps: [{ token: i1.ModalStackService }], target: i0.ɵɵFactoryTarget.Injectable });
DetailService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DetailService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DetailService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ModalStackService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQzs7O0FBS25ELE1BQU0sT0FBTyxhQUFhO0lBVXhCLFlBQTZCLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBUHpELGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBR3BCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFpQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFSCxDQUFDO0lBRXJFLElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBYztRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxrQkFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFDRCxJQUFJLGtCQUFrQixDQUFDLGFBQXNCO1FBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQVMsRUFBRSxNQUEwQjtRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVMsRUFBRSxNQUEwQjtRQUMxQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFTO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7OzBHQXRFVSxhQUFhOzhHQUFiLGFBQWE7MkZBQWIsYUFBYTtrQkFEekIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE1vZGFsU3RhY2tTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vbW9kYWwvbW9kYWwtc3RhY2suc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEZXRhaWxTZXJ2aWNlIHtcbiAgaWQ6IHN0cmluZztcblxuICBwcml2YXRlIHByZXZlbnRTY3JvbGwgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0b2dnbGVTdGF0ZSA9IGZhbHNlO1xuICBwcml2YXRlIGNhY2hlOiBhbnk7XG4gIHByaXZhdGUgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgcHJpdmF0ZSBfZW5hYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdGF0ZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbiB8IG51bGw+KHRoaXMudG9nZ2xlU3RhdGUpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbW9kYWxTdGFja1NlcnZpY2U6IE1vZGFsU3RhY2tTZXJ2aWNlKSB7fVxuXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xuICB9XG4gIHNldCBlbmFibGVkKHN0YXRlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlZCA9IHN0YXRlO1xuICB9XG5cbiAgZ2V0IHByZXZlbnRGb2N1c1Njcm9sbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2ZW50U2Nyb2xsO1xuICB9XG4gIHNldCBwcmV2ZW50Rm9jdXNTY3JvbGwocHJldmVudFNjcm9sbDogYm9vbGVhbikge1xuICAgIHRoaXMucHJldmVudFNjcm9sbCA9IHByZXZlbnRTY3JvbGw7XG4gIH1cblxuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FjaGU7XG4gIH1cblxuICBnZXQgc3RhdGVDaGFuZ2UoKTogT2JzZXJ2YWJsZTxib29sZWFuIHwgbnVsbD4ge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBpc09wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlU3RhdGUgPT09IHRydWU7XG4gIH1cblxuICBvcGVuKGl0ZW06IGFueSwgYnV0dG9uPzogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICB0aGlzLmNhY2hlID0gaXRlbTtcbiAgICB0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcbiAgICB0aGlzLnRvZ2dsZVN0YXRlID0gdHJ1ZTtcbiAgICB0aGlzLl9zdGF0ZS5uZXh0KHRoaXMudG9nZ2xlU3RhdGUpO1xuICAgIHRoaXMubW9kYWxTdGFja1NlcnZpY2UudHJhY2tNb2RhbE9wZW4odGhpcyk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLnRvZ2dsZVN0YXRlID0gZmFsc2U7XG4gICAgdGhpcy5yZXR1cm5Gb2N1cygpO1xuICAgIHRoaXMuX3N0YXRlLm5leHQodGhpcy50b2dnbGVTdGF0ZSk7XG4gICAgdGhpcy5tb2RhbFN0YWNrU2VydmljZS50cmFja01vZGFsQ2xvc2UodGhpcyk7XG4gIH1cblxuICByZXR1cm5Gb2N1cygpIHtcbiAgICBpZiAodGhpcy5idXR0b24pIHtcbiAgICAgIHRoaXMuYnV0dG9uLmZvY3VzKHsgcHJldmVudFNjcm9sbDogdGhpcy5wcmV2ZW50Rm9jdXNTY3JvbGwgfSk7XG4gICAgICB0aGlzLmJ1dHRvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlKGl0ZW06IGFueSwgYnV0dG9uPzogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5pc1Jvd09wZW4oaXRlbSkgfHwgIWl0ZW0pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKGl0ZW0sIGJ1dHRvbik7XG4gICAgfVxuICB9XG5cbiAgaXNSb3dPcGVuKGl0ZW06IGFueSkge1xuICAgIHJldHVybiAhISh0aGlzLnRvZ2dsZVN0YXRlICYmIHRoaXMuY2FjaGUgPT09IGl0ZW0pO1xuICB9XG59XG4iXX0=