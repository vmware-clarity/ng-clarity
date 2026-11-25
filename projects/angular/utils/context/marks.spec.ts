/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  closestContextMark,
  ClrContextIgnore,
  ClrContextRedact,
  hasContextMark,
  isContextHidden,
  isWithinContextHidden,
  markContext,
} from './marks';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ClrContextIgnore, ClrContextRedact],
  template: `
    <aside id="chat" clrContextIgnore><p id="inside">transcript</p></aside>
    @if (showSecret()) {
      <section id="secret" clrContextRedact></section>
    }
    <ng-container clrContextRedact><span id="plain"></span></ng-container>
  `,
})
class MarkedComponent {
  readonly showSecret = signal(true);
}

describe('context marks', () => {
  it('marks an element, and the teardown removes only that mark', () => {
    const element = document.createElement('div');
    const unmark = markContext(element, 'redact');
    expect(hasContextMark(element, 'redact')).toBe(true);
    expect(hasContextMark(element, 'ignore')).toBe(false);
    unmark();
    expect(hasContextMark(element, 'redact')).toBe(false);
  });

  it('finds the closest marked ancestor', () => {
    const outer = document.createElement('div');
    outer.innerHTML = '<p><span></span></p>';
    markContext(outer, 'ignore');
    const span = outer.querySelector('span') as Element;
    expect(closestContextMark(span, 'ignore')).toBe(outer);
    expect(closestContextMark(span, 'redact')).toBeNull();
    expect(isWithinContextHidden(span)).toBe(true);
    expect(isContextHidden(span)).toBe(false);
  });

  it('reads nothing from the DOM, so page content cannot plant a mark', () => {
    const element = document.createElement('div');
    element.setAttribute('clrContextIgnore', '');
    element.setAttribute('data-clr-context-ignore', '');
    expect(isContextHidden(element)).toBe(false);
  });
});

describe('clrContextIgnore and clrContextRedact', () => {
  it('mark their host while it is rendered', () => {
    const fixture = TestBed.createComponent(MarkedComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const secret = root.querySelector('#secret') as Element;

    expect(hasContextMark(root.querySelector('#chat') as Element, 'ignore')).toBe(true);
    expect(isWithinContextHidden(root.querySelector('#inside') as Element)).toBe(true);
    expect(hasContextMark(secret, 'redact')).toBe(true);

    fixture.componentInstance.showSecret.set(false);
    fixture.detectChanges();
    expect(hasContextMark(secret, 'redact')).toBe(false);
  });

  it('mark nothing on an ng-container, which has no element', () => {
    const fixture = TestBed.createComponent(MarkedComponent);
    fixture.detectChanges();
    const plain = fixture.nativeElement.querySelector('#plain') as Element;
    expect(closestContextMark(plain, 'redact')).toBeNull();
  });
});
