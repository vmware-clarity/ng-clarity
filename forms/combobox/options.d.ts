import { AfterViewInit, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { ClrOption } from './option';
import { ComboboxFocusHandler } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrOptions<T> implements AfterViewInit, LoadingListener, OnDestroy {
    optionSelectionService: OptionSelectionService<T>;
    id: number;
    private el;
    commonStrings: ClrCommonStringsService;
    private focusHandler;
    private toggleService;
    private document;
    optionsId: string;
    loading: boolean;
    _items: QueryList<ClrOption<T>>;
    private subscriptions;
    constructor(optionSelectionService: OptionSelectionService<T>, id: number, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, focusHandler: ComboboxFocusHandler<T>, toggleService: ClrPopoverToggleService, parentHost: ElementRef<HTMLElement>, document: any);
    get items(): QueryList<ClrOption<T>>;
    set items(items: QueryList<ClrOption<T>>);
    /**
     * Tests if the list of options is empty, meaning it doesn't contain any items
     */
    get emptyOptions(): boolean;
    get editable(): boolean;
    get noResultsElementId(): string;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    searchText(input: string): string;
    loadingStateChange(state: ClrLoadingState): void;
}
