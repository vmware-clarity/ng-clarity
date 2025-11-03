import { OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { ClrSignpost } from '../../popover/signpost/signpost';
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
}
