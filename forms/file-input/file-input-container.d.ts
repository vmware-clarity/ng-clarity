import { ClrFileInput } from './file-input';
import { ClrFileList } from './file-list';
import { ClrAbstractContainer } from '../common/abstract-container';
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
}
