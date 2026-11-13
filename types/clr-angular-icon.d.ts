import * as i0 from "@angular/core";
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, PipeTransform, Type } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as i2 from "@angular/common";
export declare class IconHtmlPipe implements PipeTransform {
  private sanitizer;
  constructor(sanitizer: DomSanitizer);
  transform(value: string): SafeHtml;
  static ɵfac: i0.ɵɵFactoryDeclaration<IconHtmlPipe, never>;
  static ɵpipe: i0.ɵɵPipeDeclaration<IconHtmlPipe, "iconHtml", true>;
}
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
export declare class ClrIconCustomTag {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconCustomTag, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIconCustomTag, "clr-icon", never, {}, {}, never, never, false, never>;
}
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
export declare class CdsIconCustomTag {
  static ɵfac: i0.ɵɵFactoryDeclaration<CdsIconCustomTag, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<CdsIconCustomTag, "cds-icon", never, {}, {}, never, never, false, never>;
}
export declare const CLR_ICON_DIRECTIVES: Type<any>[];
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
export declare class ClrIconModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<ClrIconModule, [typeof ClrIconCustomTag, typeof CdsIconCustomTag], [typeof i2.CommonModule], [typeof ClrIconCustomTag, typeof CdsIconCustomTag]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<ClrIconModule>;
}
type IconSvgString = string;
type IconNameString = string;
type IconAliases = string[];
export interface IconShapeCollection {
  outline?: IconSvgString;
  solid?: IconSvgString;
  outlineBadged?: IconSvgString;
  outlineAlerted?: IconSvgString;
  solidBadged?: IconSvgString;
  solidAlerted?: IconSvgString;
}
export type IconShapeTuple = [IconNameString, IconSvgString | IconShapeCollection];
export interface IconShapeSources {
  [key: string]: IconShapeTuple;
}
export interface IconRegistrySources {
  [key: string]: IconSvgString | IconShapeCollection;
}
export type IconRegistry = Partial<IconRegistrySources>;
type NameOfIconToAlias = string;
export type IconAlias = [NameOfIconToAlias, IconAliases];
export type Directions = 'up' | 'down' | 'left' | 'right';
export type Orientations = 'horizontal' | 'vertical';
export type StatusTypes = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export declare class ClrIcon implements OnInit, AfterViewInit, OnDestroy {
  el: ElementRef<HTMLElement>;
  private cdr;
  iconSVG: string;
  isStringIcon: boolean;
  private _shape;
  private _size;
  private _direction;
  private _flip;
  private _solid;
  private _status;
  private _inverse;
  private _badge;
  private _innerOffset;
  private subscription;
  private _priorShape;
  constructor(el: ElementRef<HTMLElement>, cdr: ChangeDetectorRef);
  get shape(): string;
  set shape(value: string);
  get size(): string;
  set size(value: string);
  get direction(): string;
  set direction(value: string);
  get flip(): Orientations;
  set flip(value: Orientations);
  get solid(): boolean;
  set solid(value: boolean);
  get status(): string;
  set status(value: string);
  get inverse(): boolean;
  set inverse(value: boolean);
  get badge(): string | boolean;
  set badge(value: string | boolean);
  /**
   * Given a pixel value, offsets any surrounding whitespace within the icon's svg,
   * growing it outward by that amount on every side so the visible glyph fills its box.
   */
  get innerOffset(): number;
  set innerOffset(value: number);
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  updateIcon(): void;
  updateIconSize(value: string): void;
  updateInnerOffset(value: number): void;
  private cleanUpAdoptedStyleSheets;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrIcon, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrIcon, "clr-icon, cds-icon", never, {
    "shape": {
      "alias": "shape";
      "required": false;
    };
    "size": {
      "alias": "size";
      "required": false;
    };
    "direction": {
      "alias": "direction";
      "required": false;
    };
    "flip": {
      "alias": "flip";
      "required": false;
    };
    "solid": {
      "alias": "solid";
      "required": false;
    };
    "status": {
      "alias": "status";
      "required": false;
    };
    "inverse": {
      "alias": "inverse";
      "required": false;
    };
    "badge": {
      "alias": "badge";
      "required": false;
    };
    "innerOffset": {
      "alias": "innerOffset";
      "required": false;
    };
  }, {}, never, never, true, never>;
  static ngAcceptInputType_solid: unknown;
  static ngAcceptInputType_inverse: unknown;
  static ngAcceptInputType_innerOffset: unknown;
}
/**
 * ClarityIcons is a static class that gives users the ability to interact with
 * the icon registry. This includes capabilities to add, retrieve, or alias icons
 * in the registry.
 *
 * @privateRemarks
 *
 * The icon registry is private to the module. There is no way to access it directly
 * outside of the module.
 *
 */
