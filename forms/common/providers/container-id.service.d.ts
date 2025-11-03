import { Observable } from 'rxjs';
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
}
