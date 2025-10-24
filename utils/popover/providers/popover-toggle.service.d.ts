import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ClrPopoverToggleService {
    private _open;
    private _openChange;
    private _openEvent;
    private _openEventChange;
    private _popoverAligned;
    private _popoverVisible;
    get openChange(): Observable<boolean>;
    get popoverVisible(): Observable<boolean>;
    get openEvent(): Event;
    set openEvent(event: Event);
    get open(): boolean;
    set open(value: boolean);
    get originalEvent(): Event;
    get popoverAligned(): Observable<HTMLElement>;
    getEventChange(): Observable<Event>;
    /**
     * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
     * This is for instance the case of components that open on a click, but close on a click outside.
     */
    toggleWithEvent(event: any): void;
    popoverVisibleEmit(visible: boolean): void;
    popoverAlignedEmit(popoverNode: HTMLElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverToggleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrPopoverToggleService>;
}