export declare class ClarityIcons {
  /**
   * Returns a readonly reference of the icon registry.
   */
  static get registry(): Readonly<IconRegistry>;
  /**
   * Looks up a single icon shape by name without copying the entire registry.
   *
   * Prefer this over indexing into `registry` (e.g. `registry[name]`) in hot paths like icon
   * rendering: `registry` spreads the whole (potentially large) registry into a new object on
   * every access, which becomes expensive/memory-churning when many icons render or re-render.
   */
  static getIconShape(name: string): IconRegistrySources[string] | undefined;
  static addIcons(...shapes: IconShapeTuple[]): void;
  /**
   * @description
   * Use `addIcons` instead of `addAliases`
   *
   * This method is a backwords compatibility function to the old API
   *
   * The team will revisit this method for possible deprecation.
   */
  static addAliases(...aliases: IconAlias[]): void;
  static getIconNameFromShape(iconShape: IconShapeTuple): string;
}
export declare function renderIcon(shapeOrStringIcon: IconShapeCollection | string): string | IconShapeCollection;
export declare const unknownIconName = "unknown";
export declare const unknownIcon: IconShapeTuple;
export declare const angleIconName = "angle";
export declare const angleIcon: IconShapeTuple;
export declare const angleDoubleIconName = "angle-double";
export declare const angleDoubleIcon: IconShapeTuple;
export declare const arrowIconName = "arrow";
export declare const arrowIcon: IconShapeTuple;
export declare const barsIconName = "bars";
export declare const barsIcon: IconShapeTuple;
export declare const bellIconName = "bell";
export declare const bellIcon: IconShapeTuple;
export declare const calendarIconName = "calendar";
export declare const calendarIcon: IconShapeTuple;
export declare const checkIconName = "check";
export declare const checkIcon: IconShapeTuple;
export declare const checkCircleIconName = "check-circle";
export declare const checkCircleIcon: IconShapeTuple;
export declare const cloudIconName = "cloud";
export declare const cloudIcon: IconShapeTuple;
export declare const cogIconName = "cog";
export declare const cogIcon: IconShapeTuple;
export declare const ellipsisGridCircleIconName = "ellipsis-grid-circle";
export declare const ellipsisGridCircleIcon: IconShapeTuple;
export declare const ellipsisHorizontalIconName = "ellipsis-horizontal";
export declare const ellipsisHorizontalIcon: IconShapeTuple;
export declare const ellipsisVerticalIconName = "ellipsis-vertical";
export declare const ellipsisVerticalIcon: IconShapeTuple;
export declare const errorStandardIconName = "error-standard";
export declare const errorStandardIcon: IconShapeTuple;
export declare const eventIconName = "event";
export declare const eventIcon: IconShapeTuple;
export declare const exclamationCircleIconName = "exclamation-circle";
export declare const exclamationCircleIcon: IconShapeTuple;
export declare const exclamationTriangleIconName = "exclamation-triangle";
export declare const exclamationTriangleIcon: IconShapeTuple;
export declare const eyeIconName = "eye";
export declare const eyeIcon: IconShapeTuple;
export declare const eyeHideIconName = "eye-hide";
export declare const eyeHideIcon: IconShapeTuple;
export declare const filterGridIconName = "filter-grid";
export declare const filterGridIcon: IconShapeTuple;
export declare const filterGridCircleIconName = "filter-grid-circle";
export declare const filterGridCircleIcon: IconShapeTuple;
export declare const folderIconName = "folder";
export declare const folderIcon: IconShapeTuple;
export declare const folderOpenIconName = "folder-open";
export declare const folderOpenIcon: IconShapeTuple;
export declare const helpInfoIconName = "help-info";
export declare const helpInfoIcon: IconShapeTuple;
export declare const homeIconName = "home";
export declare const homeIcon: IconShapeTuple;
export declare const imageIconName = "image";
export declare const imageIcon: IconShapeTuple;
export declare const infoCircleIconName = "info-circle";
export declare const infoCircleIcon: IconShapeTuple;
export declare const infoStandardIconName = "info-standard";
export declare const infoStandardIcon: IconShapeTuple;
export declare const searchIconName = "search";
export declare const searchIcon: IconShapeTuple;
export declare const stepForward2IconName = "step-forward-2";
export declare const stepForward2Icon: IconShapeTuple;
export declare const successStandardIconName = "success-standard";
export declare const successStandardIcon: IconShapeTuple;
export declare const timesIconName = "times";
export declare const timesIcon: IconShapeTuple;
export declare const unknownStatusIconName = "unknown-status";
export declare const unknownStatusIcon: IconShapeTuple;
export declare const userIconName = "user";
export declare const userIcon: IconShapeTuple;
export declare const viewColumnsIconName = "view-columns";
export declare const viewColumnsIcon: IconShapeTuple;
export declare const vmBugIconName = "vm-bug";
export declare const vmBugIcon: IconShapeTuple;
export declare const vmBugInverseIconName = "vm-bug-inverse";
export declare const vmBugInverseIcon: IconShapeTuple;
export declare const warningStandardIconName = "warning-standard";
export declare const warningStandardIcon: IconShapeTuple;
export declare const detailExpandIconName = "detail-expand";
export declare const detailExpandIcon: IconShapeTuple;
export declare const detailCollapseIconName = "detail-collapse";
export declare const detailCollapseIcon: IconShapeTuple;
export declare const accessibility1IconName = "accessibility-1";
export declare const accessibility1Icon: IconShapeTuple;
export declare const accessibility2IconName = "accessibility-2";
export declare const accessibility2Icon: IconShapeTuple;
export declare const announcementIconName = "announcement";
export declare const announcementIcon: IconShapeTuple;
export declare const addTextIconName = "add-text";
export declare const addTextIcon: IconShapeTuple;
export declare const alarmClockIconName = "alarm-clock";
export declare const alarmClockIcon: IconShapeTuple;
export declare const alarmOffIconName = "alarm-off";
export declare const alarmOffIcon: IconShapeTuple;
export declare const asteriskIconName = "asterisk";
export declare const asteriskIcon: IconShapeTuple;
export declare const banIconName = "ban";
export declare const banIcon: IconShapeTuple;
export declare const betaIconName = "beta";
export declare const betaIcon: IconShapeTuple;
export declare const birthdayCakeIconName = "birthday-cake";
export declare const birthdayCakeIcon: IconShapeTuple;
export declare const boltIconName = "bolt";
export declare const boltIcon: IconShapeTuple;
export declare const bookIconName = "book";
export declare const bookIcon: IconShapeTuple;
export declare const briefcaseIconName = "briefcase";
export declare const briefcaseIcon: IconShapeTuple;
export declare const bubbleExclamationIconName = "bubble-exclamation";
export declare const bubbleExclamationIcon: IconShapeTuple;
export declare const bugIconName = "bug";
export declare const bugIcon: IconShapeTuple;
export declare const bullseyeIconName = "bullseye";
export declare const bullseyeIcon: IconShapeTuple;
export declare const childArrowIconName = "child-arrow";
export declare const childArrowIcon: IconShapeTuple;
export declare const circleIconName = "circle";
export declare const circleIcon: IconShapeTuple;
export declare const circleArrowIconName = "circle-arrow";
export declare const circleArrowIcon: IconShapeTuple;
export declare const clipboardIconName = "clipboard";
export declare const clipboardIcon: IconShapeTuple;
export declare const clockIconName = "clock";
export declare const clockIcon: IconShapeTuple;
export declare const cloneIconName = "clone";
export declare const cloneIcon: IconShapeTuple;
export declare const collapseCardIconName = "collapse-card";
export declare const collapseCardIcon: IconShapeTuple;
export declare const colorPaletteIconName = "color-palette";
export declare const colorPaletteIcon: IconShapeTuple;
export declare const colorPickerIconName = "color-picker";
export declare const colorPickerIcon: IconShapeTuple;
export declare const copyIconName = "copy";
export declare const copyIcon: IconShapeTuple;
export declare const copyToClipboardIconName = "copy-to-clipboard";
export declare const copyToClipboardIcon: IconShapeTuple;
export declare const crosshairsIconName = "crosshairs";
export declare const crosshairsIcon: IconShapeTuple;
export declare const cursorArrowIconName = "cursor-arrow";
export declare const cursorArrowIcon: IconShapeTuple;
export declare const cursorHandIconName = "cursor-hand";
export declare const cursorHandIcon: IconShapeTuple;
export declare const cursorHandClickIconName = "cursor-hand-click";
export declare const cursorHandClickIcon: IconShapeTuple;
export declare const cursorHandGrabIconName = "cursor-hand-grab";
export declare const cursorHandGrabIcon: IconShapeTuple;
export declare const cursorHandOpenIconName = "cursor-hand-open";
export declare const cursorHandOpenIcon: IconShapeTuple;
export declare const cursorMoveIconName = "cursor-move";
export declare const cursorMoveIcon: IconShapeTuple;
export declare const detailsIconName = "details";
export declare const detailsIcon: IconShapeTuple;
export declare const dotCircleIconName = "dot-circle";
export declare const dotCircleIcon: IconShapeTuple;
export declare const downloadIconName = "download";
export declare const downloadIcon: IconShapeTuple;
export declare const dragHandleIconName = "drag-handle";
export declare const dragHandleIcon: IconShapeTuple;
export declare const dragHandleCornerIconName = "drag-handle-corner";
export declare const dragHandleCornerIcon: IconShapeTuple;
export declare const eraserIconName = "eraser";
export declare const eraserIcon: IconShapeTuple;
export declare const expandCardIconName = "expand-card";
export declare const expandCardIcon: IconShapeTuple;
export declare const fileIconName = "file";
export declare const fileIcon: IconShapeTuple;
export declare const fileGroupIconName = "file-group";
export declare const fileGroupIcon: IconShapeTuple;
export declare const fileSettingsIconName = "file-settings";
export declare const fileSettingsIcon: IconShapeTuple;
export declare const fileZipIconName = "file-zip";
export declare const fileZipIcon: IconShapeTuple;
export declare const filterIconName = "filter";
export declare const filterIcon: IconShapeTuple;
export declare const filter2IconName = "filter-2";
export declare const filter2Icon: IconShapeTuple;
export declare const filterOffIconName = "filter-off";
export declare const filterOffIcon: IconShapeTuple;
export declare const firewallIconName = "firewall";
export declare const firewallIcon: IconShapeTuple;
export declare const firstAidIconName = "first-aid";
export declare const firstAidIcon: IconShapeTuple;
export declare const fishIconName = "fish";
export declare const fishIcon: IconShapeTuple;
export declare const flameIconName = "flame";
export declare const flameIcon: IconShapeTuple;
export declare const formIconName = "form";
export declare const formIcon: IconShapeTuple;
export declare const fuelIconName = "fuel";
export declare const fuelIcon: IconShapeTuple;
export declare const gavelIconName = "gavel";
export declare const gavelIcon: IconShapeTuple;
export declare const gridViewIconName = "grid-view";
export declare const gridViewIcon: IconShapeTuple;
export declare const helpIconName = "help";
export declare const helpIcon: IconShapeTuple;
export declare const historyIconName = "history";
export declare const historyIcon: IconShapeTuple;
export declare const hourglassIconName = "hourglass";
export declare const hourglassIcon: IconShapeTuple;
export declare const idBadgeIconName = "id-badge";
export declare const idBadgeIcon: IconShapeTuple;
export declare const keyIconName = "key";
export declare const keyIcon: IconShapeTuple;
export declare const landscapeIconName = "landscape";
export declare const landscapeIcon: IconShapeTuple;
export declare const launchpadIconName = "launchpad";
export declare const launchpadIcon: IconShapeTuple;
export declare const libraryIconName = "library";
export declare const libraryIcon: IconShapeTuple;
export declare const lightbulbIconName = "lightbulb";
export declare const lightbulbIcon: IconShapeTuple;
export declare const listIconName = "list";
export declare const listIcon: IconShapeTuple;
export declare const lockIconName = "lock";
export declare const lockIcon: IconShapeTuple;
export declare const loginIconName = "login";
export declare const loginIcon: IconShapeTuple;
export declare const logoutIconName = "logout";
export declare const logoutIcon: IconShapeTuple;
export declare const minusIconName = "minus";
export declare const minusIcon: IconShapeTuple;
export declare const minusCircleIconName = "minus-circle";
export declare const minusCircleIcon: IconShapeTuple;
export declare const moonIconName = "moon";
export declare const moonIcon: IconShapeTuple;
export declare const newIconName = "new";
export declare const newIcon: IconShapeTuple;
export declare const noAccessIconName = "no-access";
export declare const noAccessIcon: IconShapeTuple;
export declare const noteIconName = "note";
export declare const noteIcon: IconShapeTuple;
export declare const objectsIconName = "objects";
export declare const objectsIcon: IconShapeTuple;
export declare const organizationIconName = "organization";
export declare const organizationIcon: IconShapeTuple;
export declare const paperclipIconName = "paperclip";
export declare const paperclipIcon: IconShapeTuple;
export declare const pasteIconName = "paste";
export declare const pasteIcon: IconShapeTuple;
export declare const pencilIconName = "pencil";
export declare const pencilIcon: IconShapeTuple;
export declare const pinIconName = "pin";
export declare const pinIcon: IconShapeTuple;
export declare const pinboardIconName = "pinboard";
export declare const pinboardIcon: IconShapeTuple;
export declare const plusIconName = "plus";
export declare const plusIcon: IconShapeTuple;
export declare const plusCircleIconName = "plus-circle";
export declare const plusCircleIcon: IconShapeTuple;
export declare const popOutIconName = "pop-out";
export declare const popOutIcon: IconShapeTuple;
export declare const portraitIconName = "portrait";
export declare const portraitIcon: IconShapeTuple;
export declare const printerIconName = "printer";
export declare const printerIcon: IconShapeTuple;
export declare const recycleIconName = "recycle";
export declare const recycleIcon: IconShapeTuple;
export declare const redoIconName = "redo";
export declare const redoIcon: IconShapeTuple;
export declare const refreshIconName = "refresh";
export declare const refreshIcon: IconShapeTuple;
export declare const repeatIconName = "repeat";
export declare const repeatIcon: IconShapeTuple;
export declare const resizeIconName = "resize";
export declare const resizeIcon: IconShapeTuple;
export declare const scissorsIconName = "scissors";
export declare const scissorsIcon: IconShapeTuple;
export declare const scrollIconName = "scroll";
export declare const scrollIcon: IconShapeTuple;
export declare const shrinkIconName = "shrink";
export declare const shrinkIcon: IconShapeTuple;
export declare const sliderIconName = "slider";
export declare const sliderIcon: IconShapeTuple;
export declare const snowflakeIconName = "snowflake";
export declare const snowflakeIcon: IconShapeTuple;
export declare const sortByIconName = "sort-by";
export declare const sortByIcon: IconShapeTuple;
export declare const sunIconName = "sun";
export declare const sunIcon: IconShapeTuple;
export declare const switchIconName = "switch";
export declare const switchIcon: IconShapeTuple;
export declare const syncIconName = "sync";
export declare const syncIcon: IconShapeTuple;
export declare const tableIconName = "table";
export declare const tableIcon: IconShapeTuple;
export declare const tagIconName = "tag";
export declare const tagIcon: IconShapeTuple;
export declare const tagsIconName = "tags";
export declare const tagsIcon: IconShapeTuple;
export declare const targetIconName = "target";
export declare const targetIcon: IconShapeTuple;
export declare const thermometerIconName = "thermometer";
export declare const thermometerIcon: IconShapeTuple;
export declare const timelineIconName = "timeline";
export declare const timelineIcon: IconShapeTuple;
export declare const timesCircleIconName = "times-circle";
export declare const timesCircleIcon: IconShapeTuple;
export declare const toolsIconName = "tools";
export declare const toolsIcon: IconShapeTuple;
export declare const trashIconName = "trash";
export declare const trashIcon: IconShapeTuple;
export declare const treeIconName = "tree";
export declare const treeIcon: IconShapeTuple;
export declare const treeViewIconName = "tree-view";
export declare const treeViewIcon: IconShapeTuple;
export declare const twoWayArrowsIconName = "two-way-arrows";
export declare const twoWayArrowsIcon: IconShapeTuple;
export declare const undoIconName = "undo";
export declare const undoIcon: IconShapeTuple;
export declare const unpinIconName = "unpin";
export declare const unpinIcon: IconShapeTuple;
export declare const unlockIconName = "unlock";
export declare const unlockIcon: IconShapeTuple;
export declare const uploadIconName = "upload";
export declare const uploadIcon: IconShapeTuple;
export declare const usersIconName = "users";
export declare const usersIcon: IconShapeTuple;
export declare const viewCardsIconName = "view-cards";
export declare const viewCardsIcon: IconShapeTuple;
export declare const viewListIconName = "view-list";
export declare const viewListIcon: IconShapeTuple;
export declare const volumeIconName = "volume";
export declare const volumeIcon: IconShapeTuple;
export declare const wandIconName = "wand";
export declare const wandIcon: IconShapeTuple;
export declare const windowCloseIconName = "window-close";
export declare const windowCloseIcon: IconShapeTuple;
export declare const windowMaxIconName = "window-max";
export declare const windowMaxIcon: IconShapeTuple;
export declare const windowMinIconName = "window-min";
export declare const windowMinIcon: IconShapeTuple;
export declare const windowRestoreIconName = "window-restore";
export declare const windowRestoreIcon: IconShapeTuple;
export declare const worldIconName = "world";
export declare const worldIcon: IconShapeTuple;
export declare const wrenchIconName = "wrench";
export declare const wrenchIcon: IconShapeTuple;
export declare const zoomInIconName = "zoom-in";
export declare const zoomInIcon: IconShapeTuple;
export declare const zoomOutIconName = "zoom-out";
export declare const zoomOutIcon: IconShapeTuple;
export declare const axisChartIconName = "axis-chart";
export declare const axisChartIcon: IconShapeTuple;
export declare const barChartIconName = "bar-chart";
export declare const barChartIcon: IconShapeTuple;
export declare const bellCurveIconName = "bell-curve";
export declare const bellCurveIcon: IconShapeTuple;
export declare const boxPlotIconName = "box-plot";
export declare const boxPlotIcon: IconShapeTuple;
export declare const bubbleChartIconName = "bubble-chart";
export declare const bubbleChartIcon: IconShapeTuple;
export declare const cloudChartIconName = "cloud-chart";
export declare const cloudChartIcon: IconShapeTuple;
export declare const curveChartIconName = "curve-chart";
export declare const curveChartIcon: IconShapeTuple;
export declare const gridChartIconName = "grid-chart";
export declare const gridChartIcon: IconShapeTuple;
export declare const heatMapIconName = "heat-map";
export declare const heatMapIcon: IconShapeTuple;
export declare const lineChartIconName = "line-chart";
export declare const lineChartIcon: IconShapeTuple;
export declare const pieChartIconName = "pie-chart";
export declare const pieChartIcon: IconShapeTuple;
export declare const scatterPlotIconName = "scatter-plot";
export declare const scatterPlotIcon: IconShapeTuple;
export declare const tickChartIconName = "tick-chart";
export declare const tickChartIcon: IconShapeTuple;
export declare const bankIconName = "bank";
export declare const bankIcon: IconShapeTuple;
export declare const bitcoinIconName = "bitcoin";
export declare const bitcoinIcon: IconShapeTuple;
export declare const calculatorIconName = "calculator";
export declare const calculatorIcon: IconShapeTuple;
export declare const coinBagIconName = "coin-bag";
export declare const coinBagIcon: IconShapeTuple;
export declare const creditCardIconName = "credit-card";
export declare const creditCardIcon: IconShapeTuple;
export declare const dollarIconName = "dollar";
export declare const dollarIcon: IconShapeTuple;
export declare const dollarBillIconName = "dollar-bill";
export declare const dollarBillIcon: IconShapeTuple;
export declare const eCheckIconName = "e-check";
export declare const eCheckIcon: IconShapeTuple;
export declare const employeeIconName = "employee";
export declare const employeeIcon: IconShapeTuple;
export declare const employeeGroupIconName = "employee-group";
export declare const employeeGroupIcon: IconShapeTuple;
export declare const euroIconName = "euro";
export declare const euroIcon: IconShapeTuple;
export declare const factoryIconName = "factory";
export declare const factoryIcon: IconShapeTuple;
export declare const pesoIconName = "peso";
export declare const pesoIcon: IconShapeTuple;
export declare const piggyBankIconName = "piggy-bank";
export declare const piggyBankIcon: IconShapeTuple;
export declare const poundIconName = "pound";
export declare const poundIcon: IconShapeTuple;
export declare const rubleIconName = "ruble";
export declare const rubleIcon: IconShapeTuple;
export declare const rupeeIconName = "rupee";
export declare const rupeeIcon: IconShapeTuple;
export declare const shoppingBagIconName = "shopping-bag";
export declare const shoppingBagIcon: IconShapeTuple;
export declare const shoppingCartIconName = "shopping-cart";
export declare const shoppingCartIcon: IconShapeTuple;
export declare const storeIconName = "store";
export declare const storeIcon: IconShapeTuple;
export declare const walletIconName = "wallet";
export declare const walletIcon: IconShapeTuple;
export declare const wonIconName = "won";
export declare const wonIcon: IconShapeTuple;
export declare const yenIconName = "yen";
export declare const yenIcon: IconShapeTuple;
export declare const cameraIconName = "camera";
export declare const cameraIcon: IconShapeTuple;
export declare const fastForwardIconName = "fast-forward";
export declare const fastForwardIcon: IconShapeTuple;
export declare const filmStripIconName = "film-strip";
export declare const filmStripIcon: IconShapeTuple;
export declare const headphonesIconName = "headphones";
export declare const headphonesIcon: IconShapeTuple;
export declare const imageGalleryIconName = "image-gallery";
export declare const imageGalleryIcon: IconShapeTuple;
export declare const microphoneIconName = "microphone";
export declare const microphoneIcon: IconShapeTuple;
export declare const microphoneMuteIconName = "microphone-mute";
export declare const microphoneMuteIcon: IconShapeTuple;
export declare const musicNoteIconName = "music-note";
export declare const musicNoteIcon: IconShapeTuple;
export declare const pauseIconName = "pause";
export declare const pauseIcon: IconShapeTuple;
export declare const playIconName = "play";
export declare const playIcon: IconShapeTuple;
export declare const powerIconName = "power";
export declare const powerIcon: IconShapeTuple;
export declare const replayAllIconName = "replay-all";
export declare const replayAllIcon: IconShapeTuple;
export declare const replayOneIconName = "replay-one";
export declare const replayOneIcon: IconShapeTuple;
export declare const rewindIconName = "rewind";
export declare const rewindIcon: IconShapeTuple;
export declare const shuffleIconName = "shuffle";
export declare const shuffleIcon: IconShapeTuple;
export declare const stepForwardIconName = "step-forward";
export declare const stepForwardIcon: IconShapeTuple;
export declare const stopIconName = "stop";
export declare const stopIcon: IconShapeTuple;
export declare const videoCameraIconName = "video-camera";
export declare const videoCameraIcon: IconShapeTuple;
export declare const videoGalleryIconName = "video-gallery";
export declare const videoGalleryIcon: IconShapeTuple;
export declare const volumeDownIconName = "volume-down";
export declare const volumeDownIcon: IconShapeTuple;
export declare const volumeMuteIconName = "volume-mute";
export declare const volumeMuteIcon: IconShapeTuple;
export declare const volumeUpIconName = "volume-up";
export declare const volumeUpIcon: IconShapeTuple;
export declare const arrowMiniIconName = "arrow-mini";
export declare const arrowMiniIcon: IconShapeTuple;
export declare const calendarMiniIconName = "calendar-mini";
export declare const calendarMiniIcon: IconShapeTuple;
export declare const checkCircleMiniIconName = "check-circle-mini";
export declare const checkCircleMiniIcon: IconShapeTuple;
export declare const checkMiniIconName = "check-mini";
export declare const checkMiniIcon: IconShapeTuple;
export declare const errorMiniIconName = "error-mini";
export declare const errorMiniIcon: IconShapeTuple;
export declare const eventMiniIconName = "event-mini";
export declare const eventMiniIcon: IconShapeTuple;
export declare const filterGridCircleMiniIconName = "filter-grid-circle-mini";
export declare const filterGridCircleMiniIcon: IconShapeTuple;
export declare const filterGridMiniIconName = "filter-grid-mini";
export declare const filterGridMiniIcon: IconShapeTuple;
export declare const infoCircleMiniIconName = "info-circle-mini";
export declare const infoCircleMiniIcon: IconShapeTuple;
export declare const timesMiniIconName = "times-mini";
export declare const timesMiniIcon: IconShapeTuple;
export declare const warningMiniIconName = "warning-mini";
export declare const warningMiniIcon: IconShapeTuple;
export declare const administratorIconName = "administrator";
export declare const administratorIcon: IconShapeTuple;
export declare const animationIconName = "animation";
export declare const animationIcon: IconShapeTuple;
export declare const applicationIconName = "application";
export declare const applicationIcon: IconShapeTuple;
export declare const applicationsIconName = "applications";
export declare const applicationsIcon: IconShapeTuple;
export declare const archiveIconName = "archive";
export declare const archiveIcon: IconShapeTuple;
export declare const assignUserIconName = "assign-user";
export declare const assignUserIcon: IconShapeTuple;
export declare const atomIconName = "atom";
export declare const atomIcon: IconShapeTuple;
export declare const backupIconName = "backup";
export declare const backupIcon: IconShapeTuple;
export declare const backupRestoreIconName = "backup-restore";
export declare const backupRestoreIcon: IconShapeTuple;
export declare const barCodeIconName = "bar-code";
export declare const barCodeIcon: IconShapeTuple;
export declare const batteryIconName = "battery";
export declare const batteryIcon: IconShapeTuple;
export declare const blockIconName = "block";
export declare const blockIcon: IconShapeTuple;
export declare const blocksGroupIconName = "blocks-group";
export declare const blocksGroupIcon: IconShapeTuple;
export declare const bluetoothIconName = "bluetooth";
export declare const bluetoothIcon: IconShapeTuple;
export declare const bluetoothOffIconName = "bluetooth-off";
export declare const bluetoothOffIcon: IconShapeTuple;
export declare const buildingIconName = "building";
export declare const buildingIcon: IconShapeTuple;
export declare const bundleIconName = "bundle";
export declare const bundleIcon: IconShapeTuple;
export declare const capacitorIconName = "capacitor";
export declare const capacitorIcon: IconShapeTuple;
export declare const cdDvdIconName = "cd-dvd";
export declare const cdDvdIcon: IconShapeTuple;
export declare const certificateIconName = "certificate";
export declare const certificateIcon: IconShapeTuple;
export declare const ciCdIconName = "ci-cd";
export declare const ciCdIcon: IconShapeTuple;
export declare const cloudNetworkIconName = "cloud-network";
export declare const cloudNetworkIcon: IconShapeTuple;
export declare const cloudScaleIconName = "cloud-scale";
export declare const cloudScaleIcon: IconShapeTuple;
export declare const cloudTrafficIconName = "cloud-traffic";
export declare const cloudTrafficIcon: IconShapeTuple;
export declare const clusterIconName = "cluster";
export declare const clusterIcon: IconShapeTuple;
export declare const codeIconName = "code";
export declare const codeIcon: IconShapeTuple;
export declare const computerIconName = "computer";
export declare const computerIcon: IconShapeTuple;
export declare const connectIconName = "connect";
export declare const connectIcon: IconShapeTuple;
export declare const containerIconName = "container";
export declare const containerIcon: IconShapeTuple;
export declare const containerGroupIconName = "container-group";
export declare const containerGroupIcon: IconShapeTuple;
export declare const containerVolumeIconName = "container-volume";
export declare const containerVolumeIcon: IconShapeTuple;
export declare const controlLunIconName = "control-lun";
export declare const controlLunIcon: IconShapeTuple;
export declare const cpuIconName = "cpu";
export declare const cpuIcon: IconShapeTuple;
export declare const dashboardIconName = "dashboard";
export declare const dashboardIcon: IconShapeTuple;
export declare const dataClusterIconName = "data-cluster";
export declare const dataClusterIcon: IconShapeTuple;
export declare const deployIconName = "deploy";
export declare const deployIcon: IconShapeTuple;
export declare const devicesIconName = "devices";
export declare const devicesIcon: IconShapeTuple;
export declare const digitalSignatureIconName = "digital-signature";
export declare const digitalSignatureIcon: IconShapeTuple;
export declare const disconnectIconName = "disconnect";
export declare const disconnectIcon: IconShapeTuple;
export declare const displayIconName = "display";
export declare const displayIcon: IconShapeTuple;
export declare const downloadCloudIconName = "download-cloud";
export declare const downloadCloudIcon: IconShapeTuple;
export declare const exportIconName = "export";
export declare const exportIcon: IconShapeTuple;
export declare const fileShare2IconName = "file-share-2";
export declare const fileShare2Icon: IconShapeTuple;
export declare const fileShareIconName = "file-share";
export declare const fileShareIcon: IconShapeTuple;
export declare const flaskIconName = "flask";
export declare const flaskIcon: IconShapeTuple;
export declare const floppyIconName = "floppy";
export declare const floppyIcon: IconShapeTuple;
export declare const forkingIconName = "forking";
export declare const forkingIcon: IconShapeTuple;
export declare const hardDiskIconName = "hard-disk";
export declare const hardDiskIcon: IconShapeTuple;
export declare const hardDriveDisksIconName = "hard-drive-disks";
export declare const hardDriveDisksIcon: IconShapeTuple;
export declare const hardDriveIconName = "hard-drive";
export declare const hardDriveIcon: IconShapeTuple;
export declare const helixIconName = "helix";
export declare const helixIcon: IconShapeTuple;
export declare const hostGroupIconName = "host-group";
export declare const hostGroupIcon: IconShapeTuple;
export declare const hostIconName = "host";
export declare const hostIcon: IconShapeTuple;
export declare const importIconName = "import";
export declare const importIcon: IconShapeTuple;
export declare const inductorIconName = "inductor";
export declare const inductorIcon: IconShapeTuple;
export declare const installIconName = "install";
export declare const installIcon: IconShapeTuple;
export declare const internetOfThingsIconName = "internet-of-things";
export declare const internetOfThingsIcon: IconShapeTuple;
export declare const keyboardIconName = "keyboard";
export declare const keyboardIcon: IconShapeTuple;
export declare const layersIconName = "layers";
export declare const layersIcon: IconShapeTuple;
export declare const linkIconName = "link";
export declare const linkIcon: IconShapeTuple;
export declare const mediaChangerIconName = "media-changer";
export declare const mediaChangerIcon: IconShapeTuple;
export declare const memoryIconName = "memory";
export declare const memoryIcon: IconShapeTuple;
export declare const mobileIconName = "mobile";
export declare const mobileIcon: IconShapeTuple;
export declare const mouseIconName = "mouse";
export declare const mouseIcon: IconShapeTuple;
export declare const namespaceIconName = "namespace";
export declare const namespaceIcon: IconShapeTuple;
export declare const networkGlobeIconName = "network-globe";
export declare const networkGlobeIcon: IconShapeTuple;
export declare const networkSettingsIconName = "network-settings";
export declare const networkSettingsIcon: IconShapeTuple;
export declare const networkSwitchIconName = "network-switch";
export declare const networkSwitchIcon: IconShapeTuple;
export declare const nodeGroupIconName = "node-group";
export declare const nodeGroupIcon: IconShapeTuple;
export declare const nodeIconName = "node";
export declare const nodeIcon: IconShapeTuple;
export declare const nodesIconName = "nodes";
export declare const nodesIcon: IconShapeTuple;
export declare const noWifiIconName = "no-wifi";
export declare const noWifiIcon: IconShapeTuple;
export declare const nvmeIconName = "nvme";
export declare const nvmeIcon: IconShapeTuple;
export declare const pdfFileIconName = "pdf-file";
export declare const pdfFileIcon: IconShapeTuple;
export declare const phoneHandsetIconName = "phone-handset";
export declare const phoneHandsetIcon: IconShapeTuple;
export declare const pluginIconName = "plugin";
export declare const pluginIcon: IconShapeTuple;
export declare const podIconName = "pod";
export declare const podIcon: IconShapeTuple;
export declare const processOnVmIconName = "process-on-vm";
export declare const processOnVmIcon: IconShapeTuple;
export declare const qrCodeIconName = "qr-code";
export declare const qrCodeIcon: IconShapeTuple;
export declare const rackServerIconName = "rack-server";
export declare const rackServerIcon: IconShapeTuple;
export declare const radarIconName = "radar";
export declare const radarIcon: IconShapeTuple;
export declare const resistorIconName = "resistor";
export declare const resistorIcon: IconShapeTuple;
export declare const resourcePoolIconName = "resource-pool";
export declare const resourcePoolIcon: IconShapeTuple;
export declare const routerIconName = "router";
export declare const routerIcon: IconShapeTuple;
export declare const rulerPencilIconName = "ruler-pencil";
export declare const rulerPencilIcon: IconShapeTuple;
export declare const scriptExecuteIconName = "script-execute";
export declare const scriptExecuteIcon: IconShapeTuple;
export declare const scriptScheduleIconName = "script-schedule";
export declare const scriptScheduleIcon: IconShapeTuple;
export declare const shieldCheckIconName = "shield-check";
export declare const shieldCheckIcon: IconShapeTuple;
export declare const shieldIconName = "shield";
export declare const shieldIcon: IconShapeTuple;
export declare const shieldXIconName = "shield-x";
export declare const shieldXIcon: IconShapeTuple;
export declare const squidIconName = "squid";
export declare const squidIcon: IconShapeTuple;
export declare const ssdIconName = "ssd";
export declare const ssdIcon: IconShapeTuple;
export declare const storageAdapterIconName = "storage-adapter";
export declare const storageAdapterIcon: IconShapeTuple;
export declare const storageIconName = "storage";
export declare const storageIcon: IconShapeTuple;
export declare const tabletIconName = "tablet";
export declare const tabletIcon: IconShapeTuple;
export declare const tapeDriveIconName = "tape-drive";
export declare const tapeDriveIcon: IconShapeTuple;
export declare const terminalIconName = "terminal";
export declare const terminalIcon: IconShapeTuple;
export declare const thinClientIconName = "thin-client";
export declare const thinClientIcon: IconShapeTuple;
export declare const unarchiveIconName = "unarchive";
export declare const unarchiveIcon: IconShapeTuple;
export declare const uninstallIconName = "uninstall";
export declare const uninstallIcon: IconShapeTuple;
export declare const unlinkIconName = "unlink";
export declare const unlinkIcon: IconShapeTuple;
export declare const updateIconName = "update";
export declare const updateIcon: IconShapeTuple;
export declare const uploadCloudIconName = "upload-cloud";
export declare const uploadCloudIcon: IconShapeTuple;
export declare const usbIconName = "usb";
export declare const usbIcon: IconShapeTuple;
export declare const vmIconName = "vm";
export declare const vmIcon: IconShapeTuple;
export declare const vmwAppIconName = "vmw-app";
export declare const vmwAppIcon: IconShapeTuple;
export declare const wifiIconName = "wifi";
export declare const wifiIcon: IconShapeTuple;
export declare const xlsFileIconName = "xls-file";
export declare const xlsFileIcon: IconShapeTuple;
export declare const bookmarkIconName = "bookmark";
export declare const bookmarkIcon: IconShapeTuple;
export declare const chatBubbleIconName = "chat-bubble";
export declare const chatBubbleIcon: IconShapeTuple;
export declare const contractIconName = "contract";
export declare const contractIcon: IconShapeTuple;
export declare const crownIconName = "crown";
export declare const crownIcon: IconShapeTuple;
export declare const envelopeIconName = "envelope";
export declare const envelopeIcon: IconShapeTuple;
export declare const flagIconName = "flag";
export declare const flagIcon: IconShapeTuple;
export declare const halfStarIconName = "half-star";
export declare const halfStarIcon: IconShapeTuple;
export declare const happyFaceIconName = "happy-face";
export declare const happyFaceIcon: IconShapeTuple;
export declare const hashtagIconName = "hashtag";
export declare const hashtagIcon: IconShapeTuple;
export declare const heartIconName = "heart";
export declare const heartIcon: IconShapeTuple;
export declare const heartBrokenIconName = "heart-broken";
export declare const heartBrokenIcon: IconShapeTuple;
export declare const inboxIconName = "inbox";
export declare const inboxIcon: IconShapeTuple;
export declare const neutralFaceIconName = "neutral-face";
export declare const neutralFaceIcon: IconShapeTuple;
export declare const pictureIconName = "picture";
export declare const pictureIcon: IconShapeTuple;
export declare const sadFaceIconName = "sad-face";
export declare const sadFaceIcon: IconShapeTuple;
export declare const shareIconName = "share";
export declare const shareIcon: IconShapeTuple;
export declare const starIconName = "star";
export declare const starIcon: IconShapeTuple;
export declare const talkBubblesIconName = "talk-bubbles";
export declare const talkBubblesIcon: IconShapeTuple;
export declare const tasksIconName = "tasks";
export declare const tasksIcon: IconShapeTuple;
export declare const thumbsDownIconName = "thumbs-down";
export declare const thumbsDownIcon: IconShapeTuple;
export declare const thumbsUpIconName = "thumbs-up";
export declare const thumbsUpIcon: IconShapeTuple;
export declare const alignBottomIconName = "align-bottom";
export declare const alignBottomIcon: IconShapeTuple;
export declare const alignCenterIconName = "align-center";
export declare const alignCenterIcon: IconShapeTuple;
export declare const alignLeftIconName = "align-left";
export declare const alignLeftIcon: IconShapeTuple;
export declare const alignLeftTextIconName = "align-left-text";
export declare const alignLeftTextIcon: IconShapeTuple;
export declare const alignMiddleIconName = "align-middle";
export declare const alignMiddleIcon: IconShapeTuple;
export declare const alignRightIconName = "align-right";
export declare const alignRightIcon: IconShapeTuple;
export declare const alignRightTextIconName = "align-right-text";
export declare const alignRightTextIcon: IconShapeTuple;
export declare const alignTopIconName = "align-top";
export declare const alignTopIcon: IconShapeTuple;
export declare const blockQuoteIconName = "block-quote";
export declare const blockQuoteIcon: IconShapeTuple;
export declare const boldIconName = "bold";
export declare const boldIcon: IconShapeTuple;
export declare const bulletListIconName = "bullet-list";
export declare const bulletListIcon: IconShapeTuple;
export declare const centerTextIconName = "center-text";
export declare const centerTextIcon: IconShapeTuple;
export declare const checkboxListIconName = "checkbox-list";
export declare const checkboxListIcon: IconShapeTuple;
export declare const fontSizeIconName = "font-size";
export declare const fontSizeIcon: IconShapeTuple;
export declare const highlighterIconName = "highlighter";
export declare const highlighterIcon: IconShapeTuple;
export declare const indentIconName = "indent";
export declare const indentIcon: IconShapeTuple;
export declare const italicIconName = "italic";
export declare const italicIcon: IconShapeTuple;
export declare const justifyTextIconName = "justify-text";
export declare const justifyTextIcon: IconShapeTuple;
export declare const languageIconName = "language";
export declare const languageIcon: IconShapeTuple;
export declare const numberListIconName = "number-list";
export declare const numberListIcon: IconShapeTuple;
export declare const outdentIconName = "outdent";
export declare const outdentIcon: IconShapeTuple;
export declare const paintRollerIconName = "paint-roller";
export declare const paintRollerIcon: IconShapeTuple;
export declare const strikethroughIconName = "strikethrough";
export declare const strikethroughIcon: IconShapeTuple;
export declare const subscriptIconName = "subscript";
export declare const subscriptIcon: IconShapeTuple;
export declare const superscriptIconName = "superscript";
export declare const superscriptIcon: IconShapeTuple;
export declare const textIconName = "text";
export declare const textIcon: IconShapeTuple;
export declare const textColorIconName = "text-color";
export declare const textColorIcon: IconShapeTuple;
export declare const underlineIconName = "underline";
export declare const underlineIcon: IconShapeTuple;
export declare const airplaneIconName = "airplane";
export declare const airplaneIcon: IconShapeTuple;
export declare const bicycleIconName = "bicycle";
export declare const bicycleIcon: IconShapeTuple;
export declare const boatIconName = "boat";
export declare const boatIcon: IconShapeTuple;
export declare const campervanIconName = "campervan";
export declare const campervanIcon: IconShapeTuple;
export declare const carIconName = "car";
export declare const carIcon: IconShapeTuple;
export declare const caravanIconName = "caravan";
export declare const caravanIcon: IconShapeTuple;
export declare const compassIconName = "compass";
export declare const compassIcon: IconShapeTuple;
export declare const ferryIconName = "ferry";
export declare const ferryIcon: IconShapeTuple;
export declare const mapIconName = "map";
export declare const mapIcon: IconShapeTuple;
export declare const mapMarkerIconName = "map-marker";
export declare const mapMarkerIcon: IconShapeTuple;
export declare const onHolidayIconName = "on-holiday";
export declare const onHolidayIcon: IconShapeTuple;
export declare const trailerIconName = "trailer";
export declare const trailerIcon: IconShapeTuple;
export declare const truckIconName = "truck";
export declare const truckIcon: IconShapeTuple;
export declare const chartCollectionIcons: IconShapeTuple[];
export declare const chartCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadChartIconSet } from '@clr/angular';
 *
 * loadChartIconSet();
 * ```
 *
 */
export declare function loadChartIconSet(): void;
export declare const commerceCollectionIcons: IconShapeTuple[];
export declare const commerceCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCommerceIconSet } from '@clr/angular';
 *
 * loadCommerceIconSet();
 * ```
 *
 */
