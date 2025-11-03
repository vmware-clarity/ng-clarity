import { Observable } from 'rxjs';
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
}
