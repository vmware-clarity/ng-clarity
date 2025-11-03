import { Observable } from 'rxjs';
export declare class VerticalNavGroupService {
    private _expandChange;
    get expandChange(): Observable<boolean>;
    expand(): void;
}
