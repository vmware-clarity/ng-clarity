import { OnDestroy } from '@angular/core';
import { TabsService } from './providers/tabs.service';
import { IfActiveService } from '../../utils/conditional/if-active.service';
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
}
