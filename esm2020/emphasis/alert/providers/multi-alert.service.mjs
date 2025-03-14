/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class MultiAlertService {
    constructor() {
        this._change = new Subject();
    }
    /**
     * The Observable that lets other classes subscribe to changes
     */
    get changes() {
        return this._change.asObservable();
    }
    get current() {
        return this._current;
    }
    set current(index) {
        if (index !== this._current) {
            this._current = index;
            this._change.next(index);
        }
    }
    get activeAlerts() {
        return this.allAlerts && this.allAlerts.filter(alert => !alert._closed);
    }
    get currentAlert() {
        return this.activeAlerts && this.activeAlerts[this.current];
    }
    set currentAlert(alert) {
        this.current = this.activeAlerts.indexOf(alert);
    }
    get count() {
        return (this.activeAlerts && this.activeAlerts.length) || 0;
    }
    manage(alerts) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.allAlerts = alerts;
        // After receiving alerts' QueryList,
        // we are picking index 0 as current by default if a user hasn't any index
        this.current = typeof this._current === 'number' ? this._current : 0;
        // we have to also broadcast that initial index
        this._change.next(this.current);
        this.subscription = this.allAlerts.changes.subscribe(() => {
            if (this.current >= this.allAlerts.length) {
                this.current = Math.max(0, this.allAlerts.length - 1);
            }
        });
    }
    next() {
        this._current = this.current === this.activeAlerts.length - 1 ? 0 : this.current + 1;
        this._change.next(this._current);
    }
    previous() {
        if (this.activeAlerts.length === 0) {
            return;
        }
        this._current = this.current === 0 ? this.activeAlerts.length - 1 : this.current - 1;
        this._change.next(this._current);
    }
    open() {
        if (this.activeAlerts.length === 0) {
            return;
        }
        if (!this.currentAlert) {
            this._current = 0;
        }
        this._change.next(this._current);
    }
    close(isCurrentAlert) {
        if (this.activeAlerts.length === 0) {
            return;
        }
        if (isCurrentAlert) {
            this._current = Math.max(0, this.current - 1);
        }
        this._change.next(this._current);
    }
    destroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
MultiAlertService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: MultiAlertService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MultiAlertService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: MultiAlertService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: MultiAlertService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktYWxlcnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2VtcGhhc2lzL2FsZXJ0L3Byb3ZpZGVycy9tdWx0aS1hbGVydC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQWMsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQzs7QUFLekQsTUFBTSxPQUFPLGlCQUFpQjtJQUQ5QjtRQUlVLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO0tBK0Z6QztJQTVGQzs7T0FFRztJQUNILElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1FBQ3ZCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lB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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDOzs4R0FqR1UsaUJBQWlCO2tIQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyQWxlcnQgfSBmcm9tICcuLi9hbGVydCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNdWx0aUFsZXJ0U2VydmljZSB7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgYWxsQWxlcnRzOiBRdWVyeUxpc3Q8Q2xyQWxlcnQ+O1xuICBwcml2YXRlIF9jaGFuZ2UgPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gIHByaXZhdGUgX2N1cnJlbnQ6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIE9ic2VydmFibGUgdGhhdCBsZXRzIG90aGVyIGNsYXNzZXMgc3Vic2NyaWJlIHRvIGNoYW5nZXNcbiAgICovXG4gIGdldCBjaGFuZ2VzKCk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICB9XG4gIHNldCBjdXJyZW50KGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoaW5kZXggIT09IHRoaXMuX2N1cnJlbnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnQgPSBpbmRleDtcbiAgICAgIHRoaXMuX2NoYW5nZS5uZXh0KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBnZXQgYWN0aXZlQWxlcnRzKCkge1xuICAgIHJldHVybiB0aGlzLmFsbEFsZXJ0cyAmJiB0aGlzLmFsbEFsZXJ0cy5maWx0ZXIoYWxlcnQgPT4gIWFsZXJ0Ll9jbG9zZWQpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRBbGVydCgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVBbGVydHMgJiYgdGhpcy5hY3RpdmVBbGVydHNbdGhpcy5jdXJyZW50XTtcbiAgfVxuICBzZXQgY3VycmVudEFsZXJ0KGFsZXJ0OiBDbHJBbGVydCkge1xuICAgIHRoaXMuY3VycmVudCA9IHRoaXMuYWN0aXZlQWxlcnRzLmluZGV4T2YoYWxlcnQpO1xuICB9XG5cbiAgZ2V0IGNvdW50KCkge1xuICAgIHJldHVybiAodGhpcy5hY3RpdmVBbGVydHMgJiYgdGhpcy5hY3RpdmVBbGVydHMubGVuZ3RoKSB8fCAwO1xuICB9XG5cbiAgbWFuYWdlKGFsZXJ0czogUXVlcnlMaXN0PENsckFsZXJ0Pikge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5hbGxBbGVydHMgPSBhbGVydHM7XG4gICAgLy8gQWZ0ZXIgcmVjZWl2aW5nIGFsZXJ0cycgUXVlcnlMaXN0LFxuICAgIC8vIHdlIGFyZSBwaWNraW5nIGluZGV4IDAgYXMgY3VycmVudCBieSBkZWZhdWx0IGlmIGEgdXNlciBoYXNuJ3QgYW55IGluZGV4XG4gICAgdGhpcy5jdXJyZW50ID0gdHlwZW9mIHRoaXMuX2N1cnJlbnQgPT09ICdudW1iZXInID8gdGhpcy5fY3VycmVudCA6IDA7XG4gICAgLy8gd2UgaGF2ZSB0byBhbHNvIGJyb2FkY2FzdCB0aGF0IGluaXRpYWwgaW5kZXhcbiAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmFsbEFsZXJ0cy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50ID49IHRoaXMuYWxsQWxlcnRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBNYXRoLm1heCgwLCB0aGlzLmFsbEFsZXJ0cy5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5fY3VycmVudCA9IHRoaXMuY3VycmVudCA9PT0gdGhpcy5hY3RpdmVBbGVydHMubGVuZ3RoIC0gMSA/IDAgOiB0aGlzLmN1cnJlbnQgKyAxO1xuICAgIHRoaXMuX2NoYW5nZS5uZXh0KHRoaXMuX2N1cnJlbnQpO1xuICB9XG5cbiAgcHJldmlvdXMoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlQWxlcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5jdXJyZW50ID09PSAwID8gdGhpcy5hY3RpdmVBbGVydHMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDE7XG4gICAgdGhpcy5fY2hhbmdlLm5leHQodGhpcy5fY3VycmVudCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZUFsZXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY3VycmVudEFsZXJ0KSB7XG4gICAgICB0aGlzLl9jdXJyZW50ID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLl9jdXJyZW50KTtcbiAgfVxuXG4gIGNsb3NlKGlzQ3VycmVudEFsZXJ0OiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlQWxlcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0N1cnJlbnRBbGVydCkge1xuICAgICAgdGhpcy5fY3VycmVudCA9IE1hdGgubWF4KDAsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZS5uZXh0KHRoaXMuX2N1cnJlbnQpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=