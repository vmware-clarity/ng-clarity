import { AnimationEvent } from '@angular/animations';
import * as i0 from '@angular/core';
import { OnChanges, OnDestroy, ElementRef, EventEmitter, TemplateRef, SimpleChange, Renderer2, NgZone, Type, OnInit } from '@angular/core';
import * as i5 from '@clr/angular/utils';
import { ClrCommonStringsService, ScrollingService } from '@clr/angular/utils';
import * as i4 from '@angular/common';
import * as i6 from '@clr/angular/icon';

declare class ClrModalConfigurationService {
    fadeMove: string;
    backdrop: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalConfigurationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrModalConfigurationService>;
}

interface Closable {
    close(): void;
}
declare class ModalStackService {
    private readonly platformId;
    private readonly modalStack;
    private readonly keyUpEventListener;
    constructor(platformId: unknown);
    trackModalOpen(openedModal: Closable): void;
    trackModalClose(closedModal: Closable): void;
    private onKeyUp;
    static ɵfac: i0.ɵɵFactoryDeclaration<ModalStackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ModalStackService>;
}

declare class ClrModal implements OnChanges, OnDestroy {
    private _scrollingService;
    commonStrings: ClrCommonStringsService;
    private modalStackService;
    private configuration;
    modalId: string;
    title: ElementRef<HTMLElement>;
    _open: boolean;
    _openChanged: EventEmitter<boolean>;
    closable: boolean;
    closeButtonAriaLabel: string;
    size: string;
    staticBackdrop: boolean;
    skipAnimation: boolean;
    stopClose: boolean;
    altClose: EventEmitter<boolean>;
    labelledBy: string;
    bypassScrollService: boolean;
    protected readonly modalContentTemplate: TemplateRef<any>;
    private readonly bodyElementRef;
    constructor(_scrollingService: ScrollingService, commonStrings: ClrCommonStringsService, modalStackService: ModalStackService, configuration: ClrModalConfigurationService);
    get fadeMove(): string;
    set fadeMove(move: string);
    get backdrop(): boolean;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    ngOnDestroy(): void;
    open(): void;
    backdropClick(): void;
    close(): void;
    fadeDone(e: AnimationEvent): void;
    scrollTop(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModal, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrModal, "clr-modal", never, { "_open": { "alias": "clrModalOpen"; "required": false; }; "closable": { "alias": "clrModalClosable"; "required": false; }; "closeButtonAriaLabel": { "alias": "clrModalCloseButtonAriaLabel"; "required": false; }; "size": { "alias": "clrModalSize"; "required": false; }; "staticBackdrop": { "alias": "clrModalStaticBackdrop"; "required": false; }; "skipAnimation": { "alias": "clrModalSkipAnimation"; "required": false; }; "stopClose": { "alias": "clrModalPreventClose"; "required": false; }; "labelledBy": { "alias": "clrModalLabelledById"; "required": false; }; "bypassScrollService": { "alias": "clrModalOverrideScrollService"; "required": false; }; }, { "_openChanged": "clrModalOpenChange"; "altClose": "clrModalAlternateClose"; }, ["modalContentTemplate"], [".leading-button", ".modal-title", ".modal-body", ".modal-footer"], false, never>;
}

/**
 * Allows modal overflow area to be scrollable via keyboard.
 * The modal body will focus with keyboard navigation only.
 * This allows inner focusable items to be focused without
 * the overflow scroll being focused.
 */
declare class ClrModalBody implements OnDestroy {
    private readonly renderer;
    private readonly host;
    private tabindex;
    private unlisteners;
    private observer;
    constructor(renderer: Renderer2, host: ElementRef<HTMLElement>, ngZone: NgZone);
    ngOnDestroy(): void;
    private addTabIndex;
    private removeTabIndex;
    private addOrRemoveTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalBody, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrModalBody, ".modal-body", never, {}, {}, never, never, false, never>;
}

declare class ClrModalHostComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalHostComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrModalHostComponent, "[clrModalHost]", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_MODAL_DIRECTIVES: Type<any>[];
declare class ClrModalModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrModalModule, [typeof ClrModal, typeof ClrModalBody, typeof ClrModalHostComponent], [typeof i4.CommonModule, typeof i5.CdkTrapFocusModule, typeof i6.ClrIcon], [typeof ClrModal, typeof ClrModalBody, typeof ClrModalHostComponent, typeof i6.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrModalModule>;
}

declare class ClrSidePanel implements OnInit, OnDestroy {
    private element;
    private configuration;
    commonStrings: ClrCommonStringsService;
    openChange: EventEmitter<boolean>;
    closeButtonAriaLabel: string | undefined;
    skipAnimation: boolean;
    labelledById: string;
    staticBackdrop: boolean;
    closable: boolean;
    preventClose: boolean;
    altClose: EventEmitter<boolean>;
    private _pinnable;
    private _pinned;
    private originalStopClose;
    private _position;
    private _modal;
    private __open;
    private _size;
    constructor(element: ElementRef<HTMLElement>, configuration: ClrModalConfigurationService, commonStrings: ClrCommonStringsService);
    get _open(): boolean;
    set _open(open: boolean);
    get size(): string;
    set size(value: string);
    get position(): string;
    set position(position: string);
    get pinned(): boolean;
    set pinned(pinned: boolean);
    get clrSidePanelBackdrop(): boolean;
    set clrSidePanelBackdrop(backdrop: boolean);
    get clrSidePanelPinnable(): boolean;
    set clrSidePanelPinnable(pinnable: boolean);
    private get modal();
    private set modal(value);
    private get hostElement();
    private get bottomPositionCssClass();
    ngOnInit(): void;
    ngOnDestroy(): void;
    handleModalOpen(open: boolean): void;
    open(): void;
    close(): void;
    togglePinned(): void;
    private documentClick;
    private updateModalState;
    private cleanupPinnedClasses;
    private updatePinnedClasses;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSidePanel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSidePanel, "clr-side-panel", never, { "closeButtonAriaLabel": { "alias": "clrSidePanelCloseButtonAriaLabel"; "required": false; }; "skipAnimation": { "alias": "clrSidePanelSkipAnimation"; "required": false; }; "labelledById": { "alias": "clrSidePanelLabelledById"; "required": false; }; "staticBackdrop": { "alias": "clrSidePanelStaticBackdrop"; "required": false; }; "closable": { "alias": "clrSidePanelClosable"; "required": false; }; "preventClose": { "alias": "clrSidePanelPreventClose"; "required": false; }; "_open": { "alias": "clrSidePanelOpen"; "required": false; }; "size": { "alias": "clrSidePanelSize"; "required": false; }; "position": { "alias": "clrSidePanelPosition"; "required": false; }; "pinned": { "alias": "clrSidePanelPinned"; "required": false; }; "clrSidePanelBackdrop": { "alias": "clrSidePanelBackdrop"; "required": false; }; "clrSidePanelPinnable": { "alias": "clrSidePanelPinnable"; "required": false; }; }, { "openChange": "clrSidePanelOpenChange"; "altClose": "clrSidePanelAlternateClose"; }, never, [".side-panel-title", ".side-panel-body", ".side-panel-footer"], false, never>;
}

declare const CLR_SIDEPANEL_DIRECTIVES: Type<any>[];
declare class ClrSidePanelModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSidePanelModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSidePanelModule, [typeof ClrSidePanel], [typeof i4.CommonModule, typeof i5.CdkTrapFocusModule, typeof i6.ClrIcon, typeof ClrModalModule], [typeof ClrSidePanel, typeof ClrModalModule, typeof i6.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSidePanelModule>;
}

export { CLR_MODAL_DIRECTIVES, CLR_SIDEPANEL_DIRECTIVES, ClrModal, ClrModalBody, ClrModalConfigurationService, ClrModalHostComponent, ClrModalModule, ClrSidePanel, ClrSidePanelModule, ModalStackService };
export type { Closable };
