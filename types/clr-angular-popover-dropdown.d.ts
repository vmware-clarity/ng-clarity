import * as i0 from "@angular/core";
import { AfterContentInit, ChangeDetectorRef, ElementRef, OnDestroy, Optional, QueryList, Renderer2, Type } from "@angular/core";
import * as i1 from "@clr/angular/popover/common";
import { ClrPopoverContent, ClrPopoverPoint, ClrPopoverPosition, ClrPopoverService } from "@clr/angular/popover/common";
import { FocusService, FocusableItem } from "@clr/angular/utils";
import { Observable } from "rxjs";
import * as i5 from "@angular/common";
import * as i6 from "@clr/angular/icon";
export declare class DropdownFocusHandler implements OnDestroy, FocusableItem {
  private renderer;
  private parent;
  private popoverService;
  private focusService;
  private platformId;
  id: string;
  right?: Observable<FocusableItem>;
  down?: Observable<FocusableItem>;
  up?: Observable<FocusableItem>;
  private _trigger;
  private _container;
  private children;
  private _unlistenFuncs;
  private readonly subscriptions;
  private readonly recoverFocus;
  constructor(renderer: Renderer2, parent: DropdownFocusHandler, popoverService: ClrPopoverService, focusService: FocusService, platformId: any);
  get trigger(): HTMLElement;
  set trigger(el: HTMLElement);
  get container(): HTMLElement;
  set container(el: HTMLElement);
  ngOnDestroy(): void;
  /**
   * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
   */
  moveToFirstItemWhenOpen(): void;
  focus(): void;
  blur(): void;
  activate(): void;
  /**
   * Makes `item` the one the menu's keyboard handling acts on, and focuses it.
   *
   * Space and enter activate whatever the focus service considers current, not whatever the browser
   * has focused - see `FocusService.registerContainer`. So moving focus to a menu item without going
   * through here leaves the two disagreeing, and the keys then fire a different item than the one the
   * user can see is focused.
   */
  moveTo(item: FocusableItem): void;
  resetChildren(): void;
  addChildren(children: FocusableItem[]): void;
  private openAndGetChildren;
  private closeAndGetThis;
  static ɵfac: i0.ɵɵFactoryDeclaration<DropdownFocusHandler, [null, {
    optional: true;
    skipSelf: true;
  }, null, null, null]>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
export declare const DROPDOWN_FOCUS_HANDLER_PROVIDER: (import("@angular/core").Type<DropdownFocusHandler> | {
  provide: typeof FocusableItem;
  useExisting: import("@angular/core").Type<DropdownFocusHandler>;
})[];
export declare class RootDropdownService {
  private _changes;
  get changes(): Observable<boolean>;
  closeMenus(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<RootDropdownService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
export declare function clrRootDropdownFactory(existing: RootDropdownService): RootDropdownService;
export declare const ROOT_DROPDOWN_PROVIDER: {
  provide: typeof RootDropdownService;
  useFactory: typeof clrRootDropdownFactory;
  deps: Optional[][];
};
export declare class ClrDropdown implements OnDestroy {
  parent: ClrDropdown;
  popoverService: ClrPopoverService;
  focusHandler: DropdownFocusHandler;
  isMenuClosable: boolean;
  private subscriptions;
  constructor(parent: ClrDropdown, popoverService: ClrPopoverService, focusHandler: DropdownFocusHandler, cdr: ChangeDetectorRef, dropdownService: RootDropdownService);
  openAtPoint(point: ClrPopoverPoint, targetElement?: HTMLElement): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdown, [{
    optional: true;
    skipSelf: true;
  }, null, null, null, null]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdown, "clr-dropdown", never, {
    "isMenuClosable": {
      "alias": "clrCloseMenuOnItemClick";
      "required": false;
    };
  }, {}, never, ["*"], false, [{
    directive: typeof i1.ClrPopoverHostDirective;
    inputs: {};
    outputs: {};
  }]>;
}
export declare class ClrDropdownMenu implements AfterContentInit, OnDestroy {
  private focusHandler;
  private elementRef;
  private popoverService;
  private popoverContent;
  items: QueryList<FocusableItem>;
  constructor(parentHost: ElementRef<HTMLElement>, nested: ClrDropdownMenu, focusHandler: DropdownFocusHandler, elementRef: ElementRef, popoverService: ClrPopoverService, popoverContent: ClrPopoverContent);
  get isOffScreen(): boolean;
  set position(position: string | ClrPopoverPosition);
  ngAfterContentInit(): void;
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownMenu, [{
    optional: true;
  }, {
    optional: true;
    skipSelf: true;
  }, null, null, null, null]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrDropdownMenu, "clr-dropdown-menu", never, {
    "position": {
      "alias": "clrPosition";
      "required": false;
    };
  }, {}, ["items"], ["*"], false, [{
    directive: typeof i1.ClrPopoverContent;
    inputs: {};
    outputs: {};
  }]>;
}
export declare class ClrDropdownTrigger {
  private popoverService;
  isRootLevelToggle: boolean;
  constructor(dropdown: ClrDropdown, popoverService: ClrPopoverService, el: ElementRef<HTMLElement>, focusHandler: DropdownFocusHandler);
  get active(): boolean;
  onDropdownTriggerClick(event: any): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownTrigger, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownTrigger, "[clrDropdownTrigger],[clrDropdownToggle]", never, {}, {}, never, never, false, never>;
}
export declare class ClrDropdownItem {
  private dropdown;
  private _dropdownService;
  protected focusableItem: FocusableItem;
  private el;
  private renderer;
  /**
   * The role of the item, `menuitem` unless the item says otherwise.
   *
   * An item that represents a setting rather than a command needs one of the checkable menu roles -
   * `menuitemradio` for one of several exclusive settings, `menuitemcheckbox` for an independent one -
   * so that assistive technology can announce which of them is applied. Writing the role as a plain
   * attribute on the item is not enough: the host binding above would win over it.
   */
  role: string;
  constructor(dropdown: ClrDropdown, _dropdownService: RootDropdownService, focusableItem: FocusableItem, el: ElementRef, renderer: Renderer2);
  get disabled(): boolean | string;
  set disabled(value: boolean | string);
  /**
   * Let you overwrite the focusable auto increment id.
   */
  get dropdownItemId(): string;
  set dropdownItemId(value: string);
  private onDropdownItemClick;
  private onSpaceKeydown;
  private onEnterKeydown;
  private stopImmediatePropagationIfDisabled;
  private findRootDropdown;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownItem, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDropdownItem, "[clrDropdownItem]", never, {
    "role": {
      "alias": "role";
      "required": false;
    };
    "disabled": {
      "alias": "clrDisabled";
      "required": false;
    };
    "dropdownItemId": {
      "alias": "id";
      "required": false;
    };
  }, {}, never, never, false, never>;
}
export declare const CLR_MENU_POSITIONS: string[];
export declare const CLR_DROPDOWN_DIRECTIVES: Type<any>[];
export declare class ClrDropdownModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrDropdownModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDropdownModule, [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem], [typeof i5.CommonModule, typeof i6.ClrIcon, typeof i1.ClrIfOpen], [typeof ClrDropdown, typeof ClrDropdownMenu, typeof ClrDropdownTrigger, typeof ClrDropdownItem, typeof i1.ClrIfOpen, typeof i6.ClrIcon]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<ClrDropdownModule>;
}