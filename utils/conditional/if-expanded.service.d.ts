import { Observable, Subject } from 'rxjs';
import { ClrLoadingState } from '../loading/loading';
import { LoadingListener } from '../loading/loading-listener';
import * as i0 from "@angular/core";
export declare class IfExpandService implements LoadingListener {
    expandable: number;
    hasExpandTemplate: boolean;
    protected _loading: boolean;
    protected _expanded: boolean;
    protected _expandChange: Subject<boolean>;
    get loading(): boolean;
    set loading(value: boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    get expandChange(): Observable<boolean>;
    toggle(): void;
    loadingStateChange(state: ClrLoadingState): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfExpandService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfExpandService>;
}
