import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatagridDisplayMode } from '../enums/display-mode.enum';
import { DatagridRenderOrganizer } from '../render/render-organizer';
export declare class DisplayModeService implements OnDestroy {
    protected _view: BehaviorSubject<DatagridDisplayMode>;
    private subscriptions;
    constructor(renderOrganizer: DatagridRenderOrganizer);
    get view(): Observable<DatagridDisplayMode>;
    ngOnDestroy(): void;
}
