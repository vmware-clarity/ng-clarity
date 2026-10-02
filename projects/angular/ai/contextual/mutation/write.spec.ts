/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrRadioModule } from '@clr/angular/forms/radio';
import { ClrSelectModule } from '@clr/angular/forms/select';
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrMutationEngineService } from './mutation-engine.service';
import {
  ClrElementMutationResult,
  ClrMutationConsequence,
  ClrMutationReport,
  ClrMutationTarget,
  provideClrMutationPolicy,
} from './mutation.interface';
import { descriptionMatches } from './write';
import { ClrPageContext } from '../interfaces/context.interface';
import { ClrContextEngineService } from '../providers/contextual-engine.service';

/** A third-party toggle: a custom element carrying the binding, rendering a checkbox. */
@Component({
  selector: 'app-toggle',
  template: '<input type="checkbox" role="switch" aria-label="Enabled" [checked]="on" (change)="flip($event)" />',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppToggle), multi: true }],
  standalone: false,
})
class AppToggle implements ControlValueAccessor {
  on = false;
  private onChange?: (value: boolean) => void;
  writeValue(value: boolean): void {
    this.on = !!value;
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(): void {
    // Not needed here.
  }
  flip(event: Event): void {
    this.on = (event.target as HTMLInputElement).checked;
    this.onChange?.(this.on);
  }
}

/** A custom control whose role says nothing about the value it takes. */
@Component({
  selector: 'app-rating',
  template: '<span aria-label="Rating">★★★</span>',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppRating), multi: true }],
  standalone: false,
})
class AppRating implements ControlValueAccessor {
  writeValue(): void {
    // Nothing to render.
  }
  registerOnChange(): void {
    // Not needed here.
  }
  registerOnTouched(): void {
    // Not needed here.
  }
}

