import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';
import * as i0 from "@angular/core";
export declare const CONTROL_SUFFIX: {
    [key: string]: string | null;
};
export declare abstract class ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    /**
     * Hold the suffix for the ID
     */
    controlIdSuffix: string;
    protected constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    get id(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractControl, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractControl, never, never, {}, {}, never, never, false, never>;
}
