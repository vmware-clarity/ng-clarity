/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

/** The typography stories are pure markup demos of the `cds-text` values; none of them takes an arg. */
type TypographyArgs = Record<never, never>;

const meta: Meta<TypographyArgs> = {
  title: 'Foundations/Typography',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  render: () => ({
    template: `
      <div cds-layout="vertical gap:lg">
        <p cds-text="display">The five boxing wizards jump quickly (display)</p>
        <p cds-text="headline">The five boxing wizards jump quickly (headline)</p>
        <p cds-text="title">The five boxing wizards jump quickly (title)</p>
        <p cds-text="section">The five boxing wizards jump quickly (section)</p>
        <p cds-text="subsection">The five boxing wizards jump quickly (subsection)</p>
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<TypographyArgs>;

// ─── Headings ─────────────────────────────────────────────────────────────────

export const Headings: Story = {};

// ─── Content ──────────────────────────────────────────────────────────────────

export const Content: Story = {
  // render-override: this story shows the body/message/secondary/caption scale rather than the heading scale of the meta template
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md">
        <p cds-text="body">The quick brown fox jumps over the lazy dog. (body)</p>
        <p cds-text="message">The quick brown fox jumps over the lazy dog. (message)</p>
        <p cds-text="secondary">The quick brown fox jumps over the lazy dog. (secondary)</p>
        <p cds-text="caption">The quick brown fox jumps over the lazy dog. (caption)</p>
        <p cds-text="smallcaption">The quick brown fox jumps over the lazy dog. (smallcaption)</p>
      </div>
    `,
  }),
};

// ─── Font Weights ─────────────────────────────────────────────────────────────

export const Weights: Story = {
  // render-override: this story pairs every font weight with an inline `<em>`, which the heading-scale meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md">
        <p cds-text="body light">
          The quick brown foxes
          <em>lightly</em>
          jump over the lazy dog. (light)
        </p>
        <p cds-text="body regular">
          The quick brown foxes
          <em>regularly</em>
          jump over the lazy dog. (regular)
        </p>
        <p cds-text="body medium">
          The quick brown foxes
          <em>mediumly</em>
          jump over the lazy dog. (medium)
        </p>
        <p cds-text="body semibold">
          The quick brown foxes
          <em>semi-boldly</em>
          jump over the lazy dog. (semibold)
        </p>
        <p cds-text="body bold">
          The quick brown foxes
          <em>boldly</em>
          jump over the lazy dog. (bold)
        </p>
        <p cds-text="body extrabold">
          The quick brown foxes
          <em>extra-boldly</em>
          jump over the lazy dog. (extrabold)
        </p>
      </div>
    `,
  }),
};

// ─── Text Alignment ───────────────────────────────────────────────────────────

export const Alignment: Story = {
  // render-override: this story constrains the demo to a `container:sm` column so the justified paragraph can wrap, which the meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md container:sm">
        <p cds-text="body left">Text Left (left)</p>
        <p cds-text="body right">Text Right (right)</p>
        <p cds-text="body center">Text Center (center)</p>
        <p cds-text="body justify">
          Text Justify: The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
          (justify)
        </p>
      </div>
    `,
  }),
};

// ─── Text Transforms ──────────────────────────────────────────────────────────

export const Transforms: Story = {
  // render-override: this story needs a truncating container and a fixed-width bordered box to show break-word, which the meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md">
        <p cds-text="body capitalize">text title case (capitalize)</p>
        <p cds-text="body uppercase">text uppercase (uppercase)</p>
        <p cds-text="body lowercase">TEXT LOWERCASE (lowercase)</p>
        <p cds-text="body truncate" cds-layout="container:xs">
          Text Truncation: The quick brown fox jumps over the lazy dog. (truncate)
        </p>
        <p
          cds-text="body break-word"
          style="
            max-width: 180px;
            border: var(--cds-alias-object-border-width-100) dashed var(--cds-alias-object-border-color);
            padding: var(--clr-base-vertical-offset-s) var(--clr-base-horizontal-offset-s);
          "
        >
          Short words wrap normally, but pneumonoultramicroscopicsilicovolcanoconiosis breaks mid-word. (break-word)
        </p>
      </div>
    `,
  }),
};

// ─── Links ────────────────────────────────────────────────────────────────────

export const Links: Story = {
  // render-override: this story wraps anchors inside body paragraphs, which the meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md">
        <p cds-text="body">
          The
          <a href="#" cds-text="link">quick brown fox</a>
          jumps over the lazy dog. (link)
        </p>
        <p cds-text="body">
          The
          <a href="#" cds-text="link visited">quick brown fox</a>
          jumps over the lazy dog. (link visited)
        </p>
        <p cds-text="body">
          The
          <a href="#" cds-text="link static">quick brown fox</a>
          jumps over the lazy dog. (link static – no hover state)
        </p>
      </div>
    `,
  }),
};

