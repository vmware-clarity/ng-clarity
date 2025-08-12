import { ClrAbstractContainer } from '../common/abstract-container';
import { ClrFileInput } from './file-input';
import { ClrFileList } from './file-list';
import * as i0 from "@angular/core";
export declare class ClrFileInputContainer extends ClrAbstractContainer {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrFileInputContainer, "clr-file-input-container", never, { "customButtonLabel": "clrButtonLabel"; }, {}, ["fileInput", "fileList", "fileSuccessComponent", "fileErrorComponent"], ["label", "[clrFileInput]", "clr-control-helper", "clr-control-error", "clr-control-success", "clr-file-list"], false, never>;
}
