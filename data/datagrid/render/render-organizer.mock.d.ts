import { Subject } from 'rxjs';
import { DatagridRenderOrganizer } from './render-organizer';
import { DatagridRenderStep } from '../enums/render-step.enum';
/**
 * Mock that gives direct access to the subjects, to trigger specific parts of the render cycle.
 */
export declare class MockDatagridRenderOrganizer extends DatagridRenderOrganizer {
    get updateRenderStep(): Subject<DatagridRenderStep>;
}
export declare const MOCK_ORGANIZER_PROVIDER: {
    provide: typeof DatagridRenderOrganizer;
    useClass: typeof MockDatagridRenderOrganizer;
};
