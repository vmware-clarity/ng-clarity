/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '../../clr-angular.module';
import { Keys } from '../../utils/enums/keys.enum';
import { ClrStackBlock } from './stack-block';
import { ClrStackView } from './stack-view';

import Spy = jasmine.Spy;

@Component({
  template: `
    <clr-stack-block [clrStackViewLevel]="ariaLevel">
      <clr-stack-label>Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
    </clr-stack-block>
  `,
})
class BasicBlock {
  @ViewChild(ClrStackBlock) blockInstance: ClrStackBlock;
  ariaLevel: number;
}

@Component({
  template: `
    <clr-stack-block #main>
      <clr-stack-label>Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
      <clr-stack-block>
        <clr-stack-label>Sub-Label 1</clr-stack-label>
        <clr-stack-content>Sub-Content 1</clr-stack-content>
      </clr-stack-block>
      <clr-stack-block>
        <clr-stack-label>Sub-Label 2</clr-stack-label>
        <clr-stack-content>Sub-Content 2</clr-stack-content>
      </clr-stack-block>
    </clr-stack-block>
  `,
})
class NestedBlocks {
  @ViewChild('main') blockInstance: ClrStackBlock;
}

@Component({
  template: `
    <clr-stack-block [clrSbExpandable]="true" [(clrSbExpanded)]="expanded">
      <clr-stack-label id="STACK_LABEL_ID">Label</clr-stack-label>
      <clr-stack-content>Content</clr-stack-content>
    </clr-stack-block>
  `,
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
})
class DynamicBlockWithInput {
  @ViewChild('main') blockInstance: ClrStackBlock;

  expanded = false;
}

@Component({
  template: `
    <clr-stack-view #stackView>
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
    </clr-stack-view>
  `,
})
class BlocksWithIinteractiveElements {
  @ViewChild('main') blockInstance: ClrStackBlock;
  @ViewChild('test') testBlockInstance: ClrStackBlock;
  @ViewChild('inner') innerBlockInstance: ClrStackBlock;

  content = '';
  expanded = true;
  testExpanded = false;
}

