/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DefaultKeyNavigationStrategy } from './default';
export class ExpandedRowKeyNavigationStrategy extends DefaultKeyNavigationStrategy {
    constructor(utils) {
        super(utils);
    }
    keyUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (currentCellCoords.y === 0) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y - 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(currentCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y - 1;
            }
            switch (true) {
                case this.utils.isDetailsRow(nextCellCoords.y):
                    nextCellCoords.x = 0;
                    break;
                case this.utils.isDetailsRow(currentCellCoords.y) === false:
                    nextCellCoords.x = currentCellCoords.x;
                    break;
                default:
                    nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y) && nextCellCoords.y > 0) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
    keyDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        if (currentCellCoords.y >= numOfRows) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y + 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y + 1;
            }
            if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = 0;
            }
            else {
                nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else {
            nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y;
        }
        return nextCellCoords;
    }
    keyLeft(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyLeft(currentCellCoords);
        }
        if (currentCellCoords.x !== 0) {
            nextCellCoords.x = currentCellCoords.x - 1;
        }
        else if (!this.utils.isActionCell(currentCellCoords)) {
            nextCellCoords.y = currentCellCoords.y - 1;
            nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y) - 1;
        }
        return nextCellCoords;
    }
    keyRight(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyRight(currentCellCoords);
        }
        // calculate numOfColumns based on header cells.
        const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;
        if (currentCellCoords.x >= numOfColumns) {
            return nextCellCoords;
        }
        if (this.utils.isActionCell(currentCellCoords) &&
            currentCellCoords.x === this.utils.actionCellCount(currentCellCoords.x) - 1 &&
            this.utils.isRowReplaced(currentCellCoords.y) &&
            !this.utils.isDetailsRow(currentCellCoords.y)) {
            nextCellCoords.y = currentCellCoords.y + 1;
            nextCellCoords.x = 0;
        }
        else {
            nextCellCoords.x = currentCellCoords.x + 1;
        }
        return nextCellCoords;
    }
    keyEnd(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyEnd(currentCellCoords, ctrlKey);
        }
        nextCellCoords.x = this.utils.getCellsForRow(currentCellCoords.y).length - 1;
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const numOfColumns = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;
        if (ctrlKey) {
            nextCellCoords.x = numOfColumns;
            nextCellCoords.y = numOfRows;
        }
        return nextCellCoords;
    }
    keyHome(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyHome(currentCellCoords, ctrlKey);
        }
        nextCellCoords.x = 0;
        nextCellCoords.y = currentCellCoords.y - 1;
        if (ctrlKey) {
            nextCellCoords.y = 0;
        }
        return nextCellCoords;
    }
    keyPageUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                if (!this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                    nextCellCoords.x = 0;
                }
            }
            else if (!this.utils.isDetailsRow(currentCellCoords.y)) {
                if (this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = 0;
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y)) {
                if (!this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
                }
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
    keyPageDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                if (nextCellCoords.y < numOfRows && !this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
            else if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = 0;
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kZWQtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC91dGlscy9rZXktbmF2aWdhdGlvbi1zdHJhdGVnaWVzL2V4cGFuZGVkLXJvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUlILE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV6RCxNQUFNLE9BQU8sZ0NBQWlDLFNBQVEsNEJBQTRCO0lBQ2hGLFlBQVksS0FBeUI7UUFDbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUVRLEtBQUssQ0FBQyxpQkFBa0M7UUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRTFFLElBQUksaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLGNBQWMsQ0FBQztTQUN2QjtRQUVELGNBQWMsQ0FBQyxDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMvQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqRCxjQUFjLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsUUFBUSxJQUFJLEVBQUU7Z0JBQ1osS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckIsTUFBTTtnQkFDUixLQUFLLElB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QUssQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZGO2lCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwRCxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtTQUNGO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEQsY0FBYyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ2VsbENvb3JkaW5hdGVzIH0gZnJvbSAnLi4va2V5LW5hdmlnYXRpb24tZ3JpZC5jb250cm9sbGVyJztcbmltcG9ydCB7IEtleU5hdmlnYXRpb25VdGlscyB9IGZyb20gJy4uL2tleS1uYXZpZ2F0aW9uLXV0aWxzJztcbmltcG9ydCB7IERlZmF1bHRLZXlOYXZpZ2F0aW9uU3RyYXRlZ3kgfSBmcm9tICcuL2RlZmF1bHQnO1xuXG5leHBvcnQgY2xhc3MgRXhwYW5kZWRSb3dLZXlOYXZpZ2F0aW9uU3RyYXRlZ3kgZXh0ZW5kcyBEZWZhdWx0S2V5TmF2aWdhdGlvblN0cmF0ZWd5IHtcbiAgY29uc3RydWN0b3IodXRpbHM6IEtleU5hdmlnYXRpb25VdGlscykge1xuICAgIHN1cGVyKHV0aWxzKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGtleVVwKGN1cnJlbnRDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXMpIHtcbiAgICBjb25zdCBuZXh0Q2VsbENvb3JkcyA9IHRoaXMudXRpbHMuY3JlYXRlTmV4dENlbGxDb29yZHMoY3VycmVudENlbGxDb29yZHMpO1xuXG4gICAgaWYgKGN1cnJlbnRDZWxsQ29vcmRzLnkgPT09IDApIHtcbiAgICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgICB9XG5cbiAgICBuZXh0Q2VsbENvb3Jkcy55ID0gY3VycmVudENlbGxDb29yZHMueSAtIDE7XG5cbiAgICBpZiAoIXRoaXMudXRpbHMuaXNBY3Rpb25DZWxsKGN1cnJlbnRDZWxsQ29vcmRzKSkge1xuICAgICAgaWYgKHRoaXMudXRpbHMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbmV4dENlbGxDb29yZHMueSAtIDE7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICBjYXNlIHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpOlxuICAgICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpID09PSBmYWxzZTpcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gdGhpcy51dGlscy5hY3Rpb25DZWxsQ291bnQobmV4dENlbGxDb29yZHMueSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnV0aWxzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSAmJiBuZXh0Q2VsbENvb3Jkcy55ID4gMCkge1xuICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgLSAxO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgfVxuXG4gIG92ZXJyaWRlIGtleURvd24oY3VycmVudENlbGxDb29yZHM6IENlbGxDb29yZGluYXRlcykge1xuICAgIGNvbnN0IG5leHRDZWxsQ29vcmRzID0gdGhpcy51dGlscy5jcmVhdGVOZXh0Q2VsbENvb3JkcyhjdXJyZW50Q2VsbENvb3Jkcyk7XG5cbiAgICBjb25zdCBudW1PZlJvd3MgPSB0aGlzLnV0aWxzLnJvd3MgPyB0aGlzLnV0aWxzLnJvd3MubGVuZ3RoIC0gMSA6IDA7XG4gICAgaWYgKGN1cnJlbnRDZWxsQ29vcmRzLnkgPj0gbnVtT2ZSb3dzKSB7XG4gICAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gICAgfVxuXG4gICAgbmV4dENlbGxDb29yZHMueSA9IGN1cnJlbnRDZWxsQ29vcmRzLnkgKyAxO1xuXG4gICAgaWYgKCF0aGlzLnV0aWxzLmlzQWN0aW9uQ2VsbChjdXJyZW50Q2VsbENvb3JkcykpIHtcbiAgICAgIGlmICh0aGlzLnV0aWxzLmlzUm93UmVwbGFjZWQobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgKyAxO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy51dGlscy5pc0RldGFpbHNSb3cobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gdGhpcy51dGlscy5hY3Rpb25DZWxsQ291bnQobmV4dENlbGxDb29yZHMueSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSBuZXh0Q2VsbENvb3Jkcy55IDwgbnVtT2ZSb3dzID8gbmV4dENlbGxDb29yZHMueSArIDEgOiBuZXh0Q2VsbENvb3Jkcy55O1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgfVxuXG4gIG92ZXJyaWRlIGtleUxlZnQoY3VycmVudENlbGxDb29yZHM6IENlbGxDb29yZGluYXRlcykge1xuICAgIGNvbnN0IG5leHRDZWxsQ29vcmRzID0gdGhpcy51dGlscy5jcmVhdGVOZXh0Q2VsbENvb3JkcyhjdXJyZW50Q2VsbENvb3Jkcyk7XG5cbiAgICBpZiAoIXRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpICYmICF0aGlzLnV0aWxzLmlzUm93UmVwbGFjZWQoY3VycmVudENlbGxDb29yZHMueSkpIHtcbiAgICAgIHJldHVybiBzdXBlci5rZXlMZWZ0KGN1cnJlbnRDZWxsQ29vcmRzKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudENlbGxDb29yZHMueCAhPT0gMCkge1xuICAgICAgbmV4dENlbGxDb29yZHMueCA9IGN1cnJlbnRDZWxsQ29vcmRzLnggLSAxO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMudXRpbHMuaXNBY3Rpb25DZWxsKGN1cnJlbnRDZWxsQ29vcmRzKSkge1xuICAgICAgbmV4dENlbGxDb29yZHMueSA9IGN1cnJlbnRDZWxsQ29vcmRzLnkgLSAxO1xuICAgICAgbmV4dENlbGxDb29yZHMueCA9IHRoaXMudXRpbHMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpIC0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gIH1cblxuICBvdmVycmlkZSBrZXlSaWdodChjdXJyZW50Q2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzKSB7XG4gICAgY29uc3QgbmV4dENlbGxDb29yZHMgPSB0aGlzLnV0aWxzLmNyZWF0ZU5leHRDZWxsQ29vcmRzKGN1cnJlbnRDZWxsQ29vcmRzKTtcblxuICAgIGlmICghdGhpcy51dGlscy5pc0RldGFpbHNSb3coY3VycmVudENlbGxDb29yZHMueSkgJiYgIXRoaXMudXRpbHMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmtleVJpZ2h0KGN1cnJlbnRDZWxsQ29vcmRzKTtcbiAgICB9XG5cbiAgICAvLyBjYWxjdWxhdGUgbnVtT2ZDb2x1bW5zIGJhc2VkIG9uIGhlYWRlciBjZWxscy5cbiAgICBjb25zdCBudW1PZkNvbHVtbnMgPSB0aGlzLnV0aWxzLnJvd3M/Lmxlbmd0aCAtIDEgPyB0aGlzLnV0aWxzLmdldENlbGxzRm9yUm93KDApLmxlbmd0aCAtIDEgOiAwO1xuXG4gICAgaWYgKGN1cnJlbnRDZWxsQ29vcmRzLnggPj0gbnVtT2ZDb2x1bW5zKSB7XG4gICAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy51dGlscy5pc0FjdGlvbkNlbGwoY3VycmVudENlbGxDb29yZHMpICYmXG4gICAgICBjdXJyZW50Q2VsbENvb3Jkcy54ID09PSB0aGlzLnV0aWxzLmFjdGlvbkNlbGxDb3VudChjdXJyZW50Q2VsbENvb3Jkcy54KSAtIDEgJiZcbiAgICAgIHRoaXMudXRpbHMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSAmJlxuICAgICAgIXRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpXG4gICAgKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gY3VycmVudENlbGxDb29yZHMueSArIDE7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dENlbGxDb29yZHMueCA9IGN1cnJlbnRDZWxsQ29vcmRzLnggKyAxO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgfVxuXG4gIG92ZXJyaWRlIGtleUVuZChjdXJyZW50Q2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzLCBjdHJsS2V5OiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV4dENlbGxDb29yZHMgPSB0aGlzLnV0aWxzLmNyZWF0ZU5leHRDZWxsQ29vcmRzKGN1cnJlbnRDZWxsQ29vcmRzKTtcblxuICAgIGlmICghdGhpcy51dGlscy5pc0RldGFpbHNSb3coY3VycmVudENlbGxDb29yZHMueSkgJiYgIXRoaXMudXRpbHMuaXNSb3dSZXBsYWNlZChjdXJyZW50Q2VsbENvb3Jkcy55KSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmtleUVuZChjdXJyZW50Q2VsbENvb3JkcywgY3RybEtleSk7XG4gICAgfVxuXG4gICAgbmV4dENlbGxDb29yZHMueCA9IHRoaXMudXRpbHMuZ2V0Q2VsbHNGb3JSb3coY3VycmVudENlbGxDb29yZHMueSkubGVuZ3RoIC0gMTtcblxuICAgIGNvbnN0IG51bU9mUm93cyA9IHRoaXMudXRpbHMucm93cyA/IHRoaXMudXRpbHMucm93cy5sZW5ndGggLSAxIDogMDtcbiAgICBjb25zdCBudW1PZkNvbHVtbnMgPSBudW1PZlJvd3MgPyB0aGlzLnV0aWxzLmdldENlbGxzRm9yUm93KDApLmxlbmd0aCAtIDEgOiAwO1xuICAgIGlmIChjdHJsS2V5KSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gbnVtT2ZDb2x1bW5zO1xuICAgICAgbmV4dENlbGxDb29yZHMueSA9IG51bU9mUm93cztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dENlbGxDb29yZHM7XG4gIH1cblxuICBvdmVycmlkZSBrZXlIb21lKGN1cnJlbnRDZWxsQ29vcmRzOiBDZWxsQ29vcmRpbmF0ZXMsIGN0cmxLZXk6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXh0Q2VsbENvb3JkcyA9IHRoaXMudXRpbHMuY3JlYXRlTmV4dENlbGxDb29yZHMoY3VycmVudENlbGxDb29yZHMpO1xuXG4gICAgaWYgKCF0aGlzLnV0aWxzLmlzRGV0YWlsc1JvdyhjdXJyZW50Q2VsbENvb3Jkcy55KSAmJiAhdGhpcy51dGlscy5pc1Jvd1JlcGxhY2VkKGN1cnJlbnRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICByZXR1cm4gc3VwZXIua2V5SG9tZShjdXJyZW50Q2VsbENvb3JkcywgY3RybEtleSk7XG4gICAgfVxuXG4gICAgbmV4dENlbGxDb29yZHMueCA9IDA7XG4gICAgbmV4dENlbGxDb29yZHMueSA9IGN1cnJlbnRDZWxsQ29vcmRzLnkgLSAxO1xuXG4gICAgaWYgKGN0cmxLZXkpIHtcbiAgICAgIG5leHRDZWxsQ29vcmRzLnkgPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0Q2VsbENvb3JkcztcbiAgfVxuXG4gIG92ZXJyaWRlIGtleVBhZ2VVcChjdXJyZW50Q2VsbENvb3JkczogQ2VsbENvb3JkaW5hdGVzKSB7XG4gICAgY29uc3QgbmV4dENlbGxDb29yZHMgPSB0aGlzLnV0aWxzLmNyZWF0ZU5leHRDZWxsQ29vcmRzKGN1cnJlbnRDZWxsQ29vcmRzKTtcbiAgICBjb25zdCBpdGVtc1BlclBhZ2UgPSB0aGlzLnV0aWxzLml0ZW1zUGVyUGFnZTtcblxuICAgIG5leHRDZWxsQ29vcmRzLnkgPSBjdXJyZW50Q2VsbENvb3Jkcy55IC0gaXRlbXNQZXJQYWdlID4gMCA/IGN1cnJlbnRDZWxsQ29vcmRzLnkgLSBpdGVtc1BlclBhZ2UgKyAxIDogMTtcblxuICAgIGlmICghdGhpcy51dGlscy5pc0FjdGlvbkNlbGwoY3VycmVudENlbGxDb29yZHMpKSB7XG4gICAgICBpZiAodGhpcy51dGlscy5pc1Jvd1JlcGxhY2VkKG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIGlmICghdGhpcy51dGlscy5pc0RldGFpbHNSb3cobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbmV4dENlbGxDb29yZHMueSArIDE7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIGlmICh0aGlzLnV0aWxzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICAgIG5leHRDZWxsQ29vcmRzLnggPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgIGlmICghdGhpcy51dGlscy5pc0RldGFpbHNSb3cobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gdGhpcy51dGlscy5hY3Rpb25DZWxsQ291bnQobmV4dENlbGxDb29yZHMueSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbmV4dENlbGxDb29yZHMueSAtIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRDZWxsQ29vcmRzO1xuICB9XG5cbiAgb3ZlcnJpZGUga2V5UGFnZURvd24oY3VycmVudENlbGxDb29yZHM6IENlbGxDb29yZGluYXRlcykge1xuICAgIGNvbnN0IG5leHRDZWxsQ29vcmRzID0gdGhpcy51dGlscy5jcmVhdGVOZXh0Q2VsbENvb3JkcyhjdXJyZW50Q2VsbENvb3Jkcyk7XG5cbiAgICBjb25zdCBudW1PZlJvd3MgPSB0aGlzLnV0aWxzLnJvd3MgPyB0aGlzLnV0aWxzLnJvd3MubGVuZ3RoIC0gMSA6IDA7XG4gICAgY29uc3QgaXRlbXNQZXJQYWdlID0gdGhpcy51dGlscy5pdGVtc1BlclBhZ2U7XG5cbiAgICBuZXh0Q2VsbENvb3Jkcy55ID0gY3VycmVudENlbGxDb29yZHMueSArIGl0ZW1zUGVyUGFnZSA+PSBudW1PZlJvd3MgPyBudW1PZlJvd3MgOiBjdXJyZW50Q2VsbENvb3Jkcy55ICsgaXRlbXNQZXJQYWdlO1xuXG4gICAgaWYgKCF0aGlzLnV0aWxzLmlzQWN0aW9uQ2VsbChjdXJyZW50Q2VsbENvb3JkcykpIHtcbiAgICAgIGlmICh0aGlzLnV0aWxzLmlzUm93UmVwbGFjZWQobmV4dENlbGxDb29yZHMueSkpIHtcbiAgICAgICAgaWYgKG5leHRDZWxsQ29vcmRzLnkgPCBudW1PZlJvd3MgJiYgIXRoaXMudXRpbHMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICAgICAgbmV4dENlbGxDb29yZHMueSA9IG5leHRDZWxsQ29vcmRzLnkgKyAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KGN1cnJlbnRDZWxsQ29vcmRzLnkpICYmICF0aGlzLnV0aWxzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gY3VycmVudENlbGxDb29yZHMueCArIHRoaXMudXRpbHMuYWN0aW9uQ2VsbENvdW50KG5leHRDZWxsQ29vcmRzLnkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnV0aWxzLmlzRGV0YWlsc1JvdyhuZXh0Q2VsbENvb3Jkcy55KSkge1xuICAgICAgICBuZXh0Q2VsbENvb3Jkcy54ID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMudXRpbHMuaXNEZXRhaWxzUm93KG5leHRDZWxsQ29vcmRzLnkpKSB7XG4gICAgICBuZXh0Q2VsbENvb3Jkcy55ID0gbmV4dENlbGxDb29yZHMueSAtIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHRDZWxsQ29vcmRzO1xuICB9XG59XG4iXX0=