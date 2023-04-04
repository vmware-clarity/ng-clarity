/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { take } from 'rxjs/operators';

import { Keys } from '../../../utils/enums/keys.enum';
import { ArrowKeyDirection } from '../../../utils/focus/arrow-key-direction.enum';
import { customFocusableItemProvider } from '../../../utils/focus/focusable-item/custom-focusable-item-provider';
import { normalizeKey } from '../../../utils/focus/key-focus/util';
import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import { PseudoFocusModel } from '../model/pseudo-focus.model';
import { OptionSelectionService } from './option-selection.service';

@Injectable()
export class ComboboxFocusHandler<T> {
  constructor(
    rendererFactory: RendererFactory2,
    private toggleService: ClrPopoverToggleService,
    private selectionService: OptionSelectionService<T>,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.handleFocusSubscription();
    // Direct renderer injection can be problematic and leads to failing tests at least
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // We need a Change Detector from the related component, so we can update it on Blur
  // (which is needed because of Edge specific lifecycle mis-behavior)
  componentCdRef: ChangeDetectorRef;

  private renderer: Renderer2;

  private handleFocusSubscription() {
    this.toggleService.openChange.subscribe(open => {
      if (!open) {
        this.pseudoFocus.model = null;
      }
    });
  }

  private _trigger: HTMLElement;
  get trigger() {
    return this._trigger;
  }
  set trigger(el: HTMLElement) {
    this._trigger = el;
    this.addFocusOnBlurListener(el);
  }

  private _listbox: HTMLElement;
  get listbox() {
    return this._listbox;
  }
  set listbox(el: HTMLElement) {
    this._listbox = el;
    this.addFocusOnBlurListener(el);
  }

  pseudoFocus: PseudoFocusModel<OptionData<T>> = new PseudoFocusModel<OptionData<T>>();

  private _textInput: HTMLElement;
  get textInput() {
    return this._textInput;
  }
  set textInput(el: HTMLElement) {
    this._textInput = el;
    this.renderer.listen(el, 'keydown', event => !this.handleTextInput(event));
    this.addFocusOnBlurListener(el);
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
    this.scrollIntoSelectedModel();
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
    const key = normalizeKey(event.key);
    if (event) {
      switch (key) {
        case Keys.Enter:
          if (this.toggleService.open && this.pseudoFocus.model) {
            if (this.selectionService.multiselectable) {
              this.selectionService.toggle(this.pseudoFocus.model.value);
            } else {
              this.selectionService.select(this.pseudoFocus.model.value);
            }
            preventDefault = true;
          }
          break;
        case Keys.Space:
          if (!this.toggleService.open) {
            this.toggleService.open = true;
            preventDefault = true;
          }
          break;
        case Keys.ArrowUp:
          this.preventViewportScrolling(event);
          this.openAndMoveTo(ArrowKeyDirection.UP);
          preventDefault = true;
          break;
        case Keys.ArrowDown:
          this.preventViewportScrolling(event);
          this.openAndMoveTo(ArrowKeyDirection.DOWN);
          preventDefault = true;
          break;
        default:
          // Any other keypress
          if (
            event.key !== Keys.Tab &&
            !(this.selectionService.multiselectable && event.key === Keys.Backspace) &&
            !(event.key === Keys.Escape) &&
            !this.toggleService.open
          ) {
            this.toggleService.open = true;
          }
          break;
      }
    }
    return preventDefault;
  }

  private scrollIntoSelectedModel(behavior: ScrollBehavior = 'smooth') {
    if (this.pseudoFocus.model && this.pseudoFocus.model.el) {
      this.pseudoFocus.model.el.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
    }
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

  private addFocusOnBlurListener(el: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.listen(el, 'blur', event => {
        if (this.focusOutOfComponent(event)) {
          this.toggleService.open = false;
          // Workaround for popover close-on-outside-click timing issues in Edge browser
          if (this.componentCdRef) {
            this.componentCdRef.detectChanges();
          }
        }
      });
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
        if (activeProxy) {
          // active element is visible
          this.pseudoFocus.select(activeProxy);
        } else {
          // we have active element, but it's filtered out
          this.pseudoFocus.select(this.optionData[0]);
        }
        this.scrollIntoSelectedModel('auto');
      }
    }
  }

  private optionData: OptionData<T>[] = [];

  addOptionValues(options: OptionData<T>[]) {
    this.optionData = options;
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
