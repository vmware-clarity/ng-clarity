import { AfterContentInit, ElementRef, Injector, OnDestroy, QueryList } from '@angular/core';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { AbstractPopover } from '../common/abstract-popover';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
export declare class ClrDropdownMenu extends AbstractPopover implements AfterContentInit, OnDestroy {
    items: QueryList<FocusableItem>;
    private focusHandler;
    constructor(injector: Injector, parentHost: ElementRef<HTMLElement>, nested: ClrDropdownMenu, focusHandler: DropdownFocusHandler);
    set position(position: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
