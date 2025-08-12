/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class TreeFocusManagerService {
    constructor() {
        this._focusRequest = new Subject();
        this._focusChange = new Subject();
    }
    get focusRequest() {
        return this._focusRequest.asObservable();
    }
    get focusChange() {
        return this._focusChange.asObservable();
    }
    focusNode(model) {
        if (model) {
            this._focusRequest.next(model.nodeId);
        }
    }
    broadcastFocusedNode(nodeId) {
        if (this.focusedNodeId !== nodeId) {
            this.focusedNodeId = nodeId;
            this._focusChange.next(nodeId);
        }
    }
    focusParent(model) {
        if (model) {
            this.focusNode(model.parent);
        }
    }
    focusFirstVisibleNode() {
        const focusModel = this.rootNodeModels && this.rootNodeModels[0];
        this.focusNode(focusModel);
    }
    focusLastVisibleNode() {
        this.focusNode(this.findLastVisibleInTree());
    }
    focusNodeAbove(model) {
        this.focusNode(this.findNodeAbove(model));
    }
    focusNodeBelow(model) {
        this.focusNode(this.findNodeBelow(model));
    }
    focusNodeStartsWith(searchString, model) {
        this.focusNode(this.findClosestNodeStartsWith(searchString, model));
    }
    findSiblings(model) {
        // the method will return not only sibling models but also itself among them
        if (model.parent) {
            return model.parent.children;
        }
        else {
            return this.rootNodeModels;
        }
    }
    findLastVisibleInNode(model) {
        // the method will traverse through until it finds the last visible node from the given node
        if (!model) {
            return null;
        }
        if (model.expanded && model.children.length > 0) {
            const children = model.children;
            const lastChild = children[children.length - 1];
            return this.findLastVisibleInNode(lastChild);
        }
        else {
            return model;
        }
    }
    findNextFocusable(model) {
        if (!model) {
            return null;
        }
        const siblings = this.findSiblings(model);
        const selfIndex = siblings.indexOf(model);
        if (selfIndex < siblings.length - 1) {
            return siblings[selfIndex + 1];
        }
        else if (selfIndex === siblings.length - 1) {
            return this.findNextFocusable(model.parent);
        }
        return null;
    }
    findLastVisibleInTree() {
        const lastRootNode = this.rootNodeModels && this.rootNodeModels.length && this.rootNodeModels[this.rootNodeModels.length - 1];
        return this.findLastVisibleInNode(lastRootNode);
    }
    findNodeAbove(model) {
        if (!model) {
            return null;
        }
        const siblings = this.findSiblings(model);
        const selfIndex = siblings.indexOf(model);
        if (selfIndex === 0) {
            return model.parent;
        }
        else if (selfIndex > 0) {
            return this.findLastVisibleInNode(siblings[selfIndex - 1]);
        }
        return null;
    }
    findNodeBelow(model) {
        if (!model) {
            return null;
        }
        if (model.expanded && model.children.length > 0) {
            return model.children[0];
        }
        else {
            return this.findNextFocusable(model);
        }
    }
    findDescendentNodeStartsWith(searchString, model) {
        if (model.expanded && model.children.length > 0) {
            for (const childModel of model.children) {
                const found = this.findNodeStartsWith(searchString, childModel);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }
    findSiblingNodeStartsWith(searchString, model) {
        const siblings = this.findSiblings(model);
        const selfIndex = siblings.indexOf(model);
        // Look from sibling nodes
        for (let i = selfIndex + 1; i < siblings.length; i++) {
            const siblingModel = siblings[i];
            const found = this.findNodeStartsWith(searchString, siblingModel);
            if (found) {
                return found;
            }
        }
        return null;
    }
    findRootNodeStartsWith(searchString, model) {
        for (const rootModel of this.rootNodeModels) {
            // Don't look from a parent yet
            if (model.parent && model.parent === rootModel) {
                continue;
            }
            const found = this.findNodeStartsWith(searchString, rootModel);
            if (found) {
                return found;
            }
        }
        return null;
    }
    findNodeStartsWith(searchString, model) {
        if (!model) {
            return null;
        }
        if (model.textContent.startsWith(searchString)) {
            return model;
        }
        return this.findDescendentNodeStartsWith(searchString, model);
    }
    findClosestNodeStartsWith(searchString, model) {
        if (!model) {
            return null;
        }
        const foundFromDescendents = this.findDescendentNodeStartsWith(searchString, model);
        if (foundFromDescendents) {
            return foundFromDescendents;
        }
        const foundFromSiblings = this.findSiblingNodeStartsWith(searchString, model);
        if (foundFromSiblings) {
            return foundFromSiblings;
        }
        const foundFromRootNodes = this.findRootNodeStartsWith(searchString, model);
        if (foundFromRootNodes) {
            return foundFromRootNodes;
        }
        // Now look from its own direct parent
        return this.findNodeStartsWith(searchString, model.parent);
    }
}
TreeFocusManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFocusManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TreeFocusManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFocusManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TreeFocusManagerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1mb2N1cy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL3RyZWUtdmlldy90cmVlLWZvY3VzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLHVCQUF1QjtJQURwQztRQUtVLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUN0QyxpQkFBWSxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7S0EwTTlDO0lBeE1DLElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBdUI7UUFDL0IsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsb0JBQW9CLENBQUMsTUFBYztRQUNqQyxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssTUFBTSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUF1QjtRQUNqQyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0s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T0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU8seUJBQXlCLENBQUMsWUFBb0IsRUFBRSxLQUF1QjtRQUM3RSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRixJQUFJLG9CQUFvQixFQUFFO1lBQ3hCLE9BQU8sb0JBQW9CLENBQUM7U0FDN0I7UUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFOUUsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixPQUFPLGlCQUFpQixDQUFDO1NBQzFCO1FBRUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTVFLElBQUksa0JBQWtCLEVBQUU7WUFDdEIsT0FBTyxrQkFBa0IsQ0FBQztTQUMzQjtRQUNELHNDQUFzQztRQUN0QyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7O29IQTlNVSx1QkFBdUI7d0hBQXZCLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFRyZWVOb2RlTW9kZWwgfSBmcm9tICcuL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHJlZUZvY3VzTWFuYWdlclNlcnZpY2U8VD4ge1xuICByb290Tm9kZU1vZGVsczogVHJlZU5vZGVNb2RlbDxUPltdO1xuXG4gIHByaXZhdGUgZm9jdXNlZE5vZGVJZDogc3RyaW5nO1xuICBwcml2YXRlIF9mb2N1c1JlcXVlc3QgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gIHByaXZhdGUgX2ZvY3VzQ2hhbmdlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIGdldCBmb2N1c1JlcXVlc3QoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNSZXF1ZXN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGZvY3VzQ2hhbmdlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZm9jdXNOb2RlKG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogdm9pZCB7XG4gICAgaWYgKG1vZGVsKSB7XG4gICAgICB0aGlzLl9mb2N1c1JlcXVlc3QubmV4dChtb2RlbC5ub2RlSWQpO1xuICAgIH1cbiAgfVxuXG4gIGJyb2FkY2FzdEZvY3VzZWROb2RlKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9jdXNlZE5vZGVJZCAhPT0gbm9kZUlkKSB7XG4gICAgICB0aGlzLmZvY3VzZWROb2RlSWQgPSBub2RlSWQ7XG4gICAgICB0aGlzLl9mb2N1c0NoYW5nZS5uZXh0KG5vZGVJZCk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXNQYXJlbnQobW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiB2b2lkIHtcbiAgICBpZiAobW9kZWwpIHtcbiAgICAgIHRoaXMuZm9jdXNOb2RlKG1vZGVsLnBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXNGaXJzdFZpc2libGVOb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IGZvY3VzTW9kZWwgPSB0aGlzLnJvb3ROb2RlTW9kZWxzICYmIHRoaXMucm9vdE5vZGVNb2RlbHNbMF07XG4gICAgdGhpcy5mb2N1c05vZGUoZm9jdXNNb2RlbCk7XG4gIH1cblxuICBmb2N1c0xhc3RWaXNpYmxlTm9kZSgpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzTm9kZSh0aGlzLmZpbmRMYXN0VmlzaWJsZUluVHJlZSgpKTtcbiAgfVxuXG4gIGZvY3VzTm9kZUFib3ZlKG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c05vZGUodGhpcy5maW5kTm9kZUFib3ZlKG1vZGVsKSk7XG4gIH1cblxuICBmb2N1c05vZGVCZWxvdyhtb2RlbDogVHJlZU5vZGVNb2RlbDxUPik6IHZvaWQge1xuICAgIHRoaXMuZm9jdXNOb2RlKHRoaXMuZmluZE5vZGVCZWxvdyhtb2RlbCkpO1xuICB9XG5cbiAgZm9jdXNOb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmc6IHN0cmluZywgbW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzTm9kZSh0aGlzLmZpbmRDbG9zZXN0Tm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nLCBtb2RlbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kU2libGluZ3MobW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiBUcmVlTm9kZU1vZGVsPFQ+W10ge1xuICAgIC8vIHRoZSBtZXRob2Qgd2lsbCByZXR1cm4gbm90IG9ubHkgc2libGluZyBtb2RlbHMgYnV0IGFsc28gaXRzZWxmIGFtb25nIHRoZW1cbiAgICBpZiAobW9kZWwucGFyZW50KSB7XG4gICAgICByZXR1cm4gbW9kZWwucGFyZW50LmNoaWxkcmVuO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yb290Tm9kZU1vZGVscztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZpbmRMYXN0VmlzaWJsZUluTm9kZShtb2RlbDogVHJlZU5vZGVNb2RlbDxUPik6IFRyZWVOb2RlTW9kZWw8VD4ge1xuICAgIC8vIHRoZSBtZXRob2Qgd2lsbCB0cmF2ZXJzZSB0aHJvdWdoIHVudGlsIGl0IGZpbmRzIHRoZSBsYXN0IHZpc2libGUgbm9kZSBmcm9tIHRoZSBnaXZlbiBub2RlXG4gICAgaWYgKCFtb2RlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChtb2RlbC5leHBhbmRlZCAmJiBtb2RlbC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IG1vZGVsLmNoaWxkcmVuO1xuICAgICAgY29uc3QgbGFzdENoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICByZXR1cm4gdGhpcy5maW5kTGFzdFZpc2libGVJbk5vZGUobGFzdENoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZmluZE5leHRGb2N1c2FibGUobW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiBUcmVlTm9kZU1vZGVsPFQ+IHtcbiAgICBpZiAoIW1vZGVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBzaWJsaW5ncyA9IHRoaXMuZmluZFNpYmxpbmdzKG1vZGVsKTtcbiAgICBjb25zdCBzZWxmSW5kZXggPSBzaWJsaW5ncy5pbmRleE9mKG1vZGVsKTtcblxuICAgIGlmIChzZWxmSW5kZXggPCBzaWJsaW5ncy5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4gc2libGluZ3Nbc2VsZkluZGV4ICsgMV07XG4gICAgfSBlbHNlIGlmIChzZWxmSW5kZXggPT09IHNpYmxpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmROZXh0Rm9jdXNhYmxlKG1vZGVsLnBhcmVudCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kTGFzdFZpc2libGVJblRyZWUoKTogVHJlZU5vZGVNb2RlbDxUPiB7XG4gICAgY29uc3QgbGFzdFJvb3ROb2RlID1cbiAgICAgIHRoaXMucm9vdE5vZGVNb2RlbHMgJiYgdGhpcy5yb290Tm9kZU1vZGVscy5sZW5ndGggJiYgdGhpcy5yb290Tm9kZU1vZGVsc1t0aGlzLnJvb3ROb2RlTW9kZWxzLmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmZpbmRMYXN0VmlzaWJsZUluTm9kZShsYXN0Um9vdE5vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kTm9kZUFib3ZlKG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogVHJlZU5vZGVNb2RlbDxUPiB7XG4gICAgaWYgKCFtb2RlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmRTaWJsaW5ncyhtb2RlbCk7XG4gICAgY29uc3Qgc2VsZkluZGV4ID0gc2libGluZ3MuaW5kZXhPZihtb2RlbCk7XG5cbiAgICBpZiAoc2VsZkluZGV4ID09PSAwKSB7XG4gICAgICByZXR1cm4gbW9kZWwucGFyZW50O1xuICAgIH0gZWxzZSBpZiAoc2VsZkluZGV4ID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZExhc3RWaXNpYmxlSW5Ob2RlKHNpYmxpbmdzW3NlbGZJbmRleCAtIDFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGZpbmROb2RlQmVsb3cobW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiBUcmVlTm9kZU1vZGVsPFQ+IHtcbiAgICBpZiAoIW1vZGVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuZXhwYW5kZWQgJiYgbW9kZWwuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIG1vZGVsLmNoaWxkcmVuWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kTmV4dEZvY3VzYWJsZShtb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmaW5kRGVzY2VuZGVudE5vZGVTdGFydHNXaXRoKHNlYXJjaFN0cmluZzogc3RyaW5nLCBtb2RlbDogVHJlZU5vZGVNb2RlbDxUPik6IFRyZWVOb2RlTW9kZWw8VD4ge1xuICAgIGlmIChtb2RlbC5leHBhbmRlZCAmJiBtb2RlbC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkTW9kZWwgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmZpbmROb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmcsIGNoaWxkTW9kZWwpO1xuICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIGZpbmRTaWJsaW5nTm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nOiBzdHJpbmcsIG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogVHJlZU5vZGVNb2RlbDxUPiB7XG4gICAgY29uc3Qgc2libGluZ3MgPSB0aGlzLmZpbmRTaWJsaW5ncyhtb2RlbCk7XG4gICAgY29uc3Qgc2VsZkluZGV4ID0gc2libGluZ3MuaW5kZXhPZihtb2RlbCk7XG5cbiAgICAvLyBMb29rIGZyb20gc2libGluZyBub2Rlc1xuICAgIGZvciAobGV0IGkgPSBzZWxmSW5kZXggKyAxOyBpIDwgc2libGluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNpYmxpbmdNb2RlbCA9IHNpYmxpbmdzW2ldO1xuICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmZpbmROb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmcsIHNpYmxpbmdNb2RlbCk7XG4gICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZmluZFJvb3ROb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmc6IHN0cmluZywgbW9kZWw6IFRyZWVOb2RlTW9kZWw8VD4pOiBUcmVlTm9kZU1vZGVsPFQ+IHtcbiAgICBmb3IgKGNvbnN0IHJvb3RNb2RlbCBvZiB0aGlzLnJvb3ROb2RlTW9kZWxzKSB7XG4gICAgICAvLyBEb24ndCBsb29rIGZyb20gYSBwYXJlbnQgeWV0XG4gICAgICBpZiAobW9kZWwucGFyZW50ICYmIG1vZGVsLnBhcmVudCA9PT0gcm9vdE1vZGVsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmb3VuZCA9IHRoaXMuZmluZE5vZGVTdGFydHNXaXRoKHNlYXJjaFN0cmluZywgcm9vdE1vZGVsKTtcbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kTm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nOiBzdHJpbmcsIG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogVHJlZU5vZGVNb2RlbDxUPiB7XG4gICAgaWYgKCFtb2RlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLnRleHRDb250ZW50LnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIG1vZGVsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZpbmREZXNjZW5kZW50Tm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nLCBtb2RlbCk7XG4gIH1cblxuICBwcml2YXRlIGZpbmRDbG9zZXN0Tm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nOiBzdHJpbmcsIG1vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+KTogVHJlZU5vZGVNb2RlbDxUPiB7XG4gICAgaWYgKCFtb2RlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZm91bmRGcm9tRGVzY2VuZGVudHMgPSB0aGlzLmZpbmREZXNjZW5kZW50Tm9kZVN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nLCBtb2RlbCk7XG5cbiAgICBpZiAoZm91bmRGcm9tRGVzY2VuZGVudHMpIHtcbiAgICAgIHJldHVybiBmb3VuZEZyb21EZXNjZW5kZW50cztcbiAgICB9XG5cbiAgICBjb25zdCBmb3VuZEZyb21TaWJsaW5ncyA9IHRoaXMuZmluZFNpYmxpbmdOb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmcsIG1vZGVsKTtcblxuICAgIGlmIChmb3VuZEZyb21TaWJsaW5ncykge1xuICAgICAgcmV0dXJuIGZvdW5kRnJvbVNpYmxpbmdzO1xuICAgIH1cblxuICAgIGNvbnN0IGZvdW5kRnJvbVJvb3ROb2RlcyA9IHRoaXMuZmluZFJvb3ROb2RlU3RhcnRzV2l0aChzZWFyY2hTdHJpbmcsIG1vZGVsKTtcblxuICAgIGlmIChmb3VuZEZyb21Sb290Tm9kZXMpIHtcbiAgICAgIHJldHVybiBmb3VuZEZyb21Sb290Tm9kZXM7XG4gICAgfVxuICAgIC8vIE5vdyBsb29rIGZyb20gaXRzIG93biBkaXJlY3QgcGFyZW50XG4gICAgcmV0dXJuIHRoaXMuZmluZE5vZGVTdGFydHNXaXRoKHNlYXJjaFN0cmluZywgbW9kZWwucGFyZW50KTtcbiAgfVxufVxuIl19