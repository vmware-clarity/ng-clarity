import * as i0 from '@angular/core';
import { AfterContentInit, ViewContainerRef, Injector, Renderer2, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';
import { ClrAbstractContainer, ControlClassService, LayoutService, NgControlService, FormsFocusService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i4 from '@angular/common';
import * as i5 from '@clr/angular/forms/input';
import * as i6 from '@clr/angular/icon';

declare class DatalistIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatalistIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatalistIdService>;
}

declare class ClrDatalist implements AfterContentInit {
    private datalistIdService;
    datalistId: string;
    private subscriptions;
    constructor(datalistIdService: DatalistIdService);
    set id(idValue: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalist, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalist, "datalist", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrDatalistContainer extends ClrAbstractContainer {
    focus: boolean;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FormsFocusService);
    showPicker(datalist: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistContainer, [null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatalistContainer, "clr-datalist-container", never, {}, {}, never, ["label", "[clrDatalistInput]", "datalist", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
    private focusService;
    private datalistIdService;
    listValue: string;
    constructor(focusService: FormsFocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, datalistIdService: DatalistIdService);
    ngAfterContentInit(): void;
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalistInput, "[clrDatalistInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrDatalistModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatalistModule, [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer], [typeof i4.CommonModule, typeof i5.ClrInputModule, typeof i6.ClrIcon], [typeof ClrDatalist, typeof ClrDatalistInput, typeof ClrDatalistContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatalistModule>;
}

export { ClrDatalist, ClrDatalistContainer, ClrDatalistInput, ClrDatalistModule, DatalistIdService };
