import { Observable } from 'rxjs';
import { ResponsiveNavControlMessage } from '../responsive-nav-control-message';
import * as i0 from "@angular/core";
export declare class ResponsiveNavigationService {
    responsiveNavList: number[];
    private registerNavSubject;
    private controlNavSubject;
    constructor();
    get registeredNavs(): Observable<number[]>;
    get navControl(): Observable<ResponsiveNavControlMessage>;
    registerNav(navLevel: number): void;
    isNavRegistered(navLevel: number): boolean;
    unregisterNav(navLevel: number): void;
    sendControlMessage(controlCode: string, navLevel: number): void;
    closeAllNavs(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResponsiveNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResponsiveNavigationService>;
}
