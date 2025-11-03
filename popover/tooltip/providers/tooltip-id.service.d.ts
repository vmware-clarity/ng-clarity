import { Observable } from 'rxjs';
export declare class TooltipIdService {
    private _id;
    get id(): Observable<string>;
    updateId(id: string): void;
}
