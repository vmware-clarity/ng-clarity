/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { administratorIcon } from '../shapes/administrator';
import { animationIcon } from '../shapes/animation';
import { applicationIcon } from '../shapes/application';
import { applicationsIcon } from '../shapes/applications';
import { archiveIcon } from '../shapes/archive';
import { assignUserIcon } from '../shapes/assign-user';
import { atomIcon } from '../shapes/atom';
import { backupIcon } from '../shapes/backup';
import { backupRestoreIcon } from '../shapes/backup-restore';
import { barCodeIcon } from '../shapes/bar-code';
import { batteryIcon } from '../shapes/battery';
import { blockIcon } from '../shapes/block';
import { blocksGroupIcon } from '../shapes/blocks-group';
import { bluetoothIcon } from '../shapes/bluetooth';
import { bluetoothOffIcon } from '../shapes/bluetooth-off';
import { buildingIcon } from '../shapes/building';
import { bundleIcon } from '../shapes/bundle';
import { capacitorIcon } from '../shapes/capacitor';
import { cdDvdIcon } from '../shapes/cd-dvd';
import { certificateIcon, certificateIconName } from '../shapes/certificate';
import { ciCdIcon } from '../shapes/ci-cd';
import { cloudNetworkIcon } from '../shapes/cloud-network';
import { cloudScaleIcon } from '../shapes/cloud-scale';
import { cloudTrafficIcon } from '../shapes/cloud-traffic';
import { clusterIcon } from '../shapes/cluster';
import { codeIcon } from '../shapes/code';
import { computerIcon } from '../shapes/computer';
import { connectIcon } from '../shapes/connect';
import { containerIcon } from '../shapes/container';
import { containerGroupIcon } from '../shapes/container-group';
import { containerVolumeIcon } from '../shapes/container-volume';
import { controlLunIcon } from '../shapes/control-lun';
import { cpuIcon } from '../shapes/cpu';
import { dashboardIcon } from '../shapes/dashboard';
import { dataClusterIcon } from '../shapes/data-cluster';
import { deployIcon } from '../shapes/deploy';
import { devicesIcon } from '../shapes/devices';
import { digitalSignatureIcon } from '../shapes/digital-signature';
import { disconnectIcon } from '../shapes/disconnect';
import { displayIcon } from '../shapes/display';
import { downloadCloudIcon } from '../shapes/download-cloud';
import { exportIcon } from '../shapes/export';
import { fileShareIcon, fileShareIconName } from '../shapes/file-share';
import { fileShare2Icon } from '../shapes/file-share-2';
import { flaskIcon } from '../shapes/flask';
import { floppyIcon } from '../shapes/floppy';
import { forkingIcon } from '../shapes/forking';
import { hardDiskIcon } from '../shapes/hard-disk';
import { hardDriveIcon } from '../shapes/hard-drive';
import { hardDriveDisksIcon } from '../shapes/hard-drive-disks';
import { helixIcon, helixIconName } from '../shapes/helix';
import { hostIcon, hostIconName } from '../shapes/host';
import { hostGroupIcon } from '../shapes/host-group';
import { importIcon } from '../shapes/import';
import { inductorIcon } from '../shapes/inductor';
import { installIcon } from '../shapes/install';
import { internetOfThingsIcon } from '../shapes/internet-of-things';
import { keyboardIcon } from '../shapes/keyboard';
import { layersIcon } from '../shapes/layers';
import { linkIcon } from '../shapes/link';
import { mediaChangerIcon } from '../shapes/media-changer';
import { memoryIcon } from '../shapes/memory';
import { mobileIcon, mobileIconName } from '../shapes/mobile';
import { mouseIcon } from '../shapes/mouse';
import { namespaceIcon } from '../shapes/namespace';
import { networkGlobeIcon } from '../shapes/network-globe';
import { networkSettingsIcon } from '../shapes/network-settings';
import { networkSwitchIcon } from '../shapes/network-switch';
import { noWifiIcon, noWifiIconName } from '../shapes/no-wifi';
import { nodeIcon } from '../shapes/node';
import { nodeGroupIcon } from '../shapes/node-group';
import { nodesIcon } from '../shapes/nodes';
import { nvmeIcon } from '../shapes/nvme';
import { pdfFileIcon } from '../shapes/pdf-file';
import { phoneHandsetIcon, phoneHandsetIconName } from '../shapes/phone-handset';
import { pluginIcon } from '../shapes/plugin';
import { podIcon } from '../shapes/pod';
import { processOnVmIcon } from '../shapes/process-on-vm';
import { qrCodeIcon } from '../shapes/qr-code';
import { rackServerIcon } from '../shapes/rack-server';
import { radarIcon } from '../shapes/radar';
import { resistorIcon } from '../shapes/resistor';
import { resourcePoolIcon } from '../shapes/resource-pool';
import { routerIcon } from '../shapes/router';
import { rulerPencilIcon, rulerPencilIconName } from '../shapes/ruler-pencil';
import { scriptExecuteIcon } from '../shapes/script-execute';
import { scriptScheduleIcon } from '../shapes/script-schedule';
import { shieldIcon } from '../shapes/shield';
import { shieldCheckIcon } from '../shapes/shield-check';
import { shieldXIcon } from '../shapes/shield-x';
import { squidIcon } from '../shapes/squid';
import { ssdIcon } from '../shapes/ssd';
import { storageIcon } from '../shapes/storage';
import { storageAdapterIcon } from '../shapes/storage-adapter';
import { tabletIcon } from '../shapes/tablet';
import { tapeDriveIcon } from '../shapes/tape-drive';
import { terminalIcon, terminalIconName } from '../shapes/terminal';
import { thinClientIcon } from '../shapes/thin-client';
import { unarchiveIcon } from '../shapes/unarchive';
import { uninstallIcon } from '../shapes/uninstall';
import { unlinkIcon } from '../shapes/unlink';
import { updateIcon } from '../shapes/update';
import { uploadCloudIcon } from '../shapes/upload-cloud';
import { usbIcon } from '../shapes/usb';
import { vmIcon } from '../shapes/vm';
import { vmwAppIcon } from '../shapes/vmw-app';
import { wifiIcon } from '../shapes/wifi';
import { xlsFileIcon } from '../shapes/xls-file';

export const technologyCollectionIcons: IconShapeTuple[] = [
  administratorIcon,
  animationIcon,
  applicationIcon,
  applicationsIcon,
  archiveIcon,
  assignUserIcon,
  atomIcon,
  backupIcon,
  backupRestoreIcon,
  barCodeIcon,
  batteryIcon,
  blockIcon,
  blocksGroupIcon,
  bluetoothIcon,
  bluetoothOffIcon,
  buildingIcon,
  bundleIcon,
  capacitorIcon,
  cdDvdIcon,
  certificateIcon,
  ciCdIcon,
  cloudNetworkIcon,
  cloudScaleIcon,
  cloudTrafficIcon,
  clusterIcon,
  codeIcon,
  computerIcon,
  connectIcon,
  containerIcon,
  containerGroupIcon,
  containerVolumeIcon,
  controlLunIcon,
  cpuIcon,
  dashboardIcon,
  dataClusterIcon,
  deployIcon,
  devicesIcon,
  digitalSignatureIcon,
  disconnectIcon,
  displayIcon,
  downloadCloudIcon,
  exportIcon,
  fileShareIcon,
  fileShare2Icon,
  flaskIcon,
  floppyIcon,
  forkingIcon,
  hardDriveIcon,
  hardDriveDisksIcon,
  hardDiskIcon,
  helixIcon,
  hostIcon,
  hostGroupIcon,
  importIcon,
  inductorIcon,
  installIcon,
  internetOfThingsIcon,
  keyboardIcon,
  layersIcon,
  linkIcon,
  mediaChangerIcon,
  memoryIcon,
  mobileIcon,
  mouseIcon,
  namespaceIcon,
  networkGlobeIcon,
  networkSettingsIcon,
  networkSwitchIcon,
  nodeGroupIcon,
  nodeIcon,
  nodesIcon,
  noWifiIcon,
  nvmeIcon,
  pdfFileIcon,
  phoneHandsetIcon,
  pluginIcon,
  podIcon,
  processOnVmIcon,
  qrCodeIcon,
  rackServerIcon,
  radarIcon,
  resistorIcon,
  resourcePoolIcon,
  routerIcon,
  rulerPencilIcon,
  scriptExecuteIcon,
  scriptScheduleIcon,
  shieldIcon,
  shieldCheckIcon,
  shieldXIcon,
  squidIcon,
  ssdIcon,
  storageIcon,
  storageAdapterIcon,
  tabletIcon,
  tapeDriveIcon,
  terminalIcon,
  thinClientIcon,
  unarchiveIcon,
  uninstallIcon,
  unlinkIcon,
  updateIcon,
  uploadCloudIcon,
  usbIcon,
  vmIcon,
  vmwAppIcon,
  wifiIcon,
  xlsFileIcon,
];

