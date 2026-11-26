/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrStackBlock } from './stack-block';
import { ClrStackViewModule } from './stack-view.module';

/** A consumer component that adds a nested block from its own view, after the parent block has rendered. */
@Component({
  selector: 'nested-blocks',
  template: `
    <clr-stack-block>
      <clr-stack-label>Nested label</clr-stack-label>
      <clr-stack-content>Nested content</clr-stack-content>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class NestedBlocks {}

/**
 * OnPush host that only changes signals. Nothing in this file calls `markForCheck()` or `detectChanges()`: every
 * update is rendered by the zoneless scheduler, and the exhaustive `checkNoChanges` pass checks it.
 */
@Component({
  template: `
    <clr-stack-view>
      <clr-stack-header [clrStackHeaderLevel]="headerLevel()">Header</clr-stack-header>

      <clr-stack-block class="parent" [(clrSbExpanded)]="expanded">
        <clr-stack-label [id]="labelId()">Parent label</clr-stack-label>
        <clr-stack-content>{{ content() }}</clr-stack-content>
        @if (showChild()) {
          <clr-stack-block class="child" [clrSbNotifyChange]="childChanged()">
            <clr-stack-label>Child label</clr-stack-label>
            <clr-stack-content>Child content</clr-stack-content>
          </clr-stack-block>
        }
        @if (showNested()) {
          <nested-blocks ngProjectAs="clr-stack-block" />
        }
      </clr-stack-block>

      <clr-stack-block #imperative class="imperative">
        <clr-stack-label>Imperative label</clr-stack-label>
        <clr-stack-content>Imperative content</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>Imperative child label</clr-stack-label>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessStackViewHost {
  @ViewChild('imperative') imperativeBlock: ClrStackBlock;

  readonly headerLevel = signal<1 | 2>(null);
  readonly expanded = signal(false);
  readonly labelId = signal<string>(undefined);
  readonly content = signal('Parent content');
  readonly showChild = signal(false);
  readonly showNested = signal(false);
  readonly childChanged = signal(false);
}

describe('ClrStackView (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessStackViewHost>;
  let host: ZonelessStackViewHost;

  function element(selector: string): HTMLElement {
    return fixture.nativeElement.querySelector(selector);
  }

  function label(block: string): HTMLElement {
    return element(`${block} > .stack-block-label`);
  }

  function region(block: string): HTMLElement {
    return element(`${block} > .stack-children [role="region"]`);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ZonelessStackViewHost, NestedBlocks],
      imports: [ClrStackViewModule],
    });

    fixture = TestBed.createComponent(ZonelessStackViewHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders a block without children as not expandable', () => {
    expect(label('.parent').getAttribute('role')).toBeNull();
    expect(label('.parent').getAttribute('aria-expanded')).toBeNull();
    expect(element('.parent').classList).not.toContain('stack-block-expandable');
  });

  it('makes the parent block expandable when a child block is added later', async () => {
    host.showChild.set(true);
    await fixture.whenStable();

    expect(element('.parent').classList).toContain('stack-block-expandable');
    expect(label('.parent').getAttribute('role')).toBe('button');
    expect(label('.parent').getAttribute('tabindex')).toBe('0');
    expect(label('.parent').getAttribute('aria-expanded')).toBe('false');
  });

  it('makes the parent block expandable when a consumer component adds a child block from its own view', async () => {
    host.showNested.set(true);
    await fixture.whenStable();

    expect(element('.parent').classList).toContain('stack-block-expandable');
    expect(label('.parent').getAttribute('aria-expanded')).toBe('false');

    label('.parent').click();
    await fixture.whenStable();

    expect(region('.parent').textContent).toContain('Nested content');
  });

  it('expands through the input and renders the projected children', async () => {
    host.showChild.set(true);
    host.expanded.set(true);
    await fixture.whenStable();

    expect(element('.parent').classList).toContain('stack-block-expanded');
    expect(label('.parent').getAttribute('aria-expanded')).toBe('true');
    expect(element('.parent > .stack-block-label .stack-block-caret').getAttribute('direction')).toBe('down');
    expect(label('.parent').getAttribute('aria-controls')).toBe(region('.parent').id);
    expect(region('.parent').textContent).toContain('Child content');

    host.expanded.set(false);
    await fixture.whenStable();

    expect(label('.parent').getAttribute('aria-expanded')).toBe('false');
    expect(label('.parent').getAttribute('aria-controls')).toBeNull();
    expect(region('.parent')).toBeNull();
  });

  it('toggles on click and on Enter, and writes the state back to the two-way binding', async () => {
    host.showChild.set(true);
    await fixture.whenStable();

    label('.parent').click();
    await fixture.whenStable();

    expect(host.expanded()).toBe(true);
    expect(label('.parent').getAttribute('aria-expanded')).toBe('true');
    expect(region('.parent')).not.toBeNull();

    label('.parent').dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    await fixture.whenStable();

    expect(host.expanded()).toBe(false);
    expect(label('.parent').getAttribute('aria-expanded')).toBe('false');
    expect(region('.parent')).toBeNull();
  });

  it('follows a changed label id while expanded', async () => {
    host.showChild.set(true);
    host.expanded.set(true);
    await fixture.whenStable();

    const generatedId = element('.parent > .stack-block-label clr-stack-label').id;
    expect(region('.parent').getAttribute('aria-labelledby')).toBe(generatedId);

    host.labelId.set('custom-label');
    await fixture.whenStable();

    expect(element('.parent > .stack-block-label clr-stack-label').id).toBe('custom-label');
    expect(region('.parent').getAttribute('aria-labelledby')).toBe('custom-label');
  });

  it('refreshes projected consumer content', async () => {
    host.content.set('Updated content');
    await fixture.whenStable();

    expect(label('.parent').textContent).toContain('Updated content');
  });

  it('marks a collapsed parent as changed when a child reports a change', async () => {
    host.showChild.set(true);
    await fixture.whenStable();
    expect(element('.parent').classList).not.toContain('stack-block-changed');

    host.childChanged.set(true);
    await fixture.whenStable();

    expect(element('.parent').classList).toContain('stack-block-changed');
    expect(label('.parent').querySelector('.clr-sr-only').textContent).toBe('Value changed.');

    // An expanded parent shows the change on the child itself.
    host.expanded.set(true);
    await fixture.whenStable();
    expect(element('.parent').classList).not.toContain('stack-block-changed');
    expect(element('.child').classList).toContain('stack-block-changed');

    host.expanded.set(false);
    host.childChanged.set(false);
    await fixture.whenStable();
    expect(element('.parent').classList).not.toContain('stack-block-changed');
    expect(label('.parent').querySelector('.clr-sr-only')).toBeNull();
  });

  it('renders strings localized after the first render', async () => {
    host.showChild.set(true);
    await fixture.whenStable();
    host.childChanged.set(true);
    await fixture.whenStable();
    expect(label('.parent').querySelector('.clr-sr-only').textContent).toBe('Value changed.');

    TestBed.inject(ClrCommonStringsService).localize({ stackViewChanged: 'Changed value.' });
    await fixture.whenStable();

    expect(label('.parent').querySelector('.clr-sr-only').textContent).toBe('Changed value.');
  });

  it('renders expanded state set on the block instance, as the lazy loading example does', async () => {
    expect(label('.imperative').getAttribute('aria-expanded')).toBe('false');

    host.imperativeBlock.expanded = true;
    await fixture.whenStable();

    expect(element('.imperative').classList).toContain('stack-block-expanded');
    expect(label('.imperative').getAttribute('aria-expanded')).toBe('true');
    expect(element('.imperative > .stack-block-label .stack-block-caret').getAttribute('direction')).toBe('down');

    host.imperativeBlock.expanded = false;
    await fixture.whenStable();

    expect(element('.imperative').classList).not.toContain('stack-block-expanded');
    expect(label('.imperative').getAttribute('aria-expanded')).toBe('false');
  });

  it('renders the header level from the input', async () => {
    expect(element('.stack-title').getAttribute('role')).toBeNull();

    host.headerLevel.set(1);
    await fixture.whenStable();

    expect(element('.stack-title').getAttribute('role')).toBe('heading');
    expect(element('.stack-title').getAttribute('aria-level')).toBe('1');
  });

  it('removes a child block cleanly', async () => {
    host.showChild.set(true);
    host.expanded.set(true);
    await fixture.whenStable();
    expect(element('.child')).not.toBeNull();

    host.showChild.set(false);
    await fixture.whenStable();

    expect(element('.child')).toBeNull();
    expect(region('.parent').textContent).not.toContain('Child content');
  });

  it('keeps stackBlockTitle writable', () => {
    const block = host.imperativeBlock;
    const label = { id: 'custom-label' };

    block.stackBlockTitle = label;

    expect(block.stackBlockTitle).toBe(label);
    expect(block.labelledById).toBe('custom-label');
  });
});
