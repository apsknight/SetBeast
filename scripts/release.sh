#!/bin/bash

# SetBeast Release Script
# Usage: ./scripts/release.sh [version] [platform]
# Example: ./scripts/release.sh 1.0.1 android

set -e

VERSION=${1:-"1.0.0"}
PLATFORM=${2:-"all"}

echo "🏋️‍♂️ SetBeast Release Script"
echo "=========================="
echo "Version: $VERSION"
echo "Platform: $PLATFORM"
echo ""

# Update version in app.json
echo "📝 Updating version in app.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" app.json

# Commit version update
echo "📦 Committing version update..."
git add app.json
git commit -m "chore: bump version to $VERSION" || echo "No changes to commit"

# Create and push tag
echo "🏷️ Creating release tag..."
git tag "v$VERSION"
git push origin "v$VERSION"

echo ""
echo "✅ Release v$VERSION created!"
echo ""
echo "🚀 Next steps:"
echo "1. Check GitHub Actions for automated builds"
echo "2. Download builds from EAS dashboard"
echo "3. Test on physical devices"
echo "4. Create GitHub release with APK"
echo ""
echo "📱 Build commands:"
echo "  Android APK: npm run build:android"
echo "  iOS Build:   npm run build:ios"
echo "  Both:        npm run build:all"
echo ""
echo "🔗 Useful links:"
echo "  EAS Dashboard: https://expo.dev/accounts/apsknight/projects/setbeast/builds"
echo "  GitHub Actions: https://github.com/apsknight/SetBeast/actions"
echo "  Releases: https://github.com/apsknight/SetBeast/releases"
