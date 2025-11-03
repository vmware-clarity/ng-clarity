import { Optional, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';
export declare class TreeFeaturesService<T> {
    selectable: boolean;
    eager: boolean;
    recursion: {
        template: TemplateRef<ClrRecursiveForOfContext<T>>;
        root: RecursiveTreeNodeModel<T>[];
    };
    childrenFetched: Subject<void>;
}
export declare function treeFeaturesFactory<T>(existing: TreeFeaturesService<T>): TreeFeaturesService<T>;
export declare const TREE_FEATURES_PROVIDER: {
    provide: typeof TreeFeaturesService;
    useFactory: typeof treeFeaturesFactory;
    deps: Optional[][];
};
