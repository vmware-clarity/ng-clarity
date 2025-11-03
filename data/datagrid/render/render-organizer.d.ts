import { Observable, Subject } from 'rxjs';
import { DatagridRenderStep } from '../enums/render-step.enum';
export declare class DatagridRenderOrganizer {
    protected _renderStep: Subject<DatagridRenderStep>;
    private alreadySized;
    get renderStep(): Observable<DatagridRenderStep>;
    filterRenderSteps(step: DatagridRenderStep): Observable<DatagridRenderStep>;
    resize(): void;
}
