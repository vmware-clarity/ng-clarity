/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';

const REGISTRY_EXAMPLE = `
import { DestroyRef, inject, Injectable } from '@angular/core';
import { ClrContextRegistryService } from '@clr/angular/ai';

@Injectable({ providedIn: 'root' })
export class CreateVmWorkflow {
  step = 'compute-resource';
  vmName = '';

  constructor() {
    const unregister = inject(ClrContextRegistryService).register({
      getClrContext: () => ({
        type: 'workflow',
        label: 'Create virtual machine',
        state: { step: this.step, vmName: this.vmName },
        // Untrusted callers, such as embedded frames, see only these keys.
        publicKeys: ['step'],
      }),
    });
    inject(DestroyRef).onDestroy(unregister);
  }
}
`;

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-api-contextual-engine-demo',
  templateUrl: './api-contextual-engine.demo.html',
  imports: [CodeSnippetComponent],
})
export class ApiContextualEngineDemo {
  registryExample = REGISTRY_EXAMPLE;
}
