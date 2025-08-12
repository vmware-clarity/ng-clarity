import { Subscription } from 'rxjs';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { TreeNodeModel } from './models/tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';
import { TreeFeaturesService } from './tree-features.service';
import * as i0 from "@angular/core";
export declare class RecursiveChildren<T> {
    featuresService: TreeFeaturesService<T>;
    private expandService;
    parent: TreeNodeModel<T>;
    children: TreeNodeModel<T>[];
    subscription: Subscription;
    role: string;
    constructor(featuresService: TreeFeaturesService<T>, expandService: IfExpandService);
    ngAfterContentInit(): void;
    shouldRender(): boolean;
    getContext(node: TreeNodeModel<T>): ClrRecursiveForOfContext<T>;
    ngOnDestroy(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecursiveChildren<any>, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecursiveChildren<any>, "clr-recursive-children", never, { "parent": "parent"; "children": "children"; }, {}, never, never, false, never>;
}
