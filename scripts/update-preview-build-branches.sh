# configure git
git config user.name "Clarity Update Bot"
git config user.email "noreply@github.com"

# fetch preview build branch remotes
git fetch origin preview-build/$GIT_BRANCH/clr-ui
git fetch origin preview-build/$GIT_BRANCH/clr-angular

# add worktrees
git worktree add --track -b preview-build/$GIT_BRANCH/clr-ui preview-build/$GIT_BRANCH/clr-ui origin/preview-build/$GIT_BRANCH/clr-ui
git worktree add --track -b preview-build/$GIT_BRANCH/clr-angular preview-build/$GIT_BRANCH/clr-angular origin/preview-build/$GIT_BRANCH/clr-angular

# delete old files
rm -rf ./preview-build/$GIT_BRANCH/clr-ui/*
rm -rf ./preview-build/$GIT_BRANCH/clr-angular/*

# copy new files
cp -r ./dist/clr-ui/* ./preview-build/$GIT_BRANCH/clr-ui
cp -r ./dist/clr-angular/* ./preview-build/$GIT_BRANCH/clr-angular

# push @clr/ui
pushd ./preview-build/$GIT_BRANCH/clr-ui
git add .
git commit -m "update build for commit $GIT_COMMIT_SHA"
git push origin preview-build/$GIT_BRANCH/clr-ui:preview-build/$GIT_BRANCH/clr-ui
popd

# push @clr/angular
pushd ./preview-build/$GIT_BRANCH/clr-angular
git add .
git commit -m "update build for commit $GIT_COMMIT_SHA"
git push origin preview-build/$GIT_BRANCH/clr-angular:preview-build/$GIT_BRANCH/clr-angular
popd
