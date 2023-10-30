/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrIconModule } from '../../icon/icon.module';

@Component({
  template: `
    <form class="clr-form clr-form-{{ layout }}">
      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="text">
        <label
          for="{{ layout }}-basic"
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Input
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-input-wrapper">
            <input type="text" id="{{ layout }}-basic" placeholder="Enter value here" class="clr-input" />
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="checkbox">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Checkbox
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox1"
              id="{{ layout }}-checkbox1"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox1" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox2"
              id="{{ layout }}-checkbox2"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox2" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox3"
              id="{{ layout }}-checkbox3"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox3" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="checkbox-inline">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Inline checkbox
        </label>
        <div
          class="clr-control-container clr-control-inline"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox7"
              id="{{ layout }}-checkbox7"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox7" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox8"
              id="{{ layout }}-checkbox8"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox8" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-checkbox-wrapper">
            <input
              type="checkbox"
              name="checkbox9"
              id="{{ layout }}-checkbox9"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-checkbox9" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="toggle">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Checkbox
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox1"
              id="{{ layout }}-toggle1"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle1" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox2"
              id="{{ layout }}-toggle2"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle2" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox3"
              id="{{ layout }}-toggle3"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle3" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="toggle-inline">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Inline checkbox
        </label>
        <div
          class="clr-control-container clr-control-inline"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox7"
              id="{{ layout }}-toggle7"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle7" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox8"
              id="{{ layout }}-toggle8"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle8" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-toggle-wrapper">
            <input
              type="checkbox"
              name="checkbox9"
              id="{{ layout }}-toggle9"
              placeholder="Enter value here"
              class="clr-checkbox"
            />
            <label for="{{ layout }}-toggle9" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="radio">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Radio
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio1"
              id="{{ layout }}-radio1"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio1" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio1"
              id="{{ layout }}-radio2"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio2" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio1"
              id="{{ layout }}-radio3"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio3" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="radio-inline">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Inline radio
        </label>
        <div
          class="clr-control-container clr-control-inline"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio2"
              id="{{ layout }}-radio4"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio4" class="clr-control-label">option 1</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio2"
              id="{{ layout }}-radio5"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio5" class="clr-control-label">option 2</label>
          </div>
          <div class="clr-radio-wrapper">
            <input
              type="radio"
              name="radio2"
              id="{{ layout }}-radio6"
              placeholder="Enter value here"
              class="clr-radio"
            />
            <label for="{{ layout }}-radio6" class="clr-control-label">option 3</label>
          </div>
          <div class="clr-subtext-wrapper">
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
            <span class="clr-subtext">Helper Text</span>
          </div>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="file">
        <label
          for="{{ layout }}-file"
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          File
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-file-wrapper">
            <label for="{{ layout }}-file" class="clr-control-label"><span class="btn btn-sm">browse</span></label>
            <input #fileInput type="file" id="{{ layout }}-file" placeholder="Enter value here" class="clr-file" />
          </div>
          <!-- IMPORTANT DIFFERENCE IN STRUCTURE! ICON IS NOT PART OF THE INPUT WRAPPER -->
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="file-plain">
        <label
          for="{{ layout }}-file3"
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Plain file
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-file-wrapper">
            <input type="file" id="{{ layout }}-file" placeholder="Enter value here" />
          </div>
          <!-- IMPORTANT DIFFERENCE IN STRUCTURE! ICON IS NOT PART OF THE INPUT WRAPPER -->
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="textarea">
        <label
          for="{{ layout }}-textarea-basic"
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Textarea
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-textarea-wrapper">
            <textarea
              id="{{ layout }}-textarea-basic"
              rows="5"
              placeholder="Enter value here"
              class="clr-textarea"
            ></textarea>
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="select">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Select
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-select-wrapper">
            <select>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>

      <div class="clr-form-control" [ngClass]="{ 'clr-row': grid }" id="multiselect">
        <label
          class="clr-control-label"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-2': grid && layout !== 'vertical' }"
        >
          Mmultiselect
        </label>
        <div
          class="clr-control-container"
          [ngClass]="{ 'clr-col-12': grid, 'clr-col-md-10': grid && layout !== 'vertical' }"
        >
          <div class="clr-multiselect-wrapper">
            <select multiple>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
            <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger"></cds-icon>
          </div>
          <span class="clr-subtext">Helper Text</span>
        </div>
      </div>
    </form>
  `,
})
class SimpleTest {
  layout = 'vertical';
  grid = false;
}

