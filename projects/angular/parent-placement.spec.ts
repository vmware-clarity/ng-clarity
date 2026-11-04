/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ControlContainer, FormsModule } from '@angular/forms';

import { ClrAccordionModule } from './accordion/accordion.module';
import { ClrDatagridModule } from './data/datagrid/datagrid.module';
import { ClrTabsModule } from './layout/tabs/tabs.module';
import { ClrStepperModule } from './stepper/stepper.module';

@Component({ template: '', standalone: false, changeDetection: ChangeDetectionStrategy.Eager })
class PlacementHost {}

@Component({
  selector: 'placement-wrapper',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
  standalone: false,
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }) },
  ],
})
class PlacementWrapper {}

describe('Parent placement diagnostics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrAccordionModule, ClrStepperModule, ClrTabsModule, ClrDatagridModule, FormsModule],
      declarations: [PlacementHost, PlacementWrapper],
    });
  });

  const misplaced: [string, string][] = [
    [
      '<form clrStepper><clr-accordion-panel></clr-accordion-panel></form>',
      'clr-accordion-panel should only be used inside of clr-accordion',
    ],
    ['<clr-accordion-panel></clr-accordion-panel>', 'clr-accordion-panel should only be used inside of clr-accordion'],
    ['<clr-stepper-panel></clr-stepper-panel>', 'clr-stepper-panel should only be used inside of clrStepper'],
    [
      '<button clrStepButton>Next</button>',
      'clrStepButton should only be used inside of clr-stepper-panel within clrStepper',
    ],
    ['<button clrTabLink>Tab</button>', 'clrTabLink and clr-tab-content should only be used inside of a clr-tabs'],
    [
      '<clr-tab-content>Content</clr-tab-content>',
      'clrTabLink and clr-tab-content should only be used inside of a clr-tabs',
    ],
    ['<clr-dg-row></clr-dg-row>', 'clr-dg-row should only be used inside of clr-datagrid'],
  ];
  misplaced.forEach(([template, message]) => {
    it(`reports a useful error for ${template}`, () => {
      TestBed.overrideComponent(PlacementHost, { set: { template } });
      expect(() => TestBed.createComponent(PlacementHost)).toThrowError(message);
    });
  });

  const wrapped: [string, string][] = [
    ['<clr-accordion><placement-wrapper /></clr-accordion>', '<clr-accordion-panel></clr-accordion-panel>'],
    [
      '<form clrStepper><placement-wrapper /></form>',
      '<clr-stepper-panel ngModelGroup="step"><button clrStepButton>Next</button></clr-stepper-panel>',
    ],
    [
      '<clr-tabs><clr-tab><placement-wrapper /></clr-tab></clr-tabs>',
      '<button clrTabLink>Tab</button><clr-tab-content>Content</clr-tab-content>',
    ],
    ['<clr-datagrid><placement-wrapper /></clr-datagrid>', '<clr-dg-row><clr-dg-cell>Cell</clr-dg-cell></clr-dg-row>'],
  ];
  wrapped.forEach(([template, childTemplate]) => {
    it(`resolves the parent across a component wrapper in ${template}`, () => {
      TestBed.overrideComponent(PlacementHost, { set: { template } });
      TestBed.overrideComponent(PlacementWrapper, { set: { template: childTemplate } });
      const fixture = TestBed.createComponent(PlacementHost);
      expect(fixture.componentInstance).toBeTruthy();
      fixture.destroy();
    });
  });
});
