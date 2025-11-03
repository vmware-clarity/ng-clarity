import { ContainerIdService } from './providers/container-id.service';
import { ControlIdService } from './providers/control-id.service';
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
}
