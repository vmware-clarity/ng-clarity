import { ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';
import * as i0 from "@angular/core";
export declare class ClrLabel implements OnInit, OnDestroy {
    private controlIdService;
    private layoutService;
    private ngControlService;
    private renderer;
    private el;
    idInput: string;
    idAttr: string;
    forAttr: string;
    private signpost;
    private enableGrid;
    private subscriptions;
    constructor(controlIdService: ControlIdService, layoutService: LayoutService, ngControlService: NgControlService, renderer: Renderer2, el: ElementRef<HTMLLabelElement>);
    get labelText(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    disableGrid(): void;
    /**
     * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
     * automatically closed once clicked inside a <label>.
     * @param event
     */
    private onClick;
    private preventDefaultOnSignpostTarget;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLabel, [{ optional: true; }, { optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLabel, "label", never, { "idInput": "id"; "forAttr": "for"; }, {}, ["signpost"], never, false, never>;
}
