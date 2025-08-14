import { Optional, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { RecursiveTreeNodeModel } from './models/recursive-tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';
import * as i0 from "@angular/core";
export declare class TreeFeaturesService<T> {
    selectable: boolean;
    eager: boolean;
    recursion: {
        template: TemplateRef<ClrRecursiveForOfContext<T>>;
        root: RecursiveTreeNodeModel<T>[];
    };
    childrenFetched: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFeaturesService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFeaturesService<any>>;
}
export declare function treeFeaturesFactory<T>(existing: TreeFeaturesService<T>): TreeFeaturesService<T>;
export declare const TREE_FEATURES_PROVIDER: {
    provide: typeof TreeFeaturesService;
    useFactory: typeof treeFeaturesFactory;
    deps: Optional[][];
};
