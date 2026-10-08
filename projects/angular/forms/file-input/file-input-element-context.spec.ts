/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';
import { ClrContextEngineService } from '@clr/angular/ai';
import { ClrComponentContext } from '@clr/angular/utils';

import { selectFiles } from './file-input.helpers';
import { ClrFileInputModule } from './file-input.module';

@Component({
  template: `
    <clr-file-input-container>
      <label>Statement</label>
      <input type="file" name="single" [(ngModel)]="model" clrFileInput />
    </clr-file-input-container>
  `,
  standalone: false,
})
class SingleFileTest {
  model: FileList;
}

@Component({
  template: `
    <clr-file-input-container>
      <label>Attachments</label>
      <input type="file" name="many" [(ngModel)]="model" clrFileInput multiple />
      <clr-control-helper>Up to three files</clr-control-helper>
      <clr-file-list></clr-file-list>
    </clr-file-input-container>
  `,
  standalone: false,
})
class FileListTest {
  model: FileList;
}

@Component({
  template: `
    <clr-file-input-container>
      <label>Statement</label>
      <input type="file" name="required" [(ngModel)]="model" clrFileInput required />
      <clr-control-helper>One PDF, up to 10 MB</clr-control-helper>
      <clr-control-error>Choose a statement to upload</clr-control-error>
    </clr-file-input-container>
  `,
  standalone: false,
})
class ValidatedFileTest {
  @ViewChild(NgModel) control: NgModel;
  model: FileList;
}

function findNode(nodes: ClrComponentContext[], element: string): ClrComponentContext | null {
  for (const node of nodes) {
    if (node.element === element) {
      return node;
    }
    const inside = findNode(node.children ?? [], element);
    if (inside) {
      return inside;
    }
  }
  return null;
}

describe('ClrFileInputContainer, as page-context tooling sees it', () => {
  let fixture: ComponentFixture<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrFileInputModule, FormsModule],
      declarations: [SingleFileTest, FileListTest, ValidatedFileTest],
    });
  });

  afterEach(() => fixture?.destroy());

  async function create(component: Type<unknown>, files: string[]): Promise<ClrComponentContext[]> {
    fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"][clrFileInput]');
    selectFiles(
      input,
      files.map(name => new File(['x'], name))
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return TestBed.inject(ClrContextEngineService).getSnapshot().components;
  }

  it('reports how many files are chosen, never their names', async () => {
    const components = await create(SingleFileTest, ['payslip-4111.pdf']);
    const node = findNode(components, 'clr-file-input-container');

    // The name is on the browse button and on the clear button's label.
    expect(fixture.nativeElement.textContent).toContain('payslip-4111.pdf');
    expect(node?.label).toBe('Statement');
    expect(node?.state).toEqual(jasmine.objectContaining({ fileCount: 1, redacted: true }));
    expect(JSON.stringify(components)).not.toContain('4111');
  });

  it('keeps the names in a file list from the snapshot too', async () => {
    const components = await create(FileListTest, ['a-4111.pdf', 'b-4222.pdf']);

    expect(findNode(components, 'clr-file-input-container')?.state?.['fileCount']).toBe(2);
    expect(JSON.stringify(components)).not.toContain('4111');
    expect(JSON.stringify(components)).not.toContain('4222');
  });

  it('keeps the names and how many there are from a consumer the application does not control', async () => {
    await create(FileListTest, ['a-4111.pdf', 'b-4222.pdf']);
    const engine = TestBed.inject(ClrContextEngineService);
    engine.enableGlobalAccess('testFileClrContext');
    try {
      const accessor = (window as unknown as Record<string, () => unknown>)['testFileClrContext'];
      const shared = JSON.stringify(accessor());

      expect(shared).toContain('clr-file-input-container');
      expect(shared).not.toMatch(/"(fileCount|itemCount)"|4111|4222/);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('keeps the helper text, and the error that says why the field is invalid', async () => {
    const helped = JSON.stringify(await create(ValidatedFileTest, []));

    expect(helped).toContain('One PDF, up to 10 MB');

    (fixture.componentInstance as ValidatedFileTest).control.control.markAsTouched();
    fixture.detectChanges();
    const components = TestBed.inject(ClrContextEngineService).getSnapshot().components;

    expect(JSON.stringify(components)).toContain('Choose a statement to upload');
    expect(findNode(components, 'clr-file-input-container')?.state).toEqual(
      jasmine.objectContaining({ fileCount: 0, redacted: true })
    );
  });

  it('leaves a file list out, how many entries it has as well as their names, and keeps the rest', async () => {
    const components = await create(FileListTest, ['a-4111.pdf']);

    expect(JSON.stringify(components)).not.toMatch(/"itemCount"|4111/);
    // What the walk found besides the list is kept.
    expect(JSON.stringify(components)).toContain('Up to three files');
  });
});
