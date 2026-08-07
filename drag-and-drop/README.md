### Overview & Rationale

AppFx Drag and Drop provides utilities to easily and declaratively work with CDK drag-and-drop within Angular applications.

### DragAndDropGroupService

The DragAndDropGroupService is a singleton Angular service that manages groups of items that can be dragged and dropped using Angular's CDK Drag and Drop functionality. It facilitates the organization and manipulation of draggable items by grouping them and providing methods for adding, retrieving, and removing drop lists (CdkDropList) associated with specific groups.

#### Methods

`getGroupItems(group: string): readonly CdkDropList[]` - Retrieves an array of CdkDropList instances belonging to the specified group. If the group doesn't exist, it returns an empty array.

`addGroupItem(group: string, item: CdkDropList): void` - Adds a CdkDropList instance to the specified group. If the group doesn't exist, it creates a new one.

`removeGroupItem(group: string, item: CdkDropList): void` - Removes a CdkDropList instance from the specified group if it exists.

#### Example Code

_example-drag-and-drop.component.ts_:

```typescript
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';

@Component({
  selector: 'example-drag-and-drop',
  templateUrl: 'example-drag-and-drop.component.html',
})
export class ExampleDragAndDropComponent {
  @ViewChild(CdkDropList, { static: true })
  public readonly dropList: CdkDropList;

  private dropGroup: string;

  public constructor(private groupService: DragAndDropGroupService) {}

  public dropGroup(group: string): readonly CdkDropList[] {
    return this.groupService.getGroupItems(group);
  }

  public ngAfterViewInit(): void {
    this.groupService.addGroupItem(this.dropGroup, this.dropList);
  }

  public ngOnDestroy(): void {
    this.groupService.removeGroupItem(this.dropGroup, this.dropList);
  }
}
```
