/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { ClrContextService } from './providers/contextual-engine.service';
import { capSnapshotOptions, resolveSnapshotOptions } from './snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues, withoutUrlDetails } from './untrusted-options';

interface EngineInternals {
  scope: ClrContextSnapshotOptions;
  read(options: ClrContextSnapshotOptions | undefined, untrusted: boolean): ClrPageContext;
}

/**
 * What a caller the application does not control is told, for specs: the engine's untrusted read, held to the
 * application's options, without what the user entered and with only the route pattern of the address.
 */
export function untrustedSnapshot(engine: ClrContextService, options?: unknown): ClrPageContext {
  const internals = engine as unknown as EngineInternals;
  const ceiling = resolveSnapshotOptions(internals.scope);
  const snapshot = internals.read(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), true);
  return withoutUrlDetails(withoutFormValues(snapshot));
}
