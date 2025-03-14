/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MultiSelectComboboxModel } from '../model/multi-select-combobox.model';
import * as i0 from "@angular/core";
export class OptionSelectionService {
    constructor() {
        this.loading = false;
        // Display all options on first open, even if filter text exists.
        // https://github.com/vmware-clarity/ng-clarity/issues/386
        this.showAllOptions = true;
        this._currentInput = '';
        this._inputChanged = new BehaviorSubject('');
        this._selectionChanged = new ReplaySubject(1);
        this.inputChanged = this._inputChanged.asObservable();
    }
    get currentInput() {
        return this._currentInput;
    }
    set currentInput(input) {
        // clear value in single selection model when input is empty
        if (input === '' && !this.multiselectable) {
            this.setSelectionValue(null);
        }
        this._currentInput = input;
        this._inputChanged.next(input);
    }
    // This observable is for notifying the ClrOption to update its
    // selection by comparing the value
    get selectionChanged() {
        return this._selectionChanged.asObservable();
    }
    get multiselectable() {
        return this.selectionModel instanceof MultiSelectComboboxModel;
    }
    select(item) {
        if (item === null || item === undefined || this.selectionModel.containsItem(item)) {
            return;
        }
        this.selectionModel.select(item);
        this._selectionChanged.next(this.selectionModel);
    }
    toggle(item) {
        if (item === null || item === undefined) {
            return;
        }
        if (this.selectionModel.containsItem(item)) {
            this.selectionModel.unselect(item);
        }
        else {
            this.selectionModel.select(item);
        }
        this._selectionChanged.next(this.selectionModel);
    }
    unselect(item) {
        if (item === null || item === undefined || !this.selectionModel.containsItem(item)) {
            return;
        }
        this.selectionModel.unselect(item);
        this._selectionChanged.next(this.selectionModel);
    }
    // TODO: Add support for trackBy and compareFn
    setSelectionValue(value) {
        // NOTE: Currently we assume that no 2 options will have the same value
        // but Eudes and I discussed that this is a possibility but we will handle
        // this later
        // if selection is undefined, or its value hasn't changed, or changing from null <-> undefined, that's not really changing so we return
        if (!this.selectionModel || this.selectionModel.model === value || (!this.selectionModel.model && !value)) {
            return;
        }
        this.selectionModel.model = value;
        this._selectionChanged.next(this.selectionModel);
    }
}
OptionSelectionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OptionSelectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OptionSelectionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OptionSelectionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OptionSelectionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLXNlbGVjdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvcHJvdmlkZXJzL29wdGlvbi1zZWxlY3Rpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHbEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7O0FBR2hGLE1BQU0sT0FBTyxzQkFBc0I7SUFjakM7UUFiQSxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBS2hCLGlFQUFpRTtRQUNqRSwwREFBMEQ7UUFDMUQsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFFZCxrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUNuQixrQkFBYSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLHNCQUFpQixHQUFHLElBQUksYUFBYSxDQUFtQixDQUFDLENBQUMsQ0FBQztRQUdqRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBQ0QsSUFBSSxZQUFZLENBQUMsS0FBSztRQUNwQiw0REFBNEQ7UUFDNUQsSUFBSSxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsK0RBQStEO0lBQy9ELG1DQUFtQztJQUNuQyxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsWUFBWSx3QkFBd0IsQ0FBQztJQUNqRSxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQU87UUFDWixJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqRixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQU87UUFDWixJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN2QyxPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxRQUFRLENBQUMsSUFBTztRQUNkLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEYsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELDhDQUE4QztJQUM5QyxpQkFBaUIsQ0FBQyxLQUFjO1FBQzlCLHVFQUF1RTtRQUN2RSwwRUFBMEU7UUFDMUUsYUFBYTtRQUViLHVJQUF1STtRQUN2SSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekcsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7O21IQWpGVSxzQkFBc0I7dUhBQXRCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ29tYm9ib3hNb2RlbCB9IGZyb20gJy4uL21vZGVsL2NvbWJvYm94Lm1vZGVsJztcbmltcG9ydCB7IE11bHRpU2VsZWN0Q29tYm9ib3hNb2RlbCB9IGZyb20gJy4uL21vZGVsL211bHRpLXNlbGVjdC1jb21ib2JveC5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPcHRpb25TZWxlY3Rpb25TZXJ2aWNlPFQ+IHtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBkaXNwbGF5RmllbGQ6IHN0cmluZztcbiAgc2VsZWN0aW9uTW9kZWw6IENvbWJvYm94TW9kZWw8VD47XG4gIGlucHV0Q2hhbmdlZDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gIC8vIERpc3BsYXkgYWxsIG9wdGlvbnMgb24gZmlyc3Qgb3BlbiwgZXZlbiBpZiBmaWx0ZXIgdGV4dCBleGlzdHMuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92bXdhcmUtY2xhcml0eS9uZy1jbGFyaXR5L2lzc3Vlcy8zODZcbiAgc2hvd0FsbE9wdGlvbnMgPSB0cnVlO1xuXG4gIHByaXZhdGUgX2N1cnJlbnRJbnB1dCA9ICcnO1xuICBwcml2YXRlIF9pbnB1dENoYW5nZWQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KCcnKTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uQ2hhbmdlZCA9IG5ldyBSZXBsYXlTdWJqZWN0PENvbWJvYm94TW9kZWw8VD4+KDEpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaW5wdXRDaGFuZ2VkID0gdGhpcy5faW5wdXRDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRJbnB1dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50SW5wdXQ7XG4gIH1cbiAgc2V0IGN1cnJlbnRJbnB1dChpbnB1dCkge1xuICAgIC8vIGNsZWFyIHZhbHVlIGluIHNpbmdsZSBzZWxlY3Rpb24gbW9kZWwgd2hlbiBpbnB1dCBpcyBlbXB0eVxuICAgIGlmIChpbnB1dCA9PT0gJycgJiYgIXRoaXMubXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgICB0aGlzLnNldFNlbGVjdGlvblZhbHVlKG51bGwpO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50SW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLl9pbnB1dENoYW5nZWQubmV4dChpbnB1dCk7XG4gIH1cblxuICAvLyBUaGlzIG9ic2VydmFibGUgaXMgZm9yIG5vdGlmeWluZyB0aGUgQ2xyT3B0aW9uIHRvIHVwZGF0ZSBpdHNcbiAgLy8gc2VsZWN0aW9uIGJ5IGNvbXBhcmluZyB0aGUgdmFsdWVcbiAgZ2V0IHNlbGVjdGlvbkNoYW5nZWQoKTogT2JzZXJ2YWJsZTxDb21ib2JveE1vZGVsPFQ+PiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXQgbXVsdGlzZWxlY3RhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGVsIGluc3RhbmNlb2YgTXVsdGlTZWxlY3RDb21ib2JveE1vZGVsO1xuICB9XG5cbiAgc2VsZWN0KGl0ZW06IFQpIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB1bmRlZmluZWQgfHwgdGhpcy5zZWxlY3Rpb25Nb2RlbC5jb250YWluc0l0ZW0oaXRlbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoaXRlbSk7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5uZXh0KHRoaXMuc2VsZWN0aW9uTW9kZWwpO1xuICB9XG5cbiAgdG9nZ2xlKGl0ZW06IFQpIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZWwuY29udGFpbnNJdGVtKGl0ZW0pKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbk1vZGVsLnVuc2VsZWN0KGl0ZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbk1vZGVsLnNlbGVjdChpdGVtKTtcbiAgICB9XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5uZXh0KHRoaXMuc2VsZWN0aW9uTW9kZWwpO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbTogVCkge1xuICAgIGlmIChpdGVtID09PSBudWxsIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCB8fCAhdGhpcy5zZWxlY3Rpb25Nb2RlbC5jb250YWluc0l0ZW0oaXRlbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25Nb2RlbC51bnNlbGVjdChpdGVtKTtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLm5leHQodGhpcy5zZWxlY3Rpb25Nb2RlbCk7XG4gIH1cblxuICAvLyBUT0RPOiBBZGQgc3VwcG9ydCBmb3IgdHJhY2tCeSBhbmQgY29tcGFyZUZuXG4gIHNldFNlbGVjdGlvblZhbHVlKHZhbHVlOiBUIHwgVFtdKTogdm9pZCB7XG4gICAgLy8gTk9URTogQ3VycmVudGx5IHdlIGFzc3VtZSB0aGF0IG5vIDIgb3B0aW9ucyB3aWxsIGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAvLyBidXQgRXVkZXMgYW5kIEkgZGlzY3Vzc2VkIHRoYXQgdGhpcyBpcyBhIHBvc3NpYmlsaXR5IGJ1dCB3ZSB3aWxsIGhhbmRsZVxuICAgIC8vIHRoaXMgbGF0ZXJcblxuICAgIC8vIGlmIHNlbGVjdGlvbiBpcyB1bmRlZmluZWQsIG9yIGl0cyB2YWx1ZSBoYXNuJ3QgY2hhbmdlZCwgb3IgY2hhbmdpbmcgZnJvbSBudWxsIDwtPiB1bmRlZmluZWQsIHRoYXQncyBub3QgcmVhbGx5IGNoYW5naW5nIHNvIHdlIHJldHVyblxuICAgIGlmICghdGhpcy5zZWxlY3Rpb25Nb2RlbCB8fCB0aGlzLnNlbGVjdGlvbk1vZGVsLm1vZGVsID09PSB2YWx1ZSB8fCAoIXRoaXMuc2VsZWN0aW9uTW9kZWwubW9kZWwgJiYgIXZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uTW9kZWwubW9kZWwgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLm5leHQodGhpcy5zZWxlY3Rpb25Nb2RlbCk7XG4gIH1cbn1cbiJdfQ==