/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { BehaviorSubject } from 'rxjs';

import { ClrSelectedState } from './selected-state.enum';

export abstract class TreeNodeModel<T> {
  nodeId: string;
  expanded: boolean;
  model: T | null;
  textContent: string;
  loading$ = new BehaviorSubject(false);
  selected = new BehaviorSubject(ClrSelectedState.UNSELECTED);

  /*
   * Values:
   *   0 -> unselected
   *   2 * children.length -> selected
   *   anything in between -> indeterminate
   */
  childSelectionCounter = 0;

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

  get disabled() {
    // when both parameters are undefined, double negative is needed to cast to false, otherwise will return undefined.
    return !!(this._disabled || this.parent?.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }

  get hasChildren() {
    return this.children && this.children.length > 0;
  }

  destroy() {
    // Just to be safe
    this.selected.complete();
  }

  // Propagate by default when eager, don't propagate in the lazy-loaded tree.
  setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean) {
    if (state === this.selected.value) {
      return;
    }
    const oldState = this.selected.value;
    this.selected.next(state);
    if (propagateDown && state !== ClrSelectedState.INDETERMINATE && this.children) {
      this.childSelectionCounter = 0;
      this.children.forEach(child => {
        if (!child.disabled) {
          if (state === ClrSelectedState.SELECTED) {
            this.childSelectionCounter += 2;
          }
          child.setSelected(state, false, true);
        }
      });
    }
    if (propagateUp && this.parent) {
      this.parent.setSelectionFromChild(this.selected.value, oldState);
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

  private setSelectionFromChild(newChildState: ClrSelectedState, oldChildState: ClrSelectedState) {
    /**
     * selected     + selected     => selected - stop
     * selected     + unselected   => calc
     * selected     + indeterminate => indeterminate
     * unselected   + selected     => calc
     * unselected   + unselected   => unselected - stop
     * unselected   + indeterminate => indeterminate
     * indeterminate + selected     => calc
     * indeterminate + unselected   => calc
     * indeterminate + indeterminate => indeterminate - stop
     *
     */

    if (this.selected.value === newChildState) {
      return;
    }

    const oldState = this.selected.value;

    /*
     * Between SELECTED and UNSELECTED - add or subtract 2
     * Between INDETERMINIATE and any other - add or subtract 1
     */
    if (newChildState === ClrSelectedState.SELECTED) {
      if (oldChildState === ClrSelectedState.INDETERMINATE) {
        this.childSelectionCounter++;
      } else if (oldChildState === ClrSelectedState.UNSELECTED) {
        this.childSelectionCounter += 2;
      }
    } else if (newChildState === ClrSelectedState.UNSELECTED) {
      if (oldChildState === ClrSelectedState.INDETERMINATE) {
        this.childSelectionCounter--;
      } else if (oldChildState === ClrSelectedState.SELECTED) {
        this.childSelectionCounter -= 2;
      }
    } else {
      // INDETERMINATE
      if (oldChildState === ClrSelectedState.SELECTED) {
        this.childSelectionCounter--;
      } else if (oldChildState === ClrSelectedState.UNSELECTED) {
        this.childSelectionCounter++;
      }
    }

    if (newChildState === ClrSelectedState.INDETERMINATE) {
      this.selected.next(ClrSelectedState.INDETERMINATE);
      this.parent?.setSelectionFromChild(ClrSelectedState.INDETERMINATE, oldState);
      return;
    }
    switch (this.childSelectionCounter) {
      case 0:
        if (this.selected.value !== ClrSelectedState.UNSELECTED) {
          this.selected.next(ClrSelectedState.UNSELECTED);
        }
        break;
      case 2 * this.children.length:
        if (this.selected.value !== ClrSelectedState.SELECTED) {
          this.selected.next(ClrSelectedState.SELECTED);
        }
        break;
      default:
        if (this.selected.value !== ClrSelectedState.INDETERMINATE) {
          this.selected.next(ClrSelectedState.INDETERMINATE);
        }
    }
    if (this.parent) {
      this.parent.setSelectionFromChild(this.selected.value, oldState);
    }
  }

  // private computeSelectionStateFromChildren() {
  //   let oneSelected = false;
  //   let oneUnselected = false;
  //   // Using a good old for loop to exit as soon as we can tell, for better performance on large trees.
  //   for (const child of this.children) {
  //     switch (child.selected.value) {
  //       case ClrSelectedState.INDETERMINATE:
  //         if (child.disabled) {
  //           continue;
  //         }
  //         return ClrSelectedState.INDETERMINATE;
  //       case ClrSelectedState.SELECTED:
  //         oneSelected = true;
  //         if (oneUnselected) {
  //           return ClrSelectedState.INDETERMINATE;
  //         }
  //         break;
  //       case ClrSelectedState.UNSELECTED:
  //       default:
  //         // Default is the same as unselected, in case an undefined somehow made it all the way here.
  //         oneUnselected = true;
  //         if (oneSelected) {
  //           return ClrSelectedState.INDETERMINATE;
  //         }
  //         break;
  //     }
  //   }
  //   if (!oneSelected) {
  //     return ClrSelectedState.UNSELECTED;
  //   } else if (!oneUnselected) {
  //     return ClrSelectedState.SELECTED;
  //   } else {
  //     return ClrSelectedState.UNSELECTED;
  //   }
  // }
}
