/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export class DayViewModel {
    constructor(dayModel, isTodaysDate = false, isExcluded = false, isDisabled = false, isSelected = false, isFocusable = false, isRangeStartDay = false, isRangeEndDay = false) {
        this.dayModel = dayModel;
        this.isTodaysDate = isTodaysDate;
        this.isExcluded = isExcluded;
        this.isDisabled = isDisabled;
        this.isSelected = isSelected;
        this.isFocusable = isFocusable;
        this.isRangeStartDay = isRangeStartDay;
        this.isRangeEndDay = isRangeEndDay;
    }
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex() {
        return this.isFocusable ? 0 : -1;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LXZpZXcubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL21vZGVsL2RheS12aWV3Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBSUgsTUFBTSxPQUFPLFlBQVk7SUFDdkIsWUFDUyxRQUFrQixFQUNsQixlQUF3QixLQUFLLEVBQzdCLGFBQXNCLEtBQUssRUFDM0IsYUFBc0IsS0FBSyxFQUMzQixhQUFzQixLQUFLLEVBQzNCLGNBQXVCLEtBQUssRUFDNUIsa0JBQTJCLEtBQUssRUFDaEMsZ0JBQXlCLEtBQUs7UUFQOUIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFDN0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQzVCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7SUFDcEMsQ0FBQztJQUVKOztPQUVHO0lBQ0gsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGF5TW9kZWwgfSBmcm9tICcuL2RheS5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBEYXlWaWV3TW9kZWwge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGF5TW9kZWw6IERheU1vZGVsLFxuICAgIHB1YmxpYyBpc1RvZGF5c0RhdGU6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBwdWJsaWMgaXNFeGNsdWRlZDogYm9vbGVhbiA9IGZhbHNlLFxuICAgIHB1YmxpYyBpc0Rpc2FibGVkOiBib29sZWFuID0gZmFsc2UsXG4gICAgcHVibGljIGlzU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBwdWJsaWMgaXNGb2N1c2FibGU6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBwdWJsaWMgaXNSYW5nZVN0YXJ0RGF5OiBib29sZWFuID0gZmFsc2UsXG4gICAgcHVibGljIGlzUmFuZ2VFbmREYXk6IGJvb2xlYW4gPSBmYWxzZVxuICApIHt9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRhYiBpbmRleCBiYXNlZCBvbiB0aGUgaXNGb2N1c2FibGUgZmxhZy5cbiAgICovXG4gIGdldCB0YWJJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmlzRm9jdXNhYmxlID8gMCA6IC0xO1xuICB9XG59XG4iXX0=