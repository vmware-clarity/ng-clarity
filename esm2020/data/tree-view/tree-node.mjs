/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChildren, ElementRef, EventEmitter, Inject, Input, Optional, Output, PLATFORM_ID, SkipSelf, ViewChild, } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { Keys } from '../../utils/enums/keys.enum';
import { isKeyEitherLetterOrNumber, normalizeKey, preventArrowKeyScroll } from '../../utils/focus/key-focus/util';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { DeclarativeTreeNodeModel } from './models/declarative-tree-node.model';
import { ClrSelectedState } from './models/selected-state.enum';
import { TREE_FEATURES_PROVIDER } from './tree-features.service';
import { ClrTreeNodeLink } from './tree-node-link';
import * as i0 from "@angular/core";
import * as i1 from "./tree-features.service";
import * as i2 from "../../utils/conditional/if-expanded.service";
import * as i3 from "../../utils/i18n/common-strings.service";
import * as i4 from "./tree-focus-manager.service";
import * as i5 from "@angular/common";
import * as i6 from "../../icon/icon";
import * as i7 from "./recursive-children";
const LVIEW_CONTEXT_INDEX = 8;
// If the user types multiple keys without allowing 200ms to pass between them,
// then those keys are sent together in one request.
const TREE_TYPE_AHEAD_TIMEOUT = 200;
export class ClrTreeNode {
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
}
ClrTreeNode.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeNode, deps: [{ token: PLATFORM_ID }, { token: ClrTreeNode, optional: true, skipSelf: true }, { token: i1.TreeFeaturesService }, { token: i2.IfExpandService }, { token: i3.ClrCommonStringsService }, { token: i4.TreeFocusManagerService }, { token: i0.ElementRef }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Component });
ClrTreeNode.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTreeNode, selector: "clr-tree-node", inputs: { expandable: ["clrExpandable", "expandable"], disabled: ["clrDisabled", "disabled"], selected: ["clrSelected", "selected"], expanded: ["clrExpanded", "expanded"], clrForTypeAhead: "clrForTypeAhead" }, outputs: { selectedChange: "clrSelectedChange", expandedChange: "clrExpandedChange" }, host: { properties: { "class.clr-tree-node": "true", "class.disabled": "this._model.disabled" } }, providers: [TREE_FEATURES_PROVIDER, IfExpandService, { provide: LoadingListener, useExisting: IfExpandService }], queries: [{ propertyName: "treeNodeLinkList", predicate: ClrTreeNodeLink }], viewQueries: [{ propertyName: "contentContainer", first: true, predicate: ["contentContainer"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  <button\n    *ngIf=\"isExpandable() && !isModelLoading && !expandService.loading\"\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [attr.direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  <div class=\"clr-treenode-spinner-container\" *ngIf=\"expandService.loading || isModelLoading\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\" *ngIf=\"featuresService.selectable\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\" *ngIf=\"!featuresService.selectable\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    <div class=\"clr-sr-only\" *ngIf=\"featuresService.selectable || ariaSelected\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n  </ng-template>\n</div>\n<div\n  class=\"clr-treenode-children\"\n  [@toggleChildrenAnim]=\"expandService.expanded ? 'expanded' : 'collapsed'\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n", dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i7.RecursiveChildren, selector: "clr-recursive-children", inputs: ["parent", "children"] }], animations: [
        trigger('toggleChildrenAnim', [
            transition('collapsed => expanded', [style({ height: 0 }), animate(200, style({ height: '*' }))]),
            transition('expanded => collapsed', [style({ height: '*' }), animate(200, style({ height: 0 }))]),
            state('expanded', style({ height: '*', 'overflow-y': 'visible' })),
            state('collapsed', style({ height: 0 })),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeNode, decorators: [{
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
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  #contentContainer\n  role=\"treeitem\"\n  class=\"clr-tree-node-content-container\"\n  tabindex=\"-1\"\n  [class.clr-form-control-disabled]=\"disabled\"\n  [attr.aria-disabled]=\"disabled\"\n  [attr.aria-expanded]=\"isExpandable() ? expanded : null\"\n  [attr.aria-selected]=\"ariaSelected\"\n  (keydown)=\"onKeyDown($event)\"\n  (focus)=\"broadcastFocusOnContainer()\"\n>\n  <button\n    *ngIf=\"isExpandable() && !isModelLoading && !expandService.loading\"\n    aria-hidden=\"true\"\n    type=\"button\"\n    tabindex=\"-1\"\n    class=\"clr-treenode-caret\"\n    (click)=\"expandService.toggle();\"\n    (focus)=\"focusTreeNode()\"\n    [disabled]=\"disabled\"\n  >\n    <cds-icon\n      class=\"clr-treenode-caret-icon\"\n      shape=\"angle\"\n      [attr.direction]=\"expandService.expanded ? 'down' : 'right'\"\n    ></cds-icon>\n  </button>\n  <div class=\"clr-treenode-spinner-container\" *ngIf=\"expandService.loading || isModelLoading\">\n    <span class=\"clr-treenode-spinner spinner\"></span>\n  </div>\n  <div class=\"clr-checkbox-wrapper clr-treenode-checkbox\" *ngIf=\"featuresService.selectable\">\n    <input\n      aria-hidden=\"true\"\n      type=\"checkbox\"\n      [id]=\"nodeId + '-check'\"\n      class=\"clr-checkbox\"\n      [disabled]=\"disabled\"\n      [checked]=\"_model.selected.value === STATES.SELECTED\"\n      [indeterminate]=\"_model.selected.value === STATES.INDETERMINATE\"\n      (change)=\"_model.toggleSelection(featuresService.eager)\"\n      (focus)=\"focusTreeNode()\"\n      tabindex=\"-1\"\n    />\n    <label [for]=\"nodeId + '-check'\" class=\"clr-control-label\">\n      <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n    </label>\n  </div>\n  <div class=\"clr-treenode-content\" (mouseup)=\"focusTreeNode()\" *ngIf=\"!featuresService.selectable\">\n    <ng-container [ngTemplateOutlet]=\"treenodeContent\"></ng-container>\n  </div>\n\n  <ng-template #treenodeContent>\n    <ng-content></ng-content>\n    <div class=\"clr-sr-only\" *ngIf=\"featuresService.selectable || ariaSelected\">\n      <span> {{ariaSelected ? commonStrings.keys.selectedTreeNode : commonStrings.keys.unselectedTreeNode}}</span>\n    </div>\n  </ng-template>\n</div>\n<div\n  class=\"clr-treenode-children\"\n  [@toggleChildrenAnim]=\"expandService.expanded ? 'expanded' : 'collapsed'\"\n  [attr.role]=\"isExpandable() && !featuresService.recursion ? 'group' : null\"\n>\n  <ng-content select=\"clr-tree-node\"></ng-content>\n  <ng-content select=\"[clrIfExpanded]\"></ng-content>\n  <clr-recursive-children [parent]=\"_model\"></clr-recursive-children>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: ClrTreeNode, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1.TreeFeaturesService }, { type: i2.IfExpandService }, { type: i3.ClrCommonStringsService }, { type: i4.TreeFocusManagerService }, { type: i0.ElementRef }, { type: i0.Injector }]; }, propDecorators: { expandable: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvdHJlZS1ub2RlLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvdHJlZS1ub2RlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFHTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUVOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFdBQVcsRUFFWCxRQUFRLEVBQ1IsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsZ0JB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R0FBRyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUN6QyxDQUFDO3FCQUNILFFBQ0s7d0JBQ0osdUJBQXVCLEVBQUUsTUFBTTt3QkFDL0Isa0JBQWtCLEVBQUUsc0JBQXNCO3FCQUMzQzs7MEJBNEJFLE1BQU07MkJBQUMsV0FBVzs7MEJBQ2xCLFFBQVE7OzBCQUNSLFFBQVE7d09BekJhLFVBQVU7c0JBQWpDLEtBQUs7dUJBQUMsZUFBZTtnQkFFTyxjQUFjO3NCQUExQyxNQUFNO3VCQUFDLG1CQUFtQjtnQkFDRSxjQUFjO3NCQUExQyxNQUFNO3VCQUFDLG1CQUFtQjtnQkFhZ0QsZ0JBQWdCO3NCQUExRixTQUFTO3VCQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUlDLGdCQUFnQjtzQkFBakYsZUFBZTt1QkFBQyxlQUFlLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFO2dCQWlDcEQsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGFBQWE7Z0JBU2hCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxhQUFhO2dCQTBCaEIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGFBQWE7Z0JBU2hCLGVBQWU7c0JBRGxCLEtBQUs7dUJBQUMsaUJBQWlCOztBQXNOMUIsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFhO0lBQ3JDLE9BQU8sS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgYW5pbWF0ZSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFNraXBTZWxmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSWZFeHBhbmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IGlzS2V5RWl0aGVyTGV0dGVyT3JOdW1iZXIsIG5vcm1hbGl6ZUtleSwgcHJldmVudEFycm93S2V5U2Nyb2xsIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMva2V5LWZvY3VzL3V0aWwnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IExvYWRpbmdMaXN0ZW5lciB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZy1saXN0ZW5lcic7XG5pbXBvcnQgeyBEZWNsYXJhdGl2ZVRyZWVOb2RlTW9kZWwgfSBmcm9tICcuL21vZGVscy9kZWNsYXJhdGl2ZS10cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgQ2xyU2VsZWN0ZWRTdGF0ZSB9IGZyb20gJy4vbW9kZWxzL3NlbGVjdGVkLXN0YXRlLmVudW0nO1xuaW1wb3J0IHsgVHJlZU5vZGVNb2RlbCB9IGZyb20gJy4vbW9kZWxzL3RyZWUtbm9kZS5tb2RlbCc7XG5pbXBvcnQgeyBUUkVFX0ZFQVRVUkVTX1BST1ZJREVSLCBUcmVlRmVhdHVyZXNTZXJ2aWNlIH0gZnJvbSAnLi90cmVlLWZlYXR1cmVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgVHJlZUZvY3VzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3RyZWUtZm9jdXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENsclRyZWVOb2RlTGluayB9IGZyb20gJy4vdHJlZS1ub2RlLWxpbmsnO1xuXG5jb25zdCBMVklFV19DT05URVhUX0lOREVYID0gODtcblxuLy8gSWYgdGhlIHVzZXIgdHlwZXMgbXVsdGlwbGUga2V5cyB3aXRob3V0IGFsbG93aW5nIDIwMG1zIHRvIHBhc3MgYmV0d2VlbiB0aGVtLFxuLy8gdGhlbiB0aG9zZSBrZXlzIGFyZSBzZW50IHRvZ2V0aGVyIGluIG9uZSByZXF1ZXN0LlxuY29uc3QgVFJFRV9UWVBFX0FIRUFEX1RJTUVPVVQgPSAyMDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10cmVlLW5vZGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vdHJlZS1ub2RlLmh0bWwnLFxuICBwcm92aWRlcnM6IFtUUkVFX0ZFQVRVUkVTX1BST1ZJREVSLCBJZkV4cGFuZFNlcnZpY2UsIHsgcHJvdmlkZTogTG9hZGluZ0xpc3RlbmVyLCB1c2VFeGlzdGluZzogSWZFeHBhbmRTZXJ2aWNlIH1dLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcigndG9nZ2xlQ2hpbGRyZW5BbmltJywgW1xuICAgICAgdHJhbnNpdGlvbignY29sbGFwc2VkID0+IGV4cGFuZGVkJywgW3N0eWxlKHsgaGVpZ2h0OiAwIH0pLCBhbmltYXRlKDIwMCwgc3R5bGUoeyBoZWlnaHQ6ICcqJyB9KSldKSxcbiAgICAgIHRyYW5zaXRpb24oJ2V4cGFuZGVkID0+IGNvbGxhcHNlZCcsIFtzdHlsZSh7IGhlaWdodDogJyonIH0pLCBhbmltYXRlKDIwMCwgc3R5bGUoeyBoZWlnaHQ6IDAgfSkpXSksXG4gICAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7IGhlaWdodDogJyonLCAnb3ZlcmZsb3cteSc6ICd2aXNpYmxlJyB9KSksXG4gICAgICBzdGF0ZSgnY29sbGFwc2VkJywgc3R5bGUoeyBoZWlnaHQ6IDAgfSkpLFxuICAgIF0pLFxuICBdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItdHJlZS1ub2RlXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmRpc2FibGVkXSc6ICd0aGlzLl9tb2RlbC5kaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclRyZWVOb2RlPFQ+IGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAvLyBBbGxvd3MgdGhlIGNvbnN1bWVyIHRvIG92ZXJyaWRlIG91ciBsb2dpYyBkZWNpZGluZyBpZiBhIG5vZGUgaXMgZXhwYW5kYWJsZS5cbiAgLy8gVXNlZnVsIGZvciByZWN1cnNpdmUgdHJlZXMgdGhhdCBkb24ndCB3YW50IHRvIHByZS1sb2FkIG9uZSBsZXZlbCBhaGVhZCBqdXN0IHRvIGtub3cgd2hpY2ggbm9kZXMgYXJlIGV4cGFuZGFibGUuXG4gIEBJbnB1dCgnY2xyRXhwYW5kYWJsZScpIGV4cGFuZGFibGU6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgQE91dHB1dCgnY2xyU2VsZWN0ZWRDaGFuZ2UnKSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2xyU2VsZWN0ZWRTdGF0ZT4oZmFsc2UpO1xuICBAT3V0cHV0KCdjbHJFeHBhbmRlZENoYW5nZScpIGV4cGFuZGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIFNUQVRFUyA9IENsclNlbGVjdGVkU3RhdGU7XG4gIGlzTW9kZWxMb2FkaW5nID0gZmFsc2U7XG4gIG5vZGVJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuICBjb250ZW50Q29udGFpbmVyVGFiaW5kZXggPSAtMTtcbiAgX21vZGVsOiBUcmVlTm9kZU1vZGVsPFQ+O1xuXG4gIHByaXZhdGUgc2tpcEVtaXRDaGFuZ2UgPSBmYWxzZTtcbiAgcHJpdmF0ZSB0eXBlQWhlYWRLZXlCdWZmZXIgPSAnJztcbiAgcHJpdmF0ZSB0eXBlQWhlYWRLZXlFdmVudCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnRDb250YWluZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIGNvbnRlbnRDb250YWluZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8vIEBDb250ZW50Q2hpbGQgd291bGQgaGF2ZSBiZWVuIG1vcmUgc3VjY2luY3RcbiAgLy8gYnV0IGl0IGRvZXNuJ3Qgb2ZmZXIgYSB3YXkgdG8gcXVlcnkgb25seSBhbiBpbW1lZGlhdGUgY2hpbGRcbiAgQENvbnRlbnRDaGlsZHJlbihDbHJUcmVlTm9kZUxpbmssIHsgZGVzY2VuZGFudHM6IGZhbHNlIH0pIHByaXZhdGUgdHJlZU5vZGVMaW5rTGlzdDogUXVlcnlMaXN0PENsclRyZWVOb2RlTGluaz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQE9wdGlvbmFsKClcbiAgICBAU2tpcFNlbGYoKVxuICAgIHBhcmVudDogQ2xyVHJlZU5vZGU8VD4sXG4gICAgcHVibGljIGZlYXR1cmVzU2VydmljZTogVHJlZUZlYXR1cmVzU2VydmljZTxUPixcbiAgICBwdWJsaWMgZXhwYW5kU2VydmljZTogSWZFeHBhbmRTZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGZvY3VzTWFuYWdlcjogVHJlZUZvY3VzTWFuYWdlclNlcnZpY2U8VD4sXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgaWYgKGZlYXR1cmVzU2VydmljZS5yZWN1cnNpb24pIHtcbiAgICAgIC8vIEknbSBjb21wbGV0ZWx5IHN0dWNrLCB3ZSBoYXZlIHRvIGhhY2sgaW50byBwcml2YXRlIHByb3BlcnRpZXMgdW50aWwgZWl0aGVyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDkzNSBvciBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNTk5OFxuICAgICAgLy8gYXJlIGZpeGVkXG4gICAgICAvLyBUaGlzIGlzIGZvciBub24taXZ5IGltcGxlbWVudGF0aW9uc1xuICAgICAgaWYgKChpbmplY3RvciBhcyBhbnkpLnZpZXcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSAoaW5qZWN0b3IgYXMgYW55KS52aWV3LmNvbnRleHQuY2xyTW9kZWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJdnkgcHV0cyB0aGlzIG9uIGEgc3BlY2lmaWMgaW5kZXggb2YgYSBfbFZpZXcgcHJvcGVydHlcbiAgICAgICAgdGhpcy5fbW9kZWwgPSAoaW5qZWN0b3IgYXMgYW55KS5fbFZpZXdbTFZJRVdfQ09OVEVYVF9JTkRFWF0uY2xyTW9kZWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvcmNlIGNhc3QgZm9yIG5vdywgbm90IHN1cmUgaG93IHRvIHRpZSB0aGUgY29ycmVjdCB0eXBlIGhlcmUgdG8gZmVhdHVyZXNTZXJ2aWNlLnJlY3Vyc2lvblxuICAgICAgdGhpcy5fbW9kZWwgPSBuZXcgRGVjbGFyYXRpdmVUcmVlTm9kZU1vZGVsKHBhcmVudCA/IChwYXJlbnQuX21vZGVsIGFzIERlY2xhcmF0aXZlVHJlZU5vZGVNb2RlbDxUPikgOiBudWxsKTtcbiAgICB9XG4gICAgdGhpcy5fbW9kZWwubm9kZUlkID0gdGhpcy5ub2RlSWQ7XG4gIH1cblxuICBASW5wdXQoJ2NsckRpc2FibGVkJylcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbC5kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tb2RlbC5kaXNhYmxlZCA9IHZhbHVlO1xuICB9XG5cbiAgQElucHV0KCdjbHJTZWxlY3RlZCcpXG4gIGdldCBzZWxlY3RlZCgpOiBDbHJTZWxlY3RlZFN0YXRlIHwgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsLnNlbGVjdGVkLnZhbHVlO1xuICB9XG4gIHNldCBzZWxlY3RlZCh2YWx1ZTogQ2xyU2VsZWN0ZWRTdGF0ZSB8IGJvb2xlYW4pIHtcbiAgICB0aGlzLmZlYXR1cmVzU2VydmljZS5zZWxlY3RhYmxlID0gdHJ1ZTtcbiAgICAvLyBHcmFjZWZ1bGx5IGhhbmRsZSBmYWxzeSBzdGF0ZXMgbGlrZSBudWxsIG9yIHVuZGVmaW5lZCBiZWNhdXNlIGl0J3MganVzdCBlYXNpZXIgdGhhbiBhbnN3ZXJpbmcgcXVlc3Rpb25zLlxuICAgIC8vIFRoaXMgc2hvdWxkbid0IGhhcHBlbiB3aXRoIHN0cmljdCB0eXBpbmcgb24gdGhlIGFwcCdzIHNpZGUsIGJ1dCBpdCdzIG5vdCB1cCB0byB1cy5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsdWUgPSBDbHJTZWxlY3RlZFN0YXRlLlVOU0VMRUNURUQ7XG4gICAgfVxuICAgIC8vIFdlIG1hdGNoIGJvb2xlYW5zIHRvIHRoZSBjb3JyZXNwb25kaW5nIENsclNlbGVjdGVkU3RhdGVcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUgPyBDbHJTZWxlY3RlZFN0YXRlLlNFTEVDVEVEIDogQ2xyU2VsZWN0ZWRTdGF0ZS5VTlNFTEVDVEVEO1xuICAgIH1cbiAgICAvLyBXZSBwcm9wYWdhdGUgb25seSBpZiB0aGUgdHJlZSBpcyBpbiBzbWFydCBtb2RlLCBhbmQgc2tpcCBlbWl0dGluZyB0aGUgb3V0cHV0IHdoZW4gd2Ugc2V0IHRoZSBpbnB1dFxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdm13YXJlL2NsYXJpdHkvaXNzdWVzLzMwNzNcbiAgICB0aGlzLnNraXBFbWl0Q2hhbmdlID0gdHJ1ZTtcbiAgICB0aGlzLl9tb2RlbC5zZXRTZWxlY3RlZCh2YWx1ZSwgdGhpcy5mZWF0dXJlc1NlcnZpY2UuZWFnZXIsIHRoaXMuZmVhdHVyZXNTZXJ2aWNlLmVhZ2VyKTtcbiAgICB0aGlzLnNraXBFbWl0Q2hhbmdlID0gZmFsc2U7XG4gIH1cblxuICAvLyBJJ20gY2F2aW5nIG9uIHRoaXMsIGZvciB0cmVlIG5vZGVzIEkgdGhpbmsgd2UgY2FuIHRvbGVyYXRlIGhhdmluZyBhIHR3by13YXkgYmluZGluZyBvbiB0aGUgY29tcG9uZW50XG4gIC8vIHJhdGhlciB0aGFuIGVuZm9yY2UgdGhlIGNscklmRXhwYW5kZWQgc3RydWN0dXJhbCBkaXJlY3RpdmUgZm9yIGR5bmFtaWMgY2FzZXMuIE1vc3RseSBiZWNhdXNlIGZvciB0aGUgc21hcnRcbiAgLy8gY2FzZSwgeW91IGNhbid0IHVzZSBhIHN0cnVjdHVyYWwgZGlyZWN0aXZlLCBpdCB3b3VsZCBuZWVkIHRvIGdvIG9uIGFuIG5nLWNvbnRhaW5lci5cbiAgQElucHV0KCdjbHJFeHBhbmRlZCcpXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRTZXJ2aWNlLmV4cGFuZGVkO1xuICB9XG4gIHNldCBleHBhbmRlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZXhwYW5kU2VydmljZS5leHBhbmRlZCA9IHZhbHVlO1xuICB9XG5cbiAgQElucHV0KCdjbHJGb3JUeXBlQWhlYWQnKVxuICBzZXQgY2xyRm9yVHlwZUFoZWFkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tb2RlbC50ZXh0Q29udGVudCA9IHRyaW1BbmRMb3dlckNhc2UodmFsdWUgfHwgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQpO1xuICB9XG5cbiAgZ2V0IGFyaWFTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnNlbGVjdGVkLnZhbHVlID09PSBDbHJTZWxlY3RlZFN0YXRlLlNFTEVDVEVEO1xuICAgIH0gZWxzZSBpZiAodGhpcy50cmVlTm9kZUxpbms/LmFjdGl2ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0cmVlTm9kZUxpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJlZU5vZGVMaW5rTGlzdCAmJiB0aGlzLnRyZWVOb2RlTGlua0xpc3QuZmlyc3Q7XG4gIH1cblxuICBwcml2YXRlIGdldCBpc1BhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuY2hpbGRyZW4gJiYgdGhpcy5fbW9kZWwuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX21vZGVsLmV4cGFuZGVkID0gdGhpcy5leHBhbmRlZDtcbiAgICB0aGlzLl9tb2RlbC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLl9tb2RlbC5zZWxlY3RlZC5waXBlKGZpbHRlcigoKSA9PiAhdGhpcy5za2lwRW1pdENoYW5nZSkpLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmV4cGFuZFNlcnZpY2UuZXhwYW5kQ2hhbmdlLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgIHRoaXMuZXhwYW5kZWRDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX21vZGVsLmV4cGFuZGVkID0gdmFsdWU7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmZvY3VzTWFuYWdlci5mb2N1c1JlcXVlc3Quc3Vic2NyaWJlKG5vZGVJZCA9PiB7XG4gICAgICAgIGlmICh0aGlzLm5vZGVJZCA9PT0gbm9kZUlkKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c1RyZWVOb2RlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5mb2N1c01hbmFnZXIuZm9jdXNDaGFuZ2Uuc3Vic2NyaWJlKG5vZGVJZCA9PiB7XG4gICAgICAgIHRoaXMuY2hlY2tUYWJJbmRleChub2RlSWQpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLl9tb2RlbC5sb2FkaW5nJC5waXBlKGRlYm91bmNlVGltZSgwKSkuc3Vic2NyaWJlKGlzTG9hZGluZyA9PiAodGhpcy5pc01vZGVsTG9hZGluZyA9IGlzTG9hZGluZykpXG4gICAgKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMudHlwZUFoZWFkS2V5RXZlbnQucGlwZShkZWJvdW5jZVRpbWUoVFJFRV9UWVBFX0FIRUFEX1RJTUVPVVQpKS5zdWJzY3JpYmUoKGJ1ZmZlcmVkS2V5czogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZm9jdXNNYW5hZ2VyLmZvY3VzTm9kZVN0YXJ0c1dpdGgoYnVmZmVyZWRLZXlzLCB0aGlzLl9tb2RlbCk7XG4gICAgICAgIC8vIHJlc2V0IG9uY2UgYnVmZmVyZWRLZXlzIGFyZSB1c2VkXG4gICAgICAgIHRoaXMudHlwZUFoZWFkS2V5QnVmZmVyID0gJyc7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9tb2RlbC50ZXh0Q29udGVudCkge1xuICAgICAgdGhpcy5fbW9kZWwudGV4dENvbnRlbnQgPSB0cmltQW5kTG93ZXJDYXNlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9tb2RlbC5kZXN0cm95KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIGlzRXhwYW5kYWJsZSgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXhwYW5kYWJsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGU7XG4gICAgfVxuICAgIHJldHVybiAhIXRoaXMuZXhwYW5kU2VydmljZS5leHBhbmRhYmxlIHx8IHRoaXMuaXNQYXJlbnQ7XG4gIH1cblxuICBpc1NlbGVjdGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmVhdHVyZXNTZXJ2aWNlLnNlbGVjdGFibGU7XG4gIH1cblxuICBmb2N1c1RyZWVOb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gdGhpcy5jb250ZW50Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gY29udGFpbmVyRWwpIHtcbiAgICAgIHRoaXMuc2V0VGFiSW5kZXgoMCk7XG4gICAgICBjb250YWluZXJFbC5mb2N1cygpO1xuICAgICAgY29udGFpbmVyRWwuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ25lYXJlc3QnLCBpbmxpbmU6ICduZWFyZXN0JyB9KTtcbiAgICB9XG4gIH1cblxuICBicm9hZGNhc3RGb2N1c09uQ29udGFpbmVyKCkge1xuICAgIHRoaXMuZm9jdXNNYW5hZ2VyLmJyb2FkY2FzdEZvY3VzZWROb2RlKHRoaXMubm9kZUlkKTtcbiAgfVxuXG4gIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIC8vIFR3byByZWFzb25zIHRvIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvcjpcbiAgICAvLyAxLiB0byBwcmV2ZW50IHNjcm9sbGluZyBvbiBhcnJvdyBrZXlzXG4gICAgLy8gMi4gQXNzaXN0aXZlIFRlY2hub2xvZ3kgZm9jdXMgZGlmZmVycyBmcm9tIEtleWJvYXJkIGZvY3VzIGJlaGF2aW9yLlxuICAgIC8vICAgIEJ5IGRlZmF1bHQsIHByZXNzaW5nIGFycm93IGtleSBtYWtlcyBBVCBmb2N1cyBnbyBpbnRvIHRoZSBuZXN0ZWQgY29udGVudCBvZiB0aGUgaXRlbS5cbiAgICBwcmV2ZW50QXJyb3dLZXlTY3JvbGwoZXZlbnQpO1xuXG4gICAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLXByYWN0aWNlcy0xLjEvI2tleWJvYXJkLWludGVyYWN0aW9uLTIyXG4gICAgc3dpdGNoIChub3JtYWxpemVLZXkoZXZlbnQua2V5KSkge1xuICAgICAgY2FzZSBLZXlzLkFycm93VXA6XG4gICAgICAgIHRoaXMuZm9jdXNNYW5hZ2VyLmZvY3VzTm9kZUFib3ZlKHRoaXMuX21vZGVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleXMuQXJyb3dEb3duOlxuICAgICAgICB0aGlzLmZvY3VzTWFuYWdlci5mb2N1c05vZGVCZWxvdyh0aGlzLl9tb2RlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXlzLkFycm93UmlnaHQ6XG4gICAgICAgIHRoaXMuZXhwYW5kT3JGb2N1c0ZpcnN0Q2hpbGQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleXMuQXJyb3dMZWZ0OlxuICAgICAgICB0aGlzLmNvbGxhcHNlT3JGb2N1c1BhcmVudCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgS2V5cy5Ib21lOlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmZvY3VzTWFuYWdlci5mb2N1c0ZpcnN0VmlzaWJsZU5vZGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleXMuRW5kOlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmZvY3VzTWFuYWdlci5mb2N1c0xhc3RWaXNpYmxlTm9kZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgS2V5cy5FbnRlcjpcbiAgICAgICAgdGhpcy50b2dnbGVFeHBhbmRPclRyaWdnZXJEZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXlzLlNwYWNlOlxuICAgICAgY2FzZSBLZXlzLlNwYWNlYmFyOlxuICAgICAgICAvLyB0byBwcmV2ZW50IHNjcm9sbGluZyBvbiBzcGFjZSBrZXkgaW4gdGhpcyBzcGVjaWZpYyBjYXNlXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMudG9nZ2xlRXhwYW5kT3JUcmlnZ2VyRGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0aGlzLl9tb2RlbC50ZXh0Q29udGVudCAmJiBpc0tleUVpdGhlckxldHRlck9yTnVtYmVyKGV2ZW50KSkge1xuICAgICAgICAgIHRoaXMudHlwZUFoZWFkS2V5QnVmZmVyICs9IGV2ZW50LmtleTtcbiAgICAgICAgICB0aGlzLnR5cGVBaGVhZEtleUV2ZW50Lm5leHQodGhpcy50eXBlQWhlYWRLZXlCdWZmZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBpZiBub24tbGV0dGVyIGtleXMgYXJlIHByZXNzZWQsIGRvIHJlc2V0LlxuICAgIHRoaXMudHlwZUFoZWFkS2V5QnVmZmVyID0gJyc7XG4gIH1cblxuICBwcml2YXRlIHNldFRhYkluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLmNvbnRlbnRDb250YWluZXJUYWJpbmRleCA9IHZhbHVlO1xuICAgIHRoaXMuY29udGVudENvbnRhaW5lci5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCB2YWx1ZS50b1N0cmluZygpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tUYWJJbmRleChub2RlSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmIHRoaXMubm9kZUlkICE9PSBub2RlSWQgJiYgdGhpcy5jb250ZW50Q29udGFpbmVyVGFiaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnNldFRhYkluZGV4KC0xKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUV4cGFuZE9yVHJpZ2dlckRlZmF1bHQoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoKSAmJiAhdGhpcy5pc1NlbGVjdGFibGUoKSkge1xuICAgICAgdGhpcy5leHBhbmRTZXJ2aWNlLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJpZ2dlckRlZmF1bHRBY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4cGFuZE9yRm9jdXNGaXJzdENoaWxkKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgIC8vIGlmIHRoZSBub2RlIGlzIGFscmVhZHkgZXhwYW5kZWQgYW5kIGhhcyBjaGlsZHJlbiwgZm9jdXMgaXRzIHZlcnkgZmlyc3QgY2hpbGRcbiAgICAgIGlmICh0aGlzLmlzUGFyZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXNNYW5hZ2VyLmZvY3VzTm9kZUJlbG93KHRoaXMuX21vZGVsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2UgbXVzdCBjaGVjayBpZiB0aGUgbm9kZSBpcyBleHBhbmRhYmxlLCBpbiBvcmRlciB0byBzZXQgLmV4cGFuZGVkIHRvIHRydWUgZnJvbSBmYWxzZVxuICAgICAgLy8gYmVjYXVzZSB3ZSBzaG91bGRuJ3Qgc2V0IC5leHBhbmRlZCB0byB0cnVlIGlmIGl0J3Mgbm90IGV4cGFuZGFibGUgbm9kZVxuICAgICAgaWYgKHRoaXMuaXNFeHBhbmRhYmxlKCkpIHtcbiAgICAgICAgdGhpcy5leHBhbmRTZXJ2aWNlLmV4cGFuZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbGxhcHNlT3JGb2N1c1BhcmVudCgpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmV4cGFuZGVkKSB7XG4gICAgICB0aGlzLmV4cGFuZFNlcnZpY2UuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb2N1c01hbmFnZXIuZm9jdXNQYXJlbnQodGhpcy5fbW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlckRlZmF1bHRBY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudHJlZU5vZGVMaW5rKSB7XG4gICAgICB0aGlzLnRyZWVOb2RlTGluay5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGVTZWxlY3Rpb24odGhpcy5mZWF0dXJlc1NlcnZpY2UuZWFnZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0cmltQW5kTG93ZXJDYXNlKHZhbHVlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHZhbHVlLnRvTG9jYWxlTG93ZXJDYXNlKCkudHJpbSgpO1xufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXZcbiAgI2NvbnRlbnRDb250YWluZXJcbiAgcm9sZT1cInRyZWVpdGVtXCJcbiAgY2xhc3M9XCJjbHItdHJlZS1ub2RlLWNvbnRlbnQtY29udGFpbmVyXCJcbiAgdGFiaW5kZXg9XCItMVwiXG4gIFtjbGFzcy5jbHItZm9ybS1jb250cm9sLWRpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXNFeHBhbmRhYmxlKCkgPyBleHBhbmRlZCA6IG51bGxcIlxuICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cImFyaWFTZWxlY3RlZFwiXG4gIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCJcbiAgKGZvY3VzKT1cImJyb2FkY2FzdEZvY3VzT25Db250YWluZXIoKVwiXG4+XG4gIDxidXR0b25cbiAgICAqbmdJZj1cImlzRXhwYW5kYWJsZSgpICYmICFpc01vZGVsTG9hZGluZyAmJiAhZXhwYW5kU2VydmljZS5sb2FkaW5nXCJcbiAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgIHR5cGU9XCJidXR0b25cIlxuICAgIHRhYmluZGV4PVwiLTFcIlxuICAgIGNsYXNzPVwiY2xyLXRyZWVub2RlLWNhcmV0XCJcbiAgICAoY2xpY2spPVwiZXhwYW5kU2VydmljZS50b2dnbGUoKTtcIlxuICAgIChmb2N1cyk9XCJmb2N1c1RyZWVOb2RlKClcIlxuICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gID5cbiAgICA8Y2RzLWljb25cbiAgICAgIGNsYXNzPVwiY2xyLXRyZWVub2RlLWNhcmV0LWljb25cIlxuICAgICAgc2hhcGU9XCJhbmdsZVwiXG4gICAgICBbYXR0ci5kaXJlY3Rpb25dPVwiZXhwYW5kU2VydmljZS5leHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCdcIlxuICAgID48L2Nkcy1pY29uPlxuICA8L2J1dHRvbj5cbiAgPGRpdiBjbGFzcz1cImNsci10cmVlbm9kZS1zcGlubmVyLWNvbnRhaW5lclwiICpuZ0lmPVwiZXhwYW5kU2VydmljZS5sb2FkaW5nIHx8IGlzTW9kZWxMb2FkaW5nXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJjbHItdHJlZW5vZGUtc3Bpbm5lciBzcGlubmVyXCI+PC9zcGFuPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImNsci1jaGVja2JveC13cmFwcGVyIGNsci10cmVlbm9kZS1jaGVja2JveFwiICpuZ0lmPVwiZmVhdHVyZXNTZXJ2aWNlLnNlbGVjdGFibGVcIj5cbiAgICA8aW5wdXRcbiAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgW2lkXT1cIm5vZGVJZCArICctY2hlY2snXCJcbiAgICAgIGNsYXNzPVwiY2xyLWNoZWNrYm94XCJcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBbY2hlY2tlZF09XCJfbW9kZWwuc2VsZWN0ZWQudmFsdWUgPT09IFNUQVRFUy5TRUxFQ1RFRFwiXG4gICAgICBbaW5kZXRlcm1pbmF0ZV09XCJfbW9kZWwuc2VsZWN0ZWQudmFsdWUgPT09IFNUQVRFUy5JTkRFVEVSTUlOQVRFXCJcbiAgICAgIChjaGFuZ2UpPVwiX21vZGVsLnRvZ2dsZVNlbGVjdGlvbihmZWF0dXJlc1NlcnZpY2UuZWFnZXIpXCJcbiAgICAgIChmb2N1cyk9XCJmb2N1c1RyZWVOb2RlKClcIlxuICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgLz5cbiAgICA8bGFiZWwgW2Zvcl09XCJub2RlSWQgKyAnLWNoZWNrJ1wiIGNsYXNzPVwiY2xyLWNvbnRyb2wtbGFiZWxcIj5cbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwidHJlZW5vZGVDb250ZW50XCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9sYWJlbD5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJjbHItdHJlZW5vZGUtY29udGVudFwiIChtb3VzZXVwKT1cImZvY3VzVHJlZU5vZGUoKVwiICpuZ0lmPVwiIWZlYXR1cmVzU2VydmljZS5zZWxlY3RhYmxlXCI+XG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJ0cmVlbm9kZUNvbnRlbnRcIj48L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG5cbiAgPG5nLXRlbXBsYXRlICN0cmVlbm9kZUNvbnRlbnQ+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiICpuZ0lmPVwiZmVhdHVyZXNTZXJ2aWNlLnNlbGVjdGFibGUgfHwgYXJpYVNlbGVjdGVkXCI+XG4gICAgICA8c3Bhbj4ge3thcmlhU2VsZWN0ZWQgPyBjb21tb25TdHJpbmdzLmtleXMuc2VsZWN0ZWRUcmVlTm9kZSA6IGNvbW1vblN0cmluZ3Mua2V5cy51bnNlbGVjdGVkVHJlZU5vZGV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9uZy10ZW1wbGF0ZT5cbjwvZGl2PlxuPGRpdlxuICBjbGFzcz1cImNsci10cmVlbm9kZS1jaGlsZHJlblwiXG4gIFtAdG9nZ2xlQ2hpbGRyZW5BbmltXT1cImV4cGFuZFNlcnZpY2UuZXhwYW5kZWQgPyAnZXhwYW5kZWQnIDogJ2NvbGxhcHNlZCdcIlxuICBbYXR0ci5yb2xlXT1cImlzRXhwYW5kYWJsZSgpICYmICFmZWF0dXJlc1NlcnZpY2UucmVjdXJzaW9uID8gJ2dyb3VwJyA6IG51bGxcIlxuPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItdHJlZS1ub2RlXCI+PC9uZy1jb250ZW50PlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xySWZFeHBhbmRlZF1cIj48L25nLWNvbnRlbnQ+XG4gIDxjbHItcmVjdXJzaXZlLWNoaWxkcmVuIFtwYXJlbnRdPVwiX21vZGVsXCI+PC9jbHItcmVjdXJzaXZlLWNoaWxkcmVuPlxuPC9kaXY+XG4iXX0=