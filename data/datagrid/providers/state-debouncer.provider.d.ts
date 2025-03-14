import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class StateDebouncer {
    private nbChanges;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    private _change;
    get change(): Observable<void>;
    changeStart(): void;
    changeDone(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateDebouncer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateDebouncer>;
}
