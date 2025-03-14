import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatagridDisplayMode } from '../enums/display-mode.enum';
import { DatagridRenderOrganizer } from '../render/render-organizer';
import * as i0 from "@angular/core";
export declare class DisplayModeService implements OnDestroy {
    protected _view: BehaviorSubject<DatagridDisplayMode>;
    private subscriptions;
    constructor(renderOrganizer: DatagridRenderOrganizer);
    get view(): Observable<DatagridDisplayMode>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DisplayModeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DisplayModeService>;
}
