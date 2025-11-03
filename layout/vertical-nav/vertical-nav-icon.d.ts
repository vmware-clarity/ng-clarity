import { OnDestroy } from '@angular/core';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
export declare class ClrVerticalNavIcon implements OnDestroy {
    private _verticalNavIconService;
    constructor(_verticalNavIconService: VerticalNavIconService);
    ngOnDestroy(): void;
}
