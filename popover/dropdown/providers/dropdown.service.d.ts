import { Optional } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class RootDropdownService {
    private _changes;
    get changes(): Observable<boolean>;
    closeMenus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RootDropdownService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RootDropdownService>;
}
export declare function clrRootDropdownFactory(existing: RootDropdownService): RootDropdownService;
export declare const ROOT_DROPDOWN_PROVIDER: {
    provide: typeof RootDropdownService;
    useFactory: typeof clrRootDropdownFactory;
    deps: Optional[][];
};
