<!--
  DESIGN.md - AI Agent Design System Manifest
  
  What is this file?
  DESIGN.md is an open-source format specification released by Google Labs (April 2026) for describing visual design systems to coding agents. It serves as an executable runtime manifest that bridges the gap between human design intent and AI code generation.

  Why was it chosen?
  As AI coding agents (like Cursor, Copilot, and Gemini) take on more UI development, they need a deterministic way to understand brand identity, layout rules, and accessibility constraints. Without this file, AI models hallucinate component choices and hardcode arbitrary CSS. This file acts as a "UX Product Manager" for the AI, ensuring any generated UI aligns perfectly with the Clarity Design System.

  Who proposed and uses it?
  The format was open-sourced by Google Labs and is heavily inspired by the W3C Design Tokens Community Group (DTCG) JSON specification (supported by Adobe, Salesforce, Amazon, and Google Material Design). It is rapidly becoming the industry standard for AI-native engineering teams to maintain design consistency across code generation sessions.

  Resources & Specifications:
  - Google Labs Announcement: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
  - Google Labs DESIGN.md Spec: https://github.com/google-labs-code/design.md
  - W3C DTCG Format Spec: https://tr.designtokens.org/format/
  - W3C DTCG GitHub: https://github.com/design-tokens/community-group

  Structure:
  1. Deterministic System Layer (YAML Frontmatter): Machine-readable design tokens (colors, typography, spacing, component schemas) using W3C DTCG bracket syntax for cross-referencing.
  2. Semantic Reasoning Layer (Markdown Body): Human-readable design rationale explaining the "why" behind design decisions, accessibility rules, and DOs/DON'Ts.
-->

---
$schema: "https://tr.designtokens.org/format/"
global:
  space:
    0: { "$value": "calc(0 * {components.internal-scale-2})", "$type": "dimension" }
    1: { "$value": "calc(1 * {components.internal-scale-2})", "$type": "dimension" }
    2: { "$value": "calc(2 * {components.internal-scale-2})", "$type": "dimension" }
    3: { "$value": "calc(4 * {components.internal-scale-2})", "$type": "dimension" }
    4: { "$value": "calc(6 * {components.internal-scale-2})", "$type": "dimension" }
    5: { "$value": "calc(8 * {components.internal-scale-2})", "$type": "dimension" }
    6: { "$value": "calc(12 * {components.internal-scale-2})", "$type": "dimension" }
    7: { "$value": "calc(16 * {components.internal-scale-2})", "$type": "dimension" }
    9: { "$value": "calc(24 * {components.internal-scale-2})", "$type": "dimension" }
    10: { "$value": "calc(32 * {components.internal-scale-2})", "$type": "dimension" }
  color:
    white: { "$value": "hsl(0deg 0% 100%)", "$type": "color" }
    black: { "$value": "hsl(0deg 0% 0%)", "$type": "color" }
    construction:
      25: { "$value": "hsl(198deg 33% 99%)", "$type": "color" }
      50: { "$value": "hsl(198deg 36% 96%)", "$type": "color" }
      100: { "$value": "hsl(198deg 20% 91%)", "$type": "color" }
      200: { "$value": "hsl(198deg 14% 82%)", "$type": "color" }
      300: { "$value": "hsl(198deg 10% 71%)", "$type": "color" }
      400: { "$value": "hsl(198deg 9% 56%)", "$type": "color" }
      500: { "$value": "hsl(198deg 10% 46%)", "$type": "color" }
      600: { "$value": "hsl(198deg 14% 36%)", "$type": "color" }
      700: { "$value": "hsl(198deg 19% 28%)", "$type": "color" }
      800: { "$value": "hsl(198deg 23% 23%)", "$type": "color" }
      900: { "$value": "hsl(198deg 28% 18%)", "$type": "color" }
      1000: { "$value": "hsl(198deg 30% 15%)", "$type": "color" }
    cool:
      gray:
        1000: { "$value": "hsl(211deg 63% 14%)", "$type": "color" }
    azure:
      900: { "$value": "hsl(211deg 100% 18%)", "$type": "color" }
    gray:
      0: { "$value": "hsl(0deg 0% 100%)", "$type": "color" }
      700: { "$value": "hsl(0deg 0% 40%)", "$type": "color" }
    red:
      700: { "$value": "hsl(9deg 100% 44%)", "$type": "color" }
      800: { "$value": "hsl(9deg 100% 38%)", "$type": "color" }
    violet:
      700: { "$value": "hsl(283deg 80% 36%)", "$type": "color" }
      1000: { "$value": "hsl(282deg 100% 14%)", "$type": "color" }
    blue:
      50: { "$value": "hsl(198deg 100% 95%)", "$type": "color" }
      75: { "$value": "hsl(198deg 100% 94%)", "$type": "color" }
      700: { "$value": "hsl(198deg 100% 34%)", "$type": "color" }
      800: { "$value": "hsl(198deg 100% 27%)", "$type": "color" }
      900: { "$value": "hsl(198deg 100% 21%)", "$type": "color" }
    ochre:
      500: { "$value": "hsl(40deg 100% 59%)", "$type": "color" }
      800: { "$value": "hsl(37deg 100% 32%)", "$type": "color" }
    green:
      50: { "$value": "hsl(93deg 80% 94%)", "$type": "color" }
      700: { "$value": "hsl(93deg 80% 28%)", "$type": "color" }
  base: { "$value": "20", "$type": "string" }
