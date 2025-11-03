import { ClrFileMessagesTemplate, ClrFileMessagesTemplateContext } from './file-messages-template';
export declare class ClrFileList {
    protected readonly fileMessagesTemplate: ClrFileMessagesTemplate;
    private readonly injector;
    private readonly commonStrings;
    private readonly ngControlService;
    private readonly fileInputContainer;
    constructor();
    protected get files(): File[];
    protected getClearFileLabel(filename: string): string;
    protected clearFile(fileToRemove: File): void;
    protected createFileMessagesTemplateContext(file: File): ClrFileMessagesTemplateContext;
    protected createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext): import("@angular/core").DestroyableInjector;
}
