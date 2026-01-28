#!/bin/bash

# CleverTap Flutter SDK Version Update Script
# Usage: ./update-version.sh <flutter_version> <android_version> [release_date]

set -e

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <flutter_version> <android_version> [release_date]"
    echo "Example: $0 3.7.0 7.7.0 '23 January 2026'"
    exit 1
fi

FLUTTER_VERSION=$1
ANDROID_VERSION=$2
RELEASE_DATE=${3:-$(date +'%-d %B %Y')}

# Validate version format
if ! [[ $FLUTTER_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid Flutter version format. Use X.Y.Z"
    exit 1
fi

if ! [[ $ANDROID_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid Android version format. Use X.Y.Z"
    exit 1
fi

# Generate changelog text
ANDROID_VERSION_NO_DOTS=$(echo $ANDROID_VERSION | tr -d '.')
CHANGELOG_TEXT="Supports [CleverTap Android SDK v${ANDROID_VERSION}](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-${ANDROID_VERSION_NO_DOTS})."

echo "Updating CleverTap Flutter SDK..."
echo "  Flutter Version: $FLUTTER_VERSION"
echo "  Android SDK Version: $ANDROID_VERSION"
echo "  Release Date: $RELEASE_DATE"
echo ""

# Run Claude Code with task file
claude-code --task .claude/update_version.md \
    --param flutter_version="$FLUTTER_VERSION" \
    --param android_sdk_version="$ANDROID_VERSION" \
    --param changelog_text="$CHANGELOG_TEXT" \
    --param release_date="$RELEASE_DATE"

echo ""
echo "✓ Update complete!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test: flutter pub get"
echo "  3. Commit: git commit -am 'chore: bump version to $FLUTTER_VERSION'"
