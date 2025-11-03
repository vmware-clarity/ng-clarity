import { Renderer2 } from '@angular/core';
import { LayoutService } from './layout.service';
import { CONTROL_STATE } from '../if-control-state/if-control-state.service';
export declare class ControlClassService {
    private layoutService;
    className: string;
    constructor(layoutService: LayoutService);
    controlClass(state?: CONTROL_STATE, grid?: boolean, additional?: string): string;
    initControlClass(renderer: Renderer2, element: HTMLElement): void;
}
