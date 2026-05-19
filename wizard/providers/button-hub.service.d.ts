import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ButtonHubService {
    buttonsReady: boolean;
    private _previousBtnClicked;
    private _nextBtnClicked;
    private _dangerBtnClicked;
    private _cancelBtnClicked;
    private _finishBtnClicked;
    private _customBtnClicked;
    get previousBtnClicked(): Observable<void>;
    get nextBtnClicked(): Observable<void>;
    get dangerBtnClicked(): Observable<void>;
    get cancelBtnClicked(): Observable<void>;
    get finishBtnClicked(): Observable<void>;
    get customBtnClicked(): Observable<string>;
    buttonClicked(buttonType: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonHubService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonHubService>;
}
