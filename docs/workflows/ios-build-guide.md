# iOS Unsigned IPA Build Guide

## Overview

This workflow builds an unsigned iOS `.ipa` artifact that you download, sign on your
local machine, and install on test devices. It does not configure App Store, TestFlight,
notarization, or code signing.

## Triggering the Build

1. Go to the **Actions** tab in GitHub
2. Select the **Build iOS Unsigned IPA** workflow
3. Click **Run workflow**
4. Configure inputs (all optional):
   - **profile**: Release (default) or Debug
   - **node_version**: Node.js version (default: 20)
   - **scheme**: leave empty for auto-detect (defaults to "tripX")
   - **clean**: clean prebuild (default: false) — set true for a fresh native project

## Download the Artifact

1. After the run completes, open the run page and scroll to the **Artifacts** section
2. Download `tripX-unsigned-ipa-<run-number>.zip`
3. Extract it to get `tripX-unsigned.ipa`

## Local Signing (Before Installation)

The IPA is unsigned. To install on a device, re-sign it first:

```bash
# Option 1: re-sign the embedded .app with your development certificate
codesign --force --sign "Apple Development: Your Name" tripX-unsigned.ipa

# Option 2: use a tool that handles signing + install
ios-deploy --bundle tripX-unsigned.ipa
```

## Troubleshooting

### Scheme not found
The build fails fast and prints the available schemes. Re-run with the `scheme`
input set to one of those names.

### Build takes too long
- Keep `clean: false` (default) so CocoaPods cache is reused
- Confirm the "Cache CocoaPods" step reports a cache hit on repeat runs

### Build failed
Download the `xcodebuild-logs-<run-number>` artifact for the full xcodebuild log.

### Archive empty
- Confirm `expo prebuild` succeeded (see the "Verify prebuild success" step)
- Check the iOS directory debug output for the generated workspace/project
