/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export class MultiSelectComboboxModel {
    containsItem(item) {
        return this.model ? this.model.includes(item) : false;
    }
    select(item) {
        this.addItem(item);
    }
    unselect(item) {
        this.removeItem(item);
    }
    isEmpty() {
        return !(this.model && this.model.length > 0);
    }
    pop() {
        let item;
        if (this.model && this.model.length > 0) {
            item = this.model[this.model.length - 1];
            this.removeItem(item);
        }
        return item;
    }
    toString(displayField, index = -1) {
        let displayString = '';
        if (this.model) {
            // If the model is array, we can use a specific item from it, to retrieve the display value.
            if (index > -1) {
                if (this.model[index]) {
                    // If we have a defined display field, we'll use it's value as display value
                    if (displayField && this.model[index][displayField]) {
                        displayString += this.model[index][displayField];
                    }
                    else {
                        // If we don't have a defined display field, we'll use the toString representation of the
                        // item as display value.
                        displayString += this.model[index].toString();
                    }
                }
            }
            else {
                this.model.forEach((model) => {
                    // If we have a defined display field, we'll use it's value as display value
                    if (displayField && model[displayField]) {
                        displayString += model[displayField];
                    }
                    else {
                        // If we don't have a defined display field, we'll use the toString representation of the
                        // model as display value.
                        displayString += model.toString();
                    }
                    displayString += ' ';
                });
            }
        }
        return displayString.trim();
    }
    addItem(item) {
        if (!this.containsItem(item)) {
            this.model = this.model || [];
            this.model.push(item);
        }
    }
    removeItem(item) {
        if (this.model === null || this.model === undefined) {
            return;
        }
        const index = this.model.indexOf(item);
        if (index > -1) {
            this.model.splice(index, 1);
        }
        // we intentionally set the model to null for form validation
        if (this.model.length === 0) {
            this.model = null;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LWNvbWJvYm94Lm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvbW9kZWwvbXVsdGktc2VsZWN0LWNvbWJvYm94Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBSUgsTUFBTSxPQUFPLHdCQUF3QjtJQUduQyxZQUFZLENBQUMsSUFBTztRQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDeEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFPO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQU87UUFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsR0FBRztRQUNELElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsUUFBUSxDQUFDLFlBQXFCLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsNEZBQTRGO1lBQzVGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNkLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDckIsNEVBQTRFO29CQUM1RSxJQUFJLFlBQVksSUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFO3dCQUM1RCxhQUFhLElBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDM0Q7eUJBQU07d0JBQ0wseUZBQXlGO3dCQUN6Rix5QkFBeUI7d0JBQ3pCLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUMvQztpQkFDRjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBUSxFQUFFLEVBQUU7b0JBQzlCLDRFQUE0RTtvQkFDNUUsSUFBSSxZQUFZLElBQUssS0FBYSxDQUFDLFlBQVksQ0FBQyxFQUFFO3dCQUNoRCxhQUFhLElBQUssS0FBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUMvQzt5QkFBTTt3QkFDTCx5RkFBeUY7d0JBQ3pGLDBCQUEwQjt3QkFDMUIsYUFBYSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDbkM7b0JBQ0QsYUFBYSxJQUFJLEdBQUcsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLE9BQU8sQ0FBQyxJQUFPO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRU8sVUFBVSxDQUFDLElBQU87UUFDeEIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNuRCxPQUFPO1NBQ1I7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUVELDZEQUE2RDtRQUM3RCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tYm9ib3hNb2RlbCB9IGZyb20gJy4vY29tYm9ib3gubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RDb21ib2JveE1vZGVsPFQ+IGltcGxlbWVudHMgQ29tYm9ib3hNb2RlbDxUPiB7XG4gIG1vZGVsOiBUW107XG5cbiAgY29udGFpbnNJdGVtKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuaW5jbHVkZXMoaXRlbSkgOiBmYWxzZTtcbiAgfVxuXG4gIHNlbGVjdChpdGVtOiBUKTogdm9pZCB7XG4gICAgdGhpcy5hZGRJdGVtKGl0ZW0pO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbTogVCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlSXRlbShpdGVtKTtcbiAgfVxuXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5tb2RlbCAmJiB0aGlzLm1vZGVsLmxlbmd0aCA+IDApO1xuICB9XG5cbiAgcG9wKCk6IFQge1xuICAgIGxldCBpdGVtO1xuICAgIGlmICh0aGlzLm1vZGVsICYmIHRoaXMubW9kZWwubGVuZ3RoID4gMCkge1xuICAgICAgaXRlbSA9IHRoaXMubW9kZWxbdGhpcy5tb2RlbC5sZW5ndGggLSAxXTtcbiAgICAgIHRoaXMucmVtb3ZlSXRlbShpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICB0b1N0cmluZyhkaXNwbGF5RmllbGQ/OiBzdHJpbmcsIGluZGV4ID0gLTEpOiBzdHJpbmcge1xuICAgIGxldCBkaXNwbGF5U3RyaW5nID0gJyc7XG5cbiAgICBpZiAodGhpcy5tb2RlbCkge1xuICAgICAgLy8gSWYgdGhlIG1vZGVsIGlzIGFycmF5LCB3ZSBjYW4gdXNlIGEgc3BlY2lmaWMgaXRlbSBmcm9tIGl0LCB0byByZXRyaWV2ZSB0aGUgZGlzcGxheSB2YWx1ZS5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGlmICh0aGlzLm1vZGVsW2luZGV4XSkge1xuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBkZWZpbmVkIGRpc3BsYXkgZmllbGQsIHdlJ2xsIHVzZSBpdCdzIHZhbHVlIGFzIGRpc3BsYXkgdmFsdWVcbiAgICAgICAgICBpZiAoZGlzcGxheUZpZWxkICYmICh0aGlzLm1vZGVsW2luZGV4XSBhcyBhbnkpW2Rpc3BsYXlGaWVsZF0pIHtcbiAgICAgICAgICAgIGRpc3BsYXlTdHJpbmcgKz0gKHRoaXMubW9kZWxbaW5kZXhdIGFzIGFueSlbZGlzcGxheUZpZWxkXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIGRlZmluZWQgZGlzcGxheSBmaWVsZCwgd2UnbGwgdXNlIHRoZSB0b1N0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICAgICAgICAgIC8vIGl0ZW0gYXMgZGlzcGxheSB2YWx1ZS5cbiAgICAgICAgICAgIGRpc3BsYXlTdHJpbmcgKz0gdGhpcy5tb2RlbFtpbmRleF0udG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW9kZWwuZm9yRWFjaCgobW9kZWw6IFQpID0+IHtcbiAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgZGVmaW5lZCBkaXNwbGF5IGZpZWxkLCB3ZSdsbCB1c2UgaXQncyB2YWx1ZSBhcyBkaXNwbGF5IHZhbHVlXG4gICAgICAgICAgaWYgKGRpc3BsYXlGaWVsZCAmJiAobW9kZWwgYXMgYW55KVtkaXNwbGF5RmllbGRdKSB7XG4gICAgICAgICAgICBkaXNwbGF5U3RyaW5nICs9IChtb2RlbCBhcyBhbnkpW2Rpc3BsYXlGaWVsZF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBkZWZpbmVkIGRpc3BsYXkgZmllbGQsIHdlJ2xsIHVzZSB0aGUgdG9TdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAgICAgICAgICAvLyBtb2RlbCBhcyBkaXNwbGF5IHZhbHVlLlxuICAgICAgICAgICAgZGlzcGxheVN0cmluZyArPSBtb2RlbC50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkaXNwbGF5U3RyaW5nICs9ICcgJztcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlTdHJpbmcudHJpbSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRJdGVtKGl0ZW06IFQpIHtcbiAgICBpZiAoIXRoaXMuY29udGFpbnNJdGVtKGl0ZW0pKSB7XG4gICAgICB0aGlzLm1vZGVsID0gdGhpcy5tb2RlbCB8fCBbXTtcbiAgICAgIHRoaXMubW9kZWwucHVzaChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUl0ZW0oaXRlbTogVCkge1xuICAgIGlmICh0aGlzLm1vZGVsID09PSBudWxsIHx8IHRoaXMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5tb2RlbC5pbmRleE9mKGl0ZW0pO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMubW9kZWwuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICAvLyB3ZSBpbnRlbnRpb25hbGx5IHNldCB0aGUgbW9kZWwgdG8gbnVsbCBmb3IgZm9ybSB2YWxpZGF0aW9uXG4gICAgaWYgKHRoaXMubW9kZWwubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLm1vZGVsID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==