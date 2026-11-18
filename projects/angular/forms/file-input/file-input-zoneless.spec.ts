/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClrCommonStringsService, commonStringsDefault } from '@clr/angular/utils';

import { buildFileList, selectFiles } from './file-input.helpers';
import { ClrFileInputModule } from './file-input.module';

const textFile = (name: string) => new File(['text'], name, { type: 'text/plain' });
const imageFile = (name: string) => new File(['image'], name, { type: 'image/png' });

@Component({
  template: `
    <clr-file-input-container [clrButtonLabel]="buttonLabel()">
      <label>File</label>
      <input type="file" clrFileInput [formControl]="control" multiple />
    </clr-file-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class BasicHost {
  readonly control = new FormControl<FileList>(null);
  readonly buttonLabel = signal<string>(undefined);
}

@Component({
  template: `
    <clr-file-input-container>
      <label>Files</label>
      <input
        type="file"
        clrFileInput
        [formControl]="control"
        accept="text/plain"
        [clrMaxFileSize]="maxFileSize()"
        multiple
      />
      @if (showList()) {
        <clr-file-list>
          @if (showMessages()) {
            <ng-template clr-file-messages let-file let-errors="errors">
              <clr-file-success>{{ file.name }} is valid</clr-file-success>
              @if (errors.accept) {
                <clr-file-error>{{ file.name }} has the wrong type</clr-file-error>
              }
              @if (errors.maxFileSize) {
                <clr-file-error>{{ file.name }} is too large</clr-file-error>
              }
            </ng-template>
          }
        </clr-file-list>
      }
    </clr-file-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class FileListHost {
  readonly control = new FormControl<FileList>(null);
  readonly maxFileSize = signal<number>(undefined);
  readonly showList = signal(true);
  readonly showMessages = signal(true);
}

@Component({
  template: `
    <clr-file-input-container>
      <label>File</label>
      <input type="file" clrFileInput [disabled]="disabled()" [accept]="accept()" [multiple]="multiple()" />
      <clr-file-list></clr-file-list>
    </clr-file-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class NativeAttributesHost {
  readonly disabled = signal(false);
  readonly accept = signal('');
  readonly multiple = signal(false);
}

describe('ClrFileInputContainer (zoneless, OnPush host)', () => {
  function setup<T>(host: new () => T) {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ClrFileInputModule],
      declarations: [host],
    });

    return TestBed.createComponent(host);
  }

  function query<E extends Element>(fixture: ComponentFixture<unknown>, selector: string): E {
    return fixture.nativeElement.querySelector(selector);
  }

  function fileInput(fixture: ComponentFixture<unknown>) {
    return query<HTMLInputElement>(fixture, 'input[clrFileInput]');
  }

  function browseButton(fixture: ComponentFixture<unknown>) {
    return query<HTMLButtonElement>(fixture, '.clr-file-input-browse-button');
  }

  function clearButton(fixture: ComponentFixture<unknown>) {
    return query<HTMLButtonElement>(fixture, '.clr-file-input-clear-button');
  }

  function fileListInput(fixture: ComponentFixture<unknown>) {
    return query<HTMLInputElement>(fixture, '.clr-file-input-wrapper > input.clr-file-input:not([clrFileInput])');
  }

  function fileNames(control: FormControl<FileList>) {
    return Array.from(control.value ?? []).map(file => file.name);
  }

  describe('without a file list', () => {
    let fixture: ComponentFixture<BasicHost>;

    beforeEach(async () => {
      fixture = setup(BasicHost);
      await fixture.whenStable();
    });

    it('shows the selected files in the browse button and the clear button', async () => {
      expect(browseButton(fixture).textContent.trim()).toBe('Browse');
      expect(clearButton(fixture)).toBeNull();

      selectFiles(fileInput(fixture), [textFile('report.txt')]);
      await fixture.whenStable();

      expect(browseButton(fixture).textContent.trim()).toBe('report.txt');
      expect(clearButton(fixture).getAttribute('aria-label')).toBe('Clear report.txt');

      selectFiles(fileInput(fixture), [textFile('a.txt'), textFile('b.txt')]);
      await fixture.whenStable();

      expect(browseButton(fixture).textContent.trim()).toBe('2 files');
      expect(clearButton(fixture).getAttribute('aria-label')).toBe('Clear 2 files');
    });

    it('renders a value set and reset from outside the template', async () => {
      await Promise.resolve().then(() =>
        fixture.componentInstance.control.setValue(buildFileList([textFile('a.txt')]))
      );
      await fixture.whenStable();

      expect(browseButton(fixture).textContent.trim()).toBe('a.txt');
      expect(clearButton(fixture)).not.toBeNull();

      await Promise.resolve().then(() => fixture.componentInstance.control.reset());
      await fixture.whenStable();

      expect(browseButton(fixture).textContent.trim()).toBe('Browse');
      expect(clearButton(fixture)).toBeNull();
    });

    it('clears the selection with the clear button', async () => {
      selectFiles(fileInput(fixture), [textFile('a.txt')]);
      await fixture.whenStable();

      clearButton(fixture).click();
      await fixture.whenStable();

      expect(fileNames(fixture.componentInstance.control)).toEqual([]);
      expect(browseButton(fixture).textContent.trim()).toBe('Browse');
      expect(clearButton(fixture)).toBeNull();
    });

    it('disables the browse button when the control is disabled from outside the template', async () => {
      await Promise.resolve().then(() => fixture.componentInstance.control.disable());
      await fixture.whenStable();

      expect(browseButton(fixture).disabled).toBe(true);
      expect(query(fixture, 'clr-file-input-container').classList).toContain('clr-form-control-disabled');

      await Promise.resolve().then(() => fixture.componentInstance.control.enable());
      await fixture.whenStable();

      expect(browseButton(fixture).disabled).toBe(false);
    });

    it('renders localized strings set after the first render', async () => {
      const commonStrings = TestBed.inject(ClrCommonStringsService);
      selectFiles(fileInput(fixture), [textFile('a.txt'), textFile('b.txt')]);
      await fixture.whenStable();

      try {
        commonStrings.localize({ fileCount: '{COUNT} Dateien', clearFiles: '{COUNT} Dateien entfernen' });
        await fixture.whenStable();

        expect(browseButton(fixture).textContent.trim()).toBe('2 Dateien');
        expect(clearButton(fixture).getAttribute('aria-label')).toBe('2 Dateien entfernen');

        selectFiles(fileInput(fixture), []);
        commonStrings.localize({ browse: 'Durchsuchen' });
        await fixture.whenStable();

        expect(browseButton(fixture).textContent.trim()).toBe('Durchsuchen');
      } finally {
        commonStrings.localize(commonStringsDefault);
      }
    });

    it('updates a custom button label', async () => {
      fixture.componentInstance.buttonLabel.set('Upload');
      await fixture.whenStable();

      expect(browseButton(fixture).textContent.trim()).toBe('Upload');
    });
  });

  describe('with a file list', () => {
    let fixture: ComponentFixture<FileListHost>;

    function listedFiles() {
      return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.clr-file-list-item')).map(item => {
        const name = item.querySelector('.clr-file-label').textContent.trim();
        const state = item.classList.contains('clr-success') ? 'success' : 'error';
        const messages = Array.from(item.querySelectorAll('clr-file-success, clr-file-error'))
          .filter((message: HTMLElement) => message.style.display !== 'none')
          .map(message => message.textContent.trim());

        return [name, state, ...messages].join(' | ');
      });
    }

    function clearFileButton(index: number) {
      return fixture.nativeElement.querySelectorAll('.clr-file-clear-button')[index] as HTMLButtonElement;
    }

    beforeEach(async () => {
      fixture = setup(FileListHost);
      await fixture.whenStable();
    });

    it('lists the selected files with their messages', async () => {
      selectFiles(fileInput(fixture), [textFile('b.txt'), imageFile('a.png')]);
      await fixture.whenStable();

      expect(listedFiles()).toEqual(['a.png | error | a.png has the wrong type', 'b.txt | success | b.txt is valid']);
      expect(browseButton(fixture).textContent.trim()).toBe('Browse');
      expect(clearButton(fixture)).toBeNull();
    });

    it('removes a file with its clear button', async () => {
      selectFiles(fileInput(fixture), [textFile('b.txt'), imageFile('a.png')]);
      await fixture.whenStable();

      clearFileButton(0).click();
      await fixture.whenStable();

      expect(listedFiles()).toEqual(['b.txt | success | b.txt is valid']);
      expect(fileNames(fixture.componentInstance.control)).toEqual(['b.txt']);
    });

    it('adds browsed files to the selection', async () => {
      selectFiles(fileInput(fixture), [textFile('a.txt'), textFile('b.txt')]);
      await fixture.whenStable();

      selectFiles(fileListInput(fixture), [imageFile('c.png'), textFile('a.txt')]);
      await fixture.whenStable();

      expect(fileNames(fixture.componentInstance.control)).toEqual(['c.png', 'a.txt', 'b.txt']);
      expect(listedFiles()).toEqual([
        'a.txt | success | a.txt is valid',
        'b.txt | success | b.txt is valid',
        'c.png | error | c.png has the wrong type',
      ]);
    });

    it('updates the file messages when validation changes without a new selection', async () => {
      selectFiles(fileInput(fixture), [textFile('a.txt')]);
      await fixture.whenStable();

      fixture.componentInstance.maxFileSize.set(1);
      await fixture.whenStable();
      fixture.componentInstance.control.updateValueAndValidity();
      await fixture.whenStable();

      expect(listedFiles()).toEqual(['a.txt | error | a.txt is too large']);
    });

    it('switches between the simple and the advanced layout when the file list is added late', async () => {
      fixture.componentInstance.showList.set(false);
      await fixture.whenStable();

      selectFiles(fileInput(fixture), [textFile('a.txt')]);
      await fixture.whenStable();

      expect(fileListInput(fixture)).toBeNull();
      expect(browseButton(fixture).textContent.trim()).toBe('a.txt');
      expect(clearButton(fixture)).not.toBeNull();

      fixture.componentInstance.showList.set(true);
      await fixture.whenStable();

      expect(fileListInput(fixture)).not.toBeNull();
      expect(browseButton(fixture).textContent.trim()).toBe('Browse');
      expect(clearButton(fixture)).toBeNull();
      expect(listedFiles()).toEqual(['a.txt | success | a.txt is valid']);

      fixture.componentInstance.showList.set(false);
      await fixture.whenStable();

      expect(fileListInput(fixture)).toBeNull();
      expect(browseButton(fixture).textContent.trim()).toBe('a.txt');
    });

    it('renders a file messages template added late', async () => {
      fixture.componentInstance.showMessages.set(false);
      await fixture.whenStable();

      selectFiles(fileInput(fixture), [imageFile('a.png')]);
      await fixture.whenStable();

      expect(listedFiles()).toEqual(['a.png | error']);

      fixture.componentInstance.showMessages.set(true);
      await fixture.whenStable();

      expect(listedFiles()).toEqual(['a.png | error | a.png has the wrong type']);
    });

    it('ignores selection changes after it is destroyed', async () => {
      const input = fileInput(fixture);
      selectFiles(input, [textFile('a.txt')]);
      await fixture.whenStable();

      fixture.destroy();

      expect(() => selectFiles(input, [textFile('b.txt')])).not.toThrow();
      expect(() => fixture.componentInstance.control.reset()).not.toThrow();
    });
  });

  describe('native input attributes', () => {
    let fixture: ComponentFixture<NativeAttributesHost>;

    beforeEach(async () => {
      fixture = setup(NativeAttributesHost);
      await fixture.whenStable();
    });

    it('disables the browse button with the native input', async () => {
      const container = query<HTMLElement>(fixture, 'clr-file-input-container');

      fixture.componentInstance.disabled.set(true);
      await fixture.whenStable();

      expect(browseButton(fixture).disabled).toBe(true);
      expect(fileListInput(fixture).disabled).toBe(true);
      expect(container.classList).toContain('clr-form-control-disabled');

      fixture.componentInstance.disabled.set(false);
      await fixture.whenStable();

      expect(browseButton(fixture).disabled).toBe(false);
      expect(container.classList).not.toContain('clr-form-control-disabled');
    });

    it('passes accept and multiple to the file list input', async () => {
      fixture.componentInstance.accept.set('image/*');
      fixture.componentInstance.multiple.set(true);
      await fixture.whenStable();

      expect(fileListInput(fixture).accept).toBe('image/*');
      expect(fileListInput(fixture).multiple).toBe(true);

      fixture.componentInstance.multiple.set(false);
      await fixture.whenStable();

      expect(fileListInput(fixture).multiple).toBe(false);
    });
  });
});
