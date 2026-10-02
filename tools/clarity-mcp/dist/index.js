/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';
import { buildBlueprint } from './scaffold.js';
const run = promisify(execFile);
const ROOT = process.env.CLARITY_REPO_ROOT ?? process.cwd();
const OUTPUT_LIMIT = 12000;
const server = new McpServer({ name: 'clarity', version: '0.1.0' });
server.registerTool('scaffold_clarity_component', {
    title: 'Scaffold Clarity component usage',
    description: 'Assemble a live, best-practice usage blueprint for a Clarity (@clr/angular or @clr/addons) ' +
        'component by reading its docs, demos, and Storybook stories from projects/website. ' +
        'Returns structured JSON; writes nothing to disk.',
    inputSchema: {
        componentName: z.string().min(1).describe('Clarity component name, e.g. "datagrid", "combobox", "wizard".'),
        features: z
            .array(z.string())
            .default([])
            .describe('Feature sub-examples to include, e.g. ["pagination", "virtual-scroll"].'),
        library: z.enum(['angular', 'addons']).default('angular').describe('Which package the component belongs to.'),
        appStyle: z
            .enum(['standalone', 'ngmodule'])
            .default('standalone')
            .describe("Style of the consumer's generated wrapper (Clarity itself is always imported as an NgModule)."),
        includeStorybook: z
            .boolean()
            .default(true)
            .describe('Mine .storybook stories for variants when a demo sub-folder is missing.'),
    },
}, async (args) => {
    const blueprint = await buildBlueprint(ROOT, args);
    return { content: [{ type: 'text', text: JSON.stringify(blueprint, null, 2) }] };
});
/** Register an allowlisted repo script as a shell tool (no arbitrary command execution). */
function registerScript(name, title, command, commandArgs) {
    server.registerTool(name, { title, inputSchema: {} }, async () => {
        try {
            const { stdout, stderr } = await run(command, commandArgs, { cwd: ROOT, maxBuffer: 8 * 1024 * 1024 });
            return { content: [{ type: 'text', text: `${stdout}${stderr}`.slice(-OUTPUT_LIMIT) }] };
        }
        catch (error) {
            const err = error;
            const text = `${err.stdout ?? ''}${err.stderr ?? ''}` || err.message || String(error);
            return { isError: true, content: [{ type: 'text', text: text.slice(-OUTPUT_LIMIT) }] };
        }
    });
}
registerScript('clarity_lint', 'Run repo lint (eslint)', 'npx', ['eslint', '.']);
registerScript('clarity_test', 'Test @clr/angular (CI mode)', 'npx', ['ng', 'test', 'clr-angular', '--configuration=ci']);
registerScript('clarity_public_api_check', 'Verify public API snapshot', 'node', ['scripts/api-extractor.js']);
const transport = new StdioServerTransport();
await server.connect(transport);
