/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ClrDropdownModule } from '@clr/angular';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

interface Version {
  version: string;
  url: string;
  latest?: boolean;
}

@Component({
  selector: 'app-version-select',
  template: `
    <clr-dropdown class="version-select">
      <button class="btn btn-sm btn-primary" clrDropdownTrigger>
        Version {{ currentVersion }}
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu clrPosition="bottom-left">
        <div class="prevent-indent"><div class="dropdown-header">Switch to:</div></div>
        <a clrDropdownItem *ngFor="let version of versions | async" [href]="version.url">
          v{{ version.version }} Documentation
          <span *ngIf="version.latest" class="badge badge-success">
            New
            <span class="clr-sr-only">Latest version</span>
          </span>
        </a>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  styles: [
    `
      :host {
        align-self: center;
        margin-left: var(--cds-global-space-7);
        @media screen and (max-width: 576px) {
          display: none;
        }
      }
      ,
      .badge {
        margin-right: 0;
      }
    `,
  ],
  imports: [CommonModule, ClrDropdownModule],
})
export class VersionSelectComponent {
  currentVersion = environment.version;
  versions: Observable<Version[]>;

  constructor(httpClient: HttpClient) {
    this.versions = httpClient
      .get<Version[]>(environment.versions_url)
      .pipe(map(versions => versions.filter(version => version.version !== this.currentVersion)));
  }
}
