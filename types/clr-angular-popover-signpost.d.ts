import * as i8 from '@clr/angular/popover/common';
import { ClrPopoverService, ClrPopoverPoint, ClrPopoverContent, ClrPopoverPosition } from '@clr/angular/popover/common';
import * as i7 from '@clr/angular/utils';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i0 from '@angular/core';
import { OnDestroy, ElementRef, AfterViewInit, Type } from '@angular/core';
import { Observable } from 'rxjs';
import * as i5 from '@angular/common';
import * as i6 from '@clr/angular/icon';

declare class SignpostFocusManager {
    private _triggerEl;
    set triggerEl(value: HTMLElement);
    focusTrigger(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignpostFocusManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SignpostFocusManager>;
}

declare class SignpostIdService {
    private _id;
    get id(): Observable<string>;
    setId(id: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignpostIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SignpostIdService>;
}

declare class ClrSignpostTrigger implements OnDestroy {
    private popoverService;
    private el;
    private signpostIdService;
    private signpostFocusManager;
    private platformId;
    ariaExpanded: boolean;
    ariaControl: string;
    isOpen: boolean;
    private document;
    private subscriptions;
    constructor(popoverService: ClrPopoverService, el: ElementRef<HTMLElement>, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, document: any, platformId: any);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event: Event): void;
    private focusOnClose;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSignpostTrigger, "[clrSignpostTrigger]", never, {}, {}, never, never, false, never>;
}

declare class ClrSignpost {
    commonStrings: ClrCommonStringsService;
    private popoverService;
    /**********
     * @property useCustomTrigger
     *
     * @description
     * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
     *
     */
    useCustomTrigger: boolean;
    signpostTriggerAriaLabel: string;
    /**
     * Hides the default trigger button. Use when the signpost is opened
     * programmatically via `openAtPoint()` and no trigger icon is needed.
     */
    hideTrigger: boolean;
    constructor(commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService);
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger: ClrSignpostTrigger);
    get showDefaultTrigger(): boolean;
    openAtPoint(point: ClrPopoverPoint, targetElement: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpost, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpost, "clr-signpost", never, { "signpostTriggerAriaLabel": { "alias": "clrSignpostTriggerAriaLabel"; "required": false; }; "hideTrigger": { "alias": "clrSignpostHideTrigger"; "required": false; }; }, {}, ["customTrigger"], ["*"], false, [{ directive: typeof i8.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrSignpostContent implements OnDestroy, AfterViewInit {
    private element;
    commonStrings: ClrCommonStringsService;
    private signpostFocusManager;
    private platformId;
    private document;
    private popoverService;
    private popoverContent;
    signpostCloseAriaLabel: string;
    closeButton: ElementRef<HTMLButtonElement>;
    signpostContentId: string;
    private _position;
    constructor(parentHost: ElementRef<HTMLElement>, element: ElementRef, commonStrings: ClrCommonStringsService, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, platformId: any, document: Document, popoverService: ClrPopoverService, popoverContent: ClrPopoverContent);
    /*********
     *
     * @description
     * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
     * - originPoint - where on the trigger to position the content
     * - popoverPoint - where on the content container to align with the origin
     * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
     * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
     * There are 12 possible positions to place a ClrSignpostContent container:
     * - top-left
     * - top-middle
     * - top-right
     * - right-top
     * - right-middle
     * - right-bottom
     * - bottom-right
     * - bottom-middle
     * - bottom-left
     * - left-bottom
     * - left-middle
     * - left-top
     *
     * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
     * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
     * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
     * linking the SignpostContent to the trigger points down at the horizontal center of the trigger icon.
     *
     * @param newPosition
     */
    get position(): string | ClrPopoverPosition;
    set position(position: string | ClrPopoverPosition);
    get isOffScreen(): boolean;
    /**********
     *
     * @description
     * Close function that uses the signpost instance to toggle the state of the content popover.
     *
     */
    close(): void;
    ngAfterViewInit(): void;
    onKeyDown(event: KeyboardEvent): void;
    ngOnDestroy(): void;
    private getFocusableElements;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostContent, [{ optional: true; }, null, null, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostContent, "clr-signpost-content", never, { "signpostCloseAriaLabel": { "alias": "clrSignpostCloseAriaLabel"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; }, {}, never, ["clr-signpost-title", "*"], false, [{ directive: typeof i8.ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare class ClrSignpostTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpostTitle, "clr-signpost-title", never, {}, {}, never, ["*"], false, never>;
}

declare const CLR_SIGNPOST_DIRECTIVES: Type<any>[];
declare class ClrSignpostModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpostModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSignpostModule, [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle], [typeof i5.CommonModule, typeof i6.ClrIcon, typeof i7.ClrFocusOnViewInitModule, typeof i8.ClrPopoverModuleNext, typeof i8.ClrIfOpen], [typeof ClrSignpost, typeof ClrSignpostContent, typeof ClrSignpostTrigger, typeof ClrSignpostTitle, typeof i8.ClrIfOpen]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSignpostModule>;
}

export { CLR_SIGNPOST_DIRECTIVES, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger };
