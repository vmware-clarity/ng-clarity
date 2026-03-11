/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subject } from 'rxjs';

export interface TargetEntity {
  sectionElement: HTMLElement;
  headingElement: HTMLHeadingElement;
  intersecting: boolean;
}

export class IntersectionService {
  readonly activeHashChange: Observable<string>;

  private activeHash: string | null | undefined;
  private activeHashSubject = new Subject<string>();
  private targets: TargetEntity[] = [];
  private intersectionObserver: IntersectionObserver | undefined;
  private debounceTimeout: number | undefined;

  private _debouncing = false;

  constructor() {
    this.activeHashChange = this.activeHashSubject.asObservable();
  }

  get debouncing() {
    return this._debouncing;
  }

  get sections(): HTMLElement[] {
    return this.targets.map(target => target.sectionElement);
  }

  get visibleCount(): number {
    return this.allVisible.length;
  }

  private get allVisible(): TargetEntity[] {
    return this.targets.filter(entity => entity.intersecting);
  }

  initialize(scrollParent: HTMLElement, headingSelector: string) {
    this.reset();
    this.debounce();

    const headingElements = Array.from(document.body.querySelectorAll<HTMLHeadingElement>(headingSelector));
    this.updateObserver(scrollParent);
    this.moveContentIntoWrapperSections(headingSelector, headingElements);

    if (location.hash) {
      this.activeHash = location.hash.replace('#', '');
    }
  }

  updateObserver(scrollParent: HTMLElement, reactivate = false) {
    this.intersectionObserver?.disconnect();
    const intersectionObserverOptions: IntersectionObserverInit = {
      root: scrollParent,
      rootMargin: '0px',
      threshold: 0,
    };

    this.intersectionObserver = new IntersectionObserver(entries => {
      this.onIntersect(entries);
    }, intersectionObserverOptions);

    // Initial activation is done in moveContentIntoWrapperSections for better perfomance.
    if (reactivate) {
      for (const section of this.sections) {
        this.intersectionObserver.observe(section);
      }
    }
  }

  destroy() {
    this.cleanupSections();
    this.reset();
    this.intersectionObserver?.disconnect();
  }

  // Short disable of changes of the active element.
  // Used during smooth content scroll after clicking on a TOC item.
  debounce(milliseconds = 800) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this._debouncing = true;

    this.debounceTimeout = window.setTimeout(() => {
      this._debouncing = false;
    }, milliseconds);
  }

  cleanupSections() {
    this.sections.forEach(section => {
      section.remove();
    });
  }

  private reset() {
    this._debouncing = false;
    this.activeHash = null;
    this.targets = [];
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }

  private onIntersect(entries: IntersectionObserverEntry[]) {
    // update the state of each target
    for (const entry of entries) {
      const target = this.targets.find(target => target.sectionElement.id === entry.target.id);

      if (target) {
        target.intersecting = entry.isIntersecting;
      }
    }

    if (!this.debouncing || !this.activeHash) {
      const newActiveHash = this.resolveActiveHash();
      if (newActiveHash) {
        this.updateActiveHash(newActiveHash);
      }
    }
  }

  private resolveActiveHash() {
    // Two things are achieved here:
    // 1. If we're just opening a page, with a hash in the URL, we set focus on the 1st item.
    // 2. We have a bounce that prevents focusing intermediate items, during smooth scroll,
    // when either a ToC item was clicked, or we opened a URL containg section hash.
    // Note: the debounce should not contain the basic initialization from 1.
    let newActiveHash: string | undefined;
    if (!this.activeHash && this.targets[0]) {
      newActiveHash = this.targets[0].headingElement.id;
    } else if (!this.debouncing) {
      const top = this.getTopVisible();
      if (top) {
        newActiveHash = top.headingElement.id;
      }
    }
    return newActiveHash;
  }

  private updateActiveHash(hash: string) {
    this.activeHash = hash;
    this.activeHashSubject.next(hash);

    // The heading is not added on page land because it can cause scrolling on refresh
    // and make sharing urls more difficult (clicking a shared link could cause scrolling on land).
    // However, once the user click a heading link, the hash is updated on scroll.
    if (location.hash) {
      updateUrlHash(hash);
    }
  }

  private getTopVisible(): TargetEntity | null {
    if (this.allVisible.length === 0) {
      return null;
    }

    return this.allVisible.reduce(
      (min, target) => (getOffset(target) < getOffset(min) ? target : min),
      this.allVisible[0]
    );
  }

  private moveContentIntoWrapperSections(headingSelector: string, headingElements: HTMLHeadingElement[]) {
    if (!this.intersectionObserver) {
      throw new Error('intersection observer not initialized'); // error if methods are called out of order
    }

    const sections = [];
    for (const headingElement of headingElements) {
      const sectionId = `${headingElement.id}-section`;

      // Check if wrapper for heading is already created
      if (document.getElementById(sectionId) === null) {
        const siblings = [];
        let element = headingElement.nextElementSibling;
        // Find all siblings until you get the next heading element.
        // Note: some pages contain sub-components, which may have their own heading elements.
        // We have to stop the current section before these, or we'll have sections within sections.
        // The "headingElements" selector is greedy enough to access the sub-compoennts and create
        // sections for them too.
        while (
          element &&
          !(headingElements as Element[]).includes(element) &&
          element.tagName !== 'APP-SITE-FOOTER' && //End of TAB
          (!element.tagName.includes('CLR') ||
            (element.tagName.includes('CLR') && element.querySelector(headingSelector) === null))
        ) {
          siblings.push(element);
          element = element.nextElementSibling;
        }
        // Parent section element to wrap around heading and siblings
        const sectionElement = document.createElement('section');
        sectionElement.id = sectionId;
        sectionElement.className = 'doc-section';
        sectionElement.append(...siblings);
        headingElement.parentNode?.replaceChild(sectionElement, headingElement);
        sectionElement.insertBefore(headingElement, sectionElement.firstChild);
        sections.push(sectionElement);
        this.targets.push({
          sectionElement: sectionElement,
          headingElement: headingElement,
          intersecting: false,
        });
        this.intersectionObserver.observe(sectionElement);
      }
    }
  }
}

function updateUrlHash(hash: string) {
  const url = new URL(location.href);
  url.hash = hash;
  history.replaceState({}, '', url);
}

function getOffset(target: TargetEntity): number {
  return target.sectionElement.offsetTop;
}
