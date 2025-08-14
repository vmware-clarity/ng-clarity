/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isObservable } from 'rxjs';
import { isPromise } from './async-array';
import { TreeNodeModel } from './tree-node.model';
/*
 * A recursive model is built received from the app and traversed to create the corresponding components.
 * Recursive = Model dictates the tree node components
 */
export class RecursiveTreeNodeModel extends TreeNodeModel {
    constructor(model, parent, getChildren, featuresService) {
        super();
        this.getChildren = getChildren;
        this.featuresService = featuresService;
        this.childrenFetched = false;
        this._children = [];
        this.model = model;
        this.parent = parent;
    }
    get children() {
        this.fetchChildren();
        return this._children;
    }
    set children(value) {
        this._children = value;
    }
    destroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        super.destroy();
    }
    clearChildren() {
        this._children.forEach(child => child.destroy());
        delete this._children;
        this.childrenFetched = false;
    }
    fetchChildren() {
        if (this.childrenFetched) {
            return;
        }
        const asyncChildren = this.getChildren(this.model);
        if (isPromise(asyncChildren)) {
            this.loading = true;
            asyncChildren.then(raw => {
                this._children = this.wrapChildren(raw);
                this.loading = false;
            });
        }
        else if (isObservable(asyncChildren)) {
            this.loading = true;
            this.subscription = asyncChildren.subscribe(raw => {
                this._children = this.wrapChildren(raw);
                this.loading = false;
            });
        }
        else if (asyncChildren) {
            // Synchronous case
            this._children = this.wrapChildren(asyncChildren);
        }
        else {
            this._children = [];
        }
        this.childrenFetched = true;
        if (this.featuresService) {
            this.featuresService.childrenFetched.next();
        }
    }
    wrapChildren(rawModels) {
        return rawModels.map(m => new RecursiveTreeNodeModel(m, this, this.getChildren, this.featuresService));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdXJzaXZlLXRyZWUtbm9kZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvdHJlZS12aWV3L21vZGVscy9yZWN1cnNpdmUtdHJlZS1ub2RlLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFHbEQsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLHNCQUEwQixTQUFRLGFBQWdCO0lBTzdELFlBQ0UsS0FBUSxFQUNSLE1BQXdDLEVBQ2hDLFdBQW1ELEVBQ25ELGVBQW1EO1FBRTNELEtBQUssRUFBRSxDQUFDO1FBSEEsZ0JBQVcsR0FBWCxXQUFXLENBQXdDO1FBQ25ELG9CQUFlLEdBQWYsZUFBZSxDQUFvQztRQVByRCxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixjQUFTLEdBQWdDLEVBQUUsQ0FBQztRQVNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBa0M7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVRLE9BQU87UUFDZCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQztRQUNELEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLE9BQU87U0FDUjtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNLElBQUksWUFBWSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU0sSUFBSSxhQUFhLEVBQUU7WUFDeEIsbUJBQW1CO1lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBRU8sWUFBWSxDQUFDLFNBQWM7UUFDakMsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDekcsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBpc09ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBUcmVlRmVhdHVyZXNTZXJ2aWNlIH0gZnJvbSAnLi4vdHJlZS1mZWF0dXJlcy5zZXJ2aWNlJztcbmltcG9ydCB7IEFzeW5jQXJyYXksIGlzUHJvbWlzZSB9IGZyb20gJy4vYXN5bmMtYXJyYXknO1xuaW1wb3J0IHsgVHJlZU5vZGVNb2RlbCB9IGZyb20gJy4vdHJlZS1ub2RlLm1vZGVsJztcblxuLypcbiAqIEEgcmVjdXJzaXZlIG1vZGVsIGlzIGJ1aWx0IHJlY2VpdmVkIGZyb20gdGhlIGFwcCBhbmQgdHJhdmVyc2VkIHRvIGNyZWF0ZSB0aGUgY29ycmVzcG9uZGluZyBjb21wb25lbnRzLlxuICogUmVjdXJzaXZlID0gTW9kZWwgZGljdGF0ZXMgdGhlIHRyZWUgbm9kZSBjb21wb25lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWN1cnNpdmVUcmVlTm9kZU1vZGVsPFQ+IGV4dGVuZHMgVHJlZU5vZGVNb2RlbDxUPiB7XG4gIHBhcmVudDogUmVjdXJzaXZlVHJlZU5vZGVNb2RlbDxUPiB8IG51bGw7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBjaGlsZHJlbkZldGNoZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2hpbGRyZW46IFJlY3Vyc2l2ZVRyZWVOb2RlTW9kZWw8VD5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG1vZGVsOiBULFxuICAgIHBhcmVudDogUmVjdXJzaXZlVHJlZU5vZGVNb2RlbDxUPiB8IG51bGwsXG4gICAgcHJpdmF0ZSBnZXRDaGlsZHJlbjogKG5vZGU6IFQpID0+IEFzeW5jQXJyYXk8VD4gfCB1bmRlZmluZWQsXG4gICAgcHJpdmF0ZSBmZWF0dXJlc1NlcnZpY2U6IFRyZWVGZWF0dXJlc1NlcnZpY2U8VD4gfCB1bmRlZmluZWRcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICBnZXQgY2hpbGRyZW4oKTogUmVjdXJzaXZlVHJlZU5vZGVNb2RlbDxUPltdIHtcbiAgICB0aGlzLmZldGNoQ2hpbGRyZW4oKTtcbiAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gIH1cbiAgc2V0IGNoaWxkcmVuKHZhbHVlOiBSZWN1cnNpdmVUcmVlTm9kZU1vZGVsPFQ+W10pIHtcbiAgICB0aGlzLl9jaGlsZHJlbiA9IHZhbHVlO1xuICB9XG5cbiAgb3ZlcnJpZGUgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNsZWFyQ2hpbGRyZW4oKSB7XG4gICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC5kZXN0cm95KCkpO1xuICAgIGRlbGV0ZSB0aGlzLl9jaGlsZHJlbjtcbiAgICB0aGlzLmNoaWxkcmVuRmV0Y2hlZCA9IGZhbHNlO1xuICB9XG5cbiAgZmV0Y2hDaGlsZHJlbigpIHtcbiAgICBpZiAodGhpcy5jaGlsZHJlbkZldGNoZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhc3luY0NoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbih0aGlzLm1vZGVsKTtcbiAgICBpZiAoaXNQcm9taXNlKGFzeW5jQ2hpbGRyZW4pKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgYXN5bmNDaGlsZHJlbi50aGVuKHJhdyA9PiB7XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy53cmFwQ2hpbGRyZW4ocmF3KTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JzZXJ2YWJsZShhc3luY0NoaWxkcmVuKSkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gYXN5bmNDaGlsZHJlbi5zdWJzY3JpYmUocmF3ID0+IHtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB0aGlzLndyYXBDaGlsZHJlbihyYXcpO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoYXN5bmNDaGlsZHJlbikge1xuICAgICAgLy8gU3luY2hyb25vdXMgY2FzZVxuICAgICAgdGhpcy5fY2hpbGRyZW4gPSB0aGlzLndyYXBDaGlsZHJlbihhc3luY0NoaWxkcmVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5jaGlsZHJlbkZldGNoZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmZlYXR1cmVzU2VydmljZSkge1xuICAgICAgdGhpcy5mZWF0dXJlc1NlcnZpY2UuY2hpbGRyZW5GZXRjaGVkLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHdyYXBDaGlsZHJlbihyYXdNb2RlbHM6IFRbXSkge1xuICAgIHJldHVybiByYXdNb2RlbHMubWFwKG0gPT4gbmV3IFJlY3Vyc2l2ZVRyZWVOb2RlTW9kZWwobSwgdGhpcywgdGhpcy5nZXRDaGlsZHJlbiwgdGhpcy5mZWF0dXJlc1NlcnZpY2UpKTtcbiAgfVxufVxuIl19