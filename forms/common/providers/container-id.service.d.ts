import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * @TODO No idea why I need to use provideIn .. without I'm getting error that
 * ContainerIdService is not defined - But this must be optional service!?
 *
 * There is something wrong - will come back to investigate it when I have more time
 *
 */
export declare class ContainerIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContainerIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContainerIdService>;
}
