import { InjectionToken } from '@angular/core';
import { ClrFileMessagesTemplateContext } from './file-messages-template';
export declare const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT: InjectionToken<ClrFileMessagesTemplateContext>;
export declare class ClrFileInfo {
}
export declare class ClrFileSuccess {
    protected readonly context: ClrFileMessagesTemplateContext;
}
export declare class ClrFileError {
}
