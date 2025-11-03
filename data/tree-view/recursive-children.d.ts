import { Subscription } from 'rxjs';
import { TreeNodeModel } from './models/tree-node.model';
import { ClrRecursiveForOfContext } from './recursive-for-of';
import { TreeFeaturesService } from './tree-features.service';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
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
}
