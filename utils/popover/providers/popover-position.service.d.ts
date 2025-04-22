import { Observable } from 'rxjs';
import { ClrPopoverContentOffset } from '../interfaces/popover-content-offset.interface';
import { ClrPopoverPosition } from '../interfaces/popover-position.interface';
import { ClrPopoverEventsService } from './popover-events.service';
import * as i0 from "@angular/core";
export declare class ClrPopoverPositionService {
    private eventService;
    platformId: any;
    position: ClrPopoverPosition;
    shouldRealign: Observable<void>;
    private currentAnchorCoords;
    private currentContentCoords;
    private contentOffsets;
    private _shouldRealign;
    constructor(eventService: ClrPopoverEventsService, platformId: any);
    realign(): void;
    alignContent(content: HTMLElement): ClrPopoverContentOffset;
    private handleVerticalAxisOneViolation;
    private handleVerticalAxisTwoViolations;
    private handleHorizontalAxisOneViolation;
    private handleHorizontalAxisTwoViolations;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverPositionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrPopoverPositionService>;
}
