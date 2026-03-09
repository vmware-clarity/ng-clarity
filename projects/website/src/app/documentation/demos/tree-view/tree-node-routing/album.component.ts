/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Album, albums } from './albums';

@Component({
  selector: 'album',
  template: `
    @if (album | async; as album) {
      <h4 cds-text="subsection" cds-layout="m-t:sm">{{ album.title }}</h4>
      <p>{{ album.content }}</p>
    }
  `,
  imports: [CommonModule],
})
export class AlbumComponent {
  album: Observable<Album>;

  constructor(private route: ActivatedRoute) {
    this.album = route.params.pipe(map(params => albums[parseInt(params['pane'])]));
  }
}
