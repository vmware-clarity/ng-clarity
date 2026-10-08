---
name: appfx-drag-and-drop
description: Connect Angular CDK drop lists across components by group name with the AppFX `DragAndDropGroupService` from `@clr/addons/drag-and-drop`, so items can be dragged between lists that do not share a template. Use when wiring `cdkDropList` groups across components, `cdkDropListConnectedTo`, or `DragAndDropGroupService`.
metadata:
  docs: /documentation/drag-and-drop
---

# AppFX drag and drop (`DragAndDropGroupService`)

## When to use

Use with Angular CDK drag-and-drop (`@angular/cdk/drag-drop`) when drop lists living in different components must be connected. Each list registers itself under a group name and reads the group to fill `cdkDropListConnectedTo`. For lists in one template, plain CDK (`cdkDropListGroup` or template refs) is enough.

AppFX `appfx-datagrid` and `appfx-card-container` already use this service internally — use their own inputs instead of calling it for them.

## Setup

```ts
import { DragDropModule, CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
```

The service is `providedIn: 'root'`; no module import is needed.

## Usage

```ts
@Component({
  selector: 'app-task-list',
  imports: [DragDropModule],
  template: `
    <div
      cdkDropList
      [cdkDropListData]="items"
      [cdkDropListConnectedTo]="connectedLists"
      (cdkDropListDropped)="drop($event)"
    >
      @for (item of items; track item.id) {
        <div cdkDrag>{{ item.name }}</div>
      }
    </div>
  `,
})
export class TaskListComponent implements OnInit, OnDestroy {
  @Input() group = 'tasks';
  @Input() items: Task[] = [];
  @ViewChild(CdkDropList, { static: true }) dropList!: CdkDropList;

  private readonly groupService = inject(DragAndDropGroupService);

  // The group's live array: CDK reads it on every drag start, so lists registered later are included.
  connectedLists: readonly CdkDropList[] = [];

  ngOnInit(): void {
    this.groupService.addGroupItem(this.group, this.dropList); // static: true, available in ngOnInit
    this.connectedLists = this.groupService.getGroupItems(this.group);
  }

  ngOnDestroy(): void {
    this.groupService.removeGroupItem(this.group, this.dropList);
  }

  drop(event: CdkDragDrop<Task[]>): void {
    // use moveItemInArray / transferArrayItem from @angular/cdk/drag-drop
  }
}
```

## Rules

- Bind `[cdkDropListConnectedTo]` to the array returned by `getGroupItems()`, kept in a field. Don't copy it in a getter (a new array on every check throws `NG0100`), and don't take a one-time copy (lists registered later are missed).
- Always pair `addGroupItem` with `removeGroupItem` in `ngOnDestroy`; the service is a root singleton and keeps references otherwise.
- `getGroupItems` returns a readonly array (empty for unknown groups); spread it when an input expects a mutable `CdkDropList[]`.
- Use distinct group names per independent drag area.
- Provide keyboard alternatives for reordering (e.g. move up/down buttons with `aria-label`) — CDK drag is pointer-only.

## References

- API: `projects/addons/drag-and-drop/drag-and-drop.api.md`
- Docs: `projects/addons/drag-and-drop/README.md`, demos in `projects/website/src/app/documentation/demos/drag-and-drop/`
