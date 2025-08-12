import { TreeFeaturesService } from '../tree-features.service';
import { AsyncArray } from './async-array';
import { TreeNodeModel } from './tree-node.model';
export declare class RecursiveTreeNodeModel<T> extends TreeNodeModel<T> {
    private getChildren;
    private featuresService;
    parent: RecursiveTreeNodeModel<T> | null;
    private subscription;
    private childrenFetched;
    private _children;
    constructor(model: T, parent: RecursiveTreeNodeModel<T> | null, getChildren: (node: T) => AsyncArray<T> | undefined, featuresService: TreeFeaturesService<T> | undefined);
    get children(): RecursiveTreeNodeModel<T>[];
    set children(value: RecursiveTreeNodeModel<T>[]);
    destroy(): void;
    clearChildren(): void;
    fetchChildren(): void;
    private wrapChildren;
}
