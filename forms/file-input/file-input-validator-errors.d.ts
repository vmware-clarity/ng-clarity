export interface ClrFileListValidationErrors {
    required?: boolean;
    accept?: ClrFileAcceptError[];
    minFileSize?: ClrFileMinFileSizeError[];
    maxFileSize?: ClrFileMaxFileSizeError[];
}
export interface ClrFileAcceptError {
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
export interface ClrFileMinFileSizeError {
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
export interface ClrFileMaxFileSizeError {
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
