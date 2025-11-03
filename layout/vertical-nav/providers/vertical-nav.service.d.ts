import { Observable } from 'rxjs';
export declare class VerticalNavService {
    private _animateOnCollapsed;
    private _collapsedChanged;
    private _collapsed;
    private _collapsible;
    get animateOnCollapsed(): Observable<boolean>;
    get collapsedChanged(): Observable<boolean>;
    get collapsed(): boolean;
    set collapsed(value: boolean);
    get collapsible(): boolean;
    set collapsible(value: boolean);
    private updateCollapseBehavior;
}
