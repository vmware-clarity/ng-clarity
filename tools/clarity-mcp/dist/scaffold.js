/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolveComponent } from './resolve.js';
const MAX_SNIPPET = 6000;
function clamp(text) {
    return text.length > MAX_SNIPPET ? `${text.slice(0, MAX_SNIPPET)}\n/* …truncated… */` : text;
}
/** Best-effort granular NgModule name a lean consumer should import, e.g. datagrid -> ClrDatagridModule. */
export function toModuleName(componentName) {
    const pascal = componentName
        .trim()
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    return `Clr${pascal}Module`;
}
async function readIfExists(root, rel) {
    try {
        return await readFile(join(root, rel), 'utf8');
    }
    catch {
        return null;
    }
}
async function listDir(root, rel) {
    try {
        return await readdir(join(root, rel));
    }
    catch {
        return [];
    }
}
export async function collectRequiredModules(root, demoDirs) {
    const modules = new Set();
    for (const dir of demoDirs) {
        const files = await listDir(root, dir);
        const moduleFile = files.find(file => file.endsWith('.demo.module.ts'));
        if (!moduleFile) {
            continue;
        }
        const content = await readIfExists(root, `${dir}/${moduleFile}`);
        for (const match of content?.match(/Clr[A-Za-z0-9]*Module|ClarityModule/g) ?? []) {
            modules.add(match);
        }
    }
    return [...modules].sort();
}
async function buildFeature(root, demoDirs, storyDir, feature, notes) {
    for (const dir of demoDirs) {
        const rel = `${dir}/${feature}`;
        const files = await listDir(root, rel);
        if (files.length === 0) {
            continue;
        }
        const htmlFile = files.find(file => file.endsWith('.html'));
        const tsFile = files.find(file => file.endsWith('.ts') && !file.endsWith('.spec.ts'));
        const template = htmlFile ? await readIfExists(root, `${rel}/${htmlFile}`) : null;
        const ts = tsFile ? await readIfExists(root, `${rel}/${tsFile}`) : null;
        return {
            feature,
            sourceDir: rel,
            template: template ? clamp(template) : null,
            ts: ts ? clamp(ts) : null,
            storyFallback: null,
        };
    }
    notes.push(`Feature "${feature}" has no demo sub-folder; check Storybook stories.`);
    return { feature, sourceDir: null, template: null, ts: null, storyFallback: storyDir };
}
/**
 * Assemble a live usage blueprint for a Clarity component by reading its demos,
 * demo module, and Storybook stories from the repo. Reads only; writes nothing.
 */
export async function buildBlueprint(root, args) {
    const resolved = await resolveComponent(root, args.componentName, args.includeStorybook);
    const notes = [];
    if (resolved.demoDirs.length === 0) {
        notes.push(`No demo folder found for "${args.componentName}" under ${resolved.requested}; relying on Storybook and the API snapshot.`);
    }
    const requiredModules = await collectRequiredModules(root, resolved.demoDirs);
    const suggestedModule = toModuleName(args.componentName);
    const onlyUmbrella = requiredModules.every(name => name === 'ClarityModule');
    if (onlyUmbrella) {
        notes.push(`Demos import the umbrella ClarityModule; for a lean consumer bundle import the granular ${suggestedModule} instead (confirm the exact name in ${resolved.apiRefPath ?? 'the API snapshot'}).`);
    }
    const features = [];
    for (const feature of args.features) {
        features.push(await buildFeature(root, resolved.demoDirs, resolved.storyDir, feature, notes));
    }
    return {
        component: args.componentName,
        library: args.library,
        appStyle: args.appStyle,
        resolvedDemoDirs: resolved.demoDirs,
        requiredModules,
        suggestedModule,
        apiRefPath: resolved.apiRefPath,
        features,
        notes,
    };
}
