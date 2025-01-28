#!/bin/bash

BD_ACCESS_TOKEN=$1
NEXT_RELEASE_VERSION=$2
BD_RELEASE_PHASE=$3

bash <(curl -k -s -L https://detect.blackduck.com/detect10.sh) \
  --blackduck.url="https://broadcom.app.blackduck.com/" \
  --blackduck.api.token="$BD_ACCESS_TOKEN" \
  --detect.project.name="vcf-clarity" \
  --detect.project.version.name="17.6" \
  --detect.project.version.update=true \
  --detect.project.version.phase="$BD_RELEASE_PHASE" \
  --detect.project.version.license="MIT License" \
  --detect.project.version.distribution=OPENSOURCE \
  --detect.source.path="./dist" \
  --detect.tools=DETECTOR \
  --detect.detector.search.depth=3 \
  --detect.detector.search.continue=true \
  --detect.wait.for.results=true \
  --detect.included.detector.types=npm \
  --detect.required.detector.types=npm \
  --detect.npm.arguments="--prod --depth=3" \
  --detect.npm.dependency.types.excluded=DEV
