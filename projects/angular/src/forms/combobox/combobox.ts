/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  Input,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  Self,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { ClrComboboxContainer } from './combobox-container';
import { ComboboxModel } from './model/combobox.model';
import { MultiSelectComboboxModel } from './model/multi-select-combobox.model';
import { SingleSelectComboboxModel } from './model/single-select-combobox.model';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';
import { ComboboxContainerService } from './providers/combobox-container.service';
import { COMBOBOX_FOCUS_HANDLER_PROVIDER, ComboboxFocusHandler } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { ClrPopoverHostDirective, ClrPopoverService } from '../../popover';
import { ClrPopoverPosition, ClrPopoverType } from '../../popover/common/utils/popover-positions';
import { IF_ACTIVE_ID_PROVIDER } from '../../utils/conditional/if-active.service';
import { Keys } from '../../utils/enums/keys.enum';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { WrappedFormControl } from '../common/wrapped-control';

@Component({
  selector: 'clr-combobox',
  templateUrl: './combobox.html',
  providers: [
    OptionSelectionService,
    { provide: LoadingListener, useExisting: ClrCombobox },
    IF_ACTIVE_ID_PROVIDER,
    FOCUS_SERVICE_PROVIDER,
    COMBOBOX_FOCUS_HANDLER_PROVIDER,
  ],
  hostDirectives: [ClrPopoverHostDirective],
  host: {
    '[class.aria-required]': 'true',
    '[class.clr-combobox]': 'true',
    '[class.clr-combobox-disabled]': 'control?.disabled',
  },
  standalone: false,
})
export class ClrCombobox<T>
  extends WrappedFormControl<ClrComboboxContainer>
  implements ControlValueAccessor, LoadingListener, AfterContentInit
{
  @Input('placeholder') placeholder = '';

  @Output('clrInputChange') clrInputChange = new EventEmitter<string>(false);
  @Output('clrOpenChange') clrOpenChange = this.popoverService.openChange;

  /**
   * This output should be used to set up a live region using aria-live and populate it with updates that reflect each combobox change.
   */
  @Output('clrSelectionChange') clrSelectionChange = this.optionSelectionService.selectionChanged;

  @ViewChild('textboxInput') textbox: ElementRef<HTMLInputElement>;
  @ViewChild('trigger') trigger: ElementRef<HTMLButtonElement>;
  @ContentChild(ClrOptionSelected) optionSelected: ClrOptionSelected<T>;

  focused = false;

  popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;

  protected override index = 1;

  protected popoverType = ClrPopoverType.DROPDOWN;

  @ContentChild(ClrOptions) private options: ClrOptions<T>;

  private _searchText = '';
  private onTouchedCallback: () => any;
  private onChangeCallback: (model: T | T[]) => any;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    public control: NgControl,
    protected override renderer: Renderer2,
    protected override el: ElementRef<HTMLElement>,
    public optionSelectionService: OptionSelectionService<T>,
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    @Optional() private containerService: ComboboxContainerService,
    @Inject(PLATFORM_ID) private platformId: any,
    private focusHandler: ComboboxFocusHandler<T>,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(forwardRef(() => ClrComboboxContainer)) protected container: ClrComboboxContainer
  ) {
    super(vcr, ClrComboboxContainer, injector, control, renderer, el);
    if (control) {
      control.valueAccessor = this;
    }

    // default to SingleSelectComboboxModel, in case the optional input [ClrMulti] isn't used
    optionSelectionService.selectionModel = new SingleSelectComboboxModel<T>();
    this.updateControlValue();
  }

  @Input('clrEditable')
  get editable() {
    return this.optionSelectionService.editable;
  }
  set editable(value: boolean) {
    this.optionSelectionService.editable = value;
  }

  @Input('clrMulti')
  get multiSelect() {
    return this.optionSelectionService.multiselectable;
  }
  set multiSelect(value: boolean | string) {
    if (value) {
      this.optionSelectionService.selectionModel = new MultiSelectComboboxModel<T>();
    } else {
      // in theory, setting this again should not cause errors even though we already set it in constructor,
      // since the initial call to writeValue (caused by [ngModel] input) should happen after this
      this.optionSelectionService.selectionModel = new SingleSelectComboboxModel<T>();
    }
    this.updateControlValue();
  }

  // Override the id of WrappedFormControl, as we want to move it to the embedded input.
  // Otherwise, the label/component connection does not work and screen readers do not read the label.
  override get id() {
    return this.controlIdService.id + '-combobox';
  }
  override set id(id: string) {
    super.id = id;
  }

  get searchText(): string {
    return this._searchText;
  }
  set searchText(text: string) {
    // if input text has changed since last time, fire a change event so application can react to it
    if (text !== this._searchText) {
      if (this.popoverService.open) {
        this.optionSelectionService.showAllOptions = false;
      }
      this._searchText = text;
      this.clrInputChange.emit(this.searchText);
    }
    // We need to trigger this even if unchanged, so the option-items directive will update its list
    // based on the "showAllOptions" variable which may have changed in the openChange subscription below.
    // The option-items directive does not listen to openChange, but it listens to currentInput changes.
    this.optionSelectionService.currentInput = this.searchText;
  }

  get openState(): boolean {
    return this.popoverService.open;
  }

  get multiSelectModel(): T[] {
    if (!this.multiSelect) {
      throw Error('multiSelectModel is not available in single selection context');
    }
    return (this.optionSelectionService.selectionModel as MultiSelectComboboxModel<T>).model;
  }

  get ariaControls(): string {
    return this.options?.optionsId;
  }

  get ariaOwns(): string {
    return this.options?.optionsId;
  }

  get ariaDescribedBySelection(): string {
    return 'selection-' + this.id;
  }

  get displayField(): string {
    return this.optionSelectionService.displayField;
  }

  private get disabled() {
    return this.control?.disabled;
  }

  ngAfterContentInit() {
    this.initializeSubscriptions();

    // Initialize with preselected value
    if (!this.optionSelectionService.selectionModel.isEmpty()) {
      this.updateInputValue(this.optionSelectionService.selectionModel);
    }
  }

  ngAfterViewInit() {
    this.focusHandler.componentCdRef = this.cdr;
    this.focusHandler.textInput = this.textbox.nativeElement;
    this.focusHandler.trigger = this.trigger.nativeElement;
    // The text input is the actual element we are wrapping
    // This assignment is needed by the wrapper, so it can set
    // the aria properties on the input element, not on the component.
    this.el = this.textbox;
  }

  @HostListener('keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // if BACKSPACE in multiselect mode, delete the last pill if text is empty
    if (this.multiSelect) {
      const multiModel: T[] = this.optionSelectionService.selectionModel.model as T[];
      switch (event.key) {
        case Keys.Backspace:
          if (!this._searchText.length) {
            if (multiModel && multiModel.length > 0) {
              const lastItem: T = multiModel[multiModel.length - 1];
              this.control?.control.markAsTouched();
              this.optionSelectionService.unselect(lastItem);
            }
          }
          break;
        case Keys.Enter:
          if (this.editable && this._searchText.length > 0 && this.options.emptyOptions) {
            const parsedInput = this.optionSelectionService.parseStringToModel(this._searchText);
            this.control?.control.markAsTouched();
            this.optionSelectionService.select(parsedInput);
            this.searchText = '';
          }
          break;
      }
    }
  }

  inputId(): string {
    return this.controlIdService.id;
  }

  loadingStateChange(state: ClrLoadingState): void {
    this.optionSelectionService.loading = state === ClrLoadingState.LOADING;

    if (state !== ClrLoadingState.LOADING && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.popoverService?.resetPositions();
      });
      this.focusFirstActive();
    }
  }

  unselect(item: T) {
    if (!this.disabled) {
      this.optionSelectionService.unselect(item);
    }
  }

  onBlur(event) {
    if (!event.relatedTarget || !this.options.el?.nativeElement.contains(event.relatedTarget)) {
      this.onTouchedCallback?.();
      this.triggerValidation();
      this.focused = false;
    }
  }

  onFocus() {
    this.focused = true;

    // fix for "expression changed" error when focus is returned to a combobox after a modal is closed
    // https://github.com/vmware-clarity/ng-clarity/issues/663
    this.cdr.detectChanges();
  }

  onChange() {
    if (this.editable && !this.multiSelect && this.options.emptyOptions) {
      const parsedInput = this.optionSelectionService.parseStringToModel(this._searchText);
      this.optionSelectionService.setSelectionValue(parsedInput);
    }
  }

  getSelectionAriaLabel() {
    if (this.containerService && this.containerService.labelText) {
      return `${this.containerService.labelText} ${this.commonStrings.keys.comboboxSelection}`;
    }
    return this.commonStrings.keys.comboboxSelection;
  }

  focusFirstActive() {
    setTimeout(() => {
      this.focusHandler.focusFirstActive();
    });
  }

  writeValue(value: T | T[]): void {
    this.optionSelectionService.selectionModel.model = value;
    this.updateInputValue(this.optionSelectionService.selectionModel);
  }

  registerOnTouched(onTouched: any): void {
    this.onTouchedCallback = onTouched;
  }

  registerOnChange(onChange: any): void {
    this.onChangeCallback = onChange;
  }

  getActiveDescendant() {
    const model = this.focusHandler.pseudoFocus.model;
    return model ? model.id : this.options?.noResultsElementId;
  }

  setDisabledState(): void {
    // do nothing
  }

  onWrapperClick(event) {
    if (this.disabled) {
      return;
    }
    this.focusHandler.focusInput();
    if (this.editable || (!this.editable && this.trigger.nativeElement.contains(event.target))) {
      this.popoverService.toggleWithEvent(event);
    }
  }

  private initializeSubscriptions(): void {
    this.subscriptions.push(
      this.optionSelectionService.selectionChanged.subscribe((newSelection: ComboboxModel<T>) => {
        this.updateInputValue(newSelection);
        if (!this.multiSelect && newSelection && !newSelection.isEmpty()) {
          this.popoverService.open = false;
        }
        this.updateControlValue();

        if (this.multiSelect) {
          setTimeout(() => {
            this.popoverService?.updatePosition();
          });
        }
      })
    );

    this.subscriptions.push(
      this.popoverService.openChange.subscribe(open => {
        if (this.editable && !this.multiSelect) {
          if (this.searchText) {
            this.optionSelectionService.showAllOptions = false;
            this.optionSelectionService.currentInput = this.searchText;
          }
          return;
        }
        if (open) {
          this.focusFirstActive();
        } else {
          this.optionSelectionService.showAllOptions = true;
        }
        if (this.multiSelect) {
          this.searchText = '';
        } else {
          this.searchText = this.getDisplayNames(this.optionSelectionService.selectionModel.model)[0] || '';
        }
      })
    );
  }

  private updateInputValue(model: ComboboxModel<T>) {
    if (!this.multiSelect) {
      this.searchText = model.model ? this.getDisplayNames(model.model)[0] : '';
      if (this.searchText) {
        this.optionSelectionService.currentInput = this.searchText;
      }
    }
  }

  private updateControlValue() {
    if (this.onChangeCallback) {
      this.onChangeCallback(this.optionSelectionService.selectionModel.model);
    }
  }

  private getDisplayNames(model: T | T[]) {
    if (this.displayField) {
      if (!Array.isArray(model)) {
        model = [model];
      }
      return model.map(item => (item ? (item as any)[this.displayField] : null));
    }
    return [this.optionSelectionService.selectionModel.model];
  }
}
