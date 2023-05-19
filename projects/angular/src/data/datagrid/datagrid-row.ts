/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, ReplaySubject, Subscription } from 'rxjs';

import { ClrExpandableAnimation } from '../../utils/animations/expandable-animation/expandable-animation';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { DetailService } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { WrappedRow } from './wrapped-row';

let nbRow = 0;

@Component({
  selector: 'clr-dg-row',
  templateUrl: './datagrid-row.html',
  host: {
    '[class.datagrid-row]': 'true',
    '[class.datagrid-selected]': 'selected',
    '[attr.aria-owns]': 'id',
    role: 'rowgroup',
  },
  providers: [
    DatagridIfExpandService,
    { provide: IfExpandService, useExisting: DatagridIfExpandService },
    { provide: LoadingListener, useExisting: DatagridIfExpandService },
  ],
})
export class ClrDatagridRow<T = any> implements AfterContentInit, AfterViewInit {
  id: string;
  radioId: string;
  checkboxId: string;
  expandableId: string;

  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  @ViewChild(ClrExpandableAnimation) expandAnimation: ClrExpandableAnimation;

  private _item: T;
  /**
   * Model of the row, to use for selection
   */
  @Input('clrDgItem')
  get item(): T {
    return this._item;
  }
  set item(item: T) {
    this._item = item;
    this.itemChanges.next(item);
    this.clrDgSelectable = this._selectable;
  }

  /**
   * @internal
   */
  itemChanges = new ReplaySubject<T>(1);

  replaced: boolean;

  expandAnimationTrigger = false;

