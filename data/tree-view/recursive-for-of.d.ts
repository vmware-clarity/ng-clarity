import { ChangeDetectorRef, OnChanges, OnDestroy, TemplateRef } from '@angular/core';
import { AsyncArray } from './models/async-array';
import { TreeNodeModel } from './models/tree-node.model';
import { TreeFeaturesService } from './tree-features.service';
import * as i0 from "@angular/core";
export interface ClrRecursiveForOfContext<T> {
    $implicit: T;
    clrModel: TreeNodeModel<T>;
}
export declare class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
    private template;
    private featuresService;
    private cdr;
    nodes: T | T[];
    getChildren: (node: T) => AsyncArray<T>;
    private childrenFetchSubscription;
    constructor(template: TemplateRef<ClrRecursiveForOfContext<T>>, featuresService: TreeFeaturesService<T>, cdr: ChangeDetectorRef);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRecursiveForOf<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRecursiveForOf<any>, "[clrRecursiveFor][clrRecursiveForOf]", never, { "nodes": "clrRecursiveForOf"; "getChildren": "clrRecursiveForGetChildren"; }, {}, never, never, false, never>;
}
