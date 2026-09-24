/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  ClrComponentContext,
  ClrContextModule,
  ClrContextTrackerService,
  ClrMutationEngineService,
  ClrMutationOperation,
} from '@clr/angular/ai';
import { Subscription } from 'rxjs';

import { DEMO_HOSTS, DemoHost } from '../hosts';

/** A node in the page's snapshot that the mutation engine could write to. */
interface WritableTarget {
  ref: string;
  type: string;
  label: string;
}

/**
 * Drives the mutation engine against a form the way an agent's client would: the
 * controls on the left send one operation at a time, the form on the right shows what
 * that did, and the readout under it shows what the application's own model holds.
 */
@Component({
  selector: 'clr-contextual-mutation-demo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ClarityModule, ClrContextModule],
  templateUrl: './mutation.demo.html',
  styleUrls: ['./mutation.demo.scss'],
})
export class ContextualMutationDemo implements OnInit, OnDestroy {
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
    name: new FormControl(),
    age: new FormControl(),
    password: new FormControl(),
    description: new FormControl(),
    selectedOption: new FormControl(),
    selectedOptionCombobox: new FormControl(),
    datalist: new FormControl(),
    option1: new FormControl(),
    date: new FormControl(),
    radio: new FormControl(),
    toggle: new FormControl(),
    files: new FormControl(),
    range: new FormControl(50),
  });

  private trackingSubscription: Subscription | null = null;

  constructor(
    private contextTracker: ClrContextTrackerService,
    private mutationEngine: ClrMutationEngineService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // The refs an agent can use come from the latest snapshot, which the tracker keeps
    // current as the page changes.
    this.trackingSubscription = this.contextTracker.context$.subscribe(snapshot => {
      this.writableTargets = writableTargets(snapshot.components);
      if (!this.writableTargets.some(target => target.ref === this.targetRef)) {
        this.targetRef = this.writableTargets[0]?.ref ?? '';
      }
    });
    this.contextTracker.start({ snapshot: { maxComponents: 500 } });
  }

  ngOnDestroy(): void {
    this.trackingSubscription?.unsubscribe();
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

  /** The application's own model: the form group's value, the template-driven note, the selection. */
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

  /**
   * What an agent's client does: hand the engine the operation and show what came back.
   * The report's snapshot and change are left out here; the form itself shows the page
   * as it is now.
   */
  private applyOperation(operation: ClrMutationOperation): void {
    this.mutationResult = 'Applying…';
    this.mutationEngine.apply([operation]).then(report => {
      this.mutationResult = JSON.stringify(report.results, null, 2);
      this.changeDetectorRef.markForCheck();
    });
  }
}

/** Every node carrying a ref, in document order, with what the agent would call it. */
function writableTargets(nodes: ClrComponentContext[]): WritableTarget[] {
  return nodes.flatMap(node => [
    ...(node.ref ? [{ ref: node.ref, type: node.type, label: node.label ?? '' }] : []),
    ...writableTargets(node.children ?? []),
  ]);
}

/** A typed value where the text is JSON — an array, a boolean, a number — and the text otherwise. */
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
