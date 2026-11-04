/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IfExpandService } from '@clr/angular/utils';

import { ClrAccordionPanel } from './accordion-panel';
import { ClrAccordionModule } from './accordion.module';

/**
 * OnPush component that renders the panel's expanded state straight from `IfExpandService`.
 * It never calls `markForCheck()`: it is only refreshed because the service state is a signal.
 */
@Component({
  selector: 'expanded-probe',
  template: `<span class="probe">{{ expand.expanded ? 'expanded' : 'collapsed' }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ExpandedProbe {
  constructor(public expand: IfExpandService) {}
}

@Component({
  template: `
    <clr-accordion>
      <clr-accordion-panel [clrAccordionPanelOpen]="firstOpen()">
        <clr-accordion-title>Panel 1</clr-accordion-title>
        <clr-accordion-content><expanded-probe></expanded-probe></clr-accordion-content>
      </clr-accordion-panel>
      <clr-accordion-panel [clrAccordionPanelOpen]="secondOpen()">
        <clr-accordion-title>Panel 2</clr-accordion-title>
        <clr-accordion-content><expanded-probe></expanded-probe></clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessAccordionHost {
  readonly firstOpen = signal(false);
  readonly secondOpen = signal(false);
}

describe('ClrAccordion (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessAccordionHost>;

  function panelServices(): IfExpandService[] {
    return fixture.debugElement
      .queryAll(By.directive(ClrAccordionPanel))
      .map(panel => panel.injector.get(IfExpandService));
  }

  function probeTexts(): string[] {
    return fixture.debugElement.queryAll(By.css('.probe')).map(probe => probe.nativeElement.textContent.trim());
  }

  function headerButtons(): HTMLButtonElement[] {
    return fixture.debugElement.queryAll(By.css('.clr-accordion-header-button')).map(button => button.nativeElement);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ZonelessAccordionHost, ExpandedProbe],
      imports: [ClrAccordionModule],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });

    fixture = TestBed.createComponent(ZonelessAccordionHost);
    await fixture.whenStable();
  });

  it('renders the panels collapsed initially', () => {
    expect(headerButtons().map(button => button.getAttribute('aria-expanded'))).toEqual(['false', 'false']);
    expect(probeTexts()).toEqual([]);
  });

  it('updates the panel view when the host opens it through a signal input after the first render', async () => {
    fixture.componentInstance.firstOpen.set(true);
    await fixture.whenStable();

    expect(headerButtons().map(button => button.getAttribute('aria-expanded'))).toEqual(['true', 'false']);
    expect(panelServices().map(service => service.expanded)).toEqual([true, false]);
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('refreshes OnPush views reading IfExpandService when it is changed programmatically', async () => {
    fixture.componentInstance.firstOpen.set(true);
    await fixture.whenStable();
    expect(probeTexts()).toEqual(['expanded']);

    // Late change, outside of any template event and without markForCheck(): only the signal can refresh the probe.
    panelServices()[0].expanded = false;
    await fixture.whenStable();
    expect(probeTexts()).toEqual(['collapsed']);

    panelServices()[0].expanded = true;
    await fixture.whenStable();
    expect(probeTexts()).toEqual(['expanded']);
  });

  it('updates the previously open panel when a sibling panel is opened', async () => {
    headerButtons()[0].click();
    await fixture.whenStable();
    expect(headerButtons().map(button => button.getAttribute('aria-expanded'))).toEqual(['true', 'false']);
    expect(probeTexts()).toEqual(['expanded']);

    // Opening the sibling closes the first panel (single panel mode); its expanded state is reset late,
    // once the collapse animation is done.
    headerButtons()[1].click();
    await fixture.whenStable();

    expect(headerButtons().map(button => button.getAttribute('aria-expanded'))).toEqual(['false', 'true']);
    expect(panelServices().map(service => service.expanded)).toEqual([false, true]);
    expect(probeTexts()).toEqual(['expanded']);
  });
});
