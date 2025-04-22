import { Observable } from 'rxjs';
import { ClrButton } from '../button-group/button';
import * as i0 from "@angular/core";
export declare class ButtonInGroupService {
    private _changes;
    get changes(): Observable<ClrButton>;
    updateButtonGroup(button: ClrButton): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonInGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonInGroupService>;
}
