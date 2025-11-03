import { ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
export declare class ClrVerticalNavLink implements OnDestroy {
    private destroy$;
    constructor(host: ElementRef<HTMLElement>, ref: ChangeDetectorRef, navGroupService: VerticalNavGroupService | null);
    ngOnDestroy(): void;
}
