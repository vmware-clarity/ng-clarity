import * as i0 from "@angular/core";
import { ElementRef, OnDestroy, OnInit, Type } from "@angular/core";
import { ResponsiveNavControlMessage, ResponsiveNavigationService } from "@clr/angular/layout/nav";
import * as i2 from "@angular/common";
import * as i3 from "@clr/angular/icon";
export declare class ClrMainContainer implements OnDestroy, OnInit {
  private elRef;
  private responsiveNavService;
  private _subscription;
  private _classList;
  constructor(elRef: ElementRef<HTMLElement>, responsiveNavService: ResponsiveNavigationService);
  ngOnInit(): void;
  processMessage(message: ResponsiveNavControlMessage): void;
  controlNav(controlCode: string, navClass: string): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainer, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<ClrMainContainer, "clr-main-container", never, {}, {}, never, never, false, never>;
}
export declare const CLR_LAYOUT_DIRECTIVES: Type<any>[];
export declare class ClrMainContainerModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrMainContainerModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<ClrMainContainerModule, [typeof ClrMainContainer], [typeof i2.CommonModule, typeof i3.ClrIcon], [typeof ClrMainContainer]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<ClrMainContainerModule>;
}