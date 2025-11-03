import { Optional } from '@angular/core';
import { Observable } from 'rxjs';
export declare class RootDropdownService {
    private _changes;
    get changes(): Observable<boolean>;
    closeMenus(): void;
}
export declare function clrRootDropdownFactory(existing: RootDropdownService): RootDropdownService;
export declare const ROOT_DROPDOWN_PROVIDER: {
    provide: typeof RootDropdownService;
    useFactory: typeof clrRootDropdownFactory;
    deps: Optional[][];
};
