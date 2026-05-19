import { Renderer2 } from '@angular/core';
import { CONTROL_STATE } from '../if-control-state/if-control-state.service';
import { LayoutService } from './layout.service';
import * as i0 from "@angular/core";
export declare class ControlClassService {
    private layoutService;
    className: string;
    constructor(layoutService: LayoutService);
    controlClass(state?: CONTROL_STATE, grid?: boolean, additional?: string): string;
    initControlClass(renderer: Renderer2, element: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ControlClassService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ControlClassService>;
}
