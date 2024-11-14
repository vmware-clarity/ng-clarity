/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function buildFileList(files: File[]) {
  const dataTransfer = new DataTransfer();

  for (const file of files) {
    dataTransfer.items.add(file);
  }

  return dataTransfer.files;
}

export function selectFiles(fileInputElement: HTMLInputElement, files: File[] | FileList) {
  fileInputElement.files = files instanceof FileList ? files : buildFileList(files);
  fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

export function clearFiles(fileInputElement: HTMLInputElement) {
  fileInputElement.value = '';
  fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
