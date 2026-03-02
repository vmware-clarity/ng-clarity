import * as i0 from '@angular/core';
import { OnInit, EventEmitter, Type } from '@angular/core';
import * as i9 from '@clr/angular/utils';
import { HeadingLevel, ClrCommonStringsService } from '@clr/angular/utils';
import * as i6 from '@angular/common';
import * as i7 from '@angular/forms';
import * as i8 from '@clr/angular/icon';

declare class ClrStackView {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackView, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackView, "clr-stack-view", never, {}, {}, never, ["clr-stack-header", "*"], false, never>;
}

declare class ClrStackHeader {
    stackView: ClrStackView;
    /**
     * Depth of the stack view header starting from 1 for first level
     */
    ariaLevel: HeadingLevel;
    constructor(stackView: ClrStackView);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackHeader, "clr-stack-header", never, { "ariaLevel": { "alias": "clrStackHeaderLevel"; "required": false; }; }, {}, never, ["*", ".stack-action"], false, never>;
}

declare class ClrStackBlock implements OnInit {
    private parent;
    commonStrings: ClrCommonStringsService;
    expanded: boolean;
    expandable: boolean;
    /**
     * Depth of the stack view starting from 1 for first level
     */
    ariaLevel: HeadingLevel;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackBlock, "clr-stack-block", never, { "expanded": { "alias": "clrSbExpanded"; "required": false; }; "expandable": { "alias": "clrSbExpandable"; "required": false; }; "ariaLevel": { "alias": "clrStackViewLevel"; "required": false; }; "setChangedValue": { "alias": "clrSbNotifyChange"; "required": false; }; }, { "expandedChange": "clrSbExpandedChange"; }, ["stackBlockTitle"], ["clr-stack-label", "*", "clr-stack-block"], false, never>;
}

declare class ClrStackContentInput {
    uniqueId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackContentInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackContentInput, "[clrStackInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrStackViewCustomTags {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewCustomTags, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackViewCustomTags, "clr-stack-content", never, {}, {}, never, never, false, never>;
}
declare class ClrStackViewLabel implements OnInit {
    private _generatedId;
    private _id;
    get id(): string;
    set id(val: string);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackViewLabel, "clr-stack-label", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const CLR_STACK_VIEW_DIRECTIVES: Type<any>[];
declare class ClrStackViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStackViewModule, [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags], [typeof i6.CommonModule, typeof i7.FormsModule, typeof i8.ClrIcon, typeof i9.ClrExpandableAnimationModule], [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStackViewModule>;
}

export { CLR_STACK_VIEW_DIRECTIVES, ClrStackBlock, ClrStackContentInput, ClrStackHeader, ClrStackView, ClrStackViewCustomTags, ClrStackViewLabel, ClrStackViewModule };