export default function (): void {
  'use strict';
  describe('StackBlock', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule, FormsModule],
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

    describe('Accessibility', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(BasicBlock);
        fixture.componentInstance.ariaLevel = 42;
        fixture.detectChanges();
      });
    });

    it('projects content', () => {
      fixture = TestBed.createComponent(BasicBlock);
      fixture.detectChanges();
      compiled = fixture.nativeElement;

      expect(compiled.textContent).toMatch(/Label/);
      expect(compiled.textContent).toMatch(/Content/);
    });

    it('is not expandable by default', () => {
      fixture = TestBed.createComponent(BasicBlock);
      fixture.detectChanges();

      expect(getBlockInstance(fixture).expandable).toBeFalsy();
    });

    it('is automatically expandable if has block children', () => {
      fixture = TestBed.createComponent(NestedBlocks);
      fixture.detectChanges();

      expect(getBlockInstance(fixture).expandable).toBeTruthy();
    });

    it('can be made expandable without block children', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(getBlockInstance(fixture).expandable).toBeTruthy();
    });

    it('displays a caret when the stack block is expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-caret')).not.toBeNull();

      getBlockInstance(fixture).expandable = false;

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-caret')).toBeNull();
    });

    it('adds a unique id to the label', () => {
      fixture = TestBed.createComponent(BasicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').id).toContain('clr-id-');
    });

    it('toggles the caret direction based on the expandable property', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      const caret: HTMLElement = fixture.nativeElement.querySelector('.stack-block-caret');

      expect(caret.getAttribute('direction')).toBe('right');

      getBlockInstance(fixture).expanded = true;

      fixture.detectChanges();

      expect(caret.getAttribute('direction')).toBe('down');
    });

    it('adds the on-focus class when the stack label is focused in an expandable but collapsed stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      const block: HTMLElement = fixture.nativeElement.querySelector('clr-stack-block');
      const label: HTMLElement = fixture.nativeElement.querySelector('.stack-block-label');

      expect(block.classList.contains('on-focus')).toBe(false);

      label.focus();
      fixture.detectChanges();

      expect(block.classList.contains('on-focus')).toBe(true);

      label.blur();
      fixture.detectChanges();

      expect(block.classList.contains('on-focus')).toBe(false);
    });

    it('does not add the on-focus class when the stack block is not expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      getBlockInstance(fixture).expandable = false;
      fixture.detectChanges();

      const block: HTMLElement = fixture.nativeElement.querySelector('clr-stack-block');
      const label: HTMLElement = fixture.nativeElement.querySelector('.stack-block-label');

      expect(block.classList.contains('on-focus')).toBe(false);

      label.focus();
      fixture.detectChanges();

      expect(block.classList.contains('on-focus')).toBe(false);
    });

    it('adds a button role on a stack label in an expandable stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('role')).toBe('button');

      getBlockInstance(fixture).expandable = false;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('role')).toBeNull();
    });

    it('adds a tabindex on a stack label in an expandable stack block', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('tabindex')).toBe('0');

      getBlockInstance(fixture).expandable = false;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('tabindex')).toBeNull();
    });

    it('adds the aria-expanded attribute when the stack block is expandable', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).not.toBeNull();

      getBlockInstance(fixture).expandable = false;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBeNull();
    });

    it('sets the aria-expanded attribute to true when the stack block is expanded', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBe('false');

      getBlockInstance(fixture).expanded = true;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.stack-block-label').getAttribute('aria-expanded')).toBe('true');
    });

    it('starts collapsed', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      expect(getBlockInstance(fixture).expanded).toBeFalsy();
    });

    it('expands and collapses when clicking on the label', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();
      expect(getBlockInstance(fixture).expanded).toBeFalsy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      fixture.detectChanges();
      expect(getBlockInstance(fixture).expanded).toBeTruthy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      fixture.detectChanges();
      expect(getBlockInstance(fixture).expanded).toBeFalsy();
    });

    it('offers two-way binding on clrSbExpanded', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.componentInstance.expanded = true;
      fixture.detectChanges();
      expect(getBlockInstance(fixture).expanded).toBeTruthy();

      fixture.nativeElement.querySelector('clr-stack-label').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.expanded).toBeFalsy();
    });

    it('should skip children when block is not expanded', () => {
      fixture = TestBed.createComponent(DynamicBlockWithInput);

      fixture.detectChanges();

      expect(getBlockInstance(fixture).expanded).toBeFalsy();

      const input = fixture.nativeElement.querySelector('input');

      expect(input).toBeNull();
    });

    it('sets aria-controls attribute corresponding to stack-children id', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();

      const stackLabel = fixture.nativeElement.querySelector('.stack-block-label');
      // make sure the attribute does not exist when collapsed
      expect(stackLabel.getAttribute('aria-controls')).toBeNull();
      fixture.componentInstance.expanded = true;
      fixture.detectChanges();
      const controlsId = stackLabel.getAttribute('aria-controls');
      expect(controlsId).not.toBeNull();
      const childrenId = fixture.nativeElement.querySelector('.stack-children > [role="region"]').getAttribute('id');
      expect(childrenId).toBe(controlsId);
    });

    it('expandable child block is aria-labelledby the stack block title', () => {
      fixture = TestBed.createComponent(DynamicBlock);
      fixture.detectChanges();
      const component: ClrStackBlock = fixture.componentInstance;
      component.expanded = true;
      fixture.detectChanges();
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
      fixture.detectChanges();
      const defaultStackLabelId = stackLabel.getAttribute('id');
      expect(defaultStackLabelId).not.toBeNull();
      const defaultBlockLabelledBy = fixture.nativeElement
        .querySelector('.stack-children > [role="region"]')
        .getAttribute('aria-labelledby');
      expect(defaultBlockLabelledBy).not.toBeNull();
      expect(defaultBlockLabelledBy).toBe(stackLabelId);
    });

    it('should have expected heading roles and aria heading levels', fakeAsync(() => {
      fixture = TestBed.createComponent(NestedBlocks);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      component.blockInstance.expanded = true;
      tick();
      fixture.detectChanges();

      const topLevelBlock = fixture.nativeElement.querySelector('.stack-block-expandable');
      expect(topLevelBlock.getAttribute('role')).toBe('heading');
      expect(topLevelBlock.getAttribute('aria-level')).toBe('3');

      const childBlocks = fixture.nativeElement.querySelectorAll('.stack-children .stack-block');
      childBlocks.forEach(blok => {
        expect(blok.getAttribute('role')).toBe('heading');
        expect(blok.getAttribute('aria-level')).toBe('4');
      });
    }));

    describe('Space interaction with elements', () => {
      let spy: Spy<any>;
      const event = new KeyboardEvent('keydown', { key: Keys.Space, bubbles: true });

      function executeElementTest(elementName: string) {
        const element = fixture.nativeElement.querySelector(elementName) as HTMLElement;

        element.focus();
        fixture.detectChanges();

        element.dispatchEvent(event);
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(event);
      }

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BlocksWithIinteractiveElements);
        fixture.whenRenderingDone();
        fixture.detectChanges();
        spy = spyOn(fixture.componentInstance.testBlockInstance, 'eventIsInputEvent').and.callThrough();
      }));

      it('Events sent through input element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('input');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through textarea element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('textarea');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through button element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('button');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through link element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('a');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through select element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('select');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through select option element should NOT expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        const select = fixture.nativeElement.querySelector('select') as HTMLElement;

        select.click();
        fixture.detectChanges();

        executeElementTest('option');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();
      });

      it('Events sent through div element should expand block', () => {
        expect(getBlockInstance(fixture).expanded).toBeTruthy();
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeFalsy();
        expect(fixture.componentInstance.testExpanded).toBeFalsy();

        executeElementTest('div#to-open[tabindex="0"]');

        // no changes
        expect(fixture.componentInstance.testBlockInstance.expanded).toBeTruthy();
        expect(fixture.componentInstance.testExpanded).toBeTruthy();
      });
    });
  });
}
