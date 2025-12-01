import { ComponentFactoryResolver, ElementRef, ViewContainerRef } from '@angular/core';
import { IfActiveService } from '../../utils/conditional/if-active.service';
import { TemplateRefContainer } from '../../utils/template-ref/template-ref-container';
import { TabsService } from './providers/tabs.service';
import * as i0 from "@angular/core";
export declare class ClrTabLink {
    ifActiveService: IfActiveService;
    readonly id: number;
    el: ElementRef<HTMLElement>;
    private tabsService;
    tabsId: number;
    tabLinkId: string;
    templateRefContainer: TemplateRefContainer;
    private _inOverflow;
    constructor(ifActiveService: IfActiveService, id: number, el: ElementRef<HTMLElement>, cfr: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, tabsService: TabsService, tabsId: number);
    get inOverflow(): boolean;
    set inOverflow(inOverflow: boolean);
    get addLinkClasses(): boolean;
    get ariaControls(): string;
    get active(): boolean;
    get tabindex(): -1 | 0;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTabLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTabLink, "[clrTabLink]", never, { "tabLinkId": "id"; "inOverflow": "clrTabLinkInOverflow"; }, {}, never, never, false, never>;
}
