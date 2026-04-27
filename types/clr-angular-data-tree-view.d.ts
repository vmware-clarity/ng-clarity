import * as i0 from '@angular/core';
import { OnChanges, OnDestroy, TemplateRef, ChangeDetectorRef, AfterContentInit, Renderer2, ElementRef, NgZone, OnInit, AfterViewInit, EventEmitter, Injector, Type } from '@angular/core';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import * as i8 from '@clr/angular/utils';
import { IfExpandService, ClrCommonStringsService } from '@clr/angular/utils';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';

declare enum ClrSelectedState {
    UNSELECTED = 0,
    SELECTED = 1,
    INDETERMINATE = 2
}

type AsyncArray<T> = T[] | null | undefined | Promise<T[] | null | undefined> | Observable<T[] | null | undefined>;

declare abstract class TreeNodeModel<T> {
    nodeId: string;
    expanded: boolean;
    model: T | null;
    textContent: string;
    loading$: BehaviorSubject<boolean>;
    selected: BehaviorSubject<ClrSelectedState>;
    private _loading;
    private _disabled;
    abstract parent: TreeNodeModel<T> | null;
    abstract children: TreeNodeModel<T>[];
    get loading(): boolean;
    set loading(isLoading: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    destroy(): void;
    setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean): void;
    toggleSelection(propagate: boolean): void;
    _updateSelectionFromChildren(): void;
    private computeSelectionStateFromChildren;
}

declare class RecursiveTreeNodeModel<T> extends TreeNodeModel<T> {
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

interface ClrRecursiveForOfContext<T> {
    $implicit: T;
    clrModel: TreeNodeModel<T>;
}
declare class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
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
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRecursiveForOf<any>, "[clrRecursiveFor][clrRecursiveForOf]", never, { "nodes": { "alias": "clrRecursiveForOf"; "required": false; }; "getChildren": { "alias": "clrRecursiveForGetChildren"; "required": false; }; }, {}, never, never, false, never>;
}

