import { AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
export declare class WillyWonka implements AfterViewChecked {
    disableChocolateCheck: boolean;
    private _chocolate;
    get chocolate(): Observable<void>;
    ngAfterViewChecked(): void;
}
