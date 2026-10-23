/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Inject, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrIfExpanded } from './if-expanded.directive';
import { IfExpandService } from './if-expanded.service';

describe('IfExpanded directive', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  describe('View', () => {
    beforeEach(() => {
      /*
       * Since IfExpanded is a structural directive that isn't rendered in the DOM immediately,
       * we can't use our usual shortcut, we need to rely on @ViewChild.
       * A quick investigation didn't reveal a better solution yet, we might want to look into it more.
       */
      TestBed.configureTestingModule({
        imports: [ClrIfExpanded],
        declarations: [SimpleTest, TestCounter],
        providers: [IfExpandService],
      });
      testContext.fixture = TestBed.createComponent(SimpleTest);
      testContext.fixture.detectChanges();
      testContext.testComponent = testContext.fixture.componentInstance;
      testContext.testElement = testContext.fixture.nativeElement;
      testContext.clarityDirective = testContext.fixture.componentInstance.ifExpanded;
      testContext.expand = TestBed.inject(IfExpandService);
    });

    afterEach(() => {
      testContext.fixture.destroy();
    });

    it("doesn't display anything by default", () => {
      expect(testContext.testElement.textContent.trim()).toBe('');
    });

    it('displays the content when the parent becomes expanded', () => {
      testContext.expand.expanded = true;
      testContext.fixture.detectChanges();
      expect(testContext.testElement.textContent.trim()).toBe('1');
    });

    it('removes the content when the parent becomes collapsed again', () => {
      testContext.expand.expanded = true;
      testContext.fixture.detectChanges();
      testContext.expand.expanded = false;
      testContext.fixture.detectChanges();
      expect(testContext.testElement.textContent.trim()).toBe('');
    });

    it("doesn't instantiate until the content is actually needed", () => {
      expect(testContext.testComponent.counter.total).toBe(0);
    });

    it('re-instantiates the content every time it is displayed', () => {
      testContext.expand.expanded = true;
      testContext.fixture.detectChanges();
      expect(testContext.testElement.textContent.trim()).toBe('1');
      testContext.expand.expanded = false;
      testContext.fixture.detectChanges();
      testContext.expand.expanded = true;
      testContext.fixture.detectChanges();
      expect(testContext.testElement.textContent.trim()).toBe('2');
    });

    it('have template reference', () => {
      expect(testContext.expand.hasExpandTemplate).toBe(true);
    });
  });

  describe('Template Ref', () => {
    beforeEach(() => {
      /*
       * Since IfExpanded is a structural directive that isn't rendered in the DOM immediately,
       * we can't use our usual shortcut, we need to rely on @ViewChild.
       * A quick investigation didn't reveal a better solution yet, we might want to look into it more.
       */
      TestBed.configureTestingModule({
        imports: [ClrIfExpanded],
        declarations: [SimpleTemplateTest, TestCounter],
        providers: [IfExpandService],
      });
      testContext.fixture = TestBed.createComponent(SimpleTemplateTest);
      testContext.fixture.detectChanges();
      testContext.expand = TestBed.inject(IfExpandService);
    });

    afterEach(() => {
      testContext.fixture.destroy();
    });

    it("don't have template reference", () => {
      expect(testContext.expand.hasExpandTemplate).toBe(false);
    });
  });

  describe('Parent interaction', () => {
    beforeEach(() => {
      /*
       * Since IfExpanded is a structural directive that isn't rendered in the DOM immediately,
       * we can't use our usual shortcut, we need to rely on @ViewChild.
       * A quick investigation didn't reveal a better solution yet, we might want to look into it more.
       */
      TestBed.configureTestingModule({
        imports: [ClrIfExpanded],
        declarations: [NgIfTest],
        providers: [IfExpandService],
      });
      testContext.fixture = TestBed.createComponent(NgIfTest);
      testContext.fixture.detectChanges();
      testContext.testComponent = testContext.fixture.componentInstance;
      testContext.expand = TestBed.inject(IfExpandService);
    });

    afterEach(() => {
      testContext.fixture.destroy();
    });

    it('sets the parent as expandable', () => {
      expect(testContext.expand.expandable).toBeGreaterThan(0);
    });

    it('sets the parent as not expandable when destroyed', () => {
      testContext.testComponent.expandable = false;
      testContext.fixture.detectChanges();
      expect(testContext.expand.expandable).toBe(0);
    });
  });
});

@Component({
  template: `<test-counter *clrIfExpanded></test-counter>`,
  providers: [{ provide: 'counter', useFactory: () => ({ total: 0 }) }],
  standalone: false,
})
class SimpleTest {
  @ViewChild(ClrIfExpanded) ifExpanded: ClrIfExpanded;

  constructor(
    @Inject('counter')
    public counter: {
      total: number;
    }
  ) {}
}

@Component({
  template: `<test-counter [clrIfExpanded]></test-counter>`,
  providers: [{ provide: 'counter', useFactory: () => ({ total: 0 }) }],
  standalone: false,
})
class SimpleTemplateTest {
  @ViewChild(ClrIfExpanded) ifExpanded: ClrIfExpanded;

  constructor(
    @Inject('counter')
    public counter: {
      total: number;
    }
  ) {}
}

@Component({
  selector: 'test-counter',
  template: `{{ count }}`,
  standalone: false,
})
class TestCounter {
  count: number;

  constructor(
    @Inject('counter')
    counter: {
      total: number;
    }
  ) {
    this.count = ++counter.total;
  }
}

@Component({
  template: `
    @if (expandable) {
      <div *clrIfExpanded>Hello World</div>
    }
  `,
  standalone: false,
})
class NgIfTest {
  expandable = true;
}
