/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Subject } from 'rxjs';
import { DatagridPropertyNumericFilter } from './datagrid-property-numeric-filter';
export class DatagridNumericFilterImpl {
    constructor(filterFn) {
        this.filterFn = filterFn;
        /**
         * The Observable required as part of the Filter interface
         */
        this._changes = new Subject();
        /**
         * Internal values and accessor
         */
        this._low = null;
        this._high = null;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get changes() {
        return this._changes.asObservable();
    }
    get value() {
        return [this._low, this._high];
    }
    set value(vals) {
        const low = vals[0];
        const high = vals[1];
        if (low !== this._low || high !== this._high) {
            this._low = low;
            this._high = high;
            this._changes.next([this._low, this._high]);
        }
    }
    get low() {
        return this._low;
    }
    set low(low) {
        if (low !== this._low) {
            this._low = low;
            this._changes.next([this._low, this._high]);
        }
    }
    get high() {
        return this._high;
    }
    set high(high) {
        if (high !== this._high) {
            this._high = high;
            this._changes.next([this._low, this._high]);
        }
    }
    get state() {
        if (this.filterFn instanceof DatagridPropertyNumericFilter) {
            return {
                property: this.filterFn.prop,
                low: this._low,
                high: this._high,
            };
        }
        return this;
    }
    /**
     * Indicates if the filter is currently active, (at least one input is set)
     */
    isActive() {
        return this._low !== null || this.high !== null;
    }
    /**
     * Tests if an item matches a search text
     */
    accepts(item) {
        // We have a filter function in case someone wants to implement a numeric
        // filter that always passes nulls or similar
        return this.filterFn.accepts(item, this._low, this._high);
    }
    equals(other) {
        if (other instanceof DatagridNumericFilterImpl) {
            if (other.filterFn instanceof DatagridPropertyNumericFilter) {
                return (this.filterFn instanceof DatagridPropertyNumericFilter &&
                    other.filterFn.prop === this.filterFn.prop &&
                    other.low === this._low &&
                    other.high === this._high);
            }
            return other === this;
        }
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtbnVtZXJpYy1maWx0ZXItaW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1udW1lcmljLWZpbHRlci1pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUkzQyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRixNQUFNLE9BQU8seUJBQXlCO0lBWXBDLFlBQW1CLFFBQThDO1FBQTlDLGFBQVEsR0FBUixRQUFRLENBQXNDO1FBWGpFOztXQUVHO1FBQ0ssYUFBUSxHQUFHLElBQUksT0FBTyxFQUFvQixDQUFDO1FBRW5EOztXQUVHO1FBQ0ssU0FBSSxHQUFrQixJQUFJLENBQUM7UUFDM0IsVUFBSyxHQUFrQixJQUFJLENBQUM7SUFFZ0MsQ0FBQztJQUVyRSxxRkFBcUY7SUFDckYsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLElBQXNCO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtZQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLEdBQUcsQ0FBQyxHQUFXO1FBQ2pCLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBWTtRQUNuQixJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRLFlBQVksNkJBQTZCLEVBQUU7WUFDMUQsT0FBTztnQkFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2dCQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ2pCLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTyxDQUFDLElBQU87UUFDYix5RUFBeUU7UUFDekUsNkNBQTZDO1FBQzdDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBeUM7UUFDOUMsSUFBSSxLQUFLLFlBQVkseUJBQXlCLEVBQUU7WUFDOUMsSUFBSSxLQUFLLENBQUMsUUFBUSxZQUFZLDZCQUE2QixFQUFFO2dCQUMzRCxPQUFPLENBQ0wsSUFBSSxDQUFDLFFBQVEsWUFBWSw2QkFBNkI7b0JBQ3RELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTtvQkFDMUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSTtvQkFDdkIsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxDQUMxQixDQUFDO2FBQ0g7WUFDRCxPQUFPLEtBQUssS0FBSyxJQUFJLENBQUM7U0FDdkI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL251bWVyaWMtZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFByb3BlcnR5TnVtZXJpY0ZpbHRlciB9IGZyb20gJy4vZGF0YWdyaWQtcHJvcGVydHktbnVtZXJpYy1maWx0ZXInO1xuXG5leHBvcnQgY2xhc3MgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbDxUID0gYW55PiBpbXBsZW1lbnRzIENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+IHtcbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHJlcXVpcmVkIGFzIHBhcnQgb2YgdGhlIEZpbHRlciBpbnRlcmZhY2VcbiAgICovXG4gIHByaXZhdGUgX2NoYW5nZXMgPSBuZXcgU3ViamVjdDxbbnVtYmVyLCBudW1iZXJdPigpO1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCB2YWx1ZXMgYW5kIGFjY2Vzc29yXG4gICAqL1xuICBwcml2YXRlIF9sb3c6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9oaWdoOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmlsdGVyRm46IENsckRhdGFncmlkTnVtZXJpY0ZpbHRlckludGVyZmFjZTxUPikge31cblxuICAvLyBXZSBkbyBub3Qgd2FudCB0byBleHBvc2UgdGhlIFN1YmplY3QgaXRzZWxmLCBidXQgdGhlIE9ic2VydmFibGUgd2hpY2ggaXMgcmVhZC1vbmx5XG4gIGdldCBjaGFuZ2VzKCk6IE9ic2VydmFibGU8W251bWJlciwgbnVtYmVyXT4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5fbG93LCB0aGlzLl9oaWdoXTtcbiAgfVxuICBzZXQgdmFsdWUodmFsczogW251bWJlciwgbnVtYmVyXSkge1xuICAgIGNvbnN0IGxvdyA9IHZhbHNbMF07XG4gICAgY29uc3QgaGlnaCA9IHZhbHNbMV07XG4gICAgaWYgKGxvdyAhPT0gdGhpcy5fbG93IHx8IGhpZ2ggIT09IHRoaXMuX2hpZ2gpIHtcbiAgICAgIHRoaXMuX2xvdyA9IGxvdztcbiAgICAgIHRoaXMuX2hpZ2ggPSBoaWdoO1xuICAgICAgdGhpcy5fY2hhbmdlcy5uZXh0KFt0aGlzLl9sb3csIHRoaXMuX2hpZ2hdKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbG93KCkge1xuICAgIHJldHVybiB0aGlzLl9sb3c7XG4gIH1cbiAgc2V0IGxvdyhsb3c6IG51bWJlcikge1xuICAgIGlmIChsb3cgIT09IHRoaXMuX2xvdykge1xuICAgICAgdGhpcy5fbG93ID0gbG93O1xuICAgICAgdGhpcy5fY2hhbmdlcy5uZXh0KFt0aGlzLl9sb3csIHRoaXMuX2hpZ2hdKTtcbiAgICB9XG4gIH1cblxuICBnZXQgaGlnaCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGlnaDtcbiAgfVxuICBzZXQgaGlnaChoaWdoOiBudW1iZXIpIHtcbiAgICBpZiAoaGlnaCAhPT0gdGhpcy5faGlnaCkge1xuICAgICAgdGhpcy5faGlnaCA9IGhpZ2g7XG4gICAgICB0aGlzLl9jaGFuZ2VzLm5leHQoW3RoaXMuX2xvdywgdGhpcy5faGlnaF0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJGbiBpbnN0YW5jZW9mIERhdGFncmlkUHJvcGVydHlOdW1lcmljRmlsdGVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcm9wZXJ0eTogdGhpcy5maWx0ZXJGbi5wcm9wLFxuICAgICAgICBsb3c6IHRoaXMuX2xvdyxcbiAgICAgICAgaGlnaDogdGhpcy5faGlnaCxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGUgZmlsdGVyIGlzIGN1cnJlbnRseSBhY3RpdmUsIChhdCBsZWFzdCBvbmUgaW5wdXQgaXMgc2V0KVxuICAgKi9cbiAgaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2xvdyAhPT0gbnVsbCB8fCB0aGlzLmhpZ2ggIT09IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYW4gaXRlbSBtYXRjaGVzIGEgc2VhcmNoIHRleHRcbiAgICovXG4gIGFjY2VwdHMoaXRlbTogVCk6IGJvb2xlYW4ge1xuICAgIC8vIFdlIGhhdmUgYSBmaWx0ZXIgZnVuY3Rpb24gaW4gY2FzZSBzb21lb25lIHdhbnRzIHRvIGltcGxlbWVudCBhIG51bWVyaWNcbiAgICAvLyBmaWx0ZXIgdGhhdCBhbHdheXMgcGFzc2VzIG51bGxzIG9yIHNpbWlsYXJcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJGbi5hY2NlcHRzKGl0ZW0sIHRoaXMuX2xvdywgdGhpcy5faGlnaCk7XG4gIH1cblxuICBlcXVhbHMob3RoZXI6IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQsIGFueT4pOiBib29sZWFuIHtcbiAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKSB7XG4gICAgICBpZiAob3RoZXIuZmlsdGVyRm4gaW5zdGFuY2VvZiBEYXRhZ3JpZFByb3BlcnR5TnVtZXJpY0ZpbHRlcikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuZmlsdGVyRm4gaW5zdGFuY2VvZiBEYXRhZ3JpZFByb3BlcnR5TnVtZXJpY0ZpbHRlciAmJlxuICAgICAgICAgIG90aGVyLmZpbHRlckZuLnByb3AgPT09IHRoaXMuZmlsdGVyRm4ucHJvcCAmJlxuICAgICAgICAgIG90aGVyLmxvdyA9PT0gdGhpcy5fbG93ICYmXG4gICAgICAgICAgb3RoZXIuaGlnaCA9PT0gdGhpcy5faGlnaFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG90aGVyID09PSB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==