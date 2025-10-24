/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Subject } from 'rxjs';
import { DatagridPropertyStringFilter } from './datagrid-property-string-filter';
export class DatagridStringFilterImpl {
    constructor(filterFn) {
        this.filterFn = filterFn;
        /**
         * The Observable required as part of the Filter interface
         */
        this._changes = new Subject();
        /**
         * Input value converted to lowercase
         */
        this._lowerCaseValue = '';
        /**
         * Raw input value
         */
        this._rawValue = '';
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get changes() {
        return this._changes.asObservable();
    }
    get lowerCaseValue() {
        return this._lowerCaseValue;
    }
    get state() {
        if (this.filterFn instanceof DatagridPropertyStringFilter) {
            return {
                property: this.filterFn.prop,
                value: this.value,
            };
        }
        return this;
    }
    get value() {
        return this._rawValue;
    }
    /**
     * Common setter for the input value
     */
    set value(value) {
        if (!value) {
            value = '';
        }
        if (value !== this._rawValue) {
            this._rawValue = value;
            this._lowerCaseValue = value.toLowerCase().trim();
            this._changes.next(value);
        }
    }
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    isActive() {
        return !!this.value;
    }
    /**
     * Tests if an item matches a search text
     */
    accepts(item) {
        // We always test with the lowercase value of the input, to stay case insensitive
        return this.filterFn.accepts(item, this.lowerCaseValue);
    }
    equals(other) {
        if (other instanceof DatagridStringFilterImpl) {
            if (other.filterFn instanceof DatagridPropertyStringFilter) {
                return (this.filterFn instanceof DatagridPropertyStringFilter &&
                    other.filterFn.prop === this.filterFn.prop &&
                    other.value === this.value);
            }
            return other === this;
        }
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtc3RyaW5nLWZpbHRlci1pbXBsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9idWlsdC1pbi9maWx0ZXJzL2RhdGFncmlkLXN0cmluZy1maWx0ZXItaW1wbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFJM0MsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFakYsTUFBTSxPQUFPLHdCQUF3QjtJQWdCbkMsWUFBbUIsUUFBNkM7UUFBN0MsYUFBUSxHQUFSLFFBQVEsQ0FBcUM7UUFmaEU7O1dBRUc7UUFDSyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUV6Qzs7V0FFRztRQUNLLG9CQUFlLEdBQUcsRUFBRSxDQUFDO1FBRTdCOztXQUVHO1FBQ0ssY0FBUyxHQUFHLEVBQUUsQ0FBQztJQUU0QyxDQUFDO0lBRXBFLHFGQUFxRjtJQUNyRixJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsWUFBWSw0QkFBNEIsRUFBRTtZQUN6RCxPQUFPO2dCQUNMLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7Z0JBQzVCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzthQUNsQixDQUFDO1NBQ0g7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNEOztPQUVHO0lBQ0gsSUFBSSxLQUFLLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNaO1FBQ0QsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILFFBQVE7UUFDTixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxJQUFPO1FBQ2IsaUZBQWlGO1FBQ2pGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQXlDO1FBQzlDLElBQUksS0FBSyxZQUFZLHdCQUF3QixFQUFFO1lBQzdDLElBQUksS0FBSyxDQUFDLFFBQVEsWUFBWSw0QkFBNEIsRUFBRTtnQkFDMUQsT0FBTyxDQUNMLElBQUksQ0FBQyxRQUFRLFlBQVksNEJBQTRCO29CQUNyRCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7b0JBQzFDLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FDM0IsQ0FBQzthQUNIO1lBQ0QsT0FBTyxLQUFLLEtBQUssSUFBSSxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2ZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3N0cmluZy1maWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IERhdGFncmlkUHJvcGVydHlTdHJpbmdGaWx0ZXIgfSBmcm9tICcuL2RhdGFncmlkLXByb3BlcnR5LXN0cmluZy1maWx0ZXInO1xuXG5leHBvcnQgY2xhc3MgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsPFQgPSBhbnk+IGltcGxlbWVudHMgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD4ge1xuICAvKipcbiAgICogVGhlIE9ic2VydmFibGUgcmVxdWlyZWQgYXMgcGFydCBvZiB0aGUgRmlsdGVyIGludGVyZmFjZVxuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlcyA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICAvKipcbiAgICogSW5wdXQgdmFsdWUgY29udmVydGVkIHRvIGxvd2VyY2FzZVxuICAgKi9cbiAgcHJpdmF0ZSBfbG93ZXJDYXNlVmFsdWUgPSAnJztcblxuICAvKipcbiAgICogUmF3IGlucHV0IHZhbHVlXG4gICAqL1xuICBwcml2YXRlIF9yYXdWYWx1ZSA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBmaWx0ZXJGbjogQ2xyRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbnRlcmZhY2U8VD4pIHt9XG5cbiAgLy8gV2UgZG8gbm90IHdhbnQgdG8gZXhwb3NlIHRoZSBTdWJqZWN0IGl0c2VsZiwgYnV0IHRoZSBPYnNlcnZhYmxlIHdoaWNoIGlzIHJlYWQtb25seVxuICBnZXQgY2hhbmdlcygpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGxvd2VyQ2FzZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9sb3dlckNhc2VWYWx1ZTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJGbiBpbnN0YW5jZW9mIERhdGFncmlkUHJvcGVydHlTdHJpbmdGaWx0ZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByb3BlcnR5OiB0aGlzLmZpbHRlckZuLnByb3AsXG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmF3VmFsdWU7XG4gIH1cbiAgLyoqXG4gICAqIENvbW1vbiBzZXR0ZXIgZm9yIHRoZSBpbnB1dCB2YWx1ZVxuICAgKi9cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB2YWx1ZSA9ICcnO1xuICAgIH1cbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Jhd1ZhbHVlKSB7XG4gICAgICB0aGlzLl9yYXdWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fbG93ZXJDYXNlVmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICAgIHRoaXMuX2NoYW5nZXMubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGUgZmlsdGVyIGlzIGN1cnJlbnRseSBhY3RpdmUsIG1lYW5pbmcgdGhlIGlucHV0IGlzIG5vdCBlbXB0eVxuICAgKi9cbiAgaXNBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXN0cyBpZiBhbiBpdGVtIG1hdGNoZXMgYSBzZWFyY2ggdGV4dFxuICAgKi9cbiAgYWNjZXB0cyhpdGVtOiBUKTogYm9vbGVhbiB7XG4gICAgLy8gV2UgYWx3YXlzIHRlc3Qgd2l0aCB0aGUgbG93ZXJjYXNlIHZhbHVlIG9mIHRoZSBpbnB1dCwgdG8gc3RheSBjYXNlIGluc2Vuc2l0aXZlXG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyRm4uYWNjZXB0cyhpdGVtLCB0aGlzLmxvd2VyQ2FzZVZhbHVlKTtcbiAgfVxuXG4gIGVxdWFscyhvdGhlcjogQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VCwgYW55Pik6IGJvb2xlYW4ge1xuICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIERhdGFncmlkU3RyaW5nRmlsdGVySW1wbCkge1xuICAgICAgaWYgKG90aGVyLmZpbHRlckZuIGluc3RhbmNlb2YgRGF0YWdyaWRQcm9wZXJ0eVN0cmluZ0ZpbHRlcikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIHRoaXMuZmlsdGVyRm4gaW5zdGFuY2VvZiBEYXRhZ3JpZFByb3BlcnR5U3RyaW5nRmlsdGVyICYmXG4gICAgICAgICAgb3RoZXIuZmlsdGVyRm4ucHJvcCA9PT0gdGhpcy5maWx0ZXJGbi5wcm9wICYmXG4gICAgICAgICAgb3RoZXIudmFsdWUgPT09IHRoaXMudmFsdWVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdGhlciA9PT0gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=