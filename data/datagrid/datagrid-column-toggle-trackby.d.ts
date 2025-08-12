/**
 * This file prevents an import cycle.
 */
import { TrackByFunction } from '@angular/core';
import { ColumnState } from './interfaces/column-state.interface';
export declare const columnToggleTrackByFn: TrackByFunction<ColumnState>;