  /**
   * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
   * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
   * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
   * selection browser functionality, which is inconsistently implemented in browsers anyway.
   */
  clearRanges(event: MouseEvent) {
    if (event.shiftKey) {
      this.document.getSelection().removeAllRanges();
      // Firefox is too persistent about its text-selection behaviour. So we need to add a preventDefault();
      // We should not try to enforce this on the other browsers, though, because their toggle cycle does not get canceled by
      // the preventDefault() and they toggle the checkbox second time, effectively retrurning it to not-selected.
      if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
        event.preventDefault();
        this.toggle(true);
      }
    }
  }

  constructor(
    public selection: Selection<T>,
    public rowActionService: RowActionService,
    public globalExpandable: ExpandableRowsCount,
    public expand: DatagridIfExpandService,
    public detailService: DetailService,
    private displayMode: DisplayModeService,
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private el: ElementRef,
    public commonStrings: ClrCommonStringsService,
    private items: Items,
    @Inject(DOCUMENT) private document: any
  ) {
    nbRow++;
    this.id = 'clr-dg-row' + nbRow;
    this.radioId = 'clr-dg-row-rd' + nbRow;
    this.checkboxId = 'clr-dg-row-cb' + nbRow;
    this.expandableId = expand.expandableId;

    this.subscriptions.push(
      combineLatest(this.expand.replace, this.expand.expandChange).subscribe(
        ([expandReplaceValue, expandChangeValue]) => {
          if (expandReplaceValue && expandChangeValue) {
            // replaced and expanding
            this.replaced = true;
            this.renderer.addClass(this.el.nativeElement, 'datagrid-row-replaced');
          } else {
            this.replaced = false;
            // Handles these cases: not replaced and collapsing & replaced and
            // collapsing and not replaced and expanding.
            this.renderer.removeClass(this.el.nativeElement, 'datagrid-row-replaced');
          }
        }
      )
    );
  }

  private _selected = false;
  /**
   * Indicates if the row is selected
   */
  @Input('clrDgSelected')
  get selected() {
    if (this.selection.selectionType === SelectionType.None) {
      return this._selected;
    } else {
      return this.selection.isSelected(this.item);
    }
  }
  set selected(value: boolean | string) {
    if (this.selection.selectionType === SelectionType.None) {
      this._selected = value as boolean;
    } else {
      if (value && this.selection.selectionType === SelectionType.Multi) {
        this.rangeSelect();
      } else {
        this.selection.rangeStart = null;
      }
      this.selection.setSelected(this.item, value as boolean);
    }
  }

  // By default, every item is selectable; it becomes not selectable only if it's explicitly set to false
  private _selectable: boolean | string = true;
  @Input('clrDgSelectable')
  get clrDgSelectable() {
    return !this.selection.isLocked(this.item);
  }
  set clrDgSelectable(value: boolean | string) {
    if (this.item) {
      this.selection.lockItem(this.item, value === 'false' || value === false);
    }
    // Store this value locally, to be initialized when item is initialized
    this._selectable = value;
  }

  @Output('clrDgSelectedChange') selectedChanged = new EventEmitter<boolean>(false);

  toggle(selected = !this.selected) {
    if (selected !== this.selected) {
      this.selected = selected;
      this.selectedChanged.emit(selected);
    }
  }

  /**
   * @deprecated related to clrDgRowSelection, which is deprecated
   */
  selectRow(selected = !this.selected, $event) {
    // The label also captures clicks that bubble up to the row event listener, causing
    // this handler to run twice. This exits early to prevent toggling the checkbox twice.
    if ($event.target.tagName === 'LABEL') {
      return;
    }
    if (this.selection.selectionType === this.SELECTION_TYPE.Single) {
      this.selection.currentSingle = this.item;
    } else {
      this.toggle(selected);
    }
  }

  @Input('clrDgExpanded')
  get expanded() {
    return this.expand.expanded;
  }
  set expanded(value: boolean | string) {
    this.expand.expanded = value as boolean;
  }

  @Output('clrDgExpandedChange') expandedChange = new EventEmitter<boolean>(false);

  toggleExpand() {
    if (this.expand.expandable) {
      this.expandAnimation.updateStartHeight();
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    }
  }

  @ViewChild('detailButton') detailButton: ElementRef;

  private _detailOpenLabel = '';
  @Input()
  get clrDgDetailOpenLabel(): string {
    return this._detailOpenLabel ? this._detailOpenLabel : this.commonStrings.keys.open;
  }
  set clrDgDetailOpenLabel(label: string) {
    this._detailOpenLabel = label;
  }
  private _detailCloseLabel = '';
  @Input()
  get clrDgDetailCloseLabel(): string {
    return this._detailCloseLabel ? this._detailCloseLabel : this.commonStrings.keys.close;
  }
  set clrDgDetailCloseLabel(label: string) {
    this._detailCloseLabel = label;
  }

  private _rowAriaLabel = '';
  // CDE-151: Rename this field to clrDgRowSelectionLabel in v16
  @Input()
  get clrDgRowAriaLabel(): string {
    return this._rowAriaLabel ? this._rowAriaLabel : this.commonStrings.keys.select;
  }
  set clrDgRowAriaLabel(label: string) {
    this._rowAriaLabel = label;
  }

  /*****
   * property dgCells
   *
   * @description
   * A Query List of the ClrDatagrid cells in this row.
   *
   */
  @ContentChildren(ClrDatagridCell) dgCells: QueryList<ClrDatagridCell>;

  ngAfterContentInit() {
    this.dgCells.changes.subscribe(() => {
      this.dgCells.forEach(cell => {
        if (!cell._view.destroyed) {
          this._scrollableCells.insert(cell._view);
        }
      });
    });
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.displayMode.view.subscribe(viewChange => {
        // Listen for view changes and move cells around depending on the current displayType
        // remove cell views from display view
        for (let i = this._scrollableCells.length; i > 0; i--) {
          this._scrollableCells.detach();
        }
        // remove cell views from calculated view
        for (let i = this._calculatedCells.length; i > 0; i--) {
          this._calculatedCells.detach();
        }
        if (viewChange === DatagridDisplayMode.CALCULATE) {
          this.displayCells = false;
          this.dgCells.forEach(cell => {
            if (!cell._view.destroyed) {
              this._calculatedCells.insert(cell._view);
            }
          });
        } else {
          this.displayCells = true;
          this.dgCells.forEach(cell => {
            if (!cell._view.destroyed) {
              this._scrollableCells.insert(cell._view);
            }
          });
        }
      }),
      this.expand.animate.subscribe(() => {
        this.expandAnimationTrigger = !this.expandAnimationTrigger;
      })
    );
  }

  private rangeSelect() {
    const items = this.items.displayed;
    if (!items) {
      return;
    }
    const startIx = items.indexOf(this.selection.rangeStart);
    if (
      this.selection.rangeStart &&
      this.selection.current.includes(this.selection.rangeStart) &&
      this.selection.shiftPressed &&
      startIx !== -1
    ) {
      const endIx = items.indexOf(this.item);
      // Using Set to remove duplicates
      const newSelection = new Set(
        this.selection.current.concat(items.slice(Math.min(startIx, endIx), Math.max(startIx, endIx) + 1))
      );
      this.selection.clearSelection();
      this.selection.current.push(...newSelection);
    } else {
      // page number has changed or
      // no Shift was pressed or
      // rangeStart not yet set
      this.selection.rangeStart = this.item;
    }
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  displayCells = false;

  @ViewChild('stickyCells', { read: ViewContainerRef })
  _stickyCells: ViewContainerRef;
  @ViewChild('scrollableCells', { read: ViewContainerRef })
  _scrollableCells: ViewContainerRef;
  @ViewChild('calculatedCells', { read: ViewContainerRef })
  _calculatedCells: ViewContainerRef;

  private wrappedInjector: Injector;

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedRow, this.vcr);
    this.selection.lockItem(this.item, this.clrDgSelectable === false);
  }

  get _view() {
    return this.wrappedInjector.get(WrappedRow, this.vcr).rowView;
  }
}