describe('Form layouts', () => {
  const base = 4;
  let native, instance, fixture;

  function height(selector) {
    return native.querySelector(selector).getBoundingClientRect().height;
  }

  function verifyHeight(selector: string, value: number, verticalRhythm = true) {
    let computed = height(selector);
    /**
     * @NOTE
     * Helper text is now always visible so we should use it
     * in calculations when it's the whole container.
     */
    if (['control', 'container'].includes(selector)) {
      computed += height(`${selector} clr-control-helper`);
    }
    expect(Math.round(computed)).toEqual(Math.round(value));
    if (verticalRhythm) {
      expect(value % base).toEqual(0);
    }
  }

  /**
   * @TODO Add tests to calculate widths as well
   */

  function verticalTests() {
    describe('text', () => {
      it('control height', () => verifyHeight('#text', base * 15));
      it('label height', () => verifyHeight('#text .clr-control-label', base * 4));
      it('wrapper height', () => verifyHeight('#text .clr-input-wrapper', base * 6));
      it('input height', () => verifyHeight('#text .clr-input', base * 6));
      it('subtext height', () => verifyHeight('#text .clr-subtext', base * 4));
    });

    describe('checkbox', () => {
      it('control height', () => verifyHeight('#checkbox', base * 27));

      it('label height', () => verifyHeight('#checkbox .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#checkbox .clr-control-container', base * 23));

      it('wrapper height', () => verifyHeight('#checkbox .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox .clr-checkbox', 16));

      it('checkbox label height', () => verifyHeight('#checkbox .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox .clr-subtext', base * 4));
    });

    describe('checkbox inline', () => {
      it('control height', () => verifyHeight('#checkbox-inline', base * 15));

      it('label height', () => verifyHeight('#checkbox-inline .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#checkbox-inline .clr-control-container', base * 11));

      it('wrapper height', () => verifyHeight('#checkbox-inline .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox-inline .clr-checkbox', base * 4));

      it('checkbox label height', () =>
        verifyHeight('#checkbox-inline .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox-inline .clr-subtext', base * 4));
    });

    describe('radio', () => {
      it('control height', () => verifyHeight('#radio', base * 27));

      it('label height', () => verifyHeight('#radio .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#radio .clr-control-container', base * 23));

      it('wrapper height', () => verifyHeight('#radio .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio .clr-subtext', base * 4));
    });

    describe('radio inline', () => {
      it('control height', () => verifyHeight('#radio-inline', base * 15));

      it('label height', () => verifyHeight('#radio-inline .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#radio-inline .clr-control-container', base * 11));

      it('wrapper height', () => verifyHeight('#radio-inline .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio-inline .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio-inline .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio-inline .clr-subtext', base * 4));
    });

    describe('file', () => {
      it('control height', () => verifyHeight('#file', base * 16.5, false));

      it('label height', () => verifyHeight('#file .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#file .clr-file-wrapper', base * 6));

      it('file height', () => verifyHeight('#file .clr-file', 0));

      it('file label height', () => verifyHeight('#file .clr-file-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#file .clr-subtext', base * 4));
    });

    describe('file plain', () => {
      let fileInput;

      beforeEach(() => {
        fileInput = height('#file-plain input');
      });

      it('control height', () => verifyHeight('#file-plain', fileInput + base * 10.5));

      it('label height', () => verifyHeight('#file-plain .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#file-plain .clr-file-wrapper', fileInput, false));

      it('subtext height', () => verifyHeight('#file-plain .clr-subtext', base * 4));
    });

    describe('textarea', () => {
      let textarea;

      beforeEach(() => {
        textarea = height('#textarea textarea');
      });

      it('control height', () => verifyHeight('#textarea', textarea + base * 11, false));

      it('label height', () => verifyHeight('#textarea .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#textarea .clr-textarea-wrapper', textarea, false));

      it('textarea height', () => verifyHeight('#textarea .clr-textarea', textarea, false));

      it('subtext height', () => verifyHeight('#textarea .clr-subtext', base * 4));
    });

    describe('select', () => {
      it('control height', () => verifyHeight('#select', base * 15));

      it('label height', () => verifyHeight('#select .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#select .clr-select-wrapper', base * 6));

      it('select height', () => verifyHeight('#select select', base * 6));

      it('subtext height', () => verifyHeight('#select .clr-subtext', base * 4));
    });

    // For reasons yet unknown, a multiselect has additional height added to it, and different browsers append
    // different amounts of height. This also interferes with vertical rhythm.
    // @TODO See if it is possible or worth fixing vertical rhythm
    describe('multiselect', () => {
      let multiselect;

      beforeEach(() => {
        multiselect = height('#multiselect select');
      });

      it('control height', () => verifyHeight('#multiselect', multiselect + base * 9, false));

      it('label height', () => verifyHeight('#multiselect .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#multiselect .clr-multiselect-wrapper', multiselect, false));

      it('select height', () => verifyHeight('#multiselect select', multiselect, false));

      it('subtext height', () => verifyHeight('#multiselect .clr-subtext', base * 4));
    });
  }

  function horizontalTests() {
    describe('text', () => {
      it('control height', () => verifyHeight('#text', base * 11));

      it('label height', () => verifyHeight('#text .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#text .clr-control-label', base * 4));

      it('input height', () => verifyHeight('#text .clr-input', base * 6));

      it('subtext height', () => verifyHeight('#text .clr-subtext', base * 4));
    });

    describe('checkbox', () => {
      it('control height', () => verifyHeight('#checkbox', base * 23));

      it('label height', () => verifyHeight('#checkbox .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#checkbox .clr-control-container', base * 23));

      it('wrapper height', () => verifyHeight('#checkbox .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox .clr-checkbox', base * 4));

      it('checkbox label height', () => verifyHeight('#checkbox .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox .clr-subtext-wrapper', base * 5));
    });

    describe('checkbox inline', () => {
      it('control height', () => verifyHeight('#checkbox-inline', base * 11));

      it('label height', () => verifyHeight('#checkbox-inline .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#checkbox-inline .clr-control-container', base * 11));

      it('wrapper height', () => verifyHeight('#checkbox-inline .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox-inline .clr-checkbox', base * 4));

      it('checkbox label height', () =>
        verifyHeight('#checkbox-inline .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox-inline .clr-subtext-wrapper', base * 5));
    });

    describe('radio', () => {
      it('control height', () => verifyHeight('#radio', base * 23));

      it('label height', () => verifyHeight('#radio .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#radio .clr-control-container', base * 23));

      it('wrapper height', () => verifyHeight('#radio .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio .clr-subtext-wrapper', base * 5));
    });

    describe('radio inline', () => {
      it('control height', () => verifyHeight('#radio-inline', base * 11));

      it('label height', () => verifyHeight('#radio-inline .clr-control-label', base * 4));

      it('container height', () => verifyHeight('#radio-inline .clr-control-container', base * 11));

      it('wrapper height', () => verifyHeight('#radio-inline .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio-inline .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio-inline .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio-inline .clr-subtext-wrapper', base * 5));
    });

    describe('file', () => {
      it('control height', () => verifyHeight('#file', base * 12.5, false));

      it('label height', () => verifyHeight('#file .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#file .clr-file-wrapper', base * 6));

      it('file height', () => verifyHeight('#file .clr-file', 0));

      it('file label height', () => verifyHeight('#file .clr-file-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#file .clr-subtext', base * 4));
    });

    describe('file plain', () => {
      let fileInput;

      beforeEach(() => {
        fileInput = height('#file-plain input');
      });

      it('control height', () => verifyHeight('#file-plain', fileInput + base * 6.5, false));

      it('label height', () => verifyHeight('#file-plain .clr-control-label', base * 4, false));

      it('wrapper height', () => verifyHeight('#file-plain .clr-file-wrapper', fileInput, false));

      it('subtext height', () => verifyHeight('#file-plain .clr-subtext', base * 4));
    });

    describe('textarea', () => {
      let textarea;

      beforeEach(() => {
        textarea = height('#textarea textarea');
      });

      it('control height', () => verifyHeight('#textarea', textarea + base * 7, false));

      it('label height', () => verifyHeight('#textarea .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#textarea .clr-textarea-wrapper', textarea, false));

      it('textarea height', () => verifyHeight('#textarea .clr-textarea', textarea, false));

      it('subtext height', () => verifyHeight('#textarea .clr-subtext', base * 4));
    });

    describe('select', () => {
      it('control height', () => verifyHeight('#select', base * 11));

      it('label height', () => verifyHeight('#select .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#select .clr-select-wrapper', base * 6));

      it('select height', () => verifyHeight('#select select', base * 6));

      it('subtext height', () => verifyHeight('#select .clr-subtext', base * 4));
    });

    describe('multiselect', () => {
      let multiselect;

      beforeEach(() => {
        multiselect = height('#multiselect select');
      });

      it('control height', () => verifyHeight('#multiselect', multiselect + base * 5, false));

      it('label height', () => verifyHeight('#multiselect .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#multiselect .clr-multiselect-wrapper', multiselect, false));

      it('select height', () => verifyHeight('#multiselect select', multiselect, false));

      it('subtext height', () => verifyHeight('#multiselect .clr-subtext', base * 4));
    });
  }

  function compactTests() {
    // With compact, the subtext is 18px tall (12px line height, 6px margin-top), but if the
    // subtext wraps it would be taller.
    describe('text', () => {
      it('control height', () => verifyHeight('#text', base * 6));

      it('label height', () => verifyHeight('#text .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#text .clr-control-label', base * 4));

      it('input height', () => verifyHeight('#text .clr-input', base * 6));

      it('subtext height', () => verifyHeight('#text .clr-subtext', base * 5, false));
    });

    describe('checkbox', () => {
      it('control height', () => verifyHeight('#checkbox', base * 6));

      it('label height', () => verifyHeight('#checkbox .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#checkbox .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox .clr-checkbox', base * 4));

      it('checkbox label height', () => verifyHeight('#checkbox .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox .clr-subtext-wrapper', base * 6));
    });

    describe('checkbox inline', () => {
      it('control height', () => verifyHeight('#checkbox-inline', base * 6));

      it('label height', () => verifyHeight('#checkbox-inline .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#checkbox-inline .clr-checkbox-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#checkbox-inline .clr-checkbox', base * 4));

      it('checkbox label height', () =>
        verifyHeight('#checkbox-inline .clr-checkbox-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#checkbox-inline .clr-subtext-wrapper', base * 6));
    });

    describe('toggle', () => {
      it('control height', () => verifyHeight('#toggle', base * 6));

      it('label height', () => verifyHeight('#toggle .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#toggle .clr-toggle-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#toggle .clr-checkbox', base * 4));

      it('checkbox label height', () => verifyHeight('#toggle .clr-toggle-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#toggle .clr-subtext-wrapper', base * 6));
    });

    describe('toggle inline', () => {
      it('control height', () => verifyHeight('#toggle-inline', base * 6));

      it('label height', () => verifyHeight('#toggle-inline .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#toggle-inline .clr-toggle-wrapper', base * 6));

      it('checkbox height', () => verifyHeight('#toggle-inline .clr-checkbox', base * 4));

      it('checkbox label height', () =>
        verifyHeight('#toggle-inline .clr-toggle-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#toggle-inline .clr-subtext-wrapper', base * 6));
    });

    describe('radio', () => {
      it('control height', () => verifyHeight('#radio', base * 6));

      it('label height', () => verifyHeight('#radio .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#radio .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio .clr-subtext-wrapper', base * 6));
    });

    describe('radio inline', () => {
      it('control height', () => verifyHeight('#radio-inline', base * 6));

      it('label height', () => verifyHeight('#radio-inline .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#radio-inline .clr-radio-wrapper', base * 6));

      it('radio height', () => verifyHeight('#radio-inline .clr-radio', base * 4));

      it('radio label height', () => verifyHeight('#radio-inline .clr-radio-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#radio-inline .clr-subtext-wrapper', base * 6));
    });

    describe('file', () => {
      it('control height', () => verifyHeight('#file', base * 6));

      it('label height', () => verifyHeight('#file .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#file .clr-file-wrapper', base * 6));

      it('file height', () => verifyHeight('#file .clr-file', 0));

      it('file label height', () => verifyHeight('#file .clr-file-wrapper .clr-control-label', base * 6));

      it('subtext height', () => verifyHeight('#file .clr-subtext', base * 6));
    });

    describe('file plain', () => {
      let fileInput;

      beforeEach(() => {
        // the default file input is out of our control, so need to get its size for calculations
        fileInput = height('#file-plain input');
      });

      it('control height', () => verifyHeight('#file-plain', fileInput, false));

      it('label height', () => verifyHeight('#file-plain .clr-control-label', base * 4, false));

      it('wrapper height', () => verifyHeight('#file-plain .clr-file-wrapper', fileInput, false));

      it('subtext height', () => verifyHeight('#file-plain .clr-subtext', fileInput, false));
    });

    describe('textarea', () => {
      let textarea;

      beforeEach(() => {
        textarea = height('#textarea textarea');
      });

      it('control height', () => verifyHeight('#textarea', textarea, false));

      it('label height', () => verifyHeight('#textarea .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#textarea .clr-textarea-wrapper', textarea, false));

      it('textarea height', () => verifyHeight('#textarea .clr-textarea', textarea, false));

      it('subtext height', () => verifyHeight('#textarea .clr-subtext', textarea - base, false));
    });

    describe('select', () => {
      it('control height', () => verifyHeight('#select', base * 6));

      it('label height', () => verifyHeight('#select .clr-control-label', base * 4));

      it('wrapper height', () => verifyHeight('#select .clr-select-wrapper', base * 6));

      it('select height', () => verifyHeight('#select select', base * 6));

      it('subtext height', () => verifyHeight('#select .clr-subtext', base * 5, false));
    });

    describe('multiselect', () => {
      let multiselect;

      beforeEach(() => {
        multiselect = height('#multiselect select');
      });

      it('control height', () => verifyHeight('#multiselect', multiselect, false));

      it('label height', () => verifyHeight('#multiselect .clr-control-label', base * 4, false));

      it('wrapper height', () => verifyHeight('#multiselect .clr-multiselect-wrapper', multiselect, false));

      it('select height', () => verifyHeight('#multiselect select', multiselect, false));

      it('subtext height', () => verifyHeight('#multiselect .clr-subtext', multiselect - base, false));
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrIconModule], declarations: [SimpleTest] });
    fixture = TestBed.createComponent(SimpleTest);
    instance = fixture.debugElement.componentInstance;
    native = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe('Vertical', () => {
    verticalTests();
  });

  describe('Vertical with Grid', () => {
    beforeEach(() => {
      instance.grid = true;
      fixture.detectChanges();
    });
    verticalTests();
  });

  describe('Horizontal', () => {
    beforeEach(() => {
      instance.layout = 'horizontal';
      fixture.detectChanges();
    });
    horizontalTests();
  });

  describe('Horizontal with Grid', () => {
    beforeEach(() => {
      instance.layout = 'horizontal';
      instance.grid = true;
      fixture.detectChanges();
    });
    horizontalTests();
  });

  describe('Compact', () => {
    beforeEach(() => {
      instance.layout = 'compact';
      fixture.detectChanges();
    });
    compactTests();
  });

  describe('Compact with Grid', () => {
    beforeEach(() => {
      instance.layout = 'compact';
      instance.grid = true;
      fixture.detectChanges();
    });
    compactTests();
  });
});
