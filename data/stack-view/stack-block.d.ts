import { EventEmitter, OnInit } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import * as i0 from "@angular/core";
export declare class ClrStackBlock implements OnInit {
    private parent;
    commonStrings: ClrCommonStringsService;
    expanded: boolean;
    expandable: boolean;
    /**
     * Depth of the stack view starting from 1 for first level
     */
    ariaLevel: number;
    expandedChange: EventEmitter<boolean>;
    stackBlockTitle: any;
    focused: boolean;
    uniqueId: string;
    private _changedChildren;
    private _fullyInitialized;
    private _changed;
    constructor(parent: ClrStackBlock, commonStrings: ClrCommonStringsService);
    set setChangedValue(value: boolean);
    get getChangedValue(): boolean;
    get onStackLabelFocus(): boolean;
    get labelledById(): any;
    get headingLevel(): string;
    get caretDirection(): string;
    get role(): string;
    get tabIndex(): string;
    get ariaExpanded(): string;
    ngOnInit(): void;
    addChild(): void;
    toggleExpand(event?: Event): void;
    getStackChildrenId(): string;
    protected preventDefaultIfNotInputEvent(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackBlock, [{ optional: true; skipSelf: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackBlock, "clr-stack-block", never, { "expanded": "clrSbExpanded"; "expandable": "clrSbExpandable"; "ariaLevel": "clrStackViewLevel"; "setChangedValue": "clrSbNotifyChange"; }, { "expandedChange": "clrSbExpandedChange"; }, ["stackBlockTitle"], ["clr-stack-label", "*", "clr-stack-block"], false, never>;
}
