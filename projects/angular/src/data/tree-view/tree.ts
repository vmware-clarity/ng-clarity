/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { TREE_FEATURES_PROVIDER, TreeFeaturesService } from './tree-features.service';
import { TreeFocusManagerService } from './tree-focus-manager.service';
import { ClrTreeNode } from './tree-node';

@Component({
  selector: 'clr-tree',
  template: `
    <ng-content></ng-content>
    <clr-recursive-children
      *ngIf="featuresService.recursion"
      [children]="featuresService.recursion.root"
    ></clr-recursive-children>
  `,
  providers: [TREE_FEATURES_PROVIDER, TreeFocusManagerService],
  host: {
    tabindex: '0',
    '[attr.role]': '"tree"',
    '[attr.aria-multiselectable]': 'isMultiSelectable',
  },
})
export class ClrTree<T> implements AfterContentInit, OnDestroy {
  @ContentChildren(ClrTreeNode) private rootNodes: QueryList<ClrTreeNode<T>>;

  private subscriptions: Subscription[] = [];

  constructor(
    public featuresService: TreeFeaturesService<T>,
    private focusManagerService: TreeFocusManagerService<T>,
    { nativeElement }: ElementRef<HTMLElement>,
    renderer: Renderer2,
    ngZone: NgZone
  ) {
    const subscription = ngZone.runOutsideAngular(() =>
      fromEvent(nativeElement, 'focusin').subscribe((event: FocusEvent) => {
        if (event.target === nativeElement) {
          // After discussing with the team, I've made it so that when the tree receives focus, the first visible node will be focused.
          // This will prevent from the page scrolling abruptly to the first selected node if it exist in a deeply nested tree.
          this.focusManagerService.focusFirstVisibleNode();
          // when the first child gets focus,
          // tree should no longer have tabindex of 0.
          renderer.removeAttribute(nativeElement, 'tabindex');
        }
      })
    );

    this.subscriptions.push(subscription);
  }

  @Input('clrLazy')
  set lazy(value: boolean) {
    this.featuresService.eager = !value;
  }

  get isMultiSelectable() {
    return this.featuresService.selectable && this.rootNodes.length > 0;
  }

  ngAfterContentInit() {
    this.setRootNodes();
    this.subscriptions.push(
      this.rootNodes.changes.subscribe(() => {
        this.setRootNodes();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setRootNodes(): void {
    // if node has no parent, it's a root node
    // for recursive tree, this.rootNodes registers also nested children
    // so we have to use filter to extract the ones that are truly root nodes
    this.focusManagerService.rootNodeModels = this.rootNodes.map(node => node._model).filter(node => !node.parent);
  }
}
