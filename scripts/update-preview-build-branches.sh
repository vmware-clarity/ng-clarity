# configure git
git config user.name "Clarity Update Bot"
git config user.email "noreply@github.com"

# fetch preview build branch remotes
git fetch origin preview-build/$GIT_BRANCH/clr-ui
git fetch origin preview-build/$GIT_BRANCH/clr-angular

# add worktrees
git worktree add --track -b preview-build-clr-ui preview-build-clr-ui origin/preview-build/$GIT_BRANCH/clr-ui || git worktree add --orphan preview-build-clr-ui
git worktree add --track -b preview-build-clr-angular preview-build-clr-angular origin/preview-build/$GIT_BRANCH/clr-angular || git worktree add --orphan preview-build-clr-angular

# delete old files
rm -rf ./preview-build-clr-ui/*
rm -rf ./preview-build-clr-angular/*

# copy new files
cp -r ./dist/clr-ui/* ./preview-build-clr-ui
cp -r ./dist/clr-angular/* ./preview-build-clr-angular

bump_and_push () {
  local dir="$1"        # worktree directory
  local remote_ref="$2" # remote ref to push to

  pushd "$dir"

  if [ ! -f package.json ]; then
    echo "ERROR: ${dir}/package.json not found. Ensure your dist includes package.json." >&2
    popd
    return 1
  fi

  # Ensure analyzer has a commit to evaluate
  git commit --allow-empty -m "build(preview): trigger version bump for ${GIT_COMMIT_SHA}"

  # Write version into package.json (no tags, no publish) using preview config
  PREVIEW_BRANCH="$(git rev-parse --abbrev-ref HEAD)" \
  npx semantic-release --no-ci --extends ../.releaserc.preview.js

  node -e "console.log('preview version in ${dir}:', require('./package.json').version)"

  # Commit artifacts + updated package.json in a single commit
  git add .
  git commit -m "build: preview build for ${GIT_COMMIT_SHA}" || true

  # Push to preview branch
  git push origin "HEAD:${remote_ref}"

  popd
}

# --- run for both packages ---
bump_and_push "preview-build-clr-ui" "refs/heads/preview-build/${GIT_BRANCH}/clr-ui"
bump_and_push "preview-build-clr-angular" "refs/heads/preview-build/${GIT_BRANCH}/clr-angular"