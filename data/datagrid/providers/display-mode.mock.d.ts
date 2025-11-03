import { DisplayModeService } from './display-mode.service';
import { DatagridDisplayMode } from '../enums/display-mode.enum';
export declare class MockDisplayModeService extends DisplayModeService {
    updateView(mode: DatagridDisplayMode): void;
}
export declare const MOCK_DISPLAY_MODE_PROVIDER: {
    provide: typeof DisplayModeService;
    useClass: typeof MockDisplayModeService;
};
