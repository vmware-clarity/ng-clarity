import * as i0 from '@angular/core';
import { TemplateRef, Injector, ElementRef, Renderer2, ViewContainerRef, InjectionToken } from '@angular/core';
import { NgControl, Validator, AbstractControl, ValidationErrors, ControlValueAccessor } from '@angular/forms';
import * as i10 from '@clr/angular/forms/common';
import { ClrAbstractContainer, WrappedFormControl } from '@clr/angular/forms/common';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i8 from '@angular/common';
import * as i9 from '@clr/angular/icon';

interface ClrFileListValidationErrors {
    required?: boolean;
    accept?: ClrFileAcceptError[];
    minFileSize?: ClrFileMinFileSizeError[];
    maxFileSize?: ClrFileMaxFileSizeError[];
}
interface ClrFileAcceptError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The file types that are accepted by the file input.
     */
    accept: string[];
    /**
     * The actual MIME type of the selected file.
     */
    type: string;
    /**
     * The actual extension of the selected file.
     */
    extension: string;
}
interface ClrFileMinFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The minimum file size that is accepted by the file input.
     */
    minFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}
interface ClrFileMaxFileSizeError {
    /**
     * The name of the selected file.
     */
    name: string;
    /**
     * The maximum file size that is accepted by the file input.
     */
    maxFileSize: number;
    /**
     * The actual size of the selected file.
     */
    actualFileSize: number;
}

interface ClrSingleFileValidationErrors {
    accept?: ClrFileAcceptError;
    minFileSize?: ClrFileMinFileSizeError;
    maxFileSize?: ClrFileMaxFileSizeError;
}
interface ClrFileMessagesTemplateContext {
    $implicit: File;
    success: boolean;
    errors: ClrSingleFileValidationErrors;
}
declare class ClrFileMessagesTemplate {
    readonly templateRef: TemplateRef<ClrFileMessagesTemplateContext>;
    static ngTemplateContextGuard(directive: ClrFileMessagesTemplate, context: unknown): context is ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileMessagesTemplate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileMessagesTemplate, "ng-template[clr-file-messages]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileList {
    protected readonly fileMessagesTemplate: ClrFileMessagesTemplate;
    protected injectorCache: Map<File, Injector>;
    private contextCache;
    private readonly injector;
    private readonly commonStrings;
    private readonly ngControlService;
    private readonly fileInputContainer;
    constructor();
    protected get files(): File[];
    protected getClearFileLabel(filename: string): string;
    protected clearFile(fileToRemove: File): void;
    protected createFileMessagesTemplateContext(file: File): ClrFileMessagesTemplateContext;
    private createFileMessagesTemplateInjector;
    private errorsEqual;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileList, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileList, "clr-file-list", never, {}, {}, ["fileMessagesTemplate"], never, false, never>;
}

declare class ClrFileInputContainer extends ClrAbstractContainer {
    customButtonLabel: string;
    readonly fileInput: ClrFileInput;
    protected readonly fileList: ClrFileList;
    private browseButtonElementRef;
    private fileListFileInputElementRef;
    private readonly fileSuccessComponent;
    private readonly fileErrorComponent;
    private readonly commonStrings;
    protected get accept(): string;
    protected get multiple(): boolean;
    protected get disabled(): boolean;
    protected get browseButtonText(): string;
    protected get browseButtonDescribedBy(): string;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    focusBrowseButton(): void;
    protected browse(): void;
    protected clearSelectedFiles(): void;
    protected addFilesToSelection(newFiles: FileList): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInputContainer, "clr-file-input-container", never, { "customButtonLabel": { "alias": "clrButtonLabel"; "required": false; }; }, {}, ["fileInput", "fileList", "fileSuccessComponent", "fileErrorComponent"], ["label", "[clrFileInput]", "clr-control-helper", "clr-control-error", "clr-control-success", "clr-file-list"], false, never>;
}

interface ClrFileInputSelection {
    fileCount: number;
    buttonLabel: string;
    clearFilesButtonLabel: string;
}
declare class ClrFileInput extends WrappedFormControl<ClrFileInputContainer> {
    readonly elementRef: ElementRef<HTMLInputElement>;
    private readonly control;
    private readonly commonStrings;
    selection: ClrFileInputSelection;
    constructor(injector: Injector, renderer: Renderer2, viewContainerRef: ViewContainerRef, elementRef: ElementRef<HTMLInputElement>, control: NgControl, commonStrings: ClrCommonStringsService);
    private handleChange;
    private updateSelection;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInput, [null, null, null, null, { optional: true; self: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInput, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrFileInputValidator implements Validator {
    private readonly elementRef;
    minFileSize: number;
    maxFileSize: number;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    validate(control: AbstractControl<FileList>): ValidationErrors;
    private getSuffixByDepth;
    private validateAccept;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValidator, "input[type=\"file\"][clrFileInput]", never, { "minFileSize": { "alias": "clrMinFileSize"; "required": false; }; "maxFileSize": { "alias": "clrMaxFileSize"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrFileInputValueAccessor implements ControlValueAccessor {
    private readonly elementRef;
    constructor(elementRef: ElementRef<HTMLInputElement>);
    writeValue(value: FileList): void;
    registerOnChange(fn: (value: FileList) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    private handleChange;
    private onChange;
    private onTouched;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrFileInputValueAccessor, "input[type=\"file\"][clrFileInput]", never, {}, {}, never, never, false, never>;
}

declare const CLR_FILE_MESSAGES_TEMPLATE_CONTEXT: InjectionToken<ClrFileMessagesTemplateContext>;
declare class ClrFileInfo {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInfo, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInfo, "clr-file-info", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileSuccess {
    protected readonly context: ClrFileMessagesTemplateContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileSuccess, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileSuccess, "clr-file-success", never, {}, {}, never, ["*"], false, never>;
}
declare class ClrFileError {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileError, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileError, "clr-file-error", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrFileInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrFileInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrFileInputModule, [typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError], [typeof i8.CommonModule, typeof i9.ClrIcon, typeof i10.ClrCommonFormsModule], [typeof i10.ClrCommonFormsModule, typeof ClrFileInput, typeof ClrFileInputContainer, typeof ClrFileInputValidator, typeof ClrFileInputValueAccessor, typeof ClrFileList, typeof ClrFileMessagesTemplate, typeof ClrFileInfo, typeof ClrFileSuccess, typeof ClrFileError]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrFileInputModule>;
}

declare function buildFileList(files: File[]): FileList;
declare function selectFiles(fileInputElement: HTMLInputElement, files: File[] | FileList): void;
declare function clearFiles(fileInputElement: HTMLInputElement): void;

export { CLR_FILE_MESSAGES_TEMPLATE_CONTEXT, ClrFileError, ClrFileInfo, ClrFileInput, ClrFileInputContainer, ClrFileInputModule, ClrFileInputValidator, ClrFileInputValueAccessor, ClrFileList, ClrFileMessagesTemplate, ClrFileSuccess, buildFileList, clearFiles, selectFiles };
export type { ClrFileAcceptError, ClrFileInputSelection, ClrFileListValidationErrors, ClrFileMaxFileSizeError, ClrFileMessagesTemplateContext, ClrFileMinFileSizeError, ClrSingleFileValidationErrors };
