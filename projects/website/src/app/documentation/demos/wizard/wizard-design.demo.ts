/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild, viewChildren } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  boltIcon,
  bullseyeIcon,
  ClarityIcons,
  cloudIcon,
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrInputModule,
  ClrSelectModule,
  ClrWizard,
  ClrWizardModule,
  ClrWizardPage,
  dashboardIcon,
  flameIcon,
  happyFaceIcon,
  hourglassIcon,
  lightbulbIcon,
  sadFaceIcon,
  shareIcon,
  shieldXIcon,
  starIcon,
  talkBubblesIcon,
  uploadCloudIcon,
  wifiIcon,
} from '@clr/angular';

import { WizardBasic } from './wizard-basic.demo';
import { disableFocusTrapProvider } from '../../../shared/disable-focus-trap/disable-focus-trap.provider';

const colorList = ['blue', 'red', 'black', 'orange', 'limegreen', 'purple', 'fuchsia', 'indigo'];

const powerSources = [
  'happy-face',
  'cloud',
  'lightbulb',
  'eye',
  'bolt',
  'bullseye',
  'star',
  'hourglass',
  'talk-bubbles',
  'shield-x',
  'upload-cloud',
  'sad-face',
  'share',
  'wifi',
  'dashboard',
  'flame',
];

const powerText = [
  'has the power of boundless optimism',
  'has the power to control the weather',
  'has light powers',
  'can shoot lasers out of its eyes',
  'can control lightning',
  'has the power of archery',
  'has the power of fame and likeability',
  'has the power of time management',
  'has the power of linguistics',
  'has protective powers',
  'can fly',
  'has the power of ennui',
  'has a law degree',
  'can make duplicates of itself',
  'has the power of wifi',
  'can run at superspeed',
  'can shoot flames out of the side of its face',
];

const weaknessText = [
  'is hopelessly optimistic',
  'is afraid of clouds',
  'is afraid of the dark',
  'is afraid of eye-lasers',
  'is afraid of lightning',
  'has very bad aim',
  'is consumed with achieving fame and glory',
  'can only perform one task at a time',
  'cannot understand what you say',
  'is squishy',
  'cannot fly but thinks it can',
  'suffers from depression',
  'is a wanted fugitive',
  'has an evil twin',
  'requires a wifi connection',
  'is slower than a turtle',
  'is afraid of fire',
];

const shortPowerLabels = [
  'Optimism',
  'Weather',
  'Light',
  'Eye Lasers',
  'Lightning',
  'Archery/Marksmanship',
  'Fame',
  'Time Management',
  'Language',
  'Armor/Protection',
  'Flight',
  'Ennui',
  'Law',
  'Duplicate',
  'Wifi',
  'Speed',
  'Fire',
];

const colorLabels = ['Blue', 'Red', 'Black', 'Orange', 'Lime Green', 'Purple', 'Fuchsia', 'Indigo'];

const defaultModel = {
  name: '',
  favorite: '',
  number: '',
  ht_feet: '1 ft.',
  ht_inches: '0 in.',
  weight: '',
  gender: 'Male',
  color: 'blue',
  power: 'happy-face',
  weakness: 'lightbulb',
};

@Component({
  selector: 'clr-wizard-design-demo',
  templateUrl: './wizard-design.demo.html',
  styleUrl: './wizard-design.demo.scss',
  host: {
    '[class.in-place-takeover]': 'true',
    '[class.is-large]': 'true',
  },
  providers: [disableFocusTrapProvider],
  imports: [
    ClrWizardModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrSelectModule,
    ClrAlertModule,
    ClrIcon,
    ClrIconModule,
    WizardBasic,
  ],
})
export class WizardDesignDemo {
  protected readonly wizard = viewChild<ClrWizard>('wizard');
  protected readonly pageOne = viewChild<ClrWizardPage>('pageOne');
  protected readonly pageTwo = viewChild<ClrWizardPage>('pageTwo');
  protected readonly pageThree = viewChild<ClrWizardPage>('pageThree');
  protected readonly pageFour = viewChild<ClrWizardPage>('pageFour');

  protected readonly forms = viewChildren(NgForm);

  protected open = true;
  protected model = defaultModel;
  protected showPowerError = false;

  protected readonly colorList = colorList;
  protected readonly powerSources = powerSources;

  constructor() {
    ClarityIcons.addIcons(
      happyFaceIcon,
      cloudIcon,
      lightbulbIcon,
      boltIcon,
      bullseyeIcon,
      starIcon,
      hourglassIcon,
      talkBubblesIcon,
      shieldXIcon,
      uploadCloudIcon,
      sadFaceIcon,
      shareIcon,
      wifiIcon,
      dashboardIcon,
      flameIcon
    );
  }

  protected get explanationOfPower(): string {
    return powerText[powerSources.indexOf(this.model.power)];
  }

  protected get explanationOfWeakness(): string {
    return weaknessText[powerSources.indexOf(this.model.weakness)];
  }

  protected get colorLabel(): string {
    return colorLabels[colorList.indexOf(this.model.color)];
  }

  protected get powerLabel(): string {
    return shortPowerLabels[powerSources.indexOf(this.model.power)];
  }

  protected get weaknessLabel(): string {
    return shortPowerLabels[powerSources.indexOf(this.model.weakness)];
  }

  protected get pageOneTitle(): string {
    return this.pageOne()?.completed ? `Name: ${this.model.name}` : 'Basic Information';
  }

  protected get pageTwoTitle(): string {
    return this.pageTwo()?.completed ? `Color: ${this.colorLabel}` : 'Color';
  }

  protected get pageThreeTitle(): string {
    return this.pageThree()?.completed ? `Power: ${this.powerLabel}` : 'Power';
  }

  protected get pageFourTitle(): string {
    return this.pageFour()?.completed ? `Weakness: ${this.weaknessLabel}` : 'Weakness';
  }

  protected reset(open: boolean): void {
    this.open = open;

    if (open === false) {
      this.model = defaultModel;
      this.wizard()?.reset();
      this.forms()?.forEach(form => form.reset());
    }
  }

  protected setPower(power: string): void {
    if (!power) {
      return;
    }

    if (power === this.model.weakness) {
      this.showPowerError = true;
      return;
    }

    this.model.power = power;
    this.showPowerError = false;
  }

  protected setWeakness(weakness: string): void {
    if (!weakness) {
      return;
    }

    if (weakness === this.model.power) {
      this.showPowerError = true;
      return;
    }

    this.model.weakness = weakness;
    this.showPowerError = false;
  }
}
