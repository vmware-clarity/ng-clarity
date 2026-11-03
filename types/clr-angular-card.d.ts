import * as i0 from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ClrCommonStringsService, HeadingLevel } from '@clr/angular/utils';
import * as i14 from '@angular/common';
import * as i15 from '@clr/angular/icon';

declare class ClrCard {
    footerCollapsible: boolean;
    expandedChange: EventEmitter<boolean>;
    readonly headerContentId: string;
    readonly contentId: string;
    private readonly _collapsible;
    private readonly _expanded;
    get collapsible(): boolean;
    set collapsible(value: boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    /**
     * Toggles the expanded state of a collapsible card and emits `clrCardExpandedChange`.
     * Setting the `clrCardExpanded` input programmatically does not emit.
     */
    toggle(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCard, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCard, "clr-card", never, { "footerCollapsible": { "alias": "clrCardFooterCollapsible"; "required": false; }; "collapsible": { "alias": "clrCardCollapsible"; "required": false; }; "expanded": { "alias": "clrCardExpanded"; "required": false; }; }, { "expandedChange": "clrCardExpandedChange"; }, never, ["clr-card-header", "*", "clr-card-footer"], false, never>;
    static ngAcceptInputType_footerCollapsible: unknown;
    static ngAcceptInputType_collapsible: unknown;
    static ngAcceptInputType_expanded: unknown;
}

declare class ClrCardHeader {
    protected readonly card: ClrCard;
    protected readonly commonStrings: ClrCommonStringsService;
    /**
     * Level of the card header heading from 1 to 6.
     */
    explicitHeadingLevel: HeadingLevel;
    constructor(card: ClrCard, commonStrings: ClrCommonStringsService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardHeader, [{ optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardHeader, "clr-card-header", never, { "explicitHeadingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrCardBody {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardBody, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardBody, "clr-card-body", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardBodyTitle {
    /**
     * Level of the card body title heading from 1 to 6.
     */
    explicitHeadingLevel: HeadingLevel;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardBodyTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardBodyTitle, "clr-card-body-title", never, { "explicitHeadingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrCardBodyText {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardBodyText, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardBodyText, "clr-card-body-text", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardFooter {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardFooter, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardFooter, "clr-card-footer", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardImage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardImage, "clr-card-image", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardDivider {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardDivider, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardDivider, "clr-card-divider", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardMediaBlock {
    clrCardMediaWrap: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardMediaBlock, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardMediaBlock, "clr-card-media-block", never, { "clrCardMediaWrap": { "alias": "clrCardMediaWrap"; "required": false; }; }, {}, never, ["*"], false, never>;
    static ngAcceptInputType_clrCardMediaWrap: unknown;
}

declare class ClrCardMediaDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardMediaDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCardMediaDescription, "clr-card-media-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrCardMediaImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardMediaImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCardMediaImage, "img[clrCardMediaImage]", never, {}, {}, never, never, false, never>;
}

declare class ClrCardMediaTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardMediaTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCardMediaTitle, "[clrCardMediaTitle]", never, {}, {}, never, never, false, never>;
}

declare class ClrCardMediaText {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardMediaText, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCardMediaText, "[clrCardMediaText]", never, {}, {}, never, never, false, never>;
}

declare class ClrCardModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCardModule, [typeof ClrCard, typeof ClrCardHeader, typeof ClrCardBody, typeof ClrCardBodyTitle, typeof ClrCardBodyText, typeof ClrCardFooter, typeof ClrCardImage, typeof ClrCardDivider, typeof ClrCardMediaBlock, typeof ClrCardMediaDescription, typeof ClrCardMediaImage, typeof ClrCardMediaTitle, typeof ClrCardMediaText], [typeof i14.CommonModule, typeof i15.ClrIcon], [typeof ClrCard, typeof ClrCardHeader, typeof ClrCardBody, typeof ClrCardBodyTitle, typeof ClrCardBodyText, typeof ClrCardFooter, typeof ClrCardImage, typeof ClrCardDivider, typeof ClrCardMediaBlock, typeof ClrCardMediaDescription, typeof ClrCardMediaImage, typeof ClrCardMediaTitle, typeof ClrCardMediaText]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCardModule>;
}

export { ClrCard, ClrCardBody, ClrCardBodyText, ClrCardBodyTitle, ClrCardDivider, ClrCardFooter, ClrCardHeader, ClrCardImage, ClrCardMediaBlock, ClrCardMediaDescription, ClrCardMediaImage, ClrCardMediaText, ClrCardMediaTitle, ClrCardModule };
