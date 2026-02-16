import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Group, Item, ITEMS_SERVICE } from './grocery-models';

@Component({
  selector: 'my-grocery-items',
  imports: [CommonModule, ClarityModule],
  template: `
    <ng-container [clrLoading]="loading">
      <clr-tree-node *ngFor="let item of items$ | async" [(clrSelected)]="item.selected">
        {{ item.name }}
      </clr-tree-node>
    </ng-container>
  `,
})
export class GroceryItemsComponent implements OnInit {
  @Input() group: Group | undefined;
  items$: Observable<Item[]> | undefined;
  loading = false;

  itemsService = ITEMS_SERVICE;

  ngOnInit() {
    this.loading = true;
    this.items$ = this.itemsService.getItems(this.group).pipe(tap(() => (this.loading = false)));
  }
}
