/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const themes = {
  default: {
    '--clr-test-header-text-color': 'magenta',
    '--clr-test-button-background-color': 'purple',
    '--clr-test-button-text-color': 'white',
    '--clr-test-border-color': 'magenta',
  },
  blue: {
    '--clr-test-header-text-color': 'blue',
    '--clr-test-button-background-color': 'cornflowerblue',
    '--clr-test-button-text-color': 'navy',
    '--clr-test-border-color': 'cornflowerblue',
  },
  green: {
    '--clr-test-header-text-color': 'seagreen',
    '--clr-test-button-background-color': 'darkseagreen',
    '--clr-test-button-text-color': 'darkgreen',
    '--clr-test-border-color': 'darkseagreen',
  },
  orange: {
    '--clr-test-header-text-color': 'darkorange',
    '--clr-test-button-background-color': 'orange',
    '--clr-test-button-text-color': 'maroon',
    '--clr-test-border-color': 'darkorange',
  },
};

let counter = 0;

function switchTheme(toTheme: string): string {
  const newStyle = document.createElement('style');
  const theme = (themes as Record<string, any>)[toTheme];

  document.head.appendChild(newStyle);
  newStyle.id = 'ie-theme_' + counter++;

  const myStyles = [':root { '];
  for (const item in theme) {
    if (Object.prototype.hasOwnProperty.call(theme, item)) {
      myStyles.push(item);
      myStyles.push(': ');
      myStyles.push(theme[item]);
      myStyles.push('; ');
    }
  }
  myStyles.push('}');
  newStyle.innerHTML = myStyles.join('');

  return toTheme;
}

function getNewTheme(oldTheme: string): string {
  let newTheme: string;

  switch (oldTheme) {
    case 'default':
      newTheme = 'blue';
      break;
    case 'blue':
      newTheme = 'green';
      break;
    case 'green':
      newTheme = 'orange';
      break;
    case 'orange':
      newTheme = 'default';
      break;
    default:
      newTheme = 'default';
      break;
  }

  return switchTheme(newTheme);
}

@Component({
  templateUrl: 'custom-props.demo.html',
  styleUrls: ['./custom-props.demo.scss'],
})
export class CustomPropsDemo {
  private _theme = 'default';

  cycleThemes(): void {
    this._theme = getNewTheme(this._theme);
  }
}
