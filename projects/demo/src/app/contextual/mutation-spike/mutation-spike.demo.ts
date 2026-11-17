/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { ClarityModule } from '@clr/angular';

import { SpikeStarRating } from './star-rating';
import { readDom, writeControl, WriteOptions, WriteResult } from './write-control';

interface City {
  id: number;
  name: string;
}

interface ScriptedWrite {
  control: string;
  /** CSS selector of the element the agent targets, inside this page. */
  target: string;
  value: unknown;
  options?: WriteOptions;
  model: () => unknown;
  /** Where to read the DOM back, when not the target itself. */
  dom?: string;
}

interface ResultRow extends WriteResult {
  n: number;
  control: string;
  value: string;
  modelAfter: string;
  domAfter: string;
}

const CITIES: City[] = [
  { id: 1, name: 'Frankfurt' },
  { id: 2, name: 'Paris' },
  { id: 3, name: 'Sofia' },
];

/** Spike: one generic writer against real controls. Each example shows its bound model live. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-contextual-mutation-spike-demo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ClarityModule, FormField, SpikeStarRating],
  templateUrl: './mutation-spike.demo.html',
  styleUrls: ['./mutation-spike.demo.scss'],
})
export class ContextualMutationSpikeDemo {
  readonly cities = CITIES;
  readonly letters = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
  readonly regions = [
    { value: 'us-east', label: 'US East' },
    { value: 'eu-west', label: 'EU West' },
    { value: 'ap-south', label: 'AP South' },
  ];

  m = {
    text: '',
    num: null as number | null,
    area: '',
    check: false,
    toggle: true,
    size: 'small',
    region: 'us-east',
    city: CITIES[1] as City | null,
    letter: null as string | null,
    comboCity: null as City | null,
    comboMulti: [] as string[],
    date: null as Date | null,
    dateText: '',
    rating: 2,
    disabledText: 'locked',
  };

  reactive = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(12)]),
    region: new FormControl('us-east'),
    agree: new FormControl(false),
    city: new FormControl<City | null>(null),
  });

  plain = { text: '', select: 'a', check: false };

  signalModel = signal({ name: '', count: 0 });
  signalForm = form(this.signalModel, path => {
    required(path.name);
  });

  textChanges = 0;
  results: ResultRow[] = [];
  running = false;

  readonly script: ScriptedWrite[] = [
    {
      control: 'Text (clrInput, ngModel)',
      target: '#spike-text',
      value: 'hello agent',
      model: () => `${this.m.text} (ngModelChange x${this.textChanges})`,
    },
    { control: 'Number (ngModel)', target: '#spike-number', value: '42', model: () => this.m.num },
    { control: 'Number, bad value', target: '#spike-number', value: 'forty-two', model: () => this.m.num },
    { control: 'Textarea (ngModel)', target: '#spike-area', value: 'line one\nline two', model: () => this.m.area },
    { control: 'Checkbox (ngModel)', target: '#spike-check', value: 'true', model: () => this.m.check },
    { control: 'Toggle (ngModel)', target: '#spike-toggle', value: 'false', model: () => this.m.toggle },
    { control: 'Radio "Large" (ngModel)', target: '#spike-size-large', value: 'large', model: () => this.m.size },
    { control: 'Select strings, by value', target: '#spike-region', value: 'eu-west', model: () => this.m.region },
    { control: 'Select strings, by label', target: '#spike-region', value: 'AP South', model: () => this.m.region },
    { control: 'Select [ngValue] objects', target: '#spike-city', value: 'Frankfurt', model: () => this.m.city },
    { control: 'Select [ngValue], unknown label', target: '#spike-city', value: 'Atlantis', model: () => this.m.city },
    {
      control: 'Select [ngValue], no label lookup',
      target: '#spike-city',
      value: 'Sofia',
      options: { resolveLabels: false },
      model: () => this.m.city,
    },
    {
      control: 'Combobox strings',
      target: '[data-spike=letter] input[role=combobox]',
      dom: '[data-spike=letter]',
      value: 'Bravo',
      model: () => this.m.letter,
    },
    {
      control: 'Combobox objects (closed)',
      target: '[data-spike=combo-city] input[role=combobox]',
      dom: '[data-spike=combo-city]',
      value: 'Sofia',
      model: () => this.m.comboCity,
    },
    {
      control: 'Combobox objects (closed), option b',
      target: '[data-spike=combo-city] input[role=combobox]',
      dom: '[data-spike=combo-city]',
      value: 'Paris',
      options: { refuseUnlistedOptions: true },
      model: () => this.m.comboCity,
    },
    {
      control: 'Combobox strings (closed), option b',
      target: '[data-spike=letter] input[role=combobox]',
      dom: '[data-spike=letter]',
      value: 'Delta',
      options: { refuseUnlistedOptions: true },
      model: () => this.m.letter,
    },
    {
      control: 'Combobox objects, no label lookup',
      target: '[data-spike=combo-city] input[role=combobox]',
      dom: '[data-spike=combo-city]',
      value: 'Sofia',
      options: { resolveLabels: false },
      model: () => this.m.comboCity,
    },
    {
      control: 'Combobox multi strings',
      target: '[data-spike=multi] input[role=combobox]',
      dom: '[data-spike=multi]',
      value: ['Alpha', 'Charlie'],
      model: () => this.m.comboMulti,
    },
    {
      control: 'Datepicker [(clrDate)], ISO',
      target: '#spike-date',
      value: '2026-12-01',
      model: () => this.m.date,
    },
    {
      control: 'Datepicker [(clrDate)], locale',
      target: '#spike-date',
      value: '12/01/2026',
      model: () => this.m.date,
    },
    {
      control: 'Datepicker ngModel, ISO',
      target: '#spike-date-text',
      value: '2026-12-01',
      model: () => this.m.dateText,
    },
    {
      control: 'Datepicker ngModel, locale',
      target: '#spike-date-text',
      value: '12/01/2026',
      model: () => this.m.dateText,
    },
    {
      control: 'Reactive text (required, max 12)',
      target: '#spike-r-name',
      value: 'Reactive ok',
      model: () => this.reactive.value.name,
    },
    {
      control: 'Reactive text, too long',
      target: '#spike-r-name',
      value: 'far too long for twelve',
      model: () => this.reactive.value.name,
    },
    {
      control: 'Reactive select',
      target: '#spike-r-region',
      value: 'ap-south',
      model: () => this.reactive.value.region,
    },
    { control: 'Reactive checkbox', target: '#spike-r-agree', value: 'true', model: () => this.reactive.value.agree },
    {
      control: 'Reactive combobox objects',
      target: '[data-spike=r-city] input[role=combobox]',
      dom: '[data-spike=r-city]',
      value: 'Paris',
      model: () => this.reactive.value.city,
    },
    {
      control: 'Plain input (no binding)',
      target: '#spike-plain-text',
      value: 'plain hello',
      model: () => this.plain.text,
    },
    {
      control: 'Plain select (no binding)',
      target: '#spike-plain-select',
      value: 'Beta',
      model: () => this.plain.select,
    },
    {
      control: 'Plain checkbox (no binding)',
      target: '#spike-plain-check',
      value: 'true',
      model: () => this.plain.check,
    },
    { control: 'Star rating (app CVA)', target: '#spike-rating', value: '4', model: () => this.m.rating },
    {
      control: 'Star rating, via a star',
      target: '#spike-rating button',
      dom: '#spike-rating',
      value: '5',
      model: () => this.m.rating,
    },
    { control: 'Signal form text', target: '#spike-s-name', value: 'signal hi', model: () => this.signalModel().name },
    {
      control: 'Signal form text, native path',
      target: '#spike-s-name',
      value: 'native signal',
      options: { forceNative: true },
      model: () => this.signalModel().name,
    },
    { control: 'Signal form number', target: '#spike-s-count', value: '7', model: () => this.signalModel().count },
    {
      control: 'Text, setValue + viewToModelUpdate',
      target: '#spike-text',
      value: 'twice',
      options: { viewToModelUpdate: true },
      model: () => `${this.m.text} (ngModelChange x${this.textChanges})`,
    },
    {
      control: 'Text, native path despite ngModel',
      target: '#spike-text',
      value: 'typed natively',
      options: { forceNative: true },
      model: () => `${this.m.text} (ngModelChange x${this.textChanges})`,
    },
    {
      control: 'Select [ngValue], native path by label',
      target: '#spike-city',
      value: 'Paris',
      options: { forceNative: true },
      model: () => this.m.city,
    },
    {
      control: 'Combobox objects, native path',
      target: '[data-spike=combo-city] input',
      dom: '[data-spike=combo-city]',
      value: 'Frankfurt',
      options: { forceNative: true },
      model: () => this.m.comboCity,
    },
    {
      control: 'Datepicker ngModel, native path ISO',
      target: '#spike-date-text',
      value: '2026-12-01',
      options: { forceNative: true },
      model: () => this.m.dateText,
    },
    {
      control: 'Checkbox, no coercion',
      target: '#spike-check',
      value: 'false',
      options: { coerce: false },
      model: () => this.m.check,
    },
    { control: 'Disabled input', target: '#spike-disabled', value: 'unlock', model: () => this.m.disabledText },
    { control: 'Not a control (heading)', target: '#spike-heading', value: 'x', model: () => null },
  ];

  constructor(
    private host: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // For probing from a test driver; spike only.
    (window as any).spikeWrite = (selector: string, value: unknown, options?: WriteOptions) => {
      const result = writeControl(host.nativeElement.querySelector(selector) as Element, value, options);
      changeDetectorRef.markForCheck();
      return { ...result, before: show(result.before), after: show(result.after), written: show(result.written) };
    };
    (window as any).spikeWriteNoCd = (selector: string, value: unknown) =>
      writeControl(host.nativeElement.querySelector(selector) as Element, value).applied;
    (window as any).spikeModel = () => show({ m: this.m, reactive: this.reactive.value });
  }

  show(value: unknown): string {
    return show(value);
  }

  async runScript(): Promise<void> {
    this.running = true;
    this.results = [];
    for (const [index, entry] of this.script.entries()) {
      const element = this.host.nativeElement.querySelector(entry.target);
      const result: WriteResult = element
        ? writeControl(element, entry.value, entry.options)
        : {
            applied: false,
            path: 'none',
            refused: 'unsupported',
            detail: 'target not found',
            before: null,
            after: null,
          };
      // NgModel writes the model on a resolved promise; let it and a change detection pass run.
      await new Promise(resolve => setTimeout(resolve, 50));
      this.results.push({
        ...result,
        n: index + 1,
        control: entry.control,
        value: show(entry.value),
        modelAfter: show(entry.model()),
        domAfter: show(readDom(entry.dom ? this.host.nativeElement.querySelector(entry.dom) : element)),
      });
    }
    this.running = false;
    this.changeDetectorRef.markForCheck();
    (window as any).spikeResults = this.results.map(row => ({
      ...row,
      before: show(row.before),
      after: show(row.after),
      written: show(row.written),
    }));
  }
}

function show(value: unknown): string {
  if (value === undefined) {
    return '';
  }
  return JSON.stringify(value, (_key, v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? `Date ${v}` : v));
}
