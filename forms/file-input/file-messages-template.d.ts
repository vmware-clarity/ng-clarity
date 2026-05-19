import { TemplateRef } from '@angular/core';
import { ClrFileAcceptError, ClrFileMaxFileSizeError, ClrFileMinFileSizeError } from './file-input-validator-errors';
import * as i0 from "@angular/core";
export interface ClrSingleFileValidationErrors {
    accept?: ClrFileAcceptError;
    minFileSize?: ClrFileMinFileSizeError;
    maxFileSize?: ClrFileMaxFileSizeError;
}
export interface ClrFileMessagesTemplateContext {
    $implicit: File;
    success: boolean;
    errors: ClrSingleFileValidationErrors;
}
export declare class ClrFileMessagesTemplate {
    readonly templateRef: TemplateRef<ClrFileMessagesTemplateContext>;
    static ngTemplateContextGuard(directive: ClrFileMessagesTemplate, context: unknown): context is ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileMessagesTemplate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileMessagesTemplate, "ng-template[clr-file-messages]", never, {}, {}, never, never, false, never>;
}
