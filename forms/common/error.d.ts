import { ClrAbstractControl } from './abstract-control';
import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';
export declare class ClrControlError extends ClrAbstractControl {
    protected controlIdService: ControlIdService;
    protected containerIdService: ContainerIdService;
    controlIdSuffix: string;
    constructor(controlIdService: ControlIdService, containerIdService: ContainerIdService);
}
