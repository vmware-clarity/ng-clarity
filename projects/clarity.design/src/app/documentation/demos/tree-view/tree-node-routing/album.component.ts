import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Album, albums } from './albums';

@Component({
  selector: 'album',
  template: `
    <ng-container *ngIf="album | async; let album">
      <h4 cds-text="subsection" cds-layout="m-t:sm">{{ album.title }}</h4>
      <p>{{ album.content }}</p>
    </ng-container>
  `,
  imports: [CommonModule],
})
export class AlbumComponent {
  album: Observable<Album>;

  constructor(private route: ActivatedRoute) {
    this.album = this.route.params.pipe(map(params => albums[parseInt(params['pane'])]));
  }
}
