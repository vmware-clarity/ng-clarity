/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChange,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { ElementResizeService } from '@clr/addons/a11y';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { debounce } from 'rxjs/operators';

import { ActionDefinition } from '../../shared/action/action-definition';

const resources = {
  dropdownToggleWidthInRem: 3, // '...' button occupies max dropdownToggleWidthInRem rems in width
  layoutChangesDebounceDuration: 10,
};

@Component({
  selector: 'appfx-datagrid-action-bar',
  standalone: false,
  templateUrl: 'datagrid-action-bar.component.html',
  styleUrls: ['datagrid-action-bar.component.scss'],
})
export class DatagridActionBarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChildren('actionBtn', { read: ElementRef }) queryActionBtnElementList: QueryList<ElementRef<HTMLButtonElement>>;
  @Input() actions: ActionDefinition[];

  @Input() btnLayout = 'flex';

  @Input() dropdownOrientation = 'bottom-left';

  @Output() invokeAction: EventEmitter<ActionDefinition> = new EventEmitter();

  readonly actionsSubject = new BehaviorSubject<ActionDefinition[]>([]);
  readonly actions$ = this.actionsSubject.asObservable();

  isDropdownOpened = false;

  #subscription: Subscription;

  private listOfWidths: number[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>,
    private elementResizeService: ElementResizeService
  ) {}

  ngOnInit(): void {
    this.updateLayout();
  }

  ngAfterViewInit(): void {
    const resize$ = this.elementResizeService.getResizeObservable(this.el.nativeElement as HTMLElement);

    this.#subscription = resize$
      .pipe(debounce(() => interval(resources.layoutChangesDebounceDuration)))
      .subscribe(() => this.updateLayout());

    this.updateLayout();
  }

  ngOnDestroy(): void {
    if (this.#subscription && !this.#subscription.closed) {
      this.#subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions'] && changes['actions'].currentValue) {
      if (this.isActionsIdsEqual(changes['actions'])) {
        this.restoreVisible(changes['actions'].previousValue as ActionDefinition[]);
      } else {
        // actions with different ids are treated as a new list of actions
        this.initActionsVisibility();
        // update the width of each action btn with the new one
        this.cdr.detectChanges();
        this.updateListOfWidths();
        this.updateLayout();
      }
    }
  }

  getDropdownActions(): ActionDefinition[] {
    return this.actions.filter((action: ActionDefinition) => !action.isVisible);
  }

  hasDropdownActions(): boolean {
    return this.getDropdownActions().length > 0;
  }

  onActionClick(action: ActionDefinition): void {
    if (action.enabled) {
      this.invokeAction.emit(action);
    }
  }

  /**
   * Derives the base root element size (REM) in pixels.
   */
  deriveBaseRootElementSize(): number {
    return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'), 10);
  }

  private isActionsIdsEqual(change: SimpleChange): boolean {
    if (!change.previousValue) {
      return false;
    }

    const a: ActionDefinition[] = change.currentValue;
    const b: ActionDefinition[] = change.previousValue;

    const aLength: number = a.length;
    const bLength: number = b.length;

    if (aLength !== bLength) {
      return false;
    }

    return (
      a.reduce(
        (length: number, aValue: ActionDefinition, i: number): number => (aValue.id === b[i].id ? length - 1 : length),
        aLength
      ) === 0
    );
  }

  private initActionsVisibility(): void {
    this.actions.forEach((action: ActionDefinition) => {
      if (action.isVisible !== false) {
        action.isVisible = true;
      }
    });
    this.actionsSubject.next(this.actions);
  }

  private restoreVisible(fromPrevious: ActionDefinition[]): void {
    if (fromPrevious.length !== this.actions.length) {
      return;
    }
    fromPrevious.forEach((action: ActionDefinition, i: number) => (this.actions[i].isVisible = action.isVisible));
    this.actionsSubject.next(this.actions);
  }

  private updateListOfWidths(): void {
    this.listOfWidths.length = 0;
    this.queryActionBtnElementList.forEach(btnElementRef =>
      this.listOfWidths.push(btnElementRef.nativeElement.offsetWidth)
    );
  }

  private updateLayout(): void {
    // If offset is 0, the element is not yet fully loaded, so no need to update the layout
    if (this.el.nativeElement.offsetWidth) {
      const dropdownToggleWidthInPx = this.deriveBaseRootElementSize() * resources.dropdownToggleWidthInRem;
      const maxWidth: number = this.el.nativeElement.offsetWidth - dropdownToggleWidthInPx;
      // choose which action button is within the dropdown or not
      let totalWidth = 0;
      this.listOfWidths.forEach((actionBtnWidth: number, i: number) => {
        totalWidth += actionBtnWidth;
        this.actions[i].isVisible = totalWidth < maxWidth;
      });
      // if the dropdown is opened while the browser window is resized then collapse the dropdown
      if (this.isDropdownOpened) {
        this.isDropdownOpened = false;
      }
      this.actionsSubject.next(this.actions);
    }
  }
}
