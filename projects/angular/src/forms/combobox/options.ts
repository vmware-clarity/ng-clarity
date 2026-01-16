/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ContentChildren,
  DOCUMENT,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MultiSelectComboboxModel } from './model/multi-select-combobox.model';
import { ClrOption } from './option';
import { ComboboxFocusHandler, OptionData } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';
import { ClrPopoverService } from '../../popover/common/providers/popover.service';
import { IF_ACTIVE_ID } from '../../utils/conditional/if-active.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';

let nbOptionsComponents = 0;

export const SELECT_ALL_ID = 'select-all-id';
export const SELECT_ALL_VALUE = 'SELECT_ALL';

@Component({
  selector: 'clr-options',
  template: `
    @if (optionSelectionService.loading) {
      <div class="clr-combobox-options-loading">
        <clr-spinner clrInline>
          {{ commonStrings.keys.loading }}
        </clr-spinner>
        <span class="clr-combobox-options-text">
          {{ searchText(optionSelectionService.currentInput) }}
        </span>
      </div>
    }

    @if (showSelectAllAction) {
      <div class="clr-combobox-select-all">
        <button
          #selectAllBtn
          type="button"
          tabindex="-1"
          class="btn btn-link clr-combobox-select-all-btn clr-combobox-option"
          [class.clr-focus]="isSelectAllFocused"
          (click)="toggleSelectAll($event)"
        >
          {{ allVisibleSelected ? commonStrings.keys.comboboxUnselectAll : commonStrings.keys.comboboxSelectAll }}
        </button>
      </div>
    }

    <!-- Rendered if data set is empty -->
    @if (emptyOptions) {
      <div [id]="noResultsElementId" role="option">
        <span class="clr-combobox-options-empty-text">
          {{ commonStrings.keys.comboboxNoResults }}
        </span>
      </div>
    }

    <!--Option Groups and Options will be projected here-->
    <ng-content></ng-content>
  `,
  providers: [{ provide: LoadingListener, useExisting: ClrOptions }],
  host: {
    '[class.clr-combobox-options]': 'true',
    '[class.clr-combobox-options-multi]': 'optionSelectionService.multiselectable',
    '[class.clr-combobox-options-hidden]': 'emptyOptions && editable',
    '[attr.role]': '"listbox"',
    '[id]': 'optionsId',
  },
  standalone: false,
})
export class ClrOptions<T> implements AfterViewInit, LoadingListener, OnDestroy {
  @Input('id') optionsId: string;

  loading = false;
  _items: QueryList<ClrOption<T>>;

  private subscriptions: Subscription[] = [];
  private _selectAllBtn: ElementRef;
  private _selectAllOption: OptionData<T>;

  constructor(
    public optionSelectionService: OptionSelectionService<T>,
    @Inject(IF_ACTIVE_ID) public id: number,
    public el: ElementRef<HTMLElement>,
    public commonStrings: ClrCommonStringsService,
    private focusHandler: ComboboxFocusHandler<T>,
    private popoverService: ClrPopoverService,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: any
  ) {
    if (!parentHost) {
      throw new Error('clr-options should only be used inside of a clr-combobox');
    }

    if (!this.optionsId) {
      this.optionsId = 'clr-options-' + nbOptionsComponents++;
    }
  }

  @ViewChild('selectAllBtn')
  set selectAllBtn(value: ElementRef) {
    this._selectAllBtn = value;
    this._selectAllOption = new OptionData<T>(SELECT_ALL_ID, { __action: SELECT_ALL_VALUE } as any);
    this._selectAllOption.el = value?.nativeElement;
    this.updateFocusableItems();
  }

  @ContentChildren(ClrOption, { descendants: true })
  get items(): QueryList<ClrOption<T>> {
    return this._items;
  }
  set items(items: QueryList<ClrOption<T>>) {
    this._items = items;
    this.updateFocusableItems();
  }

  /**
   * Tests if the list of options is empty, meaning it doesn't contain any items
   */
  get emptyOptions() {
    return !this.optionSelectionService.loading && this.items.length === 0;
  }

  get editable() {
    return this.optionSelectionService.editable;
  }

  get noResultsElementId() {
    return `${this.optionsId}-no-results`;
  }

  get showSelectAllAction(): boolean {
    return this.optionSelectionService.multiselectable && !this.optionSelectionService.loading && this.items.length > 0;
  }

  get allVisibleSelected(): boolean {
    if ((!this.optionSelectionService.multiselectable && !this.items) || (this.items && this.items.length === 0)) {
      return false;
    }
    return (
      this.items.length === (this.optionSelectionService.selectionModel as MultiSelectComboboxModel<T>).model?.length
    );
  }

  get isSelectAllFocused() {
    return this.focusHandler.pseudoFocus.model?.id === SELECT_ALL_ID;
  }

  toggleSelectAll(event = null) {
    if (event) {
      event.stopPropagation();
      this.focusHandler.focusInput();
    }
    const visibleValues = this.items.map(option => option.value);

    if (this.allVisibleSelected) {
      this.optionSelectionService.unselectMany(visibleValues);
    } else {
      this.optionSelectionService.selectMany(visibleValues);
    }
  }

  ngAfterViewInit() {
    this.focusHandler.listbox = this.el.nativeElement;

    this.subscriptions.push(
      this.items.changes.subscribe(items => {
        if (items.length) {
          setTimeout(() => {
            this.focusHandler.focusFirstActive();
          });
        } else {
          this.focusHandler.pseudoFocus.pop();
        }
      }),
      this.optionSelectionService.selectAllRequested.subscribe(() => {
        this.toggleSelectAll();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  searchText(input: string) {
    return this.commonStrings.parse(this.commonStrings.keys.comboboxSearching, { INPUT: input });
  }

  loadingStateChange(state: ClrLoadingState): void {
    this.loading = state === ClrLoadingState.LOADING;
  }

  private updateFocusableItems() {
    const focusList: OptionData<T>[] = [];

    if (this._selectAllBtn) {
      focusList.push(this._selectAllOption);
    }

    if (this._items) {
      const itemOptions = this._items.map(option => option.optionProxy);
      focusList.push(...itemOptions);
    }

    this.focusHandler.addOptionValues(focusList);
  }
}
