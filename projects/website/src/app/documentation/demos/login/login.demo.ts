/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { onboardingPatternLink } from '../pattern-links';
import { LoginExampleDemo } from './login-example.demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

const EXAMPLE = `
<div class="login-wrapper">
  <form class="login">
    <div class="login-header">
      <div class="logo"></div>
      <div class="actions">
        <clr-dropdown>
          <button class="btn btn-link btn-sm" clrDropdownTrigger>
            Language
            <clr-icon shape="angle" direction="down"></clr-icon>
          </button>
          <clr-dropdown-menu>
            <div aria-label="Language 1" clrDropdownItem>Language 1</div>
            <div aria-label="Language 2" clrDropdownItem>Language 2</div>
            <div aria-label="Language 3" clrDropdownItem>Language 3</div>
          </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    </div>
    <div class="login-body">
      <section class="title">
        <div class="welcome">Welcome to</div>
        Company Product Name
        <div class="hint">Product tagline</div>
      </section>
      <div class="login-group">
        <clr-select-container>
          <label>User Role</label>
          <select clrSelect name="type" [(ngModel)]="form.type">
            <option value="local">Local Users</option>
            <option value="admin">Administrator</option>
          </select>
        </clr-select-container>
        <clr-input-container>
          <label class="clr-sr-only">E-mail</label>
          <input
            type="text"
            autocomplete="username"
            name="username"
            clrInput
            placeholder="Enter e-mail"
            [(ngModel)]="form.username"
          />
        </clr-input-container>
        <clr-password-container>
          <label class="clr-sr-only">Password</label>
          <input
            type="password"
            autocomplete="current-password"
            name="password"
            clrPassword
            placeholder="Enter password"
            [(ngModel)]="form.password"
          />
        </clr-password-container>
        <clr-checkbox-wrapper>
          <label>Remember me</label>
          <input type="checkbox" name="rememberMe" clrCheckbox [(ngModel)]="form.rememberMe" />
        </clr-checkbox-wrapper>
        <div class="error active">Invalid user name or password</div>
        <button type="submit" class="btn btn-primary">Log in</button>
        <a href="javascript://" class="signup">Sign up for an account</a>
      </div>
    </div>
    <div class="login-footer">
      <span class="copyright">
        Copyright © 2016-2025 Broadcom. All Rights Reserved. The term “Broadcom” refers to Broadcom Inc.
        and/or its subsidiaries.
      </span>
      <a href="javascript://">Terms</a>
      <a href="javascript://">Privacy</a>
      <a href="javascript://">California Privacy Rights</a>
    </div>
  </form>
</div>
`;

const CODE = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrDropdownModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule, ClrDropdownModule],
})
export class ExampleComponent {
  form = {
    type: 'local',
    username: '',
    password: '',
    rememberMe: false,
  };
}
`;

@Component({
  selector: 'clr-login-demo',
  templateUrl: './login.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LoginExampleDemo,
    StackblitzExampleComponent,
    LinkCardsComponent,
    StyleDocsComponent,
  ],
})
export class LoginDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [onboardingPatternLink];

  expanded = false;
  example = EXAMPLE;
  code = CODE;

  constructor() {
    super('login');
  }
}
