import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrWizardHeaderAction {
    title: string;
    _id: string;
    disabled: boolean;
    headerActionClicked: EventEmitter<string>;
    get id(): string;
    click(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardHeaderAction, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardHeaderAction, "clr-wizard-header-action", never, { "title": "title"; "_id": "id"; "disabled": "clrWizardHeaderActionDisabled"; }, { "headerActionClicked": "actionClicked"; }, never, ["*"], false, never>;
}
