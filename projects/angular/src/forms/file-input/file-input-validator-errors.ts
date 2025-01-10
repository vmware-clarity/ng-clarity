/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
