import * as i0 from '@angular/core';
import { Injectable, Optional, SkipSelf, Directive, Input, Component, EventEmitter, PLATFORM_ID, ElementRef, ContentChildren, ViewChild, Output, Inject, NgModule } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent, isObservable } from 'rxjs';
import { trigger, transition, style, animate, state } from '@angular/animations';
import * as i3 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i2 from '@clr/angular/utils';
import { uniqueIdFactory, preventArrowKeyScroll, normalizeKey, isKeyEitherLetterOrNumber, Keys, IfExpandService, LoadingListener, ClrLoadingModule } from '@clr/angular/utils';
import { filter, debounceTime } from 'rxjs/operators';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// TODO: I'd like this to be a CheckedState enum for the checkboxes in the future.
var ClrSelectedState;
(function (ClrSelectedState) {
    // WARNING! Unselected has the value 0,
    // so it's actually the only one that will evaluate to false if cast to a boolean.
    // Don't mess with the order!
    ClrSelectedState[ClrSelectedState["UNSELECTED"] = 0] = "UNSELECTED";
    ClrSelectedState[ClrSelectedState["SELECTED"] = 1] = "SELECTED";
    ClrSelectedState[ClrSelectedState["INDETERMINATE"] = 2] = "INDETERMINATE";
})(ClrSelectedState || (ClrSelectedState = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TreeFeaturesService {
    constructor() {
        this.selectable = false;
        this.eager = true;
        this.childrenFetched = new Subject();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFeaturesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFeaturesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFeaturesService, decorators: [{
            type: Injectable
        }] });
function treeFeaturesFactory(existing) {
    return existing || new TreeFeaturesService();
}
const TREE_FEATURES_PROVIDER = {
    provide: TreeFeaturesService,
    useFactory: treeFeaturesFactory,
    /*
     * The Optional + SkipSelf pattern ensures that in case of nested components, only the root one will
     * instantiate a new service and all its children will reuse the root's instance.
     * If there are several roots (in this case, several independent trees on a page), each root will instantiate
     * its own service so they won't interfere with one another.
     *
     * TL;DR - Optional + SkipSelf = 1 instance of TreeFeaturesService per tree.
     */
    deps: [[new Optional(), new SkipSelf(), TreeFeaturesService]],
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TreeFocusManagerService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFocusManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFocusManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TreeFocusManagerService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TreeNodeModel {
    constructor() {
        this.loading$ = new BehaviorSubject(false);
        this.selected = new BehaviorSubject(ClrSelectedState.UNSELECTED);
        /*
         * Being able to push this down to the RecursiveTreeNodeModel would require too much work on the angular components
         * right now for them to know which kind of model they are using. So I'm lifting the public properties to this
         * abstract parent class for now and we can revisit it later, when we're not facing such a close deadline.
         */
        this._loading = false;
    }
    get loading() {
        return this._loading;
    }
    set loading(isLoading) {
        this._loading = isLoading;
        this.loading$.next(isLoading);
    }
    get disabled() {
        // when both parameters are undefined, double negative is needed to cast to false, otherwise will return undefined.
        return !!(this._disabled || this.parent?.disabled);
    }
    set disabled(value) {
        this._disabled = value;
    }
    destroy() {
        // Just to be safe
        this.selected.complete();
    }
    // Propagate by default when eager, don't propagate in the lazy-loaded tree.
    setSelected(state, propagateUp, propagateDown) {
        if (state === this.selected.value) {
            return;
        }
        this.selected.next(state);
        if (propagateDown && state !== ClrSelectedState.INDETERMINATE && this.children) {
            this.children.forEach(child => {
                if (!child.disabled) {
                    child.setSelected(state, false, true);
                }
            });
        }
        if (propagateUp && this.parent) {
            this.parent._updateSelectionFromChildren();
        }
    }
    toggleSelection(propagate) {
        if (this.disabled) {
            return;
        }
        // Both unselected and indeterminate toggle to selected
        const newState = this.selected.value === ClrSelectedState.SELECTED ? ClrSelectedState.UNSELECTED : ClrSelectedState.SELECTED;
        // NOTE: we always propagate selection up in this method because it is only called when the user takes an action.
        // It should never be called from lifecycle hooks or app-provided inputs.
        this.setSelected(newState, true, propagate);
    }
    /*
     * Internal, but needs to be called by other nodes
     */
    _updateSelectionFromChildren() {
        const newState = this.computeSelectionStateFromChildren();
        if (newState === this.selected.value) {
            return;
        }
        this.selected.next(newState);
        if (this.parent) {
            this.parent._updateSelectionFromChildren();
        }
    }
    computeSelectionStateFromChildren() {
        let oneSelected = false;
        let oneUnselected = false;
        // Using a good old for loop to exit as soon as we can tell, for better performance on large trees.
        for (const child of this.children) {
            switch (child.selected.value) {
                case ClrSelectedState.INDETERMINATE:
                    if (child.disabled) {
                        continue;
                    }
                    return ClrSelectedState.INDETERMINATE;
                case ClrSelectedState.SELECTED:
                    oneSelected = true;
                    if (oneUnselected) {
                        return ClrSelectedState.INDETERMINATE;
                    }
                    break;
                case ClrSelectedState.UNSELECTED:
                default:
                    // Default is the same as unselected, in case an undefined somehow made it all the way here.
                    oneUnselected = true;
                    if (oneSelected) {
                        return ClrSelectedState.INDETERMINATE;
                    }
                    break;
            }
        }
        if (!oneSelected) {
            return ClrSelectedState.UNSELECTED;
        }
        else if (!oneUnselected) {
            return ClrSelectedState.SELECTED;
        }
        else {
            return ClrSelectedState.UNSELECTED;
        }
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * A declarative model is built by traversing the Angular component tree.
 * Declarative = Tree node components dictate the model
 */
class DeclarativeTreeNodeModel extends TreeNodeModel {
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTreeNodeLink {
    constructor(el) {
        this.el = el;
    }
    get active() {
        return this.el.nativeElement.classList.contains('active');
    }
    activate() {
        if (this.el.nativeElement && this.el.nativeElement.click) {
            this.el.nativeElement.click();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeNodeLink, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrTreeNodeLink, isStandalone: false, selector: ".clr-treenode-link", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeNodeLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '.clr-treenode-link',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Internal component, do not export!
 * This is part of the hack to get around https://github.com/angular/angular/issues/15998
 */
class RecursiveChildren {
    constructor(featuresService, expandService) {
        this.featuresService = featuresService;
        this.expandService = expandService;
        if (expandService) {
            this.subscription = expandService.expandChange.subscribe(value => {
                if (!value && this.parent && !featuresService.eager && featuresService.recursion) {
                    // In the case of lazy-loading recursive trees, we clear the children on collapse.
                    // This is better in case they change between two user interaction, and that way
                    // the app itself can decide whether to cache them or not.
                    this.parent.clearChildren();
                }
            });
        }
    }
    ngAfterContentInit() {
        this.setAriaRoles();
    }
    shouldRender() {
        return (this.featuresService.recursion &&
            // In the smart case, we eagerly render all the recursive children
            // to make sure two-way bindings for selection are available.
            // They will be hidden with CSS by the parent.
            (this.featuresService.eager || !this.expandService || this.expandService.expanded));
    }
    getContext(node) {
        return {
            $implicit: node.model,
            clrModel: node,
        };
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    setAriaRoles() {
        this.role = this.parent ? 'group' : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RecursiveChildren, deps: [{ token: TreeFeaturesService }, { token: i2.IfExpandService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: RecursiveChildren, isStandalone: false, selector: "clr-recursive-children", inputs: { parent: "parent", children: "children" }, host: { properties: { "attr.role": "role" } }, ngImport: i0, template: `
    @if (shouldRender()) {
      @for (child of parent?.children || children; track child) {
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      }
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RecursiveChildren, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-recursive-children',
                    template: `
    @if (shouldRender()) {
      @for (child of parent?.children || children; track child) {
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      }
    }
  `,
                    host: {
                        '[attr.role]': 'role', // Safari + VO needs direct relationship between treeitem and group; no element should exist between them
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: TreeFeaturesService }, { type: i2.IfExpandService, decorators: [{
                    type: Optional
                }] }], propDecorators: { parent: [{
                type: Input,
                args: ['parent']
            }], children: [{
                type: Input,
                args: ['children']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const LVIEW_CONTEXT_INDEX = 8;
// If the user types multiple keys without allowing 200ms to pass between them,
// then those keys are sent together in one request.
const TREE_TYPE_AHEAD_TIMEOUT = 200;
class ClrTreeNode {
    constructor(platformId, parent, featuresService, expandService, commonStrings, focusManager, elementRef, injector) {
        this.platformId = platformId;
        this.featuresService = featuresService;
        this.expandService = expandService;
        this.commonStrings = commonStrings;
        this.focusManager = focusManager;
        this.elementRef = elementRef;
        this.selectedChange = new EventEmitter(false);
        this.expandedChange = new EventEmitter();
        this.STATES = ClrSelectedState;
        this.isModelLoading = false;
        this.nodeId = uniqueIdFactory();
        this.contentContainerTabindex = -1;
        this.skipEmitChange = false;
        this.typeAheadKeyBuffer = '';
        this.typeAheadKeyEvent = new Subject();
        this.subscriptions = [];
        if (featuresService.recursion) {
            // I'm completely stuck, we have to hack into private properties until either
            // https://github.com/angular/angular/issues/14935 or https://github.com/angular/angular/issues/15998
            // are fixed
            // This is for non-ivy implementations
            if (injector.view) {
                this._model = injector.view.context.clrModel;
            }
            else {
                // Ivy puts this on a specific index of a _lView property
                this._model = injector._lView[LVIEW_CONTEXT_INDEX].clrModel;
            }
        }
        else {
            // Force cast for now, not sure how to tie the correct type here to featuresService.recursion
            this._model = new DeclarativeTreeNodeModel(parent ? parent._model : null);
        }
        this._model.nodeId = this.nodeId;
    }
    get disabled() {
        return this._model.disabled;
    }
    set disabled(value) {
        this._model.disabled = value;
    }
    get selected() {
        return this._model.selected.value;
    }
    set selected(value) {
        this.featuresService.selectable = true;
        // Gracefully handle falsy states like null or undefined because it's just easier than answering questions.
        // This shouldn't happen with strict typing on the app's side, but it's not up to us.
        if (value === null || typeof value === 'undefined') {
            value = ClrSelectedState.UNSELECTED;
        }
        // We match booleans to the corresponding ClrSelectedState
        if (typeof value === 'boolean') {
            value = value ? ClrSelectedState.SELECTED : ClrSelectedState.UNSELECTED;
        }
        // We propagate only if the tree is in smart mode, and skip emitting the output when we set the input
        // See https://github.com/vmware/clarity/issues/3073
        this.skipEmitChange = true;
        this._model.setSelected(value, this.featuresService.eager, this.featuresService.eager);
        this.skipEmitChange = false;
    }
    // I'm caving on this, for tree nodes I think we can tolerate having a two-way binding on the component
    // rather than enforce the clrIfExpanded structural directive for dynamic cases. Mostly because for the smart
    // case, you can't use a structural directive, it would need to go on an ng-container.
    get expanded() {
        return this.expandService.expanded;
    }
    set expanded(value) {
        this.expandService.expanded = value;
    }
    set clrForTypeAhead(value) {
        this._model.textContent = trimAndLowerCase(value || this.elementRef.nativeElement.textContent);
    }
    get ariaSelected() {
        if (this.isSelectable()) {
            return this._model.selected.value === ClrSelectedState.SELECTED;
        }
        else if (this.treeNodeLink?.active) {
            return true;
        }
        else {
            return null;
        }
    }
    get treeNodeLink() {
        return this.treeNodeLinkList && this.treeNodeLinkList.first;
    }
    get isParent() {
        return this._model.children && this._model.children.length > 0;
    }
    ngOnInit() {
        this._model.expanded = this.expanded;
        this._model.disabled = this.disabled;
        this.subscriptions.push(this._model.selected.pipe(filter(() => !this.skipEmitChange)).subscribe(value => {
            this.selectedChange.emit(value);
        }));
        this.subscriptions.push(this.expandService.expandChange.subscribe(value => {
            this.expandedChange.emit(value);
            this._model.expanded = value;
        }));
        this.subscriptions.push(this.focusManager.focusRequest.subscribe(nodeId => {
            if (this.nodeId === nodeId) {
                this.focusTreeNode();
            }
        }), this.focusManager.focusChange.subscribe(nodeId => {
            this.checkTabIndex(nodeId);
        }));
        this.subscriptions.push(this._model.loading$.pipe(debounceTime(0)).subscribe(isLoading => (this.isModelLoading = isLoading)));
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.typeAheadKeyEvent.pipe(debounceTime(TREE_TYPE_AHEAD_TIMEOUT)).subscribe((bufferedKeys) => {
            this.focusManager.focusNodeStartsWith(bufferedKeys, this._model);
            // reset once bufferedKeys are used
            this.typeAheadKeyBuffer = '';
        }));
    }
    ngAfterViewInit() {
        if (!this._model.textContent) {
            this._model.textContent = trimAndLowerCase(this.elementRef.nativeElement.textContent);
        }
    }
    ngOnDestroy() {
        this._model.destroy();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    isExpandable() {
        if (typeof this.expandable !== 'undefined') {
            return this.expandable;
        }
        return !!this.expandService.expandable || this.isParent;
    }
    isSelectable() {
        return this.featuresService.selectable;
    }
    focusTreeNode() {
        const containerEl = this.contentContainer.nativeElement;
        if (isPlatformBrowser(this.platformId) && document.activeElement !== containerEl) {
            this.setTabIndex(0);
            containerEl.focus();
            containerEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }
    broadcastFocusOnContainer() {
        this.focusManager.broadcastFocusedNode(this.nodeId);
    }
    onKeyDown(event) {
        // Two reasons to prevent default behavior:
        // 1. to prevent scrolling on arrow keys
        // 2. Assistive Technology focus differs from Keyboard focus behavior.
        //    By default, pressing arrow key makes AT focus go into the nested content of the item.
        preventArrowKeyScroll(event);
        // https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-22
        switch (normalizeKey(event.key)) {
            case Keys.ArrowUp:
                this.focusManager.focusNodeAbove(this._model);
                break;
            case Keys.ArrowDown:
                this.focusManager.focusNodeBelow(this._model);
                break;
            case Keys.ArrowRight:
                this.expandOrFocusFirstChild();
                break;
            case Keys.ArrowLeft:
                this.collapseOrFocusParent();
                break;
            case Keys.Home:
                event.preventDefault();
                this.focusManager.focusFirstVisibleNode();
                break;
            case Keys.End:
                event.preventDefault();
                this.focusManager.focusLastVisibleNode();
                break;
            case Keys.Enter:
                this.toggleExpandOrTriggerDefault();
                break;
            case Keys.Space:
            case Keys.Spacebar:
                // to prevent scrolling on space key in this specific case
                event.preventDefault();
                this.toggleExpandOrTriggerDefault();
                break;
            default:
                if (this._model.textContent && isKeyEitherLetterOrNumber(event)) {
                    this.typeAheadKeyBuffer += event.key;
                    this.typeAheadKeyEvent.next(this.typeAheadKeyBuffer);
                    return;
                }
                break;
        }
        // if non-letter keys are pressed, do reset.
        this.typeAheadKeyBuffer = '';
    }
    setTabIndex(value) {
        this.contentContainerTabindex = value;
        this.contentContainer.nativeElement.setAttribute('tabindex', value.toString());
    }
    checkTabIndex(nodeId) {
        if (isPlatformBrowser(this.platformId) && this.nodeId !== nodeId && this.contentContainerTabindex !== -1) {
            this.setTabIndex(-1);
        }
    }
    toggleExpandOrTriggerDefault() {
        if (this.disabled) {
            return;
        }
        if (this.isExpandable() && !this.isSelectable()) {
            this.expandService.expanded = !this.expanded;
        }
        else {
            this.triggerDefaultAction();
        }
    }
    expandOrFocusFirstChild() {
        if (this.disabled) {
            return;
        }
        if (this.expanded) {
            // if the node is already expanded and has children, focus its very first child
            if (this.isParent) {
                this.focusManager.focusNodeBelow(this._model);
            }
        }
        else {
            // we must check if the node is expandable, in order to set .expanded to true from false
            // because we shouldn't set .expanded to true if it's not expandable node
            if (this.isExpandable()) {
                this.expandService.expanded = true;
            }
        }
    }
    collapseOrFocusParent() {
        if (this.disabled) {
            return;
        }
        if (this.expanded) {
            this.expandService.expanded = false;
        }
        else {
            this.focusManager.focusParent(this._model);
        }
    }
    triggerDefaultAction() {
        if (this.treeNodeLink) {
            this.treeNodeLink.activate();
        }
        else {
            if (this.isSelectable()) {
                this._model.toggleSelection(this.featuresService.eager);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeNode, deps: [{ token: PLATFORM_ID }, { token: ClrTreeNode, optional: true, skipSelf: true }, { token: TreeFeaturesService }, { token: i2.IfExpandService }, { token: i2.ClrCommonStringsService }, { token: TreeFocusManagerService }, { token: i0.ElementRef }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrTreeNode, isStandalone: false, selector: "clr-tree-node", inputs: { expandable: ["clrExpandable", "expandable"], disabled: ["clrDisabled", "disabled"], selected: ["clrSelected", "selected"], expanded: ["clrExpanded", "expanded"], clrForTypeAhead: "clrForTypeAhead" }, outputs: { selectedChange: "clrSelectedChange", expandedChange: "clrExpandedChange" }, host: { properties: { "class.clr-tree-node": "true", "class.disabled": "this._model.disabled" } }, providers: [TREE_FEATURES_PROVIDER, IfExpandService, { provide: LoadingListener, useExisting: IfExpandService }], queries: [{ propertyName: "treeNodeLinkList", predicate: ClrTreeNodeLink }], viewQueries: [{ propertyName: "contentContainer", first: true, predicate: ["contentContainer"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  @if (isExpandable() && !isModelLoading && !expandService.loading) {\n  <button\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  } @if (expandService.loading || isModelLoading) {\n  <div class=\"clr-treenode-spinner-container\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  } @if (featuresService.selectable) {\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  } @if (!featuresService.selectable) {\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n  }\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    @if (featuresService.selectable || ariaSelected) {\n    <div class=\"clr-sr-only\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n    }\n  </ng-template>\n</div>\n<div\n  class=\"clr-treenode-children\"\n  [@toggleChildrenAnim]=\"expandService.expanded ? 'expanded' : 'collapsed'\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n", dependencies: [{ kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: RecursiveChildren, selector: "clr-recursive-children", inputs: ["parent", "children"] }], animations: [
            trigger('toggleChildrenAnim', [
                transition('collapsed => expanded', [style({ height: 0 }), animate(200, style({ height: '*' }))]),
                transition('expanded => collapsed', [style({ height: '*' }), animate(200, style({ height: 0 }))]),
                state('expanded', style({ height: '*', 'overflow-y': 'visible' })),
                state('collapsed', style({ height: 0 })),
            ]),
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeNode, decorators: [{
            type: Component,
            args: [{ selector: 'clr-tree-node', providers: [TREE_FEATURES_PROVIDER, IfExpandService, { provide: LoadingListener, useExisting: IfExpandService }], animations: [
                        trigger('toggleChildrenAnim', [
                            transition('collapsed => expanded', [style({ height: 0 }), animate(200, style({ height: '*' }))]),
                            transition('expanded => collapsed', [style({ height: '*' }), animate(200, style({ height: 0 }))]),
                            state('expanded', style({ height: '*', 'overflow-y': 'visible' })),
                            state('collapsed', style({ height: 0 })),
                        ]),
                    ], host: {
                        '[class.clr-tree-node]': 'true',
                        '[class.disabled]': 'this._model.disabled',
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  @if (isExpandable() && !isModelLoading && !expandService.loading) {\n  <button\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  } @if (expandService.loading || isModelLoading) {\n  <div class=\"clr-treenode-spinner-container\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  } @if (featuresService.selectable) {\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  } @if (!featuresService.selectable) {\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n  }\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    @if (featuresService.selectable || ariaSelected) {\n    <div class=\"clr-sr-only\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n    }\n  </ng-template>\n</div>\n<div\n  class=\"clr-treenode-children\"\n  [@toggleChildrenAnim]=\"expandService.expanded ? 'expanded' : 'collapsed'\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: ClrTreeNode, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: TreeFeaturesService }, { type: i2.IfExpandService }, { type: i2.ClrCommonStringsService }, { type: TreeFocusManagerService }, { type: i0.ElementRef }, { type: i0.Injector }], propDecorators: { expandable: [{
                type: Input,
                args: ['clrExpandable']
            }], selectedChange: [{
                type: Output,
                args: ['clrSelectedChange']
            }], expandedChange: [{
                type: Output,
                args: ['clrExpandedChange']
            }], contentContainer: [{
                type: ViewChild,
                args: ['contentContainer', { read: ElementRef, static: true }]
            }], treeNodeLinkList: [{
                type: ContentChildren,
                args: [ClrTreeNodeLink, { descendants: false }]
            }], disabled: [{
                type: Input,
                args: ['clrDisabled']
            }], selected: [{
                type: Input,
                args: ['clrSelected']
            }], expanded: [{
                type: Input,
                args: ['clrExpanded']
            }], clrForTypeAhead: [{
                type: Input,
                args: ['clrForTypeAhead']
            }] } });
function trimAndLowerCase(value) {
    return value.toLocaleLowerCase().trim();
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTree {
    constructor(featuresService, focusManagerService, renderer, el, ngZone) {
        this.featuresService = featuresService;
        this.focusManagerService = focusManagerService;
        this.renderer = renderer;
        this.el = el;
        this.subscriptions = [];
        this._isMultiSelectable = false;
        const subscription = ngZone.runOutsideAngular(() => fromEvent(el.nativeElement, 'focusin').subscribe((event) => {
            if (event.target === el.nativeElement) {
                // After discussing with the team, I've made it so that when the tree receives focus, the first visible node will be focused.
                // This will prevent from the page scrolling abruptly to the first selected node if it exist in a deeply nested tree.
                focusManagerService.focusFirstVisibleNode();
                // when the first child gets focus,
                // tree should no longer have tabindex of 0.
                renderer.removeAttribute(el.nativeElement, 'tabindex');
            }
        }));
        this.subscriptions.push(subscription);
    }
    set lazy(value) {
        this.featuresService.eager = !value;
    }
    get isMultiSelectable() {
        return this._isMultiSelectable;
    }
    ngAfterContentInit() {
        this.setRootNodes();
        this.subscriptions.push(this.rootNodes.changes.subscribe(() => {
            this.setMultiSelectable();
            this.setRootNodes();
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setMultiSelectable() {
        if (this.featuresService.selectable && this.rootNodes.length > 0) {
            this._isMultiSelectable = true;
            this.renderer.setAttribute(this.el.nativeElement, 'aria-multiselectable', 'true');
        }
        else {
            this._isMultiSelectable = false;
            this.renderer.removeAttribute(this.el.nativeElement, 'aria-multiselectable');
        }
    }
    setRootNodes() {
        // if node has no parent, it's a root node
        // for recursive tree, this.rootNodes registers also nested children
        // so we have to use filter to extract the ones that are truly root nodes
        this.focusManagerService.rootNodeModels = this.rootNodes.map(node => node._model).filter(node => !node.parent);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTree, deps: [{ token: TreeFeaturesService }, { token: TreeFocusManagerService }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrTree, isStandalone: false, selector: "clr-tree", inputs: { lazy: ["clrLazy", "lazy"] }, host: { attributes: { "tabindex": "0" }, properties: { "attr.role": "\"tree\"" } }, providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService], queries: [{ propertyName: "rootNodes", predicate: ClrTreeNode }], ngImport: i0, template: `
    <ng-content></ng-content>
    @if (featuresService.recursion) {
      <clr-recursive-children [children]="featuresService.recursion.root"></clr-recursive-children>
    }
  `, isInline: true, dependencies: [{ kind: "component", type: RecursiveChildren, selector: "clr-recursive-children", inputs: ["parent", "children"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTree, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tree',
                    template: `
    <ng-content></ng-content>
    @if (featuresService.recursion) {
      <clr-recursive-children [children]="featuresService.recursion.root"></clr-recursive-children>
    }
  `,
                    providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService],
                    host: {
                        tabindex: '0',
                        '[attr.role]': '"tree"',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: TreeFeaturesService }, { type: TreeFocusManagerService }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }], propDecorators: { rootNodes: [{
                type: ContentChildren,
                args: [ClrTreeNode]
            }], lazy: [{
                type: Input,
                args: ['clrLazy']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function isPromise(o) {
    // Shamelessly copied from every open-source project out there.
    return o && typeof o.then === 'function';
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * A recursive model is built received from the app and traversed to create the corresponding components.
 * Recursive = Model dictates the tree node components
 */
class RecursiveTreeNodeModel extends TreeNodeModel {
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrRecursiveForOf {
    constructor(template, featuresService, cdr) {
        this.template = template;
        this.featuresService = featuresService;
        this.cdr = cdr;
    }
    // I'm using OnChanges instead of OnInit to easily keep up to date with dynamic trees. Maybe optimizable later.
    ngOnChanges() {
        let wrapped;
        if (Array.isArray(this.nodes)) {
            wrapped = this.nodes.map(node => new RecursiveTreeNodeModel(node, null, this.getChildren, this.featuresService));
        }
        else {
            wrapped = [new RecursiveTreeNodeModel(this.nodes, null, this.getChildren, this.featuresService)];
        }
        if (!this.childrenFetchSubscription) {
            this.childrenFetchSubscription = this.featuresService.childrenFetched.pipe(debounceTime(0)).subscribe(() => {
                this.cdr.detectChanges();
            });
        }
        this.featuresService.recursion = {
            template: this.template,
            root: wrapped,
        };
    }
    ngOnDestroy() {
        if (this.childrenFetchSubscription) {
            this.childrenFetchSubscription.unsubscribe();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrRecursiveForOf, deps: [{ token: i0.TemplateRef }, { token: TreeFeaturesService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrRecursiveForOf, isStandalone: false, selector: "[clrRecursiveFor][clrRecursiveForOf]", inputs: { nodes: ["clrRecursiveForOf", "nodes"], getChildren: ["clrRecursiveForGetChildren", "getChildren"] }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrRecursiveForOf, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRecursiveFor][clrRecursiveForOf]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: TreeFeaturesService }, { type: i0.ChangeDetectorRef }], propDecorators: { nodes: [{
                type: Input,
                args: ['clrRecursiveForOf']
            }], getChildren: [{
                type: Input,
                args: ['clrRecursiveForGetChildren']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TREE_VIEW_DIRECTIVES = [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink];
class ClrTreeViewModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeViewModule, declarations: [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink, RecursiveChildren], imports: [CommonModule, ClrIcon, ClrLoadingModule], exports: [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeViewModule, imports: [CommonModule, ClrIcon, ClrLoadingModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTreeViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrLoadingModule],
                    declarations: [CLR_TREE_VIEW_DIRECTIVES, RecursiveChildren],
                    exports: [CLR_TREE_VIEW_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_TREE_VIEW_DIRECTIVES, ClrRecursiveForOf, ClrSelectedState, ClrTree, ClrTreeNode, ClrTreeNodeLink, ClrTreeViewModule };
//# sourceMappingURL=clr-angular-data-tree-view.mjs.map
