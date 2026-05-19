/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { TreeNodeModel } from './tree-node.model';
/*
 * A declarative model is built by traversing the Angular component tree.
 * Declarative = Tree node components dictate the model
 */
export class DeclarativeTreeNodeModel extends TreeNodeModel {
    constructor(parent) {
        super();
        this.parent = parent;
        if (parent) {
            parent._addChild(this);
        }
        this.children = [];
    }
    destroy() {
        if (this.parent) {
            this.parent._removeChild(this);
        }
        super.destroy();
    }
    _addChild(child) {
        this.children.push(child);
    }
    _removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpdmUtdHJlZS1ub2RlLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvbW9kZWxzL2RlY2xhcmF0aXZlLXRyZWUtbm9kZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVsRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sd0JBQTRCLFNBQVEsYUFBZ0I7SUFLL0QsWUFBWSxNQUEwQztRQUNwRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUSxPQUFPO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEM7UUFDRCxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFrQztRQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWtDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBUcmVlTm9kZU1vZGVsIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xuXG4vKlxuICogQSBkZWNsYXJhdGl2ZSBtb2RlbCBpcyBidWlsdCBieSB0cmF2ZXJzaW5nIHRoZSBBbmd1bGFyIGNvbXBvbmVudCB0cmVlLlxuICogRGVjbGFyYXRpdmUgPSBUcmVlIG5vZGUgY29tcG9uZW50cyBkaWN0YXRlIHRoZSBtb2RlbFxuICovXG5leHBvcnQgY2xhc3MgRGVjbGFyYXRpdmVUcmVlTm9kZU1vZGVsPFQ+IGV4dGVuZHMgVHJlZU5vZGVNb2RlbDxUPiB7XG4gIC8vIE92ZXJyaWRlIGZvciBhIG1vcmUgcHJlY2lzZSB0eXBlXG4gIHBhcmVudDogRGVjbGFyYXRpdmVUcmVlTm9kZU1vZGVsPFQ+IHwgbnVsbDtcbiAgY2hpbGRyZW46IERlY2xhcmF0aXZlVHJlZU5vZGVNb2RlbDxUPltdO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGVjbGFyYXRpdmVUcmVlTm9kZU1vZGVsPFQ+IHwgbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50Ll9hZGRDaGlsZCh0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB9XG5cbiAgb3ZlcnJpZGUgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50Ll9yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICB9XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgX2FkZENoaWxkKGNoaWxkOiBEZWNsYXJhdGl2ZVRyZWVOb2RlTW9kZWw8VD4pIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICB9XG5cbiAgX3JlbW92ZUNoaWxkKGNoaWxkOiBEZWNsYXJhdGl2ZVRyZWVOb2RlTW9kZWw8VD4pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==