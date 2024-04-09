/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function selectFiles(fileInputElement: HTMLInputElement, files: File[]) {
  const dataTransfer = new DataTransfer();

  for (const file of files) {
    dataTransfer.items.add(file);
  }

  fileInputElement.files = dataTransfer.files;
  fileInputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

export function clearFiles(fileInputElement: HTMLInputElement) {
  fileInputElement.value = '';
  fileInputElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  fileInputElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}
