/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const domino = require('domino');

/**
 * Base class for all content indexers
 * Provides common interface and utilities for extracting searchable documents
 */
class BaseIndexer {
  constructor(type) {
    this.type = type;
  }

  /**
   * Extract searchable documents from content source
   * @returns {Promise<Array>} Array of search documents
   */
  async extract() {
    throw new Error('extract() must be implemented by subclass');
  }

  /**
   * Create a standardized search document
   * @param {Object} options - Document options
   * @returns {Object} Standardized search document
   */
  createDocument({ id, title, content, url, component, tags = [], metadata = {} }) {
    return {
      id,
      title,
      content: this.sanitizeContent(content),
      component,
      type: this.type,
      url,
      tags,
      indexer: this.constructor.name.toLowerCase().replace('indexer', ''),
      metadata,
    };
  }

  /**
   * Sanitize content for search indexing
   * @param {string} content - Raw content
   * @returns {string} Sanitized content
   */
  sanitizeContent(content) {
    if (!content) {
      return '';
    }

    return this.htmlToText(content).substring(0, 15000); // Limit content length reasonably to allow rich search
  }

  /**
   * Extract text content from HTML
   * @param {string} html - HTML string
   * @returns {string} Plain text content
   */
  htmlToText(html) {
    if (!html) {
      return '';
    }

    // Parse with a real DOM (as compile-content.js does) instead of regex-stripping tags: regexes
    // can't reliably match malformed/nested markup, which can leave script/style content behind.
    const document = domino.createDocument(html);

    for (const element of Array.from(document.querySelectorAll('script, style'))) {
      element.remove();
    }

    return document.body.textContent.replace(/\s+/g, ' ').trim();
  }

  /**
   * Generate search tags from content
   * @param {string} title - Document title
   * @param {string} content - Document content
   * @returns {Array<string>} Generated tags
   */
  generateTags(title, content) {
    const tags = [];

    // Add title words as tags
    if (title) {
      const titleWords = title.toLowerCase().match(/\b\w+\b/g) || [];
      tags.push(...titleWords.filter(word => word.length > 2));
    }

    // Extract common keywords from content
    if (content) {
      const keywords =
        content
          .toLowerCase()
          .match(
            /\b(?:button|form|input|modal|dialog|navigation|menu|table|grid|chart|icon|color|theme|accessibility|responsive)\b/g
          ) || [];
      tags.push(...[...new Set(keywords)]);
    }

    return [...new Set(tags)];
  }
}

module.exports = BaseIndexer;
