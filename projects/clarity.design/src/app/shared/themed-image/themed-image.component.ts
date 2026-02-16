/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

const sharedThemeObservable = new Observable<string>(observer => {
  emitCurrentTheme();

  const mutationObserver = new MutationObserver(emitCurrentTheme);
  mutationObserver.observe(document.body, { attributes: true, attributeFilter: ['cds-theme'] });

  return function destroy() {
    mutationObserver.disconnect();
  };

  function emitCurrentTheme() {
    observer.next(document.body.getAttribute('cds-theme') || 'light');
  }
}).pipe(shareReplay(1));

@Component({
  selector: 'app-themed-image',
  template: `<img [src]="src | async" [attr.alt]="imageAlt" [style]="imageStyle" />`,
  imports: [CommonModule],
})
export class ThemedImageComponent implements OnInit {
  @Input() lightSrc: string | undefined;
  @Input() darkSrc: string | undefined;
  @Input() imageAlt: string | undefined;
  @Input() imageStyle: string | undefined;

  readonly src: Observable<string | undefined>;

  private readonly init = new ReplaySubject<void>();

  constructor() {
    this.src = combineLatest([sharedThemeObservable, this.init]).pipe(
      map(([theme]) => (theme === 'dark' ? this.darkSrc : this.lightSrc))
    );
  }

  ngOnInit() {
    this.init.next();
    this.init.complete();
  }
}
