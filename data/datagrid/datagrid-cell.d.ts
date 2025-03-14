import { OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { ClrSignpost } from '../../popover/signpost/signpost';
import * as i0 from "@angular/core";
export declare class ClrDatagridCell implements OnInit {
    private vcr;
    /*********
     * @property signpost
     *
     * @description
     * @ContentChild is used to detect the presence of a Signpost in the projected content.
     * On the host, we set the .datagrid-signpost-trigger class on the cell when signpost.length is greater than 0.
     *
     */
    signpost: QueryList<ClrSignpost>;
    private wrappedInjector;
    constructor(vcr: ViewContainerRef);
    get _view(): any;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridCell, "clr-dg-cell", never, {}, {}, ["signpost"], ["*"], false, never>;
}