declare class TreeFeaturesService<T> {
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

declare class TreeFocusManagerService<T> {
    rootNodeModels: TreeNodeModel<T>[];
    private focusedNodeId;
    private _focusRequest;
    private _focusChange;
    get focusRequest(): Observable<string>;
    get focusChange(): Observable<string>;
    focusNode(model: TreeNodeModel<T>): void;
    broadcastFocusedNode(nodeId: string): void;
    focusParent(model: TreeNodeModel<T>): void;
    focusFirstVisibleNode(): void;
    focusLastVisibleNode(): void;
    focusNodeAbove(model: TreeNodeModel<T>): void;
    focusNodeBelow(model: TreeNodeModel<T>): void;
    focusNodeStartsWith(searchString: string, model: TreeNodeModel<T>): void;
    private findSiblings;
    private findLastVisibleInNode;
    private findNextFocusable;
    private findLastVisibleInTree;
    private findNodeAbove;
    private findNodeBelow;
    private findDescendentNodeStartsWith;
    private findSiblingNodeStartsWith;
    private findRootNodeStartsWith;
    private findNodeStartsWith;
    private findClosestNodeStartsWith;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFocusManagerService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFocusManagerService<any>>;
}

declare class ClrTree<T> implements AfterContentInit, OnDestroy {
    featuresService: TreeFeaturesService<T>;
    private focusManagerService;
    private renderer;
    private el;
    private rootNodes;
    private subscriptions;
    private _isMultiSelectable;
    constructor(featuresService: TreeFeaturesService<T>, focusManagerService: TreeFocusManagerService<T>, renderer: Renderer2, el: ElementRef<HTMLElement>, ngZone: NgZone);
    set lazy(value: boolean);
    get isMultiSelectable(): boolean;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private setMultiSelectable;
    private setRootNodes;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTree<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTree<any>, "clr-tree", never, { "lazy": { "alias": "clrLazy"; "required": false; }; }, {}, ["rootNodes"], ["*"], false, never>;
}

declare class ClrTreeNodeLink {
    private el;
    constructor(el: ElementRef<HTMLElement>);
    get active(): boolean;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNodeLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTreeNodeLink, ".clr-treenode-link", never, {}, {}, never, never, false, never>;
}

declare class ClrTreeNode<T> implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    private platformId;
    featuresService: TreeFeaturesService<T>;
    expandService: IfExpandService;
    commonStrings: ClrCommonStringsService;
    private focusManager;
    private elementRef;
    expandable: boolean | undefined;
    selectedChange: EventEmitter<ClrSelectedState>;
    expandedChange: EventEmitter<boolean>;
    STATES: typeof ClrSelectedState;
    isModelLoading: boolean;
    nodeId: string;
    contentContainerTabindex: number;
    _model: TreeNodeModel<T>;
    private skipEmitChange;
    private typeAheadKeyBuffer;
    private typeAheadKeyEvent;
    private subscriptions;
    private contentContainer;
    private treeNodeLinkList;
    constructor(platformId: any, parent: ClrTreeNode<T>, featuresService: TreeFeaturesService<T>, expandService: IfExpandService, commonStrings: ClrCommonStringsService, focusManager: TreeFocusManagerService<T>, elementRef: ElementRef<HTMLElement>, injector: Injector);
    get disabled(): boolean;
    set disabled(value: boolean);
    get selected(): ClrSelectedState | boolean;
    set selected(value: ClrSelectedState | boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    set clrForTypeAhead(value: string);
    get ariaSelected(): boolean;
    get treeNodeLink(): ClrTreeNodeLink;
    private get isParent();
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    isExpandable(): boolean;
    isSelectable(): boolean;
    focusTreeNode(): void;
    broadcastFocusOnContainer(): void;
    onKeyDown(event: KeyboardEvent): void;
    private setTabIndex;
    private checkTabIndex;
    private toggleExpandOrTriggerDefault;
    private expandOrFocusFirstChild;
    private collapseOrFocusParent;
    private triggerDefaultAction;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNode<any>, [null, { optional: true; skipSelf: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTreeNode<any>, "clr-tree-node", never, { "expandable": { "alias": "clrExpandable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; "selected": { "alias": "clrSelected"; "required": false; }; "expanded": { "alias": "clrExpanded"; "required": false; }; "clrForTypeAhead": { "alias": "clrForTypeAhead"; "required": false; }; }, { "selectedChange": "clrSelectedChange"; "expandedChange": "clrExpandedChange"; }, ["treeNodeLinkList"], ["*", "clr-tree-node", "[clrIfExpanded]"], false, never>;
}

declare class RecursiveChildren<T> {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<RecursiveChildren<any>, "clr-recursive-children", never, { "parent": { "alias": "parent"; "required": false; }; "children": { "alias": "children"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_TREE_VIEW_DIRECTIVES: Type<any>[];
declare class ClrTreeViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTreeViewModule, [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink, typeof RecursiveChildren], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrLoadingModule], [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTreeViewModule>;
}

declare class DeclarativeTreeNodeModel<T> extends TreeNodeModel<T> {
    parent: DeclarativeTreeNodeModel<T> | null;
    children: DeclarativeTreeNodeModel<T>[];
    constructor(parent: DeclarativeTreeNodeModel<T> | null);
    destroy(): void;
    _addChild(child: DeclarativeTreeNodeModel<T>): void;
    _removeChild(child: DeclarativeTreeNodeModel<T>): void;
}

export { CLR_TREE_VIEW_DIRECTIVES, ClrRecursiveForOf, ClrSelectedState, ClrTree, ClrTreeNode, ClrTreeNodeLink, ClrTreeViewModule, DeclarativeTreeNodeModel, RecursiveTreeNodeModel, TreeNodeModel };
export type { ClrRecursiveForOfContext };
