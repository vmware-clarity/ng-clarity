import { Injector } from '@angular/core';
import { ClrFileMessagesTemplate, ClrFileMessagesTemplateContext } from './file-messages-template';
import * as i0 from "@angular/core";
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
    protected createFileMessagesTemplateInjector(fileMessagesTemplateContext: ClrFileMessagesTemplateContext): Injector;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileList, "clr-file-list", never, {}, {}, ["fileMessagesTemplate"], never, false, never>;
}