export const technologyCollectionAliases: IconAlias[] = [
  [hostIconName, ['server']],
  [terminalIconName, ['command']],
  [mobileIconName, ['mobile-phone']],
  [certificateIconName, ['license']],
  [noWifiIconName, ['disconnected']],
  [phoneHandsetIconName, ['receiver']],
  [rulerPencilIconName, ['design']],
  [helixIconName, ['dna']],
  [fileShareIconName, ['folder-share']],
];

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
export function loadTechnologyIconSet() {
  ClarityIcons.addIcons(...technologyCollectionIcons);
  ClarityIcons.addAliases(...technologyCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [administratorIconName]: string;
//     [animationIconName]: string;
//     [applicationIconName]: string;
//     [applicationsIconName]: string;
//     [archiveIconName]: string;
//     [assignUserIconName]: string;
//     [atomIconName]: string;
//     [backupIconName]: string;
//     [backupRestoreIconName]: string;
//     [barCodeIconName]: string;
//     [batteryIconName]: string;
//     [blockIconName]: string;
//     [blocksGroupIconName]: string;
//     [bluetoothIconName]: string;
//     [bluetoothOffIconName]: string;
//     [buildingIconName]: string;
//     [bundleIconName]: string;
//     [capacitorIconName]: string;
//     [cdDvdIconName]: string;
//     [certificateIconName]: string;
//     [ciCdIconName]: string;
//     [cloudNetworkIconName]: string;
//     [cloudScaleIconName]: string;
//     [cloudTrafficIconName]: string;
//     [clusterIconName]: string;
//     [codeIconName]: string;
//     [computerIconName]: string;
//     [connectIconName]: string;
//     [containerIconName]: string;
//     [containerGroupIconName]: string;
//     [containerVolumeIconName]: string;
//     [controlLunIconName]: string;
//     [cpuIconName]: string;
//     [dashboardIconName]: string;
//     [dataClusterIconName]: string;
//     [deployIconName]: string;
//     [devicesIconName]: string;
//     [digitalSignatureIconName]: string;
//     [disconnectIconName]: string;
//     [displayIconName]: string;
//     [downloadCloudIconName]: string;
//     [exportIconName]: string;
//     [fileShareIconName]: string;
//     [fileShare2IconName]: string;
//     [flaskIconName]: string;
//     [floppyIconName]: string;
//     [forkingIconName]: string;
//     [hardDriveIconName]: string;
//     [hardDriveDisksIconName]: string;
//     [hardDiskIconName]: string;
//     [helixIconName]: string;
//     [hostIconName]: string;
//     [hostGroupIconName]: string;
//     [importIconName]: string;
//     [inductorIconName]: string;
//     [installIconName]: string;
//     [internetOfThingsIconName]: string;
//     [keyboardIconName]: string;
//     [layersIconName]: string;
//     [linkIconName]: string;
//     [mediaChangerIconName]: string;
//     [memoryIconName]: string;
//     [mobileIconName]: string;
//     [mouseIconName]: string;
//     [namespaceIconName]: string;
//     [networkGlobeIconName]: string;
//     [networkSettingsIconName]: string;
//     [networkSwitchIconName]: string;
//     [nodeGroupIconName]: string;
//     [nodeIconName]: string;
//     [nodesIconName]: string;
//     [noWifiIconName]: string;
//     [nvmeIconName]: string;
//     [pdfFileIconName]: string;
//     [phoneHandsetIconName]: string;
//     [pluginIconName]: string;
//     [podIconName]: string;
//     [processOnVmIconName]: string;
//     [qrCodeIconName]: string;
//     [rackServerIconName]: string;
//     [radarIconName]: string;
//     [resistorIconName]: string;
//     [resourcePoolIconName]: string;
//     [routerIconName]: string;
//     [rulerPencilIconName]: string;
//     [scriptExecuteIconName]: string;
//     [scriptScheduleIconName]: string;
//     [shieldIconName]: string;
//     [shieldCheckIconName]: string;
//     [shieldXIconName]: string;
//     [squidIconName]: string;
//     [ssdIconName]: string;
//     [storageIconName]: string;
//     [storageAdapterIconName]: string;
//     [tabletIconName]: string;
//     [tapeDriveIconName]: string;
//     [terminalIconName]: string;
//     [thinClientIconName]: string;
//     [unarchiveIconName]: string;
//     [uninstallIconName]: string;
//     [unlinkIconName]: string;
//     [updateIconName]: string;
//     [uploadCloudIconName]: string;
//     [usbIconName]: string;
//     [vmIconName]: string;
//     [vmwAppIconName]: string;
//     [wifiIconName]: string;
//     [xlsFileIconName]: string;
//   }
// }
