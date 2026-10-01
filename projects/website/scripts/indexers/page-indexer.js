/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parseFrontMatter = require('front-matter');
const BaseIndexer = require('./base-indexer');

/**
 * Indexes static markdown pages from content/pages directory
 */
class PageIndexer extends BaseIndexer {
  constructor(projectRoot) {
    super('page');
    this.projectRoot = projectRoot;
  }

  async extract() {
    const documents = [];
    const pagesPath = path.join(this.projectRoot, 'content/pages/*.md');

    for (const pageFilePath of glob.sync(pagesPath, { windowsPathsNoEscape: true })) {
      const slug = path.parse(pageFilePath).name;
      const fileContent = fs.readFileSync(pageFilePath).toString();
      const { attributes, body } = parseFrontMatter(fileContent);

      const title = attributes.title || this.formatPageTitle(slug);
      const content = this.extractPageContent(body);

      documents.push(
        this.createDocument({
          id: `page-${slug}`,
          title: title,
          content: content,
          url: `/pages/${slug}`,
          component: null,
          tags: this.generatePageTags(title, content, slug),
          metadata: {
            slug: slug,
            category: 'documentation',
            ...attributes,
          },
        })
      );
    }

    return documents;
  }

  /**
   * Extract meaningful content from markdown body
   */
  extractPageContent(markdown) {
    if (!markdown) {
      return '';
    }

    // Remove markdown syntax and extract plain text
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic markers
      .replace(/`([^`]+)`/g, '$1') // Remove code markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove link markup, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove image markup
      .replace(/>\s+/g, '') // Remove blockquote markers
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n\s*\n/g, ' ') // Replace double newlines with space
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Format page title from slug
   */
  formatPageTitle(slug) {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Generate page-specific tags
   */
  generatePageTags(title, content, slug) {
    const tags = ['documentation', 'guide'];

    // Add slug-based tags
    tags.push(...slug.split('-'));

    // Add content-based tags
    const contentKeywords = [
      'getting started',
      'setup',
      'installation',
      'configuration',
      'accessibility',
      'a11y',
      'design',
      'development',
      'update',
      'migration',
      'changelog',
      'support',
    ];

    const lowerContent = content.toLowerCase();
    const lowerTitle = title.toLowerCase();

    for (const keyword of contentKeywords) {
      if (lowerContent.includes(keyword) || lowerTitle.includes(keyword)) {
        tags.push(keyword.replace(/\s+/g, '-'));
      }
    }

    // Add title words as tags
    if (title) {
      const titleWords = title.toLowerCase().match(/\b\w+\b/g) || [];
      tags.push(...titleWords.filter(word => word.length > 2));
    }

    return [...new Set(tags)];
  }
}

module.exports = PageIndexer;
