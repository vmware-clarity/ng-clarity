/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  computed,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  Signal,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '@clr/angular/forms/common';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrFileInputContainer } from './file-input-container';

export interface ClrFileInputSelection {
  fileCount: number;
  buttonLabel: string;
  clearFilesButtonLabel: string;
}

@Directive({
  selector: 'input[type="file"][clrFileInput]',
  host: {
    tabindex: '-1', // Remove the hidden file `input` element from the tab order because the browse `button` replaces it.
    'aria-hidden': 'true', // Remove the hidden file `input` element from the accessibility tree because the browse `button` replaces it.
    '[class.clr-file-input]': 'true',
  },
  standalone: false,
})
export class ClrFileInput extends WrappedFormControl<ClrFileInputContainer> implements OnInit, OnDestroy {
  /** The selected files, in the order of the native input. */
  readonly files: Signal<readonly File[]>;

  private readonly selectedFiles = signal<readonly File[]>([]);

  private readonly selectionSummary = computed(() => this.summarize(this.files()));

  // A value assigned by the consumer, kept until the next selection change (as before).
  private readonly selectionOverride = signal<ClrFileInputSelection | undefined>(undefined);

  private readonly nativeRenderer = inject(Renderer2);

  private removeResetListener?: () => void;

  constructor(
    injector: Injector,
    renderer: Renderer2,
    viewContainerRef: ViewContainerRef,
    readonly elementRef: ElementRef<HTMLInputElement>,
    @Self() @Optional() private readonly control: NgControl,
    private readonly commonStrings: ClrCommonStringsService
  ) {
    super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);

    this.files = this.selectedFiles.asReadonly();
  }

  get selection(): ClrFileInputSelection | undefined {
    return this.selectionOverride() ?? this.selectionSummary();
  }
  set selection(value: ClrFileInputSelection | undefined) {
    this.selectionOverride.set(value);
  }

  override ngOnInit() {
    super.ngOnInit();

    // A native form reset clears the input without firing a `change` event.
    const form = this.elementRef.nativeElement.form;

    if (form) {
      this.removeResetListener = this.nativeRenderer.listen(form, 'reset', () => {
        // The `reset` event fires before the form controls are reset.
        queueMicrotask(() => this.updateSelection());
      });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.removeResetListener?.();
  }

  @HostListener('change')
  private handleChange() {
    this.updateSelection();
  }

  private updateSelection() {
    const files = this.elementRef.nativeElement.files;

    if (!files) {
      return;
    }

    const list = Array.from(files);

    this.selectedFiles.set(list);
    this.selectionOverride.set(undefined);
  }

  private summarize(files: readonly File[]): ClrFileInputSelection {
    let selectionButtonLabel = '';
    let clearFilesButtonLabel = '';

    if (files.length === 1) {
      const filename = files[0].name;

      selectionButtonLabel = filename;

      clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFile, {
        FILE: filename,
      });
    } else if (files.length > 1) {
      const fileCount = files.length.toString();

      selectionButtonLabel = this.commonStrings.parse(this.commonStrings.keys.fileCount, {
        COUNT: fileCount,
      });

      clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFiles, {
        COUNT: fileCount,
      });
    }

    return {
      fileCount: files.length,
      buttonLabel: selectionButtonLabel,
      clearFilesButtonLabel,
    };
  }
}
