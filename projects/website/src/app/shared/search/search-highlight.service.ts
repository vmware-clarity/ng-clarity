/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchHighlightService implements OnDestroy {
  private subscription = new Subscription();
  private observer: MutationObserver | null = null;
  private currentTerm: string | null = null;
  private hasScrolled = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  init() {
    // Clear highlights on navigation start
    this.subscription.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        this.hasScrolled = false;
        this.removeHighlights();
        this.checkForHighlightParam();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.stopObserving();
  }

  /**
   * Update the currently highlighted term dynamically.
   * Can be called when the user is actively typing in the search bar.
   */
  updateHighlightTerm(term: string | null) {
    this.removeHighlights();

    if (term && term.trim().length > 1) {
      this.currentTerm = term.trim();
      // Set to true so it doesn't jarringly jump the page while they type
      this.hasScrolled = true;
      this.startObservingAndHighlight();
    } else {
      this.currentTerm = null;
      this.stopObserving();
    }
  }

  private checkForHighlightParam() {
    // Parse query params from the URL manually since ActivatedRoute might not be deeply nested yet
    const urlTree = this.router.parseUrl(this.router.url);
    const hlParam = urlTree.queryParams['hl'];

    if (hlParam) {
      this.currentTerm = hlParam;
      this.startObservingAndHighlight();
    } else {
      this.currentTerm = null;
      this.stopObserving();
    }
  }

  private startObservingAndHighlight() {
    this.stopObserving();

    // Do an immediate highlight attempt
    setTimeout(() => this.highlightAndScroll(), 100);

    // Also observe the DOM for changes (lazy loaded tabs, content, etc)
    const targetNode = document.querySelector('clr-main-container') || document.body;

    this.observer = new MutationObserver(mutations => {
      let shouldHighlight = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldHighlight = true;
          break;
        }
      }

      if (shouldHighlight) {
        // Debounce slightly to avoid freezing the browser on massive DOM changes
        setTimeout(() => this.highlightAndScroll(), 50);
      }
    });

    this.observer.observe(targetNode, { childList: true, subtree: true });
  }

  private stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private removeHighlights() {
    const marks = document.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize(); // Merge adjacent text nodes
      }
    });
  }

  private highlightAndScroll() {
    if (!this.currentTerm) {
      return;
    }

    const term = this.currentTerm;
    const container = document.querySelector('clr-main-container') || document.body;

    // Create regex for the term (case insensitive)
    const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');

    // TreeWalker to find text nodes
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node: Text) => {
        // Skip if parent is already our mark, or a script/style tag, or hidden
        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.tagName === 'MARK' && parent.classList.contains('search-highlight')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        // Only accept nodes that match our term
        // Reset regex state before test
        regex.lastIndex = 0;
        if (regex.test(node.nodeValue || '')) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    });

    const nodesToReplace: Text[] = [];
    let currentNode = walker.nextNode() as Text;

    while (currentNode) {
      nodesToReplace.push(currentNode);
      currentNode = walker.nextNode() as Text;
    }

    if (nodesToReplace.length === 0) {
      return;
    }

    // Process nodes
    let firstMark: HTMLElement | null = null;

    nodesToReplace.forEach(node => {
      // Re-test to avoid issues if node was already modified
      if (!node.nodeValue || !regex.test(node.nodeValue)) {
        return;
      }

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      // Reset regex index
      regex.lastIndex = 0;

      while ((match = regex.exec(node.nodeValue)) !== null) {
        // Text before match
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex, match.index)));
        }

        // Match itself wrapped in mark
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = match[0];

        // Specific styling since this might be injected anywhere
        mark.style.backgroundColor = 'var(--cds-alias-status-warning-tint, #fff3cd)';
        mark.style.color = 'var(--cds-alias-status-warning-shade, #856404)';
        mark.style.borderRadius = '2px';
        mark.style.padding = '0 2px';
        mark.style.boxShadow = '0 0 0 1px var(--cds-alias-status-warning, #fac946)';

        fragment.appendChild(mark);

        if (!firstMark) {
          firstMark = mark;
        }

        lastIndex = regex.lastIndex;
      }

      // Text after last match
      if (lastIndex < node.nodeValue.length) {
        fragment.appendChild(document.createTextNode(node.nodeValue.substring(lastIndex)));
      }

      // Replace node with fragment
      if (node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });

    // Scroll to first match if we haven't already scrolled for this term
    if (firstMark && !this.hasScrolled) {
      this.hasScrolled = true;
      setTimeout(() => {
        if (firstMark) {
          firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
