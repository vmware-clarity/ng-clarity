import { Observable } from 'rxjs';
import { ModalStackService } from '../../../modal/modal-stack.service';
import * as i0 from "@angular/core";
export declare class DetailService {
    private readonly modalStackService;
    id: string;
    private preventScroll;
    private toggleState;
    private cache;
    private button;
    private _enabled;
    private _state;
    constructor(modalStackService: ModalStackService);
    get enabled(): boolean;
    set enabled(state: boolean);
    get preventFocusScroll(): boolean;
    set preventFocusScroll(preventScroll: boolean);
    get state(): any;
    get stateChange(): Observable<boolean | null>;
    get isOpen(): boolean;
    open(item: any, button?: HTMLButtonElement): void;
    close(): void;
    returnFocus(): void;
    toggle(item: any, button?: HTMLButtonElement): void;
    isRowOpen(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DetailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DetailService>;
}