alias:
  object:
    interaction:
      outline: { "$value": "Highlight auto 2px", "$type": "dimension" }
      background: { "$value": "{global.color-white}", "$type": "string" }
      color: { "$value": "{global.color-construction-700}", "$type": "duration" }
      border:
        color: { "$value": "{global.color-construction-500}", "$type": "duration" }
    container:
      background: { "$value": "{global.color-white}", "$type": "string" }
    border:
      color: { "$value": "{global.color-construction-200}", "$type": "duration" }
      width:
        100: { "$value": "calc(1 * (1rem / {global.base}))", "$type": "dimension" }
        200: { "$value": "calc(2 * (1rem / {global.base}))", "$type": "dimension" }
      radius:
        100: { "$value": "calc(4 * (1rem / {global.base}))", "$type": "dimension" }
        300: { "$value": "50%", "$type": "dimension" }
    opacity:
      0: { "$value": "hsl(0deg 0% 0% / 0%)", "$type": "color" }
    overlay:
      backdrop:
        background: { "$value": "hsl(0deg 0% 0% / 60%)", "$type": "color" }
      background: { "$value": "{global.color-white}", "$type": "string" }
    app:
      background: { "$value": "{global.color-construction-25}", "$type": "duration" }
  status:
    neutral: { "$value": "{global.color-construction-600}", "$type": "duration" }
    success: { "$value": "{global.color-green-700}", "$type": "string" }
    info: { "$value": "{global.color-blue-700}", "$type": "string" }
    warning: { "$value": "{global.color-ochre-500}", "$type": "string" }
    danger: { "$value": "{global.color-red-700}", "$type": "string" }
    disabled: { "$value": "{global.color-construction-300}", "$type": "duration" }
  typography:
    color:
      100: { "$value": "{global.color-white}", "$type": "string" }
      300: { "$value": "{global.color-construction-800}", "$type": "duration" }
      400: { "$value": "{global.color-construction-900}", "$type": "duration" }
      450: { "$value": "{global.color-construction-1000}", "$type": "duration" }
      500: { "$value": "{global.color-black}", "$type": "string" }
    secondary:
      font:
        size: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
        weight: { "$value": "400", "$type": "fontFamily" }
    disabled: { "$value": "{global.color-construction-500}", "$type": "duration" }
    font:
      weight:
        semibold: { "$value": "600", "$type": "fontFamily" }
        medium: { "$value": "500", "$type": "fontFamily" }
        regular: { "$value": "400", "$type": "fontFamily" }
        light: { "$value": "300", "$type": "fontFamily" }
        bold: { "$value": "600", "$type": "fontFamily" }
        extrabold: { "$value": "600", "$type": "fontFamily" }
    section:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
    link:
      color: { "$value": "{global.color-blue-800}", "$type": "string" }
    subsection:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
    body:
      font:
        weight: { "$value": "400", "$type": "fontFamily" }
    display:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
    headline:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
    title:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
    message:
      font:
        weight: { "$value": "calc(400 * (1rem / {global.base}))", "$type": "dimension" }
    caption:
      font:
        weight: { "$value": "400", "$type": "fontFamily" }
    smallcaption:
      font:
        weight: { "$value": "500", "$type": "fontFamily" }
  utility:
    gray: { "$value": "{global.color-construction-600}", "$type": "duration" }
    blue: { "$value": "{global.color-blue-700}", "$type": "string" }
    green: { "$value": "{global.color-green-700}", "$type": "string" }
    yellow: { "$value": "{global.color-ochre-500}", "$type": "string" }
