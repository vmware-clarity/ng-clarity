import * as i0 from "@angular/core";
import { NgModule } from "@angular/core";
import { ClrDatagridModule } from "@clr/angular/data/datagrid";
import { ClrStackViewModule } from "@clr/angular/data/stack-view";
import { ClrTreeViewModule } from "@clr/angular/data/tree-view";
export * from "@clr/angular/data/datagrid";
export * from "@clr/angular/data/stack-view";
export * from "@clr/angular/data/tree-view";
var ClrDataModule = class ClrDataModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDataModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDataModule,
			exports: [
				ClrDatagridModule,
				ClrStackViewModule,
				ClrTreeViewModule
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDataModule,
			imports: [
				ClrDatagridModule,
				ClrStackViewModule,
				ClrTreeViewModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDataModule,
	decorators: [{
		type: NgModule,
		args: [{ exports: [
			ClrDatagridModule,
			ClrStackViewModule,
			ClrTreeViewModule
		] }]
	}]
});
export { ClrDataModule };

//# sourceMappingURL=clr-angular-data.mjs.map