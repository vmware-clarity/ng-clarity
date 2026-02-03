#!/bin/bash

NEXT_RELEASE_VERSION=$1
BD_ACCESS_TOKEN=$2
BD_RELEASE_PHASE=$3

bash <(curl -k -s -L https://detect.blackduck.com/detect10.sh) \
  --blackduck.url="https://broadcom.app.blackduck.com/" \
  --blackduck.api.token="$BD_ACCESS_TOKEN" \
  --detect.project.name="vcf-clarity" \
  --detect.project.version.name="$NEXT_RELEASE_VERSION" \
  --detect.project.version.update=true \
  --detect.project.version.phase="$BD_RELEASE_PHASE" \
  --detect.project.version.license="MIT License" \
  --detect.project.version.distribution=OPENSOURCE \
  --detect.tools=DETECTOR \
  --detect.wait.for.results=true \
  --detect.included.detector.types=npm \
  --detect.required.detector.types=npm \
  --detect.npm.dependency.types.excluded=DEV
