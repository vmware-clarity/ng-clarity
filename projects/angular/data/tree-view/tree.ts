/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { TreeNodeModel } from './models/tree-node.model';
import { TREE_FEATURES_PROVIDER, TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';

@Component({
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
})
export class ClrTree<T> implements AfterContentInit, OnDestroy {
  /**
   * Emits `true` when all nodes get expanded and `false` as soon as any node gets collapsed afterwards.
   */
  @Output('clrExpandAllChange') expandAllChange = new EventEmitter<boolean>();

  @ContentChildren(ClrTreeNode) private rootNodes: QueryList<ClrTreeNode<T>>;

  private rootModels: TreeNodeModel<T>[] = [];
  private subscriptions: Subscription[] = [];
  private _isMultiSelectable = false;

  constructor(
    public featuresService: TreeFeaturesService<T>,
    private focusManagerService: TreeFocusManagerService<T>,
    private renderer: Renderer2,
    private el: ElementRef<HTMLElement>,
    ngZone: NgZone
  ) {
    const subscription = ngZone.runOutsideAngular(() =>
      fromEvent(el.nativeElement, 'focusin').subscribe((event: FocusEvent) => {
        if (event.target === el.nativeElement) {
          // After discussing with the team, I've made it so that when the tree receives focus, the first visible node will be focused.
          // This will prevent from the page scrolling abruptly to the first selected node if it exist in a deeply nested tree.
          focusManagerService.focusFirstVisibleNode();
          // when the first child gets focus,
          // tree should no longer have tabindex of 0.
          renderer.removeAttribute(el.nativeElement, 'tabindex');
        }
      })
    );

    this.subscriptions.push(subscription);

    featuresService._onAllExpandedCleared = () => this.expandAllChange.emit(false);
  }

  @Input('clrLazy')
  set lazy(value: boolean) {
    this.featuresService.eager = !value;
  }

  /**
   * Two-way binding to expand or collapse every node of the tree at once, see `expandAll()`.
   */
  @Input('clrExpandAll')
  get allExpanded(): boolean {
    return this.featuresService.allExpanded;
  }
  set allExpanded(value: boolean) {
    value = !!value;
    if (value !== this.featuresService.allExpanded) {
      this.setAllExpanded(value);
    }
  }

  get isMultiSelectable() {
    return this._isMultiSelectable;
  }

  ngAfterContentInit() {
    this.setRootNodes();
    this.subscriptions.push(
      this.rootNodes.changes.subscribe(() => {
        this.setMultiSelectable();

        this.setRootNodes();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Expands every expandable node of the tree, without animation. Disabled nodes are left untouched.
   * Nodes added to the tree afterwards, including lazy-loaded children, come in expanded until any node gets collapsed.
   */
  expandAll() {
    this.setAllExpanded(true);
  }

  /**
   * Collapses every node of the tree, without animation. Disabled nodes are left untouched.
   */
  collapseAll() {
    this.setAllExpanded(false);
  }

  private setAllExpanded(expanded: boolean) {
    const changed = this.featuresService.allExpanded !== expanded;
    // Set before walking the tree, so that the collapsing nodes don't report the change themselves.
    this.featuresService.allExpanded = expanded;
    this.rootModels.forEach(model => model.setExpandedRecursive(expanded));
    if (changed) {
      this.expandAllChange.emit(expanded);
    }
  }

  private setMultiSelectable() {
    if (this.featuresService.selectable && this.rootNodes.length > 0) {
      this._isMultiSelectable = true;
      this.renderer.setAttribute(this.el.nativeElement, 'aria-multiselectable', 'true');
    } else {
      this._isMultiSelectable = false;
      this.renderer.removeAttribute(this.el.nativeElement, 'aria-multiselectable');
    }
  }

  private setRootNodes(): void {
    // if node has no parent, it's a root node
    // for recursive tree, this.rootNodes registers also nested children
    // so we have to use filter to extract the ones that are truly root nodes
    this.rootModels = this.rootNodes.map(node => node._model).filter(node => !node.parent);
    this.focusManagerService.rootNodeModels = this.rootModels;
  }
}
