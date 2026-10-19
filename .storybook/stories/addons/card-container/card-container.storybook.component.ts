/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'appfx-demo-summary-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Summary</div>
      <div class="card-block">Summary</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Summary Action</button>
      </div>
    </div>
  `,
})
export class SummaryCardComponent {}

@Component({
  selector: 'appfx-demo-note-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Notes</div>
      <div class="card-block">Notes</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Notes Action</button>
      </div>
    </div>
  `,
})
export class NotesCardComponent {}

@Component({
  selector: 'appfx-demo-tags-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Tags</div>
      <div class="card-block">Tags Sample</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Tags Action</button>
      </div>
    </div>
  `,
})
export class TagsCardComponent {}

@Component({
  selector: 'appfx-demo-dynamic-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Dynamic</div>
      <div class="card-block">Dynamic</div>
    </div>
  `,
})
export class DynamicCardComponent {}
