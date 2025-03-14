import { ViewContainerRef } from '@angular/core';
import { TabsLayout } from '../enums/tabs-layout.enum';
import { ClrTab } from '../tab';
import * as i0 from "@angular/core";
export declare class TabsService {
    layout: TabsLayout | string;
    tabContentViewContainer: ViewContainerRef;
    private _children;
    get children(): ClrTab[];
    get activeTab(): ClrTab;
    get overflowTabs(): ClrTab[];
    register(tab: ClrTab): void;
    unregister(tab: ClrTab): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TabsService>;
}
