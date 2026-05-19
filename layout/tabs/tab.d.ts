import { IfActiveService } from '../../utils/conditional/if-active.service';
import { TabsService } from './providers/tabs.service';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';
import * as i0 from "@angular/core";
export declare class ClrTab {
    ifActiveService: IfActiveService;
    id: number;
    private tabsService;
    tabLink: ClrTabLink;
    tabContent: ClrTabContent;
    constructor(ifActiveService: IfActiveService, id: number, tabsService: TabsService);
    get active(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTab, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTab, "clr-tab", never, {}, {}, ["tabLink", "tabContent"], ["*"], false, never>;
}
