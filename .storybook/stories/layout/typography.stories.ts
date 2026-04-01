/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Layout/Typography',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
};

// ─── Headings ─────────────────────────────────────────────────────────────────

const HeadingsTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:lg">
      <p cds-text="display">The five boxing wizards jump quickly (display)</p>
      <p cds-text="headline">The five boxing wizards jump quickly (headline)</p>
      <p cds-text="title">The five boxing wizards jump quickly (title)</p>
      <p cds-text="section">The five boxing wizards jump quickly (section)</p>
      <p cds-text="subsection">The five boxing wizards jump quickly (subsection)</p>
    </div>
  `,
});

export const Headings: StoryObj = { render: HeadingsTemplate };

// ─── Content ──────────────────────────────────────────────────────────────────

const ContentTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="body">The quick brown fox jumps over the lazy dog. (body)</p>
      <p cds-text="message">The quick brown fox jumps over the lazy dog. (message)</p>
      <p cds-text="secondary">The quick brown fox jumps over the lazy dog. (secondary)</p>
      <p cds-text="caption">The quick brown fox jumps over the lazy dog. (caption)</p>
      <p cds-text="smallcaption">The quick brown fox jumps over the lazy dog. (smallcaption)</p>
    </div>
  `,
});

export const Content: StoryObj = { render: ContentTemplate };

// ─── Font Weights ─────────────────────────────────────────────────────────────

const WeightsTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="body light">The quick brown foxes <em>lightly</em> jump over the lazy dog. (light)</p>
      <p cds-text="body regular">The quick brown foxes <em>regularly</em> jump over the lazy dog. (regular)</p>
      <p cds-text="body medium">The quick brown foxes <em>mediumly</em> jump over the lazy dog. (medium)</p>
      <p cds-text="body semibold">The quick brown foxes <em>semi-boldly</em> jump over the lazy dog. (semibold)</p>
      <p cds-text="body bold">The quick brown foxes <em>boldly</em> jump over the lazy dog. (bold)</p>
      <p cds-text="body extrabold">The quick brown foxes <em>extra-boldly</em> jump over the lazy dog. (extrabold)</p>
    </div>
  `,
});

export const Weights: StoryObj = { render: WeightsTemplate };

// ─── Text Alignment ───────────────────────────────────────────────────────────

const AlignmentTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md container:sm">
      <p cds-text="body left">Text Left (left)</p>
      <p cds-text="body right">Text Right (right)</p>
      <p cds-text="body center">Text Center (center)</p>
      <p cds-text="body justify">
        Text Justify: The quick brown fox jumps over the lazy dog.
        The quick brown fox jumps over the lazy dog. (justify)
      </p>
    </div>
  `,
});

export const Alignment: StoryObj = { render: AlignmentTemplate };

// ─── Text Transforms ──────────────────────────────────────────────────────────

const TransformsTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="body capitalize">text title case (capitalize)</p>
      <p cds-text="body uppercase">text uppercase (uppercase)</p>
      <p cds-text="body lowercase">TEXT LOWERCASE (lowercase)</p>
      <p cds-text="body truncate" cds-layout="container:xs">
        Text Truncation: The quick brown fox jumps over the lazy dog. (truncate)
      </p>
    </div>
  `,
});

export const Transforms: StoryObj = { render: TransformsTemplate };

// ─── Links ────────────────────────────────────────────────────────────────────

const LinksTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="body">
        The <a href="#" cds-text="link">quick brown fox</a> jumps over the lazy dog. (link)
      </p>
      <p cds-text="body">
        The <a href="#" cds-text="link visited">quick brown fox</a> jumps over the lazy dog. (link visited)
      </p>
      <p cds-text="body">
        The <a href="#" cds-text="link static">quick brown fox</a> jumps over the lazy dog. (link static – no hover state)
      </p>
    </div>
  `,
});

export const Links: StoryObj = { render: LinksTemplate };

// ─── Code & Monospace ─────────────────────────────────────────────────────────

const CodeTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="body">
        The <code cds-text="code">quick brown fox</code> jumps over the lazy dog. (code)
      </p>
      <p cds-text="body">
        Use <code cds-text="code">cds-text="body bold"</code> to apply bold weight to body text.
      </p>
      <p cds-text="body">
        Monospace: <span cds-text="body monospace">const x = { value: 42 };</span>
      </p>
    </div>
  `,
});

export const Code: StoryObj = { render: CodeTemplate };

// ─── Inline ───────────────────────────────────────────────────────────────────

const InlineTemplate: StoryFn = () => ({
  template: `
    <div>
      <span cds-text="display inline">We</span>
      <span cds-text="body inline"> should </span>
      <span cds-text="title inline"> all </span>
      <span cds-text="caption inline"> be </span>
      <span cds-text="section inline"> inline!</span>
    </div>
    <p cds-text="secondary" cds-layout="m-t:sm">
      Add <code cds-text="code">inline</code> to any <code cds-text="code">cds-text</code> value to render the element inline.
    </p>
  `,
});

export const Inline: StoryObj = { render: InlineTemplate };

// ─── Legacy Headers (h1–h6) ───────────────────────────────────────────────────

const LegacyHeadersTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="h1">The five boxing wizards jump quickly (h1)</p>
      <p cds-text="h2">The five boxing wizards jump quickly (h2)</p>
      <p cds-text="h3">The five boxing wizards jump quickly (h3)</p>
      <p cds-text="h4">The five boxing wizards jump quickly (h4)</p>
      <p cds-text="h5">The five boxing wizards jump quickly (h5)</p>
      <p cds-text="h6">The five boxing wizards jump quickly (h6)</p>
    </div>
  `,
});

export const LegacyHeaders: StoryObj = { render: LegacyHeadersTemplate };

// ─── Legacy Paragraphs (p1–p8) ────────────────────────────────────────────────

const LegacyParagraphsTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md">
      <p cds-text="p1">The quick brown fox jumps over the lazy dog. (p1)</p>
      <p cds-text="p2">The quick brown fox jumps over the lazy dog. (p2)</p>
      <p cds-text="p3">The quick brown fox jumps over the lazy dog. (p3)</p>
      <p cds-text="p4">The quick brown fox jumps over the lazy dog. (p4)</p>
      <p cds-text="p5">The quick brown fox jumps over the lazy dog. (p5)</p>
      <p cds-text="p6">The quick brown fox jumps over the lazy dog. (p6)</p>
      <p cds-text="p7">The quick brown fox jumps over the lazy dog. (p7)</p>
      <p cds-text="p8">The quick brown fox jumps over the lazy dog. (p8)</p>
    </div>
  `,
});

export const LegacyParagraphs: StoryObj = { render: LegacyParagraphsTemplate };

// ─── Dark Theme ───────────────────────────────────────────────────────────────

const DarkThemeTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:lg p:lg" cds-theme="dark">
      <div cds-layout="vertical gap:sm">
        <p cds-text="display">The five boxing wizards jump quickly (display)</p>
        <p cds-text="headline">The five boxing wizards jump quickly (headline)</p>
        <p cds-text="title">The five boxing wizards jump quickly (title)</p>
        <p cds-text="section">The five boxing wizards jump quickly (section)</p>
        <p cds-text="subsection">The five boxing wizards jump quickly (subsection)</p>
      </div>
      <hr cds-divider />
      <div cds-layout="vertical gap:sm">
        <p cds-text="body">The quick brown fox jumps over the lazy dog. (body)</p>
        <p cds-text="message">The quick brown fox jumps over the lazy dog. (message)</p>
        <p cds-text="secondary">The quick brown fox jumps over the lazy dog. (secondary)</p>
        <p cds-text="caption">The quick brown fox jumps over the lazy dog. (caption)</p>
        <p cds-text="smallcaption">The quick brown fox jumps over the lazy dog. (smallcaption)</p>
      </div>
    </div>
  `,
});

export const DarkTheme: StoryObj = { render: DarkThemeTemplate };
