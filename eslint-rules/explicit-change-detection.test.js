/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const { RuleTester } = require('eslint');
const { describe, it } = require('node:test');
const parser = require('@typescript-eslint/parser');
const rule = require('./explicit-change-detection');

RuleTester.describe = describe;
RuleTester.it = it;
const tester = new RuleTester({ languageOptions: { parser } });
tester.run('explicit-change-detection', rule, {
  valid: [
    "import { Component } from '@angular/core'; @Component({changeDetection: ChangeDetectionStrategy.Eager}) class Test {}",
    "import { Component as C } from '@angular/core'; @C({changeDetection: ChangeDetectionStrategy.OnPush}) class Test {}",
    "import * as ng from '@angular/core'; @ng.Component({changeDetection: ng.ChangeDetectionStrategy.Eager}) class Test {}",
    "import { Component } from '@angular/core'; @Component({'changeDetection': ChangeDetectionStrategy.Eager}) class Test {}",
    "import { Component } from 'another-library'; @Component({}) class Test {}",
    "import { Directive } from '@angular/core'; @Directive({}) class Test {}",
  ],
  invalid: [
    "import { Component } from '@angular/core'; @Component({}) class Test {}",
    "import { Component } from '@angular/core'; @Component() class Test {}",
    "import { Component as C } from '@angular/core'; @C({}) class Test {}",
    "import * as ng from '@angular/core'; @ng.Component({}) class Test {}",
    "import { Component } from '@angular/core'; @Component(metadata) class Test {}",
    "import { Component } from '@angular/core'; @Component({...metadata}) class Test {}",
  ].map(code => ({ code, errors: [{ messageId: 'missing' }] })),
});
