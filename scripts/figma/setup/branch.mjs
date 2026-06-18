/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Branch isolation helper for the push and preview controllers.
 *
 * When a branch name is supplied, either resolves it to a real Figma branch
 * file key (FIGMA_BRANCH_MODE=branch) or produces a collection-name suffix
 * (FIGMA_BRANCH_MODE=collection, the default). The dry-run and extract
 * controllers never call this function — they always derive the suffix directly
 * from the branch name without any network call.
 */

/**
 * Resolve the effective Figma file key and collection suffix for a run that
 * may target a Figma branch instead of the main file.
 *
 * @param {Object} params
 * @param {ReturnType<import('../api/figma-client.mjs').createFigmaClient>} params.figma
 * @param {string} params.figmaFileKey     Main Figma file key.
 * @param {string} params.figmaBranchMode  "branch" | "collection".
 * @param {string | undefined} params.branchName
 * @returns {Promise<{ effectiveFileKey: string, collectionSuffix: string }>}
 */
export async function resolveBranchIsolation({ figma, figmaFileKey, figmaBranchMode, branchName }) {
  if (!branchName) {
    return { effectiveFileKey: figmaFileKey, collectionSuffix: '' };
  }

  if (figmaBranchMode === 'branch') {
    const branches = await figma.getBranches(figmaFileKey);
    const branch = branches.branches?.find(b => b.name.toLowerCase().includes(branchName.toLowerCase()));
    if (branch) {
      console.log(`🌿  Targeting Figma branch: ${branch.name} (${branch.key})`);
      return { effectiveFileKey: branch.key, collectionSuffix: '' };
    }
    console.warn(`⚠️   No Figma branch found matching "${branchName}". Using collection suffix instead.`);
  }

  return { effectiveFileKey: figmaFileKey, collectionSuffix: ` [${branchName}]` };
}
