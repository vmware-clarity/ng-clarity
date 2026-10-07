/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Host,
  HostListener,
  Inject,
  Injector,
  Input,
  NgZone,
  Optional,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  Self,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { WrappedFormControl } from '@clr/angular/forms/common';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import {
  CLR_CONTEXT_DEFAULT_MAX_ITEMS,
  CLR_CONTEXT_REDACT_SELECTOR,
  CLR_CONTEXT_WITHHELD_SELECTOR,
  ClrCommonStringsService,
  ClrContextSnapshotOptions,
  clrContextText,
  ClrElementContextCallback,
  ClrElementMutation,
  ClrLoadingState,
  clrNormalizeContextText,
  clrPublishElementContext,
  clrPublishElementMutator,
  clrUsableSelectors,
  FOCUS_SERVICE_PROVIDER,
  IF_ACTIVE_ID_PROVIDER,
  Keys,
  LoadingListener,
} from '@clr/angular/utils';
import { debounceTime, Subject } from 'rxjs';

import { ClrComboboxContainer } from './combobox-container';
import { ClrComboboxIdentityFunction, ClrComboboxResolverFunction, ComboboxModel } from './model/combobox.model';
import { MultiSelectComboboxModel } from './model/multi-select-combobox.model';
import { SingleSelectComboboxModel } from './model/single-select-combobox.model';
import { ClrOption } from './option';
import { ClrOptionItems } from './option-items.directive';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';
import { ComboboxContainerService } from './providers/combobox-container.service';
import { COMBOBOX_FOCUS_HANDLER_PROVIDER, ComboboxFocusHandler } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';

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

  @ViewChild('truncationButton') truncationButton: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  @ViewChildren('pill') calculationPills: QueryList<ElementRef<HTMLElement>>;

  focused = false;

  popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;

  protected override index = 1;

  protected popoverType = ClrPopoverType.DROPDOWN;

  protected containerWidth = null;
  protected selectionExpanded = false;
  protected calculatedLimit: number | undefined;
  protected shouldCalculate = true;
  protected isTotalSelection = false;

  private resizeObserver: ResizeObserver;
  private containerWidthChange = new Subject();
  @ContentChild(ClrOptions) private options: ClrOptions<T>;
  @ContentChild(ClrOptionItems) private optionItems: ClrOptionItems<T> | undefined;

  private teardownElementContext?: () => void;
  private teardownElementMutator?: () => void;

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
    private zone: NgZone,
    @Optional() @Host() private container: ClrComboboxContainer
  ) {
    super(vcr, ClrComboboxContainer, injector, control, renderer, el);
    if (control) {
      control.valueAccessor = this;
    }

    // default to SingleSelectComboboxModel, in case the optional input [ClrMulti] isn't used
    this.multiSelect = false;
  }

  @Input({ alias: 'showSelectAll', transform: booleanAttribute })
  get showSelectAll() {
    return this.optionSelectionService.showSelectAll;
  }
  set showSelectAll(value: boolean) {
    this.optionSelectionService.showSelectAll = value;
  }

  @Input('clrEditable')
  get editable() {
    return this.optionSelectionService.editable;
  }
  set editable(value: boolean) {
    this.optionSelectionService.editable = value;
  }

  @Input('clrEditableResolverFn')
  set editableResolver(value: ClrComboboxResolverFunction<T> | undefined) {
    this.optionSelectionService.editableResolver = value;
  }

  @Input('clrComboboxIdentityFn')
  set identityFn(value: ClrComboboxIdentityFunction<T>) {
    this.optionSelectionService.identityFn = value;
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
    this.optionSelectionService.selectionModel.identityFn = this.optionSelectionService.identityFn;
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

  get showAllText() {
    return this.commonStrings.parse(this.commonStrings.keys.comboboxShowAll, {
      ITEMS: this.multiSelectModel?.length.toString(),
    });
  }

  get allSelectedText() {
    return this.commonStrings.parse(this.commonStrings.keys.comboboxAllSelected, {
      ITEMS: this.multiSelectModel?.length.toString(),
    });
  }

  get showIndividualPills(): boolean {
    return !this.isTotalSelection || this.selectionExpanded;
  }

  get showTruncationToggle(): boolean {
    return (
      this.selectionExpanded ||
      this.isTotalSelection ||
      (this.calculatedLimit !== null && this.calculatedLimit < this.multiSelectModel.length)
    );
  }

  private get disabled() {
    return this.control?.disabled;
  }

  ngAfterContentInit() {
    this.initializeSubscriptions();
    this.publishContext(this.el.nativeElement);
    this.publishMutator(this.el.nativeElement);

    // Initialize with preselected value
    if (!this.optionSelectionService.selectionModel.isEmpty()) {
      this.updateInputValue(this.optionSelectionService.selectionModel);
    }
  }

  ngAfterViewInit() {
    this.focusHandler.textInput = this.textbox.nativeElement;
    this.focusHandler.trigger = this.trigger.nativeElement;
    // The text input is the actual element we are wrapping
    // This assignment is needed by the wrapper, so it can set
    // the aria properties on the input element, not on the component.

    // We calculate on the initial load to prevent flickering
    this.el = this.textbox;
    if (this.showSelectAll) {
      if (this.multiSelect && this.multiSelectModel?.length > 0) {
        this.calculateLimit();
      }
      this.initialiseObserver();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.teardownElementContext?.();
    this.teardownElementMutator?.();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  clearSelection() {
    this.focusHandler.focusInput();
    // Clear the array model directly
    this.optionSelectionService.setSelectionValue([]);
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
            const parsedInput = this.optionSelectionService.editableResolver(this._searchText);
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
      const parsedInput = this.optionSelectionService.editableResolver(this._searchText);
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

  toggleSelectionExpand() {
    this.selectionExpanded = !this.selectionExpanded;
    if (this.selectionExpanded) {
      this.applyLimit(this.multiSelectModel.length);
    } else {
      this.containerWidthChange.next(this.containerWidth);
    }
  }

  private initialiseObserver() {
    const container = this.container ? this.container.el.nativeElement : this.el.nativeElement.parentElement;
    this.containerWidth = container.offsetWidth;
    this.resizeObserver = new ResizeObserver(entries => {
      this.zone.runOutsideAngular(() => {
        entries.forEach(entry => {
          const entryWidth = entry.contentRect.width;
          switch (entry.target) {
            case container:
              if (this.containerWidth !== entryWidth) {
                this.containerWidth = entryWidth;
                this.containerWidthChange.next(entryWidth);
              }
              break;
            case this.wrapper.nativeElement:
              this.containerWidthChange.next(null);
              break;
          }
        });
      });
    });
    this.resizeObserver.observe(container);
    this.resizeObserver.observe(this.wrapper.nativeElement);
  }

  private calculateLimit() {
    this.shouldCalculate = true;
    this.cdr.detectChanges();
    if (!this.calculationPills || this.calculationPills.length === 0) {
      this.applyLimit();
      return;
    }
    const pillDimensions = this.calculationPills.map(p => ({
      top: p.nativeElement.offsetTop,
      width: p.nativeElement.offsetWidth,
      left: p.nativeElement.offsetLeft,
    }));

    const firstPill = pillDimensions[0];
    const buttonWidth = this.truncationButton?.nativeElement?.offsetWidth || 100;
    const textboxWidth = this.textbox.nativeElement.offsetWidth;
    const expectedWidth = this.containerWidth - textboxWidth - buttonWidth;

    let fitCount = 0;

    for (const pill of pillDimensions) {
      if (pill.top > firstPill.top || pill.left + pill.width > expectedWidth) {
        break;
      }
      fitCount++;
    }
    this.applyLimit(fitCount);
  }

  private applyLimit(limit = undefined) {
    this.zone.run(() => {
      this.calculatedLimit = limit === 0 ? 1 : limit;
      this.shouldCalculate = false;
      this.cdr.markForCheck();
    });
  }

  private updateTotalSelection() {
    if (!this.multiSelect || !this.multiSelectModel?.length) {
      this.isTotalSelection = false;
      return;
    }
    // Skip recalculation when items are filtered to zero (e.g. "no results")
    // to prevent pills from flashing while typing in the search input.
    if (!this.options?.items?.length) {
      return;
    }
    this.isTotalSelection = this.optionSelectionService.containsAll(this.options.items.map(option => option.value));
  }

  private initializeSubscriptions(): void {
    this.subscriptions.push(
      this.optionSelectionService.selectionChanged.subscribe((newSelection: ComboboxModel<T>) => {
        this.updateInputValue(newSelection);
        if (newSelection.isEmpty()) {
          this.selectionExpanded = false;
          this.isTotalSelection = false;
        } else {
          if (!this.multiSelect) {
            this.popoverService.open = false;
          }
          this.updateTotalSelection();
        }

        this.updateControlValue();
        if (this.selectionExpanded) {
          this.applyLimit(this.multiSelectModel.length);
        } else {
          this.calculateLimit();
        }

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
      }),
      this.containerWidthChange.pipe(debounceTime(0)).subscribe(() => {
        if (!this.selectionExpanded && !this.isTotalSelection) {
          this.calculateLimit();
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

  /**
   * Publishes instance state the rendered DOM cannot show — the selection model and,
   * while the options popover is instantiated, the option list — through the plain
   * element context contract in `@clr/angular/utils`, where page-context tooling such as
   * `@clr/angular/ai` discovers it. The contract lives in utils rather than in the engine
   * so publishing costs this component nothing but one import.
   */
  private publishContext(host: HTMLElement) {
    const describe: ClrElementContextCallback = snapshotOptions => {
      // The contract is a plain element property that any page tooling may call, not
      // only the engine that passes budgets, so a missing argument must not throw.
      const maxItems = snapshotOptions?.maxItemsPerCollection ?? CLR_CONTEXT_DEFAULT_MAX_ITEMS;
      const excluded = this.excludedBy(snapshotOptions);
      const state: Record<string, unknown> = { multiSelect: this.multiSelect };
      const items = this.options?.items;
      const narrowed = this.optionsNarrowed();
      // A summary snapshot counts collections rather than listing them.
      const summary = snapshotOptions?.collectionItems === 'summary';
      if (items?.length || narrowed) {
        // Option content children exist even while the popover is closed, so the
        // choices are available regardless of what the DOM currently shows. An option
        // the snapshot excludes is not one; a redacted one counts, unnamed.
        const listed = (items?.toArray() ?? []).filter(option => this.optionShown(option, excluded) !== 'excluded');
        const named = listed.filter(option => this.optionShown(option, excluded) === 'shown');
        const labels = named.slice(0, maxItems).map(option => this.optionLabel(option));
        if (narrowed) {
          // The list holds only the options matching what the user typed — none, when
          // nothing matches — and after an editable combobox closes, only the one they
          // picked; or it is whatever the application last loaded for some text. That
          // says what they entered, so it goes under keys withheld from consumers the
          // application does not control, the counts too.
          if (summary) {
            state.matchingOptionCount = listed.length;
          } else {
            state.matchingOptions = labels;
            if (named.length < listed.length) {
              state.redactedMatchingOptions = listed.length - named.length;
            }
          }
          if (this.optionSelectionService.loading && this.optionSelectionService.currentInput) {
            // A search for what the user typed is still running: these are the matches
            // shown so far, not yet all there are.
            state.matchingOptionsPending = true;
          }
        } else if (summary) {
          state.optionCount = listed.length;
        } else {
          state.options = labels;
          if (named.length < listed.length) {
            state.redactedOptions = listed.length - named.length;
          }
        }
      } else {
        // Async comboboxes have no option list until a search loads one.
        state.optionsAvailable = false;
      }
      if (this.optionSelectionService.loading && !(narrowed && this.optionSelectionService.currentInput)) {
        // A search is running with no typed text in the input — on opening, or after the
        // text was cleared — so the options above are not final. That a search runs says
        // nothing of what was typed; any list it replaces is withheld above.
        state.optionsPending = true;
      }
      state.value = this.selectedLabels(excluded);
      return { type: 'combobox', state };
    };

    this.teardownElementContext = clrPublishElementContext(host, describe);
  }

  /**
   * Whether the rendered options may be only those matching some text the user entered.
   * `*clrOptionItems` filters by the text in the input while the list is open. An
   * application listening to `clrInputChange` loads its list for whatever text it was
   * last given — the text before it was cleared, a picked label after a close, or text
   * typed into an earlier instance of this combobox whose results it kept — and only it
   * knows which, so any list counts, as does typed text while there is none. Options
   * written out one by one with no one listening are all rendered whatever was typed.
   */
  private optionsNarrowed(): boolean {
    const typed = !!this.optionSelectionService.currentInput;
    if (this.clrInputChange.observed) {
      return typed || !!this.options?.items?.length;
    }
    return !!this.optionItems && !this.optionSelectionService.showAllOptions && typed;
  }

  /**
   * Says how this combobox is written to: its form control holds an option's value,
   * which may be an object, while an agent knows the option by the label it saw in the
   * published context. Given a label (one per item for multi-select) this returns the
   * option's value for the engine to write through the form control; a label no option
   * has is refused with the options named, so a value the component would otherwise
   * accept silently never reaches the model. Read back, the selection is labels again.
   */
  private publishMutator(host: HTMLElement) {
    this.teardownElementMutator = clrPublishElementMutator(host, {
      // The search input inside carries a form binding of its own, which is not the value.
      ownsContents: true,
      coerce: (proposed: unknown, options?: Required<ClrContextSnapshotOptions>): ClrElementMutation => {
        const excluded = this.excludedBy(options);
        // A selection the agent was never shown stays as it is.
        const kept = this.multiSelect
          ? this.selectedValues().filter(value => this.valueShown(value, excluded) !== 'shown')
          : [];
        // One choice at a time: replacing one the agent was never shown would change what
        // it cannot see, and could not undo.
        if (!this.multiSelect && this.selectedValues().some(value => this.valueShown(value, excluded) !== 'shown')) {
          return { refused: 'The current choice is kept from agents, and cannot be changed by one.' };
        }
        if (proposed === null || proposed === undefined || proposed === '') {
          return { value: this.multiSelect ? kept : null };
        }
        const proposals = Array.isArray(proposed) ? proposed : [proposed];
        if (!this.multiSelect && proposals.length > 1) {
          return { refused: 'The combobox takes one option.' };
        }
        // Only the options the snapshot named can be chosen, or named in a refusal.
        const items = (this.options?.items?.toArray() ?? []).filter(
          option => this.optionShown(option, excluded) === 'shown'
        );
        const values: T[] = [...kept];
        for (const proposal of proposals) {
          const option = items.find(candidate => this.optionMatches(candidate, proposal));
          if (option) {
            values.push(option.value);
          } else if (this.editable && typeof proposal === 'string' && proposal.trim()) {
            // An editable combobox takes what the user types, as it would from the keyboard.
            values.push(this.optionSelectionService.editableResolver(proposal.trim()));
          } else if (!items.length) {
            return { refused: 'No options are loaded: the combobox loads them as the user types.' };
          } else {
            const labels = items
              .slice(0, CLR_CONTEXT_DEFAULT_MAX_ITEMS)
              .map(candidate => `"${this.optionLabel(candidate)}"`);
            return { refused: `No such option. The options are: ${labels.join(', ')}.` };
          }
        }
        return { value: this.multiSelect ? values : values[0] };
      },
      read: (options?: Required<ClrContextSnapshotOptions>) => this.selectedLabels(this.excludedBy(options)),
    });
  }

  /** The selector for what the snapshot options exclude, on this page. */
  private excludedBy(options?: ClrContextSnapshotOptions): string {
    return clrUsableSelectors(this.el.nativeElement.ownerDocument, options?.excludeSelectors ?? []);
  }

  /**
   * Whether an option is shown to page-context tooling: `'excluded'` when the snapshot
   * options leave it out, `'withheld'` when it, or a group around it, is redacted — it is
   * counted, but not named — and `'shown'` otherwise. Judged within the option list only:
   * the list's overlay is ignored as a whole, since this component publishes it.
   */
  private optionShown(option: ClrOption<T>, excluded: string): 'shown' | 'withheld' | 'excluded' {
    const element: Element = option.elRef.nativeElement;
    const list = element.closest('clr-options');
    let verdict: 'shown' | 'withheld' = 'shown';
    for (let current: Element | null = element; current; current = current.parentElement) {
      if (excluded && current.matches(excluded)) {
        return 'excluded';
      }
      if (
        current.matches(CLR_CONTEXT_REDACT_SELECTOR) ||
        (current === element && current.matches(CLR_CONTEXT_WITHHELD_SELECTOR))
      ) {
        verdict = 'withheld';
      }
      if (current === list) {
        break;
      }
    }
    return verdict;
  }

  /** {@link optionShown} for a selected value: a value no option holds is shown by its own label. */
  private valueShown(value: T, excluded: string): 'shown' | 'withheld' | 'excluded' {
    const option = this.optionFor(value);
    return option ? this.optionShown(option, excluded) : 'shown';
  }

  /**
   * The option that holds a value, matched as the selection itself matches it: by
   * `clrComboboxIdentityFn` as well as by reference, so a model loaded apart from the
   * options — the same record, another object — is still that option, redaction and all.
   */
  private optionFor(value: unknown): ClrOption<T> | undefined {
    return this.options?.items?.find(candidate => this.sameValue(candidate.value, value));
  }

  private sameValue(option: T, value: unknown): boolean {
    if (option === value) {
      return true;
    }
    if (option === null || option === undefined || value === null || value === undefined) {
      return false;
    }
    try {
      const identity = this.optionSelectionService.identityFn(option);
      return identity !== undefined && identity === this.optionSelectionService.identityFn(value as T);
    } catch {
      // An identity function written for the model's shape may not take anything else.
      return false;
    }
  }

  private selectedValues(): T[] {
    const model = this.optionSelectionService.selectionModel?.model;
    if (model === null || model === undefined) {
      return [];
    }
    return Array.isArray(model) ? model : [model];
  }

  /**
   * The selection as the user sees it: the option's label when the value matches an
   * option, the display field otherwise, the value itself as a last resort. `[]` or
   * `null` when nothing is selected, as the combobox is multi- or single-select.
   */
  private selectedLabels(excluded = ''): unknown {
    const model = this.optionSelectionService.selectionModel?.model;
    if (model === null || model === undefined) {
      return this.multiSelect ? [] : null;
    }
    // A selected option the snapshot excludes is not reported; a redacted one, unnamed.
    const names = (Array.isArray(model) ? model : [model])
      .map(value => ({ value, shown: this.valueShown(value, excluded) }))
      .filter(entry => entry.shown !== 'excluded')
      .map(entry => (entry.shown === 'shown' ? this.selectedValueLabel(entry.value) : null));
    return this.multiSelect ? names : (names[0] ?? null);
  }

  private optionMatches(option: ClrOption<T>, proposal: unknown): boolean {
    if (typeof proposal !== 'string') {
      return this.sameValue(option.value, proposal);
    }
    const wanted = clrNormalizeContextText(proposal);
    if (clrNormalizeContextText(this.optionLabel(option)) === wanted) {
      return true;
    }
    const value = option.value;
    if (typeof value === 'string' || typeof value === 'number') {
      return clrNormalizeContextText(String(value)) === wanted;
    }
    const display = this.selectedValueLabel(value);
    return typeof display === 'string' && clrNormalizeContextText(display) === wanted;
  }

  /**
   * An option's visible label, without screen-reader-only additions such as "Selected".
   * An option that shows no text is named by its value — but not one whose text was
   * withheld: its value is as often the very thing withheld, an account number shown in a
   * redacted span.
   */
  private optionLabel(option: ClrOption<T>): string {
    const element: HTMLElement = option.elRef.nativeElement;
    const text = clrNormalizeContextText(
      clrContextText(element, descendant => descendant.classList.contains('clr-sr-only')),
      false
    );
    if (text || element.querySelector(CLR_CONTEXT_WITHHELD_SELECTOR)) {
      return text;
    }
    return String(option.value);
  }

  /**
   * What a selected value is called: its option's label, its `displayField`, or the value
   * itself when it is plain text or a number. Never the model object itself — it holds
   * fields the user never sees — so an object without either reads as `null`.
   */
  private selectedValueLabel(value: T): string | null {
    const option = this.optionFor(value);
    if (option) {
      return this.optionLabel(option);
    }
    const shown = this.displayField && value ? (value as Record<string, unknown>)[this.displayField] : value;
    return typeof shown === 'string' || typeof shown === 'number' || typeof shown === 'boolean' ? String(shown) : null;
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
