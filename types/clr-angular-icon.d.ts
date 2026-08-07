import * as i0 from '@angular/core';
import { PipeTransform, Type, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as i2 from '@angular/common';

declare class IconHtmlPipe implements PipeTransform {
    private sanitizer;
    constructor(sanitizer: DomSanitizer);
    transform(value: string): SafeHtml;
    static ɵfac: i0.ɵɵFactoryDeclaration<IconHtmlPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<IconHtmlPipe, "iconHtml", true>;
}

/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class ClrIconCustomTag {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconCustomTag, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIconCustomTag, "clr-icon", never, {}, {}, never, never, false, never>;
}
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class CdsIconCustomTag {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdsIconCustomTag, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdsIconCustomTag, "cds-icon", never, {}, {}, never, never, false, never>;
}

declare const CLR_ICON_DIRECTIVES: Type<any>[];
/** @deprecated since v18 in favor of ClrIcon, remove in v19 */
declare class ClrIconModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIconModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrIconModule, [typeof ClrIconCustomTag, typeof CdsIconCustomTag], [typeof i2.CommonModule], [typeof ClrIconCustomTag, typeof CdsIconCustomTag]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrIconModule>;
}

type IconSvgString = string;
type IconNameString = string;
type IconAliases = string[];
interface IconShapeCollection {
    outline?: IconSvgString;
    solid?: IconSvgString;
    outlineBadged?: IconSvgString;
    outlineAlerted?: IconSvgString;
    solidBadged?: IconSvgString;
    solidAlerted?: IconSvgString;
}
type IconShapeTuple = [IconNameString, IconSvgString | IconShapeCollection];
interface IconShapeSources {
    [key: string]: IconShapeTuple;
}
interface IconRegistrySources {
    [key: string]: IconSvgString | IconShapeCollection;
}
type IconRegistry = Partial<IconRegistrySources>;
type NameOfIconToAlias = string;
type IconAlias = [NameOfIconToAlias, IconAliases];
type Directions = 'up' | 'down' | 'left' | 'right';
type Orientations = 'horizontal' | 'vertical';
type StatusTypes = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

