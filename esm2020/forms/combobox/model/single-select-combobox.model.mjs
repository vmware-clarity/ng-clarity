/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export class SingleSelectComboboxModel {
    containsItem(item) {
        return this.model === item;
    }
    select(item) {
        this.model = item;
    }
    unselect(item) {
        if (this.containsItem(item)) {
            this.model = null;
        }
    }
    isEmpty() {
        return !this.model;
    }
    pop() {
        const item = this.model;
        this.model = null;
        return item;
    }
    toString(displayField) {
        if (!this.model) {
            return '';
        }
        if (displayField && this.model[displayField]) {
            return this.model[displayField];
        }
        else {
            return this.model.toString();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLXNlbGVjdC1jb21ib2JveC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbWJvYm94L21vZGVsL3NpbmdsZS1zZWxlY3QtY29tYm9ib3gubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFJSCxNQUFNLE9BQU8seUJBQXlCO0lBR3BDLFlBQVksQ0FBQyxJQUFPO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFPO1FBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFPO1FBQ2QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsR0FBRztRQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsUUFBUSxDQUFDLFlBQXFCO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksWUFBWSxJQUFLLElBQUksQ0FBQyxLQUFhLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDckQsT0FBUSxJQUFJLENBQUMsS0FBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbWJvYm94TW9kZWwgfSBmcm9tICcuL2NvbWJvYm94Lm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIFNpbmdsZVNlbGVjdENvbWJvYm94TW9kZWw8VD4gaW1wbGVtZW50cyBDb21ib2JveE1vZGVsPFQ+IHtcbiAgbW9kZWw6IFQ7XG5cbiAgY29udGFpbnNJdGVtKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbCA9PT0gaXRlbTtcbiAgfVxuXG4gIHNlbGVjdChpdGVtOiBUKTogdm9pZCB7XG4gICAgdGhpcy5tb2RlbCA9IGl0ZW07XG4gIH1cblxuICB1bnNlbGVjdChpdGVtOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udGFpbnNJdGVtKGl0ZW0pKSB7XG4gICAgICB0aGlzLm1vZGVsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5tb2RlbDtcbiAgfVxuXG4gIHBvcCgpOiBUIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5tb2RlbDtcbiAgICB0aGlzLm1vZGVsID0gbnVsbDtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHRvU3RyaW5nKGRpc3BsYXlGaWVsZD86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLm1vZGVsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChkaXNwbGF5RmllbGQgJiYgKHRoaXMubW9kZWwgYXMgYW55KVtkaXNwbGF5RmllbGRdKSB7XG4gICAgICByZXR1cm4gKHRoaXMubW9kZWwgYXMgYW55KVtkaXNwbGF5RmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuIl19