/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { delay } from '@clr/angular/testing';
import { Keys } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';
import type { Mock } from 'vitest';

import { ClrStackBlock } from './stack-block';
import { ClrStackView } from './stack-view';
import { ClrStackViewModule } from './stack-view.module';

type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = Mock<T>;

@Component({
  template: `
    <clr-stack-block [clrStackViewLevel]="ariaLevel">
      <clr-stack-label>Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class BasicBlock {
  @ViewChild(ClrStackBlock) blockInstance: ClrStackBlock;
  ariaLevel: number;
}

@Component({
  template: `
    <clr-stack-block #main [clrStackViewLevel]="explicitHeadingLevels ? 1 : null">
      <clr-stack-label>Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
      <clr-stack-block [clrStackViewLevel]="explicitHeadingLevels ? 2 : null">
        <clr-stack-label>Sub-Label 1</clr-stack-label>
        <clr-stack-content>Sub-Content 1</clr-stack-content>
      </clr-stack-block>
      <clr-stack-block [clrStackViewLevel]="explicitHeadingLevels ? 2 : null">
        <clr-stack-label>Sub-Label 2</clr-stack-label>
        <clr-stack-content>Sub-Content 2</clr-stack-content>
      </clr-stack-block>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NestedBlocks {
  @ViewChild('main') blockInstance: ClrStackBlock;
  explicitHeadingLevels: false;
}

@Component({
  template: `
    <clr-stack-block [clrSbExpandable]="true" [(clrSbExpanded)]="expanded">
      <clr-stack-label id="STACK_LABEL_ID">Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class DynamicBlock {
  @ViewChild(ClrStackBlock) blockInstance: ClrStackBlock;

  expanded = false;
}

@Component({
  template: `
    <clr-stack-block #main [clrSbExpandable]="true" [(clrSbExpanded)]="expanded">
      <clr-stack-label id="STACK_LABEL_ID">Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>

      <clr-stack-block>
        <clr-stack-label>Inner content</clr-stack-label>
        <clr-stack-content>
          <input />
        </clr-stack-content>
      </clr-stack-block>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class DynamicBlockWithInput {
  @ViewChild('main') blockInstance: ClrStackBlock;

  expanded = false;
}

@Component({
  template: `
    <clr-stack-block #main [(clrSbExpanded)]="expanded">
      <clr-stack-label>Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
      <clr-stack-block #test [(clrSbExpanded)]="testExpanded">
        <clr-stack-label>Button content</clr-stack-label>
        <clr-stack-content>
          <button class="btn btn-primary" (click)="content = content + ' Button click'">Button</button>
          <input type="text" clrStackInput [(ngModel)]="content" />
          <a href="javascript://">Link</a>
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          <textarea clrTextarea [(ngModel)]="content"></textarea>
          <div id="to-open" tabindex="0">Text</div>
        </clr-stack-content>
        <clr-stack-block #inner>
          <clr-stack-label>Inner label</clr-stack-label>
          <clr-stack-content>Inner content</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-block>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class BlocksWithIinteractiveElements {
  @ViewChild('main') blockInstance: ClrStackBlock;
  @ViewChild('test') testBlockInstance: ClrStackBlock;
  @ViewChild('inner') innerBlockInstance: ClrStackBlock;

  content = '';
  expanded = true;
  testExpanded = false;
}

describe('Stack View directives', () => {
  'use strict';
  describe('StackBlock', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrStackViewModule, FormsModule],
        declarations: [BasicBlock, DynamicBlock, DynamicBlockWithInput, NestedBlocks, BlocksWithIinteractiveElements],
        providers: [ClrStackView],
      });
    });

    afterEach(() => {
      fixture.destroy();
    });

    function getBlockInstance(bFixture: ComponentFixture<any>): ClrStackBlock {
      return bFixture.componentInstance.blockInstance;
    }

    it('projects content', () => {
      fixture = TestBed.createComponent(BasicBlock);
      renderFixture(fixture);
      compiled = fixture.nativeElement;

      expect(compiled.textContent).toMatch(/Label/);
      expect(compiled.textContent).toMatch(/Content/);
    });

    it('is not expandable by default', () => {
      fixture = TestBed.createComponent(BasicBlock);
      renderFixture(fixture);

      expect(getBlockInstance(fixture).expandable).toBeFalsy();
    });

    it('is automatically expandable if has block children', () => {
      fixture = TestBed.createComponent(NestedBlocks);
      renderFixture(fixture);

      expect(getBlockInstance(fixture).expandable).toBeTruthy();
    });

    it('can be made expandable without block children', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(getBlockInstance(fixture).expandable).toBeTruthy();
    });

    it('displays a caret when the stack block is expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(
        fixture.nativeElement.querySelector('.stack-block-expandable > .stack-block-label .stack-block-caret')
      ).not.toBeNull();

      getBlockInstance(fixture).expandable = false;

      renderFixture(fixture);

      expect(
        fixture.nativeElement.querySelector('.stack-block-expandable > .stack-block-label .stack-block-caret')
      ).toBeNull();
    });

    it('adds a unique id to the label', () => {
      fixture = TestBed.createComponent(BasicBlock);
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').id).toContain('clr-id-');
    });

    it('toggles the caret direction based on the expandable property', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      const caret: HTMLElement = fixture.nativeElement.querySelector('.stack-block-caret');

      expect(caret.getAttribute('direction')).toBe('right');

      getBlockInstance(fixture).expanded = true;

      renderFixture(fixture);

      expect(caret.getAttribute('direction')).toBe('down');
    });

    it('adds the on-focus class when the stack label is focused in an expandable but collapsed stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      const block: HTMLElement = fixture.nativeElement.querySelector('clr-stack-block');
      const label: HTMLElement = fixture.nativeElement.querySelector('.stack-block-label');

      expect(block.classList.contains('on-focus')).toBe(false);

      label.focus();
      renderFixture(fixture);

      expect(block.classList.contains('on-focus')).toBe(true);

      label.blur();
      renderFixture(fixture);

      expect(block.classList.contains('on-focus')).toBe(false);
    });

    it('does not add the on-focus class when the stack block is not expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      getBlockInstance(fixture).expandable = false;
      renderFixture(fixture);

      const block: HTMLElement = fixture.nativeElement.querySelector('clr-stack-block');
      const label: HTMLElement = fixture.nativeElement.querySelector('.stack-block-label');

      expect(block.classList.contains('on-focus')).toBe(false);

      label.focus();
      renderFixture(fixture);

      expect(block.classList.contains('on-focus')).toBe(false);
    });

    it('adds a button role on a stack label in an expandable stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('role')).toBe('button');

      getBlockInstance(fixture).expandable = false;
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('role')).toBeNull();
    });

    it('adds a tabindex on a stack label in an expandable stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('tabindex')).toBe('0');

      getBlockInstance(fixture).expandable = false;
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('tabindex')).toBeNull();
    });

    it('adds the aria-expanded attribute when the stack block is expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).not.toBeNull();

      getBlockInstance(fixture).expandable = false;
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBeNull();
    });

    it('sets the aria-expanded attribute to true when the stack block is expanded', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBe('false');

      getBlockInstance(fixture).expanded = true;
      renderFixture(fixture);

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBe('true');
    });

    it('starts collapsed', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      expect(getBlockInstance(fixture).expanded).toBeFalsy();
    });

    it('expands and collapses when clicking on the label', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);
      expect(getBlockInstance(fixture).expanded).toBeFalsy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      renderFixture(fixture);
      expect(getBlockInstance(fixture).expanded).toBeTruthy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      renderFixture(fixture);
      expect(getBlockInstance(fixture).expanded).toBeFalsy();
    });

    it('offers two-way binding on clrSbExpanded', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.componentInstance.expanded = true;
      renderFixture(fixture);
      expect(getBlockInstance(fixture).expanded).toBeTruthy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      renderFixture(fixture);
      expect(fixture.componentInstance.expanded).toBeFalsy();
    });

    it('should skip children when block is not expanded', () => {
      fixture = TestBed.createComponent(DynamicBlockWithInput);

      renderFixture(fixture);

      expect(getBlockInstance(fixture).expanded).toBeFalsy();

      const input = fixture.nativeElement.querySelector('input');

      expect(input).toBeNull();
    });

    it('sets aria-controls attribute corresponding to stack-children id', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);

      const stackLabel = fixture.nativeElement.querySelector('.stack-block-label');
      // make sure the attribute does not exist when collapsed
      expect(stackLabel.getAttribute('aria-controls')).toBeNull();
      fixture.componentInstance.expanded = true;
      renderFixture(fixture);
      const controlsId = stackLabel.getAttribute('aria-controls');
      expect(controlsId).not.toBeNull();
      const childrenId = fixture.nativeElement.querySelector('.stack-children > [role="region"]').getAttribute('id');
      expect(childrenId).toBe(controlsId);
    });

    it('expandable child block is aria-labelledby the stack block title', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      renderFixture(fixture);
      fixture.componentInstance.expanded = true;
      renderFixture(fixture);
      const stackLabel = fixture.nativeElement.querySelector('clr-stack-label');
      const stackLabelId = stackLabel.getAttribute('id');
      expect(stackLabelId).not.toBeNull();
      const blockLabelledBy = fixture.nativeElement
        .querySelector('.stack-children > [role="region"]')
        .getAttribute('aria-labelledby');
      expect(blockLabelledBy).not.toBeNull();
      expect(blockLabelledBy).toBe(stackLabelId);

      // but still works if id is removed
      stackLabel.setAttribute('id', null);
      renderFixture(fixture);
      const defaultStackLabelId = stackLabel.getAttribute('id');
      expect(defaultStackLabelId).not.toBeNull();
      const defaultBlockLabelledBy = fixture.nativeElement
        .querySelector('.stack-children > [role="region"]')
        .getAttribute('aria-labelledby');
      expect(defaultBlockLabelledBy).not.toBeNull();
      expect(defaultBlockLabelledBy).toBe(stackLabelId);
    });

    it('should not have heading role and aria-level attribute set if ariaLevel is not set', async () => {
      fixture = TestBed.createComponent(NestedBlocks);
      renderFixture(fixture);
      const component = fixture.componentInstance;
      component.blockInstance.expanded = true;
      await delay();
      renderFixture(fixture);

      const topLevelBlock = fixture.nativeElement.querySelector('.stack-block-expandable');
      expect(topLevelBlock.getAttribute('role')).toBeNull();
      expect(component.blockInstance.ariaLevel).toBeNull();
      expect(topLevelBlock.getAttribute('aria-level')).toBeNull();

      const childBlocks = fixture.nativeElement.querySelectorAll('.stack-children .stack-block');
      childBlocks.forEach((block: HTMLElement) => {
        expect(block.getAttribute('role')).toBeNull();
        expect(block.getAttribute('aria-level')).toBeNull();
      });
    });

    it('should have expected explicit heading roles and aria heading levels', async () => {
      fixture = TestBed.createComponent(NestedBlocks);
      renderFixture(fixture);
      const component = fixture.componentInstance;
      component.explicitHeadingLevels = true;
      component.blockInstance.expanded = true;
      await delay();
      renderFixture(fixture);

      const topLevelBlock = fixture.nativeElement.querySelector('.stack-block-expandable');
      expect(topLevelBlock.getAttribute('role')).toBe('heading');
      expect(topLevelBlock.getAttribute('aria-level')).toBe('1');

      const childBlocks = fixture.nativeElement.querySelectorAll('.stack-children .stack-block');
      childBlocks.forEach((block: HTMLElement) => {
        expect(block.getAttribute('role')).toBe('heading');
        expect(block.getAttribute('aria-level')).toBe('2');
      });
    });

    describe('Space interaction with elements', () => {
      let spy: Spy<any>;
      let keyDown: KeyboardEvent;
      let keyUp: KeyboardEvent;

      function executeElementTest(elementName: string) {
        const element = fixture.nativeElement.querySelector(elementName) as HTMLElement;

        element.focus();

        element.dispatchEvent(keyDown);
        element.dispatchEvent(keyUp);
        renderFixture(fixture);

        expect(spy).toHaveBeenCalledWith(keyUp);
      }

      beforeEach(async () => {
        keyDown = new KeyboardEvent('keydown', { key: Keys.Space, bubbles: true });
        keyUp = new KeyboardEvent('keyup', { key: Keys.Space, bubbles: true });
        fixture = TestBed.createComponent(BlocksWithIinteractiveElements);
        fixture.whenRenderingDone();
        renderFixture(fixture);
        spy = vi.spyOn(fixture.componentInstance.testBlockInstance, 'toggleExpand');
      });

      it('Events sent through input element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('input');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through textarea element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('textarea');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through button element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('button');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through link element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('a');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through select element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('select');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through select option element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        const select = fixture.nativeElement.querySelector('select') as HTMLElement;

        select.click();
        renderFixture(fixture);

        executeElementTest('option');

        // Expect no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through div element should expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('div#to-open[tabindex="0"]');

        // Expect changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeTruthy();
        expect(fixture.componentInstance.testExpanded).toBeTruthy();
      });
    });
  });
});
