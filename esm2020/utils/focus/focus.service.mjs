/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, Optional, Renderer2, SkipSelf } from '@angular/core';
import { isObservable, of } from 'rxjs';
import { ArrowKeyDirection } from './arrow-key-direction.enum';
import * as i0 from "@angular/core";
export class FocusService {
    constructor(renderer) {
        this.renderer = renderer;
        this._unlistenFuncs = [];
    }
    get current() {
        return this._current;
    }
    reset(first) {
        this._current = first;
    }
    listenToArrowKeys(el) {
        // The following listeners return false when there was an action to take for the key pressed,
        // in order to prevent the default behavior of that key.
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowup', () => !this.move(ArrowKeyDirection.UP)));
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowdown', () => !this.move(ArrowKeyDirection.DOWN)));
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowleft', () => !this.move(ArrowKeyDirection.LEFT)));
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowright', () => !this.move(ArrowKeyDirection.RIGHT)));
    }
    registerContainer(el, tabIndex = '0') {
        this.renderer.setAttribute(el, 'tabindex', tabIndex);
        this.listenToArrowKeys(el);
        // The following listeners return false when there was an action to take for the key pressed,
        // in order to prevent the default behavior of that key.
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.space', () => !this.activateCurrent()));
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.enter', () => !this.activateCurrent()));
    }
    moveTo(item) {
        /**
         * Make sure that item is not undefined,
         * This is safety net in the case that someone sometime decide to
         * call this method without having FocusableItem.
         */
        if (item === undefined) {
            return;
        }
        if (this.current) {
            this.current.blur();
        }
        item.focus();
        this._current = item;
    }
    move(direction) {
        let moved = false;
        if (this.current) {
            const next = this.current[direction];
            if (next) {
                // Turning the value into an Observable isn't great, but it's the fastest way to avoid code duplication.
                // If performance ever matters for this, we can refactor using additional private methods.
                const nextObs = isObservable(next) ? next : of(next);
                nextObs.subscribe(item => {
                    if (item) {
                        this.moveTo(item);
                        moved = true;
                    }
                });
            }
        }
        return moved;
    }
    activateCurrent() {
        if (this.current && this.current.activate) {
            this.current.activate();
            return true;
        }
        return false;
    }
    detachListeners() {
        this._unlistenFuncs.forEach(unlisten => unlisten());
    }
}
FocusService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FocusService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable });
FocusService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FocusService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FocusService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }]; } });
export function clrFocusServiceFactory(existing, renderer) {
    return existing || new FocusService(renderer);
}
export const FOCUS_SERVICE_PROVIDER = {
    provide: FocusService,
    useFactory: clrFocusServiceFactory,
    deps: [[new Optional(), new SkipSelf(), FocusService], Renderer2],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2ZvY3VzL2ZvY3VzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXhDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQUkvRCxNQUFNLE9BQU8sWUFBWTtJQUl2QixZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBRi9CLG1CQUFjLEdBQW1CLEVBQUUsQ0FBQztJQUVGLENBQUM7SUFFM0MsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBb0I7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWU7UUFDL0IsNkZBQTZGO1FBQzdGLHdEQUF3RDtRQUN4RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFB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QUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7O3lHQTlFVSxZQUFZOzZHQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFEeEIsVUFBVTs7QUFrRlgsTUFBTSxVQUFVLHNCQUFzQixDQUFDLFFBQXNCLEVBQUUsUUFBbUI7SUFDaEYsT0FBTyxRQUFRLElBQUksSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLE9BQU8sRUFBRSxZQUFZO0lBQ3JCLFVBQVUsRUFBRSxzQkFBc0I7SUFDbEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsWUFBWSxDQUFDLEVBQUUsU0FBUyxDQUFDO0NBQ2xFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc09ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFycm93S2V5RGlyZWN0aW9uIH0gZnJvbSAnLi9hcnJvdy1rZXktZGlyZWN0aW9uLmVudW0nO1xuaW1wb3J0IHsgRm9jdXNhYmxlSXRlbSB9IGZyb20gJy4vZm9jdXNhYmxlLWl0ZW0vZm9jdXNhYmxlLWl0ZW0nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRm9jdXNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfY3VycmVudDogRm9jdXNhYmxlSXRlbTtcbiAgcHJpdmF0ZSBfdW5saXN0ZW5GdW5jczogKCgpID0+IHZvaWQpW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgZ2V0IGN1cnJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG4gIH1cblxuICByZXNldChmaXJzdDogRm9jdXNhYmxlSXRlbSkge1xuICAgIHRoaXMuX2N1cnJlbnQgPSBmaXJzdDtcbiAgfVxuXG4gIGxpc3RlblRvQXJyb3dLZXlzKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgbGlzdGVuZXJzIHJldHVybiBmYWxzZSB3aGVuIHRoZXJlIHdhcyBhbiBhY3Rpb24gdG8gdGFrZSBmb3IgdGhlIGtleSBwcmVzc2VkLFxuICAgIC8vIGluIG9yZGVyIHRvIHByZXZlbnQgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhhdCBrZXkuXG4gICAgdGhpcy5fdW5saXN0ZW5GdW5jcy5wdXNoKHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAna2V5ZG93bi5hcnJvd3VwJywgKCkgPT4gIXRoaXMubW92ZShBcnJvd0tleURpcmVjdGlvbi5VUCkpKTtcbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLmFycm93ZG93bicsICgpID0+ICF0aGlzLm1vdmUoQXJyb3dLZXlEaXJlY3Rpb24uRE9XTikpKTtcbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLmFycm93bGVmdCcsICgpID0+ICF0aGlzLm1vdmUoQXJyb3dLZXlEaXJlY3Rpb24uTEVGVCkpKTtcbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLmFycm93cmlnaHQnLCAoKSA9PiAhdGhpcy5tb3ZlKEFycm93S2V5RGlyZWN0aW9uLlJJR0hUKSkpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb250YWluZXIoZWw6IEhUTUxFbGVtZW50LCB0YWJJbmRleCA9ICcwJykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsLCAndGFiaW5kZXgnLCB0YWJJbmRleCk7XG4gICAgdGhpcy5saXN0ZW5Ub0Fycm93S2V5cyhlbCk7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBsaXN0ZW5lcnMgcmV0dXJuIGZhbHNlIHdoZW4gdGhlcmUgd2FzIGFuIGFjdGlvbiB0byB0YWtlIGZvciB0aGUga2V5IHByZXNzZWQsXG4gICAgLy8gaW4gb3JkZXIgdG8gcHJldmVudCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGF0IGtleS5cbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLnNwYWNlJywgKCkgPT4gIXRoaXMuYWN0aXZhdGVDdXJyZW50KCkpKTtcbiAgICB0aGlzLl91bmxpc3RlbkZ1bmNzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdrZXlkb3duLmVudGVyJywgKCkgPT4gIXRoaXMuYWN0aXZhdGVDdXJyZW50KCkpKTtcbiAgfVxuXG4gIG1vdmVUbyhpdGVtOiBGb2N1c2FibGVJdGVtKSB7XG4gICAgLyoqXG4gICAgICogTWFrZSBzdXJlIHRoYXQgaXRlbSBpcyBub3QgdW5kZWZpbmVkLFxuICAgICAqIFRoaXMgaXMgc2FmZXR5IG5ldCBpbiB0aGUgY2FzZSB0aGF0IHNvbWVvbmUgc29tZXRpbWUgZGVjaWRlIHRvXG4gICAgICogY2FsbCB0aGlzIG1ldGhvZCB3aXRob3V0IGhhdmluZyBGb2N1c2FibGVJdGVtLlxuICAgICAqL1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICB0aGlzLmN1cnJlbnQuYmx1cigpO1xuICAgIH1cbiAgICBpdGVtLmZvY3VzKCk7XG4gICAgdGhpcy5fY3VycmVudCA9IGl0ZW07XG4gIH1cblxuICBtb3ZlKGRpcmVjdGlvbjogQXJyb3dLZXlEaXJlY3Rpb24pOiBib29sZWFuIHtcbiAgICBsZXQgbW92ZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICBjb25zdCBuZXh0ID0gdGhpcy5jdXJyZW50W2RpcmVjdGlvbl07XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICAvLyBUdXJuaW5nIHRoZSB2YWx1ZSBpbnRvIGFuIE9ic2VydmFibGUgaXNuJ3QgZ3JlYXQsIGJ1dCBpdCdzIHRoZSBmYXN0ZXN0IHdheSB0byBhdm9pZCBjb2RlIGR1cGxpY2F0aW9uLlxuICAgICAgICAvLyBJZiBwZXJmb3JtYW5jZSBldmVyIG1hdHRlcnMgZm9yIHRoaXMsIHdlIGNhbiByZWZhY3RvciB1c2luZyBhZGRpdGlvbmFsIHByaXZhdGUgbWV0aG9kcy5cbiAgICAgICAgY29uc3QgbmV4dE9icyA9IGlzT2JzZXJ2YWJsZShuZXh0KSA/IG5leHQgOiBvZihuZXh0KTtcbiAgICAgICAgbmV4dE9icy5zdWJzY3JpYmUoaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKGl0ZW0pO1xuICAgICAgICAgICAgbW92ZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3ZlZDtcbiAgfVxuXG4gIGFjdGl2YXRlQ3VycmVudCgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50ICYmIHRoaXMuY3VycmVudC5hY3RpdmF0ZSkge1xuICAgICAgdGhpcy5jdXJyZW50LmFjdGl2YXRlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZGV0YWNoTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuX3VubGlzdGVuRnVuY3MuZm9yRWFjaCh1bmxpc3RlbiA9PiB1bmxpc3RlbigpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xyRm9jdXNTZXJ2aWNlRmFjdG9yeShleGlzdGluZzogRm9jdXNTZXJ2aWNlLCByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIHJldHVybiBleGlzdGluZyB8fCBuZXcgRm9jdXNTZXJ2aWNlKHJlbmRlcmVyKTtcbn1cblxuZXhwb3J0IGNvbnN0IEZPQ1VTX1NFUlZJQ0VfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IEZvY3VzU2VydmljZSxcbiAgdXNlRmFjdG9yeTogY2xyRm9jdXNTZXJ2aWNlRmFjdG9yeSxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIEZvY3VzU2VydmljZV0sIFJlbmRlcmVyMl0sXG59O1xuIl19