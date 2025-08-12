/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Generic accessor for deep object properties
 * that can be specified as simple dot-separated strings.
 */
export class NestedProperty {
    constructor(prop) {
        this.prop = prop;
        if (prop.indexOf('.') >= 0) {
            this.splitProp = prop.split('.');
        }
    }
    // Safe getter for a deep object property, will not throw an error but return
    // undefined if one of the intermediate properties is null or undefined.
    getPropValue(item) {
        if (this.splitProp) {
            let value = item;
            for (const nestedProp of this.splitProp) {
                if (value === null ||
                    typeof value === 'undefined' ||
                    typeof value[nestedProp] === 'undefined') {
                    return undefined;
                }
                value = value[nestedProp];
            }
            return value;
        }
        else {
            return item[this.prop];
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXByb3BlcnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9idWlsdC1pbi9uZXN0ZWQtcHJvcGVydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUd6QixZQUFvQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCw2RUFBNkU7SUFDN0Usd0VBQXdFO0lBQ3hFLFlBQVksQ0FBQyxJQUFPO1FBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsS0FBSyxNQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN2QyxJQUNFLEtBQUssS0FBSyxJQUFJO29CQUNkLE9BQU8sS0FBSyxLQUFLLFdBQVc7b0JBQzVCLE9BQVEsS0FBNkIsQ0FBQyxVQUFVLENBQUMsS0FBSyxXQUFXLEVBQ2pFO29CQUNBLE9BQU8sU0FBUyxDQUFDO2lCQUNsQjtnQkFDRCxLQUFLLEdBQUksS0FBNkIsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNwRDtZQUNELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLE9BQVEsSUFBNEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbi8qKlxuICogR2VuZXJpYyBhY2Nlc3NvciBmb3IgZGVlcCBvYmplY3QgcHJvcGVydGllc1xuICogdGhhdCBjYW4gYmUgc3BlY2lmaWVkIGFzIHNpbXBsZSBkb3Qtc2VwYXJhdGVkIHN0cmluZ3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXN0ZWRQcm9wZXJ0eTxUID0gYW55PiB7XG4gIHByaXZhdGUgc3BsaXRQcm9wOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb3A6IHN0cmluZykge1xuICAgIGlmIChwcm9wLmluZGV4T2YoJy4nKSA+PSAwKSB7XG4gICAgICB0aGlzLnNwbGl0UHJvcCA9IHByb3Auc3BsaXQoJy4nKTtcbiAgICB9XG4gIH1cblxuICAvLyBTYWZlIGdldHRlciBmb3IgYSBkZWVwIG9iamVjdCBwcm9wZXJ0eSwgd2lsbCBub3QgdGhyb3cgYW4gZXJyb3IgYnV0IHJldHVyblxuICAvLyB1bmRlZmluZWQgaWYgb25lIG9mIHRoZSBpbnRlcm1lZGlhdGUgcHJvcGVydGllcyBpcyBudWxsIG9yIHVuZGVmaW5lZC5cbiAgZ2V0UHJvcFZhbHVlKGl0ZW06IFQpOiBhbnkge1xuICAgIGlmICh0aGlzLnNwbGl0UHJvcCkge1xuICAgICAgbGV0IHZhbHVlID0gaXRlbTtcbiAgICAgIGZvciAoY29uc3QgbmVzdGVkUHJvcCBvZiB0aGlzLnNwbGl0UHJvcCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdmFsdWUgPT09IG51bGwgfHxcbiAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgdHlwZW9mICh2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtuZXN0ZWRQcm9wXSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSA9ICh2YWx1ZSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtuZXN0ZWRQcm9wXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChpdGVtIGFzIFJlY29yZDxzdHJpbmcsIGFueT4pW3RoaXMucHJvcF07XG4gICAgfVxuICB9XG59XG4iXX0=