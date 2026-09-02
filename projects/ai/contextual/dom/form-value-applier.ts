/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Outcome of applying an agent's answer to a form. */
export interface ClrFormApplyResult {
  /** Control names whose values were applied. */
  applied: string[];
  /** Entries that could not be applied, with the reason. */
  skipped: { name: string; reason: string }[];
}

/**
 * Applies a form-filling agent's answer — a JSON object keyed by control `name`, the
 * same keys snapshots report when `includeFormValues` is on — to the controls of a
 * form. Values are written through real DOM events (`input`/`change`), so Angular
 * template-driven and reactive forms pick them up exactly as if the user had typed.
 *
 * Nothing is submitted and no button is clicked: the values land in the form for the
 * user to review. Password and file inputs are never written.
 */
export function applyClrFormValues(form: Element, values: Record<string, unknown>): ClrFormApplyResult {
  const result: ClrFormApplyResult = { applied: [], skipped: [] };

  for (const [name, value] of Object.entries(values)) {
    const controls = Array.from(form.querySelectorAll<HTMLElement>(`[name="${CSS.escape(name)}"]`)).filter(control =>
      ['INPUT', 'SELECT', 'TEXTAREA'].includes(control.tagName)
    );
    const control = controls[0] ?? form.querySelector<HTMLElement>(`#${CSS.escape(name)}`);

    if (!control) {
      result.skipped.push({ name, reason: 'no control with this name' });
      continue;
    }

    const reason = applyToControl(control, controls, value);
    if (reason) {
      result.skipped.push({ name, reason });
    } else {
      result.applied.push(name);
    }
  }

  return result;
}

/** Applies one value; returns a skip reason, or null when applied. */
function applyToControl(control: HTMLElement, group: HTMLElement[], value: unknown): string | null {
  const tagName = control.tagName;

  if (tagName === 'SELECT') {
    const select = control as HTMLSelectElement;
    const option = Array.from(select.options).find(
      candidate => candidate.value === String(value) || candidate.textContent?.trim() === String(value)
    );
    if (!option) {
      return 'no option matches this value';
    }
    select.value = option.value;
    return notify(select, 'change');
  }

  if (tagName === 'TEXTAREA') {
    (control as HTMLTextAreaElement).value = String(value ?? '');
    return notify(control, 'input');
  }

  if (tagName === 'INPUT') {
    const input = control as HTMLInputElement;
    if (input.type === 'password' || input.type === 'file') {
      return 'password and file inputs are never written';
    }
    if (input.type === 'checkbox') {
      input.checked = value === true || value === 'true';
      return notify(input, 'change');
    }
    if (input.type === 'radio') {
      const radios = group.filter(candidate => (candidate as HTMLInputElement).type === 'radio') as HTMLInputElement[];
      const match = radios.find(radio => radio.value === String(value));
      if (!match) {
        return 'no radio option matches this value';
      }
      match.checked = true;
      return notify(match, 'change');
    }
    input.value = String(value ?? '');
    return notify(input, 'input');
  }

  return 'unsupported control type';
}

function notify(control: HTMLElement, primaryEvent: 'input' | 'change'): null {
  control.dispatchEvent(new Event(primaryEvent, { bubbles: true }));
  if (primaryEvent === 'input') {
    control.dispatchEvent(new Event('change', { bubbles: true }));
  }
  control.dispatchEvent(new Event('blur', { bubbles: false }));
  return null;
}
