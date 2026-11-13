import * as i0 from "@angular/core";
import { NgModule } from "@angular/core";
import { ClrBreadcrumbsModule } from "@clr/angular/layout/breadcrumbs";
import { ClrMainContainerModule } from "@clr/angular/layout/main-container";
import { ClrNavigationModule } from "@clr/angular/layout/nav";
import { ClrTabsModule } from "@clr/angular/layout/tabs";
import { ClrVerticalNavModule } from "@clr/angular/layout/vertical-nav";
export * from "@clr/angular/layout/breadcrumbs";
export * from "@clr/angular/layout/main-container";
export * from "@clr/angular/layout/nav";
export * from "@clr/angular/layout/tabs";
export * from "@clr/angular/layout/vertical-nav";
var ClrLayoutModule = class ClrLayoutModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLayoutModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLayoutModule,
			exports: [
				ClrMainContainerModule,
				ClrNavigationModule,
				ClrTabsModule,
				ClrVerticalNavModule,
				ClrBreadcrumbsModule
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLayoutModule,
			imports: [
				ClrMainContainerModule,
				ClrNavigationModule,
				ClrTabsModule,
				ClrVerticalNavModule,
				ClrBreadcrumbsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrLayoutModule,
	decorators: [{
		type: NgModule,
		args: [{ exports: [
			ClrMainContainerModule,
			ClrNavigationModule,
			ClrTabsModule,
			ClrVerticalNavModule,
			ClrBreadcrumbsModule
		] }]
	}]
});
export { ClrLayoutModule };

//# sourceMappingURL=clr-angular-layout.mjs.map