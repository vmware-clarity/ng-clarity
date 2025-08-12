/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ALL_COLUMN_CHANGES } from '../enums/column-changes.enum';
import * as i0 from "@angular/core";
export class ColumnsService {
    constructor() {
        this.columns = [];
        this.columnsStateChange = new BehaviorSubject(null);
        this._cache = [];
    }
    get columnStates() {
        return this.columns.map(column => column.value);
    }
    get hasHideableColumns() {
        return this.columnStates.filter(state => state.hideable).length > 0;
    }
    get visibleColumns() {
        return this.columnStates.filter(state => !state.hidden);
    }
    cache() {
        this._cache = this.columns.map(subject => {
            const value = { ...subject.value };
            delete value.changes;
            return value;
        });
    }
    hasCache() {
        return !!this._cache.length;
    }
    resetToLastCache() {
        this._cache.forEach((state, index) => {
            // Just emit the exact value from the cache
            const cachedState = { ...state, changes: ALL_COLUMN_CHANGES };
            this.columns[index].next(cachedState);
            this.columnsStateChange.next(cachedState);
        });
        this._cache = [];
    }
    // Helper method to emit a change to a column only when there is an actual diff to process for that column
    emitStateChangeAt(columnIndex, diff) {
        if (!this.columns[columnIndex]) {
            return;
        }
        this.emitStateChange(this.columns[columnIndex], diff);
    }
    emitStateChange(column, diff) {
        const changedState = { ...column.value, ...diff };
        column.next(changedState);
        this.columnsStateChange.next(changedState);
    }
}
ColumnsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ColumnsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ColumnsService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1ucy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDOztBQUlsRSxNQUFNLE9BQU8sY0FBYztJQUQzQjtRQUVFLFlBQU8sR0FBbUMsRUFBRSxDQUFDO1FBQzdDLHVCQUFrQixHQUFpQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRSxXQUFNLEdBQWtCLEVBQUUsQ0FBQztLQWlEcEM7SUEvQ0MsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFBSSxrQkFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2QyxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25DLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNyQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM5QixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkMsMkNBQTJDO1lBQzNDLE1BQU0sV0FBVyxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLENBQUM7WUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCwwR0FBMEc7SUFDMUcsaUJBQWlCLENBQUMsV0FBbUIsRUFBRSxJQUFxQjtRQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUM5QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELGVBQWUsQ0FBQyxNQUFvQyxFQUFFLElBQXFCO1FBQ3pFLE1BQU0sWUFBWSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdDLENBQUM7OzJHQXBEVSxjQUFjOytHQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFEMUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFMTF9DT0xVTU5fQ0hBTkdFUyB9IGZyb20gJy4uL2VudW1zL2NvbHVtbi1jaGFuZ2VzLmVudW0nO1xuaW1wb3J0IHsgQ29sdW1uU3RhdGUsIENvbHVtblN0YXRlRGlmZiB9IGZyb20gJy4uL2ludGVyZmFjZXMvY29sdW1uLXN0YXRlLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb2x1bW5zU2VydmljZSB7XG4gIGNvbHVtbnM6IEJlaGF2aW9yU3ViamVjdDxDb2x1bW5TdGF0ZT5bXSA9IFtdO1xuICBjb2x1bW5zU3RhdGVDaGFuZ2U6IEJlaGF2aW9yU3ViamVjdDxDb2x1bW5TdGF0ZT4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KG51bGwpO1xuXG4gIHByaXZhdGUgX2NhY2hlOiBDb2x1bW5TdGF0ZVtdID0gW107XG5cbiAgZ2V0IGNvbHVtblN0YXRlcygpOiBDb2x1bW5TdGF0ZVtdIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5zLm1hcChjb2x1bW4gPT4gY29sdW1uLnZhbHVlKTtcbiAgfVxuXG4gIGdldCBoYXNIaWRlYWJsZUNvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uU3RhdGVzLmZpbHRlcihzdGF0ZSA9PiBzdGF0ZS5oaWRlYWJsZSkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGdldCB2aXNpYmxlQ29sdW1ucygpOiBDb2x1bW5TdGF0ZVtdIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5TdGF0ZXMuZmlsdGVyKHN0YXRlID0+ICFzdGF0ZS5oaWRkZW4pO1xuICB9XG5cbiAgY2FjaGUoKSB7XG4gICAgdGhpcy5fY2FjaGUgPSB0aGlzLmNvbHVtbnMubWFwKHN1YmplY3QgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSB7IC4uLnN1YmplY3QudmFsdWUgfTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS5jaGFuZ2VzO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgaGFzQ2FjaGUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2FjaGUubGVuZ3RoO1xuICB9XG5cbiAgcmVzZXRUb0xhc3RDYWNoZSgpIHtcbiAgICB0aGlzLl9jYWNoZS5mb3JFYWNoKChzdGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgIC8vIEp1c3QgZW1pdCB0aGUgZXhhY3QgdmFsdWUgZnJvbSB0aGUgY2FjaGVcbiAgICAgIGNvbnN0IGNhY2hlZFN0YXRlID0geyAuLi5zdGF0ZSwgY2hhbmdlczogQUxMX0NPTFVNTl9DSEFOR0VTIH07XG4gICAgICB0aGlzLmNvbHVtbnNbaW5kZXhdLm5leHQoY2FjaGVkU3RhdGUpO1xuICAgICAgdGhpcy5jb2x1bW5zU3RhdGVDaGFuZ2UubmV4dChjYWNoZWRTdGF0ZSk7XG4gICAgfSk7XG4gICAgdGhpcy5fY2FjaGUgPSBbXTtcbiAgfVxuXG4gIC8vIEhlbHBlciBtZXRob2QgdG8gZW1pdCBhIGNoYW5nZSB0byBhIGNvbHVtbiBvbmx5IHdoZW4gdGhlcmUgaXMgYW4gYWN0dWFsIGRpZmYgdG8gcHJvY2VzcyBmb3IgdGhhdCBjb2x1bW5cbiAgZW1pdFN0YXRlQ2hhbmdlQXQoY29sdW1uSW5kZXg6IG51bWJlciwgZGlmZjogQ29sdW1uU3RhdGVEaWZmKSB7XG4gICAgaWYgKCF0aGlzLmNvbHVtbnNbY29sdW1uSW5kZXhdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZW1pdFN0YXRlQ2hhbmdlKHRoaXMuY29sdW1uc1tjb2x1bW5JbmRleF0sIGRpZmYpO1xuICB9XG5cbiAgZW1pdFN0YXRlQ2hhbmdlKGNvbHVtbjogQmVoYXZpb3JTdWJqZWN0PENvbHVtblN0YXRlPiwgZGlmZjogQ29sdW1uU3RhdGVEaWZmKSB7XG4gICAgY29uc3QgY2hhbmdlZFN0YXRlID0geyAuLi5jb2x1bW4udmFsdWUsIC4uLmRpZmYgfTtcbiAgICBjb2x1bW4ubmV4dChjaGFuZ2VkU3RhdGUpO1xuICAgIHRoaXMuY29sdW1uc1N0YXRlQ2hhbmdlLm5leHQoY2hhbmdlZFN0YXRlKTtcbiAgfVxufVxuIl19