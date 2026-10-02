/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { stat } from 'node:fs/promises';
import { join } from 'node:path';

const DEMOS_BASE = 'projects/website/src/app/documentation/demos';
const STORIES_BASE = '.storybook/stories';
const API_BASE = 'projects/angular';

/**
 * Website demo folder names are NOT 1:1 with core component names. The map in
 * documentation-routes.ts is authoritative; this table encodes the known
 * divergences so a component name resolves to every demo folder that documents it.
 */
const NAME_ALIASES: Record<string, string[]> = {
  datagrid: ['datagrid', 'advanced-datagrid'],
  badge: ['badges'],
  button: ['buttons'],
  checkbox: ['checkboxes'],
  toggle: ['toggles'],
  spinner: ['spinners'],
  signpost: ['signposts'],
  tooltip: ['tooltips'],
  label: ['labels'],
  list: ['lists'],
  table: ['tables'],
  'progress-bar': ['progress-bars'],
  notification: ['notifications'],
  'file-input': ['file-picker'],
};

/** Component name -> generated public-API snapshot (domain grouping in @clr/angular). */
const API_DOMAINS: Record<string, string> = {
  datagrid: 'data/data.api.md',
  'tree-view': 'data/data.api.md',
  'stack-view': 'data/data.api.md',
  wizard: 'wizard/wizard.api.md',
  stepper: 'stepper/stepper.api.md',
  accordion: 'accordion/accordion.api.md',
  modal: 'modal/modal.api.md',
  popover: 'popover/popover.api.md',
  icon: 'icon/icon.api.md',
  button: 'button/button.api.md',
};

export interface ResolvedComponent {
  requested: string;
  demoDirs: string[];
  storyDir: string | null;
  apiRefPath: string | null;
}

async function statKind(root: string, rel: string): Promise<'dir' | 'file' | null> {
  try {
    const info = await stat(join(root, rel));
    return info.isDirectory() ? 'dir' : 'file';
  } catch {
    return null;
  }
}

function candidateNames(name: string): string[] {
  const aliases = NAME_ALIASES[name] ?? [name];
  return [...new Set([name, ...aliases])];
}

async function resolveApiRef(root: string, name: string): Promise<string | null> {
  const known = API_DOMAINS[name];
  if (known && (await statKind(root, `${API_BASE}/${known}`)) === 'file') {
    return `${API_BASE}/${known}`;
  }
  const fallback = `${API_BASE}/clarity.api.md`;
  if ((await statKind(root, fallback)) === 'file') {
    return fallback;
  }
  return null;
}

/**
 * Resolve a Clarity component name to the demo folders, Storybook folder, and API
 * snapshot that document it, checking the filesystem so results reflect reality.
 */
export async function resolveComponent(
  root: string,
  componentName: string,
  includeStorybook: boolean
): Promise<ResolvedComponent> {
  const name = componentName.trim().toLowerCase();
  const demoDirs: string[] = [];

  for (const candidate of candidateNames(name)) {
    const rel = `${DEMOS_BASE}/${candidate}`;
    if ((await statKind(root, rel)) === 'dir') {
      demoDirs.push(rel);
    }
  }

  if (demoDirs.length === 0) {
    const plural = `${DEMOS_BASE}/${name}s`;
    if ((await statKind(root, plural)) === 'dir') {
      demoDirs.push(plural);
    }
  }

  let storyDir: string | null = null;
  if (includeStorybook) {
    for (const candidate of candidateNames(name)) {
      const rel = `${STORIES_BASE}/${candidate}`;
      if ((await statKind(root, rel)) === 'dir') {
        storyDir = rel;
        break;
      }
    }
  }

  return {
    requested: componentName,
    demoDirs,
    storyDir,
    apiRefPath: await resolveApiRef(root, name),
  };
}
