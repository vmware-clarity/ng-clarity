import { OnDestroy } from '@angular/core';
import { IfActiveService } from '../../utils/conditional/if-active.service';
import { TabsService } from './providers/tabs.service';
import * as i0 from "@angular/core";
export declare class ClrTabContent implements OnDestroy {
    ifActiveService: IfActiveService;
    id: number;
    private tabsService;
    tabContentId: string;
    private viewRef;
    constructor(ifActiveService: IfActiveService, id: number, tabsService: TabsService);
    get active(): boolean;
    get ariaLabelledBy(): string;
    private set templateRef(value);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTabContent, "clr-tab-content", never, { "tabContentId": "id"; }, {}, never, ["*"], false, never>;
}
