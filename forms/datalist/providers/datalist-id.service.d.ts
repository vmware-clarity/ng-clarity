import { Observable } from 'rxjs';
export declare class DatalistIdService {
    private _id;
    private _idChange;
    get id(): string;
    set id(value: string);
    get idChange(): Observable<string>;
}