declare class ClrIcon implements OnInit, OnDestroy {
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
    ngOnInit(): void;
    ngOnDestroy(): void;
    updateIcon(): void;
    updateIconSize(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIcon, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrIcon, "clr-icon, cds-icon", never, { "shape": { "alias": "shape"; "required": false; }; "size": { "alias": "size"; "required": false; }; "direction": { "alias": "direction"; "required": false; }; "flip": { "alias": "flip"; "required": false; }; "solid": { "alias": "solid"; "required": false; }; "status": { "alias": "status"; "required": false; }; "inverse": { "alias": "inverse"; "required": false; }; "badge": { "alias": "badge"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_solid: unknown;
    static ngAcceptInputType_inverse: unknown;
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
declare class ClarityIcons {
    /**
     * Returns a readonly reference of the icon registry.
     */
    static get registry(): Readonly<IconRegistry>;
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

declare function renderIcon(shapeOrStringIcon: IconShapeCollection | string): string | IconShapeCollection;

declare const unknownIconName = "unknown";
declare const unknownIcon: IconShapeTuple;

declare const angleIconName = "angle";
declare const angleIcon: IconShapeTuple;

declare const angleDoubleIconName = "angle-double";
declare const angleDoubleIcon: IconShapeTuple;

declare const arrowIconName = "arrow";
declare const arrowIcon: IconShapeTuple;

declare const barsIconName = "bars";
declare const barsIcon: IconShapeTuple;

declare const bellIconName = "bell";
declare const bellIcon: IconShapeTuple;

declare const calendarIconName = "calendar";
declare const calendarIcon: IconShapeTuple;

declare const checkIconName = "check";
declare const checkIcon: IconShapeTuple;

declare const checkCircleIconName = "check-circle";
declare const checkCircleIcon: IconShapeTuple;

declare const cloudIconName = "cloud";
declare const cloudIcon: IconShapeTuple;

declare const cogIconName = "cog";
declare const cogIcon: IconShapeTuple;

declare const ellipsisHorizontalIconName = "ellipsis-horizontal";
declare const ellipsisHorizontalIcon: IconShapeTuple;

declare const ellipsisVerticalIconName = "ellipsis-vertical";
declare const ellipsisVerticalIcon: IconShapeTuple;

declare const errorStandardIconName = "error-standard";
declare const errorStandardIcon: IconShapeTuple;

declare const eventIconName = "event";
declare const eventIcon: IconShapeTuple;

declare const exclamationCircleIconName = "exclamation-circle";
declare const exclamationCircleIcon: IconShapeTuple;

declare const exclamationTriangleIconName = "exclamation-triangle";
declare const exclamationTriangleIcon: IconShapeTuple;

declare const eyeIconName = "eye";
declare const eyeIcon: IconShapeTuple;

declare const eyeHideIconName = "eye-hide";
declare const eyeHideIcon: IconShapeTuple;

declare const filterGridIconName = "filter-grid";
declare const filterGridIcon: IconShapeTuple;

declare const filterGridCircleIconName = "filter-grid-circle";
declare const filterGridCircleIcon: IconShapeTuple;

declare const folderIconName = "folder";
declare const folderIcon: IconShapeTuple;

declare const folderOpenIconName = "folder-open";
declare const folderOpenIcon: IconShapeTuple;

declare const helpInfoIconName = "help-info";
declare const helpInfoIcon: IconShapeTuple;

declare const homeIconName = "home";
declare const homeIcon: IconShapeTuple;

declare const imageIconName = "image";
declare const imageIcon: IconShapeTuple;

declare const infoCircleIconName = "info-circle";
declare const infoCircleIcon: IconShapeTuple;

declare const infoStandardIconName = "info-standard";
declare const infoStandardIcon: IconShapeTuple;

declare const searchIconName = "search";
declare const searchIcon: IconShapeTuple;

declare const stepForward2IconName = "step-forward-2";
declare const stepForward2Icon: IconShapeTuple;

declare const successStandardIconName = "success-standard";
declare const successStandardIcon: IconShapeTuple;

declare const timesIconName = "times";
declare const timesIcon: IconShapeTuple;

declare const unknownStatusIconName = "unknown-status";
declare const unknownStatusIcon: IconShapeTuple;

declare const userIconName = "user";
declare const userIcon: IconShapeTuple;

declare const viewColumnsIconName = "view-columns";
declare const viewColumnsIcon: IconShapeTuple;

declare const vmBugIconName = "vm-bug";
declare const vmBugIcon: IconShapeTuple;

declare const vmBugInverseIconName = "vm-bug-inverse";
declare const vmBugInverseIcon: IconShapeTuple;

declare const warningStandardIconName = "warning-standard";
declare const warningStandardIcon: IconShapeTuple;

declare const detailExpandIconName = "detail-expand";
declare const detailExpandIcon: IconShapeTuple;

declare const detailCollapseIconName = "detail-collapse";
declare const detailCollapseIcon: IconShapeTuple;

declare const accessibility1IconName = "accessibility-1";
declare const accessibility1Icon: IconShapeTuple;

declare const accessibility2IconName = "accessibility-2";
declare const accessibility2Icon: IconShapeTuple;

declare const announcementIconName = "announcement";
declare const announcementIcon: IconShapeTuple;

declare const addTextIconName = "add-text";
declare const addTextIcon: IconShapeTuple;

declare const alarmClockIconName = "alarm-clock";
declare const alarmClockIcon: IconShapeTuple;

declare const alarmOffIconName = "alarm-off";
declare const alarmOffIcon: IconShapeTuple;

declare const asteriskIconName = "asterisk";
declare const asteriskIcon: IconShapeTuple;

declare const banIconName = "ban";
declare const banIcon: IconShapeTuple;

declare const betaIconName = "beta";
declare const betaIcon: IconShapeTuple;

declare const birthdayCakeIconName = "birthday-cake";
declare const birthdayCakeIcon: IconShapeTuple;

declare const boltIconName = "bolt";
declare const boltIcon: IconShapeTuple;

declare const bookIconName = "book";
declare const bookIcon: IconShapeTuple;

declare const briefcaseIconName = "briefcase";
declare const briefcaseIcon: IconShapeTuple;

declare const bubbleExclamationIconName = "bubble-exclamation";
declare const bubbleExclamationIcon: IconShapeTuple;

declare const bugIconName = "bug";
declare const bugIcon: IconShapeTuple;

declare const bullseyeIconName = "bullseye";
declare const bullseyeIcon: IconShapeTuple;

declare const childArrowIconName = "child-arrow";
declare const childArrowIcon: IconShapeTuple;

declare const circleIconName = "circle";
declare const circleIcon: IconShapeTuple;

declare const circleArrowIconName = "circle-arrow";
declare const circleArrowIcon: IconShapeTuple;

declare const clipboardIconName = "clipboard";
declare const clipboardIcon: IconShapeTuple;

declare const clockIconName = "clock";
declare const clockIcon: IconShapeTuple;

declare const cloneIconName = "clone";
declare const cloneIcon: IconShapeTuple;

declare const collapseCardIconName = "collapse-card";
declare const collapseCardIcon: IconShapeTuple;

declare const colorPaletteIconName = "color-palette";
declare const colorPaletteIcon: IconShapeTuple;

declare const colorPickerIconName = "color-picker";
declare const colorPickerIcon: IconShapeTuple;

declare const copyIconName = "copy";
declare const copyIcon: IconShapeTuple;

declare const copyToClipboardIconName = "copy-to-clipboard";
declare const copyToClipboardIcon: IconShapeTuple;

declare const crosshairsIconName = "crosshairs";
declare const crosshairsIcon: IconShapeTuple;

declare const cursorArrowIconName = "cursor-arrow";
declare const cursorArrowIcon: IconShapeTuple;

declare const cursorHandIconName = "cursor-hand";
declare const cursorHandIcon: IconShapeTuple;

declare const cursorHandClickIconName = "cursor-hand-click";
declare const cursorHandClickIcon: IconShapeTuple;

declare const cursorHandGrabIconName = "cursor-hand-grab";
declare const cursorHandGrabIcon: IconShapeTuple;

declare const cursorHandOpenIconName = "cursor-hand-open";
declare const cursorHandOpenIcon: IconShapeTuple;

declare const cursorMoveIconName = "cursor-move";
declare const cursorMoveIcon: IconShapeTuple;

declare const detailsIconName = "details";
declare const detailsIcon: IconShapeTuple;

declare const dotCircleIconName = "dot-circle";
declare const dotCircleIcon: IconShapeTuple;

declare const downloadIconName = "download";
declare const downloadIcon: IconShapeTuple;

declare const dragHandleIconName = "drag-handle";
declare const dragHandleIcon: IconShapeTuple;

declare const dragHandleCornerIconName = "drag-handle-corner";
declare const dragHandleCornerIcon: IconShapeTuple;

declare const eraserIconName = "eraser";
declare const eraserIcon: IconShapeTuple;

declare const expandCardIconName = "expand-card";
declare const expandCardIcon: IconShapeTuple;

declare const fileIconName = "file";
declare const fileIcon: IconShapeTuple;

declare const fileGroupIconName = "file-group";
declare const fileGroupIcon: IconShapeTuple;

declare const fileSettingsIconName = "file-settings";
declare const fileSettingsIcon: IconShapeTuple;

declare const fileZipIconName = "file-zip";
declare const fileZipIcon: IconShapeTuple;

declare const filterIconName = "filter";
declare const filterIcon: IconShapeTuple;

declare const filter2IconName = "filter-2";
declare const filter2Icon: IconShapeTuple;

declare const filterOffIconName = "filter-off";
declare const filterOffIcon: IconShapeTuple;

declare const firewallIconName = "firewall";
declare const firewallIcon: IconShapeTuple;

declare const firstAidIconName = "first-aid";
declare const firstAidIcon: IconShapeTuple;

declare const fishIconName = "fish";
declare const fishIcon: IconShapeTuple;

declare const flameIconName = "flame";
declare const flameIcon: IconShapeTuple;

declare const formIconName = "form";
declare const formIcon: IconShapeTuple;

declare const fuelIconName = "fuel";
declare const fuelIcon: IconShapeTuple;

declare const gavelIconName = "gavel";
declare const gavelIcon: IconShapeTuple;

declare const gridViewIconName = "grid-view";
declare const gridViewIcon: IconShapeTuple;

declare const helpIconName = "help";
declare const helpIcon: IconShapeTuple;

declare const historyIconName = "history";
declare const historyIcon: IconShapeTuple;

declare const hourglassIconName = "hourglass";
declare const hourglassIcon: IconShapeTuple;

declare const idBadgeIconName = "id-badge";
declare const idBadgeIcon: IconShapeTuple;

declare const keyIconName = "key";
declare const keyIcon: IconShapeTuple;

declare const landscapeIconName = "landscape";
declare const landscapeIcon: IconShapeTuple;

declare const launchpadIconName = "launchpad";
declare const launchpadIcon: IconShapeTuple;

declare const libraryIconName = "library";
declare const libraryIcon: IconShapeTuple;

declare const lightbulbIconName = "lightbulb";
declare const lightbulbIcon: IconShapeTuple;

declare const listIconName = "list";
declare const listIcon: IconShapeTuple;

declare const lockIconName = "lock";
declare const lockIcon: IconShapeTuple;

declare const loginIconName = "login";
declare const loginIcon: IconShapeTuple;

declare const logoutIconName = "logout";
declare const logoutIcon: IconShapeTuple;

declare const minusIconName = "minus";
declare const minusIcon: IconShapeTuple;

declare const minusCircleIconName = "minus-circle";
declare const minusCircleIcon: IconShapeTuple;

declare const moonIconName = "moon";
declare const moonIcon: IconShapeTuple;

declare const newIconName = "new";
declare const newIcon: IconShapeTuple;

declare const noAccessIconName = "no-access";
declare const noAccessIcon: IconShapeTuple;

declare const noteIconName = "note";
declare const noteIcon: IconShapeTuple;

declare const objectsIconName = "objects";
declare const objectsIcon: IconShapeTuple;

declare const organizationIconName = "organization";
declare const organizationIcon: IconShapeTuple;

declare const paperclipIconName = "paperclip";
declare const paperclipIcon: IconShapeTuple;

declare const pasteIconName = "paste";
declare const pasteIcon: IconShapeTuple;

declare const pencilIconName = "pencil";
declare const pencilIcon: IconShapeTuple;

declare const pinIconName = "pin";
declare const pinIcon: IconShapeTuple;

declare const pinboardIconName = "pinboard";
declare const pinboardIcon: IconShapeTuple;

declare const plusIconName = "plus";
declare const plusIcon: IconShapeTuple;

declare const plusCircleIconName = "plus-circle";
declare const plusCircleIcon: IconShapeTuple;

declare const popOutIconName = "pop-out";
declare const popOutIcon: IconShapeTuple;

declare const portraitIconName = "portrait";
declare const portraitIcon: IconShapeTuple;

declare const printerIconName = "printer";
declare const printerIcon: IconShapeTuple;

declare const recycleIconName = "recycle";
declare const recycleIcon: IconShapeTuple;

declare const redoIconName = "redo";
declare const redoIcon: IconShapeTuple;

declare const refreshIconName = "refresh";
declare const refreshIcon: IconShapeTuple;

declare const repeatIconName = "repeat";
declare const repeatIcon: IconShapeTuple;

declare const resizeIconName = "resize";
declare const resizeIcon: IconShapeTuple;

declare const scissorsIconName = "scissors";
declare const scissorsIcon: IconShapeTuple;

declare const scrollIconName = "scroll";
declare const scrollIcon: IconShapeTuple;

declare const shrinkIconName = "shrink";
declare const shrinkIcon: IconShapeTuple;

declare const sliderIconName = "slider";
declare const sliderIcon: IconShapeTuple;

declare const snowflakeIconName = "snowflake";
declare const snowflakeIcon: IconShapeTuple;

declare const sortByIconName = "sort-by";
declare const sortByIcon: IconShapeTuple;

declare const sunIconName = "sun";
declare const sunIcon: IconShapeTuple;

declare const switchIconName = "switch";
declare const switchIcon: IconShapeTuple;

declare const syncIconName = "sync";
declare const syncIcon: IconShapeTuple;

declare const tableIconName = "table";
declare const tableIcon: IconShapeTuple;

declare const tagIconName = "tag";
declare const tagIcon: IconShapeTuple;

declare const tagsIconName = "tags";
declare const tagsIcon: IconShapeTuple;

declare const targetIconName = "target";
declare const targetIcon: IconShapeTuple;

declare const thermometerIconName = "thermometer";
declare const thermometerIcon: IconShapeTuple;

declare const timelineIconName = "timeline";
declare const timelineIcon: IconShapeTuple;

declare const timesCircleIconName = "times-circle";
declare const timesCircleIcon: IconShapeTuple;

declare const toolsIconName = "tools";
declare const toolsIcon: IconShapeTuple;

declare const trashIconName = "trash";
declare const trashIcon: IconShapeTuple;

declare const treeIconName = "tree";
declare const treeIcon: IconShapeTuple;

declare const treeViewIconName = "tree-view";
declare const treeViewIcon: IconShapeTuple;

declare const twoWayArrowsIconName = "two-way-arrows";
declare const twoWayArrowsIcon: IconShapeTuple;

declare const undoIconName = "undo";
declare const undoIcon: IconShapeTuple;

declare const unpinIconName = "unpin";
declare const unpinIcon: IconShapeTuple;

declare const unlockIconName = "unlock";
declare const unlockIcon: IconShapeTuple;

declare const uploadIconName = "upload";
declare const uploadIcon: IconShapeTuple;

declare const usersIconName = "users";
declare const usersIcon: IconShapeTuple;

declare const viewCardsIconName = "view-cards";
declare const viewCardsIcon: IconShapeTuple;

declare const viewListIconName = "view-list";
declare const viewListIcon: IconShapeTuple;

declare const volumeIconName = "volume";
declare const volumeIcon: IconShapeTuple;

declare const wandIconName = "wand";
declare const wandIcon: IconShapeTuple;

declare const windowCloseIconName = "window-close";
declare const windowCloseIcon: IconShapeTuple;

declare const windowMaxIconName = "window-max";
declare const windowMaxIcon: IconShapeTuple;

declare const windowMinIconName = "window-min";
declare const windowMinIcon: IconShapeTuple;

declare const windowRestoreIconName = "window-restore";
declare const windowRestoreIcon: IconShapeTuple;

declare const worldIconName = "world";
declare const worldIcon: IconShapeTuple;

declare const wrenchIconName = "wrench";
declare const wrenchIcon: IconShapeTuple;

declare const zoomInIconName = "zoom-in";
declare const zoomInIcon: IconShapeTuple;

declare const zoomOutIconName = "zoom-out";
declare const zoomOutIcon: IconShapeTuple;

declare const axisChartIconName = "axis-chart";
declare const axisChartIcon: IconShapeTuple;

declare const barChartIconName = "bar-chart";
declare const barChartIcon: IconShapeTuple;

declare const bellCurveIconName = "bell-curve";
declare const bellCurveIcon: IconShapeTuple;

declare const boxPlotIconName = "box-plot";
declare const boxPlotIcon: IconShapeTuple;

declare const bubbleChartIconName = "bubble-chart";
declare const bubbleChartIcon: IconShapeTuple;

declare const cloudChartIconName = "cloud-chart";
declare const cloudChartIcon: IconShapeTuple;

declare const curveChartIconName = "curve-chart";
declare const curveChartIcon: IconShapeTuple;

declare const gridChartIconName = "grid-chart";
declare const gridChartIcon: IconShapeTuple;

declare const heatMapIconName = "heat-map";
declare const heatMapIcon: IconShapeTuple;

declare const lineChartIconName = "line-chart";
declare const lineChartIcon: IconShapeTuple;

declare const pieChartIconName = "pie-chart";
declare const pieChartIcon: IconShapeTuple;

declare const scatterPlotIconName = "scatter-plot";
declare const scatterPlotIcon: IconShapeTuple;

declare const tickChartIconName = "tick-chart";
declare const tickChartIcon: IconShapeTuple;

declare const bankIconName = "bank";
declare const bankIcon: IconShapeTuple;

declare const bitcoinIconName = "bitcoin";
declare const bitcoinIcon: IconShapeTuple;

declare const calculatorIconName = "calculator";
declare const calculatorIcon: IconShapeTuple;

declare const coinBagIconName = "coin-bag";
declare const coinBagIcon: IconShapeTuple;

declare const creditCardIconName = "credit-card";
declare const creditCardIcon: IconShapeTuple;

declare const dollarIconName = "dollar";
declare const dollarIcon: IconShapeTuple;

declare const dollarBillIconName = "dollar-bill";
declare const dollarBillIcon: IconShapeTuple;

declare const eCheckIconName = "e-check";
declare const eCheckIcon: IconShapeTuple;

declare const employeeIconName = "employee";
declare const employeeIcon: IconShapeTuple;

declare const employeeGroupIconName = "employee-group";
declare const employeeGroupIcon: IconShapeTuple;

declare const euroIconName = "euro";
declare const euroIcon: IconShapeTuple;

declare const factoryIconName = "factory";
declare const factoryIcon: IconShapeTuple;

declare const pesoIconName = "peso";
declare const pesoIcon: IconShapeTuple;

declare const piggyBankIconName = "piggy-bank";
declare const piggyBankIcon: IconShapeTuple;

declare const poundIconName = "pound";
declare const poundIcon: IconShapeTuple;

declare const rubleIconName = "ruble";
declare const rubleIcon: IconShapeTuple;

declare const rupeeIconName = "rupee";
declare const rupeeIcon: IconShapeTuple;

declare const shoppingBagIconName = "shopping-bag";
declare const shoppingBagIcon: IconShapeTuple;

declare const shoppingCartIconName = "shopping-cart";
declare const shoppingCartIcon: IconShapeTuple;

declare const storeIconName = "store";
declare const storeIcon: IconShapeTuple;

declare const walletIconName = "wallet";
declare const walletIcon: IconShapeTuple;

declare const wonIconName = "won";
declare const wonIcon: IconShapeTuple;

declare const yenIconName = "yen";
declare const yenIcon: IconShapeTuple;

declare const cameraIconName = "camera";
declare const cameraIcon: IconShapeTuple;

declare const fastForwardIconName = "fast-forward";
declare const fastForwardIcon: IconShapeTuple;

declare const filmStripIconName = "film-strip";
declare const filmStripIcon: IconShapeTuple;

declare const headphonesIconName = "headphones";
declare const headphonesIcon: IconShapeTuple;

declare const imageGalleryIconName = "image-gallery";
declare const imageGalleryIcon: IconShapeTuple;

declare const microphoneIconName = "microphone";
declare const microphoneIcon: IconShapeTuple;

declare const microphoneMuteIconName = "microphone-mute";
declare const microphoneMuteIcon: IconShapeTuple;

declare const musicNoteIconName = "music-note";
declare const musicNoteIcon: IconShapeTuple;

declare const pauseIconName = "pause";
declare const pauseIcon: IconShapeTuple;

declare const playIconName = "play";
declare const playIcon: IconShapeTuple;

declare const powerIconName = "power";
declare const powerIcon: IconShapeTuple;

declare const replayAllIconName = "replay-all";
declare const replayAllIcon: IconShapeTuple;

declare const replayOneIconName = "replay-one";
declare const replayOneIcon: IconShapeTuple;

declare const rewindIconName = "rewind";
declare const rewindIcon: IconShapeTuple;

declare const shuffleIconName = "shuffle";
declare const shuffleIcon: IconShapeTuple;

declare const stepForwardIconName = "step-forward";
declare const stepForwardIcon: IconShapeTuple;

declare const stopIconName = "stop";
declare const stopIcon: IconShapeTuple;

declare const videoCameraIconName = "video-camera";
declare const videoCameraIcon: IconShapeTuple;

declare const videoGalleryIconName = "video-gallery";
declare const videoGalleryIcon: IconShapeTuple;

declare const volumeDownIconName = "volume-down";
declare const volumeDownIcon: IconShapeTuple;

declare const volumeMuteIconName = "volume-mute";
declare const volumeMuteIcon: IconShapeTuple;

declare const volumeUpIconName = "volume-up";
declare const volumeUpIcon: IconShapeTuple;

declare const arrowMiniIconName = "arrow-mini";
declare const arrowMiniIcon: IconShapeTuple;

declare const calendarMiniIconName = "calendar-mini";
declare const calendarMiniIcon: IconShapeTuple;

declare const checkCircleMiniIconName = "check-circle-mini";
declare const checkCircleMiniIcon: IconShapeTuple;

declare const checkMiniIconName = "check-mini";
declare const checkMiniIcon: IconShapeTuple;

declare const errorMiniIconName = "error-mini";
declare const errorMiniIcon: IconShapeTuple;

declare const eventMiniIconName = "event-mini";
declare const eventMiniIcon: IconShapeTuple;

declare const filterGridCircleMiniIconName = "filter-grid-circle-mini";
declare const filterGridCircleMiniIcon: IconShapeTuple;

declare const filterGridMiniIconName = "filter-grid-mini";
declare const filterGridMiniIcon: IconShapeTuple;

declare const infoCircleMiniIconName = "info-circle-mini";
declare const infoCircleMiniIcon: IconShapeTuple;

declare const timesMiniIconName = "times-mini";
declare const timesMiniIcon: IconShapeTuple;

declare const warningMiniIconName = "warning-mini";
declare const warningMiniIcon: IconShapeTuple;

declare const administratorIconName = "administrator";
declare const administratorIcon: IconShapeTuple;

declare const animationIconName = "animation";
declare const animationIcon: IconShapeTuple;

declare const applicationIconName = "application";
declare const applicationIcon: IconShapeTuple;

declare const applicationsIconName = "applications";
declare const applicationsIcon: IconShapeTuple;

declare const archiveIconName = "archive";
declare const archiveIcon: IconShapeTuple;

declare const assignUserIconName = "assign-user";
declare const assignUserIcon: IconShapeTuple;

declare const atomIconName = "atom";
declare const atomIcon: IconShapeTuple;

declare const backupIconName = "backup";
declare const backupIcon: IconShapeTuple;

declare const backupRestoreIconName = "backup-restore";
declare const backupRestoreIcon: IconShapeTuple;

declare const barCodeIconName = "bar-code";
declare const barCodeIcon: IconShapeTuple;

declare const batteryIconName = "battery";
declare const batteryIcon: IconShapeTuple;

declare const blockIconName = "block";
declare const blockIcon: IconShapeTuple;

declare const blocksGroupIconName = "blocks-group";
declare const blocksGroupIcon: IconShapeTuple;

declare const bluetoothIconName = "bluetooth";
declare const bluetoothIcon: IconShapeTuple;

declare const bluetoothOffIconName = "bluetooth-off";
declare const bluetoothOffIcon: IconShapeTuple;

declare const buildingIconName = "building";
declare const buildingIcon: IconShapeTuple;

declare const bundleIconName = "bundle";
declare const bundleIcon: IconShapeTuple;

declare const capacitorIconName = "capacitor";
declare const capacitorIcon: IconShapeTuple;

declare const cdDvdIconName = "cd-dvd";
declare const cdDvdIcon: IconShapeTuple;

declare const certificateIconName = "certificate";
declare const certificateIcon: IconShapeTuple;

declare const ciCdIconName = "ci-cd";
declare const ciCdIcon: IconShapeTuple;

declare const cloudNetworkIconName = "cloud-network";
declare const cloudNetworkIcon: IconShapeTuple;

declare const cloudScaleIconName = "cloud-scale";
declare const cloudScaleIcon: IconShapeTuple;

declare const cloudTrafficIconName = "cloud-traffic";
declare const cloudTrafficIcon: IconShapeTuple;

declare const clusterIconName = "cluster";
declare const clusterIcon: IconShapeTuple;

declare const codeIconName = "code";
declare const codeIcon: IconShapeTuple;

declare const computerIconName = "computer";
declare const computerIcon: IconShapeTuple;

declare const connectIconName = "connect";
declare const connectIcon: IconShapeTuple;

declare const containerIconName = "container";
declare const containerIcon: IconShapeTuple;

declare const containerGroupIconName = "container-group";
declare const containerGroupIcon: IconShapeTuple;

declare const containerVolumeIconName = "container-volume";
declare const containerVolumeIcon: IconShapeTuple;

declare const controlLunIconName = "control-lun";
declare const controlLunIcon: IconShapeTuple;

declare const cpuIconName = "cpu";
declare const cpuIcon: IconShapeTuple;

declare const dashboardIconName = "dashboard";
declare const dashboardIcon: IconShapeTuple;

declare const dataClusterIconName = "data-cluster";
declare const dataClusterIcon: IconShapeTuple;

declare const deployIconName = "deploy";
declare const deployIcon: IconShapeTuple;

declare const devicesIconName = "devices";
declare const devicesIcon: IconShapeTuple;

declare const digitalSignatureIconName = "digital-signature";
declare const digitalSignatureIcon: IconShapeTuple;

declare const disconnectIconName = "disconnect";
declare const disconnectIcon: IconShapeTuple;

declare const displayIconName = "display";
declare const displayIcon: IconShapeTuple;

declare const downloadCloudIconName = "download-cloud";
declare const downloadCloudIcon: IconShapeTuple;

declare const exportIconName = "export";
declare const exportIcon: IconShapeTuple;

declare const fileShare2IconName = "file-share-2";
declare const fileShare2Icon: IconShapeTuple;

declare const fileShareIconName = "file-share";
declare const fileShareIcon: IconShapeTuple;

declare const flaskIconName = "flask";
declare const flaskIcon: IconShapeTuple;

declare const floppyIconName = "floppy";
declare const floppyIcon: IconShapeTuple;

declare const forkingIconName = "forking";
declare const forkingIcon: IconShapeTuple;

declare const hardDiskIconName = "hard-disk";
declare const hardDiskIcon: IconShapeTuple;

declare const hardDriveDisksIconName = "hard-drive-disks";
declare const hardDriveDisksIcon: IconShapeTuple;

declare const hardDriveIconName = "hard-drive";
declare const hardDriveIcon: IconShapeTuple;

declare const helixIconName = "helix";
declare const helixIcon: IconShapeTuple;

declare const hostGroupIconName = "host-group";
declare const hostGroupIcon: IconShapeTuple;

declare const hostIconName = "host";
declare const hostIcon: IconShapeTuple;

declare const importIconName = "import";
declare const importIcon: IconShapeTuple;

declare const inductorIconName = "inductor";
declare const inductorIcon: IconShapeTuple;

declare const installIconName = "install";
declare const installIcon: IconShapeTuple;

declare const internetOfThingsIconName = "internet-of-things";
declare const internetOfThingsIcon: IconShapeTuple;

declare const keyboardIconName = "keyboard";
declare const keyboardIcon: IconShapeTuple;

declare const layersIconName = "layers";
declare const layersIcon: IconShapeTuple;

declare const linkIconName = "link";
declare const linkIcon: IconShapeTuple;

declare const mediaChangerIconName = "media-changer";
declare const mediaChangerIcon: IconShapeTuple;

declare const memoryIconName = "memory";
declare const memoryIcon: IconShapeTuple;

declare const mobileIconName = "mobile";
declare const mobileIcon: IconShapeTuple;

declare const mouseIconName = "mouse";
declare const mouseIcon: IconShapeTuple;

declare const namespaceIconName = "namespace";
declare const namespaceIcon: IconShapeTuple;

declare const networkGlobeIconName = "network-globe";
declare const networkGlobeIcon: IconShapeTuple;

declare const networkSettingsIconName = "network-settings";
declare const networkSettingsIcon: IconShapeTuple;

declare const networkSwitchIconName = "network-switch";
declare const networkSwitchIcon: IconShapeTuple;

declare const nodeGroupIconName = "node-group";
declare const nodeGroupIcon: IconShapeTuple;

declare const nodeIconName = "node";
declare const nodeIcon: IconShapeTuple;

declare const nodesIconName = "nodes";
declare const nodesIcon: IconShapeTuple;

declare const noWifiIconName = "no-wifi";
declare const noWifiIcon: IconShapeTuple;

declare const nvmeIconName = "nvme";
declare const nvmeIcon: IconShapeTuple;

declare const pdfFileIconName = "pdf-file";
declare const pdfFileIcon: IconShapeTuple;

declare const phoneHandsetIconName = "phone-handset";
declare const phoneHandsetIcon: IconShapeTuple;

declare const pluginIconName = "plugin";
declare const pluginIcon: IconShapeTuple;

declare const podIconName = "pod";
declare const podIcon: IconShapeTuple;

declare const processOnVmIconName = "process-on-vm";
declare const processOnVmIcon: IconShapeTuple;

declare const qrCodeIconName = "qr-code";
declare const qrCodeIcon: IconShapeTuple;

declare const rackServerIconName = "rack-server";
declare const rackServerIcon: IconShapeTuple;

declare const radarIconName = "radar";
declare const radarIcon: IconShapeTuple;

declare const resistorIconName = "resistor";
declare const resistorIcon: IconShapeTuple;

declare const resourcePoolIconName = "resource-pool";
declare const resourcePoolIcon: IconShapeTuple;

declare const routerIconName = "router";
declare const routerIcon: IconShapeTuple;

declare const rulerPencilIconName = "ruler-pencil";
declare const rulerPencilIcon: IconShapeTuple;

declare const scriptExecuteIconName = "script-execute";
declare const scriptExecuteIcon: IconShapeTuple;

declare const scriptScheduleIconName = "script-schedule";
declare const scriptScheduleIcon: IconShapeTuple;

declare const shieldCheckIconName = "shield-check";
declare const shieldCheckIcon: IconShapeTuple;

declare const shieldIconName = "shield";
declare const shieldIcon: IconShapeTuple;

declare const shieldXIconName = "shield-x";
declare const shieldXIcon: IconShapeTuple;

declare const squidIconName = "squid";
declare const squidIcon: IconShapeTuple;

declare const ssdIconName = "ssd";
declare const ssdIcon: IconShapeTuple;

declare const storageAdapterIconName = "storage-adapter";
declare const storageAdapterIcon: IconShapeTuple;

declare const storageIconName = "storage";
declare const storageIcon: IconShapeTuple;

declare const tabletIconName = "tablet";
declare const tabletIcon: IconShapeTuple;

declare const tapeDriveIconName = "tape-drive";
declare const tapeDriveIcon: IconShapeTuple;

declare const terminalIconName = "terminal";
declare const terminalIcon: IconShapeTuple;

declare const thinClientIconName = "thin-client";
declare const thinClientIcon: IconShapeTuple;

declare const unarchiveIconName = "unarchive";
declare const unarchiveIcon: IconShapeTuple;

declare const uninstallIconName = "uninstall";
declare const uninstallIcon: IconShapeTuple;

declare const unlinkIconName = "unlink";
declare const unlinkIcon: IconShapeTuple;

declare const updateIconName = "update";
declare const updateIcon: IconShapeTuple;

declare const uploadCloudIconName = "upload-cloud";
declare const uploadCloudIcon: IconShapeTuple;

declare const usbIconName = "usb";
declare const usbIcon: IconShapeTuple;

declare const vmIconName = "vm";
declare const vmIcon: IconShapeTuple;

declare const vmwAppIconName = "vmw-app";
declare const vmwAppIcon: IconShapeTuple;

declare const wifiIconName = "wifi";
declare const wifiIcon: IconShapeTuple;

declare const xlsFileIconName = "xls-file";
declare const xlsFileIcon: IconShapeTuple;

declare const bookmarkIconName = "bookmark";
declare const bookmarkIcon: IconShapeTuple;

declare const chatBubbleIconName = "chat-bubble";
declare const chatBubbleIcon: IconShapeTuple;

declare const contractIconName = "contract";
declare const contractIcon: IconShapeTuple;

declare const crownIconName = "crown";
declare const crownIcon: IconShapeTuple;

declare const envelopeIconName = "envelope";
declare const envelopeIcon: IconShapeTuple;

declare const flagIconName = "flag";
declare const flagIcon: IconShapeTuple;

declare const halfStarIconName = "half-star";
declare const halfStarIcon: IconShapeTuple;

declare const happyFaceIconName = "happy-face";
declare const happyFaceIcon: IconShapeTuple;

declare const hashtagIconName = "hashtag";
declare const hashtagIcon: IconShapeTuple;

declare const heartIconName = "heart";
declare const heartIcon: IconShapeTuple;

declare const heartBrokenIconName = "heart-broken";
declare const heartBrokenIcon: IconShapeTuple;

declare const inboxIconName = "inbox";
declare const inboxIcon: IconShapeTuple;

declare const neutralFaceIconName = "neutral-face";
declare const neutralFaceIcon: IconShapeTuple;

declare const pictureIconName = "picture";
declare const pictureIcon: IconShapeTuple;

declare const sadFaceIconName = "sad-face";
declare const sadFaceIcon: IconShapeTuple;

declare const shareIconName = "share";
declare const shareIcon: IconShapeTuple;

declare const starIconName = "star";
declare const starIcon: IconShapeTuple;

declare const talkBubblesIconName = "talk-bubbles";
declare const talkBubblesIcon: IconShapeTuple;

declare const tasksIconName = "tasks";
declare const tasksIcon: IconShapeTuple;

declare const thumbsDownIconName = "thumbs-down";
declare const thumbsDownIcon: IconShapeTuple;

declare const thumbsUpIconName = "thumbs-up";
declare const thumbsUpIcon: IconShapeTuple;

declare const alignBottomIconName = "align-bottom";
declare const alignBottomIcon: IconShapeTuple;

declare const alignCenterIconName = "align-center";
declare const alignCenterIcon: IconShapeTuple;

declare const alignLeftIconName = "align-left";
declare const alignLeftIcon: IconShapeTuple;

declare const alignLeftTextIconName = "align-left-text";
declare const alignLeftTextIcon: IconShapeTuple;

declare const alignMiddleIconName = "align-middle";
declare const alignMiddleIcon: IconShapeTuple;

declare const alignRightIconName = "align-right";
declare const alignRightIcon: IconShapeTuple;

declare const alignRightTextIconName = "align-right-text";
declare const alignRightTextIcon: IconShapeTuple;

declare const alignTopIconName = "align-top";
declare const alignTopIcon: IconShapeTuple;

declare const blockQuoteIconName = "block-quote";
declare const blockQuoteIcon: IconShapeTuple;

declare const boldIconName = "bold";
declare const boldIcon: IconShapeTuple;

declare const bulletListIconName = "bullet-list";
declare const bulletListIcon: IconShapeTuple;

declare const centerTextIconName = "center-text";
declare const centerTextIcon: IconShapeTuple;

declare const checkboxListIconName = "checkbox-list";
declare const checkboxListIcon: IconShapeTuple;

declare const fontSizeIconName = "font-size";
declare const fontSizeIcon: IconShapeTuple;

declare const highlighterIconName = "highlighter";
declare const highlighterIcon: IconShapeTuple;

declare const indentIconName = "indent";
declare const indentIcon: IconShapeTuple;

declare const italicIconName = "italic";
declare const italicIcon: IconShapeTuple;

declare const justifyTextIconName = "justify-text";
declare const justifyTextIcon: IconShapeTuple;

declare const languageIconName = "language";
declare const languageIcon: IconShapeTuple;

declare const numberListIconName = "number-list";
declare const numberListIcon: IconShapeTuple;

declare const outdentIconName = "outdent";
declare const outdentIcon: IconShapeTuple;

declare const paintRollerIconName = "paint-roller";
declare const paintRollerIcon: IconShapeTuple;

declare const strikethroughIconName = "strikethrough";
declare const strikethroughIcon: IconShapeTuple;

declare const subscriptIconName = "subscript";
declare const subscriptIcon: IconShapeTuple;

declare const superscriptIconName = "superscript";
declare const superscriptIcon: IconShapeTuple;

declare const textIconName = "text";
declare const textIcon: IconShapeTuple;

declare const textColorIconName = "text-color";
declare const textColorIcon: IconShapeTuple;

declare const underlineIconName = "underline";
declare const underlineIcon: IconShapeTuple;

declare const airplaneIconName = "airplane";
declare const airplaneIcon: IconShapeTuple;

declare const bicycleIconName = "bicycle";
declare const bicycleIcon: IconShapeTuple;

declare const boatIconName = "boat";
declare const boatIcon: IconShapeTuple;

declare const campervanIconName = "campervan";
declare const campervanIcon: IconShapeTuple;

declare const carIconName = "car";
declare const carIcon: IconShapeTuple;

declare const caravanIconName = "caravan";
declare const caravanIcon: IconShapeTuple;

declare const compassIconName = "compass";
declare const compassIcon: IconShapeTuple;

declare const ferryIconName = "ferry";
declare const ferryIcon: IconShapeTuple;

declare const mapIconName = "map";
declare const mapIcon: IconShapeTuple;

declare const mapMarkerIconName = "map-marker";
declare const mapMarkerIcon: IconShapeTuple;

declare const onHolidayIconName = "on-holiday";
declare const onHolidayIcon: IconShapeTuple;

declare const trailerIconName = "trailer";
declare const trailerIcon: IconShapeTuple;

declare const truckIconName = "truck";
declare const truckIcon: IconShapeTuple;

declare const chartCollectionIcons: IconShapeTuple[];
declare const chartCollectionAliases: IconAlias[];
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
declare function loadChartIconSet(): void;

declare const commerceCollectionIcons: IconShapeTuple[];
declare const commerceCollectionAliases: IconAlias[];
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
declare function loadCommerceIconSet(): void;

declare const coreCollectionIcons: IconShapeTuple[];
declare const coreCollectionAliases: IconAlias[];
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
declare function loadCoreIconSet(): void;

declare const essentialCollectionIcons: IconShapeTuple[];
declare const essentialCollectionAliases: IconAlias[];
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
declare function loadEssentialIconSet(): void;

declare const mediaCollectionIcons: IconShapeTuple[];
declare const mediaCollectionAliases: IconAlias[];
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
declare function loadMediaIconSet(): void;

declare const miniCollectionIcons: IconShapeTuple[];
declare const miniCollectionAliases: IconAlias[];
/**
 * Function that can be called to load the mini icon set.
 *
 * ```typescript@clr/angular';
 *
 * loadMiniIconSet();
 * ```
 *
 */
declare function loadMiniIconSet(): void;

declare const technologyCollectionIcons: IconShapeTuple[];
declare const technologyCollectionAliases: IconAlias[];
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
declare function loadTechnologyIconSet(): void;

declare const socialCollectionIcons: IconShapeTuple[];
declare const socialCollectionAliases: IconAlias[];
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
declare function loadSocialIconSet(): void;

declare const textEditCollectionIcons: IconShapeTuple[];
declare const textEditCollectionAliases: IconAlias[];
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
declare function loadTextEditIconSet(): void;

declare const travelCollectionIcons: IconShapeTuple[];
declare const travelCollectionAliases: IconAlias[];
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
declare function loadTravelIconSet(): void;

export { CLR_ICON_DIRECTIVES, CdsIconCustomTag, ClarityIcons, ClrIcon, ClrIconCustomTag, ClrIconModule, IconHtmlPipe, accessibility1Icon, accessibility1IconName, accessibility2Icon, accessibility2IconName, addTextIcon, addTextIconName, administratorIcon, administratorIconName, airplaneIcon, airplaneIconName, alarmClockIcon, alarmClockIconName, alarmOffIcon, alarmOffIconName, alignBottomIcon, alignBottomIconName, alignCenterIcon, alignCenterIconName, alignLeftIcon, alignLeftIconName, alignLeftTextIcon, alignLeftTextIconName, alignMiddleIcon, alignMiddleIconName, alignRightIcon, alignRightIconName, alignRightTextIcon, alignRightTextIconName, alignTopIcon, alignTopIconName, angleDoubleIcon, angleDoubleIconName, angleIcon, angleIconName, animationIcon, animationIconName, announcementIcon, announcementIconName, applicationIcon, applicationIconName, applicationsIcon, applicationsIconName, archiveIcon, archiveIconName, arrowIcon, arrowIconName, arrowMiniIcon, arrowMiniIconName, assignUserIcon, assignUserIconName, asteriskIcon, asteriskIconName, atomIcon, atomIconName, axisChartIcon, axisChartIconName, backupIcon, backupIconName, backupRestoreIcon, backupRestoreIconName, banIcon, banIconName, bankIcon, bankIconName, barChartIcon, barChartIconName, barCodeIcon, barCodeIconName, barsIcon, barsIconName, batteryIcon, batteryIconName, bellCurveIcon, bellCurveIconName, bellIcon, bellIconName, betaIcon, betaIconName, bicycleIcon, bicycleIconName, birthdayCakeIcon, birthdayCakeIconName, bitcoinIcon, bitcoinIconName, blockIcon, blockIconName, blockQuoteIcon, blockQuoteIconName, blocksGroupIcon, blocksGroupIconName, bluetoothIcon, bluetoothIconName, bluetoothOffIcon, bluetoothOffIconName, boatIcon, boatIconName, boldIcon, boldIconName, boltIcon, boltIconName, bookIcon, bookIconName, bookmarkIcon, bookmarkIconName, boxPlotIcon, boxPlotIconName, briefcaseIcon, briefcaseIconName, bubbleChartIcon, bubbleChartIconName, bubbleExclamationIcon, bubbleExclamationIconName, bugIcon, bugIconName, buildingIcon, buildingIconName, bulletListIcon, bulletListIconName, bullseyeIcon, bullseyeIconName, bundleIcon, bundleIconName, calculatorIcon, calculatorIconName, calendarIcon, calendarIconName, calendarMiniIcon, calendarMiniIconName, cameraIcon, cameraIconName, campervanIcon, campervanIconName, capacitorIcon, capacitorIconName, carIcon, carIconName, caravanIcon, caravanIconName, cdDvdIcon, cdDvdIconName, centerTextIcon, centerTextIconName, certificateIcon, certificateIconName, chartCollectionAliases, chartCollectionIcons, chatBubbleIcon, chatBubbleIconName, checkCircleIcon, checkCircleIconName, checkCircleMiniIcon, checkCircleMiniIconName, checkIcon, checkIconName, checkMiniIcon, checkMiniIconName, checkboxListIcon, checkboxListIconName, childArrowIcon, childArrowIconName, ciCdIcon, ciCdIconName, circleArrowIcon, circleArrowIconName, circleIcon, circleIconName, clipboardIcon, clipboardIconName, clockIcon, clockIconName, cloneIcon, cloneIconName, cloudChartIcon, cloudChartIconName, cloudIcon, cloudIconName, cloudNetworkIcon, cloudNetworkIconName, cloudScaleIcon, cloudScaleIconName, cloudTrafficIcon, cloudTrafficIconName, clusterIcon, clusterIconName, codeIcon, codeIconName, cogIcon, cogIconName, coinBagIcon, coinBagIconName, collapseCardIcon, collapseCardIconName, colorPaletteIcon, colorPaletteIconName, colorPickerIcon, colorPickerIconName, commerceCollectionAliases, commerceCollectionIcons, compassIcon, compassIconName, computerIcon, computerIconName, connectIcon, connectIconName, containerGroupIcon, containerGroupIconName, containerIcon, containerIconName, containerVolumeIcon, containerVolumeIconName, contractIcon, contractIconName, controlLunIcon, controlLunIconName, copyIcon, copyIconName, copyToClipboardIcon, copyToClipboardIconName, coreCollectionAliases, coreCollectionIcons, cpuIcon, cpuIconName, creditCardIcon, creditCardIconName, crosshairsIcon, crosshairsIconName, crownIcon, crownIconName, cursorArrowIcon, cursorArrowIconName, cursorHandClickIcon, cursorHandClickIconName, cursorHandGrabIcon, cursorHandGrabIconName, cursorHandIcon, cursorHandIconName, cursorHandOpenIcon, cursorHandOpenIconName, cursorMoveIcon, cursorMoveIconName, curveChartIcon, curveChartIconName, dashboardIcon, dashboardIconName, dataClusterIcon, dataClusterIconName, deployIcon, deployIconName, detailCollapseIcon, detailCollapseIconName, detailExpandIcon, detailExpandIconName, detailsIcon, detailsIconName, devicesIcon, devicesIconName, digitalSignatureIcon, digitalSignatureIconName, disconnectIcon, disconnectIconName, displayIcon, displayIconName, dollarBillIcon, dollarBillIconName, dollarIcon, dollarIconName, dotCircleIcon, dotCircleIconName, downloadCloudIcon, downloadCloudIconName, downloadIcon, downloadIconName, dragHandleCornerIcon, dragHandleCornerIconName, dragHandleIcon, dragHandleIconName, eCheckIcon, eCheckIconName, ellipsisHorizontalIcon, ellipsisHorizontalIconName, ellipsisVerticalIcon, ellipsisVerticalIconName, employeeGroupIcon, employeeGroupIconName, employeeIcon, employeeIconName, envelopeIcon, envelopeIconName, eraserIcon, eraserIconName, errorMiniIcon, errorMiniIconName, errorStandardIcon, errorStandardIconName, essentialCollectionAliases, essentialCollectionIcons, euroIcon, euroIconName, eventIcon, eventIconName, eventMiniIcon, eventMiniIconName, exclamationCircleIcon, exclamationCircleIconName, exclamationTriangleIcon, exclamationTriangleIconName, expandCardIcon, expandCardIconName, exportIcon, exportIconName, eyeHideIcon, eyeHideIconName, eyeIcon, eyeIconName, factoryIcon, factoryIconName, fastForwardIcon, fastForwardIconName, ferryIcon, ferryIconName, fileGroupIcon, fileGroupIconName, fileIcon, fileIconName, fileSettingsIcon, fileSettingsIconName, fileShare2Icon, fileShare2IconName, fileShareIcon, fileShareIconName, fileZipIcon, fileZipIconName, filmStripIcon, filmStripIconName, filter2Icon, filter2IconName, filterGridCircleIcon, filterGridCircleIconName, filterGridCircleMiniIcon, filterGridCircleMiniIconName, filterGridIcon, filterGridIconName, filterGridMiniIcon, filterGridMiniIconName, filterIcon, filterIconName, filterOffIcon, filterOffIconName, firewallIcon, firewallIconName, firstAidIcon, firstAidIconName, fishIcon, fishIconName, flagIcon, flagIconName, flameIcon, flameIconName, flaskIcon, flaskIconName, floppyIcon, floppyIconName, folderIcon, folderIconName, folderOpenIcon, folderOpenIconName, fontSizeIcon, fontSizeIconName, forkingIcon, forkingIconName, formIcon, formIconName, fuelIcon, fuelIconName, gavelIcon, gavelIconName, gridChartIcon, gridChartIconName, gridViewIcon, gridViewIconName, halfStarIcon, halfStarIconName, happyFaceIcon, happyFaceIconName, hardDiskIcon, hardDiskIconName, hardDriveDisksIcon, hardDriveDisksIconName, hardDriveIcon, hardDriveIconName, hashtagIcon, hashtagIconName, headphonesIcon, headphonesIconName, heartBrokenIcon, heartBrokenIconName, heartIcon, heartIconName, heatMapIcon, heatMapIconName, helixIcon, helixIconName, helpIcon, helpIconName, helpInfoIcon, helpInfoIconName, highlighterIcon, highlighterIconName, historyIcon, historyIconName, homeIcon, homeIconName, hostGroupIcon, hostGroupIconName, hostIcon, hostIconName, hourglassIcon, hourglassIconName, idBadgeIcon, idBadgeIconName, imageGalleryIcon, imageGalleryIconName, imageIcon, imageIconName, importIcon, importIconName, inboxIcon, inboxIconName, indentIcon, indentIconName, inductorIcon, inductorIconName, infoCircleIcon, infoCircleIconName, infoCircleMiniIcon, infoCircleMiniIconName, infoStandardIcon, infoStandardIconName, installIcon, installIconName, internetOfThingsIcon, internetOfThingsIconName, italicIcon, italicIconName, justifyTextIcon, justifyTextIconName, keyIcon, keyIconName, keyboardIcon, keyboardIconName, landscapeIcon, landscapeIconName, languageIcon, languageIconName, launchpadIcon, launchpadIconName, layersIcon, layersIconName, libraryIcon, libraryIconName, lightbulbIcon, lightbulbIconName, lineChartIcon, lineChartIconName, linkIcon, linkIconName, listIcon, listIconName, loadChartIconSet, loadCommerceIconSet, loadCoreIconSet, loadEssentialIconSet, loadMediaIconSet, loadMiniIconSet, loadSocialIconSet, loadTechnologyIconSet, loadTextEditIconSet, loadTravelIconSet, lockIcon, lockIconName, loginIcon, loginIconName, logoutIcon, logoutIconName, mapIcon, mapIconName, mapMarkerIcon, mapMarkerIconName, mediaChangerIcon, mediaChangerIconName, mediaCollectionAliases, mediaCollectionIcons, memoryIcon, memoryIconName, microphoneIcon, microphoneIconName, microphoneMuteIcon, microphoneMuteIconName, miniCollectionAliases, miniCollectionIcons, minusCircleIcon, minusCircleIconName, minusIcon, minusIconName, mobileIcon, mobileIconName, moonIcon, moonIconName, mouseIcon, mouseIconName, musicNoteIcon, musicNoteIconName, namespaceIcon, namespaceIconName, networkGlobeIcon, networkGlobeIconName, networkSettingsIcon, networkSettingsIconName, networkSwitchIcon, networkSwitchIconName, neutralFaceIcon, neutralFaceIconName, newIcon, newIconName, noAccessIcon, noAccessIconName, noWifiIcon, noWifiIconName, nodeGroupIcon, nodeGroupIconName, nodeIcon, nodeIconName, nodesIcon, nodesIconName, noteIcon, noteIconName, numberListIcon, numberListIconName, nvmeIcon, nvmeIconName, objectsIcon, objectsIconName, onHolidayIcon, onHolidayIconName, organizationIcon, organizationIconName, outdentIcon, outdentIconName, paintRollerIcon, paintRollerIconName, paperclipIcon, paperclipIconName, pasteIcon, pasteIconName, pauseIcon, pauseIconName, pdfFileIcon, pdfFileIconName, pencilIcon, pencilIconName, pesoIcon, pesoIconName, phoneHandsetIcon, phoneHandsetIconName, pictureIcon, pictureIconName, pieChartIcon, pieChartIconName, piggyBankIcon, piggyBankIconName, pinIcon, pinIconName, pinboardIcon, pinboardIconName, playIcon, playIconName, pluginIcon, pluginIconName, plusCircleIcon, plusCircleIconName, plusIcon, plusIconName, podIcon, podIconName, popOutIcon, popOutIconName, portraitIcon, portraitIconName, poundIcon, poundIconName, powerIcon, powerIconName, printerIcon, printerIconName, processOnVmIcon, processOnVmIconName, qrCodeIcon, qrCodeIconName, rackServerIcon, rackServerIconName, radarIcon, radarIconName, recycleIcon, recycleIconName, redoIcon, redoIconName, refreshIcon, refreshIconName, renderIcon, repeatIcon, repeatIconName, replayAllIcon, replayAllIconName, replayOneIcon, replayOneIconName, resistorIcon, resistorIconName, resizeIcon, resizeIconName, resourcePoolIcon, resourcePoolIconName, rewindIcon, rewindIconName, routerIcon, routerIconName, rubleIcon, rubleIconName, rulerPencilIcon, rulerPencilIconName, rupeeIcon, rupeeIconName, sadFaceIcon, sadFaceIconName, scatterPlotIcon, scatterPlotIconName, scissorsIcon, scissorsIconName, scriptExecuteIcon, scriptExecuteIconName, scriptScheduleIcon, scriptScheduleIconName, scrollIcon, scrollIconName, searchIcon, searchIconName, shareIcon, shareIconName, shieldCheckIcon, shieldCheckIconName, shieldIcon, shieldIconName, shieldXIcon, shieldXIconName, shoppingBagIcon, shoppingBagIconName, shoppingCartIcon, shoppingCartIconName, shrinkIcon, shrinkIconName, shuffleIcon, shuffleIconName, sliderIcon, sliderIconName, snowflakeIcon, snowflakeIconName, socialCollectionAliases, socialCollectionIcons, sortByIcon, sortByIconName, squidIcon, squidIconName, ssdIcon, ssdIconName, starIcon, starIconName, stepForward2Icon, stepForward2IconName, stepForwardIcon, stepForwardIconName, stopIcon, stopIconName, storageAdapterIcon, storageAdapterIconName, storageIcon, storageIconName, storeIcon, storeIconName, strikethroughIcon, strikethroughIconName, subscriptIcon, subscriptIconName, successStandardIcon, successStandardIconName, sunIcon, sunIconName, superscriptIcon, superscriptIconName, switchIcon, switchIconName, syncIcon, syncIconName, tableIcon, tableIconName, tabletIcon, tabletIconName, tagIcon, tagIconName, tagsIcon, tagsIconName, talkBubblesIcon, talkBubblesIconName, tapeDriveIcon, tapeDriveIconName, targetIcon, targetIconName, tasksIcon, tasksIconName, technologyCollectionAliases, technologyCollectionIcons, terminalIcon, terminalIconName, textColorIcon, textColorIconName, textEditCollectionAliases, textEditCollectionIcons, textIcon, textIconName, thermometerIcon, thermometerIconName, thinClientIcon, thinClientIconName, thumbsDownIcon, thumbsDownIconName, thumbsUpIcon, thumbsUpIconName, tickChartIcon, tickChartIconName, timelineIcon, timelineIconName, timesCircleIcon, timesCircleIconName, timesIcon, timesIconName, timesMiniIcon, timesMiniIconName, toolsIcon, toolsIconName, trailerIcon, trailerIconName, trashIcon, trashIconName, travelCollectionAliases, travelCollectionIcons, treeIcon, treeIconName, treeViewIcon, treeViewIconName, truckIcon, truckIconName, twoWayArrowsIcon, twoWayArrowsIconName, unarchiveIcon, unarchiveIconName, underlineIcon, underlineIconName, undoIcon, undoIconName, uninstallIcon, uninstallIconName, unknownIcon, unknownIconName, unknownStatusIcon, unknownStatusIconName, unlinkIcon, unlinkIconName, unlockIcon, unlockIconName, unpinIcon, unpinIconName, updateIcon, updateIconName, uploadCloudIcon, uploadCloudIconName, uploadIcon, uploadIconName, usbIcon, usbIconName, userIcon, userIconName, usersIcon, usersIconName, videoCameraIcon, videoCameraIconName, videoGalleryIcon, videoGalleryIconName, viewCardsIcon, viewCardsIconName, viewColumnsIcon, viewColumnsIconName, viewListIcon, viewListIconName, vmBugIcon, vmBugIconName, vmBugInverseIcon, vmBugInverseIconName, vmIcon, vmIconName, vmwAppIcon, vmwAppIconName, volumeDownIcon, volumeDownIconName, volumeIcon, volumeIconName, volumeMuteIcon, volumeMuteIconName, volumeUpIcon, volumeUpIconName, walletIcon, walletIconName, wandIcon, wandIconName, warningMiniIcon, warningMiniIconName, warningStandardIcon, warningStandardIconName, wifiIcon, wifiIconName, windowCloseIcon, windowCloseIconName, windowMaxIcon, windowMaxIconName, windowMinIcon, windowMinIconName, windowRestoreIcon, windowRestoreIconName, wonIcon, wonIconName, worldIcon, worldIconName, wrenchIcon, wrenchIconName, xlsFileIcon, xlsFileIconName, yenIcon, yenIconName, zoomInIcon, zoomInIconName, zoomOutIcon, zoomOutIconName };
export type { Directions, IconAlias, IconRegistry, IconRegistrySources, IconShapeCollection, IconShapeSources, IconShapeTuple, Orientations, StatusTypes };
