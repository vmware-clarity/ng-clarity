import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, Inject, Injectable, Input, NgModule, Optional, Output, PLATFORM_ID, SkipSelf, ViewChild, afterNextRender, inject } from "@angular/core";
import { BehaviorSubject, Subject, asapScheduler, fromEvent, isObservable } from "rxjs";
import * as i3 from "@angular/common";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import * as i2 from "@clr/angular/utils";
import { ClrLoadingModule, IfExpandService, Keys, LoadingListener, animateHeight, isKeyEitherLetterOrNumber, measureHeight, noopAnimations, preventArrowKeyScroll, uniqueIdFactory } from "@clr/angular/utils";
import { debounceTime, filter, skip } from "rxjs/operators";
import * as i5 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleIcon } from "@clr/angular/icon";
var ClrSelectedState;
(function(ClrSelectedState) {
	ClrSelectedState[ClrSelectedState["UNSELECTED"] = 0] = "UNSELECTED";
	ClrSelectedState[ClrSelectedState["SELECTED"] = 1] = "SELECTED";
	ClrSelectedState[ClrSelectedState["INDETERMINATE"] = 2] = "INDETERMINATE";
})(ClrSelectedState || (ClrSelectedState = {}));
var TreeFeaturesService = class TreeFeaturesService {
	constructor() {
		this.selectable = false;
		this.eager = true;
		this.childrenFetched = new Subject();
		this._allExpanded = false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TreeFeaturesService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TreeFeaturesService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TreeFeaturesService,
	decorators: [{ type: Injectable }]
});
function treeFeaturesFactory(existing) {
	return existing || new TreeFeaturesService();
}
const TREE_FEATURES_PROVIDER = {
	provide: TreeFeaturesService,
	useFactory: treeFeaturesFactory,
	deps: [[
		new Optional(),
		new SkipSelf(),
		TreeFeaturesService
	]]
};
var TreeFocusManagerService = class TreeFocusManagerService {
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
		if (model) this._focusRequest.next(model.nodeId);
	}
	broadcastFocusedNode(nodeId) {
		if (this.focusedNodeId !== nodeId) {
			this.focusedNodeId = nodeId;
			this._focusChange.next(nodeId);
		}
	}
	focusParent(model) {
		if (model) this.focusNode(model.parent);
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
		if (model.parent) return model.parent.children;
		else return this.rootNodeModels;
	}
	findLastVisibleInNode(model) {
		if (!model) return null;
		if (model.expanded && model.children.length > 0) {
			const children = model.children;
			const lastChild = children[children.length - 1];
			return this.findLastVisibleInNode(lastChild);
		} else return model;
	}
	findNextFocusable(model) {
		if (!model) return null;
		const siblings = this.findSiblings(model);
		const selfIndex = siblings.indexOf(model);
		if (selfIndex < siblings.length - 1) return siblings[selfIndex + 1];
		else if (selfIndex === siblings.length - 1) return this.findNextFocusable(model.parent);
		return null;
	}
	findLastVisibleInTree() {
		const lastRootNode = this.rootNodeModels && this.rootNodeModels.length && this.rootNodeModels[this.rootNodeModels.length - 1];
		return this.findLastVisibleInNode(lastRootNode);
	}
	findNodeAbove(model) {
		if (!model) return null;
		const siblings = this.findSiblings(model);
		const selfIndex = siblings.indexOf(model);
		if (selfIndex === 0) return model.parent;
		else if (selfIndex > 0) return this.findLastVisibleInNode(siblings[selfIndex - 1]);
		return null;
	}
	findNodeBelow(model) {
		if (!model) return null;
		if (model.expanded && model.children.length > 0) return model.children[0];
		else return this.findNextFocusable(model);
	}
	findDescendentNodeStartsWith(searchString, model) {
		if (model.expanded && model.children.length > 0) for (const childModel of model.children) {
			const found = this.findNodeStartsWith(searchString, childModel);
			if (found) return found;
		}
		return null;
	}
	findSiblingNodeStartsWith(searchString, model) {
		const siblings = this.findSiblings(model);
		const selfIndex = siblings.indexOf(model);
		for (let i = selfIndex + 1; i < siblings.length; i++) {
			const siblingModel = siblings[i];
			const found = this.findNodeStartsWith(searchString, siblingModel);
			if (found) return found;
		}
		return null;
	}
	findRootNodeStartsWith(searchString, model) {
		for (const rootModel of this.rootNodeModels) {
			if (model.parent && model.parent === rootModel) continue;
			const found = this.findNodeStartsWith(searchString, rootModel);
			if (found) return found;
		}
		return null;
	}
	findNodeStartsWith(searchString, model) {
		if (!model) return null;
		if (model.textContent.startsWith(searchString)) return model;
		return this.findDescendentNodeStartsWith(searchString, model);
	}
	findClosestNodeStartsWith(searchString, model) {
		if (!model) return null;
		const foundFromDescendents = this.findDescendentNodeStartsWith(searchString, model);
		if (foundFromDescendents) return foundFromDescendents;
		const foundFromSiblings = this.findSiblingNodeStartsWith(searchString, model);
		if (foundFromSiblings) return foundFromSiblings;
		const foundFromRootNodes = this.findRootNodeStartsWith(searchString, model);
		if (foundFromRootNodes) return foundFromRootNodes;
		return this.findNodeStartsWith(searchString, model.parent);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TreeFocusManagerService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TreeFocusManagerService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TreeFocusManagerService,
	decorators: [{ type: Injectable }]
});
var TreeNodeModel = class {
	constructor() {
		this._descendantsExpanded = false;
		this._node = null;
		this.loading$ = new BehaviorSubject(false);
		this.selected = new BehaviorSubject(ClrSelectedState.UNSELECTED);
		this._loading = false;
	}
	get loading() {
		return this._loading;
	}
	set loading(isLoading) {
		this._loading = isLoading;
		this.loading$.next(isLoading);
	}
	get _loadedChildren() {
		return this.children;
	}
	get disabled() {
		return !!(this._disabled || this.parent?.disabled);
	}
	set disabled(value) {
		this._disabled = value;
	}
	destroy() {
		this._node = null;
		this.selected.complete();
	}
	_setExpandedRecursive(expanded) {
		if (this.disabled) return;
		if (this._node) this._node._setExpandedInBulk(expanded);
		for (const child of this._loadedChildren) child._setExpandedRecursive(expanded);
		this._descendantsExpanded = expanded;
	}
	_isInExpandedSubtree() {
		for (let current = this; current; current = current.parent) if (current._descendantsExpanded) return true;
		return false;
	}
	setSelected(state, propagateUp, propagateDown) {
		if (state === this.selected.value) return;
		this.selected.next(state);
		if (propagateDown && state !== ClrSelectedState.INDETERMINATE && this.children) this.children.forEach((child) => {
			if (!child.disabled) child.setSelected(state, false, true);
		});
		if (propagateUp && this.parent) this.parent._updateSelectionFromChildren();
	}
	toggleSelection(propagate) {
		if (this.disabled) return;
		const newState = this.selected.value === ClrSelectedState.SELECTED ? ClrSelectedState.UNSELECTED : ClrSelectedState.SELECTED;
		this.setSelected(newState, true, propagate);
	}
	_clearExpandedSubtree() {
		for (let current = this; current; current = current.parent) current._descendantsExpanded = false;
	}
	_updateSelectionFromChildren() {
		const newState = this.computeSelectionStateFromChildren();
		if (newState === this.selected.value) return;
		this.selected.next(newState);
		if (this.parent) this.parent._updateSelectionFromChildren();
	}
	computeSelectionStateFromChildren() {
		let oneSelected = false;
		let oneUnselected = false;
		for (const child of this.children) switch (child.selected.value) {
			case ClrSelectedState.INDETERMINATE:
				if (child.disabled) continue;
				return ClrSelectedState.INDETERMINATE;
			case ClrSelectedState.SELECTED:
				oneSelected = true;
				if (oneUnselected) return ClrSelectedState.INDETERMINATE;
				break;
			case ClrSelectedState.UNSELECTED:
			default:
				oneUnselected = true;
				if (oneSelected) return ClrSelectedState.INDETERMINATE;
		}
		if (!oneSelected) return ClrSelectedState.UNSELECTED;
		else if (!oneUnselected) return ClrSelectedState.SELECTED;
		else return ClrSelectedState.UNSELECTED;
	}
};
var DeclarativeTreeNodeModel = class extends TreeNodeModel {
	constructor(parent) {
		super();
		this.parent = parent;
		if (parent) parent._addChild(this);
		this.children = [];
	}
	destroy() {
		if (this.parent) this.parent._removeChild(this);
		super.destroy();
	}
	_addChild(child) {
		this.children.push(child);
	}
	_removeChild(child) {
		const index = this.children.indexOf(child);
		if (index > -1) this.children.splice(index, 1);
	}
};
var ClrTreeNodeLink = class ClrTreeNodeLink {
	constructor(el) {
		this.el = el;
		this.tabindex = -1;
	}
	get active() {
		return this.el.nativeElement.classList.contains("active");
	}
	activate() {
		if (this.el.nativeElement && this.el.nativeElement.click) this.el.nativeElement.click();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTreeNodeLink,
			deps: [{ token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrTreeNodeLink,
			isStandalone: false,
			selector: ".clr-treenode-link",
			host: { properties: { "attr.tabindex": "this.tabindex" } },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrTreeNodeLink,
	decorators: [{
		type: Directive,
		args: [{
			selector: ".clr-treenode-link",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.ElementRef }],
	propDecorators: { tabindex: [{
		type: HostBinding,
		args: ["attr.tabindex"]
	}] }
});
var RecursiveChildren = class RecursiveChildren {
	constructor(featuresService, expandService) {
		this.featuresService = featuresService;
		this.expandService = expandService;
		this.contexts = /* @__PURE__ */ new WeakMap();
		if (expandService) this.subscription = expandService.expandChange.subscribe((value) => {
			if (!value && this.parent && !featuresService.eager && featuresService.recursion) this.parent.clearChildren();
		});
	}
	ngAfterContentInit() {
		this.setAriaRoles();
	}
	shouldRender() {
		return this.featuresService.recursion && (this.featuresService.eager || !this.expandService || this.expandService.expanded);
	}
	getContext(node) {
		let context = this.contexts.get(node);
		if (!context) {
			context = {
				get $implicit() {
					return node.model;
				},
				clrModel: node
			};
			this.contexts.set(node, context);
		}
		return context;
	}
	ngOnDestroy() {
		if (this.subscription) this.subscription.unsubscribe();
	}
	setAriaRoles() {
		this.role = this.parent ? "group" : null;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RecursiveChildren,
			deps: [{ token: TreeFeaturesService }, {
				token: i2.IfExpandService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: RecursiveChildren,
			isStandalone: false,
			selector: "clr-recursive-children",
			inputs: {
				parent: "parent",
				children: "children"
			},
			host: { properties: { "attr.role": "role" } },
			ngImport: i0,
			template: `
    @if (shouldRender()) {
      @for (child of parent?.children || children; track child) {
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      }
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i3.NgTemplateOutlet,
				selector: "[ngTemplateOutlet]",
				inputs: [
					"ngTemplateOutletContext",
					"ngTemplateOutlet",
					"ngTemplateOutletInjector"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RecursiveChildren,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-recursive-children",
			template: `
    @if (shouldRender()) {
      @for (child of parent?.children || children; track child) {
        <ng-container *ngTemplateOutlet="featuresService.recursion.template; context: getContext(child)"></ng-container>
      }
    }
  `,
			host: { "[attr.role]": "role" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: TreeFeaturesService }, {
		type: i2.IfExpandService,
		decorators: [{ type: Optional }]
	}],
	propDecorators: {
		parent: [{
			type: Input,
			args: ["parent"]
		}],
		children: [{
			type: Input,
			args: ["children"]
		}]
	}
});
const LVIEW_CONTEXT_INDEX = 8;
const TREE_TYPE_AHEAD_TIMEOUT = 200;
var ClrTreeNode = class ClrTreeNode {
	constructor(platformId, parent, featuresService, expandService, commonStrings, focusManager, elementRef, injector) {
		this.platformId = platformId;
		this.featuresService = featuresService;
		this.expandService = expandService;
		this.commonStrings = commonStrings;
		this.focusManager = focusManager;
		this.elementRef = elementRef;
		this.injector = injector;
		this.selectedChange = new EventEmitter(false);
		this.expandedChange = new EventEmitter();
		this.STATES = ClrSelectedState;
		this.isModelLoading = false;
		this.nodeId = uniqueIdFactory();
		this.contentContainerTabindex = -1;
		this.animatesChildren = false;
		this.noopAnimations = noopAnimations();
		this.bulkChange = false;
		this.skipAnimation = false;
		this.skipEmitChange = false;
		this.typeAheadKeyBuffer = "";
		this.typeAheadKeyEvent = new Subject();
		this.subscriptions = [];
		this.changeDetectorRef = inject(ChangeDetectorRef);
		if (featuresService.recursion) {
			if (injector.view) this._model = injector.view.context.clrModel;
			else this._model = injector._lView[LVIEW_CONTEXT_INDEX].clrModel;
		} else this._model = new DeclarativeTreeNodeModel(parent ? parent._model : null);
		this._model.nodeId = this.nodeId;
		this._model._node = this;
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
		if (value === null || typeof value === "undefined") value = ClrSelectedState.UNSELECTED;
		if (typeof value === "boolean") value = value ? ClrSelectedState.SELECTED : ClrSelectedState.UNSELECTED;
		this.skipEmitChange = true;
		this._model.setSelected(value, this.featuresService.eager, this.featuresService.eager);
		this.skipEmitChange = false;
	}
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
		if (this.isSelectable()) return this._model.selected.value === ClrSelectedState.SELECTED;
		else if (this.treeNodeLink?.active) return true;
		else return null;
	}
	get treeNodeLink() {
		return this.treeNodeLinkList && this.treeNodeLinkList.first;
	}
	get childrenAnimationState() {
		if (this.expandService.expanded) return this.skipAnimation ? "expandedInstant" : "expanded";
		return this.skipAnimation ? "collapsedInstant" : "collapsed";
	}
	get isParent() {
		return this._model.children && this._model.children.length > 0;
	}
	ngOnInit() {
		this._model.expanded = this.expanded;
		this._model.disabled = this.disabled;
		this.subscriptions.push(this._model.selected.pipe(filter(() => !this.skipEmitChange)).subscribe((value) => {
			this.selectedChange.emit(value);
		}));
		this.subscriptions.push(this.expandService.expandChange.subscribe((value) => {
			this.skipAnimation = this.bulkChange;
			if (this.animatesChildren) this.animateChildrenHeight();
			this.expandedChange.emit(value);
			this._model.expanded = value;
			if (!this.bulkChange && !value) {
				this._model._clearExpandedSubtree();
				this.featuresService._allExpanded = false;
			}
		}));
		this.subscriptions.push(this.focusManager.focusRequest.subscribe((nodeId) => {
			if (this.nodeId === nodeId) this.focusTreeNode();
		}), this.focusManager.focusChange.subscribe((nodeId) => {
			this.checkTabIndex(nodeId);
		}));
		this.isModelLoading = this._model.loading;
		this.subscriptions.push(this._model.loading$.pipe(skip(1), debounceTime(0, asapScheduler)).subscribe((isLoading) => {
			this.isModelLoading = isLoading;
			this.changeDetectorRef.markForCheck();
		}));
	}
	ngAfterContentInit() {
		if (!this.expanded && (this.featuresService._allExpanded || this._model._isInExpandedSubtree()) && !this.disabled && this.isExpandable()) {
			this._setExpandedInBulk(true);
			this._model._descendantsExpanded = true;
		}
		this.subscriptions.push(this.typeAheadKeyEvent.pipe(debounceTime(TREE_TYPE_AHEAD_TIMEOUT)).subscribe((bufferedKeys) => {
			this.focusManager.focusNodeStartsWith(bufferedKeys, this._model);
			this.typeAheadKeyBuffer = "";
		}));
	}
	ngAfterViewInit() {
		if (!this._model.textContent) this._model.textContent = trimAndLowerCase(this.elementRef.nativeElement.textContent);
	}
	ngOnDestroy() {
		this._model.destroy();
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	isExpandable() {
		if (typeof this.expandable !== "undefined") return this.expandable;
		return !!this.expandService.expandable || this.isParent;
	}
	isSelectable() {
		return this.featuresService.selectable;
	}
	expandDescendants() {
		this._model._setExpandedRecursive(true);
	}
	collapseDescendants() {
		this._model._setExpandedRecursive(false);
		this.reclaimTabStop();
	}
	_setExpandedInBulk(expanded) {
		if (expanded && !this.isExpandable()) return;
		this.bulkChange = true;
		try {
			this.expandService.expanded = expanded;
		} finally {
			this.bulkChange = false;
		}
	}
	_takeTabStop() {
		this.setTabIndex(0);
		this.focusManager.broadcastFocusedNode(this.nodeId);
	}
	focusTreeNode() {
		if (!isPlatformBrowser(this.platformId)) return;
		const containerEl = this.contentContainer.nativeElement;
		this.setTabIndex(0);
		if (document.activeElement !== containerEl) {
			this.focusManager.broadcastFocusedNode(this.nodeId);
			containerEl.focus();
			containerEl.scrollIntoView({
				block: "nearest",
				inline: "nearest"
			});
		}
	}
	broadcastFocusOnContainer() {
		this.focusManager.broadcastFocusedNode(this.nodeId);
	}
	onKeyDown(event) {
		preventArrowKeyScroll(event);
		switch (event.key) {
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
				event.preventDefault();
				this.toggleExpandOrTriggerDefault();
				break;
			default: if (this._model.textContent && isKeyEitherLetterOrNumber(event)) {
				this.typeAheadKeyBuffer += event.key;
				this.typeAheadKeyEvent.next(this.typeAheadKeyBuffer);
				return;
			}
		}
		this.typeAheadKeyBuffer = "";
	}
	reclaimTabStop() {
		if (this.elementRef.nativeElement.querySelector(".clr-treenode-children .clr-tree-node-content-container[tabindex=\"0\"]")) this._takeTabStop();
	}
	setTabIndex(value) {
		this.contentContainerTabindex = value;
		this.contentContainer.nativeElement.setAttribute("tabindex", value.toString());
	}
	checkTabIndex(nodeId) {
		if (isPlatformBrowser(this.platformId) && this.nodeId !== nodeId && this.contentContainerTabindex !== -1) this.setTabIndex(-1);
	}
	toggleExpandOrTriggerDefault() {
		if (this.disabled) return;
		if (this.isExpandable() && !this.isSelectable()) this.expandService.expanded = !this.expanded;
		else this.triggerDefaultAction();
	}
	expandOrFocusFirstChild() {
		if (this.disabled) return;
		if (this.expanded) {
			if (this.isParent) this.focusManager.focusNodeBelow(this._model);
		} else if (this.isExpandable()) this.expandService.expanded = true;
	}
	collapseOrFocusParent() {
		if (this.disabled) return;
		if (this.expanded) this.expandService.expanded = false;
		else this.focusManager.focusParent(this._model);
	}
	triggerDefaultAction() {
		if (this.treeNodeLink) this.treeNodeLink.activate();
		else if (this.isSelectable()) this._model.toggleSelection(this.featuresService.eager);
	}
	animateChildrenHeight() {
		const children = this.children.nativeElement;
		const change = this.childrenHeightChange = {};
		const clearsChildren = !this.expanded && this.featuresService.recursion && !this.featuresService.eager;
		if (this.skipAnimation || clearsChildren) {
			children.getAnimations().forEach((animation) => animation.cancel());
			return;
		}
		const from = measureHeight(children);
		afterNextRender({ read: () => {
			if (change === this.childrenHeightChange) animateHeight(children, {
				from,
				easing: "linear"
			});
		} }, { injector: this.injector });
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTreeNode,
			deps: [
				{ token: PLATFORM_ID },
				{
					token: ClrTreeNode,
					optional: true,
					skipSelf: true
				},
				{ token: TreeFeaturesService },
				{ token: i2.IfExpandService },
				{ token: i2.ClrCommonStringsService },
				{ token: TreeFocusManagerService },
				{ token: i0.ElementRef },
				{ token: i0.Injector }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrTreeNode,
			isStandalone: false,
			selector: "clr-tree-node",
			inputs: {
				expandable: ["clrExpandable", "expandable"],
				disabled: ["clrDisabled", "disabled"],
				selected: ["clrSelected", "selected"],
				expanded: ["clrExpanded", "expanded"],
				clrForTypeAhead: "clrForTypeAhead"
			},
			outputs: {
				selectedChange: "clrSelectedChange",
				expandedChange: "clrExpandedChange"
			},
			host: { properties: {
				"class.clr-tree-node": "true",
				"class.disabled": "this._model.disabled"
			} },
			providers: [
				TREE_FEATURES_PROVIDER,
				IfExpandService,
				{
					provide: LoadingListener,
					useExisting: IfExpandService
				}
			],
			queries: [{
				propertyName: "treeNodeLinkList",
				predicate: ClrTreeNodeLink
			}],
			viewQueries: [{
				propertyName: "contentContainer",
				first: true,
				predicate: ["contentContainer"],
				descendants: true,
				read: ElementRef,
				static: true
			}, {
				propertyName: "children",
				first: true,
				predicate: ["children"],
				descendants: true,
				static: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  @if (isExpandable() && !isModelLoading && !expandService.loading) {\n  <button\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  } @if (expandService.loading || isModelLoading) {\n  <div class=\"clr-treenode-spinner-container\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  } @if (featuresService.selectable) {\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  } @if (!featuresService.selectable) {\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n  }\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    @if (featuresService.selectable || ariaSelected) {\n    <div class=\"clr-sr-only\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n    }\n  </ng-template>\n</div>\n<div\n  #children\n  class=\"clr-treenode-children\"\n  [class.is-expanded]=\"expandService.expanded\"\n  (animate.enter)=\"animatesChildren = !noopAnimations\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n  [attr.inert]=\"expandService.expanded ? null : ''\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n",
			dependencies: [
				{
					kind: "directive",
					type: i3.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: i5.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: RecursiveChildren,
					selector: "clr-recursive-children",
					inputs: ["parent", "children"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrTreeNode,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-tree-node",
			providers: [
				TREE_FEATURES_PROVIDER,
				IfExpandService,
				{
					provide: LoadingListener,
					useExisting: IfExpandService
				}
			],
			host: {
				"[class.clr-tree-node]": "true",
				"[class.disabled]": "this._model.disabled"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  @if (isExpandable() && !isModelLoading && !expandService.loading) {\n  <button\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  } @if (expandService.loading || isModelLoading) {\n  <div class=\"clr-treenode-spinner-container\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  } @if (featuresService.selectable) {\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  } @if (!featuresService.selectable) {\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n  }\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    @if (featuresService.selectable || ariaSelected) {\n    <div class=\"clr-sr-only\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n    }\n  </ng-template>\n</div>\n<div\n  #children\n  class=\"clr-treenode-children\"\n  [class.is-expanded]=\"expandService.expanded\"\n  (animate.enter)=\"animatesChildren = !noopAnimations\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n  [attr.inert]=\"expandService.expanded ? null : ''\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n"
		}]
	}],
	ctorParameters: () => [
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{
			type: ClrTreeNode,
			decorators: [{ type: Optional }, { type: SkipSelf }]
		},
		{ type: TreeFeaturesService },
		{ type: i2.IfExpandService },
		{ type: i2.ClrCommonStringsService },
		{ type: TreeFocusManagerService },
		{ type: i0.ElementRef },
		{ type: i0.Injector }
	],
	propDecorators: {
		expandable: [{
			type: Input,
			args: ["clrExpandable"]
		}],
		selectedChange: [{
			type: Output,
			args: ["clrSelectedChange"]
		}],
		expandedChange: [{
			type: Output,
			args: ["clrExpandedChange"]
		}],
		contentContainer: [{
			type: ViewChild,
			args: ["contentContainer", {
				read: ElementRef,
				static: true
			}]
		}],
		children: [{
			type: ViewChild,
			args: ["children", { static: true }]
		}],
		treeNodeLinkList: [{
			type: ContentChildren,
			args: [ClrTreeNodeLink, { descendants: false }]
		}],
		disabled: [{
			type: Input,
			args: ["clrDisabled"]
		}],
		selected: [{
			type: Input,
			args: ["clrSelected"]
		}],
		expanded: [{
			type: Input,
			args: ["clrExpanded"]
		}],
		clrForTypeAhead: [{
			type: Input,
			args: ["clrForTypeAhead"]
		}]
	}
});
function trimAndLowerCase(value) {
	return value.toLocaleLowerCase().trim();
}
var ClrTree = class ClrTree {
	constructor(featuresService, focusManagerService, renderer, el, ngZone) {
		this.featuresService = featuresService;
		this.focusManagerService = focusManagerService;
		this.renderer = renderer;
		this.el = el;
		this.rootModels = [];
		this.subscriptions = [];
		this._isMultiSelectable = false;
		const subscription = ngZone.runOutsideAngular(() => fromEvent(el.nativeElement, "focusin").subscribe((event) => {
			if (event.target === el.nativeElement) {
				focusManagerService.focusFirstVisibleNode();
				renderer.removeAttribute(el.nativeElement, "tabindex");
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
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	expandAll() {
		this.setAllExpanded(true);
	}
	collapseAll() {
		this.setAllExpanded(false);
	}
	setAllExpanded(expanded) {
		this.featuresService._allExpanded = expanded;
		this.rootModels.forEach((model) => model._setExpandedRecursive(expanded));
		if (!expanded) this.reclaimTabStop();
	}
	reclaimTabStop() {
		if (this.el.nativeElement.querySelector(".clr-treenode-children .clr-tree-node-content-container[tabindex=\"0\"]")) {
			const firstRoot = this.rootNodes.find((node) => !node._model.parent);
			if (firstRoot) firstRoot._takeTabStop();
		}
	}
	setMultiSelectable() {
		if (this.featuresService.selectable && this.rootNodes.length > 0) {
			this._isMultiSelectable = true;
			this.renderer.setAttribute(this.el.nativeElement, "aria-multiselectable", "true");
		} else {
			this._isMultiSelectable = false;
			this.renderer.removeAttribute(this.el.nativeElement, "aria-multiselectable");
		}
	}
	setRootNodes() {
		this.rootModels = this.rootNodes.map((node) => node._model).filter((node) => !node.parent);
		this.focusManagerService.rootNodeModels = this.rootModels;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTree,
			deps: [
				{ token: TreeFeaturesService },
				{ token: TreeFocusManagerService },
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{ token: i0.NgZone }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrTree,
			isStandalone: false,
			selector: "clr-tree",
			inputs: { lazy: ["clrLazy", "lazy"] },
			host: {
				attributes: { "tabindex": "0" },
				properties: { "attr.role": "\"tree\"" }
			},
			providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService],
			queries: [{
				propertyName: "rootNodes",
				predicate: ClrTreeNode
			}],
			ngImport: i0,
			template: `
    <ng-content></ng-content>
    @if (featuresService.recursion) {
      <clr-recursive-children [children]="featuresService.recursion.root"></clr-recursive-children>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: RecursiveChildren,
				selector: "clr-recursive-children",
				inputs: ["parent", "children"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrTree,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-tree",
			template: `
    <ng-content></ng-content>
    @if (featuresService.recursion) {
      <clr-recursive-children [children]="featuresService.recursion.root"></clr-recursive-children>
    }
  `,
			providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService],
			host: {
				tabindex: "0",
				"[attr.role]": "\"tree\""
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: TreeFeaturesService },
		{ type: TreeFocusManagerService },
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{ type: i0.NgZone }
	],
	propDecorators: {
		rootNodes: [{
			type: ContentChildren,
			args: [ClrTreeNode]
		}],
		lazy: [{
			type: Input,
			args: ["clrLazy"]
		}]
	}
});
function isPromise(o) {
	return o && typeof o.then === "function";
}
var RecursiveTreeNodeModel = class RecursiveTreeNodeModel extends TreeNodeModel {
	constructor(model, parent, getChildren, featuresService) {
		super();
		this.getChildren = getChildren;
		this.featuresService = featuresService;
		this.childrenFetched = false;
		this.destroyed = false;
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
	get _loadedChildren() {
		return this._children || [];
	}
	destroy() {
		this.destroyed = true;
		if (this.subscription) this.subscription.unsubscribe();
		super.destroy();
	}
	clearChildren() {
		this._children.forEach((child) => child.destroy());
		delete this._children;
		this.childrenFetched = false;
	}
	fetchChildren() {
		if (this.destroyed || this.childrenFetched) return;
		const asyncChildren = this.getChildren(this.model);
		if (isPromise(asyncChildren)) {
			this.loading = true;
			asyncChildren.then((raw) => {
				if (this.destroyed) return;
				this._children = this.wrapChildren(raw);
				this.loading = false;
			});
		} else if (isObservable(asyncChildren)) {
			this.loading = true;
			this.subscription = asyncChildren.subscribe((raw) => {
				this._children = this.wrapChildren(raw);
				this.loading = false;
			});
		} else if (asyncChildren) this._children = this.wrapChildren(asyncChildren);
		else this._children = [];
		this.childrenFetched = true;
		if (this.featuresService) this.featuresService.childrenFetched.next();
	}
	wrapChildren(rawModels) {
		return (rawModels || []).map((m) => new RecursiveTreeNodeModel(m, this, this.getChildren, this.featuresService));
	}
};
var ClrRecursiveForOf = class ClrRecursiveForOf {
	constructor(template, featuresService, cdr) {
		this.template = template;
		this.featuresService = featuresService;
		this.cdr = cdr;
	}
	ngOnChanges() {
		let wrapped;
		if (Array.isArray(this.nodes)) wrapped = this.nodes.map((node) => new RecursiveTreeNodeModel(node, null, this.getChildren, this.featuresService));
		else wrapped = [new RecursiveTreeNodeModel(this.nodes, null, this.getChildren, this.featuresService)];
		if (!this.childrenFetchSubscription) this.childrenFetchSubscription = this.featuresService.childrenFetched.pipe(debounceTime(0, asapScheduler)).subscribe(() => {
			this.cdr.detectChanges();
		});
		this.featuresService.recursion = {
			template: this.template,
			root: wrapped
		};
	}
	ngOnDestroy() {
		if (this.childrenFetchSubscription) this.childrenFetchSubscription.unsubscribe();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrRecursiveForOf,
			deps: [
				{ token: i0.TemplateRef },
				{ token: TreeFeaturesService },
				{ token: i0.ChangeDetectorRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrRecursiveForOf,
			isStandalone: false,
			selector: "[clrRecursiveFor][clrRecursiveForOf]",
			inputs: {
				nodes: ["clrRecursiveForOf", "nodes"],
				getChildren: ["clrRecursiveForGetChildren", "getChildren"]
			},
			usesOnChanges: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrRecursiveForOf,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrRecursiveFor][clrRecursiveForOf]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.TemplateRef },
		{ type: TreeFeaturesService },
		{ type: i0.ChangeDetectorRef }
	],
	propDecorators: {
		nodes: [{
			type: Input,
			args: ["clrRecursiveForOf"]
		}],
		getChildren: [{
			type: Input,
			args: ["clrRecursiveForGetChildren"]
		}]
	}
});
const CLR_TREE_VIEW_DIRECTIVES = [
	ClrTree,
	ClrTreeNode,
	ClrRecursiveForOf,
	ClrTreeNodeLink
];
var ClrTreeViewModule = class ClrTreeViewModule {
	constructor() {
		ClarityIcons.addIcons(angleIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTreeViewModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTreeViewModule,
			declarations: [
				ClrTree,
				ClrTreeNode,
				ClrRecursiveForOf,
				ClrTreeNodeLink,
				RecursiveChildren
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrLoadingModule
			],
			exports: [
				ClrTree,
				ClrTreeNode,
				ClrRecursiveForOf,
				ClrTreeNodeLink
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrTreeViewModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrLoadingModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrTreeViewModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrLoadingModule
			],
			declarations: [CLR_TREE_VIEW_DIRECTIVES, RecursiveChildren],
			exports: [CLR_TREE_VIEW_DIRECTIVES]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_TREE_VIEW_DIRECTIVES, ClrRecursiveForOf, ClrSelectedState, ClrTree, ClrTreeNode, ClrTreeNodeLink, ClrTreeViewModule, DeclarativeTreeNodeModel, RecursiveTreeNodeModel, TreeNodeModel };

//# sourceMappingURL=clr-angular-data-tree-view.mjs.map