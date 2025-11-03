import { EventEmitter } from '@angular/core';
export declare class ClrWizardHeaderAction {
    title: string;
    _id: string;
    disabled: boolean;
    headerActionClicked: EventEmitter<string>;
    get id(): string;
    click(): void;
}