export declare function loadCommerceIconSet(): void;
export declare const coreCollectionIcons: IconShapeTuple[];
export declare const coreCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCoreIconSet } from '@clr/angular';
 *
 * loadCoreIconSet();
 * ```
 *
 */
export declare function loadCoreIconSet(): void;
export declare const essentialCollectionIcons: IconShapeTuple[];
export declare const essentialCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadEssentialIconSet } from '@clr/angular';
 *
 * loadEssentialIconSet();
 * ```
 *
 */
export declare function loadEssentialIconSet(): void;
export declare const mediaCollectionIcons: IconShapeTuple[];
export declare const mediaCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadMediaIconSet } from '@clr/angular';
 *
 * loadMediaIconSet();
 * ```
 *
 */
export declare function loadMediaIconSet(): void;
export declare const miniCollectionIcons: IconShapeTuple[];
export declare const miniCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the mini icon set.
 *
 * ```typescript@clr/angular';
 *
 * loadMiniIconSet();
 * ```
 *
 */
export declare function loadMiniIconSet(): void;
export declare const technologyCollectionIcons: IconShapeTuple[];
export declare const technologyCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTechnologyIconSet } from '@clr/angular';
 *
 * loadTechnologyIconSet();
 * ```
 *
 */
export declare function loadTechnologyIconSet(): void;
export declare const socialCollectionIcons: IconShapeTuple[];
export declare const socialCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadSocialIconSet } from '@clr/angular';
 *
 * loadSocialIconSet();
 * ```
 *
 */
export declare function loadSocialIconSet(): void;
export declare const textEditCollectionIcons: IconShapeTuple[];
export declare const textEditCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTextEditIconSet } from '@clr/angular';
 *
 * loadTextEditIconSet();
 * ```
 *
 */
export declare function loadTextEditIconSet(): void;
export declare const travelCollectionIcons: IconShapeTuple[];
export declare const travelCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTravelIconSet } from '@clr/angular';
 *
 * loadTravelIconSet();
 * ```
 *
 */
export declare function loadTravelIconSet(): void;
export {};