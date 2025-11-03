import { ElementRef, ViewContainerRef } from '@angular/core';
import { TabsService } from './providers/tabs.service';
import { IfActiveService } from '../../utils/conditional/if-active.service';
import { TemplateRefContainer } from '../../utils/template-ref/template-ref-container';
export declare class ClrTabLink {
    ifActiveService: IfActiveService;
    readonly id: number;
    el: ElementRef<HTMLElement>;
    private tabsService;
    tabsId: number;
    tabLinkId: string;
    templateRefContainer: TemplateRefContainer;
    private _inOverflow;
    constructor(ifActiveService: IfActiveService, id: number, el: ElementRef<HTMLElement>, viewContainerRef: ViewContainerRef, tabsService: TabsService, tabsId: number);
    get inOverflow(): boolean;
    set inOverflow(inOverflow: boolean);
    get addLinkClasses(): boolean;
    get ariaControls(): string;
    get active(): boolean;
    get tabindex(): 0 | -1;
    activate(): void;
}
