/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FontPreset, fontPresets, getPreset } from './utils/font-presets';

@Component({
  selector: 'clr-typography-font-autopsy',
  styleUrls: ['./font-autopsy.demo.scss'],
  templateUrl: './typography-font-autopsy.html',
})
export class TypographyFontAutopsyDemo {
  @ViewChild('compareSelect', { read: ElementRef }) compareSelect: ElementRef<HTMLSelectElement> | undefined;

  model = new FormGroup({
    font: new FormControl('Metropolis', [Validators.required]),
    demoLetter: new FormControl('xX', [Validators.maxLength(1)]),
    topGap: new FormControl(0.148, [Validators.min(0)]),
    ascender: new FormControl(0.17, [Validators.min(0)]),
    xHeight: new FormControl(0.517, [Validators.min(0)]),
    descenderOverage: new FormControl(0.013, [Validators.min(0)]),
    fontWeight: new FormControl(400, [Validators.required, Validators.min(100)]),
  });

  presets = fontPresets.map(presetTuple => presetTuple[0]).sort();

  fontField = 'Metropolis';

  get descenderValue() {
    let myVal = 1 - this.model.value.topGap - this.model.value.ascender - this.model.value.xHeight;
    myVal = myVal > 0 ? myVal : 0;
    return myVal.toString().substr(0, 6);
  }

  get topGapHeight() {
    return pixelifyValues(millifyValues(this.model.value.topGap));
  }

  get ascenderHeight() {
    return pixelifyValues(millifyValues(this.model.value.ascender));
  }

  get xHeightHeight() {
    return pixelifyValues(millifyValues(this.model.value.xHeight));
  }

  get descenderOverageHeight() {
    return pixelifyValues(millifyValues(this.model.value.descenderOverage));
  }

  noop() {
    return;
  }

  checkForPreset(event: Event) {
    const fontName = (event.target as HTMLInputElement).value;
    const sanitizedFontName = fontName.replace(/["']/g, '');
    const preset = getPreset(sanitizedFontName);

    if (!preset) {
      this.fontField = '';
      return;
    }

    this.loadPreset(preset);
  }

  compareTo(event: Event) {
    const fontName = (event.target as HTMLInputElement).value;

    this.model.patchValue({ font: fontName.replace(/["']/g, '') });
  }

  loadPreset(presetToLoad: FontPreset) {
    this.fontField = presetToLoad.font;
    this.model.patchValue(presetToLoad);
    if (this.compareSelect) {
      this.compareSelect.nativeElement.value = '';
    }
  }
}

function millifyValues(num: number) {
  return num * 1000;
}

function pixelifyValues(num: number) {
  return num + 'px';
}
