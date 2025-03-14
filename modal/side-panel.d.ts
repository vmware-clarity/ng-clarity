import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { ClrCommonStringsService } from '../utils';
import { ClrModalConfigurationService } from './modal-configuration.service';
import * as i0 from "@angular/core";
export declare class ClrSidePanel implements OnInit, OnDestroy, OnChanges {
    private element;
    private configuration;
    commonStrings: ClrCommonStringsService;
    _open: boolean;
    openChange: EventEmitter<boolean>;
    closeButtonAriaLabel: string | undefined;
    skipAnimation: boolean;
    labelledById: string;
    staticBackdrop: boolean;
    preventClose: boolean;
    altClose: EventEmitter<boolean>;
    private modal;
    private _pinnable;
    private _pinned;
    private originalStopClose;
    private _size;
    constructor(element: ElementRef<HTMLElement>, configuration: ClrModalConfigurationService, commonStrings: ClrCommonStringsService);
    get size(): string;
    set size(value: string);
    get pinned(): boolean;
    set pinned(pinned: boolean);
    get clrSidePanelBackdrop(): boolean;
    set clrSidePanelBackdrop(backdrop: boolean);
    get clrSidePanelPinnable(): boolean;
    set clrSidePanelPinnable(pinnable: boolean);
    private get hostElement();
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
    open(): void;
    close(): void;
    togglePinned(): void;
    private documentClick;
    private displaySideBySide;
    private displayOverlapping;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSidePanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSidePanel, "clr-side-panel", never, { "_open": "clrSidePanelOpen"; "closeButtonAriaLabel": "clrSidePanelCloseButtonAriaLabel"; "skipAnimation": "clrSidePanelSkipAnimation"; "labelledById": "clrSidePanelLabelledById"; "staticBackdrop": "clrSidePanelStaticBackdrop"; "preventClose": "clrSidePanelPreventClose"; "size": "clrSidePanelSize"; "clrSidePanelBackdrop": "clrSidePanelBackdrop"; "clrSidePanelPinnable": "clrSidePanelPinnable"; }, { "openChange": "clrSidePanelOpenChange"; "altClose": "clrSidePanelAlternateClose"; }, never, [".side-panel-title", ".side-panel-body", ".side-panel-footer"], false, never>;
}
