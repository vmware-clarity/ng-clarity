/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const YEARS_TO_DISPLAY = 10;
export class YearRangeModel {
    constructor(year) {
        this.year = year;
        this.yearRange = [];
        this.generateYearRange();
    }
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear() {
        return this.yearRange[Math.floor(this.yearRange.length / 2)];
    }
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade() {
        return new YearRangeModel(this.year + 10);
    }
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade() {
        return new YearRangeModel(this.year - 10);
    }
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade() {
        return new YearRangeModel(new Date().getFullYear());
    }
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value) {
        return this.yearRange.indexOf(value) > -1;
    }
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    generateYearRange() {
        const remainder = this.year % YEARS_TO_DISPLAY;
        const floor = this.year - remainder;
        const ceil = floor + YEARS_TO_DISPLAY;
        this.yearRange = this.generateRange(floor, ceil);
    }
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    generateRange(floor, ceil) {
        return Array.from({ length: ceil - floor }, (_v, k) => k + floor);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhci1yYW5nZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvbW9kZWwveWVhci1yYW5nZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBRTVCLE1BQU0sT0FBTyxjQUFjO0lBR3pCLFlBQTZCLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBRnpDLGNBQVMsR0FBYSxFQUFFLENBQUM7UUFHdkIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxVQUFVO1FBQ1IsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWM7UUFDWixPQUFPLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsYUFBYTtRQUNYLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxLQUFhO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGlCQUFpQjtRQUN2QixNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO1FBQ3ZELE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQzVDLE1BQU0sSUFBSSxHQUFXLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNLLGFBQWEsQ0FBQyxLQUFhLEVBQUUsSUFBWTtRQUMvQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuY29uc3QgWUVBUlNfVE9fRElTUExBWSA9IDEwO1xuXG5leHBvcnQgY2xhc3MgWWVhclJhbmdlTW9kZWwge1xuICB5ZWFyUmFuZ2U6IG51bWJlcltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB5ZWFyOiBudW1iZXIpIHtcbiAgICB0aGlzLmdlbmVyYXRlWWVhclJhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbnVtYmVyIGluIHRoZSBtaWRkbGUgb2YgdGhlIHJhbmdlLlxuICAgKi9cbiAgZ2V0IG1pZGRsZVllYXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy55ZWFyUmFuZ2VbTWF0aC5mbG9vcih0aGlzLnllYXJSYW5nZS5sZW5ndGggLyAyKV07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBZZWFyUmFuZ2VNb2RlbCBmb3IgdGhlIG5leHQgZGVjYWRlLlxuICAgKi9cbiAgbmV4dERlY2FkZSgpOiBZZWFyUmFuZ2VNb2RlbCB7XG4gICAgcmV0dXJuIG5ldyBZZWFyUmFuZ2VNb2RlbCh0aGlzLnllYXIgKyAxMCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBZZWFyUmFuZ2VNb2RlbCBmb3IgdGhlIHByZXZpb3VzIGRlY2FkZS5cbiAgICovXG4gIHByZXZpb3VzRGVjYWRlKCk6IFllYXJSYW5nZU1vZGVsIHtcbiAgICByZXR1cm4gbmV3IFllYXJSYW5nZU1vZGVsKHRoaXMueWVhciAtIDEwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIFllYXJSYW5nZU1vZGVsIGZvciB0aGUgY3VycmVudCBkZWNhZGUuXG4gICAqL1xuICBjdXJyZW50RGVjYWRlKCk6IFllYXJSYW5nZU1vZGVsIHtcbiAgICByZXR1cm4gbmV3IFllYXJSYW5nZU1vZGVsKG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBpbiB0aGUgWWVhclJhbmdlTW9kZWwuXG4gICAqL1xuICBpblJhbmdlKHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy55ZWFyUmFuZ2UuaW5kZXhPZih2YWx1ZSkgPiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgdGhlIHllYXIgcmFuZ2UgYmFzZWQgb24gdGhlIHllYXIgcGFyYW1ldGVyLlxuICAgKiBlZzogSWYgMjAxOCBpcyBwYXNzZWQgdGhlIG91dHB1dCB3aWxsIGJlIFsyMDEwLCAyMDExLCAuLi4sIDIwMTldXG4gICAqL1xuICBwcml2YXRlIGdlbmVyYXRlWWVhclJhbmdlKCkge1xuICAgIGNvbnN0IHJlbWFpbmRlcjogbnVtYmVyID0gdGhpcy55ZWFyICUgWUVBUlNfVE9fRElTUExBWTtcbiAgICBjb25zdCBmbG9vcjogbnVtYmVyID0gdGhpcy55ZWFyIC0gcmVtYWluZGVyO1xuICAgIGNvbnN0IGNlaWw6IG51bWJlciA9IGZsb29yICsgWUVBUlNfVE9fRElTUExBWTtcbiAgICB0aGlzLnllYXJSYW5nZSA9IHRoaXMuZ2VuZXJhdGVSYW5nZShmbG9vciwgY2VpbCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gd2hpY2ggZ2VuZXJhdGUgYSByYW5nZSBvZiBudW1iZXJzIGZyb20gZmxvb3IgdG8gY2VpbC5cbiAgICovXG4gIHByaXZhdGUgZ2VuZXJhdGVSYW5nZShmbG9vcjogbnVtYmVyLCBjZWlsOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNlaWwgLSBmbG9vciB9LCAoX3YsIGspID0+IGsgKyBmbG9vcik7XG4gIH1cbn1cbiJdfQ==