import { Observable } from 'rxjs';
export declare class StateDebouncer {
    private nbChanges;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    private _change;
    get change(): Observable<void>;
    changeStart(): void;
    changeDone(): void;
}
