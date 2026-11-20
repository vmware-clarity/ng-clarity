/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  ClrComponentContext,
  ClrContext,
  ClrContextService,
  ClrMutationOperation,
  ClrMutationService,
} from '@clr/angular/ai';

import { DEMO_HOSTS, DemoHost } from '../hosts';

interface WritableTarget {
  ref: string;
  type: string;
  label: string;
}

/** Drives the mutation engine against a form the way an agent's client would. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-contextual-mutation-demo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ClarityModule, ClrContext],
  templateUrl: './mutation.demo.html',
  styleUrls: ['./mutation.demo.scss'],
})
export class ContextualMutationDemo implements OnInit {
  hosts: DemoHost[] = DEMO_HOSTS;
  selectedHosts: DemoHost[] = [];
  note = '';
  noteChanges = 0;
  writableTargets: WritableTarget[] = [];
  targetRef = '';
  proposedValue = '';
  routePath = '';
  mutationResult = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null, [Validators.min(1), Validators.max(64)]),
    password: new FormControl(),
    description: new FormControl(),
    selectedOption: new FormControl(),
    selectedOptionCombobox: new FormControl(),
    datalist: new FormControl(),
    option1: new FormControl(false),
    date: new FormControl(),
    radio: new FormControl(),
    toggle: new FormControl(true),
    files: new FormControl(),
    range: new FormControl(50),
  });

  constructor(
    private context: ClrContextService,
    private mutationEngine: ClrMutationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.readTargets();
  }

  /** Reads the page for the controls an agent could write to. */
  async readTargets(): Promise<void> {
    const snapshot = await this.context.snapshot({ maxComponents: 500 });
    this.writableTargets = writableTargets(snapshot.components);
    if (!this.writableTargets.some(target => target.ref === this.targetRef)) {
      this.targetRef = this.writableTargets[0]?.ref ?? '';
    }
    this.changeDetectorRef.markForCheck();
  }

  setValue(): void {
    this.applyOperation({
      operation: 'setValue',
      ref: this.targetRef,
      description: this.descriptionOf(this.targetRef),
      value: proposal(this.proposedValue),
    });
  }

  clearValue(): void {
    this.applyOperation({ operation: 'clear', ref: this.targetRef, description: this.descriptionOf(this.targetRef) });
  }

  navigate(): void {
    this.applyOperation({ operation: 'navigate', path: this.routePath.trim() });
  }

  onNoteChange(value: string): void {
    this.note = value;
    this.noteChanges++;
  }

  readout(): string {
    const { files, password, ...values } = this.form.value;
    return JSON.stringify(
      {
        form: { ...values, password: password ? '•'.repeat(String(password).length) : password, files },
        status: this.form.status,
        note: this.note,
        selectedHosts: this.selectedHosts.map(host => host.name),
      },
      null,
      2
    );
  }

  private descriptionOf(ref: string): string {
    return this.writableTargets.find(target => target.ref === ref)?.label ?? '';
  }

  private applyOperation(operation: ClrMutationOperation): void {
    this.mutationResult = 'Applying…';
    this.mutationEngine.apply([operation]).then(report => {
      this.mutationResult = JSON.stringify(report.results, null, 2);
      this.changeDetectorRef.markForCheck();
      this.readTargets();
    });
  }
}

function writableTargets(nodes: ClrComponentContext[]): WritableTarget[] {
  return nodes.flatMap(node => [
    ...(node.ref ? [{ ref: node.ref, type: node.type, label: node.label ?? '' }] : []),
    ...writableTargets(node.children ?? []),
  ]);
}

function proposal(text: string): unknown {
  const trimmed = text.trim();
  if (/^(\[|true$|false$|null$|-?\d+(\.\d+)?$)/.test(trimmed)) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return text;
    }
  }
  return text;
}
