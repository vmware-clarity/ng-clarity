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
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { ClrOption } from './option';
import { ComboboxFocusHandler } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';
import { IF_ACTIVE_ID } from '../../utils/conditional/if-active.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';

let nbOptionsComponents = 0;

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

  constructor(
    public optionSelectionService: OptionSelectionService<T>,
    @Inject(IF_ACTIVE_ID) public id: number,
    private el: ElementRef<HTMLElement>,
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

  @ContentChildren(ClrOption, { descendants: true })
  get items(): QueryList<ClrOption<T>> {
    return this._items;
  }
  set items(items: QueryList<ClrOption<T>>) {
    this._items = items;
    this.focusHandler.addOptionValues(this._items.map(option => option.optionProxy));
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

  ngAfterViewInit() {
    this.focusHandler.listbox = this.el.nativeElement;

    this.subscriptions.push(
      fromEvent(this.document, 'scroll', { capture: true }).subscribe(event => {
        if (
          this.popoverService.open &&
          (event as Event).target !== this.el.nativeElement &&
          (event as Event).target !== this.focusHandler.textInput
        ) {
          this.popoverService.open = false;
        }
      }),
      this.items.changes.subscribe(items => {
        if (items.length) {
          setTimeout(() => {
            this.focusHandler.focusFirstActive();
          });
        } else {
          this.focusHandler.pseudoFocus.pop();
        }
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
}