// ─── Code & Monospace ─────────────────────────────────────────────────────────

export const Code: Story = {
  // render-override: this story wraps `<code>` and monospace spans inside body paragraphs, which the meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:md">
        <p cds-text="body">
          The
          <code cds-text="code">quick brown fox</code>
          jumps over the lazy dog. (code)
        </p>
        <p cds-text="body">
          Use
          <code cds-text="code">cds-text="body bold"</code>
          to apply bold weight to body text.
        </p>
        <p cds-text="body">
          Monospace:
          <span cds-text="body monospace">const x = 42;</span>
        </p>
      </div>
    `,
  }),
};

// ─── Inline ───────────────────────────────────────────────────────────────────

export const Inline: Story = {
  // render-override: this story renders sibling inline spans outside a layout container plus an explanatory paragraph, which the meta template cannot express
  render: () => ({
    template: `
      <div>
        <span cds-text="display inline">We</span>
        <span cds-text="body inline">should</span>
        <span cds-text="title inline">all</span>
        <span cds-text="caption inline">be</span>
        <span cds-text="section inline">inline!</span>
      </div>
      <p cds-text="secondary" cds-layout="m-t:sm">
        Add
        <code cds-text="code">inline</code>
        to any
        <code cds-text="code">cds-text</code>
        value to render the element inline.
      </p>
    `,
  }),
};

// ─── Legacy Headers (h1–h6) ───────────────────────────────────────────────────

export const LegacyHeaders: Story = {
  // render-override: this story lists the legacy h1-h6 values, a different set from the named heading scale in the meta template
  render: () => ({
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
  }),
};

// ─── Legacy Paragraphs (p1–p8) ────────────────────────────────────────────────

export const LegacyParagraphs: Story = {
  // render-override: this story lists the legacy p1-p8 values, which the meta template cannot express
  render: () => ({
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
  }),
};

// ─── Accents & Special Glyphs ────────────────────────────────────────────────

export const Accents: Story = {
  // render-override: this story is a glyph-coverage grid with nested sections and HTML entities, which the meta template cannot express
  render: () => ({
    template: `
      <div cds-layout="vertical gap:lg">
        <p cds-text="body">
          <strong>Accents test (Latin letters with acute, grave, tilde, umlaut, circumflex, cedilla):</strong>
        </p>
        <div cds-layout="vertical gap:sm">
          <p cds-text="display">áéíóú àèìòù äëïöü âêîôû ñç ÁÉÍÓÚ ÀÈÌÒÙ ÄËÏÖÜ ÂÊÎÔÛ ÑÇ</p>
          <p cds-text="headline">áéíóú àèìòù äëïöü âêîôû ñç ÁÉÍÓÚ ÀÈÌÒÙ ÄËÏÖÜ ÂÊÎÔÛ ÑÇ</p>
          <p cds-text="title">áéíóú àèìòù äëïöü âêîôû ñç ÁÉÍÓÚ ÀÈÌÒÙ ÄËÏÖÜ ÂÊÎÔÛ ÑÇ</p>
          <p cds-text="section">áéíóú àèìòù äëïöü âêîôû ñç ÁÉÍÓÚ ÀÈÌÒÙ ÄËÏÖÜ ÂÊÎÔÛ ÑÇ</p>
          <p cds-text="body">áéíóú àèìòù äëïöü âêîôû ñç ÁÉÍÓÚ ÀÈÌÒÙ ÄËÏÖÜ ÂÊÎÔÛ ÑÇ</p>
        </div>

        <p cds-text="body">
          <strong>Backtick / Spacing test:</strong>
        </p>
        <div cds-layout="vertical gap:sm">
          <p cds-text="display">a&#96;b c&#96;d e&#96;f g&#96;h (Should not overlap next character)</p>
          <p cds-text="body">a&#96;b c&#96;d e&#96;f g&#96;h (Should not overlap next character)</p>
        </div>

        <p cds-text="body">
          <strong>Solid Square Custom Glyph (uni25FC):</strong>
        </p>
        <div cds-layout="vertical gap:sm">
          <p cds-text="display">&#9724; (uni25FC: &#9724;)</p>
          <p cds-text="body">&#9724; (uni25FC: &#9724;)</p>
        </div>
      </div>
    `,
  }),
};
