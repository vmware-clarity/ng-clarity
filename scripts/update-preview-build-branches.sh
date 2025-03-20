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

# push @clr/ui
pushd ./preview-build-clr-ui
git add .
git commit -m "update build for commit $GIT_COMMIT_SHA"
git push origin preview-build-clr-ui:refs/heads/preview-build/$GIT_BRANCH/clr-ui
popd

# push @clr/angular
pushd ./preview-build-clr-angular
git add .
git commit -m "update build for commit $GIT_COMMIT_SHA"
git push origin preview-build-clr-angular:refs/heads/preview-build/$GIT_BRANCH/clr-angular
popd
