import { Observable } from 'rxjs';
export declare class SignpostIdService {
    private _id;
    get id(): Observable<string>;
    setId(id: string): void;
}
