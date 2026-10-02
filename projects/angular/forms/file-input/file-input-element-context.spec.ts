/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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
      <clr-file-list></clr-file-list>
    </clr-file-input-container>
  `,
  standalone: false,
})
class FileListTest {
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
      declarations: [SingleFileTest, FileListTest],
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
});
