import { Observable } from 'rxjs';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { ClrLoadingState } from '../../utils/loading/loading';
export declare class DatagridIfExpandService extends IfExpandService {
    expandableId: string;
    private _replace;
    private _animate;
    constructor();
    get expanded(): boolean;
    set expanded(value: boolean);
    get replace(): Observable<boolean>;
    get animate(): Observable<void>;
    loadingStateChange(state: ClrLoadingState): void;
    setReplace(replaceValue: boolean): void;
}
