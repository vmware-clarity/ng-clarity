import { TabsService } from './providers/tabs.service';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';
import { IfActiveService } from '../../utils/conditional/if-active.service';
export declare class ClrTab {
    ifActiveService: IfActiveService;
    id: number;
    private tabsService;
    tabLink: ClrTabLink;
    tabContent: ClrTabContent;
    constructor(ifActiveService: IfActiveService, id: number, tabsService: TabsService);
    get active(): boolean;
    ngOnDestroy(): void;
}