/** A value accessor whose write throws, as a buggy third-party control's might. */
@Component({
  selector: 'app-broken',
  template: '<input aria-label="Broken" />',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AppBroken), multi: true }],
  standalone: false,
})
class AppBroken implements ControlValueAccessor {
  armed = false;
  writeValue(): void {
    if (this.armed) {
      throw new Error('The broken control refused.');
    }
  }
  registerOnChange(): void {
    // Not needed here.
  }
  registerOnTouched(): void {
    // Not needed here.
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      <app-toggle formControlName="enabled"></app-toggle>
      <app-rating formControlName="rating" role="listbox" aria-label="Rating"></app-rating>
      <app-broken formControlName="broken"></app-broken>
      <clr-input-container>
        <label>Name</label>
        <input clrInput formControlName="name" />
      </clr-input-container>
      <clr-select-container>
        <label>Plan</label>
        <select clrSelect formControlName="plan">
          <option value="free">Free</option>
          <option value="gold" disabled>Gold</option>
          <option value="team">Team</option>
        </select>
      </clr-select-container>
      <clr-select-container>
        <label>Colour</label>
        <select
          clrSelect
          formControlName="colour"
          (change)="colourEvents = colourEvents + 1"
          (blur)="colourEvents = colourEvents + 1"
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
        </select>
      </clr-select-container>
      <clr-select-container>
        <label>Region</label>
        <select clrSelect formControlName="region">
          <option value="eu">Europe</option>
          <option value="us">Americas</option>
        </select>
      </clr-select-container>
      <clr-select-container>
        <label>Office</label>
        <select clrSelect formControlName="office">
          <option value="lon">Main</option>
          <option value="par">Main</option>
          <option value="ber">Berlin</option>
        </select>
      </clr-select-container>
      <clr-radio-container>
        <label>Tier</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="tier" value="basic" />
          <label>Basic</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="tier" value="premium" [attr.disabled]="true" />
          <label>Premium</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <label for="due">Due</label>
      <input id="due" type="date" formControlName="due" />
      <label for="tint">Tint</label>
      <!-- A colour input has no role of its own; one given a role is offered for writing. -->
      <input id="tint" type="color" role="textbox" formControlName="tint" />
      <label for="volume">Volume</label>
      <input id="volume" type="range" min="0" max="10" step="2" formControlName="volume" />
      <label for="locked">Locked</label>
      <input id="locked" formControlName="locked" />
      <label for="code">Code</label>
      <input id="code" maxlength="4" formControlName="code" />
      <label for="strict">Strict</label>
      <input id="strict" formControlName="strict" />
      <clr-radio-container>
        <label>Card</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="card" value="visa" />
          <label>Visa <span class="secret">4111</span></label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="card" value="amex" />
          <label>Amex <span class="secret">3782</span></label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-select-container>
        <label>Grade</label>
        <select clrSelect formControlName="grade">
          <option value="" hidden>Choose</option>
          <option value="basic">Basic</option>
          <option value="gold" class="secret">Gold</option>
        </select>
      </clr-select-container>
      <clr-select-container>
        <label>Seats</label>
        <select clrSelect multiple formControlName="seats">
          <option value="free">Free</option>
          <option value="staff" class="secret">Internal staff plan</option>
          <option value="team">Team</option>
        </select>
      </clr-select-container>
    </form>
    @if (modalOpen) {
      <div role="dialog" aria-modal="true" aria-label="Confirm">
        <label for="inside">Inside</label>
        <input id="inside" [formControl]="inside" />
      </div>
    }
  `,
  standalone: false,
})
class Host {
  form = new FormGroup({
    enabled: new FormControl(true),
    rating: new FormControl(3),
    broken: new FormControl(''),
    name: new FormControl('', Validators.required),
    plan: new FormControl('free'),
    colour: new FormControl('red', { updateOn: 'blur' }),
    region: new FormControl('eu', { updateOn: 'submit' }),
    office: new FormControl('ber'),
    tier: new FormControl('basic'),
    due: new FormControl(''),
    tint: new FormControl('#000000'),
    volume: new FormControl(4),
    locked: new FormControl({ value: 'fixed', disabled: true }),
    code: new FormControl(''),
    card: new FormControl<string | null>(null),
    seats: new FormControl<string[]>(['staff']),
    grade: new FormControl('gold'),
    strict: new FormControl('', (control: AbstractControl) => {
      if (control.value === 'boom') {
        throw new Error('The validator exploded.');
      }
      return null;
    }),
  });
  inside = new FormControl('');
  colourEvents = 0;
  modalOpen = false;
}

function findNode(
  nodes: ClrComponentContext[],
  match: (node: ClrComponentContext) => boolean
): ClrComponentContext | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    const inside = findNode(node.children ?? [], match);
    if (inside) {
      return inside;
    }
  }
  return null;
}

function refOf(snapshot: ClrPageContext, label: string): string {
  const node = findNode(snapshot.components, candidate => !!candidate.ref && candidate.label === label);
  if (!node?.ref) {
    throw new Error(`no ref for "${label}" in ${JSON.stringify(snapshot.components)}`);
  }
  return node.ref;
}

describe('ClrMutationEngineService write path', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let contextEngine: ClrContextEngineService;
  let engine: ClrMutationEngineService;
  let classify: jasmine.Spy<(target: ClrMutationTarget) => ClrMutationConsequence>;
  let confirm: jasmine.Spy<(target: ClrMutationTarget) => boolean | Promise<boolean>>;
  let announce: jasmine.Spy<(report: ClrMutationReport) => void>;

  beforeEach(async () => {
    classify = jasmine.createSpy('classify').and.returnValue('reversible');
    confirm = jasmine.createSpy('confirm').and.returnValue(true);
    announce = jasmine.createSpy('announce');
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        ClrCommonFormsModule,
        ClrInputModule,
        ClrSelectModule,
        ClrRadioModule,
      ],
      declarations: [Host, AppToggle, AppRating, AppBroken],
      providers: [
        provideClrMutationPolicy({
          classify: target => classify(target),
          confirm: target => confirm(target),
          announce: report => announce(report),
          confirmTimeoutMs: 200,
        }),
      ],
    });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    contextEngine = TestBed.inject(ClrContextEngineService);
    engine = TestBed.inject(ClrMutationEngineService);
  });

  afterEach(() => fixture.destroy());

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function set(label: string, value: unknown, description = label): Promise<ClrElementMutationResult> {
    const ref = refOf(contextEngine.getSnapshot(), label);
    const report = await engine.apply([{ operation: 'setValue', ref, description, value }]);
    await settle();
    return report.results[0] as ClrElementMutationResult;
  }

  describe('custom controls', () => {
    it('writes a boolean to a custom toggle judged by the role it renders, and unticks it', async () => {
      const result = await set('Enabled', false);

      expect(result.applied).toBeTrue();
      expect(host.form.value.enabled).toBe(false);
      expect(fixture.nativeElement.querySelector('app-toggle input').checked).toBeFalse();
      expect((await set('Enabled', 'maybe')).refused).toBe('invalid');
    });

    it('refuses a custom control whose role says nothing about its value', async () => {
      const result = await set('Rating', 5);

      expect(result.refused).toBe('unsupported');
      expect(result.detail).toContain('clrPublishElementMutator');
      expect(host.form.value.rating).toBe(3);
    });

    it('reports a control that throws as refused, and still applies the operations after it', async () => {
      const component = fixture.debugElement.query(debug => debug.componentInstance instanceof AppBroken)
        .componentInstance as AppBroken;
      component.armed = true;
      const page = contextEngine.getSnapshot();

      const report = await engine.apply([
        { operation: 'setValue', ref: refOf(page, 'Broken'), description: 'Broken', value: 'x' },
        { operation: 'setValue', ref: refOf(page, 'Name'), description: 'Name', value: 'Ada' },
      ]);

      expect(report.results[0]).toEqual(
        jasmine.objectContaining({ applied: false, refused: 'invalid', detail: 'The broken control refused.' })
      );
      expect(report.results[1].applied).toBeTrue();
      expect(host.form.value.name).toBe('Ada');
      // The refused write leaves the control as the user left it, value included.
      expect(host.form.controls.broken.value).toBe('');
      expect(host.form.getRawValue().broken).toBe('');
      expect(host.form.controls.broken.touched).toBeFalse();
      expect(host.form.controls.broken.dirty).toBeFalse();
    });

    it('puts the view back too when a validator throws on the value', async () => {
      const result = await set('Strict', 'boom');

      expect(result).toEqual(jasmine.objectContaining({ applied: false, refused: 'invalid' }));
      expect(host.form.controls.strict.value).toBe('');
      expect((fixture.nativeElement.querySelector('#strict') as HTMLInputElement).value).toBe('');
    });
  });

  describe('choices', () => {
    it('refuses a disabled option and lists only the ones that can be chosen', async () => {
      const disabled = await set('Plan', 'Gold');
      expect(disabled.refused).toBe('invalid');
      expect(host.form.value.plan).toBe('free');

      const unknown = await set('Plan', 'Platinum');
      expect(unknown.detail).toContain('"Free", "Team"');
      expect(unknown.detail).not.toContain('Gold');
    });

    it('refuses an option label several options share, unless a value names one of them', async () => {
      const ambiguous = await set('Office', 'Main');
      expect(ambiguous.refused).toBe('invalid');
      expect(ambiguous.detail).toContain('Several options read "Main"');
      expect(host.form.value.office).toBe('ber');

      expect((await set('Office', 'par')).applied).toBeTrue();
      expect(host.form.value.office).toBe('par');
    });

    it('refuses a disabled radio in a group', async () => {
      const result = await set('Tier', 'Premium');

      expect(result.refused).toBe('invalid');
      expect(host.form.value.tier).toBe('basic');
    });

    it('refuses a control whose form control is disabled, whatever the DOM says', async () => {
      host.form.controls.tier.disable();
      await settle();

      expect((await set('Tier', 'Basic')).refused).toBe('disabled');
    });

    it('takes a select value that updates on blur, and reads it back from the model', async () => {
      const result = await set('Colour', 'Blue');

      expect(result).toEqual(jasmine.objectContaining({ applied: true, value: 'Blue', previous: 'Red' }));
      expect(host.form.value.colour).toBe('blue');
    });

    it('writes a select without running the application’s own change or blur handlers', async () => {
      expect((await set('Colour', 'Blue')).applied).toBeTrue();
      expect((await set('Plan', 'Team')).applied).toBeTrue();

      expect(host.colourEvents).toBe(0);
      expect(host.form.value.plan).toBe('team');
    });

    it("relies on Angular's select accessors keeping onChange and onTouched", () => {
      // Not documented API: should Angular rename them, every select write is refused as
      // unsupported, and this says why.
      const select = fixture.debugElement.query(
        debug => debug.nativeElement.getAttribute?.('formControlName') === 'plan'
      );
      const accessor = select.injector.get(NgControl).valueAccessor as unknown as Record<string, unknown>;

      expect(typeof accessor['onChange']).toBe('function');
      expect(typeof accessor['onTouched']).toBe('function');
    });

    it('clears a select with no empty option to nothing, never to its first option', async () => {
      const ref = refOf(contextEngine.getSnapshot(), 'Office');
      const report = await engine.apply([{ operation: 'clear', ref, description: 'Office' }]);
      await settle();
      const result = report.results[0] as ClrElementMutationResult;

      expect(result).toEqual(jasmine.objectContaining({ applied: true, value: null, previous: 'Berlin' }));
      expect(classify).toHaveBeenCalledWith(jasmine.objectContaining({ label: 'Office', value: null }));
      expect(host.form.value.office).toBeNull();
      expect(fixture.nativeElement.querySelector('select[formControlName="office"]').selectedIndex).toBe(-1);
    });

    it('refuses a select that applies its value only on submit', async () => {
      const result = await set('Region', 'Americas');

      expect(result.refused).toBe('unsupported');
      expect(host.form.getRawValue().region).toBe('eu');
    });
  });

  describe('typed and bounded values', () => {
    it('takes a date input only in the format the browser accepts', async () => {
      expect((await set('Due', 'next Tuesday')).refused).toBe('invalid');
      expect(host.form.value.due).toBe('');
      expect((await set('Due', '2026-03-06')).applied).toBeTrue();
      expect(host.form.value.due).toBe('2026-03-06');
    });

    it('takes a colour in either case, as the lower-case value the field shows', async () => {
      const result = await set('Tint', '#AABBCC');

      expect(result).toEqual(jasmine.objectContaining({ applied: true, value: '#aabbcc' }));
      expect(host.form.value.tint).toBe('#aabbcc');
      expect((await set('Tint', 'teal')).refused).toBe('invalid');
    });

    it('refuses a number outside the input’s bounds or off its step', async () => {
      expect((await set('Volume', 20)).detail).toContain('at most 10');
      expect((await set('Volume', 3)).detail).toContain('multiple of 2');
      expect((await set('Volume', 8)).applied).toBeTrue();
      expect(host.form.value.volume).toBe(8);
    });

    it('refuses text longer than the field lets a person type', async () => {
      const long = await set('Code', 'ABCDE');
      expect(long.refused).toBe('invalid');
      expect(long.detail).toContain('at most 4 characters');
      expect(host.form.value.code).toBe('');

      expect((await set('Code', 'ABCD')).applied).toBeTrue();
      expect(host.form.value.code).toBe('ABCD');
    });
  });

  describe('emissions', () => {
    it('emits valueChanges once per write', async () => {
      const emitted: unknown[] = [];
      const subscription = host.form.controls.name.valueChanges.subscribe(value => emitted.push(value));

      await set('Name', 'Ada');
      subscription.unsubscribe();

      expect(emitted).toEqual(['Ada']);
    });

    it('tells the application what an apply did', async () => {
      await set('Name', 'Ada');

      expect(announce).toHaveBeenCalledTimes(1);
      expect(announce.calls.mostRecent().args[0].results[0].applied).toBeTrue();
    });
  });

  describe('descriptions', () => {
    it('matches whole words, not fragments', async () => {
      expect((await set('Name', 'Ada', 'the name field')).applied).toBeTrue();
      expect((await set('Name', 'Bob', 'e')).refused).toBe('mismatch');
      expect((await set('Name', 'Bob', '')).refused).toBe('mismatch');
    });

    it('refuses a description that warns it is about something else', async () => {
      expect((await set('Name', 'Ada', 'the wrong name')).refused).toBe('mismatch');
      expect((await set('Name', 'Ada', 'no name')).refused).toBe('mismatch');
      expect((await set('Name', 'Ada', 'the name input field')).applied).toBeTrue();
    });

    it('tells a field from its pair, and writes to a field whose own name negates', () => {
      expect(descriptionMatches('email', 'Email address')).toBeFalse();
      expect(descriptionMatches('the email address field', 'Email address')).toBeTrue();
      expect(descriptionMatches('Confirm email', 'Email')).toBeFalse();
      expect(descriptionMatches('email', 'Confirm email')).toBeFalse();
      expect(descriptionMatches('the confirm email field', 'Confirm email')).toBeTrue();
      expect(descriptionMatches('last name', 'Name')).toBeFalse();
      expect(descriptionMatches('Other income', 'Other income')).toBeTrue();
      expect(descriptionMatches('income', 'Other income')).toBeFalse();
      expect(descriptionMatches('No. of seats', 'No. of seats')).toBeTrue();
      expect(descriptionMatches('Never expires', 'Never expires')).toBeTrue();
      expect(descriptionMatches('not the other income', 'Other income')).toBeFalse();
    });

    it('tells a field from its pair in a language the word lists do not know', () => {
      expect(descriptionMatches('E-Mail', 'E-Mail bestätigen')).toBeFalse();
      expect(descriptionMatches('Mot de passe', 'Nouveau mot de passe')).toBeFalse();
      expect(descriptionMatches('Парола', 'Потвърди парола')).toBeFalse();
      expect(descriptionMatches('E-Mail bestätigen', 'E-Mail bestätigen')).toBeTrue();
      expect(descriptionMatches('nouveau mot de passe', 'Nouveau mot de passe')).toBeTrue();
    });

    it('matches a label the snapshot cut short on the words it kept', () => {
      expect(descriptionMatches('Street address of the head office', 'Street address of…')).toBeTrue();
      expect(descriptionMatches('Phone number', 'Street address of…')).toBeFalse();
    });

    it('refuses a description that only mentions the label among other words', async () => {
      expect((await set('Name', 'Ada', 'not the name, the password')).refused).toBe('mismatch');
      expect((await set('Name', 'Ada', 'the name textbox')).applied).toBeTrue();
    });
  });

  describe('choices the snapshot leaves out', () => {
    const options = { excludeSelectors: ['.secret'] };

    async function setWith(label: string, value: unknown): Promise<ClrElementMutationResult> {
      const ref = refOf(contextEngine.getSnapshot(options), label);
      const report = await engine.apply([{ operation: 'setValue', ref, description: label, value }], options);
      await settle();
      return report.results[0] as ClrElementMutationResult;
    }

    it('takes a radio by the label the snapshot showed, and quotes nothing it left out', async () => {
      const refused = await setWith('Card', 'Diners');
      expect(refused.detail).toContain('"Visa", "Amex"');
      expect(JSON.stringify(refused)).not.toContain('4111');

      const result = await setWith('Card', 'Visa');
      expect(result.applied).toBeTrue();
      expect(JSON.stringify(result)).not.toContain('4111');
      expect(host.form.value.card).toBe('visa');
    });

    it('does not replace a single choice the snapshot left out, and does replace a hidden placeholder', async () => {
      const refused = await setWith('Grade', 'Basic');
      expect(refused.refused).toBe('invalid');
      expect(refused.detail).toContain('kept from agents');
      expect(host.form.value.grade).toBe('gold');

      host.form.controls.grade.setValue('');
      await settle();
      expect((await setWith('Grade', 'Basic')).applied).toBeTrue();
      expect(host.form.value.grade).toBe('basic');
    });

    it('neither lists nor takes an excluded option, and keeps it selected', async () => {
      const refused = await setWith('Seats', ['Gold']);
      expect(refused.detail).toContain('"Free", "Team"');
      expect(refused.detail).not.toContain('staff');
      expect((await setWith('Seats', ['Internal staff plan'])).refused).toBe('invalid');

      const result = await setWith('Seats', ['Team']);
      expect(result.applied).toBeTrue();
      expect(result.value).toEqual(['Team']);
      expect(host.form.value.seats).toEqual(['staff', 'team']);
    });
  });

  describe('scope', () => {
    it('does not write what a snapshot with the options of the write would leave out, whatever snapshot the ref came from', async () => {
      const ref = refOf(contextEngine.getSnapshot(), 'Name');
      const write = async (snapshotOptions: object) =>
        (await engine.apply([{ operation: 'setValue', ref, description: 'Name', value: 'Ada' }], snapshotOptions))
          .results[0];

      expect((await write({ excludeSelectors: ['clr-input-container'] })).refused).toBe('hidden');
      expect((await write({ excludeRoles: ['form'] })).refused).toBe('hidden');
      expect((await write({ rootSelector: 'clr-select-container' })).refused).toBe('hidden');
      expect(host.form.value.name).toBe('');

      expect((await write({})).applied).toBeTrue();
      expect(host.form.value.name).toBe('Ada');
    });

    it('does not write a custom control whose rendered input the options leave out', async () => {
      const ref = refOf(contextEngine.getSnapshot(), 'Enabled');
      const options = { excludeSelectors: ['input[role="switch"]'] };

      expect(JSON.stringify(contextEngine.getSnapshot(options).components)).not.toContain('Enabled');
      const report = await engine.apply(
        [{ operation: 'setValue', ref, description: 'Enabled', value: false }],
        options
      );

      expect(report.results[0].refused).toBe('hidden');
      expect(host.form.value.enabled).toBeTrue();
    });

    it('refuses a field behind an open modal dialog, and writes the one inside it', async () => {
      const page = contextEngine.getSnapshot();
      const behind = refOf(page, 'Name');
      host.modalOpen = true;
      await settle();

      const report = await engine.apply([
        { operation: 'setValue', ref: behind, description: 'Name', value: 'x' },
        { operation: 'setValue', ref: refOf(contextEngine.getSnapshot(), 'Inside'), description: 'Inside', value: 'y' },
      ]);

      expect(report.results[0].refused).toBe('hidden');
      expect(report.results[1].applied).toBeTrue();
      expect(host.inside.value).toBe('y');
    });

    it('keeps a ref valid across a narrower snapshot taken by someone else', async () => {
      const ref = refOf(contextEngine.getSnapshot(), 'Name');
      contextEngine.getSnapshot({ rootSelector: 'app-toggle' });

      const report = await engine.apply([{ operation: 'setValue', ref, description: 'Name', value: 'Ada' }]);

      expect(report.results[0].applied).toBeTrue();
    });

    it('never hands out a ref an agent could work out from another', () => {
      const refs: string[] = [];
      const collect = (nodes: ClrComponentContext[]) =>
        nodes.forEach(node => {
          if (node.ref) {
            refs.push(node.ref);
          }
          collect(node.children ?? []);
        });
      collect(contextEngine.getSnapshot().components);

      expect(refs.length).toBeGreaterThan(3);
      expect(refs.every(ref => /^e[0-9a-z]{8}$/.test(ref))).toBeTrue();
      expect(refs).not.toContain('e1');
    });
  });

  describe('policy', () => {
    it('shows the policy the value in a person’s terms and the model value apart', async () => {
      await set('Plan', 'Team');

      expect(classify).toHaveBeenCalledWith(jasmine.objectContaining({ value: 'Team', label: 'Plan' }));
      // A native select's model value is only known once Angular's accessor maps the option.
      expect('modelValue' in classify.calls.mostRecent().args[0]).toBeFalse();

      await set('Tier', 'Basic');
      expect(classify.calls.mostRecent().args[0]).toEqual(
        jasmine.objectContaining({ value: 'Basic', modelValue: 'basic' })
      );
    });

    it('refuses as stale a choice whose option was replaced by another with the same label while confirming', async () => {
      classify.and.returnValue('consequential');
      let answer: (value: boolean) => void = () => undefined;
      confirm.and.returnValue(new Promise<boolean>(resolve => (answer = resolve)));
      const ref = refOf(contextEngine.getSnapshot(), 'Plan');

      const pending = engine.apply([{ operation: 'setValue', ref, description: 'Plan', value: 'Team' }]);
      await new Promise(resolve => setTimeout(resolve));
      const select = fixture.nativeElement.querySelector('select[formControlName="plan"]') as HTMLSelectElement;
      const impostor = document.createElement('option');
      impostor.value = 'enterprise';
      impostor.textContent = 'Team';
      select.replaceChild(
        impostor,
        Array.from(select.options).find(option => option.value === 'team') as HTMLOptionElement
      );
      answer(true);

      expect((await pending).results[0].refused).toBe('stale');
      expect(host.form.value.plan).toBe('free');
    });

    it('refuses a consequential operation when the policy cannot confirm, in plan() and apply() alike', async () => {
      fixture.destroy();
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          ReactiveFormsModule,
          FormsModule,
          ClrCommonFormsModule,
          ClrInputModule,
          ClrSelectModule,
          ClrRadioModule,
        ],
        declarations: [Host, AppToggle, AppRating, AppBroken],
        providers: [provideClrMutationPolicy({ classify: () => 'consequential' })],
      });
      const unconfirmed = TestBed.createComponent(Host);
      unconfirmed.detectChanges();
      await unconfirmed.whenStable();
      const page = TestBed.inject(ClrContextEngineService).getSnapshot();
      const mutation = TestBed.inject(ClrMutationEngineService);
      const operation = { operation: 'setValue' as const, ref: refOf(page, 'Name'), description: 'Name', value: 'x' };

      expect(mutation.plan([operation])[0].refused).toBe('unconfirmed');
      expect((await mutation.apply([operation])).results[0].refused).toBe('unconfirmed');
      expect(unconfirmed.componentInstance.form.value.name).toBe('');
      unconfirmed.destroy();
    });

    it('treats a confirmation that throws as declined, and an unknown verdict as forbidden', async () => {
      classify.and.returnValue('consequential');
      confirm.and.callFake(() => Promise.reject(new Error('dialog failed')));
      expect((await set('Name', 'x')).refused).toBe('declined');

      classify.and.returnValue('maybe' as never);
      expect((await set('Name', 'x')).refused).toBe('forbidden');
      expect(host.form.value.name).toBe('');
    });

    it('declines an operation whose confirmation is not answered in time, and goes on with the next call', async () => {
      classify.and.callFake(target => (target.label === 'Name' ? 'consequential' : 'reversible'));
      confirm.and.returnValue(new Promise<boolean>(() => undefined));
      const page = contextEngine.getSnapshot();

      const stuck = engine.apply([
        { operation: 'setValue', ref: refOf(page, 'Name'), description: 'Name', value: 'x' },
      ]);
      const next = engine.apply([
        { operation: 'setValue', ref: refOf(page, 'Enabled'), description: 'Enabled', value: false },
      ]);

      const declined = (await stuck).results[0];
      expect(declined.refused).toBe('declined');
      expect(declined.detail).toContain('not answered in time');
      expect((await next).results[0].applied).toBeTrue();
      expect(host.form.value.name).toBe('');
    });

    it('checks the field again after confirmation, and does not write one disabled meanwhile', async () => {
      classify.and.returnValue('consequential');
      let answer: (value: boolean) => void = () => undefined;
      confirm.and.returnValue(new Promise<boolean>(resolve => (answer = resolve)));
      const ref = refOf(contextEngine.getSnapshot(), 'Name');

      const pending = engine.apply([{ operation: 'setValue', ref, description: 'Name', value: 'written too late' }]);
      await new Promise(resolve => setTimeout(resolve));
      host.form.controls.name.disable();
      await settle();
      answer(true);

      expect((await pending).results[0].refused).toBe('disabled');
      expect(host.form.getRawValue().name).toBe('');
    });
  });
});
