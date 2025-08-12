import { Observable, Subject } from 'rxjs';
import { DatagridRenderStep } from '../enums/render-step.enum';
import * as i0 from "@angular/core";
export declare class DatagridRenderOrganizer {
    protected _renderStep: Subject<DatagridRenderStep>;
    private alreadySized;
    get renderStep(): Observable<DatagridRenderStep>;
    filterRenderSteps(step: DatagridRenderStep): Observable<DatagridRenderStep>;
    resize(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRenderOrganizer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridRenderOrganizer>;
}
