import * as i0 from "@angular/core";
import { Injectable } from "@angular/core";
var DragAndDropGroupService = class DragAndDropGroupService {
	constructor() {
		this.groups = /* @__PURE__ */ new Map();
	}
	getGroupItems(group) {
		const items = this.groups.get(group);
		if (items) return items;
		const emptyItems = [];
		this.groups.set(group, emptyItems);
		return emptyItems;
	}
	addGroupItem(group, item) {
		const items = this.groups.get(group) ?? [];
		if (!items.includes(item)) {
			items.push(item);
			this.groups.set(group, items);
		}
	}
	removeGroupItem(group, item) {
		const items = this.groups.get(group);
		if (!items) return;
		const index = items.indexOf(item);
		if (index < 0) return;
		items.splice(index, 1);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DragAndDropGroupService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DragAndDropGroupService,
			providedIn: "root"
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DragAndDropGroupService,
	decorators: [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}]
});
export { DragAndDropGroupService };

//# sourceMappingURL=clr-addons-drag-and-drop.mjs.map