components:
  accordion:
    textColor: { "$value": "{components.collapsible-panel-text-color}", "$type": "duration" }
    textColorHover: { "$value": "{components.collapsible-panel-text-color-hover}", "$type": "duration" }
    textColorActive: { "$value": "{components.collapsible-panel-text-color-active}", "$type": "duration" }
    panelDisabledColor: { "$value": "{components.collapsible-panel-panel-disabled-color}", "$type": "duration" }
    contentBackgroundColor: { "$value": "{components.collapsible-panel-content-background-color}", "$type": "duration" }
    contentColor: { "$value": "{components.collapsible-panel-content-color}", "$type": "duration" }
    headerBackgroundColor: { "$value": "{components.collapsible-panel-header-background-color}", "$type": "duration" }
    headerDisabledBackgroundColor: { "$value": "{components.collapsible-panel-header-disabled-background-color}", "$type": "duration" }
    headerHoverBackgroundColor: { "$value": "{components.collapsible-panel-header-hover-background-color}", "$type": "duration" }
    headerActiveBackgroundColor: { "$value": "{components.collapsible-panel-header-active-background-color}", "$type": "duration" }
    headerOpenBackgroundColor: { "$value": "{components.collapsible-panel-header-open-background-color}", "$type": "duration" }
    borderColor: { "$value": "{components.collapsible-panel-border-color}", "$type": "duration" }
    borderRadius: { "$value": "{components.collapsible-panel-border-radius}", "$type": "dimension" }
  btn:
    groupFocusOutline: { "$value": "{alias.object-interaction-outline}", "$type": "duration" }
    verticalMargin: { "$value": "#{density.$clr-base-vertical-offset-s}", "$type": "color" }
    horizontalMargin: { "$value": "#{density.$clr-base-gap-m}", "$type": "color" }
    horizontalPadding: { "$value": "#{density.$clr-base-horizontal-offset-l}", "$type": "color" }
    verticalPadding: { "$value": "0", "$type": "dimension" }
    padding: { "$value": "{components.btn-vertical-padding} {components.btn-horizontal-padding}", "$type": "dimension" }
    gap: { "$value": "#{density.$clr-base-gap-s}", "$type": "color" }
    height: { "$value": "#{density.$clr-base-row-height-m}", "$type": "color" }
    heightSm: { "$value": "#{density.$clr-base-row-height-s}", "$type": "color" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    borderWidth: { "$value": "{global.space-1}", "$type": "dimension" }
    appearanceStandardHeight: { "$value": "{components.btn-height-sm}", "$type": "dimension" }
    appearanceStandardPadding: { "$value": "{components.btn-padding}", "$type": "dimension" }
    appearanceStandardIconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    appearanceFormHeight: { "$value": "{components.btn-height}", "$type": "dimension" }
  toggle:
    bgColorOff: { "$value": "{alias.status-neutral}", "$type": "duration" }
    bgColorOn: { "$value": "{alias.status-success}", "$type": "duration" }
    handleBgColor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
    handleBorderColor: { "$value": "{components.toggle-bg-color-off}", "$type": "duration" }
    handleBorderColorOn: { "$value": "{components.toggle-bg-color-on}", "$type": "duration" }
    disabledDefaultBorderColor: { "$value": "{alias.object-interaction-color-disabled}", "$type": "duration" }
    disabledDefaultHandleColor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
    disabledOffBorderColor: { "$value": "{components.toggle-disabled-default-border-color}", "$type": "duration" }
    disabledOffBgColor: { "$value": "{components.toggle-disabled-default-handle-color}", "$type": "duration" }
    disabledOffHandleBorderColor: { "$value": "{components.toggle-disabled-default-border-color}", "$type": "duration" }
    disabledOnBorderColor: { "$value": "{components.toggle-disabled-default-border-color}", "$type": "duration" }
    disabledOnBgColor: { "$value": "{components.toggle-disabled-default-border-color}", "$type": "duration" }
    disabledOnHandleBorderColor: { "$value": "{components.toggle-disabled-default-border-color}", "$type": "duration" }
  collapsible:
    panelBorderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    panelTitleMinWidth: { "$value": "#{density.$clr-base-layout-space-4xl}", "$type": "color" }
    panelTextColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    panelTextColorHover: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    panelTextColorActive: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    panelPanelDisabledColor: { "$value": "{alias.object-interaction-color-disabled}", "$type": "duration" }
    panelContentBackgroundColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    panelContentColor: { "$value": "{alias.typography-color-450}", "$type": "duration" }
    panelHeaderBackgroundColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    panelHeaderDisabledBackgroundColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    panelHeaderHoverBackgroundColor: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    panelHeaderActiveBackgroundColor: { "$value": "{alias.object-interaction-background-active}", "$type": "duration" }
    panelHeaderOpenBackgroundColor: { "$value": "{alias.object-interaction-background-selected}", "$type": "duration" }
    panelBorderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
  table:
    borderwidth: { "$value": "{alias.object-border-width-100}", "$type": "dimension" }
    noborderBorderwidth: { "$value": "{global.space-0}", "$type": "dimension" }
    compactCellHeight: { "$value": "{global.space-9}", "$type": "dimension" }
    compactRowHeight: { "$value": "calc({components.table-compact-cell-height} + {components.table-borderwidth})", "$type": "dimension" }
    compactVerticalPadding: { "$value": "{global.space-3}", "$type": "dimension" }
    compactHorizontalPadding: { "$value": "{global.space-6}", "$type": "dimension" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    cornercellradius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    cellHorizontalPadding: { "$value": "#{density.$clr-base-horizontal-offset-xl}", "$type": "color" }
    cellVerticalPadding: { "$value": "#{density.$clr-base-vertical-offset-multi-row-inline-m}", "$type": "color" }
    cellPadding: { "$value": "{components.table-cell-vertical-padding} {components.table-cell-horizontal-padding}", "$type": "dimension" }
    margin: { "$value": "#{density.$clr-base-vertical-offset-2xl} 0 0 0", "$type": "color" }
    fontsize: { "$value": "{alias.typography-secondary-font-size}", "$type": "dimension" }
    cellHeight: { "$value": "#{density.$clr-base-dg-row-height}", "$type": "color" }
    rowHeight: { "$value": "calc({components.table-cell-height} + {components.table-borderwidth})", "$type": "dimension" }
  thead:
    bgcolor: { "$value": "{alias.object-container-background-tint}", "$type": "duration" }
    color: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  tablerow:
    bordercolor: { "$value": "{alias.object-border-color}", "$type": "duration" }
  datagrid:
    columnSeparatorExpandby: { "$value": "{global.space-6}", "$type": "duration" }
    actionArrowSize: { "$value": "{global.space-4}", "$type": "dimension" }
    cellOutlineOffset: { "$value": "calc(-1 * {global.space-2})", "$type": "dimension" }
    compactMarginTop: { "$value": "{global.space-5}", "$type": "dimension" }
    compactActionBarOffset: { "$value": "#{mixins.baselinePx(20)}", "$type": "color" }
    marginTop: { "$value": "#{density.$clr-base-vertical-offset-l}", "$type": "color" }
    actionBarOffset: { "$value": "#{density.$clr-base-vertical-offset-2xl}", "$type": "color" }
    columnTogglePadding: { "$value": "0 #{density.$clr-base-horizontal-offset-m}", "$type": "color" }
    detailPaneCloseIconSize: { "$value": "#{density.$clr-base-icon-size-l}", "$type": "color" }
    filterToggleSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    footerPaginationGap: { "$value": "#{density.$clr-base-gap-m}", "$type": "color" }
    iconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    fontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    defaultBorderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    iconColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
  stack-view:
    borderWidth: { "$value": "{alias.object-border-width-100}", "$type": "dimension" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    borderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    titleColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    rowColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    rowBgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    expandableRowColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    expandableRowBgColor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
    expandableRowHover: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    expandableRowBgHover: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    expandableRowActive: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    expandableRowBgActive: { "$value": "{alias.object-interaction-background-active}", "$type": "duration" }
    expandedRowColor: { "$value": "{alias.object-interaction-color-selected}", "$type": "duration" }
    expandedRowBgColor: { "$value": "{alias.object-interaction-background-selected}", "$type": "duration" }
    expandedRowBgColorHover: { "$value": "{alias.object-interaction-background-selected-hover}", "$type": "duration" }
  stack:
    blockChangedBorderTopColor: { "$value": "{components.stack-view-border-color}", "$type": "duration" }
  tree:
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    nodeCaretColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    nodeCaretHoverColor: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    nodeCaretActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    nodeCaretDisabledColor: { "$value": "{alias.object-interaction-color-disabled}", "$type": "duration" }
    nodeContentTextOnlyColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    nodeContentColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    nodeContentBgColor: { "$value": "{alias.object-opacity-0}", "$type": "duration" }
    nodeContentHoverColor: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    nodeContentBgHoverColor: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    nodeContentActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    nodeContentBgActiveColor: { "$value": "{alias.object-interaction-background-active}", "$type": "duration" }
    nodeContentSelectedColor: { "$value": "{alias.object-interaction-color-selected}", "$type": "duration" }
    nodeContentBgSelectedColor: { "$value": "{alias.object-interaction-background-selected}", "$type": "duration" }
    nodeContentBgSelectedHoverColor: { "$value": "{alias.object-interaction-background-selected-hover}", "$type": "duration" }
  app:
    alertPagerWidth: { "$value": "#{mixins.baselinePx(144)}", "$type": "color" }
    levelAlertColor: { "$value": "{global.color-white}", "$type": "string" }
    alertCloseIconColor: { "$value": "{components.app-level-alert-color}", "$type": "duration" }
    alertInfoBgColor: { "$value": "{alias.status-info}", "$type": "duration" }
    alertInfoFontColor: { "$value": "{alias.typography-color-100}", "$type": "fontFamily" }
    alertInfoBorderColor: { "$value": "none", "$type": "color" }
    alertInfoIconColor: { "$value": "{components.app-alert-info-font-color}", "$type": "duration" }
    alertInfoActionColor: { "$value": "{components.app-alert-info-font-color}", "$type": "duration" }
    alertInfoActionActiveColor: { "$value": "{components.app-alert-info-font-color}", "$type": "duration" }
    alertInfoCloseIconColor: { "$value": "{components.app-alert-info-font-color}", "$type": "duration" }
    alertInfoCloseIconHoverColor: { "$value": "{components.app-alert-info-font-color}", "$type": "duration" }
    alertWarningBgColor: { "$value": "{alias.status-warning}", "$type": "duration" }
    alertWarningFontColor: { "$value": "{global.color-black}", "$type": "fontFamily" }
    alertWarningBorderColor: { "$value": "none", "$type": "color" }
    alertWarningIconColor: { "$value": "{components.app-alert-warning-font-color}", "$type": "duration" }
  alert:
    borderradius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    actionColor: { "$value": "{alias.typography-color-500}", "$type": "duration" }
    actionActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    closeIconColor: { "$value": "{components.alert-action-color}", "$type": "duration" }
    closeIconHoverColor: { "$value": "{components.alert-action-active-color}", "$type": "duration" }
    infoBgColor: { "$value": "{alias.status-info-tint}", "$type": "duration" }
    infoFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    infoBorderColor: { "$value": "{alias.status-info}", "$type": "duration" }
    infoIconColor: { "$value": "{components.alert-info-font-color}", "$type": "duration" }
    infoCloseIconColor: { "$value": "{components.alert-info-font-color}", "$type": "duration" }
    infoActionColor: { "$value": "{components.alert-info-font-color}", "$type": "duration" }
    infoActionActiveColor: { "$value": "{components.alert-action-active-color}", "$type": "duration" }
    infoCloseIconHoverColor: { "$value": "{components.alert-close-icon-hover-color}", "$type": "duration" }
    successBgColor: { "$value": "{alias.status-success-tint}", "$type": "duration" }
    successFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
  lightweight:
    alertInfoIconColor: { "$value": "{alias.status-info}", "$type": "duration" }
    alertInfoFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    alertWarningIconColor: { "$value": "{alias.status-warning-dark}", "$type": "duration" }
    alertWarningFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    alertDangerIconColor: { "$value": "{alias.status-danger}", "$type": "duration" }
    alertDangerFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    alertSuccessIconColor: { "$value": "{alias.status-success}", "$type": "duration" }
    alertSuccessFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    alertNeutralIconColor: { "$value": "{alias.status-neutral-shade}", "$type": "duration" }
    alertNeutralFontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
  badge:
    backgroundColor: { "$value": "{alias.utility-gray}", "$type": "duration" }
    borderColor: { "$value": "{alias.utility-gray}", "$type": "duration" }
    color: { "$value": "{alias.typography-color-100}", "$type": "duration" }
    outlineBgColor: { "$value": "{alias.utility-gray-tint}", "$type": "duration" }
    outlineBorderColor: { "$value": "{alias.utility-gray}", "$type": "duration" }
    outlineColor: { "$value": "{alias.typography-color-500}", "$type": "duration" }
    infoBgColor: { "$value": "{alias.utility-blue}", "$type": "duration" }
    infoBorderColor: { "$value": "{alias.utility-blue}", "$type": "duration" }
    infoColor: { "$value": "{alias.typography-color-100}", "$type": "duration" }
    successBgColor: { "$value": "{alias.utility-green}", "$type": "duration" }
    successBorderColor: { "$value": "{alias.utility-green}", "$type": "duration" }
    successColor: { "$value": "{alias.typography-color-100}", "$type": "duration" }
    warningBgColor: { "$value": "{alias.utility-yellow}", "$type": "duration" }
    warningBorderColor: { "$value": "{alias.utility-yellow}", "$type": "duration" }
    warningColor: { "$value": "{global.color-black}", "$type": "string" }
  label:
    borderWidth: { "$value": "{alias.object-border-width-100}", "$type": "dimension" }
    fontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    defaultBorderColor: { "$value": "{alias.utility-gray}", "$type": "duration" }
    defaultBgColor: { "$value": "{alias.object-opacity-0}", "$type": "duration" }
    fontSolidColor: { "$value": "{alias.typography-color-100}", "$type": "fontFamily" }
    defaultSolidBorderColor: { "$value": "{alias.utility-gray-shade}", "$type": "duration" }
    defaultSolidBgColor: { "$value": "{alias.utility-gray}", "$type": "duration" }
    bgHoverColor: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    hoverColor: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    bgActiveColor: { "$value": "{alias.object-interaction-background-active}", "$type": "duration" }
    activeColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    bgDisabledColor: { "$value": "{alias.object-interaction-background-disabled}", "$type": "duration" }
    disabledColor: { "$value": "{alias.typography-disabled}", "$type": "duration" }
    disabledBorderColor: { "$value": "{alias.status-disabled}", "$type": "duration" }
    grayBgColor: { "$value": "{alias.object-opacity-0}", "$type": "duration" }
  combobox:
    minWidth: { "$value": "#{mixins.baselinePx(168)}", "$type": "color" }
    multiMinWidth: { "$value": "#{mixins.baselinePx(360)}", "$type": "color" }
    fontWeight: { "$value": "{alias.typography-secondary-font-weight}", "$type": "fontFamily" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    triggerPaddingLeft: { "$value": "#{density.$clr-base-horizontal-offset-m}", "$type": "color" }
    triggerPaddingRight: { "$value": "#{density.$clr-base-horizontal-offset-m}", "$type": "color" }
    pillPadding: { "$value": "0 #{density.$clr-base-horizontal-offset-xs}", "$type": "color" }
    pillHeight: { "$value": "#{density.$clr-base-row-height-xs}", "$type": "color" }
    caretIconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    pillBorderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    borderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    inputBackgroundColor: { "$value": "{alias.object-container-background-tint}", "$type": "duration" }
    pillBackgroundColor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
    pillBorderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
  calendar:
    todayDateCellFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    pickerBtnFontWeight: { "$value": "{alias.typography-font-weight-medium}", "$type": "fontFamily" }
    weekdayFontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    pickerBtnFontSize: { "$value": "#{density.$clr-base-typography-font-size-section}", "$type": "color" }
    backgroundColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    borderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    optionTextColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    activeOptionBorderColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }
    rangeCellBackgroundColor: { "$value": "{alias.object-interaction-background-selected}", "$type": "duration" }
    btnColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    todayDateCellColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    todayDateCellBorderColor: { "$value": "{alias.object-interaction-border-color}", "$type": "duration" }
    activeCellBackgroundColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }
    activeFocusCellBackgroundColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }
    activeCellColor: { "$value": "{alias.typography-color-100}", "$type": "duration" }
  forms:
    baseline: { "$value": "{global.space-4}", "$type": "duration" }
    labelFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    checkboxHeight: { "$value": "{global.space-7}", "$type": "dimension" }
    iconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    inputGroupIconActionSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    checkboxBorderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    selectCaretSize: { "$value": "#{density.$clr-base-icon-size-xs}", "$type": "color" }
    textareaBorderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    datalistCaretIconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    inputPadding: { "$value": "0 #{density.$clr-base-horizontal-offset-m}", "$type": "color" }
    inputWrapperHeight: { "$value": "#{density.$clr-base-row-height-s}", "$type": "color" }
    rangeThumbHeight: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    rangeTrackHeight: { "$value": "#{density.$clr-base-layout-space-2xs}", "$type": "color" }
    rangeTrackBorderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    labelColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  form:
    disabledBackgroundColor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
  card:
    titleFontWeight: { "$value": "{alias.typography-section-font-weight}", "$type": "fontFamily" }
    borderWidth: { "$value": "{alias.object-border-width-100}", "$type": "dimension" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    bgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    dividerColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    titleColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    borderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    boxShadow: { "$value": "{alias.object-shadow-300}", "$type": "shadow" }
    clickableBorderColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }
    clickableBoxShadow: { "$value": "0 0 0 {global.space-1} {components.card-clickable-border-color}", "$type": "shadow" }
    headerTitleColor: { "$value": "{components.card-title-color}", "$type": "duration" }
    contentTitleColor: { "$value": "{components.card-title-color}", "$type": "duration" }
    textColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  login:
    titleColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    hintColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    footerGap: { "$value": "#{density.$clr-base-gap-l}", "$type": "color" }
    copyrightColor: { "$value": "{alias.typography-link-color}", "$type": "duration" }
    backgroundColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    welcomeColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    errorBackgroundColor: { "$value": "#{alert-variables.$clr-alert-danger-bg-color}", "$type": "color" }
    errorIconColor: { "$value": "#{alert-variables.$clr-alert-danger-icon-color}", "$type": "color" }
    logoColor: { "$value": "{global.color-white}", "$type": "string" }
  breadcrumb:
    itemSpace: { "$value": "#{density.$clr-base-gap-s}", "$type": "color" }
  header:
    titleFontWeight: { "$value": "{alias.typography-subsection-font-weight}", "$type": "fontFamily" }
    titleFontFamily: { "$value": "#{variables.$clr-font}", "$type": "color" }
    searchInputFontColor: { "$value": "{global.color-white}", "$type": "fontFamily" }
    searchPlaceholderFontWeight: { "$value": "{alias.typography-font-weight-regular}", "$type": "fontFamily" }
    searchPlaceholderTextColor: { "$value": "{global.color-construction-400}", "$type": "duration" }
    searchBorderActive: { "$value": "{alias.object-border-width-100} solid Highlight", "$type": "duration" }
    dividerColor: { "$value": "{global.color-construction-600}", "$type": "duration" }
    bgColor: { "$value": "{global.color-cool-gray-1000}", "$type": "string" }
    2BgColor: { "$value": "{global.color-construction-800}", "$type": "duration" }
    3BgColor: { "$value": "{global.color-azure-900}", "$type": "string" }
    fontColor: { "$value": "{global.color-construction-100}", "$type": "fontFamily" }
    fontColorHover: { "$value": "{global.color-construction-50}", "$type": "fontFamily" }
    height: { "$value": "#{density.$clr-base-header-height}", "$type": "color" }
    searchIconSize: { "$value": "#{density.$clr-base-icon-size-l}", "$type": "color" }
    searchMarginLeft: { "$value": "#{density.$clr-base-horizontal-offset-m}", "$type": "color" }
  link:
    activeColor: { "$value": "{alias.typography-link-color-active}", "$type": "duration" }
    color: { "$value": "{alias.typography-link-color}", "$type": "duration" }
    hoverColor: { "$value": "{alias.typography-link-color-hover}", "$type": "duration" }
    visitedColor: { "$value": "{alias.typography-link-color-visited}", "$type": "duration" }
    visitedColorHover: { "$value": "{alias.typography-link-color-visited-hover}", "$type": "duration" }
  responsive:
    navTriggerBorderRadius: { "$value": "{alias.object-border-radius-100}", "$type": "dimension" }
    navOverflowBorderRadius: { "$value": "{alias.object-border-radius-100}", "$type": "dimension" }
    navHamburgerBorderRadius: { "$value": "{alias.object-border-radius-100}", "$type": "dimension" }
    navTriggerBgColor: { "$value": "{global.color-gray-0}", "$type": "string" }
  sliding:
    panelTextColor: { "$value": "{global.color-gray-700}", "$type": "string" }
  subnav:
    bgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
  nav:
    boxShadowColor: { "$value": "{alias.object-border-color}", "$type": "shadow" }
    activeBgColor: { "$value": "{alias.object-interaction-background-active}", "$type": "duration" }
    selectedBgColor: { "$value": "{alias.object-opacity-0}", "$type": "duration" }
    hoverBgColor: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    selectedHoverBackgroundColor: { "$value": "{alias.object-interaction-background-selected-hover}", "$type": "duration" }
    selectedActiveBackgroundColor: { "$value": "{alias.object-interaction-background-selected-active}", "$type": "duration" }
    linkColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    linkActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
  vertical:
    navItemActiveFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    navItemTopLevelFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    navHeaderFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    navTriggerDividerBorderWidth: { "$value": "{global.space-1}", "$type": "dimension" }
    navIconSize: { "$value": "#{density.$clr-base-icon-size-s}", "$type": "color" }
    navIconRightMargin: { "$value": "#{density.$clr-base-horizontal-offset-s}", "$type": "color" }
    navCollapsedCaretSize: { "$value": "#{density.$clr-base-icon-size-2xl}", "$type": "color" }
    navItemHeight: { "$value": "#{density.$clr-base-row-height-m}", "$type": "color" }
    navMinWidth: { "$value": "#{density.$clr-base-layout-space-3xl}", "$type": "color" }
    navToggleButtonSize: { "$value": "#{density.$clr-base-row-height-m}", "$type": "color" }
    navDividerColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    navIconActiveColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    navItemColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    navItemActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    navSelectedBgColor: { "$value": "{alias.object-interaction-background-shade-selected}", "$type": "duration" }
  modal:
    smWidth: { "$value": "#{mixins.baselinePx(288)}", "$type": "color" }
    mdWidth: { "$value": "#{mixins.baselinePx(576)}", "$type": "color" }
    lgWidth: { "$value": "#{mixins.baselinePx(864)}", "$type": "color" }
    xlWidth: { "$value": "#{mixins.baselinePx(1152)}", "$type": "color" }
    titleFontFamily: { "$value": "#{variables.$clr-font}", "$type": "color" }
    titleFontWeight: { "$value": "{alias.typography-section-font-weight}", "$type": "fontFamily" }
    titleLetterSpacing: { "$value": "#{mixins.baselinePx(-0.2)}", "$type": "color" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    titleFontSize: { "$value": "#{density.$clr-base-typography-font-size-section}", "$type": "color" }
    titleLineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    closeColor: { "$value": "{components.close-color}", "$type": "duration" }
    bgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    contentBoxShadow: { "$value": "{alias.object-shadow-300}", "$type": "shadow" }
    backdropColor: { "$value": "{alias.object-overlay-backdrop-background}", "$type": "duration" }
    titleColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  dropdown:
    dividerBorderWidth: { "$value": "{global.space-1}", "$type": "dimension" }
    headerFontWeight: { "$value": "{alias.typography-font-weight-medium}", "$type": "fontFamily" }
    itemFontWeight: { "$value": "{alias.typography-secondary-font-weight}", "$type": "fontFamily" }
    activeTextColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    bgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    borderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    dividerColor: { "$value": "{alias.object-border-color-tint}", "$type": "duration" }
    childBorderColor: { "$value": "{alias.object-border-color}", "$type": "duration" }
    textColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    headerColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    itemColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    itemBgColor: { "$value": "transparent", "$type": "color" }
    itemHoverColor: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    itemHoverBgColor: { "$value": "{alias.object-interaction-background-hover}", "$type": "duration" }
    itemActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
  signpost:
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    pointerSize: { "$value": "#{density.$clr-base-layout-space-s}", "$type": "color" }
    contentColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    contentBgColor: { "$value": "{alias.object-container-background}", "$type": "duration" }
    contentBorderColor: { "$value": "{alias.object-interaction-border-color}", "$type": "duration" }
    actionColor: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    actionHoverColor: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    actionActiveColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    pointerBorder: { "$value": "{components.signpost-pointer-size} solid {components.signpost-content-border-color}", "$type": "duration" }
    pointerInvisibleBorder: { "$value": "{components.signpost-pointer-size} solid transparent", "$type": "duration" }
    pointerPseudoBorder: { "$value": "{components.signpost-pointer-size} solid {components.signpost-content-bg-color}", "$type": "duration" }
  tooltip:
    fontWeight: { "$value": "{alias.typography-body-font-weight}", "$type": "fontFamily" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    backgroundColor: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    color: { "$value": "{alias.typography-color-100}", "$type": "duration" }
  progress:
    defaultColor: { "$value": "{alias.status-info}", "$type": "duration" }
    altColor-1: { "$value": "{alias.status-success}", "$type": "duration" }
    altColor-2: { "$value": "{alias.status-danger-shade}", "$type": "duration" }
    altColor-3: { "$value": "{alias.status-warning}", "$type": "duration" }
    bgColor: { "$value": "{alias.object-container-background-shade}", "$type": "duration" }
    labelColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  spinner:
    insideButtonStrokeWidth: { "$value": "{alias.object-border-width-200}", "$type": "dimension" }
    insideTreeviewStrokeWidth: { "$value": "{alias.object-border-width-200}", "$type": "dimension" }
    borderRadius: { "$value": "{alias.object-border-radius-300}", "$type": "dimension" }
    defaultSize: { "$value": "#{density.$clr-base-spinner-l}", "$type": "color" }
    mediumSize: { "$value": "#{density.$clr-base-spinner-m}", "$type": "color" }
    smallSize: { "$value": "#{density.$clr-base-spinner-s}", "$type": "color" }
    defaultStrokeWidth: { "$value": "#{density.$clr-base-spinner-stroke-l}", "$type": "color" }
    mediumStrokeWidth: { "$value": "#{density.$clr-base-spinner-stroke-m}", "$type": "color" }
    smallStrokeWidth: { "$value": "#{density.$clr-base-spinner-stroke-s}", "$type": "color" }
    marginRight: { "$value": "#{density.$clr-base-horizontal-offset-l}", "$type": "color" }
    fillBgColor: { "$value": "{alias.object-container-background-shade}", "$type": "duration" }
    fillInverseBgColor: { "$value": "{alias.object-container-background-inverse-tint}", "$type": "duration" }
    fillColor: { "$value": "{alias.status-info}", "$type": "duration" }
    fillInverseColor: { "$value": "{alias.status-info-tint}", "$type": "duration" }
  stepper:
    errorColor: { "$value": "{alias.status-danger}", "$type": "duration" }
    completeColor: { "$value": "{alias.status-success}", "$type": "duration" }
  base:
    typographyFontSizeCaptionSmall: { "$value": "#{mixins.baselinePx(10)}", "$type": "color" }
    typographyFontSizeCaption: { "$value": "#{mixins.baselinePx(11)}", "$type": "color" }
    typographyFontSizeButton: { "$value": "{global.space-6}", "$type": "dimension" }
    typographyFontSizeInline: { "$value": "#{mixins.baselinePx(13)}", "$type": "color" }
    typographyFontSizeDefault: { "$value": "#{mixins.baselinePx(14)}", "$type": "color" }
    typographyFontSizeSubSection: { "$value": "{global.space-7}", "$type": "dimension" }
    typographyFontSizeSection: { "$value": "#{mixins.baselinePx(20)}", "$type": "color" }
    typographyFontSizeHeading: { "$value": "{global.space-9}", "$type": "dimension" }
    typographyFontSizeHeadline: { "$value": "{global.space-10}", "$type": "dimension" }
    typographyFontSizeDisplay: { "$value": "#{mixins.baselinePx(40)}", "$type": "color" }
    typographyLineHeight-12: { "$value": "{global.space-6}", "$type": "dimension" }
    typographyLineHeight-16: { "$value": "{global.space-7}", "$type": "dimension" }
    typographyLineHeight-20: { "$value": "#{mixins.baselinePx(20)}", "$type": "color" }
    typographyLineHeight-24: { "$value": "{global.space-9}", "$type": "dimension" }
    typographyLineHeight-32: { "$value": "{global.space-10}", "$type": "dimension" }
  basefont:
    size: { "$value": "#{variables.$clr-basefont-size}", "$type": "color" }
  global:
    borderradius: { "$value": "{alias.object-border-radius-100}", "$type": "dimension" }
    borderwidth: { "$value": "{alias.object-border-width-100}", "$type": "dimension" }
    appBackground: { "$value": "{alias.object-app-background}", "$type": "duration" }
    selectionColor: { "$value": "{alias.object-interaction-background-selected}", "$type": "duration" }
    onSelectionColor: { "$value": "{alias.object-interaction-color-selected}", "$type": "duration" }
    hoverColor: { "$value": "{alias.typography-link-color-hover}", "$type": "duration" }
    contentHeaderFontColor: { "$value": "{alias.typography-color-400}", "$type": "fontFamily" }
    fontColor: { "$value": "{alias.typography-color-500}", "$type": "fontFamily" }
    successColor: { "$value": "{alias.status-success}", "$type": "duration" }
    errorColor: { "$value": "{alias.status-danger}", "$type": "duration" }
  close:
    color: { "$value": "{alias.object-interaction-color}", "$type": "duration" }
    colorHover: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    colorActive: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
  popover:
    boxShadowColor: { "$value": "#{variables.$clr-popover-box-shadow-color}", "$type": "color" }
  grid:
    gutterWidth: { "$value": "#{density.$clr-base-horizontal-offset-2xl}", "$type": "color" }
    containerPadding: { "$value": "calc({components.grid-gutter-width} * 0.5)", "$type": "dimension" }
    columnPadding: { "$value": "calc({components.grid-gutter-width} * 0.5)", "$type": "dimension" }
    rowMargin: { "$value": "calc({components.grid-gutter-width} * -0.5)", "$type": "dimension" }
  metropolis:
    fontFamily: { "$value": "Metropolis, 'Avenir Next', 'Helvetica Neue', Arial, sans-serif", "$type": "fontFamily" }
  body:
    font: { "$value": "{components.metropolis-font-family}", "$type": "fontFamily" }
  display:
    font: { "$value": "{components.metropolis-font-family}", "$type": "fontFamily" }
  font:
    weightLight: { "$value": "{alias.typography-font-weight-light}", "$type": "fontWeight" }
    weightRegular: { "$value": "{alias.typography-font-weight-regular}", "$type": "fontWeight" }
    weightSemibold: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    weightBold: { "$value": "{alias.typography-font-weight-bold}", "$type": "fontWeight" }
    weightExtrabold: { "$value": "{alias.typography-font-weight-extrabold}", "$type": "fontWeight" }
  h1:
    fontWeight: { "$value": "{alias.typography-display-font-weight}", "$type": "fontFamily" }
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.5)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-display}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-44}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  h2:
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    fontWeight: { "$value": "{alias.typography-headline-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.4)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-headline}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-36}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  h3:
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    fontWeight: { "$value": "{alias.typography-title-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.2)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-heading}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-32}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  h4:
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    fontWeight: { "$value": "{alias.typography-section-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.2)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-section}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  h5:
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    fontWeight: { "$value": "{alias.typography-subsection-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.2)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-sub-section}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  h6:
    fontFamily: { "$value": "{components.display-font}", "$type": "fontFamily" }
    fontWeight: { "$value": "{alias.typography-message-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.2)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-sub-section}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-300}", "$type": "duration" }
  p0:
    fontWeight: { "$value": "{alias.typography-body-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-default}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-20}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p1:
    fontWeight: { "$value": "{alias.typography-body-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-default}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-20}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p2:
    fontWeight: { "$value": "{alias.typography-font-weight-medium}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p3:
    fontWeight: { "$value": "{alias.typography-secondary-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p4:
    fontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-20}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p5:
    fontWeight: { "$value": "{alias.typography-secondary-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(-0.1)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-inline}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-24}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p6:
    fontWeight: { "$value": "{alias.typography-caption-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(0.2)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-caption}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-16}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p7:
    fontWeight: { "$value": "{alias.typography-smallcaption-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(0.5)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-caption-small}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-12}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  p8:
    fontWeight: { "$value": "{alias.typography-smallcaption-font-weight}", "$type": "fontFamily" }
    letterSpacing: { "$value": "#{mixins.baselinePx(0.5)}", "$type": "color" }
    fontSize: { "$value": "#{density.$clr-base-typography-font-size-caption-small}", "$type": "color" }
    lineHeight: { "$value": "#{density.$clr-base-typography-line-height-12}", "$type": "color" }
    color: { "$value": "{alias.typography-color-450}", "$type": "duration" }
  list:
    itemColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
  timeline:
    stepTitleFontWeight: { "$value": "{alias.typography-font-weight-semibold}", "$type": "dimension" }
    iconSize: { "$value": "#{density.$clr-base-icon-size-3xl}", "$type": "color" }
    stepInternalSpacing: { "$value": "#{density.$clr-base-vertical-offset-l}", "$type": "color" }
    lineColor: { "$value": "{alias.object-interaction-border-color}", "$type": "duration" }
    stepHeaderColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    stepTitleColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    stepDescriptionColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    incompleteStepColor: { "$value": "{alias.object-interaction-border-color}", "$type": "duration" }
    currentStepColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }
    successStepColor: { "$value": "{alias.status-success}", "$type": "duration" }
    errorStepColor: { "$value": "{alias.status-danger}", "$type": "duration" }
  wizard:
    footerHeight: { "$value": "auto", "$type": "dimension" }
    footerVerticalSpace: { "$value": "#{density.$clr-base-vertical-offset-xl}", "$type": "color" }
    stepnavBorderSize: { "$value": "#{density.$clr-base-layout-space-2xs}", "$type": "color" }
    borderRadius: { "$value": "#{density.$clr-base-border-radius-s}", "$type": "color" }
    mainBgcolor: { "$value": "{alias.object-overlay-background}", "$type": "duration" }
    mainTextColor: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    stepnavBgcolor: { "$value": "{alias.object-interaction-background}", "$type": "duration" }
    stepnavText: { "$value": "{alias.typography-color-400}", "$type": "duration" }
    stepnavTextActive: { "$value": "{alias.object-interaction-color-active}", "$type": "duration" }
    stepnavTextHover: { "$value": "{alias.object-interaction-color-hover}", "$type": "duration" }
    stepnavTextSelected: { "$value": "{alias.object-interaction-color-selected}", "$type": "duration" }
    stepnavTextDisabled: { "$value": "{alias.typography-disabled}", "$type": "duration" }
    stepnavItemBorderColor: { "$value": "{alias.status-neutral-tint}", "$type": "duration" }
    stepnavItemCompleteBorderColor: { "$value": "{alias.status-success}", "$type": "duration" }
    stepnavSelectedBorderColor: { "$value": "{alias.object-interaction-background-highlight}", "$type": "duration" }

---

# Clarity Design System - Semantic Reasoning Layer

## Brand Voice & Aesthetic
Clarity's product design philosophy is rooted in enterprise utility, clinical data precision, and structure over decoration. 
- **Utility First:** The design system prioritizes functional, data-dense interfaces that allow users to accomplish complex tasks efficiently. Avoid whimsical animations or deeply saturated decorative gradients. Components should look like tools, not toys.
- **Data over Chrome:** The UI framework recedes to allow user data to take center stage. Chrome elements (headers, sidebars, footers) use muted surface tokens to frame the primary workspace.
- **Clinical Data Precision:** Interfaces must present data clearly without unnecessary visual noise.
- **Structure Over Decoration:** Visual hierarchy is established through typography, spacing, and strict layout grids rather than decorative elements. Colors are used purposefully to convey state and semantics.
- **Typography:** The primary font is Metropolis, designed for legibility in data-heavy environments.

## Layout & Density Rules
- **Grid System:** Clarity uses a 12-column responsive grid system based on a global base of 20px.
- **Density Modes:** Components support multiple density modes (e.g., compact, standard) to accommodate varying amounts of data.
- **Data Grids:** Datagrids must scale gracefully. In high-density scenarios, row heights and padding are reduced (e.g., `compact` mode) to maximize visible data without sacrificing readability.
- **Lists and Forms:** Forms and lists should maintain clear alignment. Inline forms are preferred over modals when you don't want to block users from performing other actions. Form labels must structurally align to inputs. In a vertical stack layout, labels sit directly above inputs with a `{global.space.2}` gap. In horizontal layouts, labels must align strictly right to cleanly hug the input boundary.
- **Spacing:** Use the defined spacing scale (`--cds-global-space-*`) consistently to create rhythm and separate logical groups of information.

## Theming & Semantic Roles
- **Light Theme:** The default theme relies on high-contrast black text (`{global.color.black}`) on white backgrounds (`{global.color.white}`). Semantic states use darker shades of colors (e.g., `{global.color.blue.800}` for info) to maintain contrast against light backgrounds.
- **Dark Theme:** In dark mode, semantic roles invert. Backgrounds shift to dark construction grays (`{global.color.construction.900}` and `{global.color.construction.1000}`), while text becomes white or light gray (`{global.color.construction.100}`). Links and semantic states use lighter tints (e.g., `{global.color.blue.400}` for info) to ensure legibility against dark backgrounds.

## Explicit Accessibility & Interaction Constraints
- **Universal Application:** These constraints apply to *all* components in the Clarity Design System repository (including Datagrid, Accordion, Alerts, Badges, Breadcrumbs, Buttons, Cards, Combobox, Dropdown, Forms, Labels, Modals, Progress, Signposts, Spinners, Stack Views, Steppers, Tables, Tabs, Timelines, Tooltips, Tree Views, and Wizards).
- **WCAG 2.1 AA Compliance:** All components must meet WCAG 2.1 AA standards for contrast and accessibility.
- **Unbroken Focus Management:** Strict enforcement of visible focus rings for keyboard navigation. Focus states must have a minimum contrast ratio of 3:1 against the adjacent background. Overriding `outline` without providing an identical semantic focus state is prohibited.
- **Keyboard Trapping & Context:** 
  - Overlays (Modals) must trap focus internally until closed.
  - Tree Views and Datagrids must support directional Arrow-Key roving tabindex arrays.
  - Combobox and Select dropdowns must open on `Enter` or `Space`, and close on `Escape`.
- **Keyboard Navigation:** All interactive elements must be accessible via keyboard (`Tab`, `Enter`, `Space`, `Arrow` keys).
- **ARIA Attributes:** Use `aria-live` regions for dynamic content changes. Applications must coordinate live announcements via a single `aria-live` region using tools like `@angular/cdk`'s `LiveAnnouncer`.
- **Form Autocomplete:** Always set the `autocomplete` attribute correctly on input fields to give web applications more control over how form fields are auto-completed by the browser.

## Design DO's and DON'Ts

The following rules are universal and must be adhered to when generating or modifying any UI component within the `ng-clarity` repository.

### General
- **DO** use strict borders and alternating row backgrounds for grid isolation.
- **DON'T** use drop shadows to separate data cells or create artificial depth within data-heavy components.
- **DON'T** manually hardcode hex codes or pixel values inside component SCSS (e.g., `margin-top: 15px`). Always bind to the global space tokens (`{global.space.*}`) and alias color tokens (`{alias.*}`) to ensure Dark Mode mapping is automatic and mathematically precise.
- **DO** use the defined semantic colors (info, success, warning, danger) strictly for their intended purposes.
- **DON'T** rely solely on color to convey meaning. Always pair color with text, icons, or patterns. Never decouple an icon from its color semantic (e.g., do not use a green checkmark icon in an info-blue alert).
- **DON'T** overload interfaces with too many colors; stick to the defined palette.

### Buttons & Actions
- **DO** use clear, action-oriented labels for buttons.
- **DON'T** use ambiguous, non-action-oriented descriptions that do not specify what users are accomplishing.
- **DO** ensure buttons have a minimum width (`--cds-global-space-14`) and truncate text with an ellipsis if it exceeds the maximum width.

### Alerts & Notifications
- **DO** use App-Level Alerts for critical system-wide issues.
- **DON'T** add too many App-Level Alerts at once; they can overwhelm the user.
- **DO** coordinate live announcements for alerts via a single `aria-live` region.

### Forms, Inputs & Selects
- **DO** use labels for all form inputs.
- **DON'T** put icons inside the input field unless absolutely necessary. If you do, account for the changing form value space.
- **DO** set the `autocomplete` attribute on input containers (`clr-date-container`, `clr-password-container`, `clr-input-container`).
- **DO** use a Select box (`<select clrSelect>`) for a list of items that a user does not need to see until they view the drop down list.
- **DO** use a Datalist element when you have more than 13 options that the user will need to filter or narrow down before making a choice.
- **DO** use a Select box when you have 3-13 options.
- **DON'T** confuse a Datalist element with the Select input.
- **DON'T** place critical, unreadable system data inside disabled form elements. Disabled states must inherit `{theme.light.alias.color.interaction.disabled}`.

### Signposts & Tooltips
- **DON'T** insert actionable components (like buttons) inside signposts, with the exception of text or image links.
- **DON'T** rely on signposts as a primary method of displaying additional information just to save space.
- **DO** configure Dropdowns and Signposts with boundary-collision detection in Angular so they automatically flip axis if they approach the browser edge.
- **DON'T** use Tooltips for critical transactional information; reserve Tooltips solely for non-essential supplementary context or Datagrid text truncation.

### Multi-step Workflows, Steppers & Wizards
- **DON'T** force users to quit the process midway if they might lose their work. Provide clear navigation and save states.
- **DO** disable step navigation items while validation is running to prevent errors.
- **DON'T** use ambiguous non-action oriented descriptions for stepper steps that do not specify what users are accomplishing.

### Tables & Datagrids
- **DO** use expandable rows when you have additional information for a row, or row cells that do not need to be shown at all times.
- **DON'T** use row selection (`[clrDgRowSelection]`) if your row contains any type of clickable elements.
