/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { EMPTY, fromEvent, Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { customFocusableItemProvider } from '../../../utils/focus/focusable-item/custom-focusable-item-provider';
import { UNIQUE_ID } from '../../../utils/id-generator/id-generator.service';
import { ArrowKeyDirection } from '../../../utils/focus/arrow-key-direction.enum';
import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import { OptionSelectionService } from './option-selection.service';
import { PseudoFocusModel } from '../model/pseudo-focus.model';
import { KeyCodes } from '../../../utils/enums/key-codes.enum';
import { keyValidator } from '../../../utils/focus/key-focus/util';

@Injectable()
export class ComboboxFocusHandler<T> implements OnDestroy {
  private destroy$ = new Subject<void>();

  /**
   * These subjects are used to emit elements when they are set within combobox components.
   * They might be set asynchronously whenever the change detection is run.
   * Having subject makes the code reactive and cancellable (e.g. event listeners will be
   * automatically removed and re-added through the `switchMap` below).
   */
  private trigger$ = new Subject<HTMLElement | null>();
  private listbox$ = new Subject<HTMLElement | null>();
  private textInput$ = new Subject<HTMLElement | null>();

  constructor(
    @Inject(UNIQUE_ID) public id: string,
    private toggleService: ClrPopoverToggleService,
    private selectionService: OptionSelectionService<T>,
    @Inject(PLATFORM_ID) private platformId: string,
    private ngZone: NgZone
  ) {
    this.initializeSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  // We need a Change Detector from the related component, so we can update it on Blur
  // (which is needed because of Edge specific lifecycle mis-behavior)
  componentCdRef: ChangeDetectorRef | null = null;

  private initializeSubscriptions(): void {
    this.toggleService.openChange.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (!open) {
        this.pseudoFocus.model = null;
      }
    });

    [this.trigger$, this.listbox$, this.textInput$].forEach(element$ => {
      element$
        .pipe(
          switchMap(element => (element ? this.addEventListenerOutsideAngular<FocusEvent>(element, 'blur') : EMPTY)),
          takeUntil(this.destroy$)
        )
        .subscribe((event: FocusEvent) => {
          if (this.focusOutOfComponent(event)) {
            // Note: the `blur` callback is called within the `<root>` zone, we re-enter the Angular zone
            // only when the condition is met.
            this.ngZone.run(() => {
              this.toggleService.open = false;
              // Workaround for popover close-on-outside-click timing issues in Edge browser
              this.componentCdRef?.detectChanges();
            });
          }
        });
    });

    this.textInput$
      .pipe(
        switchMap(textInput =>
          textInput ? this.addEventListenerOutsideAngular<KeyboardEvent>(textInput, 'keydown') : EMPTY
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        const preventDefault = this.handleTextInput(event);
        if (preventDefault) {
          event.preventDefault();
        }
      });
  }

  private _trigger: HTMLElement | null = null;
  get trigger() {
    return this._trigger;
  }
  set trigger(el: HTMLElement | null) {
    this._trigger = el;
    this.trigger$.next(el);
  }

  private _listbox: HTMLElement | null = null;
  get listbox() {
    return this._listbox;
  }
  set listbox(el: HTMLElement | null) {
    this._listbox = el;
    this.listbox$.next(el);
  }

  public pseudoFocus: PseudoFocusModel<OptionData<T>> = new PseudoFocusModel<OptionData<T>>();

  private _textInput: HTMLElement | null = null;
  get textInput() {
    return this._textInput;
  }
  set textInput(el: HTMLElement | null) {
    this._textInput = el;
    this.textInput$.next(el);
  }

  private moveFocusTo(direction: ArrowKeyDirection) {
    let index = this.optionData.findIndex(option => option.equals(this.pseudoFocus.model));
    if (direction === ArrowKeyDirection.UP) {
      if (index === -1 || index === 0) {
        index = this.optionData.length - 1;
      } else {
        index--;
      }
    } else if (direction === ArrowKeyDirection.DOWN) {
      if (index === -1 || index === this.optionData.length - 1) {
        index = 0;
      } else {
        index++;
      }
    }
    this.pseudoFocus.select(this.optionData[index]);
    if (this.pseudoFocus.model && this.pseudoFocus.model.el) {
      this.pseudoFocus.model.el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  private openAndMoveTo(direction: ArrowKeyDirection) {
    if (!this.toggleService.open) {
      this.toggleService.openChange.pipe(take(1)).subscribe(open => {
        if (open) {
          this.moveFocusTo(direction);
        }
      });
      this.toggleService.open = true;
    } else {
      this.moveFocusTo(direction);
    }
  }

  // this service is only interested in keys that may move the focus
  private handleTextInput(event: KeyboardEvent): boolean {
    let preventDefault = false;
    const key = keyValidator(event.key);
    if (event) {
      switch (key) {
        case KeyCodes.Enter:
          if (this.toggleService.open && this.pseudoFocus.model) {
            if (this.selectionService.multiselectable) {
              this.selectionService.toggle(this.pseudoFocus.model.value);
            } else {
              this.selectionService.select(this.pseudoFocus.model.value);
            }
            preventDefault = true;
          }
          break;
        case KeyCodes.Space:
          if (!this.toggleService.open) {
            this.toggleService.open = true;
            preventDefault = true;
          }
          break;
        case KeyCodes.ArrowUp:
          this.preventViewportScrolling(event);
          this.openAndMoveTo(ArrowKeyDirection.UP);
          preventDefault = true;
          break;
        case KeyCodes.ArrowDown:
          this.preventViewportScrolling(event);
          this.openAndMoveTo(ArrowKeyDirection.DOWN);
          preventDefault = true;
          break;
        default:
          // Any other keypress
          if (
            event.key !== KeyCodes.Tab &&
            !(this.selectionService.multiselectable && event.key === KeyCodes.Backspace) &&
            !(event.key === KeyCodes.Escape) &&
            !this.toggleService.open
          ) {
            this.toggleService.open = true;
          }
          break;
      }
    }
    return preventDefault;
  }

  private preventViewportScrolling(event: KeyboardEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  focusInput() {
    if (this.textInput && isPlatformBrowser(this.platformId)) {
      this.textInput.focus();
    }
  }

  private focusOutOfComponent(event: FocusEvent): boolean {
    // event.relatedTarget is null in IE11. In that case we use document.activeElement
    // which points to the element that becomes active as the blur event occurs on the input.
    const target = (event.relatedTarget || document.activeElement) as Node;
    return !(this.textInput.contains(target) || this.trigger.contains(target) || this.listbox.contains(target));
  }

  focusFirstActive() {
    if (this.optionData.length > 0) {
      if (this.selectionService.selectionModel.isEmpty()) {
        this.pseudoFocus.select(this.optionData[0]);
      } else {
        let firstActive: T;
        if (this.selectionService.multiselectable) {
          firstActive = (this.selectionService.selectionModel.model as T[])[0];
        } else {
          firstActive = this.selectionService.selectionModel.model as T;
        }
        const activeProxy = this.optionData.find(option => option.value === firstActive);
        this.pseudoFocus.select(activeProxy);
      }
    }
  }

  private optionData: OptionData<T>[] = [];

  addOptionValues(options: OptionData<T>[]) {
    this.optionData = options;
  }

  private addEventListenerOutsideAngular<T extends Event>(element: HTMLElement, eventName: string): Observable<T> {
    return new Observable<T>(subscriber =>
      this.ngZone.runOutsideAngular(() => fromEvent(element, eventName).subscribe(subscriber))
    );
  }
}

export const COMBOBOX_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(ComboboxFocusHandler);

export class OptionData<T> {
  id: string;
  el: HTMLElement;
  value: T;
  constructor(id: string, value: T) {
    this.id = id;
    this.value = value;
  }
  equals(other: OptionData<T>): boolean {
    if (!other) {
      return false;
    }
    return this.id === other.id && this.value === other.value;
  }
}
