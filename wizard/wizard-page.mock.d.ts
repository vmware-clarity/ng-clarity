import { TemplateRef } from '@angular/core';
export declare class MockPage {
    id: string;
    disabled: boolean;
    current: boolean;
    completed: boolean;
    readyToComplete: boolean;
    hasError: boolean;
    navTitle: TemplateRef<any>;
    constructor(pageIndex: number);
    reset(): void;
}
