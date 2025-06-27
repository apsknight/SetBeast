# SetBeast 🏋️‍♂️

A professional workout timer app built with React Native and Expo, designed specifically for gym workouts with customizable rest intervals.

## 🚀 **Status: Ready for Download!**
- **Android APK**: ✅ Available now
- **Version**: 1.0.0 (First Release)
- **Build**: Tested and ready for gym use
- **iOS**: Coming soon via TestFlight

## Features

### 🎯 Core Functionality
- **Customizable Rest Intervals**: 1, 1.5, 2, 3, or 4 minutes
- **Live Interval Adjustment**: Change rest times mid-workout
- **Synchronized Timers**: Workout time and interval countdown in perfect sync
- **Smart Pause Logic**: Pause rest timer while workout time continues

### 🔊 Audio & Notifications
- **Custom Beep Sound**: Uses your own beep.mp3 file
- **Volume Control**: Adjustable beep volume (10-100%)
- **Music Friendly**: Plays alongside your music without interrupting
- **Haptic Feedback**: Optional vibration notifications
- **Gym Optimized**: Works through earphones, plays in silent mode

### 📱 Visual Design
- **Circular Progress**: Animated SVG circle that decreases as time passes
- **Color Coding**: Orange → Red when ≤10 seconds remaining
- **Pulse Animation**: Timer pulses during final 10 seconds
- **Dark Theme**: Easy on the eyes in gym lighting
- **Clean Interface**: Distraction-free design for workouts

### ⚙️ Smart Features
- **Persistent Settings**: Your preferences are saved
- **Set Tracking**: Automatic set counting
- **Workout Duration**: Total time spent working out
- **Mid-Workout Changes**: Adjust intervals without stopping
- **Professional UI**: Intuitive controls and feedback

## Screenshots

*Coming soon - add screenshots of your app in action*

## Installation

### 📱 **Get SetBeast on Your Phone**

#### **Android (Available Now!)**
- **[Download APK](https://expo.dev/accounts/apsknight/projects/setbeast/builds/dbbbdc23-6ac5-46d8-b2e9-64e626da9d40)** - Ready to install!
- **[Installation Guide](INSTALL.md)** - Step-by-step instructions
- **Version**: 1.0.0 - First release

#### **iOS (Coming Soon)**
- **TestFlight Beta** - Join the beta program
- **App Store** - Full release planned

### 🛠️ **Developer Installation**

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/SetBeast.git
cd SetBeast

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Custom Beep Sound
1. Add your `beep.mp3` file to the `assets/` directory
2. The app will automatically use your custom sound
3. Adjust volume in settings to your preference

## Usage

### Starting a Workout
1. **Set Rest Interval**: Choose your preferred rest time (default: 1.5 minutes)
2. **Start Workout**: Tap the "Start Workout" button
3. **Track Progress**: Watch the circular timer and workout duration
4. **Complete Sets**: Timer automatically resets after each interval

### During Workout
- **Pause/Resume**: Pause rest timer (workout time continues)
- **Change Intervals**: Tap different interval buttons for next rest period
- **Monitor Progress**: See total sets completed and workout duration
- **Audio Cues**: Hear beep when each rest period ends

### Settings
- **Test Beep**: Try your custom sound
- **Volume Control**: Adjust beep volume
- **Vibration**: Toggle haptic feedback
- **Intervals**: Customize available time options

## Technical Details

### Built With
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native SVG**: Smooth circular progress animations
- **Expo AV**: Audio playback system
- **AsyncStorage**: Settings persistence

### Architecture
- **Context API**: Global workout state management
- **Custom Hooks**: Reusable workout logic
- **Component-Based**: Modular, maintainable code
- **Synchronized Timers**: Single source of truth for time updates

## Distribution

### 🚀 **For Developers**
- **[Distribution Guide](DISTRIBUTION.md)** - Complete build and release process
- **[EAS Build Setup](eas.json)** - Production-ready build configuration
- **[GitHub Actions](.github/workflows/)** - Automated CI/CD pipelines

### 📦 **Build Commands**
```bash
# Build Android APK (for direct distribution)
npm run build:android

# Build iOS (for TestFlight)
npm run build:ios

# Build both platforms
npm run build:all

# Production builds (for app stores)
npm run build:production
```

### 🏷️ **Release Process**
```bash
# Create new release
./scripts/release.sh 1.0.1

# This will:
# - Update version in app.json
# - Create git tag
# - Trigger automated builds
# - Generate GitHub release
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development
```bash
# Run on iOS
npx expo start --ios

# Run on Android  
npx expo start --android

# Run on web
npx expo start --web
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for serious gym enthusiasts who need reliable workout timing
- Designed with real gym usage patterns in mind
- Optimized for use with music and earphones

---

**SetBeast** - Because every beast needs perfect timing 🦁💪
