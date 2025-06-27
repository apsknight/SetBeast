# 📱 SetBeast Distribution Guide

This guide covers how to build and distribute the SetBeast workout timer app for Android and iOS.

## 🚀 Quick Start

### Prerequisites
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

## 📦 Building the App

### Android APK (for testing/sideloading)
```bash
# Build APK for direct installation
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

### iOS App (TestFlight/App Store)
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

### Build Both Platforms
```bash
# Build for all platforms
eas build --platform all --profile preview
```

## 🤖 Automated Builds (GitHub Actions)

### Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **"Build APK"** workflow
3. Click **"Run workflow"**
4. Wait for build completion
5. Download from EAS dashboard

### Automatic Builds
- **Push to main**: Triggers Android APK build
- **Create tag**: Triggers full release build
- **Manual dispatch**: Build specific platform

## 📲 Distribution Methods

### 1. Direct APK Distribution
**Best for**: Beta testing, personal use, gym buddies

```bash
# Build APK
eas build --platform android --profile preview

# Share the download link from EAS dashboard
# Users can install directly on Android
```

**Pros**: 
- ✅ Immediate distribution
- ✅ No store approval needed
- ✅ Perfect for gym community

**Cons**: 
- ❌ Android only
- ❌ Users need to enable "Unknown sources"

### 2. GitHub Releases
**Best for**: Open source distribution, version tracking

1. **Create a tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Automatic release** created with:
   - APK download link
   - Release notes
   - Installation instructions

### 3. TestFlight (iOS)
**Best for**: iOS beta testing

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

### 4. App Stores (Production)
**Best for**: Wide distribution, monetization

#### Google Play Store
```bash
# Build AAB
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

#### Apple App Store
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

## 🔧 Build Profiles Explained

### `preview` Profile
- **Android**: Builds APK (direct install)
- **iOS**: Builds for TestFlight
- **Use for**: Testing, beta distribution

### `production` Profile  
- **Android**: Builds AAB (Play Store)
- **iOS**: Builds for App Store
- **Use for**: Store submission

### `development` Profile
- **Both**: Development builds with debugging
- **Use for**: Local development only

## 📋 Pre-Distribution Checklist

### Before Building:
- [ ] Update version in `app.json`
- [ ] Test on physical devices
- [ ] Verify beep sound works
- [ ] Check all timer functions
- [ ] Test pause/resume logic
- [ ] Verify settings persistence

### Before Store Submission:
- [ ] Create app store listings
- [ ] Prepare screenshots
- [ ] Write app descriptions
- [ ] Set up app store accounts
- [ ] Review store guidelines

## 🎯 Recommended Distribution Strategy

### Phase 1: Beta Testing
1. **Build APK** for Android users
2. **Share via GitHub releases**
3. **Collect feedback** from gym community
4. **Iterate based on feedback**

### Phase 2: TestFlight
1. **Build iOS version**
2. **Submit to TestFlight**
3. **Invite iOS beta testers**
4. **Refine based on iOS feedback**

### Phase 3: Store Launch
1. **Polish app based on beta feedback**
2. **Create store assets** (screenshots, descriptions)
3. **Submit to both stores**
4. **Launch marketing campaign**

## 🔐 Required Secrets

Add these to GitHub repository secrets:

```
EXPO_TOKEN=your_expo_access_token
```

Get your token from: https://expo.dev/accounts/[username]/settings/access-tokens

## 📱 Installation Instructions for Users

### Android (APK)
1. Download APK from GitHub releases
2. Enable "Install unknown apps" in Android settings
3. Install the APK file
4. Add your custom beep.mp3 to the app

### iOS (TestFlight)
1. Install TestFlight app from App Store
2. Use invitation link provided
3. Install SetBeast from TestFlight
4. Provide feedback through TestFlight

## 🆘 Troubleshooting

### Build Failures
- Check EAS dashboard for detailed logs
- Verify all dependencies are compatible
- Ensure app.json configuration is correct

### Distribution Issues
- Verify signing certificates are valid
- Check app store guidelines compliance
- Ensure all required metadata is provided

## 📞 Support

For distribution help:
- **GitHub Issues**: Technical problems
- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **Expo Discord**: Community support

---

**Ready to get SetBeast into the hands of gym enthusiasts worldwide!** 🏋️‍♂️💪
