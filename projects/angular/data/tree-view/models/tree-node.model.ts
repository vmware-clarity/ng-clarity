/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject } from 'rxjs';

import type { ClrTreeNode } from '../tree-node';
import { ClrSelectedState } from './selected-state.enum';

export abstract class TreeNodeModel<T> {
  nodeId: string;
  expanded: boolean;
  /**
   * Whether this node and all of its descendants are expanded: `true` when they all are, `false` when none of
   * them are, and `null` when only some of them are, the same way selection reports an indeterminate state.
   * Descendants created afterwards (lazy-loaded children, dynamic nodes) come in expanded while this is `true`.
   */
  descendantsExpanded: boolean | null = false;
  /*
   * Internal, the node rendering this model. Bulk operations walk the model tree and need the node itself,
   * for its expandable state, its animation and its outputs.
   * Imported as a type only, so the models pull in nothing from the components at runtime.
   */
  node: ClrTreeNode<T> | null = null;
  model: T | null;
  textContent: string;
  loading$ = new BehaviorSubject(false);
  selected = new BehaviorSubject(ClrSelectedState.UNSELECTED);

  /*
   * Being able to push this down to the RecursiveTreeNodeModel would require too much work on the angular components
   * right now for them to know which kind of model they are using. So I'm lifting the public properties to this
   * abstract parent class for now and we can revisit it later, when we're not facing such a close deadline.
   */
  private _loading = false;
  private _disabled: boolean;

  /*
   * Ideally, I would like to use a polymorphic this type here to ensure homogeneity of the tree, something like:
   * abstract parent: this<T> | null;
   * abstract children: this<T>[];
   * But I'm hitting limitations on typescript not allowing that type in constructors or static methods.
   * So I'm resorting to forcing override with more precise types by marking these abstract.
   */
  abstract parent: TreeNodeModel<T> | null;
  abstract children: TreeNodeModel<T>[];

  get loading() {
    return this._loading;
  }
  set loading(isLoading: boolean) {
    this._loading = isLoading;
    this.loading$.next(isLoading);
  }

  /*
   * The children that are already known, without triggering a lazy fetch.
   */
  get loadedChildren(): TreeNodeModel<T>[] {
    return this.children;
  }

  get disabled() {
    // when both parameters are undefined, double negative is needed to cast to false, otherwise will return undefined.
    return !!(this._disabled || this.parent?.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }

  destroy() {
    this.node = null;
    // Just to be safe
    this.selected.complete();
  }

  /**
   * Expands or collapses this node and every descendant that is already known, and records the new state on
   * each of them. Disabled branches are left untouched and excluded, the same way selection excludes them.
   */
  setExpandedRecursive(expanded: boolean) {
    if (this.disabled) {
      return;
    }
    if (this.node) {
      this.node.setExpandedInBulk(expanded);
    }
    for (const child of this.loadedChildren) {
      child.setExpandedRecursive(expanded);
    }
    if (expanded !== this.descendantsExpanded) {
      this.descendantsExpanded = expanded;
      if (this.node) {
        this.node.onDescendantsExpandedChange(expanded);
      }
    }
  }

  /**
   * Whether this node, or one of its ancestors, expects all of its descendants to be expanded.
   */
  isInExpandedSubtree(): boolean {
    for (let current: TreeNodeModel<T> = this; current; current = current.parent) {
      if (current.descendantsExpanded) {
        return true;
      }
    }
    return false;
  }

  // Propagate by default when eager, don't propagate in the lazy-loaded tree.
  setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean) {
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

  toggleSelection(propagate: boolean) {
    if (this.disabled) {
      return;
    }

    // Both unselected and indeterminate toggle to selected
    const newState =
      this.selected.value === ClrSelectedState.SELECTED ? ClrSelectedState.UNSELECTED : ClrSelectedState.SELECTED;
    // NOTE: we always propagate selection up in this method because it is only called when the user takes an action.
    // It should never be called from lifecycle hooks or app-provided inputs.
    this.setSelected(newState, true, propagate);
  }

  /*
   * Internal, called when this node expands or collapses on its own. Any ancestor claiming the opposite for
   * its whole subtree is now only partly expanded, so it moves to the mixed state and reports it.
   */
  _markDescendantsMixed(expanded: boolean) {
    const contradicted = !expanded;
    for (let current: TreeNodeModel<T> = this; current; current = current.parent) {
      if (current.descendantsExpanded === contradicted) {
        current.descendantsExpanded = null;
        if (current.node) {
          current.node.onDescendantsExpandedChange(null);
        }
      }
    }
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

  private computeSelectionStateFromChildren() {
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
    } else if (!oneUnselected) {
      return ClrSelectedState.SELECTED;
    } else {
      return ClrSelectedState.UNSELECTED;
    }
  }
}
