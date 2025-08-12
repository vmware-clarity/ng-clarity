import { ClrAbstractControl } from './abstract-control';
import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';
import * as i0 from "@angular/core";
export declare class ClrControlError extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrControlError, [{ optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrControlError, "clr-control-error", never, {}, {}, never, ["*"], false, never>;
}
