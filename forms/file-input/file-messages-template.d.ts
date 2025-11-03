import { TemplateRef } from '@angular/core';
import { ClrFileAcceptError, ClrFileMaxFileSizeError, ClrFileMinFileSizeError } from './file-input-validator-errors';
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
}
