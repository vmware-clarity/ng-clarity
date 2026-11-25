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
    <section id="secret" clrContextRedact></section>
    <div id="toggled" [clrContextRedact]="redactToggled()"></div>
  `,
})
class MarkedComponent {
  readonly redactToggled = signal(false);
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

  it('reads the marks from the attributes, so markup outside Angular can carry them too', () => {
    const element = document.createElement('div');
    element.setAttribute('data-clr-context-ignore', '');
    expect(isContextHidden(element)).toBe(true);
    element.setAttribute('data-clr-context-redact', '');
    expect(hasContextMark(element, 'redact')).toBe(true);
  });
});

describe('clrContextIgnore and clrContextRedact', () => {
  it('mark their host while it is rendered', () => {
    const fixture = TestBed.createComponent(MarkedComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const secret = root.querySelector('#secret') as Element;

    expect(root.querySelector('#chat')?.getAttribute('data-clr-context-ignore')).toBe('');
    expect(isWithinContextHidden(root.querySelector('#inside') as Element)).toBe(true);
    expect(hasContextMark(secret, 'redact')).toBe(true);
  });

  it('lift the mark while the input is false', () => {
    const fixture = TestBed.createComponent(MarkedComponent);
    fixture.detectChanges();
    const toggled = fixture.nativeElement.querySelector('#toggled') as Element;
    expect(hasContextMark(toggled, 'redact')).toBe(false);

    fixture.componentInstance.redactToggled.set(true);
    fixture.detectChanges();
    expect(hasContextMark(toggled, 'redact')).toBe(true);
  });
});